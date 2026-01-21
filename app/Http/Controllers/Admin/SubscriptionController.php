<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('group', 'subscription')->get()->mapWithKeys(function ($item) {
            return [$item->key => $item->value];
        });

        // Ensure defaults if not set
        $defaults = [
            'pro_monthly_price' => '9.99',
            'pro_yearly_price' => '99.00',
            'pro_trial_days' => '7',
            'enable_public_signups' => '1',
            'enforce_pro_privacy' => '1',
            'free_project_limit' => '10',
            'max_upload_size_mb' => '5',
            'require_email_verification' => '1',
            'maintenance_bypass_key' => 'HOA-' . strtoupper(\Illuminate\Support\Str::random(8)),
            'global_rate_limit' => '60',
            'allow_guest_preview' => '1',
        ];

        return Inertia::render('Admin/SubscriptionSettings', [
            'settings' => array_merge($defaults, $settings->toArray())
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array'
        ]);

        foreach ($validated['settings'] as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key, 'group' => 'subscription'],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Subscription protocols updated.');
    }
}