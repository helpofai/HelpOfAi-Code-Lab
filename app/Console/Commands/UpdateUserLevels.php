<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateUserLevels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:recalculate-levels';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate user levels based on their projects count and views';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = \App\Models\User::where('manual_level', false)->get();
        $count = 0;

        foreach ($users as $user) {
            $projectsCount = $user->projects()->count();
            $totalViews = $user->projects()->sum('views');
            
            // Score calculation:
            // 1 project = 10 score
            // 10 views = 1 score
            $score = ($projectsCount * 10) + floor($totalViews / 10);
            
            $newLevel = 1;
            
            if ($score >= 1000) {
                $newLevel = 6;
            } elseif ($score >= 500) {
                $newLevel = 5;
            } elseif ($score >= 200) {
                $newLevel = 4;
            } elseif ($score >= 100) {
                $newLevel = 3;
            } elseif ($score >= 30) {
                $newLevel = 2;
            }

            if ($user->level !== $newLevel) {
                $user->update(['level' => $newLevel]);
                $count++;
            }
        }

        $this->info("Successfully updated levels for {$count} users.");
    }
}
