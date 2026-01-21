import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Globe, Zap, Clock, ExternalLink, Share2, Check, 
    Search, Terminal, User, Code2, Shuffle, Filter
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';

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
        <div className="w-full h-full bg-[#1d1e22] relative overflow-hidden">
            {fullProject ? (
                <div className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-[2s]">
                    <iframe srcDoc={srcDoc} title="t" className="border-none pointer-events-none absolute" style={{ width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: '0 0' }} sandbox="allow-scripts" />
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5"><div className="w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>
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
        }, 300);
        return () => clearTimeout(timeout);
    }, [fetchProjects]);

    const handleShare = (slug) => {
        navigator.clipboard.writeText(`${window.location.origin}/editor/${slug}`);
        setCopyStatus(slug);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 relative overflow-hidden transition-colors duration-300 text-left">
            <ProBackground />
            
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded shadow-sm">
                                <Globe className="text-purple-500" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">Global_Grid</h2>
                                <p className="text-[8px] text-purple-500 font-bold uppercase tracking-[0.4em] mt-1">Public Neural Clusters</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                                <input 
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-[var(--bg-surface)] border border-[var(--border)] rounded pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 w-full text-[var(--text-main)]"
                                />
                            </div>
                            <div className="flex bg-[var(--bg-surface)] p-1 rounded border border-[var(--border)]">
                                <button onClick={() => setSort('latest')} className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase transition-all ${sort === 'latest' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Latest</button>
                                <button onClick={() => setSort('random')} className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase transition-all ${sort === 'random' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Random</button>
                            </div>
                        </div>
                    </div>
                }
            >
                <Head title="Explore Neural Cores" />
                
                <div className="relative min-h-screen p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-7xl mx-auto relative z-10 space-y-10">
                        
                        <div className="flex items-center gap-4 bg-[var(--bg-surface)] border border-[var(--border)] p-4 rounded-lg overflow-x-auto shadow-xl">
                            <Filter size={14} className="text-[var(--text-muted)] shrink-0 ml-2" />
                            <div className="flex gap-2">
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-cyan-500 text-white dark:text-black border-cyan-500' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-main)]'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <div className="py-48 flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Scanning_Global_Network...</span>
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="bg-[var(--bg-surface)] border border-dashed border-[var(--border)] rounded-lg p-32 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">No matching protocols detected.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {projects.map((project, idx) => (
                                        <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                            className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-all duration-500 shadow-lg text-left"
                                        >
                                            <div className="aspect-video bg-black relative border-b border-[var(--border)] overflow-hidden">
                                                <ProjectThumbnail project={project} />
                                                <div className="absolute top-3 left-3 z-20">
                                                    {project.category && (
                                                        <span className="px-2 py-0.5 bg-black/60 border border-white/10 rounded text-[8px] font-bold uppercase text-cyan-400 tracking-widest">{project.category}</span>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
                                                    <Link href={route('editor', { slug: project.slug })} className="px-6 py-2 bg-white text-black font-bold uppercase text-[10px] tracking-widest rounded-sm shadow-xl">Connect_Core</Link>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-base font-black text-[var(--text-main)] uppercase italic tracking-tight group-hover:text-cyan-500 transition-colors mb-4 truncate">{project.title}</h3>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                                        <User size={12} />
                                                        <span>{project.user?.name || 'Anonymous'}</span>
                                                    </div>
                                                    <button onClick={() => handleShare(project.slug)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all">
                                                        {copySlug === project.slug ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}