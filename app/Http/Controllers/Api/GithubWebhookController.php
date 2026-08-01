<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Project;

class GithubWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // 1. Verify Signature (Prevent Forgery)
        // Note: vendors would configure their repos with this secret
        $secret = config('services.github.webhook_secret', 'hoacodelab_secret_key');
        
        $signature = $request->header('X-Hub-Signature-256');
        if (!$signature) {
            return response()->json(['message' => 'Missing signature'], 403);
        }

        $hash = 'sha256=' . hash_hmac('sha256', $request->getContent(), $secret);
        if (!hash_equals($hash, $signature)) {
            Log::warning('GitHub Webhook: Invalid signature detected.');
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // 2. Process the Payload (only care about 'push' events)
        $event = $request->header('X-GitHub-Event');
        if ($event !== 'push') {
            return response()->json(['message' => 'Ignored event type'], 200);
        }

        $payload = $request->all();
        $repoUrl = $payload['repository']['html_url'] ?? null;
        $latestCommitHash = $payload['after'] ?? null;

        if (!$repoUrl || !$latestCommitHash) {
            return response()->json(['message' => 'Invalid payload data'], 400);
        }

        // 3. Find the Marketplace Project matching this Repo
        $project = Project::where('github_repo_url', $repoUrl)->first();
        if (!$project) {
            Log::info("GitHub Webhook: Unlinked repository pushed ($repoUrl)");
            return response()->json(['message' => 'Repo not linked to any project'], 200);
        }

        // 4. Update Project Metadata with new commit
        $project->update([
            'latest_commit_hash' => $latestCommitHash
        ]);

        // 5. Trigger the automatic sync service to download the new zip in the background
        // A background Job would be best here to not block the webhook response
        // dispatch(new \App\Jobs\SyncGithubProjectJob($project));
        
        // For now, just call the project controller logic via an internal request or service
        // To prevent massive loops, we just update the commit hash. Buyers checking updates will now see a new version!
        
        // Auto-bump the version (Naive approach for demonstration)
        $currentVersion = $project->version ?? '1.0.0';
        $parts = explode('.', $currentVersion);
        if (count($parts) === 3) {
            $parts[2] = (int)$parts[2] + 1;
            $newVersion = implode('.', $parts);
            $project->update(['version' => $newVersion]);
        }

        Log::info("GitHub Webhook: Successfully processed push for Project {$project->id}. New version: {$project->version}");

        return response()->json([
            'success' => true,
            'message' => 'Webhook processed successfully'
        ]);
    }
}
