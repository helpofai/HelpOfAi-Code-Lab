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

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesController extends Controller
{
    /**
     * Display a listing of all sales.
     */
    public function index()
    {
        $sales = Purchase::with(['user', 'project.user'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total_revenue' => Purchase::sum('amount'),
            'total_sales' => Purchase::count(),
            'sales_this_month' => Purchase::whereMonth('created_at', now()->month)->count(),
            'revenue_this_month' => Purchase::whereMonth('created_at', now()->month)->sum('amount'),
        ];

        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales,
            'stats' => $stats
        ]);
    }

    /**
     * Display projects that are currently for sale.
     */
    public function paidProjects()
    {
        $projects = Project::where('is_for_sale', true)
            ->with(['user', 'purchases'])
            ->withCount('purchases')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Make code visible for previews
        $projects->getCollection()->each->makeVisible('code');

        return Inertia::render('Admin/Sales/PaidProjects', [
            'projects' => $projects
        ]);
    }
}
