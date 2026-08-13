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

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HealthCheckService
{
    /**
     * Run a full system + queue health check.
     *
     * @return array<string, mixed>
     */
    public function runFull(): array
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'storage' => $this->checkStorage(),
            'queue' => $this->checkQueue(),
            'system' => $this->checkSystem(),
        ];

        $allHealthy = collect($checks)->every(fn ($c) => $c['status'] === 'ok');

        return [
            'status' => $allHealthy ? 'ok' : 'degraded',
            'timestamp' => now()->toISOString(),
            'app' => [
                'name' => config('app.name'),
                'env' => config('app.env'),
                'url' => config('app.url'),
                'version' => '1.18.2',
            ],
            'checks' => $checks,
        ];
    }

    /**
     * Lightweight public health probe (uptime monitors).
     *
     * @return array<string, mixed>
     */
    public function runProbe(): array
    {
        $db = $this->checkDatabase();

        return [
            'status' => $db['status'] === 'ok' ? 'ok' : 'degraded',
            'timestamp' => now()->toISOString(),
            'checks' => ['database' => $db],
        ];
    }

    protected function checkDatabase(): array
    {
        try {
            $start = microtime(true);
            DB::select('SELECT 1');
            $latencyMs = round((microtime(true) - $start) * 1000, 2);

            return [
                'status' => 'ok',
                'latency_ms' => $latencyMs,
                'driver' => config('database.default'),
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    protected function checkCache(): array
    {
        try {
            $key = 'health_check_probe_' . uniqid();
            Cache::put($key, 'ok', 10);
            $value = Cache::get($key);
            Cache::forget($key);

            return [
                'status' => $value === 'ok' ? 'ok' : 'error',
                'driver' => config('cache.default'),
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    protected function checkStorage(): array
    {
        try {
            $root = base_path();
            $free = disk_free_space($root);
            $total = disk_total_space($root);
            $freeGb = $free !== false ? round($free / 1024 / 1024 / 1024, 2) : null;
            $totalGb = $total !== false ? round($total / 1024 / 1024 / 1024, 2) : null;
            $pctFree = ($free !== false && $total > 0) ? round(($free / $total) * 100, 1) : null;

            $logWritable = is_writable(storage_path('logs'));
            $appWritable = is_writable(storage_path('app'));

            return [
                'status' => ($logWritable && $appWritable) ? 'ok' : 'error',
                'disk_free_gb' => $freeGb,
                'disk_total_gb' => $totalGb,
                'disk_free_pct' => $pctFree,
                'log_dir_writable' => $logWritable,
                'app_dir_writable' => $appWritable,
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Queue health: heartbeat + jobs pile-up + stuck jobs + fail rate.
     *
     * @return array<string, mixed>
     */
    protected function checkQueue(): array
    {
        try {
            $heartbeat = Cache::get('queue_last_heartbeat_at');
            $hasHeartbeat = is_array($heartbeat) && isset($heartbeat['unix']);

            // Worker status: heartbeat within last 3 minutes
            $lastSeenSeconds = $hasHeartbeat ? (time() - $heartbeat['unix']) : null;
            if ($lastSeenSeconds === null) {
                $workerStatus = 'never';
                $workerState = 'down';
            } elseif ($lastSeenSeconds <= 180) {
                $workerStatus = 'running';
                $workerState = 'up';
            } elseif ($lastSeenSeconds <= 600) {
                $workerStatus = 'stale';
                $workerState = 'warning';
            } else {
                $workerStatus = 'down';
                $workerState = 'down';
            }

            // Pending jobs
            $pendingCount = DB::table('jobs')->count();
            $oldestPending = DB::table('jobs')->min('created_at');

            // Stuck jobs: reserved (locked by a worker) for more than 10 minutes = dead worker
            $stuckJobs = DB::table('jobs')
                ->whereNotNull('reserved_at')
                ->where('reserved_at', '<', time() - 600)
                ->count();

            // Delayed jobs waiting for their delay time
            $delayedJobs = DB::table('jobs')
                ->whereNotNull('available_at')
                ->where('available_at', '>', time())
                ->count();

            // Failed jobs (recent 24h)
            $failed24h = DB::table('failed_jobs')
                ->where('failed_at', '>=', now()->subHours(24))
                ->count();

            // Decide overall queue status
            if ($workerState === 'down' && $pendingCount > 0) {
                $overall = 'down';
            } elseif ($stuckJobs > 0) {
                $overall = 'warning';
            } elseif ($workerState === 'warning') {
                $overall = 'warning';
            } else {
                $overall = 'ok';
            }

            return [
                'status' => $overall,
                'worker' => [
                    'state' => $workerState,
                    'status' => $workerStatus,
                    'last_seen_at' => $hasHeartbeat ? $heartbeat['timestamp'] : null,
                    'last_seen_seconds_ago' => $lastSeenSeconds,
                    'last_exit_code' => $hasHeartbeat && isset($heartbeat['last_exit_code']) ? $heartbeat['last_exit_code'] : null,
                ],
                'jobs' => [
                    'pending' => $pendingCount,
                    'delayed' => $delayedJobs,
                    'stuck' => $stuckJobs,
                    'oldest_pending_at' => $oldestPending ? date('Y-m-d H:i:s', $oldestPending) : null,
                ],
                'failed' => [
                    'last_24h' => $failed24h,
                    'total' => DB::table('failed_jobs')->count(),
                ],
                'recommended_cron' => '* * * * * ' . PHP_BINARY . ' ' . base_path('artisan') . ' queue:cron-worker',
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    protected function checkSystem(): array
    {
        return [
            'status' => 'ok',
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'os' => PHP_OS_FAMILY . ' ' . php_uname('r'),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'cli',
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time') . 's',
        ];
    }
}