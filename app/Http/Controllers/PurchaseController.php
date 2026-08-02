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

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function checkoutPage(Project $project)
    {
        $user = auth()->user();

        // Check if already purchased or owner
        if ($project->user_id === $user->id || $project->purchases()->where('user_id', $user->id)->exists()) {
            return redirect()->route('editor', $project->slug);
        }

        // Fetch Enabled Gateways
        $settings = \App\Models\SiteSetting::where('group', 'subscription')
            ->whereIn('key', ['test_enabled', 'stripe_enabled', 'razorpay_enabled', 'paytm_enabled', 'phonepe_enabled', 'stripe_key'])
            ->pluck('value', 'key');

        $enabledGateways = [];
        if (($settings['test_enabled'] ?? '0') === '1') $enabledGateways[] = 'test';
        if (($settings['stripe_enabled'] ?? '0') === '1') $enabledGateways[] = 'stripe';
        if (($settings['razorpay_enabled'] ?? '0') === '1') $enabledGateways[] = 'razorpay';
        if (($settings['paytm_enabled'] ?? '0') === '1') $enabledGateways[] = 'paytm';
        if (($settings['phonepe_enabled'] ?? '0') === '1') $enabledGateways[] = 'phonepe';

        return Inertia::render('Checkout', [
            'project' => $project->load('user'),
            'stripeKey' => $settings['stripe_key'] ?? config('cashier.key'),
            'enabledGateways' => $enabledGateways,
        ]);
    }

    public function statusPage(Request $request)
    {
        $status = $request->query('status', 'pending');
        $projectId = $request->query('project_id');
        $project = $projectId ? Project::find($projectId) : null;

        return Inertia::render('PaymentStatus', [
            'status' => $status,
            'project' => $project,
            'message' => $request->query('message')
        ]);
    }
}
