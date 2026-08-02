<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckVendorOnboarding
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Only enforce for vendors
        if ($user && $user->role === 'vendor') {
            // Check if onboarding is completed. 
            // We can check if they have a github link and bio, or a specific `onboarding_completed` flag.
            // For now, let's assume they need a github link and a bio to be considered onboarded.
            
            // If we are already on the onboarding routes or logout, allow it
            if ($request->routeIs('vendor.onboarding.*') || $request->routeIs('logout')) {
                return $next($request);
            }

            if (empty($user->github_url) || empty($user->bio)) {
                return redirect()->route('vendor.onboarding.index');
            }
        }

        return $next($request);
    }
}
