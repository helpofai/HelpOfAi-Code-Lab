<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class LogoFaviconSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'site_logo', 'value' => null, 'group' => 'branding', 'type' => 'image'],
            ['key' => 'site_favicon', 'value' => null, 'group' => 'branding', 'type' => 'image'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}