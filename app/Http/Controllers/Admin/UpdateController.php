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
    // GitHub API endpoints for version checking
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
        // Set execution time to 5 minutes for slow hosting
        set_time_limit(300);

        return response()->stream(function () {
            // Disable all buffering
            while (ob_get_level() > 0) ob_end_flush();
            ini_set('output_buffering', 'off');
            ini_set('zlib.output_compression', false);
            header('X-Accel-Buffering: no'); // For Nginx
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            flush();

            // Send a bit of padding to force some proxy buffers to flush
            echo ":" . str_repeat(" ", 2048) . "\n\n";
            flush();

            $this->sendUpdateLog("Establishing secure link with repository...", 5);
            flush();

            $this->sendUpdateLog("Starting system update...", 10);
            flush();

            if (!function_exists('proc_open')) {
                $this->sendUpdateLog("Error: proc_open is disabled. Cannot run update commands.", 100, 'error');
                return;
            }

            // 1. Git Update (Force Reset to match Remote)
            $this->sendUpdateLog("Fetching latest code from repository...", 20);
            $fetch = Process::path(base_path())->run('git fetch origin main');
            
            if ($fetch->successful()) {
                $this->sendUpdateLog("Synchronizing local files...", 25);
                $reset = Process::path(base_path())->run('git reset --hard origin/main');
                
                if (!$reset->successful()) {
                    $this->sendUpdateLog("Sync failed: " . $reset->errorOutput(), 25, 'error');
                    return;
                }

                $this->sendUpdateLog("Code updated successfully.", 30, 'success');

                // 1.5 Update .env intelligently
                $this->sendUpdateLog("Updating configuration...", 35);
                try {
                    $envPath = base_path('.env');
                    $examplePath = base_path('.env.example');

                    if (File::exists($envPath) && File::exists($examplePath)) {
                        
                        if (!is_writable($envPath)) {
                            $this->sendUpdateLog("CRITICAL: .env file is not writable. Check permissions.", 36, 'error');
                        }

                        $envContent = File::get($envPath);
                        $exampleContent = File::get($examplePath);

                        // Parse .env into lines
                        $envLines = explode("\n", $envContent);
                        
                        // Parse .env.example to get new keys and version
                        preg_match_all('/^([A-Z0-9_]+)=(.*)$/m', $exampleContent, $matches, PREG_SET_ORDER);
                        $exampleKeys = [];
                        $newVersion = null;

                        foreach ($matches as $match) {
                            $key = $match[1];
                            $value = $match[2];
                            $exampleKeys[$key] = $value;
                            if ($key === 'APP_VERSION') {
                                $newVersion = trim($value);
                            }
                        }

                        // Check for existing keys in .env
                        $existingKeys = [];
                        foreach ($envLines as $line) {
                            if (preg_match('/^\s*([A-Z0-9_]+)=/', $line, $match)) {
                                $existingKeys[] = $match[1];
                            }
                        }

                        $updatedEnvContent = $envContent;
                        $hasChanges = false;

                        // Append new keys
                        foreach ($exampleKeys as $key => $value) {
                            if (!in_array($key, $existingKeys)) {
                                $updatedEnvContent = rtrim($updatedEnvContent) . "\n{$key}={$value}\n";
                                $hasChanges = true;
                                $this->sendUpdateLog("Added new configuration key: {$key}", 36);
                            }
                        }

                        // Update APP_VERSION with a more flexible regex
                        if ($newVersion) {
                            $this->sendUpdateLog("Remote version detected: {$newVersion}", 37);
                            $pattern = '/^\s*APP_VERSION\s*=\s*.*$/m';
                            if (preg_match($pattern, $updatedEnvContent)) {
                                $updatedEnvContent = preg_replace($pattern, "APP_VERSION={$newVersion}", $updatedEnvContent);
                                $hasChanges = true;
                            } else {
                                $updatedEnvContent = rtrim($updatedEnvContent) . "\nAPP_VERSION={$newVersion}\n";
                                $hasChanges = true;
                            }
                        }

                        if ($hasChanges) {
                            File::put($envPath, $updatedEnvContent);
                            $this->sendUpdateLog("Local .env file has been synchronized.", 39, 'success');
                            
                            // CRITICAL: Clear config cache immediately using PHP binary
                            $php = defined('PHP_BINARY') ? PHP_BINARY : 'php';
                            $clear = Process::path(base_path())->run("$php artisan config:clear");
                            $this->sendUpdateLog("System cache reset: " . ($clear->successful() ? 'OK' : 'FAILED'), 40);
                        } else {
                            $this->sendUpdateLog("Configuration is already optimal.", 40);
                        }
                    }
                } catch (\Exception $e) {
                    $this->sendUpdateLog("Config Sync Error: " . $e->getMessage(), 40, 'error');
                }

            } else {
                $this->sendUpdateLog("Git pull failed: " . $fetch->errorOutput(), 40, 'error');
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

    public function installDependencies()
    {
        set_time_limit(600); // 10 minutes

        return response()->stream(function () {
            while (ob_get_level() > 0) ob_end_flush();
            ini_set('output_buffering', 'off');
            ini_set('zlib.output_compression', false);
            header('X-Accel-Buffering: no');
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            flush();

            $this->sendUpdateLog("Initializing Composer Dependency Manager...", 10);
            flush();

            if (!function_exists('proc_open')) {
                $this->sendUpdateLog("Error: proc_open is disabled.", 100, 'error');
                return;
            }

            $this->sendUpdateLog("Installing PHP dependencies (this may take time)...", 30);
            $composer = Process::path(base_path())->run('composer install --no-dev --optimize-autoloader');
            
            if ($composer->successful()) {
                $this->sendUpdateLog($composer->output());
                $this->sendUpdateLog("Dependencies installed successfully.", 100, 'success');
                $this->sendUpdateLog("Process complete.", 100, 'done');
            } else {
                $this->sendUpdateLog("Composer failed: " . $composer->errorOutput(), 100, 'error');
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    public function buildAssets()
    {
        set_time_limit(900); // 15 minutes

        return response()->stream(function () {
            while (ob_get_level() > 0) ob_end_flush();
            ini_set('output_buffering', 'off');
            ini_set('zlib.output_compression', false);
            header('X-Accel-Buffering: no');
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            flush();

            $this->sendUpdateLog("Initializing Node.js Asset Compiler...", 10);
            flush();

            if (!file_exists(base_path('package.json'))) {
                $this->sendUpdateLog("Error: package.json not found.", 100, 'error');
                return;
            }

            // Check npm
            $npmCheck = Process::run('npm -v');
            if (!$npmCheck->successful()) {
                $this->sendUpdateLog("Error: npm is not available on this server.", 100, 'error');
                return;
            }

            $this->sendUpdateLog("Installing Node modules...", 30);
            $npmInstall = Process::path(base_path())->run('npm install');
            
            if ($npmInstall->successful()) {
                $this->sendUpdateLog("Modules installed. Compiling assets (Vite)...", 60);
                $npmBuild = Process::path(base_path())->run('npm run build');
                
                if ($npmBuild->successful()) {
                    $this->sendUpdateLog($npmBuild->output());
                    $this->sendUpdateLog("Assets compiled successfully.", 100, 'success');
                    $this->sendUpdateLog("Process complete.", 100, 'done');
                } else {
                    $this->sendUpdateLog("Build failed: " . $npmBuild->errorOutput(), 100, 'error');
                }
            } else {
                $this->sendUpdateLog("npm install failed: " . $npmInstall->errorOutput(), 100, 'error');
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    public function migrate()
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

    public function migrate()
    {
        set_time_limit(300);

        return response()->stream(function () {
            while (ob_get_level() > 0) ob_end_flush();
            ini_set('output_buffering', 'off');
            ini_set('zlib.output_compression', false);
            header('X-Accel-Buffering: no');
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            flush();

            $this->sendUpdateLog("Initializing database migration protocol...", 10);
            flush();

            try {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                $output = \Illuminate\Support\Facades\Artisan::output();
                
                $this->sendUpdateLog($output);
                $this->sendUpdateLog("Schema update executed successfully.", 100, 'success');
                $this->sendUpdateLog("System optimal.", 100, 'done');
            } catch (\Exception $e) {
                $this->sendUpdateLog("Migration failed: " . $e->getMessage(), 100, 'error');
            }
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