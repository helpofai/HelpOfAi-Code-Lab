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
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssetController extends Controller
{
    /**
     * Display a listing of the user's assets.
     */
    public function index()
    {
        return Auth::user()->assets()->orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a newly created asset in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB limit
            'name' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $user = Auth::user();

        // Organize by user ID for privacy and security
        $path = $file->store("user-assets/{$user->id}", 'public');

        $asset = $user->assets()->create([
            'name' => $request->name ?? $file->getClientOriginalName(),
            'path' => $path,
            'type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($asset, 201);
    }

    /**
     * Remove the specified asset from storage.
     */
    public function destroy(Asset $asset)
    {
        if ($asset->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete the physical file
        Storage::disk('public')->delete($asset->path);

        // Delete the database record
        $asset->delete();

        return response()->json(null, 204);
    }
}
