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
use App\Models\Project;
use App\Models\ProjectRevision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RevisionController extends Controller
{
    /**
     * Display a listing of revisions for a project.
     */
    public function index(Project $project)
    {
        // Users can view revisions of public projects, but only their own revisions or owner's revisions?
        // Actually, CodePen revisions are usually private to the owner.
        // Let's restrict to owner for now to keep it simple and secure.
        if ($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $project->revisions()->orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a newly created revision.
     */
    public function store(Request $request, Project $project)
    {
        if ($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'commit_message' => 'required|string|max:255',
            'code' => 'required|array',
            'settings' => 'nullable|array',
        ]);

        $revision = $project->revisions()->create([
            'user_id' => Auth::id(),
            'commit_message' => $validated['commit_message'],
            'code' => $validated['code'],
            'settings' => $validated['settings'] ?? $project->settings,
        ]);

        return response()->json($revision, 201);
    }

    /**
     * Display the specified revision.
     */
    public function show(Project $project, ProjectRevision $revision)
    {
        if ($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($revision->project_id !== $project->id) {
            return response()->json(['message' => 'Revision mismatch'], 404);
        }

        return $revision->makeVisible('code');
    }

    /**
     * Restore the project to a specific revision.
     */
    public function restore(Project $project, ProjectRevision $revision)
    {
        if ($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($revision->project_id !== $project->id) {
            return response()->json(['message' => 'Revision mismatch'], 404);
        }

        $project->update([
            'code' => $revision->code,
            'settings' => $revision->settings,
        ]);

        return response()->json(['message' => 'Project restored to revision: ' . $revision->commit_message]);
    }
}
