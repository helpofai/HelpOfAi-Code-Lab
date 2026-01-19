import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, Users, Database, Activity, 
    Zap, Cpu, Globe, Terminal, Server, 
    AlertTriangle, TrendingUp, Search, User, Code2
} from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';

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
                    <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin shadow-[0_0_20px_rgba(244,63,94,0.2)]"></div>
                    <span className="text-xs font-black text-rose-500 uppercase tracking-[0.5em] animate-pulse">Initializing_Admin_Core...</span>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-rose-500/10 border border-rose-400/30 rounded-lg">
                            <ShieldCheck className="text-rose-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-tight italic">Admin_Command</h2>
                            <p className="text-[8px] text-rose-500/60 uppercase tracking-[0.4em] font-bold">Level 0 Security Clearance Active</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">System_Optimal</span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Admin Command Center" />
            
            <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                <AnimatedGrid />
                
                <div className="max-w-7xl mx-auto relative z-10 space-y-10">
                    
                    {/* TOP TIER STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'TOTAL_USERS', val: stats.users.total, icon: Users, color: 'text-cyan-400' },
                            { label: 'TOTAL_CORES', val: stats.projects.total, icon: Code2, color: 'text-purple-400' },
                            { label: 'FILES_SYNCED', val: stats.projects.file_sync, icon: Database, color: 'text-amber-400' },
                            { label: 'SYSTEM_UPTIME', val: stats.system.uptime, icon: Activity, color: 'text-green-400' }
                        ].map((s, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-black/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl"
                            >
                                <s.icon className={`${s.color} mb-4`} size={24} />
                                <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{s.label}</div>
                                <div className="text-3xl font-black text-white tracking-tighter">{s.val}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ROLE DISTRIBUTION */}
                        <div className="lg:col-span-1 bg-black/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem]">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60 mb-10 flex items-center">
                                <Cpu size={16} className="mr-3 text-rose-500" /> Neural_Role_Balance
                            </h3>
                            <div className="space-y-8">
                                {Object.entries(stats.users.roles).map(([role, count]) => (
                                    <div key={role}>
                                        <div className="flex justify-between mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{role}</span>
                                            <span className="text-sm font-black text-white">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / stats.users.total) * 100}%` }}
                                                className={`h-full ${role === 'admin' ? 'bg-rose-500' : 'bg-cyan-500'} shadow-[0_0_10px_currentColor]`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LATEST USERS */}
                        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem]">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60 mb-10 flex items-center">
                                <Users size={16} className="mr-3 text-cyan-500" /> Recent_Node_Arrivals
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-white/5">
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20">Ident</th>
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20">Clearance</th>
                                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-white/20 text-right">Arrival_Stamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {stats.users.latest.map(u => (
                                            <tr key={u.id} className="group">
                                                <td className="py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{u.name}</span>
                                                        <span className="text-[9px] text-white/20">{u.email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${u.role === 'admin' ? 'text-rose-400 border-rose-500/20' : 'text-cyan-400 border-cyan-500/20'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="text-[10px] font-mono text-white/40">{new Date(u.created_at).toLocaleDateString()}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* LATEST PROJECTS */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem]">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60 mb-10 flex items-center">
                            <Terminal size={16} className="mr-3 text-amber-500" /> Active_Module_Flux
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {stats.projects.latest.map(p => (
                                <div key={p.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-2 bg-amber-500/10 rounded-lg">
                                            <Code2 className="text-amber-400" size={16} />
                                        </div>
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest truncate">{p.user.name}</span>
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase truncate mb-2">{p.title}</h4>
                                    <div className="text-[8px] font-bold text-amber-500/40 uppercase tracking-widest">{p.slug.slice(0, 15)}...</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
