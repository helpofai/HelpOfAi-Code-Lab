<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ExploreController extends Controller
{
    /**
     * Get latest public projects.
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
     * Get random public projects.
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
        return Project::where('is_public', true)
            ->with('user:id,name')
            ->orderBy('updated_at', 'desc')
            ->limit(3)
            ->get();
    }
}