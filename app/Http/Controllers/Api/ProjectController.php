<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Auth::user()->projects()->orderBy('updated_at', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'code' => 'required|array',
            'settings' => 'nullable|array',
            'is_public' => 'boolean',
        ]);

        $slug = Str::slug($validated['title']) . '-' . Str::random(6);
        
        // Prepare JSON content for file storage
        $jsonContent = json_encode([
            'html' => $validated['code']['html'] ?? '',
            'css' => $validated['code']['css'] ?? '',
            'js' => $validated['code']['js'] ?? '',
            'settings' => $validated['settings'] ?? []
        ], JSON_PRETTY_PRINT);

        // Store in File System
        Storage::disk('local')->put("projects/{$slug}.json", $jsonContent);

        // Save metadata to Database (without heavy code blob)
        $project = Auth::user()->projects()->create([
            'title' => $validated['title'],
            'category' => $validated['category'] ?? null,
            'tags' => $validated['tags'] ?? [],
            'slug' => $slug,
            'code' => [], // Keep empty in DB
            'settings' => $validated['settings'] ?? [],
            'is_public' => $validated['is_public'] ?? true,
        ]);

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        // Check if project is private and user is not owner
        if (!$project->is_public) {
            if (!Auth::check() || $project->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized. Restricted Neural Core.'], 403);
            }
        }

        // Retrieve code from File System
        if (Storage::disk('local')->exists("projects/{$slug}.json")) {
            $fileData = json_decode(Storage::disk('local')->get("projects/{$slug}.json"), true);
            $project->code = [
                'html' => $fileData['html'] ?? '',
                'css' => $fileData['css'] ?? '',
                'js' => $fileData['js'] ?? '',
            ];
            $project->settings = $fileData['settings'] ?? $project->settings;
        }

        return $project;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        if ($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'code' => 'sometimes|array',
            'settings' => 'nullable|array',
            'is_public' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:255',
        ]);

        // Update File System if code is provided
        if (isset($validated['code'])) {
            $jsonContent = json_encode([
                'html' => $validated['code']['html'] ?? '',
                'css' => $validated['code']['css'] ?? '',
                'js' => $validated['code']['js'] ?? '',
                'settings' => $validated['settings'] ?? $project->settings
            ], JSON_PRETTY_PRINT);

            Storage::disk('local')->put("projects/{$project->slug}.json", $jsonContent);
        }

        // Prepare update data
        $updateData = [
            'title' => $validated['title'] ?? $project->title,
            'settings' => $validated['settings'] ?? $project->settings,
        ];

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

        return $project;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if ($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete from File System
        Storage::disk('local')->delete("projects/{$project->slug}.json");

        // Delete from Database
        $project->delete();

        return response()->json(null, 204);
    }
}