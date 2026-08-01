<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use ZipArchive;

/**
 * Advanced Laravel License Manager & OTA Updater (Standalone)
 * Register this in app/Http/Kernel.php under $middleware
 */
class VerifyProductLicense
{
    private $apiUrl = 'YOUR_MARKETPLACE_URL_HERE/api/licenses/validate';

    public function handle($request, Closure $next)
    {
        $licenseKey = env('HELP_OF_AI_LICENSE_KEY');
        $cacheKey = 'hoai_license_data';

        // 1. Handle Activation Form Submission
        if ($request->isMethod('post') && $request->has('hoai_license_key')) {
            return $this->processActivation($request->input('hoai_license_key'), $cacheKey);
        }

        // 2. Handle OTA Update Trigger
        if ($request->isMethod('post') && $request->has('trigger_ota_update')) {
            return $this->processOtaUpdate($cacheKey);
        }

        // 3. Verify License (Cache for 24 hours)
        $licenseData = Cache::remember($cacheKey, 86400, function () use ($licenseKey) {
            if (!$licenseKey) return null;
            
            try {
                $response = Http::timeout(5)->post($this->apiUrl, [
                    'license_key' => $licenseKey,
                    'domain' => request()->getHost()
                ]);
                return $response->json();
            } catch (\Exception $e) {
                // Fail open temporarily if validation server is down (only if they had a key)
                return ['valid' => true, 'offline_mode' => true]; 
            }
        });

        // 4. Enforce Lock Screen UI if invalid
        if (!$licenseData || empty($licenseData['valid'])) {
            return response($this->getActivationUI($licenseData['message'] ?? null), 403);
        }

        // 5. Render License Dashboard (Hidden Route)
        if ($request->query('license_dashboard')) {
            return response($this->getDashboardUI($licenseData));
        }

        return $next($request);
    }

    private function processActivation($key, $cacheKey)
    {
        try {
            $response = Http::post($this->apiUrl, [
                'license_key' => $key,
                'domain' => request()->getHost()
            ]);

            $data = $response->json();

            if (!empty($data['valid'])) {
                // Save to .env dynamically
                $envFile = app()->environmentFilePath();
                $envContent = file_get_contents($envFile);
                if (strpos($envContent, 'HELP_OF_AI_LICENSE_KEY=') !== false) {
                    $envContent = preg_replace('/^HELP_OF_AI_LICENSE_KEY=.*$/m', 'HELP_OF_AI_LICENSE_KEY=' . $key, $envContent);
                } else {
                    $envContent .= "\nHELP_OF_AI_LICENSE_KEY=" . $key . "\n";
                }
                file_put_contents($envFile, $envContent);
                
                Cache::put($cacheKey, $data, 86400);
                return redirect(request()->fullUrl());
            }

            return response($this->getActivationUI($data['message'] ?? 'Invalid License Key.'), 403);
        } catch (\Exception $e) {
            return response($this->getActivationUI('Failed to connect to license server.'), 500);
        }
    }

    private function processOtaUpdate($cacheKey)
    {
        $data = Cache::get($cacheKey);
        if (empty($data['download_url'])) return response()->json(['error' => 'No update URL found.'], 400);

        try {
            // Download ZIP
            $zipContent = Http::timeout(60)->get($data['download_url'])->body();
            $zipPath = storage_path('app/temp_update.zip');
            File::put($zipPath, $zipContent);

            // Extract ZIP over base path
            $zip = new ZipArchive;
            if ($zip->open($zipPath) === TRUE) {
                $zip->extractTo(base_path());
                $zip->close();
                File::delete($zipPath);

                // Clear caches and run migrations automatically
                Artisan::call('cache:clear');
                Artisan::call('migrate', ['--force' => true]);

                Cache::forget($cacheKey); // Force re-fetch next reload
                return response()->json(['success' => true]);
            }
            return response()->json(['error' => 'Failed to extract update package.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    private function getActivationUI($error = null)
    {
        $errorHtml = $error ? "<div class='bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100'>{$error}</div>" : '';
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head><title>Product Activation</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
                <h2 class="text-2xl font-black text-gray-800 mb-2">Activate Product</h2>
                <p class="text-sm text-gray-500 mb-6">This Laravel application requires a valid license key.</p>
                {$errorHtml}
                <form method="POST">
                    <input type="hidden" name="_token" value="{$this->csrfToken()}">
                    <input type="text" name="hoai_license_key" class="w-full border border-gray-300 rounded-lg p-3 mb-4 font-mono focus:ring-2 focus:ring-blue-500 outline-none" placeholder="XXXX-XXXX-XXXX-XXXX" required>
                    <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Verify & Activate</button>
                </form>
            </div>
        </body>
        </html>
        HTML;
    }

    private function getDashboardUI($data)
    {
        $updateHtml = '';
        if (isset($data['version'], $data['latest_version']) && version_compare($data['version'], $data['latest_version'], '<')) {
            $updateHtml = <<<HTML
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 flex justify-between items-center">
                <div>
                    <h3 class="text-amber-800 font-bold">Update Available: v{$data['latest_version']}</h3>
                    <p class="text-amber-600 text-sm">A new version of this product is available for 1-click install.</p>
                </div>
                <button onclick="installUpdate()" id="updateBtn" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm">Install Update</button>
            </div>
            HTML;
        }

        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head><title>License Dashboard</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-gray-100 p-8">
            <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h1 class="text-2xl font-black mb-6 text-gray-800">System Dashboard</h1>
                {$updateHtml}
                <div class="bg-gradient-to-r from-emerald-500 to-teal-400 text-white p-6 rounded-xl mb-6 shadow-lg">
                    <h3 class="font-black text-xl">{$data['product_name']}</h3>
                    <p class="text-emerald-50 text-sm">Activated & Verified</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p class="text-xs font-bold text-gray-400 uppercase">Author</p>
                        <p class="font-bold text-gray-800">{$data['author_name']}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p class="text-xs font-bold text-gray-400 uppercase">Current Version</p>
                        <p class="font-bold text-gray-800">v{$data['version']}</p>
                    </div>
                </div>
                <a href="?" class="mt-6 inline-block text-blue-600 hover:underline font-bold">Return to Application</a>
            </div>
            <script>
            function installUpdate() {
                const btn = document.getElementById('updateBtn');
                btn.innerText = 'Downloading & Installing...';
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
                
                fetch('?', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: '_token={$this->csrfToken()}&trigger_ota_update=1'
                }).then(r => r.json()).then(data => {
                    if (data.success) {
                        alert('Update installed successfully!');
                        window.location.reload();
                    } else {
                        alert('Error: ' + data.error);
                        window.location.reload();
                    }
                }).catch(() => {
                    alert('Network error during update.');
                    window.location.reload();
                });
            }
            </script>
        </body>
        </html>
        HTML;
    }

    private function csrfToken() {
        return session()->token() ?? '';
    }
}
