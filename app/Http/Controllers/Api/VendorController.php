<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VendorController extends Controller
{
    /**
     * Save the Vendor's payout account IDs (Stripe / Razorpay).
     * In a full production environment with Stripe Connect, this would be
     * handled via an OAuth callback from Stripe. For this implementation, 
     * we allow vendors to directly submit their connected account IDs.
     */
    public function updatePayoutAccounts(Request $request)
    {
        $request->validate([
            'stripe_account_id' => 'nullable|string|starts_with:acct_',
            'razorpay_account_id' => 'nullable|string',
            'phonepe_merchant_id' => 'nullable|string',
            'paytm_merchant_id' => 'nullable|string',
            'github_token' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Ensure only vendors or admins can update these fields
        if (!$user->isAdmin() && !$user->is_vendor && $user->level < 1) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($request->has('stripe_account_id')) {
            $user->stripe_account_id = $request->stripe_account_id;
        }

        if ($request->has('razorpay_account_id')) {
            $user->razorpay_account_id = $request->razorpay_account_id;
        }

        if ($request->has('phonepe_merchant_id')) {
            $user->phonepe_merchant_id = $request->phonepe_merchant_id;
        }

        if ($request->has('paytm_merchant_id')) {
            $user->paytm_merchant_id = $request->paytm_merchant_id;
        }

        if ($request->has('github_token')) {
            $user->github_token = $request->github_token;
        }

        $user->save();

        return response()->json([
            'message' => 'Vendor settings updated successfully.',
            'user' => $user
        ]);
    }

    public function requestPayout(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10',
            'payment_method' => 'nullable|string'
        ]);

        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
                $user = \App\Models\User::where('id', Auth::id())->lockForUpdate()->first();

                if ($user->available_balance < $request->amount) {
                    throw new \Exception('Insufficient balance.');
                }

                $minPayout = \App\Models\SiteSetting::where('key', 'minimum_payout_amount')->first()?->value ?: 50.00;
                if ($request->amount < $minPayout) {
                    throw new \Exception('Minimum payout amount is $' . number_format($minPayout, 2));
                }

                $user->available_balance -= $request->amount;
                $user->pending_balance += $request->amount;
                $user->save();

                $payout = Payout::create([
                    'user_id' => $user->id,
                    'amount' => $request->amount,
                    'status' => 'pending',
                    'payment_method' => $request->payment_method
                ]);

                \App\Models\WalletTransaction::create([
                    'user_id' => $user->id,
                    'type' => 'debit',
                    'amount' => $request->amount,
                    'reference_type' => get_class($payout),
                    'reference_id' => $payout->id,
                    'description' => 'Withdrawal Request'
                ]);

                // Notify Admins
                $admins = \App\Models\User::where('is_admin', true)->get();
                \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\PayoutRequestedNotification($payout));
            });

            return response()->json(['message' => 'Payout requested successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function getConnections()
    {
        $user = Auth::user();
        if (!$user->is_vendor && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        return response()->json($user->vendorConnections);
    }

    public function storeConnection(Request $request)
    {
        $request->validate([
            'provider' => 'required|string|in:github,gitlab,bitbucket',
            'name' => 'required|string|max:255',
            'token' => 'required|string',
        ]);

        $user = Auth::user();
        if (!$user->is_vendor && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $connection = $user->vendorConnections()->create([
            'provider' => $request->provider,
            'name' => $request->name,
            'token' => $request->token,
            'is_valid' => false, // Will be verified below
        ]);

        $this->verifyConnectionLogic($connection);

        return response()->json([
            'message' => 'Connection added successfully.',
            'connection' => $connection
        ]);
    }

    public function verifyConnection($id)
    {
        $user = Auth::user();
        $connection = $user->vendorConnections()->findOrFail($id);
        
        $isValid = $this->verifyConnectionLogic($connection);
        
        return response()->json([
            'message' => $isValid ? 'Connection is valid!' : 'Connection verification failed. Please check your token.',
            'is_valid' => $isValid,
            'connection' => $connection
        ], 200);
    }

    public function deleteConnection($id)
    {
        $user = Auth::user();
        $connection = $user->vendorConnections()->findOrFail($id);
        $connection->delete();
        
        return response()->json(['message' => 'Connection deleted.']);
    }

    private function verifyConnectionLogic($connection)
    {
        $isValid = false;
        try {
            $http = \Illuminate\Support\Facades\Http::withHeaders(['User-Agent' => 'HOACodeLab-App']);
            if (app()->environment('local')) {
                $http->withoutVerifying();
            }

            if ($connection->provider === 'github') {
                $response = $http->withToken(trim($connection->token))->get('https://api.github.com/user');
                $isValid = $response->successful();
                
                if (!$isValid) {
                    \Illuminate\Support\Facades\Log::error('GitHub Verification Failed: ' . $response->body());
                }
            } elseif ($connection->provider === 'gitlab') {
                $response = $http->withToken($connection->token)->get('https://gitlab.com/api/v4/user');
                $isValid = $response->successful();
            } elseif ($connection->provider === 'bitbucket') {
                $response = $http->withToken($connection->token)->get('https://api.bitbucket.org/2.0/user');
                $isValid = $response->successful();
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('GitHub Verification Exception: ' . $e->getMessage());
            $isValid = false;
        }

        $connection->is_valid = $isValid;
        $connection->last_verified_at = now();
        $connection->save();

        return $isValid;
    }

    public function fetchMarkdownFiles(Request $request)
    {
        $request->validate([
            'repo_url' => 'required|url'
        ]);

        $user = Auth::user();
        $githubConnection = $user->vendorConnections()->where('provider', 'github')->where('is_valid', true)->first();
        if (!$githubConnection) {
            return response()->json(['message' => 'No valid GitHub connection found.'], 400);
        }

        $path = parse_url($request->repo_url, PHP_URL_PATH);
        $path = trim($path, '/');
        $parts = explode('/', $path);
        if (count($parts) < 2) {
            return response()->json(['message' => 'Invalid GitHub URL format.'], 400);
        }
        $owner = $parts[0];
        $repo = $parts[1];

        $http = \Illuminate\Support\Facades\Http::withHeaders(['User-Agent' => 'HOACodeLab-App']);
        if (app()->environment('local')) {
            $http->withoutVerifying();
        }

        $response = $http->withToken($githubConnection->token)
            ->get("https://api.github.com/repos/{$owner}/{$repo}/contents");

        if (!$response->successful()) {
            return response()->json(['message' => 'Failed to fetch repo contents from GitHub API.'], 400);
        }

        $files = collect($response->json())->filter(function ($file) {
            return $file['type'] === 'file' && \Illuminate\Support\Str::endsWith(strtolower($file['name']), '.md');
        });

        $markdownFiles = [];
        foreach ($files as $file) {
            $contentResponse = $http->withToken($githubConnection->token)->get($file['download_url']);
            if ($contentResponse->successful()) {
                $markdownFiles[] = [
                    'name' => $file['name'],
                    'content' => $contentResponse->body()
                ];
            }
        }

        return response()->json(['markdown_files' => array_values($markdownFiles)]);
    }
}
