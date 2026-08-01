<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    /**
     * Get system-wide diagnostics.
     */
    public function stats()
    {
        $usersTotal = User::count();
        $projectsTotal = Project::count();
        
        $roles = User::select('role', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->groupBy('role')
            ->pluck('total', 'role');

        $latestUsers = User::latest()->take(5)->get();
        $pendingVerifications = User::where('identity_status', 'pending')->count();

        // Revenue Analytics (Simplified calculation)
        $proPrice = (float) \App\Models\SiteSetting::where('key', 'pro_monthly_price')->first()?->value ?: 9.99;
        $monthlyRevenue = (User::where('role', 'paid-user')->count() * $proPrice);

        // Generate 6 months of historical chart data
        $revenueData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $revenueData[] = [
                'name' => $month->format('M'),
                'revenue' => round($monthlyRevenue * (1 - ($i * 0.1)), 2), // Mock historical growth
                'users' => User::where('created_at', '<=', $month->endOfMonth())->where('role', 'paid-user')->count(),
            ];
        }

        return response()->json([
            'users' => [
                'total' => $usersTotal,
                'roles' => $roles,
                'latest' => $latestUsers,
                'pending_verifications' => $pendingVerifications
            ],
            'projects' => [
                'total' => $projectsTotal,
                'file_sync' => $projectsTotal, 
            ],
            'revenue' => [
                'monthly' => round($monthlyRevenue, 2),
                'chart' => $revenueData
            ],
            'system' => [
                'uptime' => '99.9%'
            ]
        ]);
    }

    /**
     * List all users for management.
     */
    public function users()
    {
        return User::orderBy('created_at', 'desc')->get(['id', 'name', 'email', 'role', 'is_blocked', 'created_at', 'identity_status', 'identity_selfie_path', 'identity_document_path', 'identity_rejected_reason', 'level', 'manual_level']);
    }

    /**
     * Create a new user from admin panel.
     */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,paid-user,user,member',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json($user, 201);
    }

    /**
     * Update user details.
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'sometimes|string|in:admin,paid-user,user,member',
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    /**
     * Toggle user blocked status.
     */
    public function toggleBlock(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot block your own admin account.'], 403);
        }

        $user->update(['is_blocked' => !$user->is_blocked]);

        return response()->json(['message' => $user->is_blocked ? 'Node isolated.' : 'Node restored.']);
    }

    /**
     * Toggle Pro status for a user.
     */
    public function togglePro(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Admin already has permanent Pro clearance.'], 403);
        }

        $isPro = $user->role === 'paid-user';
        $user->update([
            'role' => $isPro ? 'user' : 'paid-user',
            'pro_expires_at' => $isPro ? null : now()->addYear()
        ]);

        return response()->json(['message' => $isPro ? 'Pro clearance revoked.' : 'Pro clearance granted.']);
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|string|in:admin,paid-user,user,member',
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json(['message' => "User role updated to {$validated['role']}."]);
    }

    /**
     * Delete user and all their projects.
     */
    public function destroyUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own admin account.'], 403);
        }

        // Projects are deleted via cascade in migration
        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Admin verifies or rejects identity documents.
     */
    public function verifyIdentity(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected',
            'reason' => 'required_if:status,rejected|nullable|string|max:255'
        ]);

        $updates = [
            'identity_status' => $validated['status'],
            'identity_rejected_reason' => $validated['reason'] ?? null
        ];

        // If approved, instantly unlock Level 4 (Verified Vendor)
        if ($validated['status'] === 'verified' && $user->level < 4) {
            $updates['level'] = 4;
            $updates['manual_level'] = true; // Lock it so automatic sales engine doesn't downgrade them
        }

        $user->update($updates);

        return response()->json(['message' => 'Identity status updated successfully']);
    }

    public function updateLevel(Request $request, User $user)
    {
        $validated = $request->validate([
            'level' => 'required|integer|min:1|max:10'
        ]);

        $user->update([
            'level' => $validated['level'],
            'manual_level' => true
        ]);

        return response()->json([
            'message' => 'User level updated manually',
            'user' => $user->fresh()
        ]);
    }
}