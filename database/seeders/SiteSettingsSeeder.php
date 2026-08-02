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
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'home_hero_title',
                'value' => 'Build, Share, and Learn with HOACodeLab',
                'group' => 'home',
                'type' => 'text',
            ],
            [
                'key' => 'home_hero_subtitle',
                'value' => 'The best place to write and share HTML, CSS, and JavaScript. Join our community of developers today.',
                'group' => 'home',
                'type' => 'text',
            ],
            [
                'key' => 'home_hero_cta_text',
                'value' => 'Start Coding',
                'group' => 'home',
                'type' => 'text',
            ],
            [
                'key' => 'home_hero_cta_link',
                'value' => '/editor',
                'group' => 'home',
                'type' => 'text',
            ],
            [
                'key' => 'announcement_banner_text',
                'value' => 'Welcome to HOACodeLab! We represent the future of coding.',
                'group' => 'home',
                'type' => 'text',
            ],
            [
                'key' => 'announcement_banner_active',
                'value' => '1',
                'group' => 'home',
                'type' => 'boolean',
            ],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}