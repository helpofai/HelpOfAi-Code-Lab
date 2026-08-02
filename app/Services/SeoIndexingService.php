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

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SeoIndexingService
{
    /**
     * Submit a specific URL to search engines using IndexNow protocol and Sitemap Pings.
     * 
     * @param string $url The exact URL to index (e.g. https://yoursite.com/project/my-app)
     */
    public function submitUrlForIndexing(string $url)
    {
        try {
            $this->pingGoogleSitemap();
            $this->pingBingSitemap();
            
            // IndexNow Protocol (Bing, Yandex, Seznam, Naver)
            // Requires a host and a key (usually saved as a txt file in public dir)
            // We will generate a generic fallback key or use one from config if it existed
            $this->submitToIndexNow([$url]);
            
        } catch (\Exception $e) {
            Log::error("SEO Indexing Service Error: " . $e->getMessage());
        }
    }

    /**
     * Pings Google to crawl the sitemap immediately.
     */
    public function pingGoogleSitemap()
    {
        $sitemapUrl = url('/sitemap.xml');
        $response = Http::get('https://www.google.com/ping?sitemap=' . urlencode($sitemapUrl));
        Log::info("Pung Google Sitemap: " . $response->status());
    }

    /**
     * Pings Bing to crawl the sitemap immediately.
     */
    public function pingBingSitemap()
    {
        $sitemapUrl = url('/sitemap.xml');
        $response = Http::get('https://www.bing.com/ping?sitemap=' . urlencode($sitemapUrl));
        Log::info("Pung Bing Sitemap: " . $response->status());
    }

    /**
     * Sends URLs directly to IndexNow API for instant crawling.
     */
    public function submitToIndexNow(array $urls)
    {
        $host = request()->getHost();
        if ($host === '127.0.0.1' || $host === 'localhost') {
            return; // Don't ping on local dev
        }

        // The key should be a 32-128 hex character string. We'll generate a consistent one based on app key.
        $key = substr(md5(config('app.key')), 0, 32);

        $payload = [
            'host' => $host,
            'key' => $key,
            'keyLocation' => url("/{$key}.txt"),
            'urlList' => $urls
        ];

        // Bing IndexNow endpoint covers multiple engines (Bing, Yandex, etc.)
        $response = Http::post('https://api.indexnow.org/indexnow', $payload);
        
        Log::info("IndexNow Submission for " . count($urls) . " URLs: " . $response->status());
    }
}
