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
import React, { useState } from 'react';
import { KeyRound, Save, ShieldCheck, AlertCircle, ExternalLink, Copy, Check, BookOpen, Globe, FileKey, Link2, HelpCircle } from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'https://helpofai.com';

const PROVIDERS = [
    {
        id: 'google',
        name: 'Google',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        docs: 'https://console.cloud.google.com/apis/credentials',
        docsLabel: 'Google Cloud Console',
        fields: [
            { key: 'google_client_id', label: 'Client ID' },
            { key: 'google_client_secret', label: 'Client Secret', type: 'password' },
        ],
        redirectHint: `${APP_URL}/auth/google/callback`,
        steps: [
            'Visit Google Cloud Console → APIs & Services → Credentials.',
            'Create a new OAuth 2.0 Client ID (type: Web application).',
            'Under "Authorized redirect URIs", paste the complete redirect link below.',
            'Copy the Client ID and Client Secret into the fields above.',
            'Enable the Google+ / People API if prompted for profile access.',
        ],
        note: 'Your Google account must have the OAuth consent screen configured (External or Internal testing) before users can log in.',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        docs: 'https://developers.facebook.com/apps/',
        docsLabel: 'Facebook Developers Portal',
        fields: [
            { key: 'facebook_client_id', label: 'App ID' },
            { key: 'facebook_client_secret', label: 'App Secret', type: 'password' },
        ],
        redirectHint: `${APP_URL}/auth/facebook/callback`,
        steps: [
            'Visit Facebook Developers → My Apps → Create App.',
            'Add the "Facebook Login" product to your app.',
            'Under OAuth settings, set "Valid OAuth Redirect URIs" to the link below.',
            'Copy the App ID and App Secret into the fields above.',
            'The app must be in "Live" mode for public users to authenticate.',
        ],
        note: 'Facebook requires HTTPS. The redirect URI must match exactly with no trailing slash.',
    },
    {
        id: 'github',
        name: 'GitHub',
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        docs: 'https://github.com/settings/developers',
        docsLabel: 'GitHub Developer Settings',
        fields: [
            { key: 'github_client_id', label: 'Client ID' },
            { key: 'github_client_secret', label: 'Client Secret', type: 'password' },
        ],
        redirectHint: `${APP_URL}/auth/github/callback`,
        steps: [
            'Visit GitHub → Settings → Developer Settings → OAuth Apps.',
            'Click "New OAuth App", fill in name and homepage URL.',
            'In "Authorization callback URL", paste the complete redirect link below.',
            'Copy the Client ID and generate a Client Secret.',
            'Optionally request user:email scope to verify email addresses.',
        ],
        note: 'GitHub emails are private by default — users must allow email access for registration to work.',
    },
];

