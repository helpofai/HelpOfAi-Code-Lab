<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Dynamically override Stripe configuration from database settings
        if (Schema::hasTable('site_settings')) {
            try {
                $stripeKey = \App\Models\SiteSetting::where('key', 'stripe_key')->first()?->value;
                $stripeSecret = \App\Models\SiteSetting::where('key', 'stripe_secret')->first()?->value;
                $stripeWebhook = \App\Models\SiteSetting::where('key', 'stripe_webhook_secret')->first()?->value;

                if ($stripeKey) config(['services.stripe.key' => $stripeKey]);
                if ($stripeSecret) config(['services.stripe.secret' => $stripeSecret, 'cashier.secret' => $stripeSecret]);
                if ($stripeWebhook) config(['services.stripe.webhook.secret' => $stripeWebhook]);
            } catch (\Exception $e) {
                // Fail silently during migrations/early setup
            }
        }
    }
}
