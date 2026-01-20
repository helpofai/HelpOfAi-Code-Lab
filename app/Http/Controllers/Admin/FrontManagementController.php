<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class FrontManagementController extends Controller
{
    public function index()
    {
        // Fetch settings for 'home', 'branding', 'seo', 'typography' groups
        $settings = SiteSetting::whereIn('group', ['home', 'branding', 'seo', 'typography'])->get();
        
        $settingsMap = $settings->mapWithKeys(function ($item) {
            return [$item->key => $item->value];
        });

        return Inertia::render('Admin/FrontManagement', [
            'settings' => $settingsMap,
        ]);
    }

    public function update(Request $request)
    {
        // Validate inputs
        $request->validate([
            'settings' => 'array',
            'site_logo' => 'nullable|image|max:2048', // 2MB Max
            'site_favicon' => 'nullable|image|max:1024', // 1MB Max
            'seo_og_image' => 'nullable|image|max:2048', // 2MB Max
        ]);

        $data = $request->input('settings', []);
        
        // If data is a string (due to multipart/form-data handling), decode it
        if (is_string($data)) {
            $data = json_decode($data, true) ?? [];
        }

        // Handle File Uploads
        if ($request->hasFile('site_logo')) {
            $path = $request->file('site_logo')->store('branding', 'public');
            SiteSetting::set('site_logo', '/storage/' . $path, 'branding', 'image');
        }

        if ($request->hasFile('site_favicon')) {
            $path = $request->file('site_favicon')->store('branding', 'public');
            SiteSetting::set('site_favicon', '/storage/' . $path, 'branding', 'image');
        }

        if ($request->hasFile('seo_og_image')) {
            $path = $request->file('seo_og_image')->store('seo', 'public');
            SiteSetting::set('seo_og_image', '/storage/' . $path, 'seo', 'image');
        }

        // Handle Text Settings
        if (!empty($data)) {
            foreach ($data as $key => $value) {
                // Skip file keys
                if (in_array($key, ['site_logo', 'site_favicon', 'seo_og_image'])) continue;
                
                // Determine group based on key prefix
                $group = 'home';
                if (str_starts_with($key, 'seo_')) $group = 'seo';
                if (str_starts_with($key, 'typography_')) $group = 'typography';
                if (str_starts_with($key, 'site_')) $group = 'branding';

                SiteSetting::set($key, $value, $group, 'text');
            }
        }

        return redirect()->back()->with('message', 'Settings updated successfully.');
    }
}