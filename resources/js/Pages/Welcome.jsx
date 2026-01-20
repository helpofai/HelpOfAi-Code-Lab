import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code2, Terminal, Shield, Activity, Cpu, 
    Globe, ArrowRight, Zap, Radio, Command, 
    ChevronRight, Binary, Eye, Database, CpuIcon,
    ShieldAlert, ShieldCheck, Network, Layers, Share2, Server, Github,
    Workflow, Brain, BarChart3, Users2, Key, MousePointer2, Dna, Sparkles,
    Target, Crosshair, ExternalLink, User, Clock, Monitor, Box, Triangle,
    ChevronDown, Rocket
} from 'lucide-react';
import DigitalLabBackground from '@/Components/Visuals/DigitalLabBackground';
import SystemBoot from '@/Components/Visuals/SystemBoot';
import CursorGlow from '@/Components/Visuals/CursorGlow';
import TextDecode from '@/Components/Visuals/TextDecode';
import NeuralTyping from '@/Components/Visuals/NeuralTyping';
import axios from 'axios';

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Advanced high-fidelity thumbnail for home page
function ProjectThumbnail({ project }) {
    const [fullProject, setFullProject] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            try { const res = await axios.get(`/api/projects/${project.slug}`); setFullProject(res.data); } catch(e) {}
        };
        fetch();
    }, [project.slug]);

    const srcDoc = useMemo(() => {
        if (!fullProject) return '';
        return `
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
        <div className="w-full h-full bg-[#1d1e22] relative overflow-hidden">
            {fullProject ? (
                <div className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-[2s]">
                    <iframe 
                        srcDoc={srcDoc} 
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
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}

export default function Welcome({ auth, siteSettings }) {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [featured, setFeatured] = useState([]);
    const [globalStats, setGlobalStats] = useState({ projects: 0, users: 0, public_projects: 0 });
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleMove = (e) => setCoords({ x: e.clientX, y: e.clientY });
        const handleScroll = () => setScrolled(window.scrollY > 50);
        
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('scroll', handleScroll);
        
        axios.get('/api/explore/featured').then(res => setFeatured(res.data));
        axios.get('/api/explore/stats').then(res => setGlobalStats(res.data));
        
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Helper to get setting or default
    const getSetting = (key, defaultVal) => siteSettings?.[key] || defaultVal;

    // HERO SETTINGS
    const heroTitle = getSetting('home_hero_title', "NEURAL CORE");
    const heroSubtitle = getSetting('home_hero_subtitle', "High-performance neural development substrate. Synthesize the future of web protocols.");
    const ctaText = getSetting('home_hero_cta_text', "Initialize_Core");
    const ctaLink = getSetting('home_hero_cta_link', route('register'));
    const showBanner = siteSettings?.announcement_banner_active === '1';
    const bannerText = getSetting('announcement_banner_text', "");

    // SECTION SETTINGS
    const featuredTitle = getSetting('home_featured_title', 'Public_Neural_Feed');
    const featuredSubtitle = getSetting('home_featured_subtitle', 'Active Modules from the Global Network');
    const pricingTitle = getSetting('home_pricing_title', 'Security_Clearance');

    // SEO SETTINGS
    const metaTitle = getSetting('seo_meta_title', 'HOACodeLab // Total System Access');
    const metaDesc = getSetting('seo_meta_description', 'High-performance neural development substrate. Synthesize the future of web protocols.');
    const metaKeywords = getSetting('seo_meta_keywords', 'code editor, online ide, html, css, javascript');
    const ogImage = getSetting('seo_og_image', null);

    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-cyan-500/30 overflow-x-hidden">
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDesc} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDesc} />
                {ogImage && <meta property="og:image" content={ogImage} />}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={metaTitle} />
                <meta property="twitter:description" content={metaDesc} />
                {ogImage && <meta property="twitter:image" content={ogImage} />}
                {siteSettings?.site_favicon && <link rel="icon" type="image/x-icon" href={siteSettings.site_favicon} />}
            </Head>

            <div className="relative">
                <div className="fixed inset-0 z-0">
                    <DigitalLabBackground />
                    <CursorGlow />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-scanlines opacity-[0.06] z-10 pointer-events-none"></div>
                </div>

                <div className="relative z-20">
                    <nav className={`fixed top-0 w-full transition-all duration-500 z-50 px-6 md:px-12 ${scrolled ? 'h-16 md:h-20 bg-black/80 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'h-24 md:h-32 bg-transparent'}`}>
                        <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between">
                            <div className="flex items-center space-x-4 md:space-x-6">
                                {siteSettings?.site_logo ? (
                                    <img src={siteSettings.site_logo} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
                                ) : (
                                    <div className="p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                                        <Code2 className="text-cyan-400" size={24} />
                                    </div>
                                )}
                                <div className="flex flex-col text-left">
                                    <span className="text-lg md:text-2xl font-black italic uppercase tracking-tighter text-white leading-none">HOACodeLab</span>
                                    <span className={`transition-all duration-500 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-auto opacity-100 mt-2'} hidden md:block text-[8px] text-cyan-400 font-black uppercase tracking-[0.5em]`}>Advanced_Neural_Net</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 md:space-x-10">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="px-6 py-2 border border-cyan-500/30 text-cyan-400 rounded-lg text-[10px] md:text-xs font-black tracking-[0.2em] hover:bg-cyan-500 hover:text-black transition-all uppercase italic">Terminal_Access</Link>
                                ) : (
                                    <div className="flex items-center space-x-4 md:space-x-8">
                                        <Link href={route('login')} className="hidden md:block text-[10px] md:text-xs font-black hover:text-cyan-400 transition-colors uppercase tracking-[0.4em] opacity-60 hover:opacity-100 italic">_Access_Uplink</Link>
                                        <Link href={ctaLink} className="group relative px-6 md:px-10 py-3 md:py-4 bg-white text-black font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 rounded-sm">
                                            <div className="absolute inset-0 bg-cyan-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                                            <span className="relative z-10 flex items-center shrink-0">
                                                <Zap size={14} className="mr-2 md:mr-3" /> {ctaText}
                                            </span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>

                    {showBanner && (
                        <div className={`fixed transition-all duration-500 w-full bg-emerald-500/10 border-b border-emerald-500/20 py-2 text-center z-40 backdrop-blur-md ${scrolled ? 'top-16 md:top-20' : 'top-24 md:top-32'}`}>
                            <span className="text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center justify-center">
                                <Zap size={10} className="mr-2 animate-pulse" />
                                {bannerText}
                            </span>
                        </div>
                    )}

                    {/* HERO SECTION */}
                    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full" />
                        </div>

                        <div className="absolute top-40 left-12 hidden 2xl:block text-left border-l-2 border-cyan-500/30 pl-6 py-4 bg-black/40 backdrop-blur-md rounded-r-2xl">
                            <div className="text-[9px] font-black text-cyan-500/50 uppercase tracking-[0.4em] mb-2">Neural_Telemetry</div>
                            <div className="space-y-1">
                                <div className="text-xs font-bold text-white uppercase tracking-widest flex justify-between gap-8"><span>X_UNIT</span> <span className="text-cyan-400">{coords.x}</span></div>
                                <div className="text-xs font-bold text-white uppercase tracking-widest flex justify-between gap-8"><span>Y_UNIT</span> <span className="text-cyan-400">{coords.y}</span></div>
                                <div className="text-xs font-bold text-white uppercase tracking-widest flex justify-between gap-8"><span>STATUS</span> <span className="text-emerald-400">SYNC_OK</span></div>
                            </div>
                        </div>

                        <div className="absolute bottom-20 right-12 hidden 2xl:block text-right border-r-2 border-cyan-500/30 pr-6 py-4 bg-black/40 backdrop-blur-md rounded-l-2xl">
                            <div className="text-[9px] font-black text-cyan-500/50 uppercase tracking-[0.4em] mb-3">Buffer_Allocation</div>
                            <div className="space-y-3">
                                {[70, 45, 90].map((w, i) => (
                                    <div key={i} className="w-40 h-1 bg-white/5 rounded-full overflow-hidden"><motion.div animate={{ width: `${w}%` }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: i * 0.3 }} className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" /></div>
                                ))}
                            </div>
                        </div>

                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2 }}>
                            <div className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 animate-pulse italic">Neural_Protocol_v1.3.9_Operational</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl lg:text-[9.5rem] font-black tracking-tighter italic uppercase leading-[0.8] mb-10 max-w-7xl mx-auto break-words">
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-800 drop-shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                                    <TextDecode text={heroTitle} delay={500} />
                                </span>
                            </h1>
                            <div className="space-y-12 flex flex-col items-center w-full">
                                <div className="w-full md:max-w-2xl border-y border-white/10 py-8 relative">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyan-500" />
                                    <p className="text-xs md:text-sm text-slate-400 uppercase tracking-[0.3em] font-bold leading-loose text-center min-h-[4em] md:min-h-[3em]">
                                        <NeuralTyping text={heroSubtitle} speed={25} delay={1500} />
                                    </p>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-6">
                                    <Link href={ctaLink} className="px-12 py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.4em] rounded-sm hover:bg-white transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] active:scale-95">Launch_Core</Link>
                                    <Link href={route('explore')} className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.4em] rounded-sm hover:bg-white/10 transition-all active:scale-95">Explore_Grid</Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"><ChevronDown size={32} /></motion.div>
                    </section>

                    {/* STATS STRIP */}
                    <section className="py-20 border-y border-white/5 bg-black/20">
                        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                            {[
                                { label: 'Active_Nodes', val: globalStats.users, icon: Users2 },
                                { label: 'Neural_Cores', val: globalStats.projects, icon: Database },
                                { label: 'Public_Protocols', val: globalStats.public_projects, icon: Globe },
                                { label: 'Network_Uptime', val: '99.9%', icon: Activity }
                            ].map((stat, i) => (
                                <div key={i} className="text-center space-y-4">
                                    <div className="flex justify-center"><stat.icon className="text-cyan-500 opacity-40" size={24} /></div>
                                    <div className="text-2xl md:text-4xl font-black text-white tracking-tighter italic">{stat.val}</div>
                                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PUBLIC MODULE PREVIEW SECTION */}
                    <section className="py-24 md:py-48 px-6 md:px-12 bg-[#020617] relative border-b border-white/5">
                        <div className="max-w-screen-2xl mx-auto">
                            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10 text-left">
                                <div className="space-y-6 text-left">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-1 bg-cyan-500 rounded-full" />
                                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em]">{featuredSubtitle}</span>
                                    </div>
                                    <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none text-left">{featuredTitle}</h2>
                                </div>
                                <Link href={route('explore')} className="group flex items-center space-x-4 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-white/60 hover:text-white transition-all hover:border-cyan-500/30">
                                    <span className="font-black uppercase text-[10px] tracking-[0.3em]">Sector_Exploration</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-cyan-500" />
                                </Link>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                                {featured.map((project, i) => (
                                    <motion.div key={project.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                                        className="group relative bg-black/40 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-700 hover:shadow-[0_0_100px_rgba(6,182,212,0.1)]"
                                    >
                                        <div className="aspect-[16/10] bg-black relative border-b border-white/5">
                                            <ProjectThumbnail project={project} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                                                <Link href={route('editor', { slug: project.slug })} className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all translate-y-4 group-hover:translate-y-0">Connect_Node</Link>
                                            </div>
                                        </div>
                                        <div className="p-10 text-left">
                                            <div className="flex justify-between items-start mb-6">
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic group-hover:text-cyan-400 transition-colors truncate pr-4">{project.title}</h3>
                                                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0"><Box size={16} className="text-cyan-500" /></div>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-white/5 pt-6 text-left">
                                                <div className="flex items-center space-x-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-left">
                                                    <div className="w-6 h-6 bg-white/10 rounded-full overflow-hidden border border-white/10 flex items-center justify-center text-left"><User size={12} className="text-cyan-500" /></div>
                                                    <span>{project.user.name}</span>
                                                </div>
                                                <div className="text-[9px] font-black text-cyan-500/40 uppercase tracking-[0.2em]">Protocol_OK</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* TECH STACK MODULES */}
                    <section className="py-24 md:py-48 px-6 md:px-12 border-b border-white/5">
                        <div className="max-w-7xl mx-auto">
                            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-32">
                                <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-8">Neural_Modules</h2>
                                <p className="text-cyan-500 font-black uppercase tracking-[0.5em] text-xs opacity-60 italic">Supported Quantum Synthesizers</p>
                            </motion.div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {[ 
                                    { name: 'HTML5_CORE', icon: Code2, color: 'text-orange-500' }, { name: 'CSS3_PLASMA', icon: Layers, color: 'text-blue-500' }, { name: 'JS_NEURAL', icon: Zap, color: 'text-yellow-400' }, { name: 'REACT_FRAME', icon: Cpu, color: 'text-cyan-400' }, { name: 'VITE_SPEED', icon: Zap, color: 'text-purple-500' }, { name: 'POST_EFFECTS', icon: Sparkles, color: 'text-rose-400' }, { name: 'QUANTUM_DB', icon: Database, color: 'text-emerald-400' }, { name: 'THREE_SPACE', icon: Globe, color: 'text-indigo-400' } 
                                ].map((tech, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group flex flex-col items-center justify-center p-10 border border-white/5 bg-white/[0.02] hover:bg-cyan-500/[0.02] hover:border-cyan-500/20 transition-all rounded-[2.5rem] relative overflow-hidden text-center"><div className="absolute top-0 right-0 p-1 bg-white/5 border-b border-l border-white/10 rounded-bl-xl text-[8px] font-black text-white/20">MODULE_{i+1}</div><tech.icon className={`${tech.color} mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`} size={40} /><span className="text-[10px] font-black tracking-[0.2em] text-white/40 group-hover:text-white transition-colors uppercase text-center">{tech.name}</span></motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* TRUSTED BY */}
                    <section className="py-32 bg-black">
                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] block mb-16">Trusted_by_Engineers_at</span>
                            <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-20 contrast-200">
                                {[ { name: 'NEURAL_SYSTEMS', icon: Brain }, { name: 'QUANTUM_LABS', icon: Box }, { name: 'CORE_DYNAMICS', icon: Database }, { name: 'VOID_PROTOCOL', icon: Radio }, { name: 'CYBER_SEC', icon: ShieldCheck } ].map((brand, i) => (
                                    <div key={i} className="flex items-center gap-4 group hover:opacity-100 transition-opacity"><brand.icon size={24} /><span className="text-sm font-black uppercase tracking-widest">{brand.name}</span></div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* PRICING */}
                    <section className="py-24 md:py-48 px-6 md:px-12 bg-[#020617] border-y border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-7xl mx-auto relative z-10 text-center">
                            <div className="text-center mb-32">
                                <Rocket className="text-cyan-400 mx-auto mb-12 animate-bounce" size={48} />
                                <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white mb-8">{pricingTitle}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20">Secure_Level_Verification_Required</p>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 text-left">
                                {[ { level: 'ALPHA', price: 'FREE', access: 'PUBLIC_SECTORS', color: 'border-white/10 bg-white/[0.02]', btn: 'Request_Access' }, { level: 'OMEGA', price: '$12/mo', access: 'PRIVATE_VAULTS', color: 'border-cyan-500/50 bg-cyan-500/[0.03] shadow-[0_0_60px_rgba(6,182,212,0.15)]', btn: 'Grant_Entry' }, { level: 'ENTITY', price: 'CUSTOM', access: 'FULL_NETWORK', color: 'border-purple-500/50 bg-purple-500/[0.03]', btn: 'Contact_Admin' } ].map((tier, i) => (
                                    <div key={i} className={`p-16 border-2 ${tier.color} rounded-[4rem] space-y-12 flex flex-col items-center group hover:scale-[1.02] transition-all duration-500 text-center`}><div className="w-16 h-1 bg-white/10 rounded-full" /><div className="text-center text-left"><span className="text-xs font-black text-white/30 tracking-[0.6em] uppercase block mb-6">{tier.level}_LEVEL</span><div className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-4 italic">{tier.price}</div><div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">{tier.access}</div></div><button className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all ${i === 1 ? 'bg-cyan-500 text-black shadow-xl hover:bg-white' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white hover:text-black'}`}>{tier.btn}</button></div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    <footer className="py-32 px-6 md:px-12 bg-black relative overflow-hidden">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
                            <div className="md:col-span-2 space-y-12 text-left">
                                <div className="flex items-center space-x-5 text-left"><div className="p-3 bg-white/5 rounded-xl border border-white/10"><Code2 className="text-cyan-400" size={32} /></div><span className="text-3xl font-black italic uppercase tracking-tighter text-white">HOACodeLab</span></div>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest max-w-md leading-loose opacity-60 text-left">Establishing the primary neural link for the next generation of software engineers. Secure. Infinite. Optimized.</p>
                                <div className="flex space-x-6 text-left">{[Github, Server, Database].map((Icon, i) => (<a key={i} href="#" className="p-5 border border-white/5 rounded-2xl text-white/20 hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:bg-cyan-500/5 group"><Icon size={20} className="group-hover:scale-110 transition-transform" /></a>))}</div>
                            </div>
                            <div className="space-y-10 text-left"><h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">Access_Protocols</h4><ul className="space-y-6">{['Security_Log', 'API_Endpoints', 'Network_Map', 'System_Health'].map((item) => (<li key={item}><a href="#" className="text-gray-500 hover:text-white text-[10px] font-black uppercase transition-colors tracking-[0.2em] flex items-center group text-left"><ChevronRight size={12} className="mr-3 text-cyan-500/40 group-hover:translate-x-1 transition-transform" /> {item}</a></li>))}</ul></div>
                            <div className="space-y-10 text-left"><h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">Resource_Nodes</h4><ul className="space-y-6 text-left">{['Documentation', 'Community_Lab', 'Core_Archives', 'Neural_Cloud'].map((item) => (<li key={item}><a href="#" className="text-gray-500 hover:text-white text-[10px] font-black uppercase transition-colors tracking-[0.2em] flex items-center group text-left"><ChevronRight size={12} className="mr-3 text-cyan-500/40 group-hover:translate-x-1 transition-transform" /> {item}</a></li>))}</ul></div>
                        </div>
                        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]"><span>HOACodeLab // NODE_IDENTIFIER: 833B-DA69-291C</span><div className="flex items-center space-x-4 mt-8 md:mt-0 bg-white/5 px-6 py-3 rounded-full border border-white/5"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]" /><span className="text-white/30 text-left">Global_Uplink_Active</span></div></div>
                    </footer>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                body { background-color: black; cursor: crosshair; } 
                .bg-scanlines { background: linear-gradient(to bottom, transparent 50%, black 50%); background-size: 100% 4px; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.1); border-radius: 10px; }
            ` }} />
        </div>
    );
}