<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Projects owned by user OR projects belonging to user's teams
        $teamIds = $user->teams()->pluck('teams.id');
        
        return Project::where('user_id', $user->id)
            ->orWhereIn('team_id', $teamIds)
            ->with(['user', 'team'])
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'code' => 'required|array',
            'settings' => 'nullable|array',
            'is_public' => 'boolean',
            'is_private' => 'boolean',
            'is_for_sale' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'team_id' => 'nullable|exists:teams,id',
        ]);

        // If team_id is provided, verify user is member of that team
        if ($validated['team_id'] ?? false) {
            $isMember = $user->teams()->where('teams.id', $validated['team_id'])->exists() || 
                        $user->ownedTeams()->where('id', $validated['team_id'])->exists();
            if (!$isMember) {
                return response()->json(['message' => 'Unauthorized to assign project to this team.'], 403);
            }
        }

        // SaaS Logic: Only Pro users can create private projects
        $isPrivate = $validated['is_private'] ?? false;
        if ($isPrivate && !$user->isPro()) {
            return response()->json(['message' => 'Private projects are restricted to Pro clearance.'], 403);
        }
        
        // Project Quota Limits by Level
        if (!$user->isAdmin() && $user->level < 4) {
            $projectCount = $user->projects()->count();
            if ($user->level === 1 && $projectCount >= 5) {
                return response()->json(['message' => 'Level 1 limit reached (Max 5 projects). Get more views to reach Level 2!'], 403);
            }
            if ($user->level === 2 && $projectCount >= 15) {
                return response()->json(['message' => 'Level 2 limit reached (Max 15 projects). Get more views to reach Level 3!'], 403);
            }
            if ($user->level === 3 && $projectCount >= 30) {
                return response()->json(['message' => 'Level 3 limit reached. Please verify your identity to unlock Level 4 (Marketplace) and unlimited projects!'], 403);
            }
        }

        // Level 4+ Marketplace Gate
        if (!$user->isAdmin() && $user->level < 4) {
            if (isset($validated['is_for_sale']) && $validated['is_for_sale']) {
                return response()->json(['message' => 'You must reach Level 4 and verify your identity to list products for sale.'], 403);
            }
        }

        $slug = Str::slug($validated['title']) . '-' . Str::random(6);
        
        $project = $user->projects()->create([
            'title' => $validated['title'],
            'team_id' => $validated['team_id'] ?? null,
            'category' => $validated['category'] ?? null,
            'tags' => $validated['tags'] ?? [],
            'slug' => $slug,
            'code' => [
                'html' => $validated['code']['html'] ?? '',
                'css' => $validated['code']['css'] ?? '',
                'js' => $validated['code']['js'] ?? '',
            ],
            'settings' => $validated['settings'] ?? [],
            'is_public' => $validated['is_public'] ?? true,
            'is_private' => $isPrivate,
            'is_for_sale' => $validated['is_for_sale'] ?? false,
            'price' => $validated['price'] ?? 0.00,
        ]);

        return response()->json($project->makeVisible('code'), 201);
    }

    public function show(string $slug)
    {
        $project = Project::with(['user', 'team'])->where('slug', $slug)->firstOrFail();
        $user = Auth::user();
        
        $hasPurchased = false;
        if ($user) {
            $hasPurchased = $project->purchases()->where('user_id', $user->id)->exists();
        }

        $isAdmin = $user && $user->role === 'admin';
        $isOwner = $user && $project->user_id === $user->id;
        $isTeamMember = $project->team_id && $user && 
                        $user->teams()->where('teams.id', $project->team_id)->exists();

        // Check if project is private and user is not owner/team member/admin
        if (!$project->is_public) {
            if (!$isAdmin && !$isOwner && !$isTeamMember) {
                return response()->json(['message' => 'Unauthorized. Restricted Neural Core.'], 403);
            }
        }

        // Add purchase status to the project object
        $project->has_purchased = $hasPurchased;

        // If it's for sale and NOT purchased/owned, we still send the project but frontend will blur it.
        // NOTE: For true security, you'd scramble the code here, but user asked for "Live Previews" to show.
        return $project->makeVisible(['code', 'settings']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $user = Auth::user();
        $isAdmin = $user->role === 'admin';
        $isTeamMember = $project->team_id && $user->teams()->where('teams.id', $project->team_id)->exists();
        
        if (!$isAdmin && $project->user_id !== $user->id && !$isTeamMember) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Team role check: editors can save, members can't
        if (!$isAdmin && $isTeamMember && $project->user_id !== $user->id) {
            $team = $user->teams()->where('teams.id', $project->team_id)->first();
            if ($team->pivot->role === 'member') {
                return response()->json(['message' => 'Members have read-only access to team projects.'], 403);
            }
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'code' => 'sometimes|array',
            'settings' => 'nullable|array',
            'is_public' => 'boolean',
            'is_private' => 'boolean',
            'is_for_sale' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
            'github_repo_url' => 'nullable|url|max:255',
        ]);

        // SaaS Logic: Gating private projects
        if (isset($validated['is_private']) && $validated['is_private'] && !Auth::user()->isPro()) {
            return response()->json(['message' => 'Private visibility restricted to Pro accounts.'], 403);
        }

        // Level 4+ (Verified) Marketplace Gate
        if (!Auth::user()->isAdmin() && Auth::user()->level < 4) {
            if (isset($validated['is_for_sale']) && $validated['is_for_sale']) {
                return response()->json(['message' => 'You must reach Level 4 and verify your identity to list products for sale.'], 403);
            }
            if (isset($validated['github_repo_url']) && !empty($validated['github_repo_url'])) {
                return response()->json(['message' => 'Linking private repositories requires Level 4.'], 403);
            }
        }

        // Prepare update data
        $updateData = [
            'title' => $validated['title'] ?? $project->title,
            'settings' => $validated['settings'] ?? $project->settings,
        ];

        if (isset($validated['code'])) {
            $updateData['code'] = [
                'html' => $validated['code']['html'] ?? $project->code['html'],
                'css' => $validated['code']['css'] ?? $project->code['css'],
                'js' => $validated['code']['js'] ?? $project->code['js'],
            ];
        }

        // Explicitly check if keys exist to allow toggling/clearing
        if (array_key_exists('category', $validated)) {
            $updateData['category'] = $validated['category'];
        }
        if (array_key_exists('tags', $validated)) {
            $updateData['tags'] = $validated['tags'];
        }
        if (array_key_exists('is_public', $validated)) {
            $updateData['is_public'] = $validated['is_public'];
        }
        if (array_key_exists('is_private', $validated)) {
            $updateData['is_private'] = $validated['is_private'];
        }
        if (array_key_exists('is_for_sale', $validated)) {
            $updateData['is_for_sale'] = $validated['is_for_sale'];
        }
        if (array_key_exists('price', $validated)) {
            $updateData['price'] = $validated['price'];
        }
        if (array_key_exists('github_repo_url', $validated)) {
            $updateData['github_repo_url'] = $validated['github_repo_url'];
        }
        if (array_key_exists('meta_title', $validated)) {
            $updateData['meta_title'] = $validated['meta_title'];
        }
        if (array_key_exists('meta_description', $validated)) {
            $updateData['meta_description'] = $validated['meta_description'];
        }
        if (array_key_exists('meta_keywords', $validated)) {
            $updateData['meta_keywords'] = $validated['meta_keywords'];
        }

        // Update database metadata
        $project->update($updateData);

        return $project->makeVisible('code');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $user = Auth::user();
        $isAdmin = $user->role === 'admin';
        
        $isTeamAdmin = $project->team_id && $user->teams()
            ->where('teams.id', $project->team_id)
            ->wherePivot('role', 'admin')
            ->exists();

        $isTeamOwner = $project->team && $project->team->user_id === $user->id;

        if (!$isAdmin && $project->user_id !== $user->id && !$isTeamAdmin && !$isTeamOwner) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Extract all media files associated with this project to delete them
        $jsonString = json_encode($project->getAttributes());
        preg_match_all('/\/storage\/(content-media\/[a-zA-Z0-9_\-\.\/]+\.[a-zA-Z0-9]+)/', $jsonString, $matches);
        
        if (!empty($matches[1])) {
            $uniquePaths = array_unique($matches[1]);
            foreach ($uniquePaths as $path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
            }
        }

        // Delete from Database
        $project->delete();

        return response()->json(null, 204);
    }
}