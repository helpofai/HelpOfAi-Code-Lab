/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import { 
    KeyRound, Save, ShieldCheck, AlertCircle, ExternalLink, Copy, Check, 
    BookOpen, Globe, FileKey, Link2, HelpCircle, ChevronRight, 
    CheckCircle2, XCircle, Loader2, Settings as SettingsIcon,
    ArrowRight, UserCheck, Key, Eye, EyeOff, Info
} from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'https://helpofai.com';

const PROVIDERS = [
    {
        id: 'google',
        name: 'Google',
        icon: '🔴', 
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        gradient: 'from-red-500/20 to-red-500/5',
        docs: 'https://console.cloud.google.com/apis/credentials',
        docsLabel: 'Google Cloud Console',
        fields: [
            { key: 'google_client_id', label: 'Client ID', placeholder: '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', help: 'Found in Google Cloud Console > APIs & Services > Credentials' },
            { key: 'google_client_secret', label: 'Client Secret', type: 'password', placeholder: 'GOCSPX-abcdefghijklmnopqrstuvwxyz', help: 'Click the pencil icon next to your OAuth 2.0 Client ID to reveal' },
        ],
        redirectHint: `${APP_URL}/auth/google/callback`,
        redirectLabel: 'Authorized Redirect URI',
        scopes: ['openid', 'profile', 'email'],
        steps: [
            { title: 'Open Google Console', action: 'Go to "APIs & Services" then click "Credentials"', link: 'https://console.cloud.google.com/apis/credentials' },
            { title: 'Create Client ID', action: 'Click "+ Create Credentials" and select "OAuth client ID"', detail: 'Choose "Web application" for the Application type.' },
            { title: 'Set App Name', action: 'Give it a name like "My Awesome App"', detail: 'This is the name users see when they log in.' },
            { title: 'Add Callback URL', action: 'Copy the link below and paste it into "Authorized redirect URIs"', detail: 'Make sure it is exactly the same as shown below.' },
            { title: 'Copy Credentials', action: 'Save it, then copy your Client ID and Client Secret', detail: 'Paste them into the boxes in the "Configuration" tab above.' },
        ],
        note: '💡 Setup Hint: You must first set up the "OAuth consent screen" in Google. Choose "External" and add "email" and "profile" scopes.',
        status: {
            configured: 'Success! Google Login is ready.',
            missing: 'Needs Setup: Please add Client ID and Secret.',
            disabled: 'Google login is currently turned off.',
        }
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: '🔵',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        gradient: 'from-blue-500/20 to-blue-500/5',
        docs: 'https://developers.facebook.com/apps/',
        docsLabel: 'Facebook Developers',
        fields: [
            { key: 'facebook_client_id', label: 'App ID', placeholder: '1234567890123456', help: 'Found in Settings → Basic' },
            { key: 'facebook_client_secret', label: 'App Secret', type: 'password', placeholder: 'abcdefghijklmnopqrstuvwxyz123456', help: 'Click "Show" in Settings → Basic to reveal' },
        ],
        redirectHint: `${APP_URL}/auth/facebook/callback`,
        redirectLabel: 'Valid OAuth Redirect URI',
        scopes: ['email', 'public_profile'],
        steps: [
            { title: 'Open FB Developers', action: 'Go to "My Apps" and click "Create App"', link: 'https://developers.facebook.com/apps/' },
            { title: 'Select App Type', action: 'Choose "Allow people to log in" or "Consumer"', detail: 'This enables the Login feature.' },
            { title: 'Add Login Product', action: 'Find "Facebook Login" and click "Set Up"', detail: 'Choose "Web" as your platform.' },
            { title: 'Add Callback URL', action: 'Go to "Settings" under FB Login and paste the link below', detail: 'Paste it into the "Valid OAuth Redirect URIs" box.' },
            { title: 'Final Step', action: 'Go to Settings > Basic to find your App ID and Secret', detail: 'Copy them into the "Configuration" tab above and set app to "Live".' },
        ],
        note: '💡 Setup Hint: Facebook requires your site to use HTTPS. Make sure you add your Privacy Policy URL in the Basic Settings.',
        status: {
            configured: 'Success! Facebook Login is ready.',
            missing: 'Needs Setup: Please add App ID and Secret.',
            disabled: 'Facebook login is currently turned off.',
        }
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: '⚫',
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        gradient: 'from-gray-500/20 to-gray-500/5',
        docs: 'https://github.com/settings/developers',
        docsLabel: 'GitHub Developer Settings',
        fields: [
            { key: 'github_client_id', label: 'Client ID', placeholder: 'Iv1.abcdefghijklmnop', help: 'Found in GitHub OAuth Apps settings' },
            { key: 'github_client_secret', label: 'Client Secret', type: 'password', placeholder: 'abcdefghijklmnopqrstuvwxyz1234567890', help: 'Generate new secret if lost — old one becomes invalid' },
        ],
        redirectHint: `${APP_URL}/auth/github/callback`,
        redirectLabel: 'Authorization Callback URL',
        scopes: ['read:user', 'user:email'],
        steps: [
            { title: 'Open GitHub Settings', action: 'Go to "Developer settings" then "OAuth Apps"', link: 'https://github.com/settings/developers' },
            { title: 'Register New App', action: 'Click "New OAuth App"', detail: 'Enter your app name and website URL.' },
            { title: 'Add Callback URL', action: 'Paste the link below into "Authorization callback URL"', detail: 'This is the most important step for the login to work.' },
            { title: 'Get Client ID', action: 'Click "Register application" then copy the "Client ID"', detail: 'Paste it into the box in the "Configuration" tab above.' },
            { title: 'Generate Secret', action: 'Click "Generate a new client secret" and copy it', detail: 'GitHub only shows this once, so copy it immediately!' },
        ],
        note: '💡 Setup Hint: If users are seeing an error, make sure your GitHub App has "Read access" to user emails enabled.',
        status: {
            configured: 'Success! GitHub Login is ready.',
            missing: 'Needs Setup: Please add Client ID and Secret.',
            disabled: 'GitHub login is currently turned off.',
        }
    },
];

