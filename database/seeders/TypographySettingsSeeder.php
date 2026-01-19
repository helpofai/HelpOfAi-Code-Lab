<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class TypographySettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'typography_h1_size',
                'value' => '4rem',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_h2_size',
                'value' => '3rem',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_h3_size',
                'value' => '2rem',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_body_size',
                'value' => '1rem',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_font_family',
                'value' => 'Inter, sans-serif',
                'group' => 'typography',
                'type' => 'text',
            ],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
