import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Database, ShoppingBag, User, Activity, 
    ExternalLink, Trash2, Globe, Lock, DollarSign, 
    CreditCard, Code2, Edit, CheckCircle2, LayoutDashboard,
    Search, Download, Share2, Shield, Fingerprint, Zap, Key, BadgeCheck, Plus
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import UserLevelBadge from '@/Components/Visuals/UserLevelBadge';
import { useToast } from '@/Components/Toast/ToastProvider';
import UpdatePasswordForm from './Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Profile/Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Profile/Partials/DeleteUserForm';
import IdentityVerificationForm from './Profile/Partials/IdentityVerificationForm';

export default function MyAccount({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const toast = useToast();
    
    const [projects, setProjects] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Filters
    const [projectSearch, setProjectSearch] = useState('');
    const [purchaseSearch, setPurchaseSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, purRes] = await Promise.all([
                    axios.get('/api/projects'),
                    axios.get('/api/purchases/my-purchases').catch(() => ({ data: [] }))
                ]);
                setProjects(projRes.data);
                setPurchases(purRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Connection failed. Could not sync user data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
            toast.success('Project successfully deleted.');
        } catch (error) {
            toast.error('Failed to delete project.');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard.');
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
            case 'paid-user': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
            default: return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
        }
    };

    const sidebarTabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'projects', label: 'My Projects', icon: Database },
        { id: 'purchases', label: 'My Purchases', icon: ShoppingBag },
        { id: 'profile', label: 'Profile Details', icon: Fingerprint },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(projectSearch.toLowerCase()));
    const filteredPurchases = purchases.filter(p => (p.project?.title || '').toLowerCase().includes(purchaseSearch.toLowerCase()));

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-300">
            <ProBackground />
            
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 relative z-10">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded shadow-sm relative group cursor-pointer overflow-hidden">
                                <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <User className="text-cyan-500 relative z-10" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none tracking-tight">My Account</h2>
                                <p className="text-[8px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>
                }
            >
                <Head title="Account Root" />
                
                <div className="relative flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto relative z-10 text-left flex flex-col lg:flex-row gap-8 lg:gap-12">
                        
                        {/* Sidebar Navigation */}
                        <div className="w-full lg:w-72 shrink-0 space-y-3 flex flex-col">
                            {/* Profile Mini-Card in Sidebar */}
                            <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 mb-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-cyan-500/50 transition-colors shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-colors"></div>
                                <div className="w-20 h-20 bg-gradient-to-tr from-[var(--bg-main)] to-[var(--bg-surface)] border-2 border-cyan-500/30 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6 relative z-10">
                                    <span className="text-3xl font-black text-cyan-500">{auth.user.name.charAt(0)}</span>
                                </div>
                                <h3 className="text-base font-black uppercase tracking-widest text-[var(--text-main)] italic truncate w-full relative z-10 flex items-center justify-center gap-2">
                                    {auth.user.name}
                                    {auth.user.identity_status === 'verified' && (
                                        <BadgeCheck className="text-emerald-500 shrink-0" size={16} title="Verified Identity" />
                                    )}
                                </h3>
                                <p className="text-[10px] text-[var(--text-muted)] font-mono truncate w-full mb-4 relative z-10">{auth.user.email}</p>
                                
                                <div className="flex flex-wrap justify-center gap-2 w-full relative z-10">
                                    <span className={`px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md ${getRoleColor(auth.user.role)}`}>
                                        {auth.user.role}
                                    </span>
                                    <UserLevelBadge level={auth.user.level || 1} size="sm" />
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            {sidebarTabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-4 w-full p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${
                                            isActive 
                                                ? 'text-black shadow-lg shadow-cyan-500/20 translate-x-2 border-transparent' 
                                                : 'bg-[var(--bg-surface)]/50 backdrop-blur-md border border-[var(--border)] text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/30'
                                        }`}
                                    >
                                        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"></div>}
                                        <Icon size={18} className="relative z-10" /> 
                                        <span className="relative z-10">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                {/* OVERVIEW TAB */}
                                {activeTab === 'overview' && (
                                    <motion.div 
                                        key="overview"
                                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                            {[
                                                { label: 'Total Projects', val: projects.length, icon: Database, color: 'text-cyan-500', bg: 'bg-cyan-500/5' },
                                                { label: 'Purchases', val: purchases.length, icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                                                { label: 'Premium Projects', val: projects.filter(p => p.is_for_sale).length, icon: DollarSign, color: 'text-rose-500', bg: 'bg-rose-500/5' },
                                                { label: 'Total Spent', val: `$${purchases.reduce((acc, p) => acc + parseFloat(p.amount), 0).toFixed(2)}`, icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/5' }
                                            ].map((s, i) => (
                                                <div key={i} className={`bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] p-6 rounded-3xl hover:border-${s.color.split('-')[1]}-500/30 transition-all duration-300 shadow-xl text-left group overflow-hidden relative`}>
                                                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${s.bg}`}></div>
                                                    <s.icon className={`${s.color} mb-6 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10`} size={28} />
                                                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 relative z-10">{s.label}</div>
                                                    <div className="text-3xl font-black text-[var(--text-main)] tracking-tighter italic relative z-10">{s.val}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                            <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl rounded-3xl border border-[var(--border)] p-8 space-y-6 shadow-2xl">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                                                    <Zap className="text-amber-500" size={20} />
                                                    <h4 className="text-sm font-black uppercase text-[var(--text-main)] italic tracking-widest">Recent Projects</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    {projects.slice(0, 4).map((p, i) => (
                                                        <div key={i} className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] hover:border-cyan-500/30 transition-colors group">
                                                            <div className="min-w-0 pr-4">
                                                                <span className="text-sm font-black truncate block text-[var(--text-main)] italic">{p.title}</span>
                                                                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">{new Date(p.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <Link href={route('editor', p.slug)} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-surface)] rounded-xl text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors shrink-0">
                                                                <ExternalLink size={16}/>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                    {projects.length === 0 && <span className="text-xs text-[var(--text-muted)] block p-4 text-center">No projects found.</span>}
                                                </div>
                                            </div>

                                            <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl rounded-3xl border border-[var(--border)] p-8 space-y-6 shadow-2xl">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                                                    <CreditCard className="text-emerald-500" size={20} />
                                                    <h4 className="text-sm font-black uppercase text-[var(--text-main)] italic tracking-widest">Recent Purchases</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    {purchases.slice(0, 4).map((p, i) => (
                                                        <div key={i} className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] hover:border-emerald-500/30 transition-colors group">
                                                            <div className="min-w-0 pr-4">
                                                                <span className="text-sm font-black truncate block text-[var(--text-main)] italic">{p.project?.title || 'Unknown Project'}</span>
                                                                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">${p.amount} • {p.payment_method}</span>
                                                            </div>
                                                            <Link href={route('editor', p.project?.slug)} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-surface)] rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors shrink-0">
                                                                <ExternalLink size={16}/>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                    {purchases.length === 0 && <span className="text-xs text-[var(--text-muted)] block p-4 text-center">No purchases found.</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* PROJECTS TAB */}
                                {activeTab === 'projects' && (
                                    <motion.div 
                                        key="projects"
                                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 shadow-2xl">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-[var(--border)] pb-8">
                                                <h3 className="text-xl font-black uppercase tracking-widest italic text-[var(--text-main)]">All Projects</h3>
                                                <div className="flex gap-4 w-full md:w-auto">
                                                    <div className="relative flex-1 md:w-64">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Search projects..." 
                                                            value={projectSearch}
                                                            onChange={(e) => setProjectSearch(e.target.value)}
                                                            className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:uppercase placeholder:tracking-widest"
                                                        />
                                                    </div>
                                                    <Link href={route('editor')} className="btn-primary text-xs py-3 px-6 rounded-xl flex items-center gap-2 whitespace-nowrap">
                                                        <Plus size={16}/> Create
                                                    </Link>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {filteredProjects.map((project) => (
                                                    <div key={project.id} className="group bg-[var(--bg-main)] border border-[var(--border)] p-6 flex flex-col justify-between gap-6 rounded-2xl hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-cyan-500/10">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 shrink-0 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                                                                <Code2 size={24} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-base font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate">{project.title}</h4>
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${project.is_public ? 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10' : 'text-rose-500 border-rose-500/30 bg-rose-500/10'}`}>
                                                                        {project.is_public ? 'Public' : 'Private'}
                                                                    </span>
                                                                    {project.is_for_sale && (
                                                                        <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-500 border border-amber-500/30 bg-amber-500/10 rounded-lg">
                                                                            Market (${project.price})
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
                                                            <Link href={route('editor', project.slug)} className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-cyan-500/10 text-cyan-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all">
                                                                <Edit size={14} /> Open Editor
                                                            </Link>
                                                            {project.is_public && (
                                                                <button onClick={() => copyToClipboard(route('project.show', project.slug))} className="px-4 py-2.5 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border)] rounded-xl hover:border-blue-500/50 hover:text-blue-500 transition-all" title="Copy Public Link">
                                                                    <Share2 size={14} />
                                                                </button>
                                                            )}
                                                            <button onClick={() => handleDelete(project.id)} className="px-4 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {filteredProjects.length === 0 && (
                                                    <div className="col-span-full text-center p-12 border-2 border-dashed border-[var(--border)] rounded-3xl text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-4">
                                                        <Database size={32} className="opacity-20"/>
                                                        No matching projects found.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* PURCHASES TAB */}
                                {activeTab === 'purchases' && (
                                    <motion.div 
                                        key="purchases"
                                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl">
                                            <div className="p-8 border-b border-[var(--border)] flex flex-col md:flex-row justify-between md:items-center gap-6">
                                                <h3 className="text-xl font-black uppercase tracking-widest italic text-[var(--text-main)]">Payment History</h3>
                                                <div className="relative w-full md:w-64">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search transactions..." 
                                                        value={purchaseSearch}
                                                        onChange={(e) => setPurchaseSearch(e.target.value)}
                                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:uppercase placeholder:tracking-widest"
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse min-w-[800px]">
                                                    <thead>
                                                        <tr className="border-b border-[var(--border)] bg-black/40">
                                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Project Name</th>
                                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Amount</th>
                                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Payment Method</th>
                                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Date</th>
                                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredPurchases.map(p => (
                                                            <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-emerald-500/5 transition-colors group">
                                                                <td className="px-8 py-6">
                                                                    <div className="font-bold text-sm text-[var(--text-main)] italic uppercase">{p.project?.title || 'Unknown Project'}</div>
                                                                    <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">ID: {p.id}</div>
                                                                </td>
                                                                <td className="px-8 py-6 font-mono text-emerald-500 font-bold text-lg">${p.amount}</td>
                                                                <td className="px-8 py-6">
                                                                    <span className="px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] group-hover:border-emerald-500/30 transition-colors">
                                                                        {p.payment_method}
                                                                    </span>
                                                                </td>
                                                                <td className="px-8 py-6 text-xs text-[var(--text-muted)] font-mono">{new Date(p.created_at).toLocaleString()}</td>
                                                                <td className="px-8 py-6 text-right">
                                                                    {p.project ? (
                                                                        <Link href={route('editor', p.project.slug)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all shadow-lg shadow-emerald-500/10">
                                                                            <Download size={14} /> Open
                                                                        </Link>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-2 px-4 py-2 text-[10px] text-rose-500 uppercase font-bold tracking-widest bg-rose-500/10 rounded-xl">
                                                                            <Lock size={12}/> Offline
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {filteredPurchases.length === 0 && (
                                                            <tr>
                                                                <td colSpan="5" className="p-16 text-center text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <ShoppingBag size={32} className="opacity-20"/>
                                                                        No purchases found.
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* PROFILE TAB */}
                                {activeTab === 'profile' && (
                                    <motion.div 
                                        key="profile"
                                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl">
                                            <div className="max-w-xl">
                                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)] mb-2">Profile Details</h3>
                                                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10">Update your profile information and email address.</p>
                                                
                                                <UpdateProfileInformationForm
                                                    mustVerifyEmail={mustVerifyEmail}
                                                    status={status}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl">
                                            <div className="max-w-xl">
                                                <IdentityVerificationForm className="w-full" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* SECURITY TAB */}
                                {activeTab === 'security' && (
                                    <motion.div 
                                        key="security"
                                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl">
                                            <div className="max-w-xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Key size={24} className="text-amber-500" />
                                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)]">Change Password</h3>
                                                </div>
                                                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10">Ensure your account uses a long, random password to stay secure.</p>
                                                
                                                <UpdatePasswordForm className="w-full" />
                                            </div>
                                        </div>

                                        <div className="bg-rose-500/5 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-3xl rounded-full pointer-events-none"></div>
                                            <div className="max-w-xl relative z-10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Shield size={24} className="text-rose-500" />
                                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-rose-500">Delete Account</h3>
                                                </div>
                                                <p className="text-xs font-bold text-rose-500/70 uppercase tracking-widest mb-10">Permanently delete your account and all data.</p>
                                                
                                                <DeleteUserForm className="w-full" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
