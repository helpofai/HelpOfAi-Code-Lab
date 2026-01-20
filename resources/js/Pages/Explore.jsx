import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Globe, Zap, Clock, ExternalLink, Share2, Check, 
    Search, Terminal, User, Code2, ShieldCheck, Database,
    Shuffle, Filter, Tag, ArrowRight, MousePointer2
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
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sort, setSort] = useState('latest');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [search, setSearch] = useState('');
    const [copySlug, setCopyStatus] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/explore/categories');
            setCategories(['ALL', ...res.data]);
        } catch (e) {}
    };

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/explore', {
                params: {
                    sort,
                    category: activeCategory,
                    search: search
                }
            });
            setProjects(res.data);
        } catch (e) {} finally { setIsLoading(false); }
    }, [sort, activeCategory, search]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchProjects();
        }, 300); // Debounce search
        return () => clearTimeout(timeout);
    }, [fetchProjects]);

    const handleShare = (slug) => {
        navigator.clipboard.writeText(`${window.location.origin}/editor/${slug}`);
        setCopyStatus(slug);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6 md:gap-0">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                            <Globe className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-black text-white tracking-tighter uppercase leading-tight italic">Global_Grid</h2>
                            <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] font-bold">Public Neural Clusters</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                            <input 
                                type="text"
                                placeholder="Search_Protocols..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 w-full transition-all"
                            />
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                            <button onClick={() => setSort('latest')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sort === 'latest' ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                                <Clock size={12} className="inline mr-2" /> Latest
                            </button>
                            <button onClick={() => setSort('random')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sort === 'random' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                                <Shuffle size={12} className="inline mr-2" /> Random
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Explore Neural Cores" />
            
            <div className="relative min-h-screen p-4 md:p-10 lg:p-16 overflow-y-auto">
                <AnimatedGrid />
                
                <div className="max-w-screen-2xl mx-auto relative z-10 space-y-10">
                    
                    {/* Categories Filter */}
                    <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl overflow-x-auto custom-scrollbar">
                        <Filter size={14} className="text-white/20 shrink-0 ml-2" />
                        <div className="flex space-x-2">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-48 space-y-6">
                                <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                                <span className="text-xs font-black text-cyan-500 uppercase tracking-[0.5em] animate-pulse">Syncing_Global_Buffer...</span>
                            </motion.div>
                        ) : projects.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-48 space-y-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                                <Terminal size={48} className="text-white/5" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No data matches current search parameters.</p>
                                <button onClick={() => { setSearch(''); setActiveCategory('ALL'); }} className="text-[10px] font-black text-cyan-500 hover:text-white transition-colors uppercase tracking-widest underline">Reset_Filters</button>
                            </motion.div>
                        ) : (
                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                                {projects.map((project, idx) => (
                                    <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        className="group relative bg-[#0f172a]/40 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_80px_rgba(6,182,212,0.1)] transition-all duration-500"
                                    >
                                        <div className="aspect-[16/10] w-full bg-black relative overflow-hidden border-b border-white/5">
                                            <ProjectThumbnail project={project} />
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                                                {project.category && (
                                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase text-cyan-400 tracking-widest shadow-lg">
                                                        {project.category}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <Link href={route('editor', { slug: project.slug })} className="p-4 bg-white text-black rounded-full hover:bg-cyan-400 transition-all scale-75 group-hover:scale-100"><ExternalLink size={24} /></Link>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate group-hover:text-cyan-400 transition-colors italic mb-3">{project.title}</h3>
                                                <div className="flex items-center space-x-3 text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                    <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                                                        <User size={12} className="text-cyan-500" />
                                                    </div>
                                                    <span>{project.user?.name || 'Anonymous'}</span>
                                                </div>
                                            </div>

                                            {project.tags && project.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {project.tags.map(tag => (
                                                        <span key={tag} className="text-[8px] font-black text-white/20 hover:text-white transition-colors cursor-default uppercase">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-3">
                                                <Link href={route('editor', { slug: project.slug })} className="flex-1 py-3 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all text-center shadow-lg">Connect_Core</Link>
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
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { height: 2px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.1); border-radius: 10px; }
            `}</style>
        </AuthenticatedLayout>
    );
}