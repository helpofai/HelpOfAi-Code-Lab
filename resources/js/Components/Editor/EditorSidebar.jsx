import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, PlusCircle, Lock, Unlock, Crown, Cloud, CloudOff, RefreshCw, Globe, Server, Code, Shield, Users, Settings, Layers, Activity, Tag, CreditCard } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';
import { useToast } from '@/Components/Toast/ToastProvider';
import useProjectStore from '@/Stores/useProjectStore';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';
import axios from 'axios';

export default function EditorSidebar({ 
    activeSidebar, 
    setActiveSidebar, 
    setLogs, 
    projectData, 
    handleSave, 
    handleFork, 
    handleExport,
    fetchCollections,
    setActiveModal,
    diffRevision,
    handleCloudSave
}) {
    const { auth } = usePage().props;
    const isPro = auth.user?.role === 'admin' || auth.user?.role === 'paid-user';

    const { 
        html, css, js, title,
        externalLibraries, setExternalLibraries, 
        fontSize, setFontSize, 
        wordWrap, setWordWrap,
        isPrivate, setIsPrivate,
        isForSale, setIsForSale,
        price, setPrice,
        google_drive_file_id, setGoogleDriveFileId,
        setProject,
        setHtml, setCss, setJs, // Added these
        // Advanced Settings
        theme, setTheme,
        minimap, setMinimap,
        preprocessors, setPreprocessor
    } = useProjectStore();

    const injectTemplate = (id) => {
        if (!confirm('This protocol will overwrite current buffers. Proceed?')) return;

        if (id === '3d-card') {
            setHtml(`<div class="neural-container">\n  <div class="card">\n    <div class="glow"></div>\n    <div class="content">\n      <div class="header">\n        <span class="version">Build v1.5.0</span>\n        <div class="pulse-icon"></div>\n      </div>\n      <h2>HOA_CodeLab</h2>\n      <p>Technical_Prototyping_Node</p>\n      <div class="footer">\n        <span id="status">Protocol: Active</span>\n        <div class="latency">0.04ms</div>\n      </div>\n    </div>\n  </div>\n</div>`);
            setCss(`body {\n  background: #050505 !important;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  margin: 0;\n}\n\n.neural-container {\n  perspective: 1000px;\n}\n\n.card {\n  width: 320px;\n  background: rgba(255, 255, 255, 0.03);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 24px;\n  padding: 30px;\n  position: relative;\n  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);\n  overflow: hidden;\n  cursor: crosshair;\n}\n\n.glow {\n  position: absolute;\n  top: 0; left: 0; width: 100%; height: 100%;\n  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(6, 182, 212, 0.2) 0%, transparent 50%);\n  pointer-events: none;\n}\n\nh2 {\n  color: white;\n  font-family: sans-serif;\n  font-weight: 900;\n  font-style: italic;\n  letter-spacing: -1px;\n  margin: 20px 0 5px;\n}\n\np {\n  color: #64748b;\n  font-size: 10px;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  font-family: sans-serif;\n}\n\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.version {\n  color: #06b6d4;\n  font-size: 8px;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n\n.pulse-icon {\n  width: 6px; height: 6px;\n  background: #10b981;\n  border-radius: 50%;\n  box-shadow: 0 0 10px #10b981;\n  animation: pulse 2s infinite;\n}\n\n.footer {\n  margin-top: 40px;\n  padding-top: 20px;\n  border-top: 1px solid rgba(255, 255, 255, 0.05);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 8px;\n  font-weight: 900;\n  color: #475569;\n  text-transform: uppercase;\n  font-family: monospace;\n}\n\n.latency { color: #06b6d4; }\n\n@keyframes pulse {\n  0% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.5); opacity: 0.5; }\n  100% { transform: scale(1); opacity: 1; }\n}`);
            setJs(`const card = document.querySelector('.card');\nconst container = document.querySelector('.neural-container');\n\nif (container && card) {\n  container.addEventListener('mousemove', (e) => {\n    const rect = card.getBoundingClientRect();\n    const x = e.clientX - rect.left;\n    const y = e.clientY - rect.top;\n    \n    card.style.setProperty('--x', \`\${x}px\`);\n    card.style.setProperty('--y', \`\${y}px\`);\n    \n    const rotateX = (y - rect.height / 2) / 10;\n    const rotateY = (rect.width / 2 - x) / 10;\n    \n    card.style.transform = \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;\n  });\n\n  container.addEventListener('mouseleave', () => {\n    card.style.transform = 'rotateX(0deg) rotateY(0deg)';\n  });\n}\n\nconsole.log("Handshake_Successful: 3D Card Engine Online.");`);
        } else if (id === 'neural-matrix') {
            setHtml(`<div class="neural-substrate">\n  <canvas id="neural-canvas"></canvas>\n  <div class="ui-overlay">\n    <div class="status-bar">\n      <span class="pulse"></span>\n      <span>NODE_STATUS: OPTIMIZED</span>\n    </div>\n    <div class="telemetry">\n      <h1>NEURAL_CORE_v2</h1>\n      <p>INTERACTIVE_PARTICLE_MATRIX</p>\n    </div>\n    <div class="footer-stats">\n      <div class="stat">CORES: 128</div>\n      <div class="stat">LATENCY: 0.02ms</div>\n    </div>\n  </div>\n</div>`);
            setCss(`body {\n  background: #050505 !important;\n  margin: 0; overflow: hidden;\n  font-family: 'Inter', sans-serif;\n}\n\n.neural-substrate {\n  position: relative;\n  width: 100vw; height: 100vh;\n}\n\n#neural-canvas {\n  position: absolute;\n  inset: 0; z-index: 1;\n}\n\n.ui-overlay {\n  position: relative;\n  z-index: 2; height: 100%;\n  display: flex; flex-direction: column;\n  justify-content: space-between;\n  padding: 40px; pointer-events: none;\n}\n\n.status-bar {\n  display: flex; items-center: center; gap: 10px;\n  color: #06b6d4; font-size: 10px; font-weight: 900;\n  letter-spacing: 2px;\n}\n\n.pulse {\n  width: 8px; height: 8px; background: #06b6d4;\n  border-radius: 50%; animation: glow 2s infinite;\n}\n\nh1 {\n  color: white; font-size: 4rem; font-weight: 900;\n  margin: 0; letter-spacing: -2px; font-style: italic;\n  text-shadow: 0 0 30px rgba(6,182,212,0.3);\n}\n\np {\n  color: #475569; font-size: 12px; font-weight: 800;\n  letter-spacing: 5px; margin-top: 5px;\n}\n\n.footer-stats {\n  display: flex; gap: 40px;\n  color: #1e293b; font-size: 9px; font-weight: 900;\n  letter-spacing: 2px; border-top: 1px solid #1e293b;\n  padding-top: 20px;\n}\n\n@keyframes glow {\n  0%, 100% { opacity: 1; transform: scale(1); }\n  50% { opacity: 0.3; transform: scale(1.5); }\n}`);
            setJs(`const canvas = document.getElementById('neural-canvas');\nconst ctx = canvas.getContext('2d');\nlet particles = [];\nconst mouse = { x: null, y: null, radius: 150 };\n\nwindow.addEventListener('resize', resize);\nwindow.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });\n\nfunction resize() {\n  canvas.width = window.innerWidth;\n  canvas.height = window.innerHeight;\n}\n\nclass Particle {\n  constructor() {\n    this.x = Math.random() * canvas.width;\n    this.y = Math.random() * canvas.height;\n    this.size = Math.random() * 2 + 1;\n    this.vx = (Math.random() - 0.5) * 2;\n    this.vy = (Math.random() - 0.5) * 2;\n  }\n  update() {\n    this.x += this.vx; this.y += this.vy;\n    if (this.x > canvas.width || this.x < 0) this.vx *= -1;\n    if (this.y > canvas.height || this.y < 0) this.vy *= -1;\n    \n    let dx = mouse.x - this.x; let dy = mouse.y - this.y;\n    let dist = Math.sqrt(dx*dx + dy*dy);\n    if (dist < mouse.radius) {\n      this.x -= dx/20; this.y -= dy/20;\n    }\n  }\n  draw() {\n    ctx.fillStyle = 'rgba(6,182,212,0.8)';\n    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);\n    ctx.fill();\n  }\n}\n\nfunction init() {\n  particles = [];\n  for (let i=0; i<100; i++) particles.push(new Particle());\n}\n\nfunction animate() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  particles.forEach(p => {\n    p.update(); p.draw();\n    particles.forEach(other => {\n      let dx = p.x - other.x; let dy = p.y - other.y;\n      let dist = Math.sqrt(dx*dx + dy*dy);\n      if (dist < 100) {\n        ctx.strokeStyle = \`rgba(6, 182, 212, \${1 - dist/100})\`;\n        ctx.lineWidth = 0.5;\n        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(other.x, other.y);\n        ctx.stroke();\n      }\n    });\n  });\n  requestAnimationFrame(animate);\n}\n\nresize(); init(); animate();\nconsole.log("Handshake_Successful: Generative Core Online.");`);
        }
        
        setActiveSidebar(null);
    };

    const [isLinking, setIsLinking] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [revisions, setRevisions] = useState([]);
    const [isLoadingRevisions, setIsLoadingRevisions] = useState(false);
    const [userAssets, setUserAssets] = useState([]);
    const [isLoadingAssets, setIsLoadingAssets] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (activeSidebar === 'history' && projectData?.id) {
            fetchRevisions();
        }
        if (activeSidebar === 'assets') {
            fetchAssets();
        }
    }, [activeSidebar]);

    const fetchRevisions = async () => {
        setIsLoadingRevisions(true);
        try {
            const res = await axios.get(`/api/projects/${projectData.id}/revisions`);
            setRevisions(res.data);
        } catch (e) {
            console.error("Archive_Access_Denied");
        } finally {
            setIsLoadingRevisions(false);
        }
    };

    const restoreRevision = async (id) => {
        if (!confirm('Revert core to this state? Current local buffers will be overwritten.')) return;
        try {
            const res = await axios.post(`/api/projects/${projectData.id}/revisions/${id}/restore`);
            setProject(res.data);
            toast.success('Core_Restoration_Complete');
        } catch (e) {
            toast.error('Restoration_Protocol_Failed');
        }
    };

    const openDiff = (revision) => {
        diffRevision(revision);
    };

    const fetchAssets = async () => {
        setIsLoadingAssets(true);
        try {
            const res = await axios.get('/api/assets');
            setUserAssets(res.data);
        } catch (e) {
            console.error("Asset_Index_Failed");
        } finally {
            setIsLoadingAssets(false);
        }
    };

    const handleAssetUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);

        setIsUploading(true);
        try {
            await axios.post('/api/assets', formData);
            fetchAssets();
        } catch (e) {
            toast.error('Asset_Transmission_Failed');
        } finally {
            setIsUploading(false);
        }
    };

    const copyAssetUrl = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('URL_Copied_to_Buffer');
    };

    const deleteAsset = async (id) => {
        if (!confirm('Purge asset from memory?')) return;
        try {
            await axios.delete(`/api/assets/${id}`);
            setUserAssets(userAssets.filter(a => a.id !== id));
        } catch (e) {
            toast.error('Purge_Failed');
        }
    };

    const linkCloud = async () => {
        setIsLinking(true);
        try {
            window.location.href = '/api/google-drive/auth';
        } catch (e) {
            console.error("Cloud_Uplink_Refused");
        } finally {
            setIsLinking(false);
        }
    };

    return (
        <AnimatePresence>
            {activeSidebar && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveSidebar(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-[400px] max-w-full bg-[var(--bg-surface)] border-l border-[var(--border)] z-[101] shadow-2xl flex flex-col"
                    >
                        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg-main)]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                                    {activeSidebar === 'settings' && <Settings size={16} />}
                                    {activeSidebar === 'assets' && <Server size={16} />}
                                    {activeSidebar === 'cloud' && <Cloud size={16} />}
                                    {activeSidebar === 'history' && <RefreshCw size={16} />}
                                    {activeSidebar === 'team' && <Shield size={16} />}
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-main)] italic">
                                    {activeSidebar === 'settings' && 'System_Config'}
                                    {activeSidebar === 'assets' && 'Asset_Manager'}
                                    {activeSidebar === 'cloud' && 'Cloud_Core'}
                                    {activeSidebar === 'history' && 'Core_History'}
                                    {activeSidebar === 'team' && 'Unit_Personnel'}
                                </h3>
                            </div>
                            <button onClick={() => setActiveSidebar(null)} className="p-2 hover:bg-[var(--bg-elevated)] rounded-lg text-[var(--text-muted)] hover:text-white transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {activeSidebar === 'settings' && (
                                <div className="space-y-8 text-left">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Pro_Editor_Theme</label>
                                            <select 
                                                value={theme}
                                                onChange={(e) => setTheme(e.target.value)}
                                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)] focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                                            >
                                                <option value="vs-dark">Standard Dark</option>
                                                <option value="light">High Contrast Light</option>
                                                <option value="dracula">Dracula Pro</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Neural_Minimap</label>
                                                <button 
                                                    onClick={() => setMinimap(!minimap)}
                                                    className={`relative w-8 h-4 rounded-full transition-colors ${minimap ? 'bg-cyan-500' : 'bg-slate-700'}`}
                                                >
                                                    <motion.div 
                                                        animate={{ x: minimap ? 18 : 2 }}
                                                        className="absolute top-0.5 w-3 h-3 bg-white rounded-full"
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-[var(--border)] space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 italic">External_Resources</h4>
                                                <button 
                                                    onClick={() => setExternalLibraries([...externalLibraries, ''])}
                                                    className="p-1 bg-cyan-500/10 text-cyan-500 rounded hover:bg-cyan-500 hover:text-black transition-all"
                                                >
                                                    <PlusCircle size={12} />
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                {externalLibraries.map((lib, index) => (
                                                    <div key={index} className="flex items-center gap-2 group">
                                                        <input 
                                                            type="text" 
                                                            value={lib}
                                                            onChange={(e) => {
                                                                const newLibs = [...externalLibraries];
                                                                newLibs[index] = e.target.value;
                                                                setExternalLibraries(newLibs);
                                                            }}
                                                            placeholder="https://cdn.link/library.js"
                                                            className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded px-3 py-1.5 text-[9px] text-[var(--text-main)] focus:border-cyan-500 outline-none"
                                                        />
                                                        <button 
                                                            onClick={() => setExternalLibraries(externalLibraries.filter((_, i) => i !== index))}
                                                            className="p-1.5 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded transition-all"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {externalLibraries.length === 0 && (
                                                    <p className="text-[8px] text-[var(--text-muted)] italic py-2">No external CDN libraries linked.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-[var(--border)] space-y-4">
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 italic">Template_Protocols</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { 
                                                        id: '3d-card', 
                                                        name: '3D_Neural_Card', 
                                                        icon: Layers,
                                                        desc: 'Perspective & Glow'
                                                    },
                                                    { 
                                                        id: 'neural-matrix', 
                                                        name: 'Neural_Matrix_v2', 
                                                        icon: Activity,
                                                        desc: 'Generative Particles'
                                                    }
                                                ].map(template => (
                                                    <button
                                                        key={template.id}
                                                        type="button"
                                                        onClick={() => injectTemplate(template.id)}
                                                        className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl hover:border-cyan-500/40 transition-all text-left group"
                                                    >
                                                        <template.icon size={16} className="text-[var(--text-muted)] group-hover:text-cyan-500 transition-colors mb-3" />
                                                        <p className="text-[9px] font-black uppercase text-white mb-1">{template.name}</p>
                                                        <p className="text-[7px] font-bold text-[var(--text-muted)] uppercase">{template.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-[var(--border)] space-y-4">
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 italic">Preprocessors</h4>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Styles (CSS)</label>
                                                    <div className="flex bg-[var(--bg-main)] p-1 rounded border border-[var(--border)]">
                                                        {['css', 'scss', 'sass'].map(type => (
                                                            <button 
                                                                key={type}
                                                                onClick={() => setPreprocessor('css', type)}
                                                                className={`flex-1 py-1.5 text-[8px] font-bold uppercase rounded transition-all ${preprocessors.css === type ? 'bg-cyan-500 text-black' : 'text-[var(--text-muted)] hover:text-white'}`}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Scripts (JS)</label>
                                                    <div className="flex bg-[var(--bg-main)] p-1 rounded border border-[var(--border)]">
                                                        {['js', 'babel', 'typescript'].map(type => (
                                                            <button 
                                                                key={type}
                                                                onClick={() => setPreprocessor('js', type)}
                                                                className={`flex-1 py-1.5 text-[8px] font-bold uppercase rounded transition-all ${preprocessors.js === type ? 'bg-cyan-500 text-black' : 'text-[var(--text-muted)] hover:text-white'}`}
                                                            >
                                                                {type === 'babel' ? 'React/JSX' : type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-6 border-t border-[var(--border)]">
                                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Font Size ({fontSize}px)</label>
                                            <input 
                                                type="range" min="10" max="24" value={fontSize} 
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                className="w-full h-1 bg-[var(--bg-elevated)] rounded-full appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Word Wrap</label>
                                            <div className="flex bg-[var(--bg-main)] p-1 rounded border border-[var(--border)]">
                                                <button onClick={() => setWordWrap('on')} className={`flex-1 py-2 text-[9px] font-bold uppercase rounded transition-all ${wordWrap === 'on' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>On</button>
                                                <button onClick={() => setWordWrap('off')} className={`flex-1 py-2 text-[9px] font-bold uppercase rounded transition-all ${wordWrap === 'off' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Off</button>
                                            </div>
                                        </div>

                                        {isPro && (
                                            <>
                                                <div className="pt-6 border-t border-[var(--border)] space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] italic">Privacy</label>
                                                    </div>
                                                    
                                                    <div className={`p-4 rounded-xl border transition-all ${isPrivate ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                {isPrivate ? <Lock size={14} className="text-rose-500" /> : <Unlock size={14} className="text-emerald-500" />}
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">{isPrivate ? 'Private' : 'Public'}</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => setIsPrivate(!isPrivate)}
                                                                className={`relative w-10 h-5 rounded-full transition-colors ${isPrivate ? 'bg-rose-500' : 'bg-slate-700'}`}
                                                            >
                                                                <motion.div 
                                                                    animate={{ x: isPrivate ? 20 : 2 }}
                                                                    className="absolute top-1 w-3 h-3 bg-white rounded-full"
                                                                />
                                                            </button>
                                                        </div>
                                                        <p className="text-[8px] leading-relaxed text-[var(--text-muted)] font-medium uppercase tracking-tighter italic">
                                                            {isPrivate 
                                                                ? 'Restricted: This node is hidden from the explore grid and search protocols.' 
                                                                : 'Open: This node is visible to the entire community matrix.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-[var(--border)] space-y-4">
                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 italic">Marketplace_Monetization</h4>
                                                    <div className={`p-4 rounded-xl border transition-all ${isForSale ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-[var(--bg-main)] border-[var(--border)]'}`}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <Tag size={14} className={isForSale ? 'text-cyan-500' : 'text-[var(--text-muted)]'} />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">List for Sale</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => setIsForSale(!isForSale)}
                                                                className={`relative w-10 h-5 rounded-full transition-colors ${isForSale ? 'bg-cyan-500' : 'bg-slate-700'}`}
                                                            >
                                                                <motion.div 
                                                                    animate={{ x: isForSale ? 20 : 2 }}
                                                                    className="absolute top-1 w-3 h-3 bg-white rounded-full"
                                                                />
                                                            </button>
                                                        </div>
                                                        
                                                        {isForSale && (
                                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[8px] font-black uppercase text-cyan-500 tracking-widest">Unit Price (USD)</span>
                                                                    <CreditCard size={12} className="text-cyan-500/50" />
                                                                </div>
                                                                <input 
                                                                    type="number" 
                                                                    step="0.01"
                                                                    value={price}
                                                                    onChange={(e) => setPrice(e.target.value)}
                                                                    className="w-full bg-[var(--bg-main)] border border-cyan-500/30 rounded-lg px-3 py-2 text-[10px] text-cyan-400 font-mono outline-none focus:border-cyan-500 transition-all"
                                                                    placeholder="0.00"
                                                                />
                                                                <p className="text-[7px] text-[var(--text-muted)] italic uppercase font-bold tracking-tighter">Code will be blurred until purchased. Live previews remain accessible.</p>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeSidebar === 'team' && (
                                <div className="space-y-8 text-left">
                                    <div className="flex items-center gap-3 text-purple-500 font-black text-[10px] uppercase tracking-widest italic">
                                        <Shield size={14} /> Unit_Personnel
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {projectData?.team ? (
                                            <>
                                                <div className="p-4 bg-[var(--bg-elevated)] border border-purple-500/20 rounded-xl">
                                                    <p className="text-[8px] font-black uppercase text-purple-500 mb-2">Assigned Unit</p>
                                                    <p className="text-sm font-bold text-white">{projectData.team.name}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">Active_Agents</label>
                                                    <div className="divide-y divide-[var(--border)] bg-[var(--bg-main)] rounded-xl border border-[var(--border)]">
                                                        <div className="p-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-500 font-black">Y</div>
                                                                <span className="text-[10px] font-bold text-white">You (Active)</span>
                                                            </div>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        </div>
                                                        {/* Mock presence - in a real app this would be driven by Echo */}
                                                        <div className="p-3 flex items-center justify-between opacity-40">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-[var(--text-muted)] font-black">A</div>
                                                                <span className="text-[10px] font-bold text-[var(--text-muted)]">Agent_0x (Offline)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-20 text-center space-y-4 opacity-40 italic">
                                                <Users size={32} className="mx-auto" />
                                                <p className="text-[10px] font-black uppercase tracking-widest">Isolated_Module</p>
                                                <p className="text-[8px] font-bold uppercase">Assign to a team in Archives to enable collaboration.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeSidebar === 'assets' && (
                                <div className="space-y-8 text-left">
                                    <div className="p-6 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl border-dashed border-cyan-500/20 relative group hover:bg-cyan-500/5 transition-all">
                                        <input type="file" onChange={handleAssetUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={isUploading} />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-500 group-hover:scale-110 transition-transform">
                                                {isUploading ? <RefreshCw className="animate-spin" size={24} /> : <PlusCircle size={24} />}
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Transmit_Asset</p>
                                            <p className="text-[8px] text-[var(--text-muted)] uppercase font-medium">Inject images or scripts into node</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] italic">Module_Payloads</h4>
                                            <span className="text-[8px] font-bold bg-[var(--bg-elevated)] px-2 py-0.5 rounded text-cyan-500 border border-[var(--border)]">{userAssets.length} Assets</span>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {isLoadingAssets ? (
                                                <div className="py-10 text-center text-[9px] font-bold text-[var(--text-muted)] animate-pulse uppercase tracking-widest italic">Indexing Assets...</div>
                                            ) : userAssets.length > 0 ? (
                                                userAssets.map((asset) => (
                                                    <div 
                                                        key={asset.id} 
                                                        draggable
                                                        onDragStart={(e) => e.dataTransfer.setData('text/plain', asset.url)}
                                                        className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl group hover:border-cyan-500/20 transition-all text-left cursor-grab active:cursor-grabbing"
                                                    >
                                                        <div className="flex items-center gap-4 mb-3 pointer-events-none">
                                                            <div className="w-10 h-10 bg-[var(--bg-elevated)] rounded-lg overflow-hidden border border-[var(--border)] flex items-center justify-center">
                                                                {asset.type.startsWith('image/') ? (
                                                                    <img src={asset.url} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Code size={14} className="text-cyan-500/40" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                    <p className="text-[10px] font-black uppercase tracking-tight text-[var(--text-main)] truncate">{asset.name}</p>
                                                                    <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{(asset.size / 1024).toFixed(1)} KB</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => copyAssetUrl(asset.url)}
                                                                className="flex-1 py-1.5 bg-cyan-500 text-black rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                                                            >
                                                                Copy URL
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteAsset(asset.id)}
                                                                className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-10 text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic opacity-40">No payloads detected.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSidebar === 'history' && (
                                <div className="space-y-8 text-left">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] italic">Archive_Timeline</h4>
                                            <button onClick={fetchRevisions} className="p-1.5 hover:bg-[var(--bg-elevated)] rounded transition-colors text-[var(--text-muted)] hover:text-cyan-500"><RefreshCw size={14} /></button>
                                        </div>
                                        
                                        {projectData?.id ? (
                                            <div className="space-y-4">
                                                <div className="space-y-3">
                                                    {isLoadingRevisions ? (
                                                        <div className="py-10 text-center text-[9px] font-bold text-[var(--text-muted)] animate-pulse uppercase tracking-widest italic">Accessing Logs...</div>
                                                    ) : revisions.length > 0 ? (
                                                        revisions.map((rev) => (
                                                            <div key={rev.id} className="p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl group hover:border-cyan-500/30 transition-all">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="space-y-1">
                                                                        <p className="text-[10px] font-black uppercase tracking-tight text-[var(--text-main)]">{rev.commit_message}</p>
                                                                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{new Date(rev.created_at).toLocaleString()}</p>
                                                                    </div>
                                                                    <div className="p-1 bg-[var(--bg-main)] rounded text-[8px] font-black text-cyan-500 uppercase">v{rev.id}</div>
                                                                </div>
                                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button 
                                                                        onClick={() => restoreRevision(rev.id)}
                                                                        className="flex-1 py-1.5 bg-white text-black rounded text-[8px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-colors"
                                                                    >
                                                                        Restore
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => openDiff(rev)}
                                                                        className="flex-1 py-1.5 bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)] rounded text-[8px] font-black uppercase tracking-widest hover:text-white transition-colors"
                                                                    >
                                                                        Compare
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="py-10 text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">No historical nodes found.</div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl text-center italic space-y-2">
                                                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Core not initialized.</p>
                                                <p className="text-[8px] text-[var(--text-muted)]/50 uppercase font-medium">Save project to enable history.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeSidebar === 'cloud' && (
                                <div className="space-y-8 text-left">
                                    <div className="p-8 bg-[var(--bg-main)] border border-[var(--border)] rounded-3xl relative overflow-hidden text-center space-y-6 group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Cloud size={100} /></div>
                                        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto shadow-2xl shadow-cyan-500/20">
                                            <Cloud size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Satellite_Link</h4>
                                            <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed px-4">Synchronize local modules with remote cloud archives for decentralized access.</p>
                                        </div>
                                        
                                        {!auth.user?.google_drive_token ? (
                                            <button 
                                                onClick={linkCloud}
                                                disabled={isLinking}
                                                className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all flex items-center justify-center gap-3"
                                            >
                                                {isLinking ? <RefreshCw className="animate-spin" size={14} /> : <Server size={14} />} Establish_Uplink
                                            </button>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Linked</span>
                                                    </div>
                                                    <Link href="/cloud-sync" className="text-[9px] font-black text-[var(--text-muted)] hover:text-white uppercase tracking-widest underline">Manage_Storage</Link>
                                                </div>
                                                <button 
                                                    onClick={handleCloudSave}
                                                    className="w-full py-3 bg-cyan-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-cyan-500/20"
                                                >
                                                    Sync_Local_Node
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
