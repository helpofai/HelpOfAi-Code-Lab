import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    Crown, Settings, Save, 
    CreditCard, Users, ShieldCheck, 
    Lock, Globe, Zap, HardDrive,
    Mail, Terminal, Activity, Eye,
    AlertTriangle, Database, Book,
    Shield, Key, Link as LinkIcon,
    ChevronRight, CheckCircle2, Server
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useToast } from '@/Components/Toast/ToastProvider';
import axios from 'axios';

export default function SubscriptionSettings({ auth, settings }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        settings: settings
    });

    const [activeSector, setActiveSector] = useState('monetization');
    const [activeGateway, setActiveGateway] = useState('stripe');
    const [isTesting, setIsTesting] = useState(null);
    const toast = useToast();

    const testGateway = async (gateway) => {
        setIsTesting(gateway);
        try {
            const res = await axios.post(route('admin.subscriptions.test-gateway'), { gateway });
            toast.success(res.data.message);
        } catch (e) {
            toast.error('Handshake_Failed: ' + (e.response?.data?.message || 'Unknown protocol error.'));
        } finally {
            setIsTesting(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.update'));
    };

    const updateSetting = (key, value) => {
        setData('settings', {
            ...data.settings,
            [key]: value
        });
    };

    const sectors = [
        { id: 'monetization', name: 'Monetization', icon: CreditCard, color: 'text-amber-500' },
        { id: 'billing', name: 'Billing_Config', icon: Zap, color: 'text-blue-500' },
        { id: 'quotas', name: 'Resource_Quotas', icon: HardDrive, color: 'text-cyan-500' },
        { id: 'security', name: 'Security_&_Auth', icon: ShieldCheck, color: 'text-rose-500' },
        { id: 'system', name: 'System_Config', icon: Terminal, color: 'text-purple-500' },
    ];

    const Toggle = ({ value, onToggle, label, description }) => (
        <div className="flex items-center justify-between p-5 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] hover:border-white/10 transition-all">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">{label}</p>
                <p className="text-[8px] text-[var(--text-muted)] uppercase italic">{description}</p>
            </div>
            <button 
                type="button"
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${value === '1' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${value === '1' ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4 text-left">
                        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500">
                            <Crown size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Global_Command</h2>
                            <p className="text-[8px] text-amber-500 uppercase tracking-[0.4em] font-bold mt-1">SaaS Deployment Protocols</p>
                        </div>
                    </div>
                }
            >
                <Head title="Advanced Settings" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-6xl mx-auto relative z-10">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            
                            {/* Sector Navigation */}
                            <div className="lg:col-span-1 space-y-2">
                                {sectors.map((sector) => (
                                    <button
                                        key={sector.id}
                                        onClick={() => setActiveSector(sector.id)}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl border transition-all ${
                                            activeSector === sector.id 
                                            ? 'bg-white/5 border-white/10 text-[var(--text-main)] shadow-lg' 
                                            : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                                        }`}
                                    >
                                        <sector.icon size={18} className={activeSector === sector.id ? sector.color : ''} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{sector.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Options Panel */}
                            <div className="lg:col-span-3">
                                <form onSubmit={submit} className="space-y-8">
                                    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                                        
                                        {activeSector === 'monetization' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8">
                                                    <CreditCard className="text-amber-500" size={20} />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Pricing_&_Revenue</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <InputLabel value="Monthly_Uplink_Price ($)" />
                                                        <TextInput type="number" step="0.01" value={data.settings.pro_monthly_price} onChange={e => updateSetting('pro_monthly_price', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InputLabel value="Yearly_Uplink_Price ($)" />
                                                        <TextInput type="number" step="0.01" value={data.settings.pro_yearly_price} onChange={e => updateSetting('pro_yearly_price', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InputLabel value="Trial_Period_Duration (Days)" />
                                                        <TextInput type="number" value={data.settings.pro_trial_days} onChange={e => updateSetting('pro_trial_days', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeSector === 'billing' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                                <div className="flex items-center justify-between border-b border-[var(--border)] pb-6 mb-8">
                                                    <div className="flex items-center gap-3">
                                                        <Zap className="text-blue-500" size={20} />
                                                        <h3 className="text-sm font-black uppercase tracking-widest">Gateway_Configuration</h3>
                                                    </div>
                                                    
                                                    {/* Top Tabs System */}
                                                    <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border)] overflow-x-auto no-scrollbar">
                                                        {['test', 'stripe', 'razorpay', 'paytm', 'phonepe'].map((gw) => (
                                                            <button 
                                                                key={gw}
                                                                type="button"
                                                                onClick={() => setActiveGateway(gw)}
                                                                className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${activeGateway === gw ? 'bg-white text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                                                            >
                                                                {gw}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <Toggle 
                                                        value={data.settings[`${activeGateway}_enabled`]} 
                                                        onToggle={() => updateSetting(`${activeGateway}_enabled`, data.settings[`${activeGateway}_enabled`] === '1' ? '0' : '1')}
                                                        label={`${activeGateway.toUpperCase()}_Protocol_Status`}
                                                        description={`Activate or hibernate the ${activeGateway} payment bridge.`}
                                                    />

                                                    {activeGateway === 'test' && (
                                                        <div className="space-y-6 animate-in fade-in duration-300">
                                                            <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-4">
                                                                <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
                                                                    <Activity className="text-amber-500" size={18} />
                                                                    <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural_Test_Bridge</h4>
                                                                </div>
                                                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-relaxed">
                                                                    This bridge allows for instant purchase verification without external ciphers. Use this for testing the "Neural Lock" and "Marketplace" flows in development.
                                                                </p>
                                                                <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 rounded-lg text-amber-500 text-[9px] font-black uppercase tracking-widest">
                                                                    <AlertTriangle size={14} /> Warning: Do not enable in production environments.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeGateway === 'stripe' && (
                                                        <div className="space-y-6 animate-in fade-in duration-300">
                                                            <div className="space-y-2">
                                                                <InputLabel value="STRIPE_KEY" />
                                                                <TextInput placeholder="pk_test_..." value={data.settings.stripe_key} onChange={e => updateSetting('stripe_key', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <InputLabel value="STRIPE_SECRET" />
                                                                <TextInput type="password" placeholder="sk_test_..." value={data.settings.stripe_secret} onChange={e => updateSetting('stripe_secret', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <InputLabel value="STRIPE_WEBHOOK_SECRET" />
                                                                <TextInput type="password" placeholder="whsec_..." value={data.settings.stripe_webhook_secret} onChange={e => updateSetting('stripe_webhook_secret', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <InputLabel value="STRIPE_PRO_PRICE_ID" />
                                                                <TextInput placeholder="price_..." value={data.settings.stripe_pro_price_id} onChange={e => updateSetting('stripe_pro_price_id', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>

                                                            {/* Detailed Stripe Documentation */}
                                                            <div className="mt-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-8">
                                                                <div className="flex items-center gap-3 border-b border-blue-500/20 pb-4">
                                                                    <Book className="text-blue-400" size={18} />
                                                                    <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Stripe Integration Manual</h4>
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-1 gap-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-relaxed">
                                                                    <div className="space-y-4">
                                                                        <div className="flex gap-4">
                                                                            <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">1</span>
                                                                            <p><span className="text-white">Obtain API Keys:</span> Access the <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-blue-400 underline">Stripe Keys Dashboard</a>. Toggle "Test Mode" if developing. Copy the <span className="text-white">Publishable Key</span> (STRIPE_KEY) and <span className="text-white">Secret Key</span> (STRIPE_SECRET).</p>
                                                                        </div>
                                                                        <div className="flex gap-4">
                                                                            <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">2</span>
                                                                            <p><span className="text-white">Create Subscription Product:</span> Go to <span className="text-white">Product Catalog</span>. Create a "Pro Plan". Add a recurring price. Copy the <span className="text-white">API ID</span> (starts with <code className="text-emerald-400">price_...</code>) and paste it into the Price ID field above.</p>
                                                                        </div>
                                                                        <div className="flex gap-4">
                                                                            <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">3</span>
                                                                            <p><span className="text-white">Webhook Signal Hub:</span> Navigate to <span className="text-white">Developers {">"} Webhooks</span>. Add an endpoint with the following URL:</p>
                                                                        </div>
                                                                        <div className="ml-10 group relative">
                                                                            <code className="block bg-black/40 p-4 rounded-xl text-emerald-400 font-mono border border-white/5 break-all select-all">
                                                                                {window.location.origin}/api/subscription/stripe/webhook
                                                                            </code>
                                                                        </div>
                                                                        <div className="flex gap-4">
                                                                            <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">4</span>
                                                                            <p><span className="text-white">Event Selection:</span> While adding the webhook, select <span className="text-white">checkout.session.completed</span> and <span className="text-white">customer.subscription.deleted</span>. These events manage automatic user upgrades/downgrades.</p>
                                                                        </div>
                                                                        <div className="flex gap-4">
                                                                            <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">5</span>
                                                                            <p><span className="text-white">Final Security:</span> Once created, click <span className="text-white">"Reveal"</span> under Signing Secret. Copy the <code className="text-emerald-400">whsec_...</code> string into STRIPE_WEBHOOK_SECRET.</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeGateway === 'razorpay' && (
                                                        <div className="space-y-6 animate-in fade-in duration-300">
                                                            <div className="space-y-2">
                                                                <InputLabel value="RAZORPAY_KEY" />
                                                                <TextInput placeholder="rzp_test_..." value={data.settings.razorpay_key} onChange={e => updateSetting('razorpay_key', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <InputLabel value="RAZORPAY_SECRET" />
                                                                <TextInput type="password" placeholder="Secret Key" value={data.settings.razorpay_secret} onChange={e => updateSetting('razorpay_secret', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>

                                                            {/* Detailed Razorpay Documentation */}
                                                            <div className="mt-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-8">
                                                                <div className="flex items-center gap-3 border-b border-blue-500/20 pb-4">
                                                                    <Book className="text-blue-400" size={18} />
                                                                    <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Razorpay Integration Manual</h4>
                                                                </div>
                                                                
                                                                <div className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-relaxed">
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">1</span>
                                                                        <p><span className="text-white">Handshake Credentials:</span> Go to <a href="https://dashboard.razorpay.com/app/keys" target="_blank" className="text-blue-400 underline">Razorpay Settings {">"} API Keys</a>. Generate a new key. Copy <span className="text-white">Key ID</span> and <span className="text-white">Key Secret</span> to the fields above.</p>
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">2</span>
                                                                        <p><span className="text-white">Webhook Sync:</span> Navigate to <span className="text-white">Settings {">"} Webhooks</span>. Add a new webhook URL:</p>
                                                                    </div>
                                                                    <div className="ml-10 group relative">
                                                                        <code className="block bg-black/40 p-4 rounded-xl text-emerald-400 font-mono border border-white/5 break-all select-all">
                                                                            {window.location.origin}/api/subscription/razorpay/webhook
                                                                        </code>
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">3</span>
                                                                        <p><span className="text-white">Active Listeners:</span> Set the Webhook Secret (optional, but recommended). Subscribe to <span className="text-white">subscription.authenticated</span>, <span className="text-white">subscription.activated</span>, and <span className="text-white">subscription.charged</span> events.</p>
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">4</span>
                                                                        <p><span className="text-white">Currency Protocol:</span> Ensure your account supports <span className="text-white">INR</span> (Indian Rupee) or the target currency of your deployment matrix.</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeGateway === 'paytm' && (
                                                        <div className="space-y-6 animate-in fade-in duration-300">
                                                            <div className="space-y-2">
                                                                <InputLabel value="PAYTM_MERCHANT_ID" />
                                                                <TextInput placeholder="Merchant ID" value={data.settings.paytm_merchant_id} onChange={e => updateSetting('paytm_merchant_id', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <InputLabel value="PAYTM_MERCHANT_KEY" />
                                                                <TextInput type="password" placeholder="Merchant Key" value={data.settings.paytm_merchant_key} onChange={e => updateSetting('paytm_merchant_key', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <InputLabel value="PAYTM_WEBSITE" />
                                                                <TextInput placeholder="WEBSTAGING / DEFAULT" value={data.settings.paytm_website} onChange={e => updateSetting('paytm_website', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>

                                                            {/* Detailed Paytm Documentation */}
                                                            <div className="mt-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-8">
                                                                <div className="flex items-center gap-3 border-b border-blue-500/20 pb-4">
                                                                    <Book className="text-blue-400" size={18} />
                                                                    <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Paytm Integration Manual</h4>
                                                                </div>
                                                                
                                                                <div className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-relaxed">
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">1</span>
                                                                        <p><span className="text-white">Cipher Acquisition:</span> Log in to <a href="https://dashboard.paytm.com/next/apikeys" target="_blank" className="text-blue-400 underline">Paytm for Business</a>. Navigate to <span className="text-white">Developer Settings {">"} API Keys</span>. Copy your <span className="text-white">MID</span> and <span className="text-white">Merchant Key</span>.</p>
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">2</span>
                                                                        <p><span className="text-white">Environment Logic:</span> Set Website to <span className="text-white font-black">WEBSTAGING</span> while using Test Keys. Switch to <span className="text-white font-black">DEFAULT</span> when deploying in the production matrix.</p>
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">3</span>
                                                                        <p><span className="text-white">Callback Uplink:</span> Add the following URL to your Paytm Dashboard settings to receive transmission status updates:</p>
                                                                    </div>
                                                                    <div className="ml-10 group relative">
                                                                        <code className="block bg-black/40 p-4 rounded-xl text-emerald-400 font-mono border border-white/5 break-all select-all">
                                                                            {window.location.origin}/api/subscription/paytm/webhook
                                                                        </code>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {activeGateway === 'phonepe' && (
                                                        <div className="space-y-6 animate-in fade-in duration-300">
                                                            <div className="space-y-2">
                                                                <InputLabel value="PHONEPE_MERCHANT_ID" />
                                                                <TextInput placeholder="PGMD..." value={data.settings.phonepe_merchant_id} onChange={e => updateSetting('phonepe_merchant_id', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <InputLabel value="PHONEPE_SALT_KEY" />
                                                                <TextInput type="password" placeholder="Salt Key" value={data.settings.phonepe_salt_key} onChange={e => updateSetting('phonepe_salt_key', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <InputLabel value="SALT_INDEX" />
                                                                    <TextInput type="number" value={data.settings.phonepe_salt_index} onChange={e => updateSetting('phonepe_salt_index', e.target.value)} className="w-full bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <InputLabel value="ENVIRONMENT" />
                                                                    <select value={data.settings.phonepe_env} onChange={e => updateSetting('phonepe_env', e.target.value)} className="w-full bg-[var(--bg-elevated)] border-[var(--border)] rounded-md text-[10px] font-bold uppercase p-2 focus:ring-blue-500">
                                                                        <option value="UAT">UAT (Test)</option>
                                                                        <option value="PRODUCTION">PRODUCTION</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            {/* Detailed PhonePe Documentation */}
                                                            <div className="mt-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-8">
                                                                <div className="flex items-center gap-3 border-b border-blue-500/20 pb-4">
                                                                    <Book className="text-blue-400" size={18} />
                                                                    <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">PhonePe Integration Manual</h4>
                                                                </div>
                                                                
                                                                <div className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-relaxed">
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">1</span>
                                                                        <p><span className="text-white">Merchant Onboarding:</span> Access the <a href="https://www.phonepe.com/business-solutions/payment-gateway/" target="_blank" className="text-blue-400 underline">PhonePe Business Portal</a>. Obtain your <span className="text-white">PG Merchant ID</span> and <span className="text-white">Salt Key</span>.</p>
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">2</span>
                                                                        <p><span className="text-white">Salt Logic:</span> The <span className="text-white">Salt Index</span> is usually <span className="text-white font-black">1</span>. If PhonePe provided multiple keys, use the index corresponding to the key you injected above.</p>
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">3</span>
                                                                        <p><span className="text-white">Uplink URL:</span> Configure your PhonePe Merchant dashboard to transmit signals to this endpoint:</p>
                                                                    </div>
                                                                    <div className="ml-10 group relative">
                                                                        <code className="block bg-black/40 p-4 rounded-xl text-emerald-400 font-mono border border-white/5 break-all select-all">
                                                                            {window.location.origin}/api/subscription/phonepe/webhook
                                                                        </code>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 pt-6 border-t border-[var(--border)]">
                                                    <button 
                                                        type="button"
                                                        onClick={() => testGateway(activeGateway)}
                                                        disabled={isTesting === activeGateway}
                                                        className="flex-1 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {isTesting === activeGateway ? <Activity size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                                                        Verify_{activeGateway.toUpperCase()}_Handshake
                                                    </button>
                                                </div>

                                                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                                                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed">
                                                        Establishing secure uplink with {activeGateway.toUpperCase()} API node. Verify credentials before commit.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {activeSector === 'quotas' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8">
                                                    <HardDrive className="text-cyan-500" size={20} />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Resource_Constraints</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <InputLabel value="Free_Project_Quota" />
                                                        <TextInput type="number" value={data.settings.free_project_limit} onChange={e => updateSetting('free_project_limit', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InputLabel value="Max_Upload_Payload (MB)" />
                                                        <TextInput type="number" value={data.settings.max_upload_size_mb} onChange={e => updateSetting('max_upload_size_mb', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                </div>
                                                <Toggle 
                                                    value={data.settings.enforce_pro_privacy} 
                                                    onToggle={() => updateSetting('enforce_pro_privacy', data.settings.enforce_pro_privacy === '1' ? '0' : '1')}
                                                    label="Gated_Privacy_Shield"
                                                    description="Only allow Pro users to create restricted nodes."
                                                />
                                            </div>
                                        )}

                                        {activeSector === 'security' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8">
                                                    <ShieldCheck className="text-rose-500" size={20} />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Access_Security</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    <Toggle 
                                                        value={data.settings.enable_public_signups} 
                                                        onToggle={() => updateSetting('enable_public_signups', data.settings.enable_public_signups === '1' ? '0' : '1')}
                                                        label="Public_Node_Registration"
                                                        description="Allow new entities to register without invitation."
                                                    />
                                                    <Toggle 
                                                        value={data.settings.require_email_verification} 
                                                        onToggle={() => updateSetting('require_email_verification', data.settings.require_email_verification === '1' ? '0' : '1')}
                                                        label="Identity_Verification"
                                                        description="Enforce email verification for all new uplinks."
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {activeSector === 'system' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8">
                                                    <Terminal className="text-purple-500" size={20} />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Core_Diagnostics</h3>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <InputLabel value="Maintenance_Bypass_Cipher" />
                                                        <div className="flex gap-2">
                                                            <TextInput value={data.settings.maintenance_bypass_key} readOnly className="bg-[var(--bg-elevated)] font-mono text-emerald-500 cursor-not-allowed" />
                                                            <button type="button" onClick={() => updateSetting('maintenance_bypass_key', 'HOA-' + Math.random().toString(36).substr(2, 8).toUpperCase())} className="px-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl hover:bg-white/5 transition-colors"><Zap size={14}/></button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InputLabel value="API_Burst_Limit (Requests/Min)" />
                                                        <TextInput type="number" value={data.settings.global_rate_limit} onChange={e => updateSetting('global_rate_limit', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                    <Toggle 
                                                        value={data.settings.allow_guest_preview} 
                                                        onToggle={() => updateSetting('allow_guest_preview', data.settings.allow_guest_preview === '1' ? '0' : '1')}
                                                        label="Guest_Live_Stream"
                                                        description="Allow unauthenticated users to preview public cores."
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-12 pt-8 border-t border-[var(--border)] flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-rose-500/50 text-left">
                                                <AlertTriangle size={14} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Irreversible_System_Change</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {recentlySuccessful && (
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Sync_Verified</span>
                                                )}
                                                <PrimaryButton disabled={processing} className="px-12 py-4">
                                                    <Save size={16} className="mr-2" /> Commit_Protocols
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}