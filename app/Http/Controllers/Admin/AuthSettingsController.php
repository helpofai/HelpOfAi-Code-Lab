<?php

/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SiteSetting;

class AuthSettingsController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('group', 'social_auth')->pluck('value', 'key');

        return Inertia::render('Admin/AuthSettings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'google_client_id' => 'nullable|string',
            'google_client_secret' => 'nullable|string',
            'google_enabled' => 'boolean',
            'facebook_client_id' => 'nullable|string',
            'facebook_client_secret' => 'nullable|string',
            'facebook_enabled' => 'boolean',
            'github_client_id' => 'nullable|string',
            'github_client_secret' => 'nullable|string',
            'github_enabled' => 'boolean',
        ]);

        foreach ($data as $key => $value) {
            // Map to social_auth group
            if (str_starts_with($key, 'google_') || str_starts_with($key, 'facebook_') || str_starts_with($key, 'github_')) {
                SiteSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value, 'group' => 'social_auth', 'type' => is_bool($value) ? 'boolean' : 'text']
                );
            }
        }

        return back()->with('success', 'Authentication settings saved.');
    }
}