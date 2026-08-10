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
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, Shield, Crown, Eye, X, BookOpen } from 'lucide-react';
import { useToast } from '@/Components/Toast/ToastProvider';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EmailSend({ templates, userCounts }) {
    const { props } = usePage();
    const toast = useToast();
    
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        template_id: '',
        recipient_type: 'all',
        specific_email: '',
    });

    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);

    const submit = (e) => {
        if (!confirm(`Are you sure you want to send this email to ${data.recipient_type.toUpperCase()} recipients?`)) return;
        e.preventDefault();
        post(route('admin.email.send.process'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
                        <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500">
                            <Send size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Broadcast_Console</h2>
                            <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Global Messaging</p>
                        </div>
                    </div>
                }
            >
                <Head title="Send Email" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Stats Panel */}
                        <div className="space-y-6">
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-6 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Target_Audience</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
                                        <div className="flex items-center gap-3">
                                            <Users size={16} className="text-[var(--text-muted)]" />
                                            <span className="text-sm font-bold">All Users</span>
                                        </div>
                                        <span className="text-lg font-black">{userCounts.all}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 text-amber-500">
                                        <div className="flex items-center gap-3">
                                            <Crown size={16} />
                                            <span className="text-sm font-bold">Pro Users</span>
                                        </div>
                                        <span className="text-lg font-black">{userCounts.pro}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-purple-500/5 rounded-xl border border-purple-500/20 text-purple-500">
                                        <div className="flex items-center gap-3">
                                            <Shield size={16} />
                                            <span className="text-sm font-bold">Admins</span>
                                        </div>
                                        <span className="text-lg font-black">{userCounts.admins}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20 text-cyan-500">
                                        <div className="flex items-center gap-3">
                                            <BookOpen size={16} />
                                            <span className="text-sm font-bold">Newsletter</span>
                                        </div>
                                        <span className="text-lg font-black">{userCounts.newsletter}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Send Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={submit} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-8">
                                <div className="space-y-4">
                                    <InputLabel value="Select Protocol (Template)" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {templates.map(t => (
                                            <div 
                                                key={t.id} 
                                                className={`relative p-4 rounded-xl border transition-all ${data.template_id === t.id ? 'bg-purple-500 text-white border-purple-500 shadow-lg' : 'bg-[var(--bg-elevated)] border-[var(--border)] hover:border-purple-500/50'}`}
                                            >
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); setPreviewTemplate(t); }}
                                                        className={`p-1.5 rounded-md hover:scale-110 transition-transform ${data.template_id === t.id ? 'bg-white/20 text-white' : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-purple-500'}`}
                                                        title="Preview Template"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                </div>
                                                <div 
                                                    onClick={() => setData('template_id', t.id)}
                                                    className="cursor-pointer pr-10"
                                                >
                                                    <div className="font-bold text-sm mb-1">{t.name}</div>
                                                    <div className={`text-xs truncate ${data.template_id === t.id ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>{t.subject}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.template_id && <p className="text-rose-500 text-xs">Please select a template.</p>}
                                </div>

                                <div className="space-y-4">
                                    <InputLabel value="Target Sector (Recipients)" />
                                    <select 
                                        value={data.recipient_type}
                                        onChange={e => setData('recipient_type', e.target.value)}
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-sm focus:border-purple-500 outline-none text-[var(--text-main)]"
                                    >
                                        <option value="all">All Users (Broadcast)</option>
                                        <option value="pro">Pro Users (Premium)</option>
                                        <option value="admins">Administrators (Command)</option>
                                        <option value="newsletter">Newsletter Subscribers (Marketing)</option>
                                        <option value="specific">Specific User (Direct)</option>
                                    </select>
                                </div>

                                {data.recipient_type === 'specific' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                                        <InputLabel value="Target Email" />
                                        <TextInput 
                                            type="email" 
                                            value={data.specific_email} 
                                            onChange={e => setData('specific_email', e.target.value)} 
                                            className="bg-[var(--bg-elevated)]" 
                                            placeholder="user@example.com"
                                        />
                                        {errors.specific_email && <p className="text-rose-500 text-xs">{errors.specific_email}</p>}
                                    </div>
                                )}

                                <div className="pt-6 border-t border-[var(--border)] flex justify-end">
                                    <PrimaryButton className="bg-purple-500 hover:bg-purple-600 border-purple-500 px-8 py-4 text-xs font-black uppercase tracking-widest" disabled={processing}>
                                        <Send size={16} className="mr-2" /> Initialize_Broadcast
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Preview Modal */}
                {previewTemplate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                                <div>
                                    <h3 className="font-black text-lg">{previewTemplate.name}</h3>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">Subject: <span className="font-semibold text-[var(--text-main)]">{previewTemplate.subject}</span></p>
                                </div>
                                <button onClick={() => setPreviewTemplate(null)} className="p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto bg-white text-black dark:bg-[#1a1a1a] dark:text-gray-200" dangerouslySetInnerHTML={{ __html: previewTemplate.content }}>
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </div>
    );
}
