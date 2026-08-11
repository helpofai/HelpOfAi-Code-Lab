<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class AdvancedFirewall
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 0. Exempt Routes (Tracking and Impression routes should not trigger the firewall)
        if ($request->is('ads/*/impression') || $request->is('api/notifications/*')) {
            return $next($request);
        }

        $ip = $request->ip();
        $bannedKey = 'banned_ip:' . $ip;
        $rateLimitKey = 'firewall:' . $ip;

        // 1. Check if the IP is currently in the 24-hour penalty box
        if (Cache::has($bannedKey)) {
            Log::warning("Firewall blocked request from banned IP: {$ip}");
            return response()->json([
                'status' => 'error',
                'message' => 'SECURITY BREACH DETECTED: Your IP address has been temporarily restricted due to excessive suspicious activity (Possible DDoS/Bot). If you believe this is a mistake, please contact support.'
            ], 403);
        }

        // Fetch settings dynamically (default to aggressive if missing)
        $enabled = \App\Models\SiteSetting::where('key', 'firewall_enabled')->value('value') ?? '1';
        
        if ($enabled === '0' || $enabled === false) {
            return $next($request); // Firewall bypassed
        }

        $maxAttempts = \App\Models\SiteSetting::where('key', 'firewall_max_attempts')->value('value') ?? 150;
        $penaltyHours = \App\Models\SiteSetting::where('key', 'firewall_penalty_hours')->value('value') ?? 24;

        if (RateLimiter::tooManyAttempts($rateLimitKey, $maxAttempts)) {
            // 3. Threshold breached: Auto-Ban the IP
            Cache::put($bannedKey, true, now()->addHours($penaltyHours));
            
            // Log to Database for Admin UI
            \App\Models\BannedIp::updateOrCreate(
                ['ip_address' => $ip],
                [
                    'reason' => 'Auto-banned by Advanced Firewall (Rate limit exceeded)',
                    'expires_at' => now()->addHours($penaltyHours)
                ]
            );
            
            // Clear the rate limiter to reset counter for after the ban
            RateLimiter::clear($rateLimitKey);
            
            Log::alert("Firewall AUTO-BANNED IP for Flooding: {$ip}");
            
            return response()->json([
                'status' => 'error',
                'message' => 'RATE LIMIT EXCEEDED: Your connection has been suspended. Please try again later.'
            ], 429);
        }

        // 4. Register the valid hit (decays every 60 seconds)
        RateLimiter::hit($rateLimitKey, 60);

        // Continue normal execution
        $response = $next($request);

        // Security headers enforcement on the response
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        return $response;
    }
}