export default function AuthSettings({ settings }) {
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

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-500">
                            <KeyRound size={24} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Authentication_Protocol</h2>
                            <p className="text-[10px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Advanced OAuth Settings & Security</p>
                        </div>
                    </div>
                }
            >
                <Head title="Auth Settings" />
                <div className="relative min-h-full p-8 lg:p-12">
                    <AnimatedGrid />

                    <div className="max-w-6xl mx-auto relative z-10 space-y-8">
                        {/* Global Notice */}
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6">
                            <div className="flex gap-4">
                                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                <div className="space-y-3 flex-1">
                                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Before You Begin</h4>
                                    <p className="text-[10px] text-amber-500/80 leading-relaxed uppercase tracking-wider font-medium">
                                        Every provider requires you to create an OAuth application on their developer console. 
                                        Use the complete redirect URI (including <span className="text-white">{APP_URL}</span>) exactly as shown below.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            {PROVIDERS.map((provider) => (
                                <div key={provider.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-[var(--text-muted)] transition-all">
                                    {/* Provider Header */}
                                    <div className="flex items-center justify-between flex-wrap gap-4 p-8 pb-6 border-b border-[var(--border)] bg-gradient-to-r from-transparent via-[var(--bg-elevated)]/50 to-transparent">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 ${provider.bg} ${provider.border} rounded-2xl ${provider.color}`}>
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tighter">{provider.name} Integration</h3>
                                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Configure {provider.name} OAuth credentials</p>
                                            </div>
                                        </div>

                                        <label className="flex flex-col items-center gap-2 cursor-pointer bg-[var(--bg-elevated)] px-6 py-4 rounded-2xl border border-[var(--border)]">
                                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase">Provider Status</span>
                                            <input
                                                type="checkbox"
                                                checked={data[`${provider.id}_enabled`]}
                                                onChange={e => setData(`${provider.id}_enabled`, e.target.checked)}
                                                className="toggle toggle-primary"
                                            />
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${data[`${provider.id}_enabled`] ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                                                {data[`${provider.id}_enabled`] ? '● Active' : '○ Standby'}
                                            </span>
                                        </label>
                                    </div>

                                    {/* Credentials Form */}
                                    <div className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {provider.fields.map((field) => (
                                                <div key={field.key} className="space-y-3">
                                                    <InputLabel value={field.label} className="font-bold text-[10px] uppercase tracking-widest" />
                                                    <TextInput
                                                        type={field.type || 'text'}
                                                        value={data[field.key]}
                                                        onChange={e => setData(field.key, e.target.value)}
                                                        className="bg-[var(--bg-main)] border-[var(--border)] rounded-xl py-3"
                                                        placeholder={provider.id === 'facebook' ? '1234567890123456' : 'Paste credentials here'}
                                                    />
                                                    {errors[field.key] && <p className="text-rose-500 text-[10px] font-bold">{errors[field.key]}</p>}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Redirect URI — Complete Link */}
                                        <div className="mt-8 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Link2 size={12} className="text-cyan-500" />
                                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Redirect URI (Callback URL)</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-black/30 border border-cyan-500/20 rounded-xl p-3">
                                                <code className="flex-1 text-[10px] font-mono text-cyan-500 break-all">{provider.redirectHint}</code>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(provider.redirectHint, provider.id)}
                                                    className={`p-2 rounded-lg border transition-all shrink-0 ${copied === provider.id ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/40'}`}
                                                    title="Copy redirect URI"
                                                >
                                                    {copied === provider.id ? <Check size={14} /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                            <p className="text-[9px] text-[var(--text-muted)] leading-relaxed">
                                                Paste this exact URL into the provider's <span className="text-cyan-500">Authorized Redirect URIs</span> / <span className="text-cyan-500">Callback URL</span> field.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Documentation Section */}
                                    <div className="border-t border-[var(--border)] p-8 bg-[var(--bg-elevated)]/30">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-500">
                                                    <BookOpen size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Setup Documentation</h4>
                                                    <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Step-by-step guide for {provider.name}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={provider.docs}
                                                target="_blank"
                                                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-500 hover:bg-purple-500 hover:text-white transition-all rounded-xl text-[9px] font-black uppercase tracking-widest"
                                            >
                                                <ExternalLink size={12} /> Open {provider.docsLabel}
                                            </a>
                                        </div>

                                        <ol className="space-y-3">
                                            {provider.steps.map((step, i) => (
                                                <li key={i} className="flex gap-4 items-start p-4 bg-black/30 border border-white/5 rounded-xl hover:border-purple-500/20 transition-all">
                                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0 ${provider.bg} ${provider.color}`}>
                                                        {String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed pt-1">{step}</p>
                                                </li>
                                            ))}
                                        </ol>

                                        {/* Provider Note */}
                                        <div className="mt-6 flex gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                                            <HelpCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-[9px] text-amber-500/80 leading-relaxed">{provider.note}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Save Bar */}
                            <div className="sticky bottom-4 flex justify-end pt-4">
                                <PrimaryButton className="bg-purple-500 hover:bg-purple-600 px-12 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-purple-500/20" disabled={processing}>
                                    <Save size={18} className="mr-2" /> Commit Authentication Settings
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Footer Documentation */}
                        <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <Globe size={200} />
                            </div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-500">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">OAuth_Checklist</h3>
                                    <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1">Verify before launching</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: FileKey, title: 'Redirect URIs', desc: 'All three callback URLs registered in each provider console with exact match.' },
                                    { icon: Globe, title: 'HTTPS Required', desc: 'Facebook & Google reject non-HTTPS origins. GitHub works on HTTP for localhost only.' },
                                    { icon: ShieldCheck, title: 'Secret Storage', desc: 'Credentials are stored encrypted in the site_settings table. Keep your database secure.' },
                                ].map((item, i) => (
                                    <div key={i} className="p-6 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] hover:border-cyan-500/30 transition-all">
                                        <item.icon size={20} className="text-cyan-500 mb-4" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">{item.title}</h4>
                                        <p className="text-[9px] text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}