<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Inertia\Inertia;

class PublicDirectoryController extends Controller
{
    public function search(Request $request)
    {
        $query = Project::with('user:id,name')
            ->where(function($q) {
                $q->where('is_public', true)->orWhere('is_for_sale', true);
            });

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        $projects = $query->orderBy('created_at', 'desc')->paginate(16);
        $projects->getCollection()->transform(function ($project) {
            $project->is_restricted = !$project->is_public && !$project->is_for_sale;
            $project->makeVisible(['code', 'settings']);
            return $project;
        });

        return Inertia::render('Directory/Search', [
            'projects' => $projects,
            'filters' => $request->only('q')
        ]);
    }

    public function categories()
    {
        $categories = Project::where('is_public', true)
            ->whereNotNull('category')
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        return Inertia::render('Directory/Categories', [
            'categories' => $categories
        ]);
    }

    public function categoryShow($category)
    {
        $projects = Project::with('user:id,name')
            ->where(function($q) {
                $q->where('is_public', true)->orWhere('is_for_sale', true);
            })
            ->where('category', $category)
            ->orderBy('created_at', 'desc')
            ->paginate(16);

        $projects->getCollection()->transform(function ($project) {
            $project->is_restricted = !$project->is_public && !$project->is_for_sale;
            $project->makeVisible(['code', 'settings']);
            return $project;
        });

        return Inertia::render('Directory/CategoryShow', [
            'category' => $category,
            'projects' => $projects
        ]);
    }

    public function tags()
    {
        $projects = Project::where('is_public', true)
            ->whereNotNull('tags')
            ->pluck('tags');
            
        $tagCounts = [];
        foreach ($projects as $tagsJson) {
            $tags = json_decode($tagsJson, true) ?? [];
            foreach ($tags as $tag) {
                if (isset($tagCounts[$tag])) {
                    $tagCounts[$tag]++;
                } else {
                    $tagCounts[$tag] = 1;
                }
            }
        }
        
        arsort($tagCounts);
        
        $formattedTags = [];
        foreach ($tagCounts as $name => $count) {
            $formattedTags[] = ['name' => $name, 'count' => $count];
        }

        return Inertia::render('Directory/Tags', [
            'tags' => array_slice($formattedTags, 0, 100)
        ]);
    }

    public function tagShow($tag)
    {
        $projects = Project::with('user:id,name')
            ->where(function($q) {
                $q->where('is_public', true)->orWhere('is_for_sale', true);
            })
            ->where('tags', 'like', "%\"{$tag}\"%")
            ->orderBy('created_at', 'desc')
            ->paginate(16);

        $projects->getCollection()->transform(function ($project) {
            $project->is_restricted = !$project->is_public && !$project->is_for_sale;
            $project->makeVisible(['code', 'settings']);
            return $project;
        });

        return Inertia::render('Directory/TagShow', [
            'tag' => $tag,
            'projects' => $projects
        ]);
    }
}
