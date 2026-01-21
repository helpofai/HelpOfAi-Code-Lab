import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Code2, Globe, ArrowRight, Zap, 
    ChevronRight, Binary, Database, Cpu,
    Layers, Share2, Server, Github, Shield,
    User, Clock, Box, Rocket, Monitor, Workflow,
    CheckCircle2, AppWindow, Command, Braces,
    Layout, Smartphone, Terminal, Eye, Sparkles, Lock,
    Activity, Heart
} from 'lucide-react';
import axios from 'axios';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';
import ProBackground from '@/Components/Visuals/ProBackground';
import NotificationDropdown from '@/Components/Visuals/NotificationDropdown';

// Professional Product Mockup Component
const EditorShowcase = () => (
    <div className="relative group max-w-5xl mx-auto">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        
        <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
            {/* Window Header */}
            <div className="h-10 bg-[var(--bg-elevated)] border-b border-[var(--border)] flex items-center justify-between px-4">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                </div>
                <div className="flex gap-4">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-main)] px-3 py-1 rounded">HTML</div>
                    <div className="text-[10px] font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20">CSS</div>
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-main)] px-3 py-1 rounded">JS</div>
                </div>
                <div className="w-12" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 h-[400px]">
                {/* Code Side */}
                <div className="bg-[#050505] p-8 border-r border-white/5 font-mono text-xs leading-relaxed overflow-hidden">
                    <div className="text-cyan-400">.neural-container <span className="text-white">{'{'}</span></div>
                    <div className="pl-6 text-slate-400">
                        <span className="text-purple-400">display</span>: flex;<br/>
                        <span className="text-purple-400">align-items</span>: center;<br/>
                        <span className="text-purple-400">background</span>: <span className="text-emerald-400">linear-gradient</span>(45deg, <span className="text-amber-400">#050505</span>);<br/>
                        <span className="text-purple-400">border-radius</span>: 20px;<br/>
                        <span className="text-purple-400">box-shadow</span>: <span className="text-blue-400">0 0 50px rgba(0,0,0,0.5)</span>;<br/>
                        <span className="text-purple-400">animation</span>: <span className="text-emerald-400">pulse</span> 2s infinite;<br/>
                    </div>
                    <div className="text-white">{'}'}</div>
                    <div className="mt-4 text-slate-600 italic">// Establishing primary uplink...</div>
                </div>
                
                {/* Preview Side */}
                <div className="bg-white flex items-center justify-center p-12">
                    <div className="w-full aspect-square max-w-[120px] bg-black rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-20 animate-pulse" />
                        <Zap className="text-cyan-500 animate-bounce" size={40} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function Welcome({ auth, siteSettings }) {
    const [featured, setFeatured] = useState([]);
    const [globalStats, setGlobalStats] = useState({ projects: 0, users: 0, public_projects: 0 });

    useEffect(() => {
        axios.get('/api/explore/featured').then(res => setFeatured(res.data));
        axios.get('/api/explore/stats').then(res => setGlobalStats(res.data));
    }, []);

    const getSetting = (key, defaultVal) => siteSettings?.[key] || defaultVal;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-300">
            <Head>
                <title>{getSetting('seo_meta_title', 'HOACodeLab // Technical Prototyping Node')}</title>
                <meta name="description" content={getSetting('seo_meta_description', 'High-performance cloud editor for modern web developers.')} />
            </Head>

            <ProBackground />

            {/* Navigation */}
            <nav className="fixed top-0 w-full h-20 border-b border-[var(--border)] bg-[var(--bg-main)]/80 backdrop-blur-xl z-[100] px-6 md:px-12">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500 text-white dark:bg-white dark:text-black rounded shadow-lg">
                                <Code2 size={20} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">HOACodeLab</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                            <Link href={route('explore')} className="hover:text-cyan-500 transition-colors">Grid_Exploration</Link>
                            <a href="#features" className="hover:text-cyan-500 transition-colors">Core_Engine</a>
                            <a href="#about" className="hover:text-cyan-500 transition-colors">About_Node</a>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                        {auth.user ? (
                            <div className="flex items-center gap-4">
                                <NotificationDropdown />
                                <Link href={route('dashboard')} className="px-6 py-2 border border-[var(--border)] rounded font-black text-[10px] uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all italic">Terminal_Access</Link>
                            </div>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Entry</Link>
                                <Link href={route('register')} className="btn-primary">Get_Clearance</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* HERO */}
                <section className="pt-48 pb-32 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/10 rounded-full mb-10">
                                <Sparkles size={12} className="text-cyan-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">v1.4.0 Neural Build</span>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-[0.8] mb-12">
                                Synthesis <br/> 
                                <span className="text-[var(--text-muted)]">Laboratory</span>
                            </h1>
                            <p className="text-[var(--text-muted)] text-sm md:text-lg max-w-2xl mx-auto font-bold uppercase tracking-[0.3em] leading-relaxed mb-20 opacity-80 italic">
                                High-performance development substrate for modern web creators. Rapid prototyping with zero-latency synchronization.
                            </p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1 }}>
                            <EditorShowcase />
                        </motion.div>
                    </div>
                </section>

                {/* TECH STRIP */}
                <section className="py-16 border-y border-[var(--border)] bg-[var(--bg-surface)]">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { l: 'Uplinks_Active', v: globalStats.users, i: User },
                            { l: 'Neural_Cores', v: globalStats.projects, i: Database },
                            { l: 'Network_SLA', v: '99.9%', i: Shield },
                            { l: 'Sync_Rate', v: '0.04ms', i: Zap }
                        ].map((s, i) => (
                            <div key={i} className="flex flex-col gap-2 border-l border-[var(--border)] pl-8 first:border-0">
                                <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] flex items-center gap-3">
                                    <s.i size={14} className="text-cyan-500/40" /> {s.l}
                                </div>
                                <div className="text-3xl font-black text-[var(--text-main)] tracking-tighter italic">{s.v}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* COMMUNITY TRANSMISSIONS */}
                <section className="py-32 px-6 border-b border-[var(--border)]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-16">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-cyan-500">
                                    <Activity size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live_Feed</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Community_Transmissions</h2>
                            </div>
                            <Link href={route('explore')} className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-cyan-500 transition-colors group">
                                View_All_Signals <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featured.length > 0 ? featured.slice(0, 3).map((project) => (
                                <Link href={route('editor', { slug: project.slug })} key={project.id} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 block">
                                    <div className="aspect-video bg-[var(--bg-elevated)] relative overflow-hidden flex items-center justify-center group-hover:bg-black transition-colors">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Code2 size={32} className="text-[var(--text-muted)] opacity-20 group-hover:text-cyan-500 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-tight truncate">{project.title}</h3>
                                            <div className="px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border)] text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                                WEB
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                                            <span className="flex items-center gap-1"><User size={10} /> {project.user?.name || 'Unknown'}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(project.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            )) : [1, 2, 3].map((i) => (
                                <div key={i} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1">
                                    <div className="aspect-video bg-[var(--bg-elevated)] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] opacity-20 font-mono text-xs">
                                            SIGNAL_LOST...
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-tight">System_Node_{i}</h3>
                                            <div className="px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border)] text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                                N/A
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                                            <span className="flex items-center gap-1"><Eye size={10} /> 0</span>
                                            <span className="flex items-center gap-1"><Heart size={10} /> 0</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PILLARS */}
                <section id="features" className="py-48 px-6 bg-[var(--bg-main)]">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[
                            { 
                                t: 'Pure_Cloud', 
                                d: 'Every line of code executed securely in your neural browser instance. No server-side risk.',
                                i: Globe
                            },
                            { 
                                t: 'Atomic_Sync', 
                                d: 'Changes reflected instantly. Pixel-perfect rendering with hardware-accelerated preview.',
                                i: Zap
                            },
                            { 
                                t: 'Secure_Vault', 
                                d: 'Encrypted storage for your modules. Public or private, your architecture remains yours.',
                                i: Lock
                            }
                        ].map((p, i) => (
                            <div key={i} className="space-y-8 text-left group">
                                <div className="w-16 h-1 bg-[var(--border)] group-hover:w-24 group-hover:bg-cyan-500 transition-all duration-500" />
                                <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-fit group-hover:border-cyan-500/30 transition-colors">
                                    <p.i className="text-cyan-500" size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">{p.t}</h3>
                                <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest leading-loose italic">{p.d}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DEEP FEATURES */}
                <section className="py-48 px-6 border-y border-[var(--border)]">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-32 items-center">
                        <div className="flex-1 space-y-12 text-left">
                            <h2 className="text-5xl md:text-7xl font-black text-[var(--text-main)] uppercase tracking-tighter italic leading-tight">
                                Professional <br/> <span className="text-cyan-500">Protocols</span>
                            </h2>
                            <div className="grid grid-cols-1 gap-8">
                                {[
                                    { t: 'Monaco_Core', d: 'Industrial strength editing with VS Code engine.', i: Code2 },
                                    { t: 'Asset_Injector', d: 'Inject global standard libraries via CDN instantly.', i: Layers },
                                    { t: 'SEO_Mastery', d: 'Complete metadata control for every synthesis.', i: Binary }
                                ].map((f, i) => (
                                    <div key={i} className="flex gap-8 items-start">
                                        <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-500 shrink-0"><f.i size={20}/></div>
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-black text-[var(--text-main)] uppercase tracking-widest italic">{f.t}</h4>
                                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] leading-relaxed">{f.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border)] p-1 rounded-3xl shadow-2xl overflow-hidden group text-left">
                            <div className="p-10 border border-[var(--border)] rounded-[1.4rem] space-y-8 italic">
                                <Terminal className="text-cyan-500/20" size={48} />
                                <div className="space-y-4 font-mono text-[11px] uppercase tracking-widest">
                                    <div className="text-cyan-500">$ initialize_uplink</div>
                                    <div className="text-[var(--text-muted)]">Checking credentials...</div>
                                    <div className="text-emerald-500">Auth_Verified: Sector_7G</div>
                                    <div className="text-[var(--text-muted)]">Allocating memory...</div>
                                    <div className="text-[var(--text-main)] animate-pulse">Sync_OK: Welcome to Lab</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRICING */}
                <section className="py-32 px-6 border-y border-[var(--border)] bg-[var(--bg-surface)]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20 space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Access_Protocols</h2>
                            <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em]">Select your clearance level</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Free Tier */}
                            <div className="p-10 border border-[var(--border)] rounded-3xl bg-[var(--bg-main)] relative overflow-hidden hover:border-cyan-500/20 transition-colors">
                                <div className="space-y-2 mb-8">
                                    <div className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Initiate</div>
                                    <div className="text-4xl font-black text-[var(--text-main)] italic">Free_Tier</div>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {['Unlimited Public Projects', 'Basic Asset Library', 'Community Support', '720p Preview', 'Standard Rate Limits'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                            <CheckCircle2 size={14} className="text-cyan-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={route('register')} className="w-full py-4 flex items-center justify-center border border-[var(--border)] rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all">
                                    Request_Access
                                </Link>
                            </div>

                            {/* Pro Tier */}
                            <div className="p-10 border border-cyan-500/30 rounded-3xl bg-[var(--bg-elevated)] relative overflow-hidden group hover:border-cyan-500 transition-colors shadow-2xl">
                                <div className="absolute top-0 right-0 p-4">
                                    <Sparkles className="text-cyan-500 animate-pulse" size={24} />
                                </div>
                                <div className="space-y-2 mb-8">
                                    <div className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em]">Operator</div>
                                    <div className="text-4xl font-black text-[var(--text-main)] italic">Pro_Link</div>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {['Private Projects', 'Priority Rendering', 'Collaboration Tools', '4K Preview Export', 'Asset Hosting', 'API Access'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">
                                            <CheckCircle2 size={14} className="text-cyan-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 flex items-center justify-center bg-cyan-500 text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                    Upgrade_Uplink
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-64 px-6 text-center">
                    <div className="max-w-4xl mx-auto space-y-16">
                        <div className="space-y-8">
                            <Rocket className="text-cyan-500 mx-auto animate-bounce" size={48} />
                            <h2 className="text-6xl md:text-9xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Join_The_Grid</h2>
                            <p className="text-[var(--text-muted)] text-sm md:text-lg font-bold uppercase tracking-[0.4em] italic opacity-60">
                                Establish your primary neural link today.
                            </p>
                        </div>
                        <Link href={route('register')} className="px-16 py-6 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-xs tracking-[0.5em] rounded hover:bg-cyan-500 hover:text-white transition-all shadow-2xl active:scale-95 inline-block italic">
                            Initialize_Uplink
                        </Link>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="py-24 bg-[var(--bg-main)] border-t border-[var(--border)] px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                        {/* Brand Column */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded"><Code2 size={24} /></div>
                                <span className="text-2xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">HOACodeLab</span>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest max-w-xs leading-loose italic opacity-80">
                                The primary neural link for the next generation of software engineers. 
                                Secure. Scalable. Optimized.
                            </p>
                            <div className="flex gap-4">
                                {[Github, Share2, Globe].map((Icon, i) => (
                                    <a key={i} href="#" className="p-3 border border-[var(--border)] rounded-full text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/30 transition-all">
                                        <Icon size={16} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="lg:col-span-2 space-y-8">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Platform</h4>
                            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Changelog</a></li>
                                <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Roadmap</a></li>
                            </ul>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Community</h4>
                            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                <li><Link href={route('explore')} className="hover:text-[var(--text-main)] transition-colors">Explore</Link></li>
                                <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Discord</a></li>
                                <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Events</a></li>
                                <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        {/* Newsletter Column */}
                        <div className="lg:col-span-4 space-y-8">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Neural_Update</h4>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-loose">
                                Subscribe for weekly system patches and new feature injections.
                            </p>
                            <form className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="USER@NET.LINK" 
                                    className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                                <button className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-[10px] tracking-widest rounded hover:bg-cyan-500 hover:text-white transition-colors">
                                    Join
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">
                        <span>© 2026 HOACodeLab // Sector_7G_Uplink</span>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Privacy_Protocol</a>
                            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Terms_Of_Service</a>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span>Systems_Operational</span>
                        </div>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.1); border-radius: 10px; }
            ` }} />
        </div>
    );
}