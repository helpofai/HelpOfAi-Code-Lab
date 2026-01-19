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
        // ... (previous stats code)
    }

    /**
     * List all users for management.
     */
    public function users()
    {
        return User::orderBy('created_at', 'desc')->get(['id', 'name', 'email', 'role', 'is_blocked', 'created_at']);
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
}