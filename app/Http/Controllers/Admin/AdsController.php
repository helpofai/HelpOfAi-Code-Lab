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
        return Inertia::render('Admin/Ads/Index', [
            'ads' => \Illuminate\Support\Facades\Schema::hasTable('ads') ? Ad::latest()->get() : []
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
