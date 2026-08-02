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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Handle image uploads from TipTap editor.
     */
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|max:10240', // 10MB Limit
            ]);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                if (!$file->isValid()) {
                    return response()->json(['error' => 'Upload failed: ' . $file->getErrorMessage()], 400);
                }

                $path = $file->storePublicly('content-media', 'public');
                
                if (!$path) {
                    return response()->json(['error' => 'Could not save file to disk. Check storage folder permissions (chmod 775 storage/app/public).'], 500);
                }

                $url = asset('storage/' . $path);

                return response()->json([
                    'url' => $url,
                    'path' => $path
                ]);
            }

            return response()->json(['error' => 'No image provided.'], 400);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Server Error: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}