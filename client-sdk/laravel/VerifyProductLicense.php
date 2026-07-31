<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class VerifyProductLicense
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next)
    {
        $licenseKey = config('app.license_key');
        
        // Cache for 24 hours to prevent API throttling
        $isValid = Cache::remember('product_license_valid', 86400, function () use ($licenseKey) {
            try {
                $response = Http::timeout(5)->post('YOUR_MARKETPLACE_URL_HERE/api/licenses/validate', [
                    'license_key' => $licenseKey,
                    'domain' => request()->getHost()
                ]);
                
                return $response->json('valid') === true;
            } catch (\Exception $e) {
                // Fail open temporarily if validation server is down
                return true; 
            }
        });

        if (!$isValid) {
            abort(403, 'CRITICAL LOCK: Invalid license key detected. Please contact support.');
        }

        return $next($request);
    }
}
