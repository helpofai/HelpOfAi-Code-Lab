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
        $query = Project::with('user:id,name');

        // Type Filter (All, Public, Paid, Private)
        $type = $request->get('type', 'public');
        if ($type === 'public') {
            $query->where('is_public', true)->where('is_for_sale', false);
        } elseif ($type === 'paid') {
            $query->where('is_for_sale', true);
        } elseif ($type === 'private') {
            $query->where('is_public', false)->where('is_for_sale', false);
        } else {
            // 'all' includes public and paid, but usually we should just let them see all they have access to. 
            // We'll show all public and paid projects for 'all' by default.
            $query->where(function($q) {
                $q->where('is_public', true)->orWhere('is_for_sale', true);
            });
        }

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

        // Price Filter
        if ($request->filled('min_price') || $request->filled('max_price')) {
            $min = $request->min_price ?? 0;
            $max = $request->max_price ?? 999999;
            
            $query->where(function($q) use ($min, $max) {
                $q->whereBetween('price', [$min, $max]);
                if ($min <= 0) {
                    $q->orWhereNull('price');
                }
            });
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        if ($sort === 'latest') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sort === 'oldest') {
            $query->orderBy('created_at', 'asc');
        } elseif ($sort === 'price_low') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price_high') {
            $query->orderBy('price', 'desc');
        } elseif ($sort === 'random') {
            $query->inRandomOrder();
        }

        // Force visibility for frontend
        $projects = $query->paginate(12);
        
        $projects->getCollection()->transform(function ($project) {
            $isRestricted = false;
            // Similar to ProjectView, but we can't assume auth here easily. Let frontend handle it or just scrub code always for explore endpoint.
            $project->code = ['html' => '', 'css' => '', 'js' => ''];
            $project->is_restricted = !$project->is_public && !$project->is_for_sale;
            $project->makeVisible(['code', 'settings']);
            return $project;
        });

        return $projects;
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
     * Get private projects for welcome page.
     */
    public function privateProjects()
    {
        $projects = Project::where('is_public', false)
            ->where('is_for_sale', false)
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