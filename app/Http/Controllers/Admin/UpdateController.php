<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class UpdateController extends Controller
{
    private $repoUrl = 'https://raw.githubusercontent.com/helpofai/HelpOfAi-Code-Lab/main/.env.example';
    private $commitsUrl = 'https://api.github.com/repos/helpofai/HelpOfAi-Code-Lab/commits';

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
        $currentVersion = config('app.version', '0.0.0');
        $remoteVersion = $this->getRemoteVersion();
        
        $updateAvailable = false;
        $message = "System is up to date.";
        
        if ($remoteVersion && version_compare($remoteVersion, $currentVersion, '>')) {
            $updateAvailable = true;
            $message = "Update available! Version {$remoteVersion} is ready (Current: {$currentVersion}).";
        }

        // Try Git check if available, but don't rely on it entirely
        $behindCount = 0;
        $changedFiles = [];
        $remotePendingMigrations = [];

        if (function_exists('proc_open')) {
             try {
                $fetchResult = Process::path(base_path())->run('git fetch origin');
                if ($fetchResult->successful()) {
                    $statusResult = Process::path(base_path())->run('git rev-list --count HEAD..origin/main');
                    if ($statusResult->successful()) {
                        $behindCount = (int) trim($statusResult->output());
                        if ($behindCount > 0) $updateAvailable = true; // Git says we are behind too
                    }
                    
                    // Get File Diff
                    if ($behindCount > 0) {
                        $diffResult = Process::path(base_path())->run('git diff --name-status HEAD..origin/main');
                        if ($diffResult->successful()) {
                            $lines = explode("\n", trim($diffResult->output()));
                            foreach ($lines as $line) {
                                if (empty(trim($line))) continue;
                                $parts = preg_split('/\s+/', $line);
                                if (count($parts) >= 2) {
                                    $changedFiles[] = ['status' => $parts[0], 'file' => $parts[1]];
                                    if (str_contains($parts[1], 'database/migrations')) {
                                        $remotePendingMigrations[] = $parts[1];
                                    }
                                }
                            }
                        }
                    }
                }
             } catch (\Exception $e) {
                 Log::error('Git check failed, falling back to version number: ' . $e->getMessage());
             }
        }

        return back()->with([
            'updateAvailable' => $updateAvailable,
            'latestVersion' => $remoteVersion,
            'behindCount' => $behindCount,
            'changedFiles' => $changedFiles,
            'remotePendingMigrations' => $remotePendingMigrations,
            'message' => $message,
            'timestamp' => now()->toDateTimeString(),
        ]);
    }

    private function getRemoteVersion()
    {
        try {
            $response = Http::timeout(5)->get($this->repoUrl);
            if ($response->successful()) {
                preg_match('/APP_VERSION=(.*)/', $response->body(), $matches);
                return isset($matches[1]) ? trim($matches[1]) : null;
            }
        } catch (\Exception $e) {
            Log::error("Failed to fetch remote version: " . $e->getMessage());
        }
        return null;
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
        // Try local git first
        if (function_exists('proc_open')) {
            try {
                $result = Process::path(base_path())->run('git log -n 10 --pretty=format:"%h|%an|%ar|%s"');
                if ($result->successful() && !empty(trim($result->output()))) {
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
                }
            } catch (\Exception $e) {}
        }

        // Fallback to GitHub API (public repo)
        try {
            $response = Http::timeout(5)->get($this->commitsUrl, ['per_page' => 5]);
            if ($response->successful()) {
                return collect($response->json())->map(function ($commit) {
                    return [
                        'hash' => substr($commit['sha'], 0, 7),
                        'author' => $commit['commit']['author']['name'],
                        'time' => \Carbon\Carbon::parse($commit['commit']['author']['date'])->diffForHumans(),
                        'message' => $commit['commit']['message'],
                    ];
                })->toArray();
            }
        } catch (\Exception $e) {
            Log::error("Failed to fetch commits from GitHub API: " . $e->getMessage());
        }

        return [];
    }

    public function start()
    {
        return response()->stream(function () {
            $this->sendUpdateLog("Starting system update...", 10);

            if (!function_exists('proc_open')) {
                $this->sendUpdateLog("Error: proc_open is disabled. Cannot run update commands.", 100, 'error');
                return;
            }

            // 1. Git Pull
            $this->sendUpdateLog("Fetching latest code from repository...", 20);
            $pull = Process::path(base_path())->run('git pull origin main');
            
            if ($pull->successful()) {
                $this->sendUpdateLog($pull->output());
                $this->sendUpdateLog("Code updated successfully.", 40, 'success');
            } else {
                $this->sendUpdateLog("Git pull failed: " . $pull->errorOutput(), 40, 'error');
                return; // Stop if pull fails
            }

            // 2. Migrate
            $this->sendUpdateLog("Running database migrations...", 50);
            $migrate = Process::path(base_path())->run('php artisan migrate --force');
            if ($migrate->successful()) {
                $this->sendUpdateLog($migrate->output());
                $this->sendUpdateLog("Database migrated.", 70, 'success');
            } else {
                $this->sendUpdateLog("Migration failed: " . $migrate->errorOutput(), 70, 'error');
            }

            // 3. Optimize Clear
            $this->sendUpdateLog("Clearing system caches...", 80);
            $optimize = Process::path(base_path())->run('php artisan optimize:clear');
            $this->sendUpdateLog($optimize->output());

            // 4. Reload Config Cache (Production)
            if (app()->environment('production')) {
                $this->sendUpdateLog("Caching configuration...", 90);
                Process::path(base_path())->run('php artisan config:cache');
                Process::path(base_path())->run('php artisan route:cache');
                Process::path(base_path())->run('php artisan view:cache');
            }

            $this->sendUpdateLog("System update completed successfully.", 100, 'success');
            $this->sendUpdateLog("Refresing session...", 100, 'done');

        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    private function sendUpdateLog($message, $progress = null, $status = 'info')
    {
        $data = [
            'message' => trim($message),
            'progress' => $progress,
            'status' => $status,
            'timestamp' => now()->toTimeString(),
        ];
        
        echo "data: " . json_encode($data) . "\n\n";
        
        if (ob_get_level() > 0) {
            ob_flush();
        }
        flush();
    }
}Http\Controllers\Admin;

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

    public function start()
    {
        return response()->stream(function () {
            $this->sendUpdateLog("Starting system update...", 10);

            if (!function_exists('proc_open')) {
                $this->sendUpdateLog("Error: proc_open is disabled. Cannot run update commands.", 100, 'error');
                return;
            }

            // 1. Git Pull
            $this->sendUpdateLog("Fetching latest code from repository...", 20);
            $pull = Process::path(base_path())->run('git pull origin main');
            
            if ($pull->successful()) {
                $this->sendUpdateLog($pull->output());
                $this->sendUpdateLog("Code updated successfully.", 40, 'success');
            } else {
                $this->sendUpdateLog("Git pull failed: " . $pull->errorOutput(), 40, 'error');
                return; // Stop if pull fails
            }

            // 2. Migrate
            $this->sendUpdateLog("Running database migrations...", 50);
            $migrate = Process::path(base_path())->run('php artisan migrate --force');
            if ($migrate->successful()) {
                $this->sendUpdateLog($migrate->output());
                $this->sendUpdateLog("Database migrated.", 70, 'success');
            } else {
                $this->sendUpdateLog("Migration failed: " . $migrate->errorOutput(), 70, 'error');
            }

            // 3. Optimize Clear
            $this->sendUpdateLog("Clearing system caches...", 80);
            $optimize = Process::path(base_path())->run('php artisan optimize:clear');
            $this->sendUpdateLog($optimize->output());

            // 4. Reload Config Cache (Production)
            if (app()->environment('production')) {
                $this->sendUpdateLog("Caching configuration...", 90);
                Process::path(base_path())->run('php artisan config:cache');
                Process::path(base_path())->run('php artisan route:cache');
                Process::path(base_path())->run('php artisan view:cache');
            }

            $this->sendUpdateLog("System update completed successfully.", 100, 'success');
            $this->sendUpdateLog("Refresing session...", 100, 'done');

        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    private function sendUpdateLog($message, $progress = null, $status = 'info')
    {
        $data = [
            'message' => trim($message),
            'progress' => $progress,
            'status' => $status,
            'timestamp' => now()->toTimeString(),
        ];
        
        echo "data: " . json_encode($data) . "\n\n";
        
        if (ob_get_level() > 0) {
            ob_flush();
        }
        flush();
    }
}