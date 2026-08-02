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

use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorProfileController extends Controller
{
    /**
     * Display the public vendor profile.
     */
    public function show($username)
    {
        $vendor = User::where('username', $username)->firstOrFail();

        // Get public projects for sale by this vendor
        $projects = Project::where('user_id', $vendor->id)
            ->where('is_public', true)
            ->where('is_for_sale', true)
            ->latest()
            ->get();

        // Calculate some stats
        $totalProjects = $projects->count();
        // Here we could calculate total sales if needed, or simply pass the projects

        return Inertia::render('VendorProfile', [
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'username' => $vendor->username,
                'avatar' => $vendor->avatar,
                'bio' => $vendor->bio,
                'created_at' => $vendor->created_at->diffForHumans(),
            ],
            'projects' => $projects
        ]);
    }
}
