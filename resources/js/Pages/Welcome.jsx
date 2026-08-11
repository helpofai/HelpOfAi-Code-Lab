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

import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code2, Globe, ArrowRight, Zap, 
    ChevronRight, Binary, Database, Cpu,
    Layers, Share2, Server, Github, Shield,
    User, Clock, Box, Rocket, Monitor, Workflow,
    CheckCircle2, AppWindow, Command, Braces,
    Layout, Smartphone, Terminal, Eye, Sparkles, Lock,
    Activity, Heart, Tag, ShoppingBag, Search, Quote
} from 'lucide-react';
import axios from 'axios';
import PublicLayout from '@/Layouts/PublicLayout';
import AdUnit from '@/Components/AdUnit';
import { useToast } from '@/Components/Toast/ToastProvider';
import useProjectStore, { DEFAULT_TEMPLATE } from '@/Stores/useProjectStore';
import MonacoWrapper from '@/Components/Editor/MonacoWrapper';
import ProjectPreviewContent from '@/Components/ProjectPreviewContent';
import PaymentModal from '@/Components/Modals/PaymentModal';

// Fully Functional "Neural_Sandbox" Editor for the Home Page
const HomeEditor = () => {
    const [html, setHtml] = useState(DEFAULT_TEMPLATE.html);
    
    const [css, setCss] = useState(DEFAULT_TEMPLATE.css);

    const [js, setJs] = useState(DEFAULT_TEMPLATE.js);
    const [activeTab, setActiveTab] = useState('html');
    const [previewContent, setPreviewContent] = useState('');
    const [logs, setLogs] = useState([]);

    const compile = async () => {
        let compiledCss = css;
        let compiledJs = js;

        // Simplified compiler logic for the home page sandbox
        if (window.Sass && (css.includes('$') || css.includes('{'))) {
            window.Sass.compile(css, (result) => {
                if (result.text) compiledCss = result.text;
            });
        }

        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { background: #050505; color: white; margin: 0; padding: 0; min-height: 100vh; display: flex; flex-direction: column; }
                    ${compiledCss}
                </style>
                <script>
                    console.log = (...args) => {
                        window.parent.postMessage({ type: 'LOG', content: args.join(' ') }, '*');
                    };
                </script>
            </head>
            <body>${html}<script>${compiledJs}</script></body>
            </html>
        `;
        setPreviewContent(content);
    };

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data.type === 'LOG') {
                setLogs(prev => [...prev, e.data.content].slice(-3));
            }
        };
        window.addEventListener('message', handleMessage);
        const timeout = setTimeout(compile, 800);
        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timeout);
        };
    }, [html, css, js]);

    return (
        <div className="relative group max-w-6xl mx-auto text-left">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-[2.5rem] blur-3xl opacity-50"></div>
            <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
                
                {/* Header / Tabs */}
                <div className="h-14 bg-[var(--bg-main)] border-b border-[var(--border)] flex items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <div className="flex gap-1.5 mr-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                        </div>
                        <div className="flex gap-2">
                            {['html', 'css', 'js'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab 
                                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                                        : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded-full">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase text-emerald-500/80 tracking-widest">Live_Sandbox</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-[600px] lg:min-h-0 lg:h-[500px]">
                    {/* Editor Side */}
                    <div className="relative border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[#050505] h-[300px] lg:h-full">
                        <div className="h-full pt-2">
                            <MonacoWrapper 
                                language={activeTab} 
                                value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
                                onChange={(val) => {
                                    if (activeTab === 'html') setHtml(val);
                                    else if (activeTab === 'css') setCss(val);
                                    else setJs(val);
                                }}
                                fontSize={13}
                            />
                        </div>
                        
                        {/* Mini Console Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                            <AnimatePresence>
                                {logs.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl space-y-1"
                                    >
                                        {logs.map((log, i) => (
                                            <div key={i} className="text-[9px] font-mono text-cyan-500 flex gap-2">
                                                <span className="opacity-30">[{new Date().toLocaleTimeString([], {hour12: false, minute:'2-digit', second: '2-digit'})}]</span>
                                                <span className="truncate">{log}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Preview Side */}
                    <div className="bg-white relative overflow-hidden h-[300px] lg:h-full">
                        <iframe 
                            srcDoc={previewContent} 
                            className="w-full h-full border-none" 
                            title="sandbox-preview"
                            sandbox="allow-scripts"
                        />
                        {/* Overlay Branding */}
                        <div className="absolute top-4 right-4 pointer-events-none opacity-10">
                            <Code2 size={100} className="text-black" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



const ProjectPreview = ({ project }) => {
    const targetRoute = project.is_for_sale ? route('project.show', { slug: project.slug }) : route('editor', { slug: project.slug });
    return (
        <Link href={targetRoute} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 block shadow-xl">
            <div className="aspect-video bg-white relative overflow-hidden">
                <ProjectPreviewContent project={project} />
            </div>
            <div className="p-6 space-y-4 text-left">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate">{project.title}</h3>
                    <div className="px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border)] text-[8px] font-black uppercase tracking-widest text-cyan-500">{project.settings?.preprocessors?.js || 'js'}</div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                    <span className="flex items-center gap-1 uppercase font-bold"><User size={10} className="text-cyan-500/40" /> {project.user?.name || 'Unknown'}</span>
                    <span className="flex items-center gap-1 uppercase font-bold"><Clock size={10} className="text-cyan-500/40" /> {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                {project.is_for_sale && (
                    <div className="pt-4 mt-4 border-t border-[var(--border)] flex justify-between items-center">
                        <span className="text-lg font-black text-cyan-500 font-mono tracking-tighter">${project.price}</span>
                        <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 font-black text-[10px] uppercase tracking-widest rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                            <Zap size={12} className="fill-current" /> View Details
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default function Welcome({ auth, siteSettings, app_version }) {
    const [featured, setFeatured] = useState([]);
    const [paidProjects, setPaidProjects] = useState([]);
    const [privateProjects, setPrivateProjects] = useState([]);
    const [globalStats, setGlobalStats] = useState({ projects: 0, users: 0, public_projects: 0 });
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const toast = useToast();
    const { globalAds } = usePage().props;

    useEffect(() => {
        // Load Compilers for Dynamic Previews
        if (!window.Babel) {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
            document.head.appendChild(script);
        }
        if (!window.Sass) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js";
            document.head.appendChild(script);
        }

        axios.get('/api/explore/featured').then(res => setFeatured(res.data));
        axios.get('/api/explore/paid').then(res => setPaidProjects(res.data));
        axios.get('/api/explore/private').then(res => setPrivateProjects(res.data));
        axios.get('/api/explore/stats').then(res => setGlobalStats(res.data));
    }, []);

    const getSetting = (key, defaultVal) => siteSettings?.[key] || defaultVal;

    const handleBuy = (project) => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }
        window.location.href = route('checkout.project', { project: project.slug });
    };

    const handleUpgrade = async () => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        if (auth.user.role === 'paid-user' || auth.user.role === 'admin') {
            try {
                const res = await axios.post('/api/subscription/portal');
                if (res.data.url) window.location.href = res.data.url;
            } catch (e) {
                toast.error('Failed to communicate with billing node.');
            }
        } else {
            setIsPaymentModalOpen(true);
        }
    };

    return (
        <PublicLayout>
            <Head>
                <title>{getSetting('seo_meta_title', 'HOACodeLab // Technical Prototyping Node')}</title>
                <meta name="description" content={getSetting('seo_meta_description', 'High-performance cloud editor for modern web developers.')} />
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            </Head>

            <section className="pt-48 pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/10 rounded-full mb-10">
                            <Sparkles size={12} className="text-cyan-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">
                                {app_version ? `v${app_version} Stable Build` : 'Stable Build'}
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-[0.8] mb-12">Modern <br/> <span className="text-[var(--text-muted)]">Code Editor</span></h1>
                        <p className="text-[var(--text-muted)] text-sm md:text-lg max-w-2xl mx-auto font-bold uppercase tracking-[0.3em] leading-relaxed mb-12 opacity-80 italic">High-performance development substrate for modern web creators.</p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                            <Link href={route('register')} className="px-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 group">
                                <Rocket size={16} className="group-hover:-translate-y-1 transition-transform" /> Start Coding Free
                            </Link>
                            <Link href={route('public.search')} className="px-8 py-4 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border)] font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:border-cyan-500 hover:text-cyan-500 transition-all flex items-center gap-2 group">
                                <Search size={16} className="group-hover:scale-110 transition-transform" /> Browse Directory
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1 }}>
                        <HomeEditor />
                    </motion.div>
                </div>
            </section>

            <section className="py-16 border-y border-[var(--border)] bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-left">
                    {[
                        { l: 'Active Users', v: globalStats.users, i: User },
                        { l: 'Projects Created', v: globalStats.projects, i: Database },
                        { l: 'Uptime', v: '99.9%', i: Shield },
                        { l: 'Performance', v: '0.04ms', i: Zap }
                    ].map((s, i) => (
                        <div key={i} className={`flex flex-col gap-2 md:border-l border-[var(--border)] md:pl-8 ${i % 2 !== 0 ? 'border-l pl-8' : ''} ${i > 1 ? 'mt-8 md:mt-0' : ''} md:first:border-0 md:first:pl-0`}>
                            <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] flex items-center gap-3"><s.i size={14} className="text-cyan-500/40" /> {s.l}</div>
                            <div className="text-3xl font-black text-[var(--text-main)] tracking-tighter italic">{s.v}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-32 px-6 border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                        <div className="space-y-2 text-left">
                            <div className="flex items-center gap-2 text-cyan-500"><Activity size={16} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Feed</span></div>
                            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Featured Projects</h2>
                        </div>
                        <Link href={route('public.categories.index')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-cyan-500 transition-colors group">
                            View Categories <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featured.length > 0 ? featured.slice(0, 3).map((project, idx) => (
                            <React.Fragment key={project.id}>
                                <ProjectPreview project={project} />
                                {idx === 0 && globalAds?.in_feed && (
                                    <div className="md:col-span-3 my-8">
                                        {globalAds.in_feed.map(ad => <AdUnit key={ad.id} ad={ad} />)}
                                    </div>
                                )}
                            </React.Fragment>
                        )) : [1, 2, 3].map((i) => (
                            <div key={i} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
                                <div className="aspect-video bg-[var(--bg-elevated)]" />
                                <div className="p-6 space-y-4"><div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" /><div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marketplace Section */}
            {paidProjects.length > 0 && (
                <section className="py-32 px-6 border-b border-[var(--border)] bg-cyan-500/[0.02]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                            <div className="space-y-2 text-left">
                                <div className="flex items-center gap-2 text-cyan-500"><Tag size={16} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Marketplace</span></div>
                                <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Premium Modules</h2>
                            </div>
                            <Link href={route('public.search')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-cyan-500 transition-colors group">
                                Browse Marketplace <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {paidProjects.map((project) => (
                                <div key={project.id} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-xl flex flex-col">
                                    <div className="aspect-video bg-white relative overflow-hidden">
                                        <ProjectPreviewContent project={project} />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30">
                                            ${project.price}
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4 text-left flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate">{project.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                                            <span className="flex items-center gap-1 uppercase font-bold"><User size={10} className="text-cyan-500/40" /> {project.user?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="pt-4 mt-auto">
                                            <button 
                                                onClick={() => handleBuy(project)}
                                                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2"
                                            >
                                                <ShoppingBag size={14} /> Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- AD UNITS --- */}
            <section className="py-12 bg-[var(--bg-surface)]">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(globalAds) && globalAds.filter(a => a.is_active).slice(0, 3).map((ad, index) => (
                        <div key={`welcome-ad-${index}`} className="bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[250px]">
                            <div className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-4">Sponsored Content</div>
                            <AdUnit ad={ad} />
                        </div>
                    ))}
                </div>
            </section>
            {/* --- END AD UNITS --- */}

            {/* Private Projects Section */}
            {privateProjects.length > 0 && (
                <section className="py-32 px-6 border-b border-[var(--border)] bg-[var(--bg-main)]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-16">
                            <div className="space-y-2 text-left">
                                <div className="flex items-center gap-2 text-rose-500"><Lock size={16} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Restricted</span></div>
                                <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Private Projects</h2>
                                <p className="text-sm text-[var(--text-muted)] mt-2">Code view is restricted for these projects.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {privateProjects.map((project) => (
                                <Link href={route('project.show', project.slug)} key={project.id} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-rose-500/30 transition-all hover:-translate-y-1 shadow-xl flex flex-col">
                                    <div className="aspect-video bg-white relative overflow-hidden">
                                        <ProjectPreviewContent project={project} />
                                        <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] z-20 pointer-events-none flex items-center justify-center">
                                            <Lock className="text-rose-500/50 w-16 h-16" />
                                        </div>
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30">
                                            Restricted
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4 text-left flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate">{project.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                                            <span className="flex items-center gap-1 uppercase font-bold"><User size={10} className="text-rose-500/40" /> {project.user?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="pt-4 mt-auto">
                                            <div className="w-full py-3 bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-rose-500 border border-[var(--border)] group-hover:border-rose-500/50 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2">
                                                <Eye size={14} /> View Restricted Project
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Supported Tech Section */}
            <section className="py-24 px-6 border-y border-[var(--border)] bg-[#050505] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 backdrop-blur-3xl" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                        <div className="flex flex-col items-center gap-4 hover:text-cyan-500 transition-colors cursor-default"><Layout size={40} /> <span className="text-[10px] font-black uppercase tracking-widest">HTML5</span></div>
                        <div className="flex flex-col items-center gap-4 hover:text-blue-500 transition-colors cursor-default"><AppWindow size={40} /> <span className="text-[10px] font-black uppercase tracking-widest">CSS3</span></div>
                        <div className="flex flex-col items-center gap-4 hover:text-yellow-500 transition-colors cursor-default"><Braces size={40} /> <span className="text-[10px] font-black uppercase tracking-widest">JavaScript</span></div>
                        <div className="flex flex-col items-center gap-4 hover:text-pink-500 transition-colors cursor-default"><Terminal size={40} /> <span className="text-[10px] font-black uppercase tracking-widest">Sass/SCSS</span></div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-32 px-6 bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">How It Works</h2>
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em]">Build. Publish. Monetize.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Code', desc: 'Use our lightning-fast browser editor to build UI components with HTML, CSS, and JS.', icon: Code2 },
                            { step: '02', title: 'Preview', desc: 'Watch your code compile in real-time with our neural sandbox instance.', icon: Monitor },
                            { step: '03', title: 'Publish', desc: 'Share your work publicly or restrict access for premium users only.', icon: Share2 },
                            { step: '04', title: 'Monetize', desc: 'Set a price or lock your code behind ads to earn from your creations.', icon: ShoppingBag }
                        ].map((s, i) => (
                            <div key={i} className="relative group p-8 bg-[var(--bg-main)] border border-[var(--border)] rounded-3xl hover:border-cyan-500/30 transition-all hover:-translate-y-2 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <s.icon size={100} className="text-cyan-500" />
                                </div>
                                <div className="text-6xl font-black text-white/5 mb-6 italic tracking-tighter group-hover:text-cyan-500/10 transition-colors">{s.step}</div>
                                <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter mb-4 relative z-10">{s.title}</h3>
                                <p className="text-[var(--text-muted)] text-xs font-bold leading-relaxed relative z-10">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="py-48 px-6 bg-[var(--bg-main)] text-left">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                    {[
                        { t: 'Cloud Based', d: 'Every line of code executed securely in your neural browser instance.', i: Globe },
                        { t: 'Instant Sync', d: 'Changes reflected instantly. Pixel-perfect rendering.', i: Zap },
                        { t: 'Secure Storage', d: 'Encrypted storage for your modules.', i: Lock }
                    ].map((p, i) => (
                        <div key={i} className="space-y-8 group">
                            <div className="w-16 h-1 bg-[var(--border)] group-hover:w-24 group-hover:bg-cyan-500 transition-all duration-500" />
                            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-fit"><p.i className="text-cyan-500" size={32} /></div>
                            <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">{p.t}</h3>
                            <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest leading-loose italic">{p.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 px-6 border-y border-[var(--border)] bg-[var(--bg-main)] overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Trusted By Creators</h2>
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em]">Join the ecosystem.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Alex Rivera', role: 'Frontend Engineer', text: 'HOACodeLab completely changed how I rapidly prototype UI components. The live sandbox is incredibly responsive.' },
                            { name: 'Sarah Chen', role: 'UI Designer', text: 'I use the premium marketplace to sell my HTML/CSS templates. The monetization integration is flawless and secure.' },
                            { name: 'Marcus Johnson', role: 'Full Stack Dev', text: 'The dark mode aesthetics and raw performance make this my favorite code snippet manager online. Highly recommended.' }
                        ].map((t, i) => (
                            <div key={i} className="p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl relative hover:border-cyan-500/30 transition-colors">
                                <Quote size={40} className="text-[var(--border)] absolute top-6 right-6 opacity-50" />
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 font-black text-xl border border-cyan-500/20">{t.name[0]}</div>
                                    <div>
                                        <div className="font-black text-[var(--text-main)] uppercase tracking-tighter text-sm">{t.name}</div>
                                        <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{t.role}</div>
                                    </div>
                                </div>
                                <p className="text-[var(--text-muted)] font-medium leading-relaxed italic">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" className="py-32 px-6 border-y border-[var(--border)] bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Pricing Plans</h2>
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em]">Choose your plan</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-10 border border-[var(--border)] rounded-3xl bg-[var(--bg-main)] text-left">
                            <div className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2">Starter</div>
                            <div className="text-4xl font-black text-[var(--text-main)] italic mb-8">Free</div>
                            <ul className="space-y-4 mb-10 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                {['Unlimited Public Projects', 'Basic Asset Library', 'Community Support'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3"><CheckCircle2 size={14} className="text-cyan-500" /> {item}</li>
                                ))}
                            </ul>
                            <Link href={route('register')} className="w-full py-4 flex items-center justify-center border border-[var(--border)] rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all">Get Started</Link>
                        </div>
                        <div className="p-10 border border-cyan-500/30 rounded-3xl bg-[var(--bg-elevated)] text-left shadow-2xl relative">
                            <Sparkles className="absolute top-6 right-6 text-cyan-500" size={24} />
                            <div className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-2">Pro</div>
                            <div className="text-4xl font-black text-[var(--text-main)] italic mb-8">Pro</div>
                            <ul className="space-y-4 mb-10 text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">
                                {['Private Projects', 'Priority Rendering', 'Collaboration Tools'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3"><CheckCircle2 size={14} className="text-cyan-500" /> {item}</li>
                                ))}
                            </ul>
                            <button onClick={handleUpgrade} className="w-full py-4 bg-cyan-500 text-black font-black uppercase text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform">
                                {(auth.user?.role === 'paid-user' || auth.user?.role === 'admin') ? 'Manage Subscription' : 'Upgrade Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-64 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-16">
                    <Rocket className="text-cyan-500 mx-auto animate-bounce" size={48} />
                    <h2 className="text-6xl md:text-9xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Start Coding Today</h2>
                    <Link href={route('register')} className="px-16 py-6 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-xs tracking-[0.5em] rounded hover:bg-cyan-500 hover:text-white transition-all shadow-2xl active:scale-95 inline-block italic">Sign Up Free</Link>
                </div>
            </section>

            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)} 
                user={auth.user}
            />
        </PublicLayout>
    );
}