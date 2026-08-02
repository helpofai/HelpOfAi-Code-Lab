import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { FileCode, ShieldAlert, Key, Download, CheckCircle2, Copy } from "lucide-react";
import { Prism } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism/index.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
const wordpressSnippetRaw = `<?php
/**
 * Advanced License Protection for WordPress (With Built-in UI)
 * Paste this in functions.php or your core plugin file.
 */

class HelpOFAILicenseManager {
    
    private $api_url = 'YOUR_MARKETPLACE_URL_HERE/api/licenses/validate';
    
    // For Themes: use the folder name (e.g., 'my-theme')
    // For Plugins: use the plugin basename (e.g., 'my-plugin/my-plugin.php')
    private $product_id = 'your-product-slug';
    private $is_plugin = true; // Set to false if this is a theme
    
    public function __construct() {
        add_action('admin_menu', [$this, 'add_license_menu']);
        add_action('wp_ajax_verify_helpofai_license', [$this, 'verify_license_ajax']);
        add_action('template_redirect', [$this, 'enforce_license_lock']);
        
        // Native WordPress Auto-Updater Hooks
        if ($this->is_plugin) {
            add_filter('pre_set_site_transient_update_plugins', [$this, 'check_for_updates']);
            add_filter('plugins_api', [$this, 'plugin_details_popup'], 10, 3);
        } else {
            add_filter('pre_set_site_transient_update_themes', [$this, 'check_for_updates']);
        }
    }

    // NATIVE OTA UPDATER: Hooks into WordPress Core Updater
    public function check_for_updates($transient) {
        if (empty($transient->checked)) return $transient;

        $data = get_option('helpofai_license_data', []);
        
        if (isset($data['latest_version'], $data['version'], $data['download_url']) 
            && version_compare($data['version'], $data['latest_version'], '<')) {
            
            $response = new stdClass();
            $response->slug = dirname($this->product_id); // e.g. 'my-plugin'
            $response->plugin = $this->product_id; // e.g. 'my-plugin/my-plugin.php'
            $response->new_version = $data['latest_version'];
            $response->package = $data['download_url']; 
            $response->url = 'https://your-marketplace.com';
            
            if ($this->is_plugin) {
                $transient->response[$this->product_id] = $response;
            } else {
                $transient->response[$this->product_id] = (array) $response;
            }
        }
        
        return $transient;
    }

    // Handles the "View version x.x details" popup for plugins
    public function plugin_details_popup($false, $action, $args) {
        if ($action !== 'plugin_information' || $args->slug !== dirname($this->product_id)) {
            return $false;
        }

        $data = get_option('helpofai_license_data', []);
        
        $response = new stdClass();
        $response->name = $data['product_name'] ?? 'Premium Plugin';
        $response->slug = $args->slug;
        $response->version = $data['latest_version'] ?? '1.0.0';
        $response->author = $data['author_name'] ?? 'HelpOfAI Vendor';
        $response->homepage = 'https://your-marketplace.com';
        $response->download_link = $data['download_url'] ?? '';
        $response->sections = [
            'description' => 'This is a premium plugin verified by HelpOfAI Licensing.',
            'changelog' => 'Automatic OTA update from HelpOfAI Marketplace.'
        ];

        return $response;
    }

    // 1. Add WordPress Admin Menu
    public function add_license_menu() {
        add_menu_page(
            'Product License',
            'License',
            'manage_options',
            'helpofai-license',
            [$this, 'render_license_ui'],
            'dashicons-shield',
            99
        );
    }

    // 2. The Built-in UI Engine
    public function render_license_ui() {
        $status = get_option('helpofai_license_status', 'unverified');
        $data = get_option('helpofai_license_data', []);
        
        ?>
        <div class="wrap">
            <script src="https://cdn.tailwindcss.com"><\/script>
            <script src="https://unpkg.com/lucide@latest"><\/script>
            <style>
                .glass-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 2rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                #wpcontent { background: #f3f4f6; }
            </style>
            
            <div class="max-w-4xl mx-auto mt-8">
                <div class="glass-panel">
                    <div class="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                        <i data-lucide="shield-check" class="w-10 h-10 text-blue-600"></i>
                        <div>
                            <h1 class="text-2xl font-black text-gray-800 m-0">License Management</h1>
                            <p class="text-gray-500 m-0 mt-1">Activate your premium product</p>
                        </div>
                    </div>

                    <?php if ($status !== 'valid'): ?>
                        <!-- Activation Form -->
                        <div id="activation-box">
                            <h2 class="text-lg font-bold text-gray-800 mb-2">Enter License Key</h2>
                            <p class="text-gray-500 mb-6 text-sm">Paste the key you received after purchase.</p>
                            
                            <div class="flex gap-4">
                                <input type="text" id="license_key" class="flex-1 border-gray-300 rounded-lg shadow-sm" placeholder="XXXX-XXXX-XXXX-XXXX">
                                <button id="verify-btn" onclick="verifyLicense()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                                    <i data-lucide="key" class="w-4 h-4"></i> Activate
                                </button>
                            </div>
                            <p id="error-msg" class="text-red-500 mt-4 text-sm font-bold hidden"></p>
                        </div>
                    <?php else: ?>
                        <!-- Verified Dashboard -->
                        <div class="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl p-6 text-white mb-6 flex justify-between items-center shadow-lg">
                            <div class="flex items-center gap-4">
                                <i data-lucide="check-circle" class="w-8 h-8"></i>
                                <div>
                                    <h3 class="font-black text-xl m-0">Product Activated</h3>
                                    <p class="text-emerald-50 text-sm m-0"><?php echo esc_html($data['product_name'] ?? 'Premium Product'); ?></p>
                                </div>
                            </div>
                            <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Valid License</span>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase">Licensed To</p>
                                <p class="font-bold text-gray-800"><?php echo esc_html($_SERVER['HTTP_HOST']); ?></p>
                                <p class="text-xs text-gray-500 mt-1">Author: <?php echo esc_html($data['author_name'] ?? 'Unknown'); ?></p>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase">Version</p>
                                <p class="font-bold text-gray-800">Current: v<?php echo esc_html($data['version'] ?? '1.0'); ?></p>
                                <?php if(isset($data['latest_version']) && $data['latest_version'] !== $data['version']): ?>
                                    <p class="text-xs text-purple-600 font-bold mt-1">Update Available: v<?php echo esc_html($data['latest_version']); ?></p>
                                <?php endif; ?>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase">Support Expiry</p>
                                <p class="font-bold text-gray-800"><?php echo esc_html($data['support_expires_at'] ?? 'Lifetime'); ?></p>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p class="text-xs font-bold text-gray-400 uppercase">Last Sync</p>
                                <p class="font-bold text-gray-800"><?php echo esc_html($data['last_sync'] ?? 'Just now'); ?></p>
                                <p class="text-xs text-gray-500 font-mono mt-1">Build: <?php echo esc_html($data['build_hash'] ?? 'N/A'); ?></p>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <script>
                lucide.createIcons();
                
                function verifyLicense() {
                    const key = document.getElementById('license_key').value;
                    const btn = document.getElementById('verify-btn');
                    const err = document.getElementById('error-msg');
                    
                    btn.innerHTML = 'Validating...';
                    err.classList.add('hidden');
                    
                    fetch(ajaxurl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'action=verify_helpofai_license&key=' + encodeURIComponent(key)
                    })
                    .then(r => r.json())
                    .then(res => {
                        if (res.success) {
                            window.location.reload();
                        } else {
                            err.innerText = res.data.message || 'Invalid License Key';
                            err.classList.remove('hidden');
                            btn.innerHTML = '<i data-lucide="key" class="w-4 h-4"></i> Activate';
                            lucide.createIcons();
                        }
                    })
                    .catch(() => {
                        err.innerText = 'Network error during validation.';
                        err.classList.remove('hidden');
                        btn.innerHTML = '<i data-lucide="key" class="w-4 h-4"></i> Activate';
                        lucide.createIcons();
                    });
                }
            <\/script>
        </div>
        <?php
    }

    // 3. AJAX Handler
    public function verify_license_ajax() {
        if (!current_user_can('manage_options')) wp_die();
        
        $key = sanitize_text_field($_POST['key']);
        $domain = $_SERVER['HTTP_HOST'];
        
        $response = wp_remote_post($this->api_url, [
            'body' => [ 'license_key' => $key, 'domain' => $domain ]
        ]);
        
        if (is_wp_error($response)) {
            wp_send_json_error(['message' => 'API Connection Failed']);
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (isset($body['valid']) && $body['valid']) {
            update_option('helpofai_license_status', 'valid');
            update_option('helpofai_license_data', $body);
            delete_option('theme_locked_status');
            wp_send_json_success();
        } else {
            update_option('helpofai_license_status', 'invalid');
            update_option('theme_locked_status', true);
            wp_send_json_error(['message' => 'Invalid or expired license.']);
        }
    }

    // 4. Frontend Lock
    public function enforce_license_lock() {
        if (get_option('theme_locked_status')) {
            wp_die('<h1 style="color:red;">Site Locked</h1><p>Invalid product license.</p>', 'License Lock', ['response' => 403]);
        }
    }
}

new HelpOFAILicenseManager();
`;
const laravelSnippetRaw = `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\File;
use Illuminate\\Support\\Facades\\Artisan;
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
            } catch (\\Exception $e) {
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
                    $envContent .= "\\nHELP_OF_AI_LICENSE_KEY=" . $key . "\\n";
                }
                file_put_contents($envFile, $envContent);
                
                Cache::put($cacheKey, $data, 86400);
                return redirect(request()->fullUrl());
            }

            return response($this->getActivationUI($data['message'] ?? 'Invalid License Key.'), 403);
        } catch (\\Exception $e) {
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
        } catch (\\Exception $e) {
            return response()->json(['error' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    private function getActivationUI($error = null)
    {
        $errorHtml = $error ? "<div class='bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100'>{$error}</div>" : '';
        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head><title>Product Activation</title><script src="https://cdn.tailwindcss.com"><\/script></head>
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
        <head><title>License Dashboard</title><script src="https://cdn.tailwindcss.com"><\/script></head>
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
            <\/script>
        </body>
        </html>
        HTML;
    }

    private function csrfToken() {
        return session()->token() ?? '';
    }
}
`;
const nodejsSnippetRaw = `/**
 * Advanced Node.js Express License Manager & OTA Updater
 * 
 * Dependencies required: npm install axios dotenv adm-zip
 * 
 * Usage in app.js:
 * const verifyProductLicense = require('./verifyLicense');
 * app.use(verifyProductLicense);
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

// Temporary Memory Cache
let licenseCache = null;
let cacheExpiry = 0;

const verifyProductLicense = async (req, res, next) => {
    const apiUrl = 'YOUR_MARKETPLACE_URL_HERE/api/licenses/validate';
    const licenseKey = process.env.HELP_OF_AI_LICENSE_KEY;

    // 1. Handle Activation Form Submission
    if (req.method === 'POST' && req.body && req.body.hoai_license_key) {
        return await processActivation(req, res, req.body.hoai_license_key, apiUrl);
    }

    // 2. Handle OTA Update Trigger
    if (req.method === 'POST' && req.query.trigger_ota_update === '1') {
        return await processOtaUpdate(req, res);
    }

    // 3. Verify License (Cache for 24 hours)
    let licenseData = getCache();
    if (!licenseData) {
        if (!licenseKey) {
            return res.status(403).send(getActivationUI());
        }

        try {
            const response = await axios.post(apiUrl, {
                license_key: licenseKey,
                domain: req.hostname
            }, { timeout: 5000 });

            licenseData = response.data;
            setCache(licenseData);
        } catch (error) {
            // Fail open temporarily if validation server is down
            licenseData = { valid: true, offline_mode: true };
            setCache(licenseData);
        }
    }

    // 4. Enforce Lock Screen UI if invalid
    if (!licenseData || !licenseData.valid) {
        return res.status(403).send(getActivationUI(licenseData.message || 'Invalid License Key.'));
    }

    // 5. Render License Dashboard (Hidden Route)
    if (req.query.license_dashboard === '1') {
        return res.send(getDashboardUI(licenseData));
    }

    next();
};

async function processActivation(req, res, key, apiUrl) {
    try {
        const response = await axios.post(apiUrl, {
            license_key: key,
            domain: req.hostname
        });

        const data = response.data;

        if (data.valid) {
            // Write to .env
            const envPath = path.resolve(process.cwd(), '.env');
            let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
            if (envContent.includes('HELP_OF_AI_LICENSE_KEY=')) {
                envContent = envContent.replace(/^HELP_OF_AI_LICENSE_KEY=.*$/m, 'HELP_OF_AI_LICENSE_KEY=' + key);
            } else {
                envContent += '\\nHELP_OF_AI_LICENSE_KEY=' + key + '\\n';
            }
            fs.writeFileSync(envPath, envContent);
            
            setCache(data);
            
            // Redirect to GET
            return res.redirect(req.originalUrl);
        }

        return res.status(403).send(getActivationUI(data.message || 'Invalid License Key.'));
    } catch (error) {
        return res.status(500).send(getActivationUI('Failed to connect to license server.'));
    }
}

async function processOtaUpdate(req, res) {
    const data = getCache();
    if (!data || !data.download_url) return res.status(400).json({ error: 'No update URL found.' });

    try {
        const AdmZip = require('adm-zip'); // Requires npm install adm-zip
        
        // Download ZIP
        const response = await axios({
            method: 'get',
            url: data.download_url,
            responseType: 'arraybuffer'
        });

        const zipPath = path.resolve(process.cwd(), 'temp_update.zip');
        fs.writeFileSync(zipPath, response.data);

        // Extract ZIP
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(process.cwd(), true);
        
        // Cleanup
        fs.unlinkSync(zipPath);
        clearCache();

        // Tell PM2 or Nodemon to restart by exiting gracefully
        setTimeout(() => process.exit(0), 1000);

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Update failed: ' + error.message });
    }
}

// Memory Cache Helpers
function setCache(data) {
    licenseCache = data;
    cacheExpiry = Date.now() + 86400000; // 24 hours
}

function getCache() {
    if (licenseCache && Date.now() < cacheExpiry) {
        return licenseCache;
    }
    return null;
}
function clearCache() {
    licenseCache = null;
}

// UI Generators
function getActivationUI(error = null) {
    const errorHtml = error ? \`<div class='bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100'>\${error}</div>\` : '';
    return \`
    <!DOCTYPE html>
    <html>
    <head><title>Product Activation</title><script src="https://cdn.tailwindcss.com"><\/script></head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
            <h2 class="text-2xl font-black text-gray-800 mb-2">Activate Product</h2>
            <p class="text-sm text-gray-500 mb-6">This Node.js application requires a valid license key.</p>
            \${errorHtml}
            <form method="POST" action="">
                <!-- Ensure your express app uses express.urlencoded({extended: true}) middleware before this! -->
                <input type="text" name="hoai_license_key" class="w-full border border-gray-300 rounded-lg p-3 mb-4 font-mono focus:ring-2 focus:ring-blue-500 outline-none" placeholder="XXXX-XXXX-XXXX-XXXX" required>
                <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Verify & Activate</button>
            </form>
        </div>
    </body>
    </html>
    \`;
}

function getDashboardUI(data) {
    const isUpdateAvailable = data.version && data.latest_version && (data.version !== data.latest_version);
    const updateHtml = isUpdateAvailable ? \`
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 flex justify-between items-center">
            <div>
                <h3 class="text-amber-800 font-bold">Update Available: v\${data.latest_version}</h3>
                <p class="text-amber-600 text-sm">A new version of this product is available for 1-click install.</p>
            </div>
            <button onclick="installUpdate()" id="updateBtn" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm">Install Update</button>
        </div>
    \` : '';

    return \`
    <!DOCTYPE html>
    <html>
    <head><title>License Dashboard</title><script src="https://cdn.tailwindcss.com"><\/script></head>
    <body class="bg-gray-100 p-8">
        <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h1 class="text-2xl font-black mb-6 text-gray-800">System Dashboard</h1>
            \${updateHtml}
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 text-white p-6 rounded-xl mb-6 shadow-lg">
                <h3 class="font-black text-xl">\${data.product_name || 'Premium Product'}</h3>
                <p class="text-emerald-50 text-sm">Activated & Verified</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p class="text-xs font-bold text-gray-400 uppercase">Author</p>
                    <p class="font-bold text-gray-800">\${data.author_name || 'Unknown'}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p class="text-xs font-bold text-gray-400 uppercase">Current Version</p>
                    <p class="font-bold text-gray-800">v\${data.version || '1.0'}</p>
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
            
            fetch('?trigger_ota_update=1', { method: 'POST' })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    alert('Update installed! The server is restarting...');
                    setTimeout(() => window.location.reload(), 3000);
                } else {
                    alert('Error: ' + data.error);
                    window.location.reload();
                }
            }).catch(() => {
                alert('Network error during update.');
                window.location.reload();
            });
        }
        <\/script>
    </body>
    </html>
    \`;
}

module.exports = verifyProductLicense;
`;
const phpSnippetRaw = `<?php
/**
 * Vanilla PHP Integration (With Built-in UI)
 * Place this at the very top of your index.php
 */

$API_URL = 'YOUR_MARKETPLACE_URL_HERE/api/licenses/validate';
$CACHE_FILE = __DIR__ . '/.license_data.json';

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['license_key'])) {
    $ch = curl_init($API_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'license_key' => $_POST['license_key'],
        'domain' => $_SERVER['HTTP_HOST']
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 200) {
        $result = json_decode($response, true);
        if (isset($result['valid']) && $result['valid']) {
            $result['cached_at'] = time();
            file_put_contents($CACHE_FILE, json_encode($result));
            header("Location: " . $_SERVER['PHP_SELF']);
            exit;
        }
    }
    $error = "Invalid license key or domain mismatch.";
}

// Check License Cache
$is_valid = false;
$data = [];
if (file_exists($CACHE_FILE)) {
    $data = json_decode(file_get_contents($CACHE_FILE), true);
    // Cache lasts for 24 hours (86400 seconds)
    if (isset($data['valid']) && $data['valid'] && (time() - $data['cached_at'] < 86400)) {
        $is_valid = true;
    }
}

// IF NOT VALID, HALT SCRIPT AND RENDER UI
if (!$is_valid) {
    http_response_code(403);
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Product Activation</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
            <h2 class="text-2xl font-black text-gray-800 mb-2">Activate Product</h2>
            <p class="text-sm text-gray-500 mb-6">This application requires a valid license key to run.</p>
            
            <?php if (isset($error)): ?>
                <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100"><?php echo $error; ?></div>
            <?php endif; ?>

            <form method="POST">
                <input type="text" name="license_key" class="w-full border border-gray-300 rounded-lg p-3 mb-4 font-mono focus:ring-2 focus:ring-blue-500 outline-none" placeholder="XXXX-XXXX-XXXX-XXXX" required>
                <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Verify & Activate</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit; // Stop executing the rest of the application
}

// IF VALID, YOU CAN OPTIONALLY ADD A ?license_dashboard=1 URL PARAM TO VIEW STATUS
if (isset($_GET['license_dashboard'])) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>License Dashboard</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
    </head>
    <body class="bg-gray-100 p-8">
        <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h1 class="text-2xl font-black mb-6">License Dashboard</h1>
            <div class="bg-emerald-500 text-white p-4 rounded-xl mb-6">
                <h3 class="font-bold text-lg">Active License: <?php echo htmlspecialchars($data['product_name'] ?? ''); ?></h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg border"><strong>Author:</strong> <?php echo htmlspecialchars($data['author_name'] ?? ''); ?></div>
                <div class="bg-gray-50 p-4 rounded-lg border"><strong>Version:</strong> <?php echo htmlspecialchars($data['version'] ?? ''); ?></div>
                <div class="bg-gray-50 p-4 rounded-lg border"><strong>Support Expiry:</strong> <?php echo htmlspecialchars($data['support_expires_at'] ?? ''); ?></div>
                <div class="bg-gray-50 p-4 rounded-lg border"><strong>Build Hash:</strong> <?php echo htmlspecialchars($data['build_hash'] ?? ''); ?></div>
            </div>
            <a href="?" class="mt-6 inline-block text-blue-600 hover:underline">Return to App</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}
`;
function SdkIntegration() {
  const [activeTab, setActiveTab] = useState("wordpress");
  const [copied, setCopied] = useState("");
  const domainUrl = typeof window !== "undefined" ? window.location.origin : "https://code.helpofai.com";
  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(""), 2e3);
  };
  const tabs = [
    { id: "wordpress", name: "WordPress Theme / Plugin" },
    { id: "laravel", name: "Laravel" },
    { id: "nodejs", name: "Node.js" },
    { id: "php", name: "Custom PHP" },
    { id: "rest_api", name: "Raw REST API" }
  ];
  const snippets = {
    wordpress: wordpressSnippetRaw.replace(/YOUR_MARKETPLACE_URL_HERE/g, domainUrl),
    laravel: laravelSnippetRaw.replace(/YOUR_MARKETPLACE_URL_HERE/g, domainUrl),
    nodejs: nodejsSnippetRaw.replace(/YOUR_MARKETPLACE_URL_HERE/g, domainUrl),
    php: phpSnippetRaw.replace(/YOUR_MARKETPLACE_URL_HERE/g, domainUrl),
    rest_api: `/* 
======================================================
1. VALIDATE LICENSE API
======================================================
Build your own custom UI, validation, and dashboard 
by interacting with this endpoint directly.

Endpoint: POST ${domainUrl}/api/licenses/validate
Content-Type: application/json

Request Body:
{
    "license_key": "YOUR-LICENSE-KEY",
    "domain": "client-domain.com"
}

Success Response (200 OK):
{
    "success": true,
    "valid": true,
    "product_name": "Premium Script",
    "author_name": "Vendor Name",
    "version": "1.0.0",
    "latest_version": "1.0.5",
    "download_url": "${domainUrl}/api/license/download-update?key=...",
    "support_expires_at": "Dec 31, 2026",
    "last_sync": "Aug 01, 2026",
    "build_hash": "a1b2c3d4"
}

Error Response (403 Forbidden):
{
    "message": "Invalid or expired license."
}


======================================================
2. OTA UPDATE (DOWNLOAD ZIP) API
======================================================
Use this endpoint to programmatically download the 
latest .zip release of your product for auto-updating.

Endpoint: GET ${domainUrl}/api/license/download-update
Query Params:
  ?key=YOUR-LICENSE-KEY
  &domain=client-domain.com

Success Response (200 OK):
Content-Type: application/zip
Content-Disposition: attachment; filename="product-latest.zip"
(Returns the raw .zip file buffer of the latest version)

Error Responses (403 / 404):
- "Invalid or expired license."
- "This domain is not authorized to download updates."
- "Support and updates period has expired. Please renew."
- "No update package available."
*/`
  };
  const guides = {
    wordpress: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] mb-4", children: "Step-by-Step Integration Guide" }),
      /* @__PURE__ */ jsxs("ol", { className: "list-decimal pl-5 space-y-3 text-sm text-[var(--text-muted)]", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-[var(--text-main)]", children: "Download" }),
          " the SDK file by clicking the blue button above."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Move the downloaded ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "class-license-validator.php" }),
          " file into your theme or plugin folder (e.g., inside an ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "includes/" }),
          " folder)."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Open your main ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "functions.php" }),
          " (for Themes) or your main plugin file (for Plugins)."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Add the following code at the top to load the license engine:",
          /* @__PURE__ */ jsx("pre", { className: "bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs", children: "require_once __DIR__ . '/includes/class-license-validator.php';" })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "That's it!" }),
          " A beautiful License Dashboard and OTA Updater will automatically appear in your customer's WordPress Admin menu."
        ] })
      ] })
    ] }),
    laravel: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] mb-4", children: "Step-by-Step Integration Guide" }),
      /* @__PURE__ */ jsxs("ol", { className: "list-decimal pl-5 space-y-3 text-sm text-[var(--text-muted)]", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-[var(--text-main)]", children: "Download" }),
          " the SDK file by clicking the blue button above."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Move the downloaded ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "VerifyProductLicense.php" }),
          " file into ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "app/Http/Middleware/" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Open ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "app/Http/Kernel.php" }),
          " (or ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "bootstrap/app.php" }),
          " if using Laravel 11)."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Register the middleware globally so it protects your entire application:",
          /* @__PURE__ */ jsx("pre", { className: "bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs", children: "\\App\\Http\\Middleware\\VerifyProductLicense::class," })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "That's it!" }),
          " If a buyer visits your app without a license, the middleware will instantly intercept them with a beautiful Activation Form. It also handles 1-click OTA zip extraction automatically!"
        ] })
      ] })
    ] }),
    nodejs: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] mb-4", children: "Step-by-Step Integration Guide" }),
      /* @__PURE__ */ jsxs("ol", { className: "list-decimal pl-5 space-y-3 text-sm text-[var(--text-muted)]", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-[var(--text-main)]", children: "Download" }),
          " the SDK file by clicking the blue button above."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Move the downloaded ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "verifyLicense.js" }),
          " file into your project's root folder."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Install the required dependencies using your terminal:",
          /* @__PURE__ */ jsx("pre", { className: "bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs", children: "npm install axios dotenv adm-zip" })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Open your main server file (e.g., ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "app.js" }),
          ", ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "server.js" }),
          ", or ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "index.js" }),
          ")."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Require and mount the middleware ",
          /* @__PURE__ */ jsx("strong", { children: "before" }),
          " your application routes:",
          /* @__PURE__ */ jsxs("pre", { className: "bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs", children: [
            "const verifyProductLicense = require('./verifyLicense');",
            "\n",
            "app.use(verifyProductLicense);"
          ] })
        ] })
      ] })
    ] }),
    php: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] mb-4", children: "Step-by-Step Integration Guide" }),
      /* @__PURE__ */ jsxs("ol", { className: "list-decimal pl-5 space-y-3 text-sm text-[var(--text-muted)]", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-[var(--text-main)]", children: "Download" }),
          " the SDK file by clicking the blue button above."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Move the downloaded ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "validate.php" }),
          " file into your project's root folder."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Open your main entry point file (usually ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "index.php" }),
          ")."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Require the validation script at the ",
          /* @__PURE__ */ jsx("strong", { children: "very top" }),
          " of the file (on line 2, directly below ",
          /* @__PURE__ */ jsx("code", { className: "bg-gray-100 text-pink-600 px-1 rounded", children: "<?php" }),
          "):",
          /* @__PURE__ */ jsx("pre", { className: "bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs", children: "require_once __DIR__ . '/validate.php';" })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Important:" }),
          " We highly recommend running your final project through an obfuscator like ionCube to prevent buyers from simply commenting out the require statement."
        ] })
      ] })
    ] }),
    rest_api: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] mb-4", children: "Integration Details" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--text-muted)] leading-relaxed", children: "This tab does not provide an SDK file to download. Instead, this is the raw JSON schema and HTTP endpoints needed to build your own licensing system from scratch. You can use this to build custom implementations for Python (Django/Flask), Go, Ruby on Rails, C# (.NET), Java, or any other framework." })
    ] })
  };
  const handleDownload = (code, tabId) => {
    const filenames = {
      wordpress: "class-license-validator.php",
      laravel: "VerifyProductLicense.php",
      nodejs: "verifyLicense.js",
      php: "validate.php"
    };
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filenames[tabId] || "sdk-file.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "SDK & API Integration" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto space-y-8 pt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 relative overflow-hidden shadow-2xl", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-black text-[var(--text-main)] uppercase tracking-tight flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(FileCode, { className: "text-cyan-500", size: 32 }),
            "SDK & API Integrations"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] mt-2 max-w-2xl text-sm leading-relaxed", children: "Implement advanced algorithms to secure your products. This documentation provides step-by-step copy-and-paste snippets for integrating our License API into your premium applications." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 relative shadow-inner", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-amber-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx(ShieldAlert, { size: 16 }),
          " Architectural Best Practices (Godmode)"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-[var(--text-main)] font-bold text-sm mb-2", children: "1. The Caching Rule" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)] leading-relaxed", children: "Never validate a license on every page load. It will slow down your buyer's server and DDOS your API. Always cache the validation result locally (Transient, Redis, File) for 24 hours." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-[var(--text-main)] font-bold text-sm mb-2", children: "2. The Auto-Lock Protocol" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--text-muted)] leading-relaxed", children: [
              "If an API returns 'invalid' or a bypass is detected, trigger an aggressive lock mechanism. Hook into early execution lifecycles (like Middleware or ",
              /* @__PURE__ */ jsx("code", { children: "template_redirect" }),
              ") to kill the process and show a support message."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-[var(--text-main)] font-bold text-sm mb-2", children: "3. Fail-Open Strategy" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--text-muted)] leading-relaxed", children: [
              "If the cURL request times out (meaning your API server is temporarily offline),",
              /* @__PURE__ */ jsx("strong", { children: "assume the license is valid" }),
              ". Do not lock a legitimate buyer out of their product just because of a network timeout."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-[var(--text-main)] font-bold text-sm mb-2", children: "4. Obfuscation" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--text-muted)] leading-relaxed", children: [
              "For PHP products, run the file containing this validation code through an obfuscator (like ionCube) before distributing the ZIP. Otherwise, buyers can simply comment out the ",
              /* @__PURE__ */ jsx("code", { children: "die()" }),
              " function."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto border-b border-[var(--border)]", children: tabs.map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab(tab.id),
            className: `px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? "border-cyan-500 text-cyan-500 bg-[var(--bg-main)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]/50"}`,
            children: tab.name
          },
          tab.id
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "p-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-elevated)] flex justify-between items-center px-6 py-3 border-b border-[var(--border)]", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Key, { size: 12, className: "text-emerald-500" }),
              "Implementation Code"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              activeTab !== "rest_api" && /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleDownload(snippets[activeTab], activeTab),
                  className: "flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors font-bold shadow-sm",
                  children: [
                    /* @__PURE__ */ jsx(Download, { size: 14 }),
                    " ",
                    /* @__PURE__ */ jsx("span", { children: "Download File" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleCopy(snippets[activeTab], activeTab),
                  className: "flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-cyan-500 transition-colors",
                  children: copied === activeTab ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: "text-emerald-500" }),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-emerald-500 font-bold", children: "Copied" })
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Copy, { size: 14 }),
                    " ",
                    /* @__PURE__ */ jsx("span", { children: "Copy Code" })
                  ] })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Prism,
            {
              language: "php",
              style: vscDarkPlus,
              customStyle: {
                margin: 0,
                padding: "24px",
                background: "transparent",
                fontSize: "13px",
                borderRadius: "0"
              },
              children: snippets[activeTab]
            }
          ),
          guides[activeTab]
        ] })
      ] })
    ] })
  ] });
}
export {
  SdkIntegration as default
};
