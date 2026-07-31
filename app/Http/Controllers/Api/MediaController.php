<?php

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