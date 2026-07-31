<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GitHubService
{
    protected string $token;

    public function __construct()
    {
        // This token needs 'repo' scope to access private repositories.
        // The vendor must invite your Platform GitHub Account to their private repo, 
        // OR you allow vendors to store their own PAT in the database.
        $this->token = config('services.github.token', env('GITHUB_TOKEN'));
    }

    /**
     * Streams the entire repository as a ZIP file (zipball) directly to the client browser.
     * This avoids loading 100MB+ files into your server's RAM.
     */
    public function streamRepoZipToBrowser(string $repoUrl, string $branch = 'main', string $filename = 'project.zip', ?string $vendorToken = null)
    {
        $repoPath = str_replace('https://github.com/', '', $repoUrl);
        $repoPath = rtrim($repoPath, '/');

        // GitHub API endpoint for downloading the entire repo source code as a ZIP
        $zipUrl = "https://api.github.com/repos/{$repoPath}/zipball/{$branch}";

        $token = $vendorToken ?? $this->token;

        return response()->streamDownload(function () use ($zipUrl, $token) {
            $headers = [
                'User-Agent' => 'HOA-Asset-Server',
                'Accept' => 'application/vnd.github.v3+json',
            ];
            
            if (!empty($token)) {
                $headers['Authorization'] = 'Bearer ' . $token;
            }

            // We use Guzzle streaming to avoid memory limits and catch errors BEFORE sending invalid zips
            try {
                $response = Http::withHeaders($headers)
                    ->withOptions(['stream' => true, 'allow_redirects' => true])
                    ->get($zipUrl);

                if ($response->failed()) {
                    echo "Error: Failed to fetch repository from GitHub.\n";
                    echo "HTTP Status: " . $response->status() . "\n";
                    echo "Please check if your GitHub Token is set in .env (GITHUB_TOKEN) and has access to the repo.\n";
                    echo "Response: " . $response->body();
                    return;
                }

                $stream = $response->toPsrResponse()->getBody();
                while (!$stream->eof()) {
                    echo $stream->read(8192);
                }
            } catch (\Exception $e) {
                echo "Exception occurred during download: " . $e->getMessage();
            }
        }, $filename);
    }
}
