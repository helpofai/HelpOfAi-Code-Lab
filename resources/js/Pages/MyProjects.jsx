import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Code2, ExternalLink, Trash2, Clock, 
    Database, Lock, Unlock, Search, LayoutGrid, List,
    Share2, Check, Settings, Save, X, Activity, Briefcase, Tag
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';

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
                <div className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-[2s]">
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
                    <div className="w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}

// Project Settings Modal
function ProjectSettingsModal({ project, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        is_public: project.is_public ? 1 : 0,
        category: project.category || '',
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
        meta_title: project.meta_title || '',
        meta_description: project.meta_description || '',
        meta_keywords: project.meta_keywords || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
            const res = await axios.put(`/api/projects/${project.id}`, {
                ...formData,
                tags: tagsArray,
                is_public: !!Number(formData.is_public)
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center">
                        <Settings className="mr-3 text-cyan-400" size={16} /> Module Configuration
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    
                    {/* Visibility Toggle */}
                    <div className="bg-white/[0.03] p-4 rounded border border-white/5 flex justify-between items-center">
                        <div>
                            <span className="block text-[10px] font-black text-white uppercase tracking-widest mb-1">Access Protocol</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">
                                {formData.is_public ? 'Global Network' : 'Secure local'}
                            </span>
                        </div>
                        <div className="flex bg-black/40 rounded p-1 border border-white/10">
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, is_public: 1})}
                                className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${formData.is_public ? 'bg-cyan-500 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                Public
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, is_public: 0})}
                                className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!formData.is_public ? 'bg-rose-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                Private
                            </button>
                        </div>
                    </div>

                    {/* Categorization */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] border-b border-white/5 pb-2">Categorization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Category</label>
                                <input 
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-cyan-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest"
                                    placeholder="e.g. VISUALS"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">Tags</label>
                                <input 
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-cyan-500/50 focus:ring-0 text-[10px] font-bold"
                                    placeholder="html, css, js"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] border-b border-white/5 pb-2">SEO Protocol</h4>
                        <div className="space-y-4">
                            <input 
                                type="text"
                                value={formData.meta_title}
                                onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-cyan-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest"
                                placeholder="Meta Title"
                            />
                            <textarea 
                                value={formData.meta_description}
                                onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-cyan-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest resize-none h-20"
                                placeholder="Meta Description"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end sticky bottom-0 bg-[#0a0a0a] py-4 border-t border-white/5">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="btn-primary w-full md:w-auto"
                        >
                            {isSaving ? <Activity className="animate-spin mr-2 inline" size={14} /> : <Save className="mr-2 inline" size={14} />}
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
    const [viewMode, setViewMode] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('ALL');

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
        navigator.clipboard.writeText(`${window.location.origin}/editor/${slug}`);
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

    const categories = useMemo(() => ['ALL', ...new Set(projects.map(p => p.category).filter(Boolean))], [projects]);

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 relative">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded">
                                <Database className="text-cyan-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white tracking-tight uppercase italic leading-none">Archives</h2>
                                <p className="text-[8px] text-cyan-500/60 uppercase tracking-[0.4em] font-bold mt-1">Personal Memory Blocks</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto gap-4">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                <input 
                                    type="text"
                                    placeholder="Filter_Data..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 w-full"
                                />
                            </div>
                            <Link href={route('editor')} className="btn-primary whitespace-nowrap">
                                <Plus className="mr-2 inline" size={14} /> New_Module
                            </Link>
                        </div>
                    </div>
                }
            >
                <Head title="My Neural Archives" />
                <div className="relative min-h-screen p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-7xl mx-auto relative z-10 space-y-10">
                        
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0a0a0a] border border-white/5 p-6 rounded-lg shadow-xl">
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 text-white/40 border-white/5 hover:text-white'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="flex bg-white/5 p-1 rounded border border-white/10">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}><LayoutGrid size={16} /></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}><List size={16} /></button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <div className="py-48 flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Scanning_Archives...</span>
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="bg-[#0a0a0a] border border-dashed border-white/10 rounded-lg p-24 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-8">Memory block is currently vacant.</p>
                                    <Link href={route('editor')} className="btn-secondary">Initialize_First_Synthesis</Link>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredProjects.map((project, idx) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                            className="group bg-[#0a0a0a] border border-white/5 rounded-lg overflow-hidden hover:border-cyan-500/30 transition-all duration-500 shadow-lg"
                                        >
                                            <div className="aspect-video bg-black relative border-b border-white/5 overflow-hidden">
                                                <ProjectThumbnail project={project} />
                                                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
                                                    {project.category && (
                                                        <span className="px-2 py-0.5 bg-black/60 border border-white/10 rounded text-[8px] font-bold uppercase text-cyan-400 tracking-widest">{project.category}</span>
                                                    )}
                                                </div>
                                                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-widest z-20 ${project.is_public ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                                    {project.is_public ? 'Global' : 'Secure'}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-lg font-black text-white uppercase italic tracking-tight group-hover:text-cyan-400 transition-colors mb-6 truncate">{project.title}</h3>
                                                <div className="flex gap-2">
                                                    <Link href={route('editor', { slug: project.slug })} className="flex-1 btn-primary text-center">Open</Link>
                                                    <button onClick={() => setEditingProject(project)} className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded border border-white/5 transition-all"><Settings size={14}/></button>
                                                    <button onClick={() => handleShare(project.slug)} className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded border border-white/5 transition-all">{copySlug === project.slug ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}</button>
                                                    <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white rounded border border-rose-500/10 transition-all"><Trash2 size={14}/></button>
                                                </div>
                                            </div>                                        
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-lg overflow-hidden shadow-xl">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5">
                                                <th className="px-6 py-4">Module</th>
                                                <th className="px-6 py-4">Sector</th>
                                                <th className="px-6 py-4">Sync_Status</th>
                                                <th className="px-6 py-4 text-right">Uplink</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredProjects.map((project) => (
                                                <tr key={project.id} className="hover:bg-white/[0.01] transition-colors">
                                                    <td className="px-6 py-4 font-bold uppercase italic text-sm text-white">{project.title}</td>
                                                    <td className="px-6 py-4 text-[10px] font-bold text-slate-500">{project.category || 'General'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[9px] font-bold uppercase ${project.is_public ? 'text-cyan-400' : 'text-rose-400'}`}>{project.is_public ? 'Global' : 'Secure'}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={route('editor', { slug: project.slug })} className="p-1.5 hover:text-cyan-400 transition-colors"><ExternalLink size={14} /></Link>
                                                            <button onClick={() => setEditingProject(project)} className="p-1.5 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => handleDelete(project.id)} className="p-1.5 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
        </div>
    );
}