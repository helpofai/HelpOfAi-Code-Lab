<?php

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
            'globalAds' => \App\Models\Ad::where('is_active', true)->get()->groupBy('location')->toArray(),
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
