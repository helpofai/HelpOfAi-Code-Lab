import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    Plus, Code2, ExternalLink, Trash2, Clock, Globe, 
    ShieldCheck, Zap, Activity, Database, Lock, Unlock, 
    Terminal, ArrowRight, UserCheck, Briefcase
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';

export default function Dashboard() {
    const { auth } = usePage().props;
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
        if (!confirm('Destroy this neural module?')) return;
        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {}
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
            case 'paid-user': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
            default: return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-300">
            <ProBackground />
            
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 relative z-10">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded shadow-sm">
                                <Activity className="text-cyan-500" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">Dashboard</h2>
                                <p className="text-[8px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1">System Active</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <div className={`px-3 py-1 rounded border text-[9px] font-bold uppercase tracking-widest ${getRoleColor(auth.user.role)}`}>
                                {auth.user.role}_ACCESS
                            </div>
                            <Link href={route('editor')} className="btn-primary flex items-center gap-2">
                                <Plus size={14} strokeWidth={3} /> New Project
                            </Link>
                        </div>
                    </div>
                }
            >
                <Head title="Dashboard" />
                
                <div className="relative flex-1 p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-12 relative z-10 text-left">
                        
                        {/* Welcome Strip */}
                        <div className="space-y-2 border-l-2 border-[var(--border)] pl-8">
                            <h1 className="text-4xl md:text-6xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-none">
                                Welcome, <span className="text-cyan-500">{auth.user.name.split(' ')[0]}</span>
                            </h1>
                            <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest font-bold">
                                System Operational. Monitoring {projects.length} Active Projects.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { label: 'Total Projects', val: projects.length, icon: Database, color: 'text-cyan-500' },
                                { label: 'Sync Status', val: 'OK', icon: Globe, color: 'text-emerald-500' },
                                { label: 'Security', val: 'Secure', icon: ShieldCheck, color: 'text-rose-500' },
                                { label: 'Performance', val: '0.02ms', icon: Zap, color: 'text-amber-500' }
                            ].map((s, i) => (
                                <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded hover:border-cyan-500/30 transition-colors shadow-xl text-left">
                                    <s.icon className={`${s.color} mb-4 opacity-60`} size={20} />
                                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{s.label}</div>
                                    <div className="text-2xl font-black text-[var(--text-main)] tracking-tight italic">{s.val}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Recent Activity */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-3 px-2">
                                    <Terminal size={16} className="text-cyan-500" />
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)]">Recent Activity</h3>
                                </div>

                                <div className="space-y-2">
                                    {isLoading ? (
                                        <div className="h-32 flex items-center justify-center bg-[var(--bg-surface)] rounded border border-dashed border-[var(--border)]">
                                            <div className="w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                                        </div>
                                    ) : projects.length === 0 ? (
                                        <div className="p-12 text-center bg-[var(--bg-surface)] rounded border border-dashed border-[var(--border)] space-y-6">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">No projects found.</p>
                                            <Link href={route('editor')} className="btn-secondary inline-block">Create First Project</Link>
                                        </div>
                                    ) : (
                                        projects.slice(0, 5).map((project, idx) => (
                                            <motion.div
                                                key={project.id}
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                                className="group bg-[var(--bg-surface)] border border-[var(--border)] p-4 flex items-center justify-between hover:border-cyan-500/30 transition-all"
                                            >
                                                <div className="flex items-center gap-6 min-w-0">
                                                    <div className="w-10 h-10 bg-[var(--bg-main)] border border-[var(--border)] rounded flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:text-black transition-all">
                                                        <Code2 size={18} />
                                                    </div>
                                                    <div className="min-w-0 text-left">
                                                        <h4 className="text-sm font-black text-[var(--text-main)] truncate uppercase italic tracking-tight group-hover:text-cyan-500 transition-colors">{project.title}</h4>
                                                        <div className="flex items-center mt-1 gap-4 opacity-40 text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                            <span className="flex items-center gap-1.5"><Clock size={10} /> {new Date(project.updated_at).toLocaleDateString()}</span>
                                                            <span className="flex items-center gap-1.5"><Briefcase size={10} /> {project.category || 'General'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Link href={route('editor', { slug: project.slug })} className="p-2 hover:bg-cyan-500 hover:text-white dark:hover:text-black text-[var(--text-muted)] rounded transition-all border border-transparent hover:border-cyan-500/50">
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-rose-500 hover:text-white text-[var(--text-muted)] rounded transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Actions */}
                            <div className="space-y-8 text-left">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <Zap size={16} className="text-amber-500" />
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)]">Quick Access</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Link href={route('editor')} className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">New Project</span>
                                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                        <Link href={route('cloud-sync')} className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Cloud Sync</span>
                                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                        <Link href={route('profile.edit')} className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Profile Settings</span>
                                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 text-[6px] text-[var(--text-muted)] font-mono opacity-20 uppercase">Status_Ok</div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <UserCheck className="text-cyan-500" size={16} />
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">System Status</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { l: 'Auth Status', v: 'Verified', c: 'text-emerald-500' },
                                            { l: 'Network', v: 'Stable', c: 'text-cyan-500' },
                                            { l: 'Uptime', v: '99.9%', c: 'text-amber-500' }
                                        ].map((stat, i) => (
                                            <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase">
                                                <span className="text-[var(--text-muted)]">{stat.l}</span>
                                                <span className={stat.c}>{stat.v}</span>
                                            </div>
                                        ))}
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