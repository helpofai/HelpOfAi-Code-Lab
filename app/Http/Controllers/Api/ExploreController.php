<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ExploreController extends Controller
{
    /**
     * Get public projects with filtering.
     */
    public function index(Request $request)
    {
        $query = Project::where('is_public', true)->with('user:id,name');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        // Category Filter
        if ($request->filled('category') && $request->category !== 'ALL') {
            $query->where('category', $request->category);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        if ($sort === 'latest') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sort === 'random') {
            $query->inRandomOrder();
        }

        return $query->limit(24)->get();
    }

    /**
     * Get unique categories from public projects.
     */
    public function categories()
    {
        return Project::where('is_public', true)
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');
    }

    /**
     * Get latest public projects. (Legacy / Shortcut)
     */
    public function latest()
    {
        return Project::where('is_public', true)
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(12)
            ->get();
    }

    /**
     * Get random public projects. (Legacy / Shortcut)
     */
    public function random()
    {
        return Project::where('is_public', true)
            ->with('user:id,name')
            ->inRandomOrder()
            ->limit(12)
            ->get();
    }

    /**
     * Get 3 featured projects for home page.
     */
    public function featured()
    {
        $projects = Project::where('is_public', true)
            ->with('user:id,name')
            ->orderBy('updated_at', 'desc')
            ->limit(3)
            ->get();

        foreach ($projects as $project) {
            $project->makeVisible('code');
        }

        return $projects;
    }

    /**
     * Get paid projects for marketplace section.
     */
    public function paid()
    {
        $projects = Project::where('is_for_sale', true)
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        foreach ($projects as $project) {
            $project->makeVisible(['code', 'settings']);
        }

        return $projects;
    }

    /**
     * Get global system stats for welcome page.
     */
    public function stats()
    {
        return response()->json([
            'projects' => Project::count(),
            'users' => \App\Models\User::count(),
            'public_projects' => Project::where('is_public', true)->count(),
        ]);
    }
}