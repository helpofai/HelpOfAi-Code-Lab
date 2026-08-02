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

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $projects = Project::where('is_public', true)->orderBy('updated_at', 'desc')->get();
        $vendors = User::whereNotNull('username')->orderBy('updated_at', 'desc')->get();
        
        // Collect unique tags from projects
        $tags = collect();
        foreach($projects as $p) {
            if (is_array($p->tags)) {
                foreach($p->tags as $tag) {
                    $tags->push(trim(strtolower($tag)));
                }
            }
        }
        $tags = $tags->unique();

        return response()->view('sitemap', [
            'projects' => $projects,
            'vendors' => $vendors,
            'tags' => $tags
        ])->header('Content-Type', 'text/xml');
    }
}
