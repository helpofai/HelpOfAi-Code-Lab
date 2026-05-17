<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Hash;

class SetupController extends Controller
{
    public function index()
    {
        $envExists = File::exists(base_path('.env'));
        $appKeySet = config('app.key') && config('app.key') !== 'base64:';

        // Check current DB connection status
        $dbConnected = false;
        try {
            DB::connection()->getPdo();
            $dbConnected = true;
        } catch (\Exception $e) {}

        return view('setup.index', [
            'envExists' => $envExists,
            'appKeySet' => $appKeySet,
            'dbConnected' => $dbConnected,
            'phpVersion' => PHP_VERSION,
            'requirements' => $this->getRequirements(),
            'currentEnv' => [
                'app_name' => config('app.name'),
                'app_url' => config('app.url'),
                'db_host' => config('database.connections.mysql.host'),
                'db_name' => config('database.connections.mysql.database'),
                'db_user' => config('database.connections.mysql.username'),
            ]
        ]);
    }

    private function getRequirements()
    {
        return [
            'PHP >= 8.2' => version_compare(PHP_VERSION, '8.2', '>='),
            'BCMath' => extension_loaded('bcmath'),
            'Ctype' => extension_loaded('ctype'),
            'Fileinfo' => extension_loaded('fileinfo'),
            'JSON' => extension_loaded('json'),
            'Mbstring' => extension_loaded('mbstring'),
            'OpenSSL' => extension_loaded('openssl'),
            'PDO' => extension_loaded('pdo'),
            'Tokenizer' => extension_loaded('tokenizer'),
            'XML' => extension_loaded('xml'),
            'GD' => extension_loaded('gd'),
            'Storage Writable' => is_writable(storage_path()),
            'Bootstrap Writable' => is_writable(base_path('bootstrap/cache')),
            'Node.js' => $this->resolveBinaryPath('node', 'NODE_BINARY', true) !== null,
            'NPM' => $this->resolveBinaryPath('npm', 'NPM_BINARY', true) !== null,
        ];
    }