const TABS = [
    { id: 'setup', label: 'Guided Setup', icon: ArrowRight, desc: 'Step-by-step wizard for each provider' },
    { id: 'config', label: 'Configuration', icon: SettingsIcon, desc: 'Manage credentials and enable providers' },
    { id: 'docs', label: 'Documentation', icon: BookOpen, desc: 'Detailed reference and troubleshooting' },
];

export default function AuthSettings({ settings }) {
    const [activeTab, setActiveTab] = useState('setup');
    const [activeProvider, setActiveProvider] = useState('google');
    const [setupStep, setSetupStep] = useState(0);
    const [showSecrets, setShowSecrets] = useState({ google: false, facebook: false, github: false });

    const { data, setData, post, processing, errors } = useForm({
        google_client_id: settings?.google_client_id || '',
        google_client_secret: settings?.google_client_secret || '',
        google_enabled: settings?.google_enabled === '1' || settings?.google_enabled === true,

        facebook_client_id: settings?.facebook_client_id || '',
        facebook_client_secret: settings?.facebook_client_secret || '',
        facebook_enabled: settings?.facebook_enabled === '1' || settings?.facebook_enabled === true,

        github_client_id: settings?.github_client_id || '',
        github_client_secret: settings?.github_client_secret || '',
        github_enabled: settings?.github_enabled === '1' || settings?.github_enabled === true,
    });

    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text, id) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.auth.settings.update'));
    };

    const getProvider = (id) => PROVIDERS.find(p => p.id === id);
    const provider = getProvider(activeProvider);

    const isConfigured = (id) => {
        const p = getProvider(id);
        return data[`${p.id}_client_id`] && data[`${p.id}_client_secret`];
    };

    const getStatus = (id) => {
        if (!data[`${id}_enabled`]) return { type: 'disabled', text: provider?.status?.disabled || 'Disabled' };
        if (!isConfigured(id)) return { type: 'warning', text: provider?.status?.missing || 'Not configured' };
        return { type: 'success', text: provider?.status?.configured || 'Configured' };
    };

    const renderStatusBadge = (id) => {
        const status = getStatus(id);
        const colors = {
            success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            disabled: 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)]',
        };
        const icons = { success: CheckCircle2, warning: AlertCircle, disabled: XCircle };
        const Icon = icons[status.type];
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${colors[status.type]}`}>
                <Icon size={10} /> {status.text}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-2xl text-purple-500">
                            <KeyRound size={24} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Authentication_Center</h2>
                            <p className="text-[10px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Social Login Providers & OAuth Management</p>
                        </div>
                    </div>
                }
            >
                <Head title="Auth Settings" />
                <div className="relative min-h-full p-8 lg:p-12">
                    <AnimatedGrid />

                    <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                        {/* Provider Selector + Status Bar */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-6 shadow-2xl">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Active Provider:</span>
                                    <div className="flex gap-2">
                                        {PROVIDERS.map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => { setActiveProvider(p.id); setSetupStep(0); }}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                    activeProvider === p.id 
                                                        ? `bg-gradient-to-r ${p.gradient} border ${p.border} ${p.color}` 
                                                        : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--text-muted)]'
                                                }`}
                                            >
                                                <span className="text-lg">{p.icon}</span>
                                                <span className="hidden sm:inline">{p.name}</span>
                                                {renderStatusBadge(p.id)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a href={provider.docs} target="_blank" className="px-4 py-2.5 bg-purple-500/10 border border-purple-500/30 text-purple-500 hover:bg-purple-500 hover:text-white transition-all rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <ExternalLink size={12} /> {provider.docsLabel}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-2xl">
                            <div className="flex border-b border-[var(--border)] bg-[var(--bg-elevated)]/50">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                                            activeTab === tab.id
                                                ? 'text-white bg-gradient-to-r from-purple-500 to-purple-600'
                                                : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-main)]/50'
                                        }`}
                                    >
                                        <tab.icon size={14} /> {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Panels */}
                            <div className="p-8">
                                {activeTab === 'setup' && <SetupWizard provider={provider} activeProvider={activeProvider} setupStep={setupStep} setSetupStep={setSetupStep} copyToClipboard={copyToClipboard} copied={copied} />}
                                {activeTab === 'config' && <ConfigPanel provider={provider} data={data} setData={setData} errors={errors} processing={processing} submit={submit} showSecrets={showSecrets} setShowSecrets={setShowSecrets} copyToClipboard={copyToClipboard} copied={copied} />}
                                {activeTab === 'docs' && <DocsPanel provider={provider} />}
                            </div>
                        </div>

                        {/* Quick Reference Card */}
                        <div className="bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5 border border-purple-500/20 rounded-[2rem] p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none bg-gradient-to-l from-purple-500 to-transparent" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-500"><Globe size={20} /></div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter">Quick_Reference</h3>
                                        <p className="text-[10px] text-purple-500 font-bold uppercase tracking-[0.4em] mt-1">All Callback URLs at a Glance</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {PROVIDERS.map((p) => (
                                        <div key={p.id} className="p-5 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] hover:border-purple-500/30 transition-all">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">{p.icon}</span>
                                                <div>
                                                    <p className="font-bold text-sm">{p.name}</p>
                                                    <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{p.redirectLabel}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <code className="flex-1 text-[9px] font-mono text-cyan-500 bg-black/30 p-2 rounded-lg break-all">{p.redirectHint}</code>
                                                <button
                                                    onClick={() => copyToClipboard(p.redirectHint, p.id + '-ref')}
                                                    className={`p-2 rounded-lg border transition-all shrink-0 ${copied === p.id + '-ref' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : 'bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-muted)] hover:text-cyan-500'}`}
                                                >
                                                    {copied === p.id + '-ref' ? <Check size={12} /> : <Copy size={12} />}
                                                </button>
                                            </div>
                                            <p className="text-[9px] text-[var(--text-muted)] mt-2">Scopes: {p.scopes.join(', ')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}

/* ===== SETUP WIZARD ===== */
function SetupWizard({ provider, activeProvider, setupStep, setSetupStep, copyToClipboard, copied }) {
    const step = provider.steps[setupStep];
    const isLastStep = setupStep === provider.steps.length - 1;
    const isFirstStep = setupStep === 0;

    return (
        <div className="space-y-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between">
                <div className="flex-1 h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden mr-4">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300" style={{ width: `${((setupStep + 1) / provider.steps.length) * 100}%` }} />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider w-20 text-right">
                    Step {setupStep + 1} / {provider.steps.length}
                </span>
            </div>

            {/* Step Card */}
            <div className="bg-[var(--bg-elevated)]/50 border border-[var(--border)] rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
                
                <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shrink-0">
                        {setupStep + 1}
                    </div>
                    <div className="flex-1 pt-1">
                        <h3 className="text-lg font-black uppercase tracking-tighter">{step.title}</h3>
                        <p className="text-[var(--text-muted)] mt-2 leading-relaxed">{step.action}</p>
                        {step.detail && <p className="text-[10px] text-[var(--text-muted)] mt-2 italic">{step.detail}</p>}
                        {step.link && (
                            <a href={step.link} target="_blank" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-500 hover:bg-purple-500 hover:text-white transition-all rounded-xl text-[9px] font-black uppercase tracking-widest">
                                <ExternalLink size={12} /> Open Console
                            </a>
                        )}
                    </div>
                </div>

                {/* Callback URL Section (Step 4 for Google/FB, Step 3 for GitHub) */}
                {(setupStep === (activeProvider === 'github' ? 2 : 3)) && (
                    <div className="mt-8 p-6 bg-black/30 border border-cyan-500/20 rounded-2xl relative">
                        <div className="absolute -top-3 left-6 px-3 bg-[var(--bg-elevated)] text-[9px] font-black text-cyan-500 uppercase tracking-wider">
                            Copy This URL
                        </div>
                        <div className="flex items-center gap-3">
                            <Link2 size={20} className="text-cyan-500 shrink-0" />
                            <div className="flex-1">
                                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{provider.redirectLabel}</p>
                                <code className="text-[10px] font-mono text-cyan-500 break-all">{provider.redirectHint}</code>
                            </div>
                            <button
                                onClick={() => copyToClipboard(provider.redirectHint, 'wizard')}
                                className={`p-3 rounded-xl border transition-all shrink-0 ${copied === 'wizard' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : 'bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-muted)] hover:text-cyan-500'}`}
                            >
                                {copied === 'wizard' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <p className="text-[9px] text-[var(--text-muted)] mt-3 text-center">Paste this exact URL into the provider's redirect/callback field.</p>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-[var(--border)]">
                    <button
                                        onClick={() => setSetupStep(s => Math.max(0, s - 1))}
                                        disabled={isFirstStep}
                                        className="px-6 py-3 bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--text-muted)] transition-all rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <ChevronRight size={14} className="-rotate-90" /> Back
                                    </button>
                    <button
                                        onClick={() => setSetupStep(s => Math.min(provider.steps.length - 1, s + 1))}
                                        disabled={isLastStep}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 transition-all rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isLastStep ? 'Complete' : 'Next'} <ChevronRight size={14} />
                                    </button>
                </div>
            </div>

            {/* Mini Stepper */}
            <div className="flex gap-2 overflow-x-auto pb-4">
                {provider.steps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setSetupStep(i)}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${i === setupStep ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-white'}`}
                    >
                        {String(i + 1).padStart(2, '0')} {s.title}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ===== CONFIGURATION PANEL ===== */
