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

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HealthCheckService;
use Illuminate\Http\Request;

class HealthCheckController extends Controller
{
    /**
     * Full system + queue health check (admin only).
     */
    public function full(HealthCheckService $health)
    {
        $result = $health->runFull();

        $httpStatus = match ($result['status']) {
            'ok' => 200,
            'degraded' => 207,
            default => 503,
        };

        return response()->json($result, $httpStatus);
    }

    /**
     * Lightweight probe for uptime monitors / load balancers.
     * Public, no auth, does not check queue/cache internals.
     */
    public function probe(HealthCheckService $health)
    {
        $result = $health->runProbe();

        return response()->json($result, $result['status'] === 'ok' ? 200 : 503);
    }
}