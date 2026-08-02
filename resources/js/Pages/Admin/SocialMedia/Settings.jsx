import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Share2, Save, MessageCircle, Send, Info, ExternalLink, HelpCircle, AlertCircle, Activity, CheckCircle2, XCircle, Eye, Link as LinkIcon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocialMediaSettings({ auth, settings, logs }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        telegram_enabled: settings.telegram_enabled === '1' || settings.telegram_enabled === true,
        telegram_bot_token: settings.telegram_bot_token || '',
        telegram_chat_id: settings.telegram_chat_id || '',
        telegram_admin_id: settings.telegram_admin_id || '',
        telegram_api_proxy: settings.telegram_api_proxy || '',
        telegram_webhook_secret: settings.telegram_webhook_secret || '',
        telegram_manual_webhook: settings.telegram_manual_webhook || '',
        telegram_post_template: settings.telegram_post_template || 'professional',
        telegram_custom_template: settings.telegram_custom_template || '🚀 *New Project Alert!*\n\n🔥 *{title}*\n{description}\n\n💰 Price: *{price}*',
        whatsapp_enabled: settings.whatsapp_enabled === '1' || settings.whatsapp_enabled === true,
        whatsapp_access_token: settings.whatsapp_access_token || '',
        whatsapp_phone_id: settings.whatsapp_phone_id || '',
        whatsapp_group_id: settings.whatsapp_group_id || '',
        whatsapp_webhook_secret: settings.whatsapp_webhook_secret || '',
        whatsapp_manual_webhook: settings.whatsapp_manual_webhook || '',
        whatsapp_post_template: settings.whatsapp_post_template || 'professional',
        whatsapp_custom_template: settings.whatsapp_custom_template || '🚀 *New Project Alert!*\n\n*Pro E-Commerce Dashboard v2.0*\nA complete Next.js dashboard with Stripe.\n\n💰 Price: *$49.00*\n\n🔍 View Project: {link}',
    });

    const [activeHelp, setActiveHelp] = useState(null);
    const [testing, setTesting] = useState({ telegram: false, whatsapp: false });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.social-media.update'));
    };

    const testConnection = (platform) => {
        setTesting(prev => ({ ...prev, [platform]: true }));
        router.post(route(`admin.social-media.test-${platform}`), data, {
            onFinish: () => setTesting(prev => ({ ...prev, [platform]: false })),
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl shadow-lg shadow-purple-500/20">
                            <Share2 size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-black text-2xl text-[var(--text-primary)] leading-tight tracking-tight">Social Media Broadcasts</h2>
                            <p className="text-sm text-[var(--text-muted)] font-medium">Automate your project announcements to global communities.</p>
                        </div>
                    </div>
                    <Link 
                        href={route('admin.social-media.logs')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all shadow-sm"
                    >
                        <Activity size={18} /> View Activity Logs
                    </Link>
                </div>
            }
        >
            <Head title="Social Media Settings" />

            <div className="py-12 relative">
                {/* Background ambient glows */}
                <div className="absolute top-20 left-20 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-20 right-20 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8 space-y-10 relative z-10">
                    <form onSubmit={submit} className="space-y-10">
                        
                        {/* FIRST ROW: Settings (2 Columns on large screens) */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            
                            {/* Telegram Configuration */}
                            <div className={`relative bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden flex flex-col h-full ${data.telegram_enabled ? 'border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'border-[var(--border)] shadow-xl'}`}>
                                
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                    <Send size={200} className="text-blue-500" />
                                </div>

                                <div className="flex items-start justify-between mb-8 relative z-10 shrink-0">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl transition-all duration-300 ${data.telegram_enabled ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}>
                                            <Send size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Telegram Setup</h3>
                                            <p className="text-[var(--text-muted)] mt-1">Broadcast new projects instantly.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={data.telegram_enabled}
                                            onChange={(e) => setData('telegram_enabled', e.target.checked)}
                                        />
                                        <div className="w-14 h-7 bg-[var(--bg-elevated)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
                                    </label>
                                </div>

                                <AnimatePresence>
                                    {data.telegram_enabled && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-6 overflow-hidden relative z-10 flex-grow flex flex-col"
                                        >
                                            <div className="space-y-5 flex-grow">
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Bot Token</label>
                                                    <input
                                                        type="password"
                                                        value={data.telegram_bot_token}
                                                        onChange={e => setData('telegram_bot_token', e.target.value)}
                                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                        placeholder="e.g. 123456789:ABCdef..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Chat ID (Channel)</label>
                                                    <input
                                                        type="text"
                                                        value={data.telegram_chat_id}
                                                        onChange={e => setData('telegram_chat_id', e.target.value)}
                                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                                                        placeholder="e.g. @movie_mart_official or -1001234..."
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div>
                                                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Admin Personal ID</label>
                                                        <input
                                                            type="text"
                                                            value={data.telegram_admin_id}
                                                            onChange={e => setData('telegram_admin_id', e.target.value)}
                                                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                                                            placeholder="e.g. 1846477338"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Quick Template Select</label>
                                                        <select
                                                            value={data.telegram_post_template}
                                                            onChange={e => {
                                                                setData('telegram_post_template', e.target.value);
                                                                if (e.target.value === 'professional') setData('telegram_custom_template', '🚀 *New Project Alert!*\n\n🔥 *{title}*\n{description}\n\n💰 Price: *{price}*');
                                                                if (e.target.value === 'startup') setData('telegram_custom_template', 'We just launched 🚀\n\n*{title}* is now live!\n\nGrab it here: {link}');
                                                                if (e.target.value === 'minimal') setData('telegram_custom_template', 'New upload: {title} - {price}\n{link}');
                                                            }}
                                                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                        >
                                                            <option value="professional">Professional</option>
                                                            <option value="startup">Startup Launch</option>
                                                            <option value="minimal">Minimal Text</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Post Template</label>
                                                    <textarea
                                                        value={data.telegram_custom_template}
                                                        onChange={e => setData('telegram_custom_template', e.target.value)}
                                                        rows="4"
                                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                                                        placeholder="Use {title}, {description}, {price}, {link}"
                                                    ></textarea>
                                                </div>
                                                
                                                {/* Advanced Webhook Config */}
                                                <div className="pt-4 border-t border-[var(--border)] space-y-4">
                                                    <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                                                        <LinkIcon size={16} className="text-blue-500"/> Webhook Configuration (Optional)
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <div>
                                                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 text-xs">Telegram API Proxy</label>
                                                            <input
                                                                type="text"
                                                                value={data.telegram_api_proxy}
                                                                onChange={e => setData('telegram_api_proxy', e.target.value)}
                                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                                placeholder="https://telegram-api-proxy..."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 text-xs">Webhook Secret Key</label>
                                                            <input
                                                                type="text"
                                                                value={data.telegram_webhook_secret}
                                                                onChange={e => setData('telegram_webhook_secret', e.target.value)}
                                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                                placeholder="e.g. moviebot23026"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 text-xs">Manual Webhook URL</label>
                                                            <input
                                                                type="text"
                                                                value={data.telegram_manual_webhook}
                                                                onChange={e => setData('telegram_manual_webhook', e.target.value)}
                                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                                placeholder="https://moviemart.free.nf/"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Telegram Live Preview */}
                                            <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-700/50 shadow-2xl relative mt-6 overflow-hidden">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-300 text-sm flex items-center gap-2"><Eye size={16} className="text-blue-400" /> Live Template Preview</h4>
                                                    <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded-md">Mobile View</span>
                                                </div>
                                                
                                                <div className="bg-[url('https://i.pinimg.com/1200x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center rounded-2xl p-4 shadow-inner">
                                                    <div className="bg-[#182533] max-w-[85%] rounded-2xl rounded-tl-sm p-2 shadow-sm border border-slate-700/30">
                                                        {/* Fake Image */}
                                                        <div className="w-full h-32 bg-slate-800 rounded-xl mb-2 flex items-center justify-center border border-slate-700/50 relative overflow-hidden group">
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
                                                            <Activity className="text-slate-600 group-hover:scale-110 transition-transform" size={32} />
                                                        </div>
                                                        {/* Fake Text */}
                                                        <div className="px-1 pb-1">
                                                            <p className="text-[#E1E8EE] text-sm leading-snug">
                                                                🚀 <strong className="font-bold">New Project Alert!</strong><br/><br/>
                                                                <strong className="text-blue-400">🔥 Pro E-Commerce Dashboard v2.0</strong><br/>
                                                                A complete Next.js dashboard with Stripe.<br/><br/>
                                                                💰 Price: <strong className="text-emerald-400">$49.00</strong>
                                                            </p>
                                                            <div className="text-right mt-1 text-[#6A7B8C] text-[10px]">10:42 AM</div>
                                                        </div>
                                                    </div>
                                                    {/* Inline Buttons */}
                                                    <div className="max-w-[85%] mt-1 flex gap-1">
                                                        <div className="flex-1 bg-[#182533] text-blue-400 text-xs font-bold py-2 rounded-xl text-center border border-slate-700/30 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors">
                                                            🔍 View Demo
                                                        </div>
                                                        <div className="flex-1 bg-[#182533] text-blue-400 text-xs font-bold py-2 rounded-xl text-center border border-slate-700/30 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors">
                                                            🛒 Buy Now
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 relative mt-6">
                                                <div className="absolute top-0 right-0 p-4 opacity-10"><Info size={40} className="text-blue-500" /></div>
                                                <h4 className="font-black text-blue-500 mb-4 uppercase tracking-widest text-[10px] flex items-center gap-2"><HelpCircle size={14}/> Setup Instructions</h4>
                                                <ol className="list-decimal list-inside space-y-3 text-xs text-[var(--text-primary)] leading-relaxed">
                                                    <li><strong>Bot Token:</strong> Open Telegram, search <strong>@BotFather</strong>, send <code className="text-blue-500 bg-blue-500/10 px-1 py-0.5 rounded font-mono">/newbot</code>, and copy the HTTP API Token.</li>
                                                    <li><strong>Chat ID (Channel):</strong> Add your bot to your channel as an Admin. Then forward a message from your channel to <strong>@userinfobot</strong> or <strong>@getmyid_bot</strong> to get the Channel ID (usually starts with -100).</li>
                                                    <li><strong>Admin Personal ID:</strong> Message <strong>@userinfobot</strong> to get your personal numeric Telegram ID.</li>
                                                    <li><strong>Webhook Secret Key:</strong> Create any random string (e.g., <code>moviebot23026</code>) to secure incoming requests from Telegram.</li>
                                                    <li><strong>Manual Webhook URL:</strong> The full URL to your website (e.g., <code>https://moviemart.free.nf/</code>) if auto-detection fails.</li>
                                                    <li className="mt-4 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                                                        <strong className="text-blue-400 block mb-1">Building a Cloudflare Telegram API Proxy (Optional if Telegram is blocked by your host):</strong>
                                                        1. Go to Cloudflare Dashboard &gt; Workers & Pages.<br/>
                                                        2. Create a new Worker.<br/>
                                                        <div className="my-2 p-3 bg-black/40 rounded border border-blue-500/20 relative group">
                                                            3. Paste this code: 
                                                            <div className="mt-1 font-mono text-[10px] text-blue-200 overflow-x-auto pb-2">
                                                                addEventListener('fetch', event =&gt; &#123; event.respondWith(fetch('https://api.telegram.org' + new URL(event.request.url).pathname + new URL(event.request.url).search, event.request)) &#125;)
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    navigator.clipboard.writeText("addEventListener('fetch', event => { event.respondWith(fetch('https://api.telegram.org' + new URL(event.request.url).pathname + new URL(event.request.url).search, event.request)) })");
                                                                    const btn = e.currentTarget;
                                                                    const originalText = btn.innerText;
                                                                    btn.innerText = "Copied!";
                                                                    setTimeout(() => btn.innerText = originalText, 2000);
                                                                }}
                                                                className="absolute top-2 right-2 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 text-[10px] rounded border border-blue-500/30 transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                Copy Code
                                                            </button>
                                                        </div>
                                                        4. Deploy and paste the Worker URL (e.g., <code>https://your-worker.workers.dev/</code>) into the Proxy field above.
                                                    </li>
                                                </ol>

                                                <div className="mt-6 flex flex-col gap-4">
                                                    {/* Webhook Connection Actions */}
                                                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex flex-col sm:flex-row gap-3 justify-between items-center">
                                                        <div className="text-left">
                                                            <h5 className="font-bold text-sm text-[var(--text-primary)]">Bot Webhook Setup</h5>
                                                            <p className="text-xs text-[var(--text-muted)]">Connects your bot to this website to receive real-time updates.</p>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
                                                        >
                                                            <LinkIcon size={14}/> Connect Bot to Website
                                                        </button>
                                                    </div>

                                                    {/* Troubleshooting Links */}
                                                    <div className="bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)]">
                                                        <h5 className="font-bold text-[var(--text-primary)] mb-2">Troubleshooting Connections:</h5>
                                                        <p className="mb-2">If "Connect Bot" fails, try these direct links (runs from your browser):</p>
                                                        <ul className="list-none space-y-1">
                                                            <li>1. <a href={`https://api.telegram.org/bot${data.telegram_bot_token}/setWebhook?url=${data.telegram_manual_webhook || window.location.origin}/webhook/telegram&secret_token=${data.telegram_webhook_secret}`} target="_blank" className="text-blue-400 hover:underline">Force Activate Webhook</a></li>
                                                            <li>2. <a href={`https://api.telegram.org/bot${data.telegram_bot_token}/getWebhookInfo`} target="_blank" className="text-blue-400 hover:underline">Check Webhook Status (API)</a></li>
                                                        </ul>
                                                        <a href={`https://api.telegram.org/bot${data.telegram_bot_token}/getUpdates`} target="_blank" className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 mt-2 font-medium">
                                                            <Activity size={12}/> View Real-time Webhook Diagnostic (Telegram API)
                                                        </a>
                                                    </div>
                                                    
                                                    {/* Original Test Button */}
                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                                                        <div className="text-left text-xs text-[var(--text-muted)]">
                                                            <strong className="text-[var(--text-primary)]">Test Integration:</strong> Verifies if your Server can talk to Telegram.<br/>Check your channel after clicking.
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => testConnection('telegram')}
                                                            disabled={testing.telegram}
                                                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 shrink-0"
                                                        >
                                                            {testing.telegram ? 'Testing...' : 'Send Test Message to Channel'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* WhatsApp Configuration */}
                            <div className={`relative bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden flex flex-col h-full ${data.whatsapp_enabled ? 'border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.15)]' : 'border-[var(--border)] shadow-xl'}`}>
                                
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                    <MessageCircle size={200} className="text-green-500" />
                                </div>

                                <div className="flex items-start justify-between mb-8 relative z-10 shrink-0">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl transition-all duration-300 ${data.whatsapp_enabled ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}>
                                            <MessageCircle size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">WhatsApp Setup</h3>
                                            <p className="text-[var(--text-muted)] mt-1">Broadcast via official Meta API.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={data.whatsapp_enabled}
                                            onChange={(e) => setData('whatsapp_enabled', e.target.checked)}
                                        />
                                        <div className="w-14 h-7 bg-[var(--bg-elevated)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                                    </label>
                                </div>

                                <AnimatePresence>
                                    {data.whatsapp_enabled && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-6 overflow-hidden relative z-10 flex-grow flex flex-col"
                                        >
                                            <div className="space-y-5 flex-grow">
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Meta Permanent Access Token</label>
                                                    <input
                                                        type="password"
                                                        value={data.whatsapp_access_token}
                                                        onChange={e => setData('whatsapp_access_token', e.target.value)}
                                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-mono text-sm"
                                                        placeholder="EAAI..."
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Phone Number ID</label>
                                                        <input
                                                            type="text"
                                                            value={data.whatsapp_phone_id}
                                                            onChange={e => setData('whatsapp_phone_id', e.target.value)}
                                                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-mono text-sm"
                                                            placeholder="101234..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Recipient ID (Phone or Group)</label>
                                                        <input
                                                            type="text"
                                                            value={data.whatsapp_group_id}
                                                            onChange={e => setData('whatsapp_group_id', e.target.value)}
                                                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-mono text-sm"
                                                            placeholder="123456..."
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Quick Template Select</label>
                                                    <select
                                                        value={data.whatsapp_post_template}
                                                        onChange={e => {
                                                            setData('whatsapp_post_template', e.target.value);
                                                            if (e.target.value === 'professional') setData('whatsapp_custom_template', '🚀 *New Project Alert!*\n\n*🔥 {title}*\n{description}\n\n💰 Price: *{price}*');
                                                            if (e.target.value === 'startup') setData('whatsapp_custom_template', 'We just launched 🚀\n\n*{title}* is now live!\n\nGrab it here: {link}');
                                                            if (e.target.value === 'minimal') setData('whatsapp_custom_template', 'New upload: {title} - {price}\n{link}');
                                                        }}
                                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                                    >
                                                        <option value="professional">Professional</option>
                                                        <option value="startup">Startup Launch</option>
                                                        <option value="minimal">Minimal Text</option>
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Post Template</label>
                                                    <textarea
                                                        value={data.whatsapp_custom_template}
                                                        onChange={e => setData('whatsapp_custom_template', e.target.value)}
                                                        rows="4"
                                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-mono text-sm"
                                                        placeholder="Use {title}, {description}, {price}, {link}"
                                                    ></textarea>
                                                </div>

                                                {/* Advanced Webhook Config */}
                                                <div className="pt-4 border-t border-[var(--border)] space-y-4">
                                                    <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                                                        <LinkIcon size={16} className="text-green-500"/> Webhook Configuration (Optional)
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <div>
                                                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 text-xs">Webhook Secret Verification Token</label>
                                                            <input
                                                                type="text"
                                                                value={data.whatsapp_webhook_secret}
                                                                onChange={e => setData('whatsapp_webhook_secret', e.target.value)}
                                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                                placeholder="e.g. hoacodelab_wa_2026"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 text-xs">Manual Webhook URL (For Meta Portal)</label>
                                                            <input
                                                                type="text"
                                                                value={data.whatsapp_manual_webhook}
                                                                onChange={e => setData('whatsapp_manual_webhook', e.target.value)}
                                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                                placeholder="https://moviemart.free.nf/webhook/whatsapp"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* WhatsApp Live Preview */}
                                            <div className="bg-[#EFEAE2] rounded-[2rem] p-6 border border-slate-300 shadow-2xl relative mt-6 overflow-hidden">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2"><Eye size={16} className="text-green-600" /> Live Template Preview</h4>
                                                    <span className="text-xs text-slate-500 font-mono bg-white px-2 py-1 rounded-md border border-slate-200">Mobile View</span>
                                                </div>
                                                
                                                <div className="bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center rounded-2xl p-4 shadow-inner">
                                                    <div className="bg-white max-w-[90%] rounded-2xl rounded-tl-sm p-1.5 shadow-sm">
                                                        {/* Link Preview Simulation */}
                                                        <div className="bg-[#F0F2F5] rounded-xl overflow-hidden mb-2 border border-slate-200/60">
                                                            <div className="w-full h-24 bg-slate-200 flex items-center justify-center relative">
                                                                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-teal-500/10"></div>
                                                                <LinkIcon className="text-slate-400" size={24} />
                                                            </div>
                                                            <div className="p-2.5">
                                                                <h5 className="font-bold text-slate-800 text-xs truncate">🔥 Pro E-Commerce Dashboard v2.0</h5>
                                                                <p className="text-slate-500 text-[10px] truncate">https://helpofai.com/project/123</p>
                                                            </div>
                                                        </div>
                                                        {/* Message Body */}
                                                        <div className="px-2 pb-1">
                                                            <p className="text-[#111B21] text-sm leading-snug">
                                                                🚀 *New Project Alert!*<br/><br/>
                                                                *Pro E-Commerce Dashboard v2.0*<br/>
                                                                A complete Next.js dashboard with Stripe.<br/><br/>
                                                                💰 Price: *$49.00*<br/><br/>
                                                                🔍 View Project: https://helpofai.com/...
                                                            </p>
                                                            <div className="text-right mt-1 text-[#667781] text-[10px]">10:42 AM <span className="text-blue-500 ml-1">✓✓</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 relative mt-6">
                                                <div className="absolute top-0 right-0 p-4 opacity-10"><Info size={40} className="text-green-500" /></div>
                                                <h4 className="font-black text-green-500 mb-4 uppercase tracking-widest text-[10px] flex items-center gap-2"><HelpCircle size={14}/> Setup Instructions</h4>
                                                
                                                <ol className="list-decimal list-inside space-y-3 text-xs text-[var(--text-primary)] leading-relaxed">
                                                    <li><strong>Meta Permanent Access Token:</strong> Go to <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" className="text-green-500 hover:underline">Meta Developer Portal</a>, create a Business App, add WhatsApp, and generate a Permanent Token in the Business Manager settings.</li>
                                                    <li><strong>Phone Number ID:</strong> Found in the Meta Developer Dashboard under WhatsApp &gt; API Setup.</li>
                                                    <li><strong>Recipient ID:</strong> The phone number (with country code) or Group ID where you want messages sent.</li>
                                                    <li><strong>Webhook Secret:</strong> Create a custom string (e.g., <code>hoacodelab_wa_2026</code>) and enter it here and in the Meta Portal's Webhook configuration.</li>
                                                    <li><strong>Webhook URL:</strong> Provide the exact URL below to Meta to receive incoming delivery status updates.</li>
                                                </ol>

                                                <div className="mt-6 flex flex-col gap-4">
                                                    {/* Webhook Connection Actions */}
                                                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex flex-col sm:flex-row gap-3 justify-between items-center">
                                                        <div className="text-left">
                                                            <h5 className="font-bold text-sm text-[var(--text-primary)]">Meta Webhook Connection Details</h5>
                                                            <p className="text-xs text-[var(--text-muted)]">Use these exact details in your Meta Developer Portal.</p>
                                                        </div>
                                                        <div className="flex flex-col gap-2 items-end">
                                                            <div className="text-[10px] font-mono bg-black/40 px-2 py-1 rounded text-green-300">
                                                                URL: {data.whatsapp_manual_webhook || window.location.origin + '/webhook/whatsapp'}
                                                            </div>
                                                            <div className="text-[10px] font-mono bg-black/40 px-2 py-1 rounded text-green-300">
                                                                Verify Token: {data.whatsapp_webhook_secret || 'Not set'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Original Test Button */}
                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                                                        <div className="text-left text-xs text-[var(--text-muted)]">
                                                            <strong className="text-[var(--text-primary)]">Test Integration:</strong> Verifies if your Server can talk to the WhatsApp Meta API.<br/>Check your recipient phone after clicking.
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => testConnection('whatsapp')}
                                                            disabled={testing.whatsapp}
                                                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 shrink-0"
                                                        >
                                                            {testing.whatsapp ? 'Testing...' : 'Send Test WhatsApp'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="sticky bottom-8 z-50 bg-[var(--bg-surface)]/90 backdrop-blur-xl border border-[var(--border)] p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-between">
                            <div className="text-sm text-[var(--text-muted)] font-medium px-4">
                                Settings take effect immediately across all newly published projects.
                            </div>
                            <div className="flex items-center gap-4">
                                <Link 
                                    href={route('admin.social-media.logs')}
                                    className="flex items-center gap-2 px-5 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all shadow-sm"
                                >
                                    <Activity size={18} /> View Activity Logs
                                </Link>
                                {recentlySuccessful && (
                                    <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-bold text-green-500 ml-4">
                                        Configuration saved.
                                    </motion.p>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-8 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-black rounded-xl transition-all shadow-[0_0_20px_var(--accent)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Save size={18} /> {processing ? 'Saving...' : 'Deploy Settings'}
                                </button>
                            </div>
                        </div>

                        {/* Logs Section */}
                        <div className="bg-[var(--bg-surface)] p-8 rounded-[2rem] border border-[var(--border)] shadow-xl relative overflow-hidden mt-8">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                <Activity size={200} />
                            </div>
                            <div className="flex items-center gap-5 mb-8 relative z-10">
                                <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-500">
                                    <Activity size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Transmission Logs</h3>
                                    <p className="text-[var(--text-muted)] mt-1">Live status of auto-posted projects and connection tests.</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto relative z-10">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[var(--border)]">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Time</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Platform</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Project</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs && logs.length > 0 ? logs.map(log => (
                                            <tr key={log.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors">
                                                <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-mono">{new Date(log.created_at).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    {log.platform === 'telegram' ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md"><Send size={12}/> Telegram</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md"><MessageCircle size={12}/> WhatsApp</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">
                                                    {log.project_id ? (log.project?.title || `Project #${log.project_id}`) : 'Connection Test'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        {log.status === 'success' ? (
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"><CheckCircle2 size={12}/> Success</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"><XCircle size={12}/> Failed</span>
                                                        )}
                                                        {log.status === 'failed' && (
                                                            <span className="text-[10px] text-rose-500/80 max-w-[200px] truncate" title={log.error_message}>{log.error_message}</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-sm text-[var(--text-muted)] italic">No social media logs generated yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
