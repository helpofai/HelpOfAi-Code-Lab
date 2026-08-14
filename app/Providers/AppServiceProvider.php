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

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Observers\ProjectObserver;
use Illuminate\Validation\Rules\Password;

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
        // Copyright Enforcement Check
        $copyrightString = 'Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.';
        $content = @file_get_contents(__FILE__);
        if ($content && strpos($content, $copyrightString) === false) {
            die('
                <div style="font-family: sans-serif; max-width: 600px; margin: 100px auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background: #fff; text-align: center; border-top: 5px solid #ef4444;">
                    <h1 style="color: #ef4444; margin-top: 0;">Copyright Violation Detected</h1>
                    <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                        The proprietary HelpOfAi copyright header has been modified, tampered with, or removed from the core system files. 
                        <strong>This software has been suspended to prevent unauthorized use.</strong>
                    </p>
                    <p style="color: #4b5563; font-size: 14px; margin-top: 25px;">
                        Please restore the original files or contact the copyright owner:<br>
                        <strong>Rajib Adhikary</strong> | <a href="https://helpofai.com" style="color: #3b82f6; text-decoration: none;">https://helpofai.com</a>
                    </p>
                </div>
                <style>body { background: #f3f4f6; }</style>
            ');
        }

        Schema::defaultStringLength(191);

        // Enforce Secure Password Defaults
        Password::defaults(function () {
            $rule = Password::min(8)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols();

            return $this->app->isProduction()
                ? $rule->uncompromised()
                : $rule;
        });

        // Force HTTPS in production (SSL terminates at server/proxy level)
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Register Model Observers
        Project::observe(ProjectObserver::class);

        // Dynamically override Stripe configuration from database settings
        try {
            if (Schema::hasTable('site_settings')) {
                $stripeKey = \App\Models\SiteSetting::where('key', 'stripe_key')->first()?->value;
                $stripeSecret = \App\Models\SiteSetting::where('key', 'stripe_secret')->first()?->value;
                $stripeWebhook = \App\Models\SiteSetting::where('key', 'stripe_webhook_secret')->first()?->value;

                if ($stripeKey) config(['services.stripe.key' => $stripeKey]);
                if ($stripeSecret) config(['services.stripe.secret' => $stripeSecret, 'cashier.secret' => $stripeSecret]);
                if ($stripeWebhook) config(['services.stripe.webhook.secret' => $stripeWebhook]);
            }
        } catch (\Exception $e) {
            // Fail silently during migrations, early setup, or if DB is unreachable
        }
    }
}
