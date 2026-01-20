import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Code2, ExternalLink, Trash2, Clock, Globe, 
    ShieldCheck, Zap, Activity, ShieldAlert, Cpu, 
    Terminal, Lock, Unlock, Sparkles, UserCheck, Database,
    LayoutGrid, List
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
                    className="h-full"
                >
                    <AnimatedGrid />
                    
                    <AuthenticatedLayout
                        header={
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 md:gap-0">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                                        <Activity className="text-cyan-400" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-tight">Command_Center</h2>
                                        <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] font-bold">Protocol v4.2.0 Active</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getRoleColor(auth.user.role)}`}>
                                        {auth.user.role}_ACCESS
                                    </div>
                                    <Link
                                        href={route('editor')}
                                        className="flex items-center px-6 py-2 bg-cyan-500 text-black rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                                    >
                                        <Plus className="mr-2" size={14} strokeWidth={3} /> New_Core
                                    </Link>
                                </div>
                            </div>
                        }
                    >
                        <Head title="Dashboard" />
                        
                        <div className="relative min-h-full p-4 md:p-8 lg:p-12 overflow-y-auto">
                            <div className="max-w-7xl mx-auto relative z-10">
                                {/* STATS STRIP */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
                                    {[
                                        { label: 'CORES_ACTIVE', val: projects.length, icon: Database, color: 'text-cyan-400' },
                                        { label: 'NODE_HEALTH', val: '98%', icon: ShieldCheck, color: 'text-emerald-400' },
                                        { label: 'DATA_FLOW', val: '0.04ms', icon: Zap, color: 'text-amber-400' },
                                        { label: 'USER_AUTH', val: 'VERIFIED', icon: UserCheck, color: 'text-blue-400' }
                                    ].map((s, i) => (
                                        <div key={i} className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 md:p-6 rounded-2xl">
                                            <s.icon className={`${s.color} mb-3 opacity-60`} size={18} />
                                            <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{s.label}</div>
                                            <div className="text-lg md:text-xl font-black text-white tracking-tighter">{s.val}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* CONTENT AREA */}
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center py-32 space-y-4"
                                        >
                                            <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                                            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] animate-pulse">Establishing_Uplink...</span>
                                        </motion.div>
                                    ) : projects.length === 0 ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-24 text-center backdrop-blur-3xl"
                                        >
                                            <Code2 className="w-16 h-16 text-cyan-500/10 mx-auto mb-8" />
                                            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">No Active Neural Cores</h3>
                                            <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto text-xs uppercase tracking-widest">Access the terminal to begin your first system synthesis.</p>
                                            <Link
                                                href={route('editor')}
                                                className="px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-cyan-400 transition-all uppercase tracking-[0.2em] text-[10px]"
                                            >
                                                Initialize_Core_Zero
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                                <div className="flex items-center space-x-3">
                                                    <Terminal size={16} className="text-cyan-500" />
                                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Active_Memory_Slots</h3>
                                                </div>
                                                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                                                    <button className="p-1.5 bg-cyan-500 text-black rounded-md shadow-lg"><LayoutGrid size={14} /></button>
                                                    <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><List size={14} /></button>
                                                </div>
                                            </div>

                                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {projects.map((project, idx) => (
                                                    <motion.div
                                                        key={project.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="group relative bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:bg-black/60 transition-all duration-500"
                                                    >
                                                        <div className="p-8">
                                                            <div className="flex justify-between items-start mb-8">
                                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                                                                    <Code2 size={24} strokeWidth={1.5} />
                                                                </div>
                                                                <button 
                                                                    onClick={() => handleDelete(project.id)}
                                                                    className="p-2 text-white/10 hover:text-rose-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            
                                                            <h3 className="text-lg font-black text-white mb-4 tracking-tighter uppercase truncate group-hover:text-cyan-400 transition-colors">
                                                                {project.title}
                                                            </h3>
                                                            
                                                            <div className="flex items-center space-x-4 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                                <span className="flex items-center"><Clock size={12} className="mr-1.5 text-cyan-500/40" /> {new Date(project.updated_at).toLocaleDateString()}</span>
                                                                <span className="flex items-center"><UserCheck size={12} className="mr-1.5 text-cyan-500/40" /> Verified</span>
                                                            </div>
                                                        </div>

                                                        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center group-hover:bg-cyan-500/5 transition-all">
                                                            <Link
                                                                href={route('editor', { slug: project.slug })}
                                                                className="text-[10px] font-black text-white hover:text-cyan-400 uppercase tracking-[0.3em] flex items-center"
                                                            >
                                                                Connect <ExternalLink size={12} className="ml-2" />
                                                            </Link>
                                                            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${project.is_public ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' : 'text-white/20 border-white/5'}`}>
                                                                {project.is_public ? <Unlock size={10}/> : <Lock size={10}/>}
                                                                <span>{project.is_public ? 'Global' : 'Locked'}</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
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
            ` }} />
        </div>
    );
}