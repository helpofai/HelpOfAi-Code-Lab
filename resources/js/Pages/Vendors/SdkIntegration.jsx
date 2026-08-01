import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShieldAlert, Key, FileCode, CheckCircle2, Copy, Download } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import wordpressSnippetRaw from '../../../../client-sdk/wordpress/class-license-validator.php?raw';
import laravelSnippetRaw from '../../../../client-sdk/laravel/VerifyProductLicense.php?raw';
import nodejsSnippetRaw from '../../../../client-sdk/nodejs/verifyLicense.js?raw';
import phpSnippetRaw from '../../../../client-sdk/php/validate.php?raw';

export default function SdkIntegration() {
    const [activeTab, setActiveTab] = useState('wordpress');
    const [copied, setCopied] = useState('');

    // Dynamically get the current marketplace domain (e.g., localhost:8000 or code.helpofai.com)
    const domainUrl = typeof window !== 'undefined' ? window.location.origin : 'https://code.helpofai.com';

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
        { id: 'rest_api', name: 'Raw REST API' },
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
        wordpress: (
            <div className="p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]">
                <h3 className="text-lg font-black text-[var(--text-main)] mb-4">Step-by-Step Integration Guide</h3>
                <ol className="list-decimal pl-5 space-y-3 text-sm text-[var(--text-muted)]">
                    <li><strong className="text-[var(--text-main)]">Download</strong> the SDK file by clicking the blue button above.</li>
                    <li>Move the downloaded <code className="bg-gray-100 text-pink-600 px-1 rounded">class-license-validator.php</code> file into your theme or plugin folder (e.g., inside an <code className="bg-gray-100 text-pink-600 px-1 rounded">includes/</code> folder).</li>
                    <li>Open your main <code className="bg-gray-100 text-pink-600 px-1 rounded">functions.php</code> (for Themes) or your main plugin file (for Plugins).</li>
                    <li>Add the following code at the top to load the license engine:
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs">require_once __DIR__ . '/includes/class-license-validator.php';</pre>
                    </li>
                    <li><strong>That's it!</strong> A beautiful License Dashboard and OTA Updater will automatically appear in your customer's WordPress Admin menu.</li>
                </ol>
            </div>
        ),
        laravel: (
            <div className="p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]">
                <h3 className="text-lg font-black text-[var(--text-main)] mb-4">Step-by-Step Integration Guide</h3>
                <ol className="list-decimal pl-5 space-y-3 text-sm text-[var(--text-muted)]">
                    <li><strong className="text-[var(--text-main)]">Download</strong> the SDK file by clicking the blue button above.</li>
                    <li>Move the downloaded <code className="bg-gray-100 text-pink-600 px-1 rounded">VerifyProductLicense.php</code> file into <code className="bg-gray-100 text-pink-600 px-1 rounded">app/Http/Middleware/</code>.</li>
                    <li>Open <code className="bg-gray-100 text-pink-600 px-1 rounded">app/Http/Kernel.php</code> (or <code className="bg-gray-100 text-pink-600 px-1 rounded">bootstrap/app.php</code> if using Laravel 11).</li>
                    <li>Register the middleware globally so it protects your entire application:
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs">\App\Http\Middleware\VerifyProductLicense::class,</pre>
                    </li>
                    <li><strong>That's it!</strong> If a buyer visits your app without a license, the middleware will instantly intercept them with a beautiful Activation Form. It also handles 1-click OTA zip extraction automatically!</li>
                </ol>
            </div>
        ),
        nodejs: (
            <div className="p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]">
                <h3 className="text-lg font-black text-[var(--text-main)] mb-4">Step-by-Step Integration Guide</h3>
                <ol className="list-decimal pl-5 space-y-3 text-sm text-[var(--text-muted)]">
                    <li><strong className="text-[var(--text-main)]">Download</strong> the SDK file by clicking the blue button above.</li>
                    <li>Move the downloaded <code className="bg-gray-100 text-pink-600 px-1 rounded">verifyLicense.js</code> file into your project's root folder.</li>
                    <li>Install the required dependencies using your terminal:
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs">npm install axios dotenv adm-zip</pre>
                    </li>
                    <li>Open your main server file (e.g., <code className="bg-gray-100 text-pink-600 px-1 rounded">app.js</code>, <code className="bg-gray-100 text-pink-600 px-1 rounded">server.js</code>, or <code className="bg-gray-100 text-pink-600 px-1 rounded">index.js</code>).</li>
                    <li>Require and mount the middleware <strong>before</strong> your application routes:
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs">
const verifyProductLicense = require('./verifyLicense');{'\n'}
app.use(verifyProductLicense);
                        </pre>
                    </li>
                </ol>
            </div>
        ),
        php: (
            <div className="p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]">
                <h3 className="text-lg font-black text-[var(--text-main)] mb-4">Step-by-Step Integration Guide</h3>
                <ol className="list-decimal pl-5 space-y-3 text-sm text-[var(--text-muted)]">
                    <li><strong className="text-[var(--text-main)]">Download</strong> the SDK file by clicking the blue button above.</li>
                    <li>Move the downloaded <code className="bg-gray-100 text-pink-600 px-1 rounded">validate.php</code> file into your project's root folder.</li>
                    <li>Open your main entry point file (usually <code className="bg-gray-100 text-pink-600 px-1 rounded">index.php</code>).</li>
                    <li>Require the validation script at the <strong>very top</strong> of the file (on line 2, directly below <code className="bg-gray-100 text-pink-600 px-1 rounded">&lt;?php</code>):
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 text-xs">require_once __DIR__ . '/validate.php';</pre>
                    </li>
                    <li><strong>Important:</strong> We highly recommend running your final project through an obfuscator like ionCube to prevent buyers from simply commenting out the require statement.</li>
                </ol>
            </div>
        ),
        rest_api: (
            <div className="p-6 bg-[var(--bg-main)] rounded-b-2xl border-t border-[var(--border)]">
                <h3 className="text-lg font-black text-[var(--text-main)] mb-4">Integration Details</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    This tab does not provide an SDK file to download. Instead, this is the raw JSON schema and HTTP endpoints needed to build your own licensing system from scratch. You can use this to build custom implementations for Python (Django/Flask), Go, Ruby on Rails, C# (.NET), Java, or any other framework.
                </p>
            </div>
        ),
    };

    const handleDownload = (code, tabId) => {
        const filenames = {
            wordpress: 'class-license-validator.php',
            laravel: 'VerifyProductLicense.php',
            nodejs: 'verifyLicense.js',
            php: 'validate.php'
        };
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filenames[tabId] || 'sdk-file.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                            <div className="flex items-center gap-4">
                                {activeTab !== 'rest_api' && (
                                    <button 
                                        onClick={() => handleDownload(snippets[activeTab], activeTab)}
                                        className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors font-bold shadow-sm"
                                    >
                                        <Download size={14} /> <span>Download File</span>
                                    </button>
                                )}
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
                        </div>
                        <SyntaxHighlighter 
                            language="php" 
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: '24px',
                                background: 'transparent',
                                fontSize: '13px',
                                borderRadius: '0'
                            }}
                        >
                            {snippets[activeTab]}
                        </SyntaxHighlighter>

                        {/* Step by Step Guide Injection */}
                        {guides[activeTab]}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
