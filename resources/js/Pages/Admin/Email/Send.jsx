import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { Mail, Send, Users, Shield, Crown } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EmailSend({ templates, userCounts }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        template_id: '',
        recipient_type: 'all',
        specific_email: '',
    });

    const submit = (e) => {
        if (!confirm(`Are you sure you want to send this email to ${data.recipient_type.toUpperCase()} recipients?`)) return;
        e.preventDefault();
        post(route('admin.email.send.process'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
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
                                                onClick={() => setData('template_id', t.id)}
                                                className={`cursor-pointer p-4 rounded-xl border transition-all ${data.template_id === t.id ? 'bg-purple-500 text-white border-purple-500 shadow-lg' : 'bg-[var(--bg-elevated)] border-[var(--border)] hover:border-purple-500/50'}`}
                                            >
                                                <div className="font-bold text-sm mb-1">{t.name}</div>
                                                <div className={`text-xs truncate ${data.template_id === t.id ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>{t.subject}</div>
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
            </AuthenticatedLayout>
        </div>
    );
}
