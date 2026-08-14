import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Shield, ShieldAlert, ShieldCheck, Save, Trash2, Ban, Activity, Lock, Plus, MousePointer2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecurityIndex({ auth, settings, bannedIps }) {
    const { data, setData, post: postSettings, processing, recentlySuccessful } = useForm({
        firewall_enabled: settings.firewall_enabled !== '0' && settings.firewall_enabled !== false,
        firewall_max_attempts: settings.firewall_max_attempts || 150,
        firewall_penalty_hours: settings.firewall_penalty_hours || 24,
    });

    const [banningIp, setBanningIp] = useState('');
    const [banReason, setBanReason] = useState('');
    const [isBanning, setIsBanning] = useState(false);

    const submitSettings = (e) => {
        e.preventDefault();
        postSettings(route('admin.security.update'), {
            preserveScroll: true
        });
    };

    const handleManualBan = (e) => {
        e.preventDefault();
        if (!banningIp) return;
        setIsBanning(true);
        router.post(route('admin.security.ban'), {
            ip_address: banningIp,
            reason: banReason || 'Manually banned by Administrator'
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setBanningIp('');
                setBanReason('');
                setIsBanning(false);
            },
            onError: () => setIsBanning(false)
        });
    };

    const unbanIp = (id) => {
        if (confirm('Are you sure you want to unban this IP address?')) {
            router.delete(route('admin.security.unban', id), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-tr from-red-600 to-orange-500 rounded-xl shadow-lg shadow-red-500/20">
                        <Shield size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-black text-2xl text-[var(--text-primary)] leading-tight tracking-tight">Security & Firewall</h2>
                        <p className="text-sm text-[var(--text-muted)] font-medium">Application-layer threat protection and IP banning matrix.</p>
                    </div>
                </div>
            }
        >
            <Head title="Security Settings" />

            <div className="py-12 relative">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10 relative z-10">
                    
                    {/* SETTINGS CARD */}
                    <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] shadow-2xl sm:rounded-[2rem] overflow-hidden">
                        <form onSubmit={submitSettings}>
                            <div className="p-8 sm:p-10 border-b border-[var(--border)]">
                                <div className="flex items-center gap-3 mb-8">
                                    <Lock className="text-blue-500" size={24} />
                                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Advanced Firewall Configuration</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <label className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] cursor-pointer hover:border-blue-500/50 transition-colors">
                                            <div className="relative flex items-center h-5 mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={data.firewall_enabled}
                                                    onChange={e => setData('firewall_enabled', e.target.checked)}
                                                    className="w-5 h-5 rounded border-[var(--border)] bg-[var(--bg-surface)] text-blue-600 focus:ring-blue-500/30"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-[var(--text-primary)]">Enable Dynamic Rate Limiting</span>
                                                    {data.firewall_enabled ? (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500">ACTIVE</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500">DISABLED</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                                    Automatically track IP requests. If a threshold is breached, the IP is placed in a 24-hour lockdown. Highly recommended for DDoS/Bot protection.
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className={`transition-opacity ${!data.firewall_enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Max Requests Per Minute</label>
                                            <input
                                                type="number"
                                                value={data.firewall_max_attempts}
                                                onChange={e => setData('firewall_max_attempts', e.target.value)}
                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                                            />
                                            <p className="text-[11px] text-[var(--text-muted)] mt-2">The absolute maximum requests an IP can make in 60 seconds before auto-ban. Default: 150.</p>
                                        </div>

                                        <div className={`transition-opacity ${!data.firewall_enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Penalty Duration (Hours)</label>
                                            <input
                                                type="number"
                                                value={data.firewall_penalty_hours}
                                                onChange={e => setData('firewall_penalty_hours', e.target.value)}
                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                                            />
                                            <p className="text-[11px] text-[var(--text-muted)] mt-2">How long an IP remains completely blocked after breaching the threshold. Default: 24.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[var(--bg-elevated)] p-6 sm:px-10 flex items-center justify-between">
                                <div className="text-sm text-[var(--text-muted)]">
                                    Changes to firewall parameters apply globally to all inbound connections immediately.
                                </div>
                                <div className="flex items-center gap-4">
                                    {recentlySuccessful && (
                                        <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-bold text-green-500">
                                            Security parameters updated.
                                        </motion.p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Save size={18} /> {processing ? 'Enforcing...' : 'Enforce Policy'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                        {/* Bot Prevention Stats */}
                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] shadow-2xl rounded-3xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <MousePointer2 className="text-cyan-500" size={20} />
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Bot Prevention (Honeypot)</h3>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">
                                Automated bots attempting to access the registration/login forms via hidden fields are automatically logged and blocked.
                            </p>
                            <div className="mt-6 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] text-center">
                                <span className="text-3xl font-black text-cyan-500">0</span>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">Blocked Attempts</p>
                            </div>
                        </div>

                        {/* Brute-Force Protection Stats */}
                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] shadow-2xl rounded-3xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Zap className="text-yellow-500" size={20} />
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Brute-Force Protection</h3>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">
                                Repeated failed login attempts trigger rate limiting to prevent credential stuffing attacks.
                            </p>
                            <div className="mt-6 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] text-center">
                                <span className="text-3xl font-black text-yellow-500">0</span>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">Locked Out IPs</p>
                            </div>
                        </div>
                    </div>

                    {/* MANUAL BAN & TABLE */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Manual Ban Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] shadow-2xl rounded-3xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <ShieldAlert className="text-red-500" size={20} />
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Manual IP Ban</h3>
                                </div>
                                <form onSubmit={handleManualBan} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wider">Target IP Address</label>
                                        <input
                                            type="text"
                                            required
                                            value={banningIp}
                                            onChange={e => setBanningIp(e.target.value)}
                                            placeholder="e.g. 192.168.1.1"
                                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wider">Reason (Optional)</label>
                                        <input
                                            type="text"
                                            value={banReason}
                                            onChange={e => setBanReason(e.target.value)}
                                            placeholder="Malicious scanning..."
                                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isBanning || !banningIp}
                                        className="w-full mt-2 px-4 py-2.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Ban size={16} /> Ban IP Address
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Banned IPs Table */}
                        <div className="lg:col-span-2">
                            <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] shadow-2xl rounded-3xl overflow-hidden h-full flex flex-col">
                                <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
                                    <Ban className="text-orange-500" size={20} />
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Active IP Restrictions Matrix</h3>
                                </div>
                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] uppercase tracking-wider text-[10px] font-black">
                                            <tr>
                                                <th className="px-6 py-3">IP Address</th>
                                                <th className="px-6 py-3">Ban Reason</th>
                                                <th className="px-6 py-3">Expires At</th>
                                                <th className="px-6 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border)]">
                                            {bannedIps.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-[var(--text-muted)]">
                                                        <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
                                                        <p className="font-semibold text-lg">No Active Bans</p>
                                                        <p className="text-sm mt-1">The network is currently clear.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                bannedIps.data.map((ip) => (
                                                    <tr key={ip.id} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                                                        <td className="px-6 py-4 font-mono font-bold text-red-500">
                                                            {ip.ip_address}
                                                        </td>
                                                        <td className="px-6 py-4 text-[var(--text-muted)] truncate max-w-[200px]" title={ip.reason}>
                                                            {ip.reason}
                                                        </td>
                                                        <td className="px-6 py-4 text-[var(--text-muted)]">
                                                            {new Date(ip.expires_at) < new Date() ? (
                                                                <span className="text-green-500 font-bold text-xs">Expired</span>
                                                            ) : (
                                                                new Date(ip.expires_at).toLocaleString()
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => unbanIp(ip.id)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 text-xs font-bold transition-all"
                                                            >
                                                                <Trash2 size={14} /> Unban
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
