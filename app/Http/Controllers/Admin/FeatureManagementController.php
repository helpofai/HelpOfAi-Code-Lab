<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeatureManagementController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('group', 'features')->get();
        
        $settingsMap = $settings->mapWithKeys(function ($item) {
            return [$item->key => $item->value];
        });

        // Initialize default features if they don't exist
        if (!isset($settingsMap['feature_user_verification'])) {
            $settingsMap['feature_user_verification'] = '0';
        }

        return Inertia::render('Admin/FeatureManagement', [
            'settings' => $settingsMap,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'array',
        ]);

        $data = $request->input('settings', []);

        if (!empty($data)) {
            foreach ($data as $key => $value) {
                SiteSetting::set($key, $value, 'features', 'boolean');
            }
        }

        return redirect()->back()->with('message', 'Features updated successfully.');
    }
}
