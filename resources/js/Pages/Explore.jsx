import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Globe, Zap, Clock, ExternalLink, Share2, Check, 
    Search, Terminal, User, Code2, ShieldCheck, Database,
    Shuffle
} from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';

// Reusing sharp thumbnail logic
function ProjectThumbnail({ project }) {
    const [fullProject, setFullProject] = useState(null);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`/api/projects/${project.slug}`);
                setFullProject(res.data);
            } catch (e) {}
        };
        fetchDetails();
    }, [project.slug]);

    const srcDoc = useMemo(() => {
        if (!fullProject) return '';
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    html, body { background: #1d1e22; margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                    ${fullProject.code?.css || ''}
                </style>
            </head>
            <body>${fullProject.code?.html || ''}</body>
            </html>
        `;
    }, [fullProject]);

    return (
        <div className="w-full h-full bg-[#1d1e22] relative">
            {fullProject ? (
                <iframe srcDoc={srcDoc} title="t" className="border-none pointer-events-none absolute" style={{ width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: '0 0' }} sandbox="allow-scripts" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5"><div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>
            )}
        </div>
    );
}

export default function Explore() {
    const { auth } = usePage().props;
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('latest'); // 'latest' or 'random'
    const [copySlug, setCopyStatus] = useState(null);

    const fetchProjects = async (type) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/explore/${type}`);
            setProjects(res.data);
        } catch (e) {} finally { setIsLoading(false); }
    };

    useEffect(() => { fetchProjects(filter); }, [filter]);

    const handleShare = (slug) => {
        navigator.clipboard.writeText(`${window.location.origin}/editor/${slug}`);
        setCopyStatus(slug);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                            <Globe className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-tight italic">Global_Network</h2>
                            <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] font-bold">Public Neural Clusters</p>
                        </div>
                    </div>
                    
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button onClick={() => setFilter('latest')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === 'latest' ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                            <Clock size={12} className="inline mr-2" /> Latest_Cores
                        </button>
                        <button onClick={() => setFilter('random')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === 'random' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                            <Shuffle size={12} className="inline mr-2" /> Random_Seeds
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Explore Neural Cores" />
            
            <div className="relative min-h-full p-10 lg:p-16 overflow-y-auto">
                <AnimatedGrid />
                
                <div className="max-w-screen-2xl mx-auto relative z-10">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-48 space-y-6">
                                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] animate-pulse">Syncing_Global_Buffer...</span>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                {projects.map((project, idx) => (
                                    <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        className="group relative bg-[#0f172a]/40 border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-500"
                                    >
                                        <div className="aspect-[16/10] w-full bg-black relative overflow-hidden border-b border-white/5">
                                            <ProjectThumbnail project={project} />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <Link href={route('editor', { slug: project.slug })} className="p-4 bg-white text-black rounded-full hover:bg-cyan-400 transition-all scale-75 group-hover:scale-100"><ExternalLink size={24} /></Link>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-black text-white uppercase tracking-tighter truncate group-hover:text-cyan-400 transition-colors italic">{project.title}</h3>
                                                <div className="flex items-center mt-2 space-x-3 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                                                    <User size={12} className="text-purple-500" />
                                                    <span>By: {project.user?.name || 'Anonymous'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Link href={route('editor', { slug: project.slug })} className="flex-1 py-3 bg-white/5 text-white border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all text-center">Open_Core</Link>
                                                <button onClick={() => handleShare(project.slug)} className="p-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                                                    {copySlug === project.slug ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
