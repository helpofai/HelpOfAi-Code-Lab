import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Code2, ExternalLink, Trash2, Clock, Globe, 
    ShieldCheck, Zap, Activity, ShieldAlert, Cpu, 
    Terminal, Lock, Unlock, Sparkles, UserCheck, Database,
    LayoutGrid, List, ArrowRight, Folder, Tag, Briefcase
} from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import SystemBoot from '@/Components/Visuals/SystemBoot';

export default function Dashboard() {
    const { auth } = usePage().props;
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBooted, setIsBooted] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Destroy this neural module? This action is irreversible.')) return;
        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
            case 'paid-user': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
            case 'member': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
            default: return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
        }
    };

    // Calculate some quick stats
    const stats = {
        total: projects.length,
        public: projects.filter(p => p.is_public).length,
        private: projects.filter(p => !p.is_public).length,
        categories: [...new Set(projects.map(p => p.category).filter(Boolean))].length
    };

    const recentProjects = projects.slice(0, 3);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-mono selection:bg-cyan-500/30 relative overflow-hidden">
            <AnimatePresence>
                {!isBooted && <SystemBoot onComplete={() => setIsBooted(true)} />}
            </AnimatePresence>

            {isBooted && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 1 }}
                    className="h-full flex flex-col"
                >
                    <AnimatedGrid />
                    
                    <AuthenticatedLayout
                        header={
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 md:gap-0">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                                        <Activity className="text-cyan-400" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-tight italic">Command_Center</h2>
                                        <p className="text-[8px] text-cyan-500/60 uppercase tracking-[0.4em] font-bold">Session established // Sector 7G</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getRoleColor(auth.user.role)} shadow-sm`}>
                                        {auth.user.role}_ACCESS
                                    </div>
                                    <Link
                                        href={route('editor')}
                                        className="flex items-center px-6 py-2 bg-cyan-500 text-black rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95"
                                    >
                                        <Plus className="mr-2" size={14} strokeWidth={3} /> New_Core
                                    </Link>
                                </div>
                            </div>
                        }
                    >
                        <Head title="Dashboard" />
                        
                        <div className="relative flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
                            <div className="max-w-7xl mx-auto relative z-10 space-y-8 md:space-y-12">
                                
                                {/* WELCOME STRIP */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                    <div className="space-y-2">
                                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                                            Welcome, <span className="text-cyan-400">{auth.user.name.split(' ')[0]}</span>_
                                        </h1>
                                        <p className="text-slate-500 text-xs md:text-sm uppercase tracking-[0.2em] max-w-md leading-relaxed">
                                            Your neural uplink is stable. All systems operational. Monitoring {projects.length} active data cores.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 text-nowrap">Core_Sync: OK</span>
                                        </div>
                                    </div>
                                </div>

                                {/* STATS GRID */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                    {[
                                        { label: 'Total_Cores', val: stats.total, icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/5' },
                                        { label: 'Public_Nodes', val: stats.public, icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
                                        { label: 'Private_Vaults', val: stats.private, icon: Lock, color: 'text-rose-400', bg: 'bg-rose-500/5' },
                                        { label: 'Data_Sectors', val: stats.categories, icon: Folder, color: 'text-amber-400', bg: 'bg-amber-500/5' }
                                    ].map((s, i) => (
                                        <div key={i} className={`group ${s.bg} backdrop-blur-xl border border-white/5 p-6 rounded-3xl hover:border-white/20 transition-all duration-500`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <s.icon className={`${s.color} group-hover:scale-110 transition-transform`} size={24} />
                                                <div className="w-8 h-1 bg-white/5 rounded-full" />
                                            </div>
                                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{s.label}</div>
                                            <div className="text-2xl md:text-3xl font-black text-white tracking-tighter">{s.val}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* MAIN DASHBOARD CONTENT */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    
                                    {/* RECENT ACTIVITY */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center space-x-3">
                                                <Terminal size={18} className="text-cyan-500" />
                                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Recent_Syntheses</h3>
                                            </div>
                                            <Link href={route('my-projects')} className="text-[10px] font-black text-cyan-500 hover:text-white uppercase tracking-widest flex items-center group transition-colors">
                                                Access_Archives <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>

                                        <div className="space-y-4">
                                            {isLoading ? (
                                                <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
                                                    <Loader2 className="animate-spin text-cyan-500/20" size={32} />
                                                </div>
                                            ) : recentProjects.length === 0 ? (
                                                <div className="py-20 flex flex-col items-center justify-center space-y-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] text-center px-6">
                                                    <Sparkles className="text-white/5" size={48} />
                                                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">No data blocks detected in recent memory.</p>
                                                    <Link href={route('editor')} className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Initialize_Uplink</Link>
                                                </div>
                                            ) : (
                                                recentProjects.map((project, idx) => (
                                                    <motion.div
                                                        key={project.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="group bg-black/40 border border-white/5 rounded-2xl p-5 md:p-6 flex items-center justify-between hover:border-cyan-500/30 hover:bg-black/60 transition-all duration-500 shadow-lg"
                                                    >
                                                        <div className="flex items-center space-x-6 min-w-0">
                                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500 shrink-0">
                                                                <Code2 size={20} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-sm md:text-base font-black text-white truncate uppercase tracking-tight group-hover:text-cyan-400 transition-colors italic">{project.title}</h4>
                                                                <div className="flex items-center mt-1 space-x-4 opacity-40 text-[9px] font-bold uppercase tracking-widest">
                                                                    <span className="flex items-center"><Clock size={10} className="mr-1.5" /> {new Date(project.updated_at).toLocaleDateString()}</span>
                                                                    <span className="flex items-center"><Briefcase size={10} className="mr-1.5" /> {project.category || 'General'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3 ml-4 shrink-0">
                                                            <Link href={route('editor', { slug: project.slug })} className="p-2.5 bg-white/5 hover:bg-cyan-500 hover:text-black text-white/40 rounded-lg transition-all border border-white/5 group-hover:border-cyan-500/20 shadow-sm" title="Edit">
                                                                <ExternalLink size={14} />
                                                            </Link>
                                                            <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all border border-rose-500/10 shadow-sm" title="Destroy">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* QUICK ACTIONS & SYSTEM INFO */}
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3 px-2">
                                                <Zap size={18} className="text-amber-400" />
                                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Quick_Actions</h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                <Link href={route('editor')} className="flex items-center justify-between p-5 bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl hover:border-cyan-500/50 hover:from-cyan-500/20 transition-all group active:scale-[0.98]">
                                                    <div className="flex items-center gap-4">
                                                        <Plus className="text-cyan-400" size={20} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">New_Synthesis</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-cyan-500/40 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                                <Link href={route('explore')} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all group active:scale-[0.98]">
                                                    <div className="flex items-center gap-4">
                                                        <Globe className="text-emerald-400" size={20} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Global_Search</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-white/10 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                                <Link href={route('profile.edit')} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all group active:scale-[0.98]">
                                                    <div className="flex items-center gap-4">
                                                        <UserCheck className="text-blue-400" size={20} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Uplink_Settings</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-white/10 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-cyan-500/10 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full" />
                                            <div className="flex items-center space-x-3 mb-6">
                                                <Cpu className="text-cyan-500" size={20} />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/60">Node_Diagnostics</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                                                    <span className="text-white/30">Auth_Level</span>
                                                    <span className="text-emerald-400">Class_A_Neural</span>
                                                </div>
                                                <div className="h-px bg-white/5" />
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                                                    <span className="text-white/30">Network_Latency</span>
                                                    <span className="text-cyan-400">0.002ms</span>
                                                </div>
                                                <div className="h-px bg-white/5" />
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                                                    <span className="text-white/30">Uptime</span>
                                                    <span className="text-amber-400">99.99%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AuthenticatedLayout>
                </motion.div>
            )}

            {/* SCANLINE EFFECTS */}
            <div className="fixed inset-0 pointer-events-none bg-scanlines opacity-[0.03] z-[100]" />

            <style dangerouslySetInnerHTML={{ __html: `
                .bg-scanlines {
                    background: linear-gradient(to bottom, transparent 50%, black 50%);
                    background-size: 100% 4px;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 0.2); }
            ` }} />
        </div>
    );
}