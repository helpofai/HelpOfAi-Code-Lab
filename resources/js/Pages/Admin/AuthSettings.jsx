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
import React from 'react';
import { KeyRound, Save, ShieldCheck, AlertCircle, ExternalLink, Settings as SettingsIcon, Activity } from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

const PROVIDERS = [
    {
        id: 'google',
        name: 'Google',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        docs: 'https://console.cloud.google.com/apis/credentials',
        fields: [
            { key: 'google_client_id', label: 'Client ID' },
            { key: 'google_client_secret', label: 'Client Secret', type: 'password' },
        ],
        redirectHint: '/auth/google/callback',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        docs: 'https://developers.facebook.com/apps/',
        fields: [
            { key: 'facebook_client_id', label: 'App ID' },
            { key: 'facebook_client_secret', label: 'App Secret', type: 'password' },
        ],
        redirectHint: '/auth/facebook/callback',
    },
    {
        id: 'github',
        name: 'GitHub',
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        docs: 'https://github.com/settings/developers',
        fields: [
            { key: 'github_client_id', label: 'Client ID' },
            { key: 'github_client_secret', label: 'Client Secret', type: 'password' },
        ],
        redirectHint: '/auth/github/callback',
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
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6">
                            <div className="flex gap-3">
                                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Protocol Setup</h4>
                                    <p className="text-[10px] text-amber-500/80 leading-relaxed">
                                        Configure callback URIs in provider dashboards using your app URL:
                                        <code className="block mt-2 p-2 bg-black/50 rounded text-[9px] font-mono">
                                            {typeof window !== 'undefined' ? window.location.origin : ''}/auth/[provider]/callback
                                        </code>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            {PROVIDERS.map((provider) => (
                                <div key={provider.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl relative group hover:border-[var(--text-muted)] transition-all">
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border)]">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 ${provider.bg} ${provider.border} rounded-2xl ${provider.color}`}>
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tighter">{provider.name} Integration</h3>
                                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Configure {provider.name} OAuth credentials</p>
                                            </div>
                                        </div>

                                        <label className="flex flex-col items-center gap-2 cursor-pointer bg-[var(--bg-elevated)] p-4 rounded-2xl border border-[var(--border)]">
                                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase">Status</span>
                                            <input
                                                type="checkbox"
                                                checked={data[`${provider.id}_enabled`]}
                                                onChange={e => setData(`${provider.id}_enabled`, e.target.checked)}
                                                className="toggle toggle-primary"
                                            />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {provider.fields.map((field) => (
                                            <div key={field.key} className="space-y-3">
                                                <InputLabel value={field.label} className="font-bold text-[10px] uppercase tracking-widest" />
                                                <TextInput
                                                    type={field.type || 'text'}
                                                    value={data[field.key]}
                                                    onChange={e => setData(field.key, e.target.value)}
                                                    className="bg-[var(--bg-main)] border-[var(--border)] rounded-xl py-3"
                                                />
                                                {errors[field.key] && <p className="text-rose-500 text-[10px] font-bold">{errors[field.key]}</p>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between text-[10px]">
                                        <div className="text-[var(--text-muted)] uppercase tracking-widest">
                                            Redirect URI: <code className="text-cyan-500 bg-black/20 p-1 px-2 rounded font-mono">{provider.redirectHint}</code>
                                        </div>
                                        <a href={provider.docs} target="_blank" className="flex items-center gap-2 text-purple-500 hover:text-white transition-colors font-bold uppercase tracking-widest">
                                            <ExternalLink size={14} /> Documentation
                                        </a>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end pt-8 border-t border-[var(--border)]">
                                <PrimaryButton className="bg-purple-500 hover:bg-purple-600 px-12 py-4 rounded-xl font-black uppercase tracking-widest text-xs" disabled={processing}>
                                    <Save size={18} className="mr-2" /> Commit Authentication Settings
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}