    private function updateEnvKey($key, $value)
    {
        try {
            $envPath = base_path('.env');
            if (!File::exists($envPath)) return false;

            $content = File::get($envPath);
            $pattern = "/^{$key}=.*$/m";
            $newLine = "{$key}=\"{$value}\"";

            if (preg_match($pattern, $content)) {
                $content = preg_replace($pattern, $newLine, $content);
            } else {
                $content = rtrim($content) . "\n" . $newLine . "\n";
            }

            File::put($envPath, $content);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function resolveBinaryPath($name, $envKey, $autoSave = false)
    {
        $envValue = env($envKey);
        if ($envValue && File::exists($envValue)) return $envValue;

        $check = \Illuminate\Support\Facades\Process::run("{$name} -v");
        if ($check->successful()) return $name;

        $commonPaths = [
            "/usr/local/bin/{$name}", "/usr/bin/{$name}", "/opt/node/bin/{$name}",
            "/usr/local/nodejs/bin/{$name}",
            "/opt/alt/node" . config('app.node_version', '20') . "/usr/bin/{$name}",
        ];

        foreach ($commonPaths as $path) {
            if (File::exists($path)) {
                if ($autoSave) $this->updateEnvKey($envKey, $path);
                return $path;
            }
        }

        return null;
    }

    public function saveEnv(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string',
            'app_url' => 'required|url',
            'db_host' => 'required|string',
            'db_name' => 'required|string',
            'db_user' => 'required|string',
            'db_pass' => 'nullable|string',
        ]);

        try {
            $envPath = base_path('.env');
            $examplePath = base_path('.env.example');

            if (!File::exists($envPath)) {
                File::copy($examplePath, $envPath);
            }

            $content = File::get($envPath);
            
            $changes = [
                'APP_NAME' => $validated['app_name'],
                'APP_URL' => $validated['app_url'],
                'DB_HOST' => $validated['db_host'],
                'DB_DATABASE' => $validated['db_name'],
                'DB_USERNAME' => $validated['db_user'],
                'DB_PASSWORD' => $validated['db_pass'] ?? '',
            ];

            foreach ($changes as $key => $value) {
                $content = preg_replace("/^{$key}=.*$/m", "{$key}=\"{$value}\"", $content);
            }

            File::put($envPath, $content);
            
            // Clear config cache to apply changes
            Artisan::call('config:clear');

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkDb(Request $request)
    {
        try {
            // Attempt a fresh connection with provided credentials
            config([
                'database.connections.mysql.host' => $request->db_host,
                'database.connections.mysql.database' => $request->db_name,
                'database.connections.mysql.username' => $request->db_user,
                'database.connections.mysql.password' => $request->db_pass ?? '',
            ]);
            
            DB::purge('mysql');
            DB::connection('mysql')->getPdo();
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createAdmin(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        try {
            User::updateOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $validated['name'],
                    'password' => Hash::make($validated['password']),
                    'role' => User::ROLE_ADMIN,
                ]
            );

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function finish(Request $request)
    {
        try {
            if ($request->site_name) {
                SiteSetting::set('site_name', $request->site_name, 'branding');
            }
            
            Artisan::call('optimize');
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function run(Request $request)
    {
        $command = $request->input('command');
        $allowedCommands = [
            'key:generate', 'migrate', 'migrate:fresh', 'db:seed', 
            'optimize:clear', 'storage:link', 'config:cache', 
            'route:cache', 'view:cache', 'composer:install',
            'npm:install', 'npm:build'
        ];

        if (!in_array($command, $allowedCommands)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        set_time_limit(600);

        return response()->stream(function () use ($command) {
            try {
                $php = defined('PHP_BINARY') ? PHP_BINARY : 'php';
                $artisan = base_path('artisan');

                if ($command === 'composer:install') {
                    $this->runComposerInstall($php);
                    return;
                }

                if (str_starts_with($command, 'npm:')) {
                    $this->runNpmCommand(str_replace('npm:', '', $command));
                    return;
                }

                if (function_exists('proc_open')) {
                    $fullCommand = "{$php} {$artisan} {$command} --force --no-interaction";

                    \Illuminate\Support\Facades\Process::path(base_path())
                        ->timeout(600)
                        ->run($fullCommand, function (string $type, string $output) {
                            $lines = explode("\n", $output);
                            foreach ($lines as $line) {
                                if (trim($line) !== '') $this->sendEvent($line, 'success');
                            }
                        });
                    $this->sendEvent('Command finished.', 'done');
                } else {
                    Artisan::call($command, ['--force' => true]);
                    $this->sendEvent(Artisan::output(), 'success');
                    $this->sendEvent('Command finished.', 'done');
                }
            } catch (\Exception $e) {
                $this->sendEvent('Error: ' . $e->getMessage(), 'error');
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    private function runComposerInstall($php)
    {
        $this->sendEvent("Initializing Composer Dependency Manager...", 'info');
        
        $composerBinary = 'composer';
        $globalCheck = \Illuminate\Support\Facades\Process::run('composer --version');
        
        if (!$globalCheck->successful()) {
            $this->sendEvent("Global 'composer' missing. Checking local binary...", 'info');
            
            if (File::exists(base_path('composer.phar'))) {
                $composerBinary = "{$php} " . base_path('composer.phar');
                $this->updateEnvKey('COMPOSER_BINARY', $composerBinary);
                $this->sendEvent("Local 'composer.phar' detected. Path persisted.", 'success');
            } else {
                $this->sendEvent("Downloading 'composer.phar' from getcomposer.org...", 'info');
                try {
                    $response = \Illuminate\Support\Facades\Http::timeout(30)->get('https://getcomposer.org/composer.phar');
                    if ($response->successful()) {
                        File::put(base_path('composer.phar'), $response->body());
                        @chmod(base_path('composer.phar'), 0755);
                        $composerBinary = "{$php} " . base_path('composer.phar');
                        $this->updateEnvKey('COMPOSER_BINARY', $composerBinary);
                        $this->sendEvent("Composer binary downloaded and path persisted.", 'success');
                    } else {
                        throw new \Exception("Server error during download.");
                    }
                } catch (\Exception $e) {
                    $this->sendEvent("Download failed: " . $e->getMessage(), 'error');
                    $this->sendEvent("Action: Manually upload 'composer.phar' to root.", 'error');
                    return;
                }
            }
        }

        $this->sendEvent("Installing PHP dependencies...", 'info');
        \Illuminate\Support\Facades\Process::path(base_path())
            ->timeout(600)
            ->run("{$composerBinary} install --no-dev --optimize-autoloader", function ($type, $output) {
                $this->sendEvent($output, 'success');
            });
        
        $this->sendEvent('Composer install finished.', 'done');
    }

    private function runNpmCommand($action)
    {
        $this->sendEvent("Initializing Node.js Asset Compiler ({$action})...", 'info');
        
        $npmBinary = $this->resolveBinaryPath('npm', 'NPM_BINARY', true);
        
        if (!$npmBinary) {
            $this->sendEvent("Error: NPM is not available on this server.", 'error');
            $this->sendEvent("Action: Set 'NPM_BINARY' in your .env or upload 'public/build' manually.", 'error');
            return;
        }

        $this->sendEvent("Using NPM binary: {$npmBinary}", 'success');
        
        $command = "{$npmBinary} " . ($action === 'install' ? 'install' : 'run build');
        
        \Illuminate\Support\Facades\Process::path(base_path())
            ->timeout(900)
            ->run($command, function ($type, $output) {
                $this->sendEvent($output, 'success');
            });
            
        $this->sendEvent("NPM {$action} finished.", 'done');
    }

    private function sendEvent($message, $status = 'info')
    {
        echo "data: " . json_encode([
            'message' => $message,
            'status' => $status,
            'timestamp' => date('H:i:s'),
        ]) . "\n\n";
        if (ob_get_level() > 0) ob_flush();
        flush();
    }
}

