import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Code2, ExternalLink, Trash2, Clock, 
    ShieldCheck, Zap, Activity, Terminal, 
    Lock, Unlock, Search, LayoutGrid, List, Database,
    Share2, Copy, Check, MoreVertical, Settings, Save, X
} from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';

// High-Fidelity Project Thumbnail using virtual scaling
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
                    html, body { 
                        background: #1d1e22; 
                        margin: 0; 
                        padding: 0; 
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }
                    ${fullProject.code?.css || ''}
                </style>
            </head>
            <body>
                ${fullProject.code?.html || ''}
            </body>
            </html>
        `;
    }, [fullProject]);

    return (
        <div className="w-full h-full bg-[#1d1e22] relative">
            {fullProject ? (
                <div className="absolute inset-0 w-full h-full">
                    <iframe 
                        srcDoc={srcDoc} 
                        title="thumb" 
                        className="border-none pointer-events-none absolute"
                        style={{ 
                            width: '400%', 
                            height: '400%', 
                            transform: 'scale(0.25)', 
                            transformOrigin: '0 0' 
                        }}
                        sandbox="allow-scripts"
                    />
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}

// Project Settings Modal
function ProjectSettingsModal({ project, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        is_public: project.is_public ? 1 : 0,
        meta_title: project.meta_title || '',
        meta_description: project.meta_description || '',
        meta_keywords: project.meta_keywords || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await axios.put(`/api/projects/${project.id}`, {
                ...formData,
                is_public: !!Number(formData.is_public) // Convert back to boolean for API
            });
            onUpdate(res.data);
            onClose();
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#0f172a] border border-cyan-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center">
                        <Settings className="mr-3 text-cyan-400" size={20} /> Module Configuration
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    
                    {/* Visibility Toggle */}
                    <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                        <div>
                            <span className="block text-xs font-black text-white uppercase tracking-widest mb-1">Access Protocol</span>
                            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                                {formData.is_public ? 'Public // Global Network Access' : 'Private // Secure Local Only'}
                            </span>
                        </div>
                        <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, is_public: 1})}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${formData.is_public ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-white/40 hover:text-white'}`}
                            >
                                Public
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, is_public: 0})}
                                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${!formData.is_public ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-white/40 hover:text-white'}`}
                            >
                                Private
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] border-b border-cyan-500/20 pb-2 mb-4">Search Engine Optimization</h4>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Meta Title</label>
                            <input 
                                type="text"
                                value={formData.meta_title}
                                onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-cyan-500 focus:ring-0 text-sm font-bold"
                                placeholder={project.title}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Meta Description</label>
                            <textarea 
                                value={formData.meta_description}
                                onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-cyan-500 focus:ring-0 text-sm font-medium resize-none h-24"
                                placeholder="Brief description for search results..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Keywords (Comma Separated)</label>
                            <input 
                                type="text"
                                value={formData.meta_keywords}
                                onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-cyan-500 focus:ring-0 text-xs font-mono"
                                placeholder="html, css, experiment, visual..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex items-center px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                        >
                            {isSaving ? <Activity className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                            Save_Configuration
                        </button>
                    </div>

                </form>
            </motion.div>
        </motion.div>
    );
}

