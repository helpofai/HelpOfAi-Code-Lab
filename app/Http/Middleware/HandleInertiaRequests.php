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

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'siteSettings' => \App\Models\SiteSetting::pluck('value', 'key')->toArray(),
            'appVersion' => config('app.version', '1.18.2'),
            'globalAds' => \Illuminate\Support\Facades\Schema::hasTable('ads') ? \App\Models\Ad::where('is_active', true)->get()->groupBy('location')->toArray() : [],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'updateAvailable' => fn () => $request->session()->get('updateAvailable'),
                'behindCount' => fn () => $request->session()->get('behindCount'),
                'changedFiles' => fn () => $request->session()->get('changedFiles'),
                'remotePendingMigrations' => fn () => $request->session()->get('remotePendingMigrations'),
            ],
        ];
    }
}