function ConfigPanel({ provider, data, setData, errors, processing, submit, showSecrets, setShowSecrets, copyToClipboard, copied }) {
    return (
        <form onSubmit={submit} className="space-y-8">
            {/* Credentials */}
            <div className="bg-[var(--bg-elevated)]/50 border border-[var(--border)] rounded-2xl p-8">
                <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                    <Key size={18} className="text-purple-500" /> Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {provider.fields.map((field) => (
                        <div key={field.key} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <InputLabel value={field.label} className="font-bold text-[10px] uppercase tracking-widest" />
                                {field.help && (
                                    <span className="relative group">
                                        <Info size={12} className="text-[var(--text-muted)] cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-[9px] text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap max-w-xs">
                                            {field.help}
                                        </div>
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <TextInput
                                    type={showSecrets[provider.id] || field.type !== 'password' ? 'text' : 'password'}
                                    value={data[field.key]}
                                    onChange={e => setData(field.key, e.target.value)}
                                    className="bg-[var(--bg-main)] border-[var(--border)] rounded-xl py-3 pr-12"
                                    placeholder={field.placeholder}
                                />
                                {field.type === 'password' && (
                                    <button
                                        type="button"
                                        onClick={() => setShowSecrets(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
                                    >
                                        {showSecrets[provider.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                )}
                            </div>
                            {errors[field.key] && <p className="text-rose-500 text-[10px] font-bold">{errors[field.key]}</p>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Callback URL */}
            <div className="bg-[var(--bg-elevated)]/50 border border-[var(--border)] rounded-2xl p-8">
                <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                    <Link2 size={18} className="text-cyan-500" /> Callback URL
                </h3>
                <div className="flex items-center gap-3 bg-black/30 border border-cyan-500/20 rounded-xl p-3">
                    <code className="flex-1 text-[10px] font-mono text-cyan-500 break-all">{provider.redirectHint}</code>
                    <button
                        type="button"
                        onClick={() => copyToClipboard(provider.redirectHint, 'config')}
                        className={`p-2 rounded-lg border transition-all shrink-0 ${copied === 'config' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : 'bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-muted)] hover:text-cyan-500'}`}
                    >
                        {copied === 'config' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>
                <p className="text-[9px] text-[var(--text-muted)] mt-2">
                    This URL must be added to <span className="text-cyan-500 font-medium">{provider.redirectLabel}</span> in the {provider.name} developer console.
                </p>
            </div>

            {/* Enable Toggle + Save */}
            <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-[var(--bg-elevated)]/50 border border-[var(--border)] rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                        <UserCheck size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Enable {provider.name} Login</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Allow users to sign in with their {provider.name} account</p>
                    </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data[`${provider.id}_enabled`]}
                        onChange={e => setData(`${provider.id}_enabled`, e.target.checked)}
                        className="toggle toggle-primary"
                    />
                    <span className={`text-[9px] font-black uppercase tracking-wider ${data[`${provider.id}_enabled`] ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                        {data[`${provider.id}_enabled`] ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                </label>
            </div>

            <PrimaryButton type="submit" className="w-full lg:w-auto bg-purple-500 hover:bg-purple-600 px-12 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-purple-500/20" disabled={processing}>
                {processing ? <Loader2 size={18} className="animate-spin" /> : <> <Save size={18} className="mr-2" /> Save Configuration </>}
            </PrimaryButton>
        </form>
    );
}

/* ===== DOCUMENTATION PANEL ===== */
function DocsPanel({ provider }) {
    return (
        <div className="space-y-8">
            {/* Steps */}
            <div className="bg-[var(--bg-elevated)]/50 border border-[var(--border)] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent">
                    <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                        <BookOpen size={18} className="text-purple-500" /> Setup Guide
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    {provider.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border)] hover:border-purple-500/20 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1 pt-1">
                                <h4 className="font-semibold">{step.title}</h4>
                                <p className="text-[var(--text-muted)] text-sm mt-0.5">{step.action}</p>
                                {step.detail && <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">{step.detail}</p>}
                                {step.link && (
                                    <a href={step.link} target="_blank" className="inline-flex items-center gap-1 mt-2 text-cyan-500 hover:text-white text-[9px] font-bold uppercase tracking-wider">
                                        <ExternalLink size={10} /> Open Console
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex gap-3">
                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                    <div>
                        <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Important Notes</h4>
                        <p className="text-[10px] text-amber-500/80 leading-relaxed whitespace-pre-line">{provider.note}</p>
                    </div>
                </div>
            </div>

            {/* Scopes */}
            <div className="bg-[var(--bg-elevated)]/50 border border-[var(--border)] rounded-2xl p-6">
                <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Requested Scopes
                </h4>
                <div className="flex flex-wrap gap-2">
                    {provider.scopes.map((scope) => (
                        <span key={scope} className="px-3 py-1.5 bg-black/30 border border-[var(--border)] rounded-full text-[9px] font-mono text-cyan-500">{scope}</span>
                    ))}
                </div>
                <p className="text-[9px] text-[var(--text-muted)] mt-4">
                    These permissions are requested during the OAuth flow. Users must approve them for login to complete.
                </p>
            </div>

            {/* Troubleshooting */}
            <div className="bg-[var(--bg-elevated)]/50 border border-[var(--border)] rounded-2xl p-6">
                <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HelpCircle size={14} className="text-purple-500" /> Common Issues
                </h4>
                <div className="space-y-3 text-[10px] text-[var(--text-muted)]">
                    <div className="flex gap-3 p-3 bg-black/30 rounded-xl">
                        <XCircle className="text-rose-500 shrink-0" size={14} />
                        <span><span className="font-medium text-white">redirect_uri_mismatch:</span> Callback URL in provider console doesn't match exactly. Check for trailing slashes, http vs https.</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-black/30 rounded-xl">
                        <XCircle className="text-rose-500 shrink-0" size={14} />
                        <span><span className="font-medium text-white">invalid_client:</span> Client ID or Secret is incorrect. Regenerate secret and update both fields.</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-black/30 rounded-xl">
                        <XCircle className="text-rose-500 shrink-0" size={14} />
                        <span><span className="font-medium text-white">access_denied:</span> User declined consent or app is in Testing mode (Google/FB). Publish to Production.</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-black/30 rounded-xl">
                        <XCircle className="text-rose-500 shrink-0" size={14} />
                        <span><span className="font-medium text-white">email not returned:</span> Ensure 'email' scope is requested and user has a verified email on their account.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}