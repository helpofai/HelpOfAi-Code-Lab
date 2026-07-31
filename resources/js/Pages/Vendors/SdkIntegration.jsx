import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShieldAlert, Key, FileCode, CheckCircle2, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function SdkIntegration() {
    const [activeTab, setActiveTab] = useState('wordpress');
    const [copied, setCopied] = useState('');

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopied(id);
        setTimeout(() => setCopied(''), 2000);
    };

    const tabs = [
        { id: 'wordpress', name: 'WordPress Theme / Plugin' },
        { id: 'laravel', name: 'Laravel' },
        { id: 'nodejs', name: 'Node.js' },
        { id: 'php', name: 'Custom PHP' },
    ];

    const snippets = {
        wordpress: `<?php
/**
 * Advanced License Protection for WordPress
 * Paste this in functions.php or your core plugin file.
 */

function check_theme_license_validity() {
    $license_key = get_option('theme_license_key');
    
    // 1. Check transient cache to avoid slowing down site (24 hr cache)
    $status = get_transient('theme_license_status');
    if ($status === 'valid') return true;

    // 2. Ping validation server
    $response = wp_remote_post('https://your-marketplace.com/api/licenses/validate', [
        'body' => [
            'license_key' => $license_key,
            'domain' => $_SERVER['HTTP_HOST']
        ]
    ]);

    if (is_wp_error($response)) return false;

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($body['valid']) && $body['valid']) {
        set_transient('theme_license_status', 'valid', 24 * HOUR_IN_SECONDS);
        // Delete lock if exists
        delete_option('theme_locked_status');
        return true;
    } else {
        // 3. Mark theme as locked if bypassed or invalid
        update_option('theme_locked_status', true);
        return false;
    }
}

// 4. Auto-Lock execution hook
add_action('template_redirect', function() {
    if (get_option('theme_locked_status')) {
        wp_die(
            '<div style="text-align:center; padding:50px; font-family:sans-serif;">' .
            '<h2>🛑 Security Lock</h2>' .
            '<p>This product has been locked due to an invalid license or bypass attempt.</p>' .
            '<p>Please contact <a href="mailto:support@vendor.com">support@vendor.com</a></p>' .
            '</div>', 
            'License Locked', 
            ['response' => 403]
        );
    }
});`,
        laravel: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Support\\Facades\\Http;

class VerifyProductLicense
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next)
    {
        $licenseKey = config('app.license_key');
        
        // Cache for 24 hours to prevent API throttling
        $isValid = Cache::remember('product_license_valid', 86400, function () use ($licenseKey) {
            try {
                $response = Http::timeout(5)->post('https://your-marketplace.com/api/licenses/validate', [
                    'license_key' => $licenseKey,
                    'domain' => request()->getHost()
                ]);
                
                return $response->json('valid') === true;
            } catch (\\Exception $e) {
                // Fail open temporarily if validation server is down
                return true; 
            }
        });

        if (!$isValid) {
            abort(403, 'CRITICAL LOCK: Invalid license key detected. Please contact support.');
        }

        return $next($request);
    }
}`,
        nodejs: `// Advanced License Middleware for Express.js
const axios = require('axios');
const NodeCache = require('node-cache');
const licenseCache = new NodeCache({ stdTTL: 86400 }); // 24 hour cache

const verifyLicense = async (req, res, next) => {
    const licenseKey = process.env.LICENSE_KEY;
    const domain = req.hostname;

    // Check Cache
    if (licenseCache.get('is_valid')) {
        return next();
    }

    try {
        const response = await axios.post('https://your-marketplace.com/api/licenses/validate', {
            license_key: licenseKey,
            domain: domain
        }, { timeout: 5000 });

        if (response.data.valid) {
            licenseCache.set('is_valid', true);
            return next();
        } else {
            // Lock the application
            return res.status(403).send(\`
                <div style="text-align:center; padding:50px; font-family:sans-serif;">
                    <h2>🛑 Application Locked</h2>
                    <p>Invalid license key. Please contact support.</p>
                </div>
            \`);
        }
    } catch (error) {
        // If validation server is unreachable, allow temporarily
        return next();
    }
};

module.exports = verifyLicense;`,
        php: `<?php
/**
 * Vanilla PHP Integration
 * Place this at the very top of your index.php
 */

$license_key = 'YOUR_LICENSE_KEY_HERE';
$cache_file = __DIR__ . '/.license_cache';

function is_license_valid($key, $cache_file) {
    // 1. Check local file cache (24 hours)
    if (file_exists($cache_file) && (time() - filemtime($cache_file)) < 86400) {
        $data = json_decode(file_get_contents($cache_file), true);
        if ($data['valid'] === true) return true;
    }

    // 2. Call API
    $ch = curl_init('https://your-marketplace.com/api/licenses/validate');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'license_key' => $key,
        'domain' => $_SERVER['HTTP_HOST']
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 200) {
        $result = json_decode($response, true);
        if ($result['valid']) {
            file_put_contents($cache_file, json_encode(['valid' => true]));
            return true;
        }
    }
    
    return false;
}

if (!is_license_valid($license_key, $cache_file)) {
    http_response_code(403);
    die('<h1 style="color:red;text-align:center;">SYSTEM LOCKED: License Violation.</h1>');
}`
    };

    return (
        <AuthenticatedLayout>
            <Head title="SDK & API Integration" />

            <div className="max-w-6xl mx-auto space-y-8 pt-8">
                
                {/* Header */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight flex items-center gap-3">
                                <FileCode className="text-cyan-500" size={32} />
                                SDK & API Integrations
                            </h1>
                            <p className="text-[var(--text-muted)] mt-2 max-w-2xl text-sm leading-relaxed">
                                Implement advanced algorithms to secure your products. This documentation provides step-by-step 
                                copy-and-paste snippets for integrating our License API into your premium applications.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Best Practices Godmode Note */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 relative shadow-inner">
                    <h3 className="text-amber-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                        <ShieldAlert size={16} /> Architectural Best Practices (Godmode)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-[var(--text-main)] font-bold text-sm mb-2">1. The Caching Rule</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                Never validate a license on every page load. It will slow down your buyer's server and DDOS your API. 
                                Always cache the validation result locally (Transient, Redis, File) for 24 hours.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[var(--text-main)] font-bold text-sm mb-2">2. The Auto-Lock Protocol</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                If an API returns 'invalid' or a bypass is detected, trigger an aggressive lock mechanism. 
                                Hook into early execution lifecycles (like Middleware or <code>template_redirect</code>) to kill the process and show a support message.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[var(--text-main)] font-bold text-sm mb-2">3. Fail-Open Strategy</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                If the cURL request times out (meaning your API server is temporarily offline), 
                                <strong>assume the license is valid</strong>. Do not lock a legitimate buyer out of their product just because of a network timeout.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[var(--text-main)] font-bold text-sm mb-2">4. Obfuscation</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                For PHP products, run the file containing this validation code through an obfuscator (like ionCube) before distributing the ZIP. 
                                Otherwise, buyers can simply comment out the <code>die()</code> function.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Integration Tabs */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-[var(--border)]">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                                    activeTab === tab.id 
                                        ? 'border-cyan-500 text-cyan-500 bg-[var(--bg-main)]' 
                                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]/50'
                                }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-0">
                        <div className="bg-[var(--bg-elevated)] flex justify-between items-center px-6 py-3 border-b border-[var(--border)]">
                            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Key size={12} className="text-emerald-500" />
                                Implementation Code
                            </span>
                            <button 
                                onClick={() => handleCopy(snippets[activeTab], activeTab)}
                                className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-cyan-500 transition-colors"
                            >
                                {copied === activeTab ? (
                                    <><CheckCircle2 size={14} className="text-emerald-500" /> <span className="text-emerald-500 font-bold">Copied</span></>
                                ) : (
                                    <><Copy size={14} /> <span>Copy Code</span></>
                                )}
                            </button>
                        </div>
                        <SyntaxHighlighter 
                            language="php" 
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: '24px',
                                background: 'transparent',
                                fontSize: '13px',
                                borderRadius: '0 0 1rem 1rem'
                            }}
                        >
                            {snippets[activeTab]}
                        </SyntaxHighlighter>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
