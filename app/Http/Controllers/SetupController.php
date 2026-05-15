<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class SetupController extends Controller
{
    public function index()
    {
        // Safety: If the app is already installed and configured, we might want to restrict this.
        // But for a first-time setup, we need it open.
        // We'll check if .env exists and has APP_KEY to decide the "state".
        $envExists = File::exists(base_path('.env'));
        $appKeySet = config('app.key') && config('app.key') !== 'base64:';

        return view('setup.index', [
            'envExists' => $envExists,
            'appKeySet' => $appKeySet,
            'phpVersion' => PHP_VERSION,
            'extensions' => [
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
            ]
        ]);
    }

    public function run(Request $request)
    {
        $command = $request->input('command');
        
        // Define allowed commands for safety
        $allowedCommands = [
            'key:generate',
            'migrate',
            'migrate:fresh',
            'db:seed',
            'optimize:clear',
            'storage:link',
            'config:cache',
            'route:cache',
            'view:cache',
        ];

        if (!in_array($command, $allowedCommands)) {
            return response()->json(['error' => 'Unauthorized command'], 403);
        }

        // Set execution time for long processes
        set_time_limit(600);

        return response()->stream(function () use ($command) {
            $this->sendEvent('Establishing connection with system kernel...', 'info');
            $this->sendEvent('Executing: php artisan ' . $command, 'info');

            try {
                // Check if proc_open is available for real-time process streaming
                if (function_exists('proc_open')) {
                    $php = defined('PHP_BINARY') ? PHP_BINARY : 'php';
                    // We use the full path to artisan to ensure it works in all environments
                    $artisan = base_path('artisan');
                    $fullCommand = "{$php} {$artisan} {$command} --force --no-interaction";

                    \Illuminate\Support\Facades\Process::path(base_path())
                        ->timeout(600)
                        ->run($fullCommand, function (string $type, string $output) {
                            // Split output by lines to send them individually for a better terminal feel
                            $lines = explode("\n", $output);
                            foreach ($lines as $line) {
                                if (trim($line) !== '') {
                                    $this->sendEvent($line, 'success');
                                }
                            }
                        });
                    
                    $this->sendEvent('Process cycle completed.', 'done');
                } else {
                    // Fallback to Artisan::call if proc_open is disabled (common on some shared hosting)
                    $this->sendEvent('Notice: Real-time streaming limited. Running command in batch mode...', 'info');
                    Artisan::call($command, ['--force' => true]);
                    $output = Artisan::output();
                    
                    $lines = explode("\n", $output);
                    foreach ($lines as $line) {
                        if (trim($line) !== '') {
                            $this->sendEvent($line, 'success');
                        }
                    }
                    $this->sendEvent('Batch command finished.', 'done');
                }
            } catch (\Exception $e) {
                $this->sendEvent('CRITICAL_FAILURE: ' . $e->getMessage(), 'error');
                Log::error('Setup command failed: ' . $e->getMessage());
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }

    private function sendEvent($message, $status = 'info')
    {
        echo "data: " . json_encode([
            'message' => $message,
            'status' => $status,
            'timestamp' => date('H:i:s'),
        ]) . "\n\n";
        
        if (ob_get_level() > 0) {
            ob_flush();
        }
        flush();
    }
}
