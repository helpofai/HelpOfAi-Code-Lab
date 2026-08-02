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
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CollectionController extends Controller
{
    public function index()
    {
        return Auth::user()->collections()->withCount('projects')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $collection = Auth::user()->collections()->create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
        ]);

        return response()->json($collection, 201);
    }

    public function addProject(Request $request, Collection $collection)
    {
        if ($collection->user_id !== Auth::id()) abort(403);
        
        $request->validate(['project_id' => 'required|exists:projects,id']);
        $collection->projects()->syncWithoutDetaching([$request->project_id]);
        
        return response()->json(['message' => 'Linked to collection.']);
    }

    public function destroy(Collection $collection)
    {
        if ($collection->user_id !== Auth::id()) abort(403);
        $collection->delete();
        return response()->json(null, 204);
    }
}