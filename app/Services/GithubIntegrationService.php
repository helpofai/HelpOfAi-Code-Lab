<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GithubIntegrationService
{
    /**
     * Fetch repository metadata (latest commit, files tree) using GitHub API
     */
    public function getRepoMetadata(string $repoUrl, ?string $token = null)
    {
        $url = rtrim($repoUrl, '/');
        $pathParts = explode('github.com/', $url);
        if (count($pathParts) < 2) return null;
        
        $repoPath = trim($pathParts[1], '/');

        $request = Http::withHeaders([
            'Accept' => 'application/vnd.github.v3+json',
        ])->timeout(10);

        if ($token) {
            $request->withToken($token);
        }

        // Fetch latest commit on main branch
        $commitResponse = $request->get("https://api.github.com/repos/{$repoPath}/commits/main");
        
        if (!$commitResponse->successful()) {
            // Try master
            $commitResponse = $request->get("https://api.github.com/repos/{$repoPath}/commits/master");
        }

        if (!$commitResponse->successful()) {
            return null;
        }

        $commitData = $commitResponse->json();
        $latestCommitHash = $commitData['sha'] ?? null;
        $treeUrl = $commitData['commit']['tree']['url'] ?? null;

        // Fetch recursive tree to get all file paths
        $treeData = [];
        if ($treeUrl) {
            $treeResponse = $request->get($treeUrl . '?recursive=1');
            if ($treeResponse->successful()) {
                $treeData = $treeResponse->json()['tree'] ?? [];
            }
        }

        // Find .md files and important JSON files
        $markdownFiles = [];
        $packageJson = null;

        foreach ($treeData as $file) {
            if ($file['type'] === 'blob') {
                if (str_ends_with($file['path'], '.md')) {
                    $markdownFiles[] = $file['path'];
                }
                if ($file['path'] === 'package.json' || $file['path'] === 'composer.json') {
                    $packageJson = $file['path'];
                }
            }
        }

        return [
            'latest_commit' => $latestCommitHash,
            'commit_message' => $commitData['commit']['message'] ?? '',
            'commit_date' => $commitData['commit']['author']['date'] ?? '',
            'markdown_files' => $markdownFiles,
            'manifest_file' => $packageJson
        ];
    }
}
