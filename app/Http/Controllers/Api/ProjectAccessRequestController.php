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
use App\Models\ProjectAccessRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectAccessRequestController extends Controller
{
    public function requestAccess(Request $request, Project $project)
    {
        $user = Auth::user();

        if ($project->user_id === $user->id) {
            return response()->json(['message' => 'You own this project.'], 400);
        }

        $accessRequest = ProjectAccessRequest::firstOrCreate(
            ['project_id' => $project->id, 'user_id' => $user->id],
            ['status' => 'pending']
        );

        return response()->json(['message' => 'Access requested.', 'status' => $accessRequest->status]);
    }

    public function getRequests(Request $request)
    {
        $user = Auth::user();
        
        $requests = ProjectAccessRequest::with(['user:id,name,email', 'project:id,title'])
            ->whereHas('project', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    public function approve(Request $request, ProjectAccessRequest $accessRequest)
    {
        if ($accessRequest->project->user_id !== Auth::id()) {
            abort(403);
        }

        $accessRequest->update(['status' => 'approved']);
        return response()->json(['message' => 'Request approved.']);
    }

    public function reject(Request $request, ProjectAccessRequest $accessRequest)
    {
        if ($accessRequest->project->user_id !== Auth::id()) {
            abort(403);
        }

        $accessRequest->update(['status' => 'rejected']);
        return response()->json(['message' => 'Request rejected.']);
    }
}
