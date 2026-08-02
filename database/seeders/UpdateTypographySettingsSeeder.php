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

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class UpdateTypographySettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Line Heights
            [
                'key' => 'typography_line_height_body',
                'value' => '1.6',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_line_height_headings',
                'value' => '1.2',
                'group' => 'typography',
                'type' => 'text',
            ],

            // Letter Spacing
            [
                'key' => 'typography_letter_spacing_body',
                'value' => 'normal',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_letter_spacing_headings',
                'value' => '-0.02em',
                'group' => 'typography',
                'type' => 'text',
            ],

            // Font Weights
            [
                'key' => 'typography_font_weight_body',
                'value' => '400',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_font_weight_headings',
                'value' => '900', // Black/Bold default for the theme
                'group' => 'typography',
                'type' => 'text',
            ],

            // Additional Headings
            [
                'key' => 'typography_h4_size',
                'value' => '1.5rem',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_h5_size',
                'value' => '1.25rem',
                'group' => 'typography',
                'type' => 'text',
            ],
            [
                'key' => 'typography_h6_size',
                'value' => '1rem',
                'group' => 'typography',
                'type' => 'text',
            ],

            // Text Transform
            [
                'key' => 'typography_transform_headings',
                'value' => 'uppercase',
                'group' => 'typography',
                'type' => 'text',
            ],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
