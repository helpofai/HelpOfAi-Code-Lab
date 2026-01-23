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
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
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
                </div>
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

            <nav className="fixed top-0 w-full h-20 border-b border-[var(--border)] bg-[var(--bg-main)]/80 backdrop-blur-xl z-[100] px-6 md:px-12">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500 text-white dark:bg-white dark:text-black rounded shadow-lg"><Code2 size={20} /></div>
                            <span className="text-xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">HOACodeLab</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                            <a href="#features" className="hover:text-cyan-500 transition-colors">Features</a>
                            <a href="#about" className="hover:text-cyan-500 transition-colors">About</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                        {auth.user ? (
                            <div className="flex items-center gap-4">
                                <NotificationDropdown />
                                <Link href={route('dashboard')} className="px-6 py-2 border border-[var(--border)] rounded font-black text-[10px] uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all italic">Dashboard</Link>
                            </div>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Login</Link>
                                <Link href={route('register')} className="btn-primary">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                <section className="pt-48 pb-32 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/10 rounded-full mb-10">
                                <Sparkles size={12} className="text-cyan-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">v1.4.8 Stable Build</span>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-[0.8] mb-12">Modern <br/> <span className="text-[var(--text-muted)]">Code Editor</span></h1>
                            <p className="text-[var(--text-muted)] text-sm md:text-lg max-w-2xl mx-auto font-bold uppercase tracking-[0.3em] leading-relaxed mb-20 opacity-80 italic">High-performance development substrate for modern web creators.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1 }}>
                            <EditorShowcase />
                        </motion.div>
                    </div>
                </section>

                <section className="py-16 border-y border-[var(--border)] bg-[var(--bg-surface)]">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { l: 'Active Users', v: globalStats.users, i: User },
                            { l: 'Projects Created', v: globalStats.projects, i: Database },
                            { l: 'Uptime', v: '99.9%', i: Shield },
                            { l: 'Performance', v: '0.04ms', i: Zap }
                        ].map((s, i) => (
                            <div key={i} className="flex flex-col gap-2 border-l border-[var(--border)] pl-8 first:border-0">
                                <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] flex items-center gap-3"><s.i size={14} className="text-cyan-500/40" /> {s.l}</div>
                                <div className="text-3xl font-black text-[var(--text-main)] tracking-tighter italic">{s.v}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-32 px-6 border-b border-[var(--border)]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-16">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-cyan-500"><Activity size={16} /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Feed</span></div>
                                <h2 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Featured Projects</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featured.length > 0 ? featured.slice(0, 3).map((project) => {
                                const liveSrcDoc = `<!DOCTYPE html><html><head><style>body { margin: 0; overflow: hidden; background: white; font-family: sans-serif; } ${project.code?.css || ''}</style></head><body>${project.code?.html || ''}<script>${project.code?.js || ''}</script></body></html>`;
                                return (
                                    <Link href={route('editor', { slug: project.slug })} key={project.id} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 block">
                                        <div className="aspect-video bg-white relative overflow-hidden">
                                            <iframe srcDoc={liveSrcDoc} className="w-full h-full border-none pointer-events-none scale-75 origin-top-left" style={{ width: '133.33%', height: '133.33%' }} sandbox="allow-scripts" title={`preview-${project.id}`} />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <div className="p-3 bg-cyan-500 text-black rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform"><Zap size={20} fill="currentColor" /></div>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[8px] font-black text-white uppercase tracking-widest text-shadow-sm">Live Preview</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4 text-left">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-tight truncate">{project.title}</h3>
                                                <div className="px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border)] text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">{project.category || 'NODE'}</div>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                                                <span className="flex items-center gap-1"><User size={10} /> {project.user?.name || 'Unknown'}</span>
                                                <span className="flex items-center gap-1"><Clock size={10} /> {new Date(project.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }) : [1, 2, 3].map((i) => (
                                <div key={i} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
                                    <div className="aspect-video bg-[var(--bg-elevated)]" />
                                    <div className="p-6 space-y-4"><div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" /><div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" /></div>
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

                <section className="py-32 px-6 border-y border-[var(--border)] bg-[var(--bg-surface)]">
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
                                <button className="w-full py-4 bg-cyan-500 text-black font-black uppercase text-xs rounded-xl shadow-lg shadow-cyan-500/20">Upgrade Now</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-64 px-6 text-center">
                    <div className="max-w-4xl mx-auto space-y-16">
                        <Rocket className="text-cyan-500 mx-auto animate-bounce" size={48} />
                        <h2 className="text-6xl md:text-9xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">Join_The_Grid</h2>
                        <Link href={route('register')} className="px-16 py-6 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-xs tracking-[0.5em] rounded hover:bg-cyan-500 hover:text-white transition-all shadow-2xl active:scale-95 inline-block italic">Initialize_Uplink</Link>
                    </div>
                </section>
            </main>

            <footer className="py-24 bg-[var(--bg-main)] border-t border-[var(--border)] px-6 text-left">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                        <div className="lg:col-span-4 space-y-8">
                            <div className="flex items-center gap-4"><div className="p-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded"><Code2 size={24} /></div><span className="text-2xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">HOACodeLab</span></div>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest max-w-xs leading-loose italic">Secure. Scalable. Optimized.</p>
                            <div className="flex gap-4">
                                {[Github, Share2, Globe].map((Icon, i) => (<a key={i} href="#" className="p-3 border border-[var(--border)] rounded-full text-[var(--text-muted)] hover:text-cyan-500 transition-all"><Icon size={16} /></a>))}
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-8"><h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Platform</h4><ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]"><li>Features</li><li>Pricing</li><li>Changelog</li></ul></div>
                        <div className="lg:col-span-2 space-y-8"><h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Community</h4><ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]"><li>Discord</li><li>Blog</li></ul></div>
                        <div className="lg:col-span-4 space-y-8"><h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Neural_Update</h4><p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Subscribe for system patches.</p><form className="flex gap-2"><input type="email" placeholder="USER@NET.LINK" className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-cyan-500" /><button className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-[10px] tracking-widest rounded hover:bg-cyan-500 hover:text-white transition-colors">Join</button></form></div>
                    </div>
                    <div className="pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">
                        <span>© 2026 HOACodeLab // Sector_7G_Uplink</span>
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-full"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span>Systems_Operational</span></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
