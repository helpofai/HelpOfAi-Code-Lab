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

                    {/* Mail Setup Documentation Section */}
                    <div className="max-w-6xl mx-auto mt-20 relative z-10">
                        <div className="p-10 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <SettingsIcon size={200} />
                            </div>
                            
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-500">
                                    <Activity size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Mail_Setup_Protocol</h3>
                                    <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1">Beginner Integration Guide</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                                <div className="space-y-8">
                                    <section className="space-y-4">
                                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Phase 01: SMTP Acquisition
                                        </h4>
                                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed uppercase tracking-widest font-medium">
                                            To enable mail transmission, you need credentials from a service provider. 
                                            Recommended modules for beginners:
                                        </p>
                                        <ul className="space-y-3 pt-2">
                                            {[
                                                { name: 'Mailtrap', desc: 'Safe testing environment. Won\'t send real emails to users.' },
                                                { name: 'Brevo (Sendinblue)', desc: 'Free tier for real transmissions. 300 emails/day.' },
                                                { name: 'Gmail SMTP', desc: 'Requires "App Passwords" to be enabled in Google Security.' }
                                            ].map((item, i) => (
                                                <li key={i} className="flex gap-4 p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] group hover:border-purple-500/30 transition-all">
                                                    <span className="text-purple-500 font-black text-xs">0{i+1}</span>
                                                    <div>
                                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item.name}</p>
                                                        <p className="text-[9px] text-[var(--text-muted)] leading-normal">{item.desc}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section className="space-y-4">
                                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Phase 02: Kernel Configuration
                                        </h4>
                                        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4 font-mono text-[10px] text-slate-400">
                                            <p><span className="text-cyan-500"># STEP 1:</span> Copy your host (e.g. live.smtp.mailtrap.io)</p>
                                            <p><span className="text-cyan-500"># STEP 2:</span> Set Port to <span className="text-white">587</span> (TLS) or <span className="text-white">465</span> (SSL)</p>
                                            <p><span className="text-cyan-500"># STEP 3:</span> Inject Username & Password accurately</p>
                                            <p><span className="text-cyan-500"># STEP 4:</span> Match 'From Address' with your provider settings</p>
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-8">
                                    <section className="space-y-4 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                                        <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <ShieldCheck size={16} /> Verification Protocol
                                        </h4>
                                        <p className="text-[10px] text-emerald-500/70 leading-relaxed font-bold uppercase tracking-widest italic">
                                            Once settings are saved, use the <span className="text-white underline">Connection Diagnostics</span> panel to send a test signal. 
                                            If you receive the transmission, the uplink is successful.
                                        </p>
                                    </section>

                                    <section className="space-y-4">
                                        <h4 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <AlertCircle size={16} /> Diagnostic Troubleshooting
                                        </h4>
                                        <div className="space-y-4">
                                            {[
                                                { q: 'Authentication Failed?', a: 'Verify password. If using Gmail, ensure 2FA and App Password are active.' },
                                                { q: 'Connection Timeout?', a: 'Check Port. Try 587 with TLS or 465 with SSL. Ports 25 is often blocked.' },
                                                { q: 'Emails going to Spam?', a: 'Verify your domain\'s SPF, DKIM, and DMARC records at your provider.' }
                                            ].map((item, i) => (
                                                <div key={i} className="space-y-1">
                                                    <p className="text-[9px] font-black text-white uppercase tracking-widest">{item.q}</p>
                                                    <p className="text-[9px] text-[var(--text-muted)] italic">{item.a}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="pt-8 border-t border-[var(--border)]">
                                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] italic text-center">
                                            System_Uplink // CodePen_Advanced_Core
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
