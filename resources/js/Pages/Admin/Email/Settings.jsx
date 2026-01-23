import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EmailSettings({ settings }) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        mail_mailer: settings?.mail_mailer || 'smtp',
        mail_host: settings?.mail_host || '',
        mail_port: settings?.mail_port || '587',
        mail_username: settings?.mail_username || '',
        mail_password: settings?.mail_password || '',
        mail_encryption: settings?.mail_encryption || 'tls',
        mail_from_address: settings?.mail_from_address || '',
        mail_from_name: settings?.mail_from_name || 'HOACodeLab',
    });

    const { data: testData, setData: setTestData, post: postTest, processing: testProcessing, errors: testErrors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.email.settings.update'));
    };

    const runTest = (e) => {
        e.preventDefault();
        postTest(route('admin.email.test'));
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500">
                            <SettingsIcon size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">SMTP_Config</h2>
                            <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Mail Server Protocols</p>
                        </div>
                    </div>
                }
            >
                <Head title="SMTP Settings" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-2">
                            <form onSubmit={submit} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <InputLabel value="Mailer" />
                                        <TextInput value={data.mail_mailer} onChange={e => setData('mail_mailer', e.target.value)} className="bg-[var(--bg-elevated)]" />
                                        {errors.mail_mailer && <p className="text-rose-500 text-xs">{errors.mail_mailer}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Host" />
                                        <TextInput value={data.mail_host} onChange={e => setData('mail_host', e.target.value)} className="bg-[var(--bg-elevated)]" placeholder="smtp.mailgun.org" />
                                        {errors.mail_host && <p className="text-rose-500 text-xs">{errors.mail_host}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Port" />
                                        <TextInput value={data.mail_port} onChange={e => setData('mail_port', e.target.value)} className="bg-[var(--bg-elevated)]" placeholder="587" />
                                        {errors.mail_port && <p className="text-rose-500 text-xs">{errors.mail_port}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Encryption" />
                                        <TextInput value={data.mail_encryption} onChange={e => setData('mail_encryption', e.target.value)} className="bg-[var(--bg-elevated)]" placeholder="tls" />
                                        {errors.mail_encryption && <p className="text-rose-500 text-xs">{errors.mail_encryption}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Username" />
                                        <TextInput value={data.mail_username} onChange={e => setData('mail_username', e.target.value)} className="bg-[var(--bg-elevated)]" />
                                        {errors.mail_username && <p className="text-rose-500 text-xs">{errors.mail_username}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Password" />
                                        <TextInput type="password" value={data.mail_password} onChange={e => setData('mail_password', e.target.value)} className="bg-[var(--bg-elevated)]" />
                                        {errors.mail_password && <p className="text-rose-500 text-xs">{errors.mail_password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="From Address" />
                                        <TextInput value={data.mail_from_address} onChange={e => setData('mail_from_address', e.target.value)} className="bg-[var(--bg-elevated)]" />
                                        {errors.mail_from_address && <p className="text-rose-500 text-xs">{errors.mail_from_address}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="From Name" />
                                        <TextInput value={data.mail_from_name} onChange={e => setData('mail_from_name', e.target.value)} className="bg-[var(--bg-elevated)]" />
                                        {errors.mail_from_name && <p className="text-rose-500 text-xs">{errors.mail_from_name}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-[var(--border)]">
                                    <PrimaryButton className="bg-purple-500 hover:bg-purple-600 border-purple-500 px-8 py-3" disabled={processing}>
                                        <Save size={16} className="mr-2" /> Save_Configuration
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-6 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                    <Activity size={14} /> Connection_Diagnostics
                                </h3>
                                <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-xs space-y-2">
                                    <p className="text-[var(--text-muted)]">Test your configuration by sending a ping packet to an external address.</p>
                                </div>
                                <form onSubmit={runTest} className="space-y-4">
                                    <div className="space-y-2">
                                        <InputLabel value="Test Email Address" />
                                        <TextInput 
                                            type="email" 
                                            value={testData.email} 
                                            onChange={e => setTestData('email', e.target.value)} 
                                            className="bg-[var(--bg-elevated)]" 
                                            placeholder="you@example.com"
                                        />
                                        {testErrors.email && <p className="text-rose-500 text-xs">{testErrors.email}</p>}
                                    </div>
                                    <button 
                                        disabled={testProcessing}
                                        className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck size={14} /> Verify_Uplink
                                    </button>
                                </form>
                            </div>

                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6">
                                <div className="flex gap-3">
                                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Security Warning</h4>
                                        <p className="text-[10px] text-amber-500/80 leading-relaxed">
                                            SMTP credentials are stored in the database. Ensure your database connection is secure (SSL) and your .env file is protected.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
