<?php

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