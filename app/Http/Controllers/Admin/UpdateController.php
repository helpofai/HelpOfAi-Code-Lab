<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class UpdateController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Update', [
            'currentVersion' => config('app.version'),
            'buildId' => $this->safelyRunGit('git rev-parse --short HEAD', 'N/A'),
            'lastCommitDate' => $this->safelyRunGit('git log -1 --format=%cd', 'UNKNOWN'),
            'commits' => $this->getGitLog(),
            'localPendingMigrations' => $this->getLocalPendingMigrations(),
            'systemInfo' => $this->getSystemInfo(),
            'updateAvailable' => false,
            'gitStatus' => $this->checkGitAvailability(),
        ]);
    }

    private function checkGitAvailability()
    {
        if (!function_exists('proc_open')) {
            return 'proc_open function is disabled in php.ini';
        }
        return 'OK';
    }

    private function safelyRunGit($command, $default = null)
    {
        try {
            if (!function_exists('proc_open')) {
                return $default;
            }
            $result = Process::path(base_path())->run($command);
            return $result->successful() ? trim($result->output()) : $default;
        } catch (\Exception $e) {
            Log::error("Git command failed: {$command}. Error: " . $e->getMessage());
            return $default;
        }
    }

    private function getSystemInfo()
    {
        return [
            'app_version' => config('app.version'),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'environment' => app()->environment(),
            'debug_mode' => config('app.debug'),
            'os' => php_uname('s') . ' ' . php_uname('r'),
            'database_connection' => config('database.default'),
            'cache_driver' => config('cache.default'),
            'queue_connection' => config('queue.default'),
            'server_time' => now()->toDateTimeString(),
            'timezone' => config('app.timezone'),
        ];
    }

    public function check(Request $request)
    {
        if (!function_exists('proc_open')) {
            return back()->with([
                'updateAvailable' => false,
                'message' => 'Cannot check for updates: proc_open is disabled.',
                'timestamp' => now()->toDateTimeString(),
            ]);
        }

        // Attempt to fetch from origin
        try {
            $fetchResult = Process::path(base_path())->run('git fetch origin');
            
            $updateAvailable = false;
            $behindCount = 0;
            $changedFiles = [];
            $remotePendingMigrations = [];
            
            if ($fetchResult->successful()) {
                // Check if we are behind
                $statusResult = Process::path(base_path())->run('git rev-list --count HEAD..origin/main');
                if ($statusResult->successful()) {
                    $behindCount = (int) trim($statusResult->output());
                    $updateAvailable = $behindCount > 0;
                }

                // Get File Diff
                if ($updateAvailable) {
                    $diffResult = Process::path(base_path())->run('git diff --name-status HEAD..origin/main');
                    if ($diffResult->successful()) {
                        $lines = explode("\n", trim($diffResult->output()));
                        foreach ($lines as $line) {
                            if (empty(trim($line))) continue;
                            $parts = preg_split('/S+/', $line);
                            if (count($parts) >= 2) {
                                $file = $parts[1];
                                $changedFiles[] = [
                                    'status' => $parts[0],
                                    'file' => $file
                                ];
                                
                                if (str_contains($file, 'database/migrations')) {
                                    $remotePendingMigrations[] = $file;
                                }
                            }
                        }
                    }
                }
            } else {
                Log::error('Git fetch failed: ' . $fetchResult->errorOutput());
            }

            return back()->with([
                'updateAvailable' => $updateAvailable,
                'behindCount' => $behindCount,
                'changedFiles' => $changedFiles,
                'remotePendingMigrations' => $remotePendingMigrations,
                'message' => $updateAvailable 
                    ? "Update available! {$behindCount} commits behind." 
                    : "System is up to date.",
                'timestamp' => now()->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            return back()->with([
                'updateAvailable' => false,
                'message' => 'Error checking updates: ' . $e->getMessage(),
                'timestamp' => now()->toDateTimeString(),
            ]);
        }
    }

    private function getLocalPendingMigrations()
    {
        try {
            $path = database_path('migrations');
            if (!File::isDirectory($path)) {
                return [];
            }

            $files = File::files($path);
            $migrationsInFiles = [];
            foreach ($files as $file) {
                $migrationsInFiles[] = $file->getFilenameWithoutExtension();
            }
            
            $ranMigrations = DB::table('migrations')->pluck('migration')->toArray();
            
            return array_values(array_diff($migrationsInFiles, $ranMigrations));
        } catch (\Exception $e) {
            Log::error("Migration check failed: " . $e->getMessage());
            return [];
        }
    }

    private function getGitLog()
    {
        try {
            if (!function_exists('proc_open')) {
                return [];
            }

            $result = Process::path(base_path())->run('git log -n 10 --pretty=format:"%h|%an|%ar|%s"');
            
            if (!$result->successful()) {
                return [];
            }

            $lines = explode("\n", trim($result->output()));
            return array_map(function($line) {
                $parts = explode('|', $line, 4);
                return [
                    'hash' => $parts[0] ?? '',
                    'author' => $parts[1] ?? '',
                    'time' => $parts[2] ?? '',
                    'message' => $parts[3] ?? '',
                ];
            }, $lines);
        } catch (\Exception $e) {
            Log::error("Git Log failed: " . $e->getMessage());
            return [];
        }
    }
}