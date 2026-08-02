<?php

/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GitHubService
{
    protected ?string $token;

    public function __construct()
    {
        // This token needs 'repo' scope to access private repositories.
        // The vendor must invite your Platform GitHub Account to their private repo, 
        // OR you allow vendors to store their own PAT in the database.
        $this->token = config('services.github.token', env('GITHUB_TOKEN', ''));
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

        $headers = [
            'User-Agent' => 'HOA-Asset-Server',
            'Accept' => 'application/vnd.github.v3+json',
        ];
        
        if (!empty($token)) {
            $headers['Authorization'] = 'Bearer ' . $token;
        }

        try {
            $response = Http::withHeaders($headers)
                ->withOptions(['stream' => true, 'allow_redirects' => true])
                ->get($zipUrl);

            if ($response->failed()) {
                Log::error("GitHub Zip Download failed", ['status' => $response->status(), 'url' => $zipUrl]);
                return response()->json(['message' => 'Failed to fetch repository from GitHub. Ensure the repository exists and the token is valid.'], $response->status());
            }

            return response()->streamDownload(function () use ($response) {
                $stream = $response->toPsrResponse()->getBody();
                while (!$stream->eof()) {
                    echo $stream->read(8192);
                }
            }, $filename);

        } catch (\Exception $e) {
            Log::error("GitHub Zip Download exception", ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Exception occurred during download.'], 500);
        }
    }
}
