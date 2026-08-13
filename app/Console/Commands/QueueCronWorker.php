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

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

class QueueCronWorker extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue:cron-worker 
                            {--max-time=50 : Maximum time in seconds to run the worker}
                            {--sleep=3 : Seconds to sleep when queue is empty}
                            {--tries=3 : Number of attempts for a job}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run queue worker with heartbeat for cron-based shared hosting. Records last run timestamp to cache.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Prevent overlapping cron runs using a cache lock
        $lock = Cache::lock('queue-cron-worker-lock', 55); // 55s max hold
        
        if (!$lock->get()) {
            $this->components->warn('Another worker is already running. Skipping this run.');
            return Command::SUCCESS;
        }

        try {
            // Record heartbeat BEFORE processing - so monitoring knows cron fired
            $heartbeatKey = 'queue_last_heartbeat_at';
            $heartbeatData = [
                'timestamp' => now()->toISOString(),
                'unix' => time(),
                'pid' => getmypid(),
            ];
            Cache::put($heartbeatKey, $heartbeatData, 300); // 5 min TTL

            $this->components->info('Heartbeat recorded. Starting queue worker...');

            // Run queue:work --stop-when-empty programmatically
            // This is cleaner than shelling out to php artisan
            $exitCode = Artisan::call('queue:work', [
                '--stop-when-empty' => true,
                '--max-time' => $this->option('max-time'),
                '--sleep' => $this->option('sleep'),
                '--tries' => $this->option('tries'),
                '--force' => true,
            ]);

            // Update heartbeat with completion status
            $heartbeatData['last_exit_code'] = $exitCode;
            $heartbeatData['completed_at'] = now()->toISOString();
            Cache::put($heartbeatKey, $heartbeatData, 300);

            if ($exitCode === 0) {
                $this->components->info('Queue worker finished successfully.');
            } else {
                $this->components->warn('Queue worker exited with code: ' . $exitCode);
            }

            return $exitCode === 0 ? Command::SUCCESS : Command::FAILURE;

        } finally {
            // Always release lock
            $lock->release();
        }
    }
}