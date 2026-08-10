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
import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, Users, Database, Activity, 
    Cpu, Terminal, Code2, TrendingUp, DollarSign, AlertCircle, ArrowRight
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const { auth } = usePage().props;
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats');
                setStats(res.data);
            } catch (e) {
                console.error("Diagnostic failure:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <div className="flex flex-col items-center justify-center py-64 space-y-6">
                    <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-rose-500 uppercase tracking-[0.5em] animate-pulse">Initializing_Admin_Core...</span>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!stats) {
        return (
            <AuthenticatedLayout>
                <div className="flex flex-col items-center justify-center py-64 space-y-6">
                    <div className="text-rose-500 font-bold">Failed to load system diagnostics.</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
                        <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center w-full relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-rose-500/10 border border-rose-400/30 rounded-lg">
                                <ShieldCheck className="text-rose-500" size={20} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">Admin_Command</h2>
                                <p className="text-[8px] text-rose-500 font-bold uppercase tracking-[0.4em] mt-1">Level 0 Security Clearance Active</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">System_Optimal</span>
                        </div>
                    </div>
                }
            >
                <Head title="Admin Dashboard" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-7xl mx-auto relative z-10 space-y-10">
                        
                        {/* Pending Verifications Alert */}
                        {stats.users.pending_verifications > 0 && (
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex items-center justify-between shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={100} /></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl">
                                        <AlertCircle size={24} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">Identity Verifications Pending</h3>
                                        <p className="text-xs font-bold text-[var(--text-muted)] mt-1">{stats.users.pending_verifications} user(s) have submitted identity documents requiring admin approval.</p>
                                    </div>
                                </div>
                                <Link href={route('admin.users')} className="relative z-10 flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-all shadow-lg">
                                    Review Documents <ArrowRight size={14} />
                                </Link>
                            </motion.div>
                        )}

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'TOTAL_USERS', val: stats.users.total, icon: Users, color: 'text-cyan-500' },
                                { label: 'TOTAL_CORES', val: stats.projects.total, icon: Code2, color: 'text-purple-500' },
                                { label: 'ESTIMATED_MRR', val: `$${stats.revenue.monthly}`, icon: DollarSign, color: 'text-emerald-500' },
                                { label: 'SYSTEM_UPTIME', val: stats.system.uptime, icon: Activity, color: 'text-rose-500' }
                            ].map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    className="bg-[var(--bg-surface)] border border-[var(--border)] p-8 rounded-2xl shadow-xl text-left"
                                >
                                    <s.icon className={`${s.color} mb-4 opacity-80`} size={24} />
                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-1">{s.label}</div>
                                    <div className="text-3xl font-black text-[var(--text-main)] tracking-tighter italic">{s.val}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Revenue & Balance Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                            <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] p-10 rounded-[2rem] shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={120} /></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-10 flex items-center">
                                    <TrendingUp size={16} className="mr-3 text-emerald-500" /> Revenue_Growth_Matrix
                                </h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.revenue.chart}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                                                dy={10}
                                            />
                                            <YAxis hide />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                                itemStyle={{ color: '#10b981', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }}
                                                labelStyle={{ color: '#64748b', fontSize: '8px', marginBottom: '4px' }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="revenue" 
                                                stroke="#10b981" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorRev)" 
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="lg:col-span-1 bg-[var(--bg-surface)] border border-[var(--border)] p-10 rounded-[2rem] shadow-xl">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-10 flex items-center">
                                    <Cpu size={16} className="mr-3 text-rose-500" /> User Roles Overview
                                </h3>
                                <div className="space-y-8">
                                    {Object.entries(stats.users.roles).map(([role, count]) => (
                                        <div key={role}>
                                            <div className="flex justify-between mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{role}</span>
                                                <span className="text-sm font-black text-[var(--text-main)]">{count}</span>
                                            </div>
                                            <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.users.total) * 100}%` }}
                                                    className={`h-full ${role === 'admin' ? 'bg-rose-500' : 'bg-cyan-500'}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Users Row */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-10 rounded-[2rem] shadow-xl">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-10 flex items-center">
                                <Users size={16} className="mr-3 text-cyan-500" /> Recent Users
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="text-left border-b border-[var(--border)]">
                                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Ident</th>
                                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Arrival</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {stats.users.latest.map(u => (
                                            <tr key={u.id} className="group"><td className="py-4">
                                                <div className="flex flex-col"><span className="text-sm font-bold text-[var(--text-main)] group-hover:text-cyan-500 transition-colors">{u.name}</span><span className="text-[9px] text-[var(--text-muted)]">{u.email}</span></div>
                                            </td><td className="py-4 text-right">
                                                <span className="text-[10px] font-mono text-[var(--text-muted)]">{new Date(u.created_at).toLocaleDateString()}</span>
                                            </td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
