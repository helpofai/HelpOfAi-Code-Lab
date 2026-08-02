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

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Services\GitHubService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DownloadController extends Controller
{
    /**
     * Download the purchased project source code directly from GitHub.
     */
    public function downloadProject(Request $request, $purchaseId, GitHubService $githubService)
    {
        $user = Auth::user();
        
        $purchase = Purchase::with('project')->where('id', $purchaseId)->where('user_id', $user->id)->first();

        if (!$purchase || $purchase->status !== 'completed') {
            return response()->json(['message' => 'Unauthorized or incomplete purchase.'], 403);
        }

        $project = $purchase->project;

        if (empty($project->github_repo_url)) {
            // It's a Monaco Editor (HTML/CSS/JS) project
            if (is_array($project->code) && !empty($project->code)) {
                $filename = \Illuminate\Support\Str::slug($project->title) . '-source.zip';
                $tempFile = tempnam(sys_get_temp_dir(), 'project_');
                $zip = new \ZipArchive();
                
                if ($zip->open($tempFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === TRUE) {
                    $html = $project->code['html'] ?? '';
                    $css = $project->code['css'] ?? '';
                    $js = $project->code['js'] ?? '';
                    
                    $fullHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>{$project->title}</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n{$html}\n<script src=\"script.js\"></script>\n</body>\n</html>";
                    
                    $zip->addFromString('index.html', $fullHtml);
                    $zip->addFromString('style.css', $css);
                    $zip->addFromString('script.js', $js);
                    $zip->close();

                    return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
                }
            }
            return response()->json(['message' => 'Source code repository not configured for this project.'], 404);
        }

        $filename = \Illuminate\Support\Str::slug($project->title) . '-source.zip';
        
        // Find a valid GitHub connection for this vendor
        $githubConnection = $project->user->vendorConnections()
            ->where('provider', 'github')
            ->where('is_valid', true)
            ->first();

        $vendorToken = null;
        if ($githubConnection) {
            $vendorToken = $githubConnection->token;
        } elseif ($project->user->github_token) {
            $vendorToken = $project->user->github_token;
        }

        // We will pass the token to the service. If it's null, the service will fall back to the .env GITHUB_TOKEN.
        
        // Streams the zip directly from the vendor's private repo to the buyer.
        // We default to 'main' branch, but you could add a column in projects table if they use 'master'.
        return $githubService->streamRepoZipToBrowser($project->github_repo_url, 'main', $filename, $vendorToken);
    }
}
