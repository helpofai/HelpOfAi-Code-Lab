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

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Privacy Protocol',
                'slug' => 'privacy-policy',
                'content' => "# Privacy Protocol\n\n## 1. Data Collection\nWe collect minimal data required for your neural uplink...\n\n## 2. Security\nAll data is encrypted using high-level ciphers...",
                'is_system' => true,
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms',
                'content' => "# Terms of Service\n\n## 1. Usage Agreement\nBy accessing the HOACodeLab matrix, you agree to...",
                'is_system' => true,
            ],
            [
                'title' => 'About the Matrix',
                'slug' => 'about',
                'content' => "# About HOACodeLab\n\nHOACodeLab is a high-performance development substrate built for modern web creators...",
                'is_system' => true,
            ],
            [
                'title' => 'Contact Support',
                'slug' => 'contact',
                'content' => "# Contact Us\n\nIf you encounter a signal failure, reach out to our support agents...",
                'is_system' => true,
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
