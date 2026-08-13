<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $settings = [
            // Google
            ['group' => 'social_auth', 'key' => 'google_client_id', 'value' => '', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'google_client_secret', 'value' => '', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'google_redirect', 'value' => '/auth/google/callback', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'google_enabled', 'value' => '0', 'type' => 'boolean'],

            // Facebook
            ['group' => 'social_auth', 'key' => 'facebook_client_id', 'value' => '', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'facebook_client_secret', 'value' => '', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'facebook_redirect', 'value' => '/auth/facebook/callback', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'facebook_enabled', 'value' => '0', 'type' => 'boolean'],

            // GitHub
            ['group' => 'social_auth', 'key' => 'github_client_id', 'value' => '', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'github_client_secret', 'value' => '', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'github_redirect', 'value' => '/auth/github/callback', 'type' => 'text'],
            ['group' => 'social_auth', 'key' => 'github_enabled', 'value' => '0', 'type' => 'boolean'],
        ];

        foreach ($settings as $setting) {
            \Illuminate\Support\Facades\DB::table('site_settings')->updateOrInsert(
                ['group' => $setting['group'], 'key' => $setting['key']],
                $setting
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::table('site_settings')
            ->where('group', 'social_auth')
            ->delete();
    }
};
