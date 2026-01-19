<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class UpdateSiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Featured Section
            ['key' => 'home_featured_title', 'value' => 'Public_Neural_Feed', 'group' => 'home', 'type' => 'text'],
            ['key' => 'home_featured_subtitle', 'value' => 'Active Modules from the Global Network', 'group' => 'home', 'type' => 'text'],
            
            // Tech Stack Section
            ['key' => 'home_tech_title', 'value' => 'Neural_Modules', 'group' => 'home', 'type' => 'text'],
            ['key' => 'home_tech_subtitle', 'value' => 'Supported Quantum Synthesizers', 'group' => 'home', 'type' => 'text'],
            
            // Diagnostics Section
            ['key' => 'home_diagnostics_title', 'value' => 'Engine Diagnostics', 'group' => 'home', 'type' => 'text'],
            ['key' => 'home_diagnostics_desc', 'value' => 'Direct binary injection into the browser execution stack ensures 0.04ms sync rates.', 'group' => 'home', 'type' => 'text'],

            // Uplink Section
            ['key' => 'home_uplink_title', 'value' => 'Multi-Node Uplink_Sync', 'group' => 'home', 'type' => 'text'],
            ['key' => 'home_uplink_subtitle', 'value' => 'Collaborate across neural boundaries. Future-ready protocols for real-time peer-to-peer code synthesis and shared laboratory instances.', 'group' => 'home', 'type' => 'text'],

            // Features Section
            ['key' => 'home_features_title', 'value' => 'Core Interface Modules', 'group' => 'home', 'type' => 'text'],
            ['key' => 'home_features_subtitle', 'value' => 'Every laboratory comes equipped with a suite of high-performance tools designed for the next era of development.', 'group' => 'home', 'type' => 'text'],

            // Pricing Section
            ['key' => 'home_pricing_title', 'value' => 'Security_Clearance', 'group' => 'home', 'type' => 'text'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}