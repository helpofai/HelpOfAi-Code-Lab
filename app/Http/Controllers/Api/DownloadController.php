<?php

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
