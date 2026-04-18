<?php

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