export default function MyProjects() {
    const { auth } = usePage().props;
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [copySlug, setCopyStatus] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

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

    const handleShare = (slug) => {
        const url = `${window.location.origin}/editor/${slug}`;
        navigator.clipboard.writeText(url);
        setCopyStatus(slug);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    const handleDelete = async (id) => {
        if (!confirm('Destroy this neural module?')) return;
        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {}
    };

    const handleProjectUpdate = (updatedProject) => {
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white font-mono selection:bg-cyan-500/30 overflow-hidden relative">
            <AnimatedGrid />
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 md:gap-0">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                                <Database className="text-cyan-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-black text-white tracking-tighter uppercase leading-tight italic">My_Neural_Cores</h2>
                                <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] font-bold">Personal Neural Storage</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto gap-4 md:gap-6">
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                <input 
                                    type="text"
                                    placeholder="Search_Protocols..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 w-full md:w-72 transition-all"
                                />
                            </div>
                            <Link
                                href={route('editor')}
                                className="flex items-center justify-center px-8 py-3 bg-cyan-500 text-black rounded-lg font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            >
                                <Plus className="mr-2" size={14} strokeWidth={3} /> Initialize_New
                            </Link>
                        </div>
                    </div>
                }
            >
                <Head title="My Neural Archives" />
                <div className="relative min-h-full p-4 md:p-10 lg:p-16 overflow-y-auto">
                    <div className="max-w-screen-2xl mx-auto relative z-10">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-48 space-y-6"
                                >
                                    <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                                    <span className="text-xs font-black text-cyan-500 uppercase tracking-[0.5em] animate-pulse">Retrieving_Data_Blocks...</span>
                                </motion.div>
                            ) : filteredProjects.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[4rem] p-12 md:p-32 text-center backdrop-blur-3xl"
                                >
                                    <Terminal className="w-16 h-16 md:w-24 md:h-24 text-cyan-500/10 mx-auto mb-6 md:mb-10" />
                                    <h3 className="text-xl md:text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Archives_Empty</h3>
                                    <p className="text-white/30 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-8 md:mb-12">No active neural modules found in current sector.</p>
                                    <Link href={route('editor')} className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black rounded-xl hover:bg-cyan-400 transition-all uppercase tracking-widest text-[10px] md:text-[11px]">Deploy_Module_01</Link>
                                </motion.div>
                            ) : (
                                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6 md:gap-12">
                                    {filteredProjects.map((project, idx) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group relative bg-[#0f172a]/40 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_80px_rgba(6,182,212,0.15)] transition-all duration-700"
                                        >
                                            <div className="aspect-[16/10] w-full bg-black relative overflow-hidden border-b border-white/5">
                                                <ProjectThumbnail project={project} />
                                                <div className={`absolute top-4 md:top-6 right-4 md:right-6 px-3 md:px-4 py-1.5 rounded-full backdrop-blur-xl border font-black text-[8px] md:text-[9px] uppercase tracking-widest flex items-center space-x-2 z-20 ${project.is_public ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                                    {project.is_public ? <Unlock size={10} /> : <Lock size={10} />}
                                                    <span>{project.is_public ? 'Protocol: Global' : 'Protocol: Secure'}</span>
                                                </div>
                                            </div>
                                            <div className="p-6 md:p-10 text-left">
                                                <div className="flex justify-between items-start mb-6 md:mb-8">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter truncate group-hover:text-cyan-400 transition-colors italic">{project.title}</h3>
                                                        <div className="flex items-center mt-3 space-x-6 opacity-40">
                                                            <div className="flex items-center text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em]"><Clock size={12} className="mr-2 text-cyan-500" /> {new Date(project.updated_at).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2 md:space-x-4 mb-6 md:mb-8">
                                                    <Link href={route('editor', { slug: project.slug })} className="flex-1 min-w-[120px] flex items-center justify-center space-x-3 py-3 md:py-4 bg-white text-black rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl">
                                                        <ExternalLink size={16} />
                                                        <span>Open_Editor</span>
                                                    </Link>
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => setEditingProject(project)} className="p-3 md:p-4 bg-white/5 text-white border border-white/10 rounded-2xl hover:bg-white/10 transition-all" title="Configure Module">
                                                            <Settings size={18} />
                                                        </button>
                                                        <button onClick={() => handleShare(project.slug)} className="p-3 md:p-4 bg-white/5 text-white border border-white/10 rounded-2xl hover:bg-white/10 transition-all" title="Copy Link">
                                                            {copySlug === project.slug ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
                                                        </button>
                                                        <button onClick={() => handleDelete(project.id)} className="p-3 md:p-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all" title="Delete">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-3 md:p-4 items-center justify-between">
                                                    <span className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Access_Path</span>
                                                    <code className="text-[9px] md:text-[10px] text-cyan-500/60 font-mono">/archives/{project.slug.slice(0, 12)}...</code>
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
            
            <AnimatePresence>
                {editingProject && (
                    <ProjectSettingsModal 
                        project={editingProject} 
                        onClose={() => setEditingProject(null)} 
                        onUpdate={handleProjectUpdate} 
                    />
                )}
            </AnimatePresence>

            <style>{`
                .bg-scanlines {
                    background: linear-gradient(to bottom, transparent 50%, black 50%);
                    background-size: 100% 4px;
                }
            `}</style>
        </div>
    );
}