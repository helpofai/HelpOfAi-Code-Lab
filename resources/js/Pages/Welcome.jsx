import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code2, Terminal, Shield, Activity, Cpu, 
    Globe, ArrowRight, Zap, Radio, Command, 
    ChevronRight, Binary, Eye, Database, CpuIcon,
    ShieldAlert, Network, Layers, Share2, Server, Github,
    Workflow, Brain, BarChart3, Users2, Key, MousePointer2, Dna, Sparkles,
    Target, Crosshair, ExternalLink, User, Clock
} from 'lucide-react';
import NeuralNetwork from '@/Components/Visuals/NeuralNetwork';
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
                <div className="absolute inset-0 w-full h-full">
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

    useEffect(() => {
        const handleMove = (e) => setCoords({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMove);
        axios.get('/api/explore/featured').then(res => setFeatured(res.data));
        return () => window.removeEventListener('mousemove', handleMove);
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
    
    const techTitle = getSetting('home_tech_title', 'Neural_Modules');
    const techSubtitle = getSetting('home_tech_subtitle', 'Supported Quantum Synthesizers');

    const diagTitle = getSetting('home_diagnostics_title', 'Engine Diagnostics');
    const diagDesc = getSetting('home_diagnostics_desc', 'Direct binary injection into the browser execution stack ensures 0.04ms sync rates.');

    const uplinkTitle = getSetting('home_uplink_title', 'Multi-Node Uplink_Sync');
    const uplinkSubtitle = getSetting('home_uplink_subtitle', 'Collaborate across neural boundaries. Future-ready protocols for real-time peer-to-peer code synthesis and shared laboratory instances.');

    const featuresTitle = getSetting('home_features_title', 'Core Interface Modules');
    const featuresSubtitle = getSetting('home_features_subtitle', 'Every laboratory comes equipped with a suite of high-performance tools designed for the next era of development.');

    const pricingTitle = getSetting('home_pricing_title', 'Security_Clearance');

    const siteLogo = getSetting('site_logo', null);
    const siteFavicon = getSetting('site_favicon', null);

    // SEO SETTINGS
    const metaTitle = getSetting('seo_meta_title', 'HOACodeLab // Total System Access');
    const metaDesc = getSetting('seo_meta_description', 'High-performance neural development substrate. Synthesize the future of web protocols.');
    const metaKeywords = getSetting('seo_meta_keywords', 'code editor, online ide, html, css, javascript');
    const ogImage = getSetting('seo_og_image', null);

    // TYPOGRAPHY SETTINGS
    const typoFont = getSetting('typography_font_family', 'Inter, sans-serif');
    const typoBodySize = getSetting('typography_body_size', '1rem');
    const typoLineHeightBody = getSetting('typography_line_height_body', '1.6');
    const typoWeightBody = getSetting('typography_font_weight_body', '400');
    
    const typoLineHeightHeadings = getSetting('typography_line_height_headings', '1.2');
    const typoLetterSpacingHeadings = getSetting('typography_letter_spacing_headings', '-0.02em');
    const typoTransformHeadings = getSetting('typography_transform_headings', 'uppercase');
    const typoWeightHeadings = getSetting('typography_font_weight_headings', '900');

    const typoH1 = getSetting('typography_h1_size', '4rem');
    const typoH2 = getSetting('typography_h2_size', '3rem');
    const typoH3 = getSetting('typography_h3_size', '2rem');
    const typoH4 = getSetting('typography_h4_size', '1.5rem');
    const typoH5 = getSetting('typography_h5_size', '1.25rem');
    const typoH6 = getSetting('typography_h6_size', '1rem');


    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-cyan-500/30 overflow-x-hidden">
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDesc} />
                <meta name="keywords" content={metaKeywords} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDesc} />
                {ogImage && <meta property="og:image" content={ogImage} />}

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={metaTitle} />
                <meta property="twitter:description" content={metaDesc} />
                {ogImage && <meta property="twitter:image" content={ogImage} />}

                {siteFavicon && <link rel="icon" type="image/x-icon" href={siteFavicon} />}
            </Head>

            <div className="relative">
                <div className="fixed inset-0 z-0">
                    <NeuralNetwork />
                    <CursorGlow />
                    <div className="absolute inset-0 bg-scanlines opacity-[0.06] z-10 pointer-events-none"></div>
                </div>

                <div className="relative z-20">
                    <nav className="fixed top-0 w-full h-24 border-b border-cyan-500/10 flex items-center justify-between px-12 z-50 bg-black/40 backdrop-blur-xl">
                        <div className="flex items-center space-x-6">
                            {siteLogo ? (
                                <img src={siteLogo} alt="Logo" className="h-12 w-auto object-contain" />
                            ) : (
                                <div className="p-3 bg-cyan-500/10 border border-cyan-400 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                    <Code2 className="text-cyan-400" size={32} />
                                </div>
                            )}
                            <div className="flex flex-col text-left">
                                <span className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">HOACodeLab</span>
                                <span className="text-xs text-cyan-400 font-bold uppercase tracking-[0.5em] mt-2">Neural_Net // V4.2.0</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-10">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="text-xs font-black tracking-widest hover:text-cyan-400 transition-colors uppercase italic underline underline-offset-8">Terminal_Access</Link>
                            ) : (
                                <div className="flex items-center space-x-8">
                                    <Link href={route('login')} className="text-sm font-black hover:text-cyan-400 transition-colors uppercase tracking-[0.3em]">_Entry</Link>
                                    <Link href={ctaLink} className="group relative px-10 py-4 bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 rounded-sm shadow-xl">
                                        <div className="absolute inset-0 bg-cyan-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                                        <span className="relative z-10 flex items-center"><Target size={18} className="mr-3" /> {ctaText}</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    {showBanner && (
                        <div className="fixed top-24 w-full bg-emerald-500/10 border-b border-emerald-500/20 py-2 text-center z-40 backdrop-blur-md">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center justify-center">
                                <Zap size={12} className="mr-2 animate-pulse" />
                                {bannerText}
                            </span>
                        </div>
                    )}

                    {/* HERO SECTION */}
                    <section className="h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative">
                        <div className="absolute top-40 left-12 hidden lg:block text-left border-l-2 border-cyan-500/30 pl-6 py-4 bg-cyan-500/5 backdrop-blur-md">
                            <div className="text-xs font-black text-cyan-500/50 uppercase tracking-[0.4em] mb-2">Cursor_Tracking</div>
                            <div className="text-sm font-bold text-white uppercase tracking-widest">X_COORD: {coords.x}</div>
                            <div className="text-sm font-bold text-white uppercase tracking-widest">Y_COORD: {coords.y}</div>
                        </div>
                        <div className="absolute top-40 right-12 hidden lg:block text-right border-r-2 border-cyan-500/30 pr-6 py-4 bg-cyan-500/5 backdrop-blur-md">
                            <div className="text-xs font-black text-cyan-500/50 uppercase tracking-[0.4em] mb-3">Memory_Buffers</div>
                            <div className="space-y-3">{[70, 45, 90].map((w, i) => (<div key={i} className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden"><motion.div animate={{ width: `${w}%` }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: i * 0.3 }} className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" /></div>))}
                            </div>
                        </div>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter italic uppercase leading-[0.8] mb-12 max-w-7xl mx-auto">
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-700 drop-shadow-[0_0_50px_rgba(34,211,238,0.4)]">
                                    <TextDecode text={heroTitle} delay={500} />
                                </span>
                            </h1>
                            <div className="space-y-12 flex flex-col items-center">
                                <div className="max-w-2xl border border-cyan-500/20 py-8 px-12 bg-cyan-500/5 backdrop-blur-sm relative">
                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400" /><div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400" />
                                    <p className="text-base text-cyan-100 uppercase tracking-[0.4em] font-black leading-relaxed text-center min-h-[3em]"><NeuralTyping text={heroSubtitle} speed={30} delay={1500} /></p>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* PUBLIC MODULE PREVIEW SECTION */}
                    <section className="min-h-screen py-48 px-12 bg-black/60 backdrop-blur-sm border-y border-cyan-500/10">
                        <div className="max-w-7xl mx-auto">
                            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-24 flex justify-between items-end">
                                <div>
                                    <h2 className="text-6xl font-black italic uppercase tracking-tighter border-l-8 border-cyan-500 pl-8 mb-4 text-white">{featuredTitle}</h2>
                                    <p className="text-cyan-500/60 uppercase tracking-[0.4em] text-xs font-bold pl-8">{featuredSubtitle}</p>
                                </div>
                                <Link href={route('explore')} className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors font-black uppercase text-[10px] tracking-[0.3em]">Explore_All <ChevronRight size={16} /></Link>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {featured.map((project, i) => (
                                    <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                        className="group bg-[#0f172a]/40 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
                                    >
                                        <div className="aspect-[16/10] bg-black border-b border-white/5 relative">
                                            <ProjectThumbnail project={project} />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <Link href={route('editor', { slug: project.slug })} className="p-4 bg-white text-black rounded-full hover:bg-cyan-400 transition-all scale-75 group-hover:scale-100"><ExternalLink size={24} /></Link>
                                            </div>
                                        </div>
                                        <div className="p-8 text-left">
                                            <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate group-hover:text-cyan-400 transition-colors mb-4">{project.title}</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                    <User size={12} className="text-cyan-500" />
                                                    <span>By: {project.user.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                    <Clock size={12} className="text-cyan-500" />
                                                    <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* TECH STACK MODULES */}
                    <section className="min-h-screen py-48 px-12 border-b border-cyan-500/10">
                        <div className="max-w-7xl mx-auto">
                            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-right mb-32">
                                <h2 className="text-6xl font-black italic uppercase tracking-tighter border-r-8 border-cyan-500 pr-10 mb-6 text-white inline-block">{techTitle}</h2>
                                <p className="text-cyan-500/60 uppercase tracking-[0.4em] text-sm font-bold">{techSubtitle}</p>
                            </motion.div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                                {[ { name: 'HTML5_CORE', icon: Code2, color: 'text-orange-500' }, { name: 'CSS3_PLASMA', icon: Layers, color: 'text-blue-500' }, { name: 'JS_NEURAL', icon: Zap, color: 'text-yellow-400' }, { name: 'REACT_FRAME', icon: Cpu, color: 'text-cyan-400' }, { name: 'VITE_SPEED', icon: Zap, color: 'text-purple-500' }, { name: 'POST_EFFECTS', icon: Sparkles, color: 'text-rose-400' }, { name: 'QUANTUM_DB', icon: Database, color: 'text-emerald-400' }, { name: 'THREE_SPACE', icon: Globe, color: 'text-indigo-400' } ].map((tech, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group flex flex-col items-center justify-center p-12 border border-white/10 bg-white/[0.02] hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all rounded-[2.5rem]">
                                        <tech.icon className={`${tech.color} mb-6 group-hover:scale-125 transition-transform`} size={48} />
                                        <span className="text-xs font-black tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors uppercase">{tech.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* DIAGNOSTICS */}
                    <section className="min-h-screen py-48 px-12">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center text-left">
                            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative text-left">
                                <div className="absolute -top-32 -left-24 text-[15rem] font-black text-white/[0.03] pointer-events-none select-none">DATA</div>
                                <h2 className="text-7xl font-black italic uppercase leading-none mb-16 text-white" dangerouslySetInnerHTML={{ __html: diagTitle.replace(' ', ' <br /> <span class="text-cyan-500 italic">') + '</span>' }}></h2>
                                <div className="space-y-16">
                                    <div className="flex items-start space-x-8 text-left">
                                        <div className="p-5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl"><BarChart3 className="text-cyan-400" size={32} /></div>
                                        <div className="text-left"><h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Zero_Latency_Runtime</h4><p className="text-sm text-gray-400 font-bold leading-relaxed max-w-sm uppercase tracking-wider">{diagDesc}</p></div>
                                    </div>
                                    <div className="flex items-start space-x-8 text-left">
                                        <div className="p-5 bg-purple-500/10 border border-purple-500/30 rounded-2xl"><Workflow className="text-purple-400" size={32} /></div>
                                        <div className="text-left"><h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Neural_Thread_Pooling</h4><p className="text-sm text-gray-400 font-bold leading-relaxed max-w-sm uppercase tracking-wider">Intelligent resource allocation dynamically scales with complex 3D rendering loads.</p></div>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="grid grid-cols-2 gap-6">
                                {[ { label: 'CPU_LOAD', val: '12%', color: 'bg-cyan-500' }, { label: 'RAM_ALLOC', val: '256MB', color: 'bg-blue-500' }, { label: 'DISK_WRITE', val: '0.0ms', color: 'bg-emerald-500' }, { label: 'NET_PING', val: '1ms', color: 'bg-purple-500' } ].map((box, i) => (
                                    <motion.div key={i} whileHover={{ y: -10 }} className="p-10 bg-white/[0.03] border border-white/10 rounded-[3rem] flex flex-col justify-between h-64 text-left">
                                        <span className="text-xs font-black text-gray-500 tracking-[0.4em] uppercase">{box.label}</span>
                                        <div className="text-left"><div className="text-5xl font-black text-white mb-4">{box.val}</div><div className={`h-1.5 w-full ${box.color} shadow-[0_0_15px_currentColor] opacity-60`} /></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* UPLINK SYNC */}
                    <section className="min-h-screen py-48 px-12 flex items-center justify-center relative overflow-hidden bg-cyan-500/[0.01]">
                        <div className="absolute inset-0 bg-scanlines opacity-[0.03]" />
                        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-5xl text-center z-10">
                            <Users2 className="text-cyan-400 mx-auto mb-12" size={80} /><h2 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-12 leading-none" dangerouslySetInnerHTML={{ __html: uplinkTitle.replace(' ', ' <br /> <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">') + '</span>' }}></h2><p className="text-lg text-gray-400 font-bold uppercase tracking-[0.4em] leading-loose mb-20 px-12">{uplinkSubtitle}</p>
                            <div className="inline-flex space-x-8"><div className="px-10 py-4 border-2 border-cyan-500/30 rounded-full text-xs font-black text-cyan-400 tracking-[0.3em] uppercase backdrop-blur-md">P2P_ENCRYPTED</div><div className="px-10 py-4 border-2 border-blue-500/30 rounded-full text-xs font-black text-blue-400 tracking-[0.3em] uppercase backdrop-blur-md">VOICE_NEURAL</div></div>
                        </motion.div>
                    </section>

                    {/* FEATURES */}
                    <section className="min-h-screen py-48 px-12 bg-black/60 backdrop-blur-md border-y border-cyan-500/10">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center text-left">
                                <div className="grid grid-cols-1 gap-8 text-left">
                                    {[ { title: 'SYNTAX_ORACLE', icon: Brain, desc: 'AI-driven code prediction engine trained on billions of neural patterns.' }, { title: 'INSTANT_INJECT', icon: MousePointer2, desc: 'Hot-module replacement that doesn\'t just reload—it evolves your UI.' }, { title: 'DNA_VERSIONING', icon: Dna, desc: 'Immutable version control that stores your code\'s history in a neural chain.' } ].map((item, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="p-10 border border-white/10 bg-white/[0.01] hover:border-cyan-500/40 rounded-[3rem] flex items-center space-x-10 transition-all group text-left">
                                            <div className="p-5 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500 group-hover:text-black transition-all"><item.icon size={32} /></div>
                                            <div className="text-left"><h5 className="font-black text-white uppercase tracking-tighter text-2xl mb-2 text-left">{item.title}</h5><p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed text-left">{item.desc}</p></div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="text-left"><h2 className="text-6xl font-black italic uppercase leading-none text-white mb-10 border-l-[12px] border-white pl-10 text-left" dangerouslySetInnerHTML={{ __html: featuresTitle.replace(/ /g, '<br/>') }}></h2><p className="text-lg text-gray-400 font-bold leading-relaxed mb-16 uppercase tracking-[0.2em] text-left">{featuresSubtitle}</p><Link href={route('register')} className="inline-flex items-center text-sm font-black text-cyan-400 uppercase tracking-[0.5em] group text-left">Initialize All Modules <ArrowRight className="ml-6 group-hover:translate-x-4 transition-transform text-left" /></Link></div>
                            </div>
                        </div>
                    </section>

                    {/* PRICING */}
                    <section className="min-h-screen py-48 px-12 flex flex-col items-center justify-center text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-6xl w-full">
                            <Key className="text-cyan-400 mx-auto mb-16 animate-[bounce_3s_infinite]" size={64} /><h2 className="text-8xl font-black italic uppercase tracking-tighter text-white mb-24 text-center">{pricingTitle}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                                {[ { level: 'ALPHA', price: 'FREE', access: 'PUBLIC_LABS', color: 'border-white/10' }, { level: 'OMEGA', price: '$12/mo', access: 'PRIVATE_CELLS', color: 'border-cyan-500 shadow-[0_0_50px_rgba(34,211,238,0.2)]' }, { level: 'ENTITY', price: 'CUSTOM', access: 'NETWORK_WIDE', color: 'border-purple-500' } ].map((tier, i) => (
                                    <div key={i} className={`p-16 border-2 ${tier.color} bg-black/80 backdrop-blur-2xl rounded-[4rem] space-y-10 flex flex-col items-center transition-all hover:scale-105 group text-left`}><span className="text-xs font-black text-gray-500 tracking-[0.6em] uppercase text-center">{tier.level}_LEVEL</span><div className="text-6xl font-black text-white tracking-tighter text-center">{tier.price}</div><div className="text-xs font-black text-cyan-400 uppercase tracking-[0.4em] mb-4 text-center">{tier.access}</div><button className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Request_Access</button></div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    <footer className="py-32 px-12 bg-black border-t border-cyan-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 text-left">
                            <div className="md:col-span-2 text-left"><div className="flex items-center space-x-5 mb-10 text-left"><Code2 className="text-cyan-400" size={40} /><span className="text-4xl font-black italic uppercase tracking-tighter text-white text-left">HOACodeLab</span></div><p className="text-sm text-gray-500 font-bold uppercase tracking-widest max-w-md mb-16 leading-loose text-left text-left">Establishing the primary neural link for the next generation of software engineers. Secure. Infinite. Optimized.</p><div className="flex space-x-8 text-left"><a href="#" className="p-5 border border-white/10 rounded-2xl text-gray-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:bg-cyan-500/5"><Github size={24} /></a><a href="#" className="p-5 border border-white/10 rounded-2xl text-gray-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:bg-cyan-500/5"><Server size={24} /></a><a href="#" className="p-5 border border-white/10 rounded-2xl text-gray-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:bg-cyan-500/5"><Database size={24} /></a></div></div>
                            <div className="text-left"><h4 className="text-xs font-black uppercase tracking-[0.5em] text-cyan-500 mb-10 text-left">Protocol</h4><ul className="space-y-6 text-left"><li><a href="#" className="text-gray-500 hover:text-white text-sm font-bold uppercase transition-colors tracking-[0.2em] flex items-center"><ChevronRight size={16} className="mr-3" /> Security_Log</a></li><li><a href="#" className="text-gray-500 hover:text-white text-sm font-bold uppercase transition-colors tracking-[0.2em] flex items-center"><ChevronRight size={16} className="mr-3" /> API_Docs</a></li><li><a href="#" className="text-gray-500 hover:text-white text-sm font-bold uppercase transition-colors tracking-[0.2em] flex items-center"><ChevronRight size={16} className="mr-3" /> Network_Status</a></li></ul></div>
                            <div className="text-left"><h4 className="text-xs font-black uppercase tracking-[0.5em] text-cyan-500 mb-10 text-left">Uplinks</h4><ul className="space-y-6 text-left"><li><a href="#" className="text-gray-500 hover:text-white text-sm font-bold uppercase transition-colors tracking-[0.2em] flex items-center"><ChevronRight size={16} className="mr-3" /> Enterprise</a></li><li><a href="#" className="text-gray-500 hover:text-white text-sm font-bold uppercase transition-colors tracking-[0.2em] flex items-center"><ChevronRight size={16} className="mr-3" /> Lab_Resources</a></li><li><a href="#" className="text-gray-500 hover:text-white text-sm font-bold uppercase transition-colors tracking-[0.2em] flex items-center"><ChevronRight size={16} className="mr-3" /> Core_SLA</a></li></ul></div>
                        </div>
                        <div className="mt-32 pt-16 border-t border-white/10 flex flex-col md:row justify-between items-center text-xs font-bold text-gray-700 uppercase tracking-[0.6em]"><span>HOACodeLab // NODE_IDENTIFIER: 833B-DA69-291C</span><div className="flex items-center space-x-4 mt-6 md:mt-0"><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]" /><span className="text-gray-500 uppercase text-left">Global_Systems_Operational</span></div></div>
                    </footer>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                body { 
                    background-color: black; 
                    cursor: crosshair; 
                    font-family: ${typoFont}; 
                    font-size: ${typoBodySize};
                    line-height: ${typoLineHeightBody};
                    font-weight: ${typoWeightBody};
                } 
                h1, h2, h3, h4, h5, h6 {
                    line-height: ${typoLineHeightHeadings};
                    letter-spacing: ${typoLetterSpacingHeadings};
                    text-transform: ${typoTransformHeadings};
                    font-weight: ${typoWeightHeadings} !important;
                }
                h1 { font-size: ${typoH1} !important; }
                h2 { font-size: ${typoH2} !important; }
                h3 { font-size: ${typoH3} !important; }
                h4 { font-size: ${typoH4} !important; }
                h5 { font-size: ${typoH5} !important; }
                h6 { font-size: ${typoH6} !important; }
                .bg-scanlines { background: linear-gradient(to bottom, transparent 50%, black 50%); background-size: 100% 4px; }
            ` }} />
        </div>
    );
}
