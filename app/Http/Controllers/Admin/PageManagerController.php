<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PageManagerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => Page::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pages/CreateEdit');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        Page::create($validated);

        return redirect()->route('admin.pages.index')->with('success', 'Page Protocol Initialized.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/CreateEdit', [
            'page' => $page
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,' . $page->id,
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $page->update($validated);

        return redirect()->route('admin.pages.index')->with('success', 'Page Node Updated.');
    }

    public function destroy(Page $page)
    {
        if ($page->is_system) {
            return back()->with('error', 'Critical System Node cannot be purged.');
        }

        $page->delete();

        return back()->with('success', 'Page Node De-replicated.');
    }
}
