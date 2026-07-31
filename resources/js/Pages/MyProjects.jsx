import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Code2, ExternalLink, Trash2, Clock, 
    Database, Search, LayoutGrid, List,
    Share2, Check, Settings, Save, X, Activity, Briefcase, Bell
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

function ProjectSettingsModal({ project, teams, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
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
                is_public: !!Number(formData.is_public),
                is_for_sale: !!Number(formData.is_for_sale)
            });
            onUpdate(res.data);
            onClose();
        } catch (error) {} finally { setIsSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-elevated)]">
                    <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest italic flex items-center">
                        <Settings className="mr-3 text-cyan-500" size={16} /> Module Configuration
                    </h3>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar text-left">
                    <div className="bg-[var(--bg-elevated)] p-4 rounded border border-[var(--border)] flex justify-between items-center">
                        <div>
                            <span className="block text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest mb-1">Access Protocol</span>
                            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold">{formData.is_public ? 'Global Network' : 'Secure local'}</span>
                        </div>
                        <div className="flex bg-[var(--bg-main)] rounded p-1 border border-[var(--border)]">
                            <button type="button" onClick={() => setFormData({...formData, is_public: 1})} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${formData.is_public ? 'bg-cyan-500 text-white dark:text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Public</button>
                            <button type="button" onClick={() => setFormData({...formData, is_public: 0})} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!formData.is_public ? 'bg-rose-500 text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Private</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] border-b border-[var(--border)] pb-2">Categorization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Category</label>
                                <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-cyan-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Assign to Unit (Team)</label>
                                <select 
                                    value={formData.team_id} 
                                    onChange={(e) => setFormData({...formData, team_id: e.target.value})} 
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-cyan-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest appearance-none"
                                >
                                    <option value="">Personal Memory (No Team)</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Tags</label>
                                <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-cyan-500/50 focus:ring-0 text-[10px] font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                            <ShoppingBag size={14} /> Marketplace Settings
                        </h4>
                        
                        <div className="bg-[var(--bg-elevated)] p-4 rounded border border-[var(--border)] flex justify-between items-center mb-4">
                            <div>
                                <span className="block text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest mb-1">Sell Product</span>
                                <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold">List this on the Premium Marketplace</span>
                            </div>
                            <div className="flex bg-[var(--bg-main)] rounded p-1 border border-[var(--border)]">
                                <button type="button" onClick={() => setFormData({...formData, is_for_sale: 1})} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${formData.is_for_sale ? 'bg-emerald-500 text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Yes</button>
                                <button type="button" onClick={() => setFormData({...formData, is_for_sale: 0})} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!formData.is_for_sale ? 'bg-rose-500 text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>No</button>
                            </div>
                        </div>

                        {formData.is_for_sale ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Price (USD)</label>
                                    <input type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-emerald-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">GitHub Private Repo URL</label>
                                    <input type="url" placeholder="https://github.com/vendor/repo" value={formData.github_repo_url} onChange={(e) => setFormData({...formData, github_repo_url: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-emerald-500/50 focus:ring-0 text-[10px] font-bold" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <p className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest italic">
                                        Note: Buyers will automatically receive an RSA signed license key and a direct download of your GitHub repo zipball upon successful payment via Stripe/Razorpay.
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="pt-4 flex justify-end sticky bottom-0 bg-[var(--bg-surface)] py-4 border-t border-[var(--border)]">
                        <button type="submit" disabled={isSaving} className="btn-primary w-full md:w-auto">
                            {isSaving ? <Activity className="animate-spin mr-2 inline" size={14} /> : <Save className="mr-2 inline" size={14} />} Save_Configuration
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

function AccessRequestsModal({ onClose }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/projects/access-requests');
            setRequests(res.data);
        } catch (e) {
            toast.error('Failed to load requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.post(`/api/projects/access-requests/${id}/${action}`);
            toast.success(`Request ${action}d successfully.`);
            setRequests(requests.filter(r => r.id !== id));
        } catch (e) {
            toast.error(`Failed to ${action} request.`);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-elevated)]">
                    <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest italic flex items-center">
                        <Bell className="mr-3 text-cyan-500" size={16} /> Access Requests
                    </h3>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {loading ? (
                        <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>
                    ) : requests.length === 0 ? (
                        <div className="text-center p-8 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">No pending requests.</div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req.id} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="text-sm font-black text-[var(--text-main)] uppercase italic tracking-tighter">{req.project.title}</div>
                                        <div className="text-[10px] text-[var(--text-muted)] font-bold">Requested by: <span className="text-cyan-500">{req.user.name}</span></div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button onClick={() => handleAction(req.id, 'approve')} className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded text-[10px] font-black uppercase tracking-widest transition-all">Approve</button>
                                        <button onClick={() => handleAction(req.id, 'reject')} className="flex-1 md:flex-none px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded text-[10px] font-black uppercase tracking-widest transition-all">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function MyProjects() {
    const { auth } = usePage().props;
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [activeTeam, setActiveTeam] = useState('ALL');
    const [viewMode, setViewMode] = useState('grid');
    const [editingProject, setEditingProject] = useState(null);
    const [copyStatus, setCopyStatus] = useState(null);
    const [showRequestsModal, setShowRequestsModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, teamsRes] = await Promise.all([
                    axios.get('/api/projects'),
                    axios.get('/api/teams-list')
                ]);
                setProjects(projRes.data);
                setTeams(teamsRes.data);
            } catch (e) {
                console.error("Failed to fetch archives.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleShare = (slug) => {
        navigator.clipboard.writeText(`${window.location.origin}/editor/${slug}`);
        setCopyStatus(slug);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    const handleDelete = async (id) => {
        if (!confirm('Destroy module?')) return;
        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (e) {}
    };

    const categories = useMemo(() => ['ALL', ...new Set(projects.map(p => p.category).filter(Boolean))], [projects]);
    const filteredProjects = projects.filter(p => 
        (p.title.toLowerCase().includes(search.toLowerCase())) && 
        (activeCategory === 'ALL' || p.category === activeCategory) &&
        (activeTeam === 'ALL' || (activeTeam === 'PERSONAL' ? !p.team_id : p.team_id == activeTeam))
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 relative transition-colors duration-300 text-left">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded"><Database className="text-cyan-500" size={20} /></div>
                            <div><h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">Archives</h2><p className="text-[8px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1">Personal Memory Blocks</p></div>
                        </div>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto gap-4">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                                <input type="text" placeholder="Filter_Data..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-cyan-500/50 w-full" />
                            </div>
                            <button onClick={() => setShowRequestsModal(true)} className="btn-secondary whitespace-nowrap"><Bell className="mr-2 inline" size={14} /> Requests</button>
                            <Link href={route('editor')} className="btn-primary whitespace-nowrap"><Plus className="mr-2 inline" size={14} /> New_Module</Link>
                        </div>
                    </div>
                }
            >
                <Head title="My Neural Archives" />
                <div className="relative min-h-screen p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-7xl mx-auto relative z-10 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-lg shadow-xl">
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-cyan-500 text-white dark:text-black border-cyan-500' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-main)]'}`}>{cat}</button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
                                    <button onClick={() => setActiveTeam('ALL')} className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all border ${activeTeam === 'ALL' ? 'bg-purple-500 text-white border-purple-500' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-main)]'}`}>All Units</button>
                                    <button onClick={() => setActiveTeam('PERSONAL')} className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all border ${activeTeam === 'PERSONAL' ? 'bg-cyan-500 text-white dark:text-black border-cyan-500' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-main)]'}`}>Personal</button>
                                    {teams.map(team => (
                                        <button key={team.id} onClick={() => setActiveTeam(team.id)} className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all border ${activeTeam == team.id ? 'bg-purple-500 text-white border-purple-500' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-main)]'}`}>{team.name}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex bg-[var(--bg-elevated)] p-1 rounded border border-[var(--border)]">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)]'}`}><LayoutGrid size={16} /></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)]'}`}><List size={16} /></button>
                            </div>
                        </div>
                        <AnimatePresence mode="wait">
                            {isLoading ? <div className="py-48 flex flex-col items-center gap-4"><div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div><span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Scanning...</span></div>
                            : viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredProjects.map((project, idx) => (
                                        <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-cyan-500/30 transition-all shadow-lg text-left">
                                            <div className="aspect-video bg-black relative border-b border-[var(--border)] overflow-hidden">
                                                <ProjectThumbnail project={project} />
                                                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
                                                    {project.category && <span className="px-2 py-0.5 bg-black/60 border border-white/10 rounded text-[8px] font-bold uppercase text-cyan-400 tracking-widest">{project.category}</span>}
                                                    {project.team && <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-[8px] font-black uppercase text-purple-400 tracking-widest">{project.team.name}</span>}
                                                </div>
                                                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-widest z-20 ${project.is_public ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>{project.is_public ? 'Global' : 'Secure'}</div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-lg font-black text-[var(--text-main)] uppercase italic tracking-tight group-hover:text-cyan-500 transition-colors mb-6 truncate">{project.title}</h3>
                                                <div className="flex gap-2">
                                                    <Link href={route('editor', { slug: project.slug })} className="flex-1 btn-primary text-center">Open</Link>
                                                    <button onClick={() => setEditingProject(project)} className="p-2.5 bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded border border-[var(--border)] transition-all"><Settings size={14}/></button>
                                                    <button onClick={() => handleDelete(project.id)} className="p-2.5 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white rounded border border-rose-500/10 transition-all"><Trash2 size={14}/></button>
                                                </div>
                                            </div>                                        
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg overflow-hidden shadow-xl">
                                    <table className="w-full text-left">
                                        <thead><tr className="bg-[var(--bg-elevated)] text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] border-b border-[var(--border)]"><th className="px-6 py-4">Module</th><th className="px-6 py-4">Sector</th><th className="px-6 py-4">Sync</th><th className="px-6 py-4 text-right">Uplink</th></tr></thead>
                                        <tbody className="divide-y divide-[var(--border)]">
                                            {filteredProjects.map((project) => (
                                                <tr key={project.id} className="hover:bg-[var(--bg-elevated)] transition-colors"><td className="px-6 py-4 font-bold uppercase italic text-sm text-[var(--text-main)]">{project.title}</td><td className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)]">{project.category || 'General'}</td><td className="px-6 py-4"><span className={`text-[9px] font-bold uppercase ${project.is_public ? 'text-cyan-500' : 'text-rose-500'}`}>{project.is_public ? 'Global' : 'Secure'}</span></td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><Link href={route('editor', { slug: project.slug })} className="p-1.5 hover:text-cyan-500 transition-colors"><ExternalLink size={14} /></Link><button onClick={() => setEditingProject(project)} className="p-1.5 hover:text-[var(--text-main)] transition-colors"><Settings size={14} /></button><button onClick={() => handleDelete(project.id)} className="p-1.5 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button></div></td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </AuthenticatedLayout>
            <AnimatePresence>{editingProject && <ProjectSettingsModal project={editingProject} teams={teams} onClose={() => setEditingProject(null)} onUpdate={(upd) => setProjects(projects.map(p => p.id === upd.id ? upd : p))} />}</AnimatePresence>
            <AnimatePresence>{showRequestsModal && <AccessRequestsModal onClose={() => setShowRequestsModal(false)} />}</AnimatePresence>
        </div>
    );
}