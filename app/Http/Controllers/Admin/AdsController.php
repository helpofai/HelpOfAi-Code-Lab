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
use App\Models\Ad;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdsController extends Controller
{
    public function index()
    {
        $chartData = [];
        
        if (\Illuminate\Support\Facades\Schema::hasTable('ad_stats')) {
            $stats = \App\Models\AdStat::where('date', '>=', now()->subDays(29)->toDateString())
                ->selectRaw('date, SUM(impressions) as impressions, SUM(clicks) as clicks, SUM(revenue) as revenue')
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();

            // Fill in missing days
            $chartData = collect(range(29, 0))->map(function ($daysAgo) use ($stats) {
                $dateStr = now()->subDays($daysAgo)->toDateString();
                $stat = $stats->firstWhere('date', $dateStr);
                return [
                    'date' => now()->subDays($daysAgo)->format('M d'),
                    'impressions' => $stat ? (int)$stat->impressions : 0,
                    'clicks' => $stat ? (int)$stat->clicks : 0,
                    'revenue' => $stat ? (float)$stat->revenue : 0,
                ];
            });
        }

        return Inertia::render('Admin/Ads/Index', [
            'ads' => \Illuminate\Support\Facades\Schema::hasTable('ads') ? Ad::latest()->get() : [],
            'chartData' => $chartData
        ]);
    }

    public function logImpression(Ad $ad)
    {
        if (\Illuminate\Support\Facades\Schema::hasTable('ad_stats')) {
            \App\Models\AdStat::firstOrCreate(
                ['ad_id' => $ad->id, 'date' => now()->toDateString()],
                ['impressions' => 0, 'clicks' => 0, 'revenue' => 0]
            )->increment('impressions');

            // Optionally calculate estimated revenue per impression here if desired
            // Example: $0.005 per impression ( $5 eCPM )
            \App\Models\AdStat::where('ad_id', $ad->id)
                ->where('date', now()->toDateString())
                ->update(['revenue' => \Illuminate\Support\Facades\DB::raw('impressions * 0.005')]);
        }
        
        return response()->json(['status' => 'logged']);
    }

    public function settings(Request $request)
    {
        $request->validate([
            'settings' => 'required|array'
        ]);

        foreach ($request->settings as $key => $value) {
            \App\Models\SiteSetting::set($key, $value, 'ads');
        }

        return back()->with('success', 'Ad network settings updated successfully.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'required|string|in:adsense,facebook,custom',
            'location' => 'required|string|max:255',
            'client_id' => 'nullable|string|max:255',
            'slot_id' => 'nullable|string|max:255',
            'format' => 'nullable|string|max:255',
            'custom_code' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Ad::create($validated);

        return back()->with('success', 'Ad unit created successfully.');
    }

    public function update(Request $request, Ad $ad)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'required|string|in:adsense,facebook,custom',
            'location' => 'required|string|max:255',
            'client_id' => 'nullable|string|max:255',
            'slot_id' => 'nullable|string|max:255',
            'format' => 'nullable|string|max:255',
            'custom_code' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $ad->update($validated);

        return back()->with('success', 'Ad unit updated successfully.');
    }

    public function destroy(Ad $ad)
    {
        $ad->delete();
        return back()->with('success', 'Ad unit deleted.');
    }
}
