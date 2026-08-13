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

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\SiteSetting;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the OAuth provider.
     */
    public function redirectToProvider(Request $request, string $provider)
    {
        $this->validateProvider($provider);

        $config = $this->getProviderConfig($provider);

        if (!$config['enabled'] || empty($config['client_id']) || empty($config['client_secret'])) {
            return Redirect::route('login')
                ->with('error', ucfirst($provider) . ' login is not configured.');
        }

        $driver = Socialite::driver($provider);

        // Force stateless for API or web session
        if (config('services.' . $provider . '.stateless', false)) {
            $driver->stateless();
        }

        // Set scopes dynamically
        if (!empty($config['scopes'])) {
            $driver->scopes($config['scopes']);
        }

        return $driver->redirect($config['redirect']);
    }

    /**
     * Handle the callback from the OAuth provider.
     */
    public function handleProviderCallback(Request $request, string $provider)
    {
        $this->validateProvider($provider);

        $config = $this->getProviderConfig($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Socialite {$provider} callback error: " . $e->getMessage());
            return Redirect::route('login')
                ->with('error', 'Authentication with ' . ucfirst($provider) . ' failed. Please try again.');
        }

        // Find or create user
        $user = $this->findOrCreateUser($socialUser, $provider);

        if (!$user) {
            return Redirect::route('login')
                ->with('error', 'Could not create account. Please contact support.');
        }

        // Log the user in
        Auth::login($user, true);

        // Update avatar if available
        if (!empty($socialUser->avatar)) {
            $user->update(['avatar' => $socialUser->avatar]);
        }

        // Redirect to intended or dashboard
        $redirect = $request->session()->pull('url.intended', route('dashboard'));

        return Redirect::to($redirect);
    }

    protected function validateProvider(string $provider): void
    {
        if (!in_array($provider, ['google', 'facebook', 'github'])) {
            abort(404);
        }
    }

    protected function getProviderConfig(string $provider): array
    {
        $prefix = 'social_auth.' . $provider;

        // Check if config exists in services.php (env fallback)
        $envConfig = config("services.{$provider}", []);

        return [
            'enabled' => (bool) (SiteSetting::where('group', 'social_auth')
                ->where('key', "{$provider}_enabled")->value('value') ?? $envConfig['enabled'] ?? false),
            'client_id' => SiteSetting::where('group', 'social_auth')
                ->where('key', "{$provider}_client_id")->value('value') ?? $envConfig['client_id'] ?? '',
            'client_secret' => SiteSetting::where('group', 'social_auth')
                ->where('key', "{$provider}_client_secret")->value('value') ?? $envConfig['client_secret'] ?? '',
            'redirect' => SiteSetting::where('group', 'social_auth')
                ->where('key', "{$provider}_redirect")->value('value') ?? $envConfig['redirect'] ?? "/auth/{$provider}/callback",
            'scopes' => $this->getDefaultScopes($provider),
        ];
    }

    protected function getDefaultScopes(string $provider): array
    {
        return match ($provider) {
            'google' => ['openid', 'profile', 'email'],
            'facebook' => ['email', 'public_profile'],
            'github' => ['read:user', 'user:email'],
            default => [],
        };
    }

    protected function findOrCreateUser($socialUser, string $provider): ?User
    {
        $providerId = $provider . '_id';
        $email = $socialUser->getEmail();

        if (!$email) {
            return null;
        }

        // 1. Check if user exists with this provider ID
        $user = User::where($providerId, $socialUser->getId())->first();
        if ($user) {
            return $user;
        }

        // 2. Check if user exists with this email
        $user = User::where('email', $email)->first();

        if ($user) {
            // Link social account to existing user
            $user->update([$providerId => $socialUser->getId()]);
            return $user;
        }

        // 3. Create new user
        return DB::transaction(function () use ($socialUser, $email, $providerId) {
            return User::create([
                'name' => $socialUser->getName() ?? $email,
                'email' => $email,
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(32)), // Random password since they'll use social login
                $providerId => $socialUser->getId(),
                'avatar' => $socialUser->avatar ?? null,
            ]);
        });
    }
}