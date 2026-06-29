<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdsController extends Controller
{
    public function index()
    {
        $chartData = collect(range(29, 0))->map(function ($daysAgo) {
            $baseImpressions = rand(1000, 5000);
            return [
                'date' => now()->subDays($daysAgo)->format('M d'),
                'impressions' => $baseImpressions,
                'clicks' => (int)($baseImpressions * (rand(1, 3) / 100)), // 1-3% CTR
                'revenue' => round($baseImpressions * (rand(5, 15) / 1000), 2), // $5-$15 RPM
            ];
        });

        return Inertia::render('Admin/Ads/Index', [
            'ads' => \Illuminate\Support\Facades\Schema::hasTable('ads') ? Ad::latest()->get() : [],
            'chartData' => $chartData
        ]);
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
