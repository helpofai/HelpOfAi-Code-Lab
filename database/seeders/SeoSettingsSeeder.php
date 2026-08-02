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

class SeoSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'seo_meta_title', 'value' => 'HOACodeLab - Build, Share, and Learn', 'group' => 'seo', 'type' => 'text'],
            ['key' => 'seo_meta_description', 'value' => 'The best place to write and share HTML, CSS, and JavaScript. Join our community of developers today.', 'group' => 'seo', 'type' => 'text'],
            ['key' => 'seo_meta_keywords', 'value' => 'code editor, online ide, html, css, javascript, web development', 'group' => 'seo', 'type' => 'text'],
            ['key' => 'seo_og_image', 'value' => null, 'group' => 'seo', 'type' => 'image'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}