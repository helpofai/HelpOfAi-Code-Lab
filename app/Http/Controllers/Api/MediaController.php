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
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB Limit
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('content-media', 'public');
            $url = asset('storage/' . $path);

            return response()->json([
                'url' => $url,
                'path' => $path
            ]);
        }

        return response()->json(['error' => 'Upload failed'], 400);
    }
}