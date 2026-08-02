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
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, ExternalLink, Trash2, Database, Search, 
    LayoutGrid, List, Settings, Save, X, Activity, 
    Store, ShoppingBag, ArrowUpRight
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import { useToast } from '@/Components/Toast/ToastProvider';

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

    if (project.settings?.thumbnail_url) {
        return (
            <div className="w-full h-full relative overflow-hidden">
                <img 
                    src={project.settings.thumbnail_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#1d1e22] relative overflow-hidden">
            {fullProject ? (
                <div className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-[2s]">
                    <iframe srcDoc={srcDoc} title="t" className="border-none pointer-events-none absolute" style={{ width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: '0 0' }} sandbox="allow-scripts" />
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5"><div className="w-4 h-4 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" /></div>
            )}
        </div>
    );
}

function ProjectSettingsModal({ project, teams, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        title: project.title || '',
        is_public: project.is_public ? 1 : 0,
        category: project.category || '',
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
        meta_title: project.meta_title || '',
        meta_description: project.meta_description || '',
        meta_keywords: project.meta_keywords || '',
        team_id: project.team_id || '',
        is_for_sale: project.is_for_sale ? 1 : 0,
        price: project.price || 0,
        github_repo_url: project.github_repo_url || '',
        support_duration: project.support_duration || '6_months',
    });
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
            const res = await axios.put(`/api/projects/${project.id}`, {
                ...formData,
                tags: tagsArray,
                is_public: !!Number(formData.is_public),
                is_for_sale: !!Number(formData.is_for_sale)
            });
            onUpdate(res.data);
            toast.success("Project updated successfully.");
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update project.");
        } finally { setIsSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-gradient-to-r from-[var(--bg-elevated)] to-purple-500/5">
                    <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest italic flex items-center">
                        <Settings className="mr-3 text-purple-500" size={16} /> Manage Product
                    </h3>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar text-left">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Product Title</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[12px] font-black" required />
                    </div>

                    <div className="bg-[var(--bg-elevated)] p-4 rounded border border-[var(--border)] flex justify-between items-center">
                        <div>
                            <span className="block text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest mb-1">Access Protocol</span>
                            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold">{formData.is_public ? 'Global Network' : 'Secure local'}</span>
                        </div>
                        <div className="flex bg-[var(--bg-main)] rounded p-1 border border-[var(--border)]">
                            <button type="button" onClick={() => setFormData({...formData, is_public: 1})} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${formData.is_public ? 'bg-purple-500 text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Public</button>
                            <button type="button" onClick={() => setFormData({...formData, is_public: 0})} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!formData.is_public ? 'bg-rose-500 text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Private</button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] border-b border-[var(--border)] pb-2">Categorization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Category</label>
                                <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Assign to Unit (Team)</label>
                                <select 
                                    value={formData.team_id} 
                                    onChange={(e) => setFormData({...formData, team_id: e.target.value})} 
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest appearance-none"
                                >
                                    <option value="">Personal Memory (No Team)</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Tags</label>
                                <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[10px] font-bold" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Meta Description</label>
                                <textarea rows="2" value={formData.meta_description} onChange={(e) => setFormData({...formData, meta_description: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[12px]"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                            <ShoppingBag size={14} /> Marketplace Listing
                        </h4>
                        
                        <div className="bg-[var(--bg-elevated)] p-4 rounded border border-[var(--border)] flex justify-between items-center mb-4">
                            <div>
                                <span className="block text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest mb-1">Sell Product</span>
                                <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold">List this on the Premium Marketplace</span>
                            </div>
                            <div className="flex bg-[var(--bg-main)] rounded p-1 border border-[var(--border)]">
                                <button type="button" onClick={() => setFormData({...formData, is_for_sale: 1})} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${formData.is_for_sale ? 'bg-emerald-500 text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Yes</button>
                                <button type="button" onClick={() => setFormData({...formData, is_for_sale: 0})} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!formData.is_for_sale ? 'bg-[var(--bg-surface)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>No</button>
                            </div>
                        </div>

                        {formData.is_for_sale ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Price (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">$</span>
                                        <input type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded pl-8 pr-3 py-3 text-[var(--text-main)] focus:border-emerald-500/50 focus:ring-0 text-[12px] font-black" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">GitHub Private Repo URL</label>
                                    <input type="url" placeholder="https://github.com/vendor/repo" value={formData.github_repo_url} onChange={(e) => setFormData({...formData, github_repo_url: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-emerald-500/50 focus:ring-0 text-[10px] font-bold" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Support & Updates Duration</label>
                                    <select 
                                        value={formData.support_duration} 
                                        onChange={(e) => setFormData({...formData, support_duration: e.target.value})}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-emerald-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest appearance-none"
                                    >
                                        <option value="6_months">6 Months (Industry Standard)</option>
                                        <option value="lifetime">Lifetime Updates</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <p className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest italic">
                                        Note: Buyers will automatically receive an RSA signed license key and a direct download of your GitHub repo zipball upon successful payment.
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="pt-4 flex justify-end sticky bottom-0 bg-[var(--bg-surface)] py-4 border-t border-[var(--border)]">
                        <button type="submit" disabled={isSaving} className="btn-primary bg-purple-500 hover:bg-purple-600 text-white w-full md:w-auto shadow-lg shadow-purple-500/20">
                            {isSaving ? <Activity className="animate-spin mr-2 inline" size={14} /> : <Save className="mr-2 inline" size={14} />} Save_Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default function VendorsProjects() {
    const { auth } = usePage().props;
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [viewMode, setViewMode] = useState('grid');
    const [editingProject, setEditingProject] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, teamsRes] = await Promise.all([
                    axios.get('/api/projects'),
                    axios.get('/api/teams-list')
                ]);
                // In Vendors portal, we focus only on "git projects" (products linked to a repo)
                const gitProjects = projRes.data.filter(p => !!p.github_repo_url);
                setProjects(gitProjects);
                setTeams(teamsRes.data);
            } catch (e) {
                console.error("Failed to fetch products.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
            toast.success("Product deleted successfully.");
        } catch (e) {
            toast.error("Failed to delete product.");
        }
    };

    const handleSync = async (slug) => {
        try {
            toast.success("Initiating GitHub Sync...");
            const res = await axios.post(`/api/projects/${slug}/sync-github`);
            toast.success(res.data.message || "Sync successful!");
            // Update local version if needed
            setProjects(projects.map(p => p.slug === slug ? {...p, version: res.data.version} : p));
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to sync from GitHub.");
        }
    };

    const categories = useMemo(() => ['ALL', ...new Set(projects.map(p => p.category).filter(Boolean))], [projects]);
    const filteredProjects = projects.filter(p => 
        (p.title.toLowerCase().includes(search.toLowerCase())) && 
        (activeCategory === 'ALL' || p.category === activeCategory)
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-purple-500/30 relative transition-colors duration-300 text-left">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
                                <Store className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight leading-none">Vendors / All Projects</h2>
                                <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mt-1">Manage all products and modules</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto gap-4">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-purple-500/50 w-full" />
                            </div>
                            <Link href={route('vendors.sell')} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all whitespace-nowrap border border-white/10">
                                <Plus className="mr-2 inline" size={14} /> New_Product
                            </Link>
                        </div>
                    </div>
                }
            >
                <Head title="Vendor Projects" />
                <div className="relative min-h-screen p-6 md:p-12 overflow-y-auto pb-32">
                    <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                        
                        {/* Control Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-2xl shadow-xl shadow-purple-500/5">
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-purple-500 text-white border-purple-500' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-main)]'}`}>{cat}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border)]">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-[var(--bg-main)] text-purple-500 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}><LayoutGrid size={16} /></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-[var(--bg-main)] text-purple-500 shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}><List size={16} /></button>
                            </div>
                        </div>

                        {/* Projects Content */}
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <div className="py-32 flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Loading Catalog...</span>
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="py-32 flex flex-col items-center justify-center border border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg-surface)]/50">
                                    <Database className="text-[var(--text-muted)] mb-4" size={48} strokeWidth={1} />
                                    <h3 className="text-xl font-black text-[var(--text-main)] mb-2">No Projects Found</h3>
                                    <p className="text-[var(--text-muted)] mb-6 text-sm">Create your first product to start monetizing on the marketplace.</p>
                                    <Link href={route('vendors.sell')} className="btn-primary bg-purple-500 text-white hover:bg-purple-600"><Plus className="mr-2 inline" size={14}/> List New Product</Link>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredProjects.map((project, idx) => (
                                        <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all shadow-xl shadow-purple-500/5 text-left flex flex-col">
                                            <div className="aspect-video bg-black relative border-b border-[var(--border)] overflow-hidden">
                                                <ProjectThumbnail project={project} />
                                                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
                                                    {project.category && <span className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-bold uppercase text-white tracking-widest">{project.category}</span>}
                                                </div>
                                                <div className="absolute top-3 right-3 flex gap-2 z-20">
                                                    {project.is_for_sale && <span className="px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-black border-emerald-400">Marketplace</span>}
                                                    <span className={`px-2 py-1 rounded-lg border text-[8px] font-bold uppercase tracking-widest ${project.is_public ? 'bg-purple-500/20 border-purple-500/30 text-purple-400 backdrop-blur-md' : 'bg-rose-500/20 border-rose-500/30 text-rose-400 backdrop-blur-md'}`}>{project.is_public ? 'Global' : 'Secure'}</span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <h3 className="text-lg font-black text-[var(--text-main)] tracking-tight group-hover:text-purple-500 transition-colors mb-2 line-clamp-1">{project.title}</h3>
                                                {project.is_for_sale && (
                                                    <div className="text-xl font-bold text-emerald-400 mb-4">${parseFloat(project.price).toFixed(2)}</div>
                                                )}
                                                {!project.is_for_sale && (
                                                    <div className="text-sm font-bold text-[var(--text-muted)] mb-4 italic">Not For Sale</div>
                                                )}
                                                <div className="mt-auto pt-4 flex gap-2 border-t border-[var(--border)]">
                                                    <a href={route('project.show', { slug: project.slug })} target="_blank" className="flex-1 px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-purple-500/50 hover:bg-purple-500/10 text-center rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-[var(--text-main)] flex items-center justify-center">
                                                        View <ArrowUpRight className="ml-1" size={12} />
                                                    </a>
                                                    <button onClick={() => handleSync(project.slug)} title="Pull latest from GitHub" className="p-2.5 bg-[var(--bg-elevated)] text-[var(--text-main)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg border border-[var(--border)] transition-all"><Database size={16}/></button>
                                                    <button onClick={() => setEditingProject(project)} className="p-2.5 bg-[var(--bg-elevated)] text-[var(--text-main)] hover:text-purple-500 hover:bg-purple-500/10 rounded-lg border border-[var(--border)] transition-all"><Settings size={16}/></button>
                                                    <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/10 transition-all"><Trash2 size={16}/></button>
                                                </div>
                                            </div>                                        
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[var(--bg-elevated)] text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] border-b border-[var(--border)]">
                                                <th className="px-6 py-5">Product Name</th>
                                                <th className="px-6 py-5">Category</th>
                                                <th className="px-6 py-5">Status</th>
                                                <th className="px-6 py-5">Price</th>
                                                <th className="px-6 py-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border)]">
                                            {filteredProjects.map((project) => (
                                                <tr key={project.id} className="hover:bg-[var(--bg-elevated)]/50 transition-colors group">
                                                    <td className="px-6 py-4 font-bold text-sm text-[var(--text-main)]">{project.title}</td>
                                                    <td className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{project.category || 'General'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${project.is_for_sale ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                                            {project.is_for_sale ? 'For Sale' : 'Private'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-emerald-400">
                                                        {project.is_for_sale ? `$${parseFloat(project.price).toFixed(2)}` : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <a href={route('project.show', { slug: project.slug })} target="_blank" className="p-2 text-[var(--text-muted)] hover:text-purple-500 hover:bg-purple-500/10 rounded transition-all"><ArrowUpRight size={16} /></a>
                                                            <button onClick={() => handleSync(project.slug)} title="Pull latest from GitHub" className="p-2 text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded transition-all"><Database size={16} /></button>
                                                            <button onClick={() => setEditingProject(project)} className="p-2 text-[var(--text-muted)] hover:text-purple-500 hover:bg-purple-500/10 rounded transition-all"><Settings size={16} /></button>
                                                            <button onClick={() => handleDelete(project.id)} className="p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded transition-all"><Trash2 size={16} /></button>
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
                        teams={teams} 
                        onClose={() => setEditingProject(null)} 
                        onUpdate={(upd) => setProjects(projects.map(p => p.id === upd.id ? upd : p))} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
