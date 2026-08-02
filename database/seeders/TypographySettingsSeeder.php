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
