import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import Editor from '@monaco-editor/react';
import useProjectStore from '@/Stores/useProjectStore';
import { 
    Code2, Eye, Save, Loader2, Settings, X, PlusCircle, 
    Trash2, Maximize2, Terminal, Wand2, ChevronDown, ChevronUp, 
    GripHorizontal, GripVertical, Play, Cloud, Share2,
    FolderPlus, GitFork, Code, Download, MessageSquare, Package, 
    Copy, Check, ExternalLink, Globe, Lock, Unlock, Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserBabel from 'prettier/parser-babel';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function CodeEditor({ auth, project: initialProject }) {
    const { html, css, js, setHtml, setCss, setJs, setProject, title, externalLibraries, setExternalLibraries } = useProjectStore();
    const [previewContent, setPreviewContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [project, setProjectData] = useState(initialProject);
    const [activeSidebar, setActiveSidebar] = useState(null); // 'settings', 'assets', 'comments'
    const [activeModal, setActiveModal] = useState(null); // 'share', 'embed', 'collection'
    const [showConsole, setShowConsole] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isFormatting, setIsFormatting] = useState(false);
    const [newCollectionTitle, setNewCollectionTitle] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (initialProject) {
            setProject(initialProject);
            setProjectData(initialProject);
        }
    }, [initialProject]);

    // Format Code
    const formatCode = async () => {
        setIsFormatting(true);
        setLogs(prev => [...prev, { type: 'LOG', content: '>>> Initializing Prettier_Core...', id: Date.now() }]);
        try {
            const options = { 
                printWidth: 80, 
                tabWidth: 2, 
                useTabs: false, 
                semi: true, 
                singleQuote: false 
            };

            const formattedHtml = await prettier.format(html, { ...options, parser: 'html', plugins: [parserHtml] });
            const formattedCss = await prettier.format(css, { ...options, parser: 'css', plugins: [parserCss] });
            const formattedJs = await prettier.format(js, { ...options, parser: 'babel', plugins: [parserBabel] });

            setHtml(formattedHtml);
            setCss(formattedCss);
            setJs(formattedJs);
            
            setLogs(prev => [...prev, { type: 'LOG', content: '>>> Synthesis_Complete: Syntax optimized.', id: Date.now() }]);
        } catch (err) { 
            console.error(err);
            setLogs(prev => [...prev, { type: 'ERR', content: `SYNTAX_ERROR: ${err.message}`, id: Date.now() }]);
        } finally { 
            setIsFormatting(false); 
        }
    };

    // SrcDoc Generation
    const srcDoc = useMemo(() => {
        const libs = externalLibraries.map(lib => lib.endsWith('.css') ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"></script>`).join('\n');
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { background: white; margin: 0; padding: 0; font-family: sans-serif; }
                    ${css}
                </style>
                <script>
                    console.log = (...args) => {
                        window.parent.postMessage({ type: 'LOG', content: args.join(' ') }, '*');
                    };
                    window.onerror = (m, u, l) => {
                        window.parent.postMessage({ type: 'ERR', content: m + ' (Line: ' + l + ')' }, '*');
                    };
                </script>
            </head>
            <body>${html}<script>${js}</script></body>
            </html>
        `;
    }, [html, css, js, externalLibraries]);

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data.type === 'LOG' || e.data.type === 'ERR') {
                setLogs(prev => [...prev, { type: e.data.type, content: e.data.content, id: Date.now() }].slice(-50));
            }
        };
        window.addEventListener('message', handleMessage);
        const timeout = setTimeout(() => setPreviewContent(srcDoc), 800);
        return () => { window.removeEventListener('message', handleMessage); clearTimeout(timeout); };
    }, [srcDoc]);

    const isOwner = useMemo(() => {
        if (!auth.user) return false;
        if (!project) return true; // New project, allow saving to create
        return project.user_id === auth.user.id;
    }, [auth.user, project]);

    const handleSave = async () => {
        if (!auth.user) {
            if (confirm('Unauthorized access. Initialize identity link (Login) to persist this module?')) {
                window.location.href = route('login');
            }
            return;
        }

        if (!isOwner && project?.id) {
            return handleFork();
        }

        setIsSaving(true);
        try {
            const data = { title, code: { html, css, js }, settings: { externalLibraries }, is_public: true };
            const endpoint = project?.id ? `/api/projects/${project.id}` : '/api/projects';
            const method = project?.id ? 'put' : 'post';
            const res = await axios[method](endpoint, data);
            setProjectData(res.data);
            if (!project?.id) window.history.pushState({}, '', `/editor/${res.data.slug}`);
            setLogs(prev => [...prev, { type: 'LOG', content: '>>> Neural_Sync: Successfully persisted to cloud.', id: Date.now() }]);
        } catch (e) {
            setLogs(prev => [...prev, { type: 'ERR', content: '>>> SYNC_FAILED: Unauthorized or Network Error.', id: Date.now() }]);
        } finally { setIsSaving(false); }
    };

    const handleFork = async () => {
        if (!project?.id) return alert('Save core before forking.');
        try {
            const data = { title: `${title} (Fork)`, code: { html, css, js }, settings: { externalLibraries }, is_public: true };
            const res = await axios.post('/api/projects', data);
            window.location.href = `/editor/${res.data.slug}`;
        } catch(e) {}
    };

    const handleExport = () => {
        const blob = new Blob([srcDoc], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.html`;
        a.click();
    };

    const fetchCollections = async () => {
        const res = await axios.get('/api/collections');
        setCollections(res.data);
    };

    const addToCollection = async (id) => {
        if (!project?.id) return alert('Save core first.');
        await axios.post(`/api/collections/${id}/add`, { project_id: project.id });
        alert('Linked to collection.');
        setActiveModal(null);
    };

    const createCollection = async () => {
        if (!newCollectionTitle) return;
        const res = await axios.post('/api/collections', { title: newCollectionTitle });
        setCollections([...collections, res.data]);
        setNewCollectionTitle('');
    };

    return (
        <div className="h-screen bg-[#131417] text-slate-300 overflow-hidden flex flex-col font-sans">
            <Head title={project ? project.title : 'Neural Lab // Editor'} />

            {/* HEADER */}
            <header className="h-16 bg-[#010101] border-b border-white/5 flex items-center justify-between px-4 md:px-6 z-50 shrink-0">
                <div className="flex items-center space-x-4 md:space-x-6">
                    <Link href="/dashboard" className="flex items-center space-x-3 group">
                        <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                            <Code2 className="text-cyan-400" size={20} />
                        </div>
                        <span className="font-black tracking-tighter text-white uppercase text-sm hidden md:inline">HOACodeLab</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                    <div className="flex flex-col">
                        <input 
                            value={title} 
                            onChange={(e) => useProjectStore.getState().setTitle(e.target.value)}
                            className="bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0 w-32 md:w-48 placeholder-gray-600 truncate"
                            placeholder="Untitled_Module..."
                        />
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1 hidden md:block">Node: {auth.user.name}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-3">
                    <button onClick={formatCode} className="px-3 md:px-4 py-2 bg-[#252830] hover:bg-[#343742] text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Wand2 size={14} className={isFormatting ? 'animate-spin' : ''} /> <span className="hidden md:inline">Format</span>
                    </button>
                    <button onClick={() => setActiveSidebar('settings')} className="p-2.5 bg-[#252830] hover:bg-[#343742] text-white rounded-md transition-all">
                        <Settings size={16} />
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className={`px-4 md:px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                            isOwner || !project ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-white' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                        }`}
                    >
                        {isSaving ? (
                            <Loader2 size={14} className="animate-spin md:mr-2" />
                        ) : (isOwner || !project ? <Cloud size={14} className="md:mr-2" /> : <GitFork size={14} className="md:mr-2" />)}
                        <span className="hidden md:inline">{isOwner || !project ? 'Save_Sync' : 'Fork_Module'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col min-h-0 bg-[#131417]">
                <PanelGroup direction="vertical">
                    <Panel defaultSize={50} minSize={20}>
                        <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
                            {['html', 'css', 'js'].map((type, idx) => (
                                <React.Fragment key={type}>
                                    <Panel defaultSize={33.33} minSize={10}>
                                        <div className="h-full flex flex-col border-b md:border-b-0 md:border-r border-white/5 bg-[#1d1e22]">
                                            <div className="px-4 py-2 bg-[#010101] border-b border-white/5 flex items-center justify-between shrink-0">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`w-2 h-2 rounded-full ${type === 'html' ? 'bg-orange-500' : type === 'css' ? 'bg-blue-500' : 'bg-yellow-400'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{type}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-h-0 relative">
                                                <Editor
                                                    height="100%"
                                                    theme="vs-dark"
                                                    language={type === 'js' ? 'javascript' : type}
                                                    value={type === 'html' ? html : type === 'css' ? css : js}
                                                    onChange={(v) => type === 'html' ? setHtml(v || '') : type === 'css' ? setCss(v || '') : setJs(v || '')}
                                                    options={{ minimap: { enabled: false }, fontSize: 13, automaticLayout: true }}
                                                />
                                            </div>
                                        </div>
                                    </Panel>
                                    {idx < 2 && (
                                        <PanelResizeHandle className={`bg-black hover:bg-cyan-500/30 transition-colors flex items-center justify-center group ${isMobile ? 'h-1 cursor-row-resize' : 'w-1 cursor-col-resize'}`}>
                                            {isMobile ? (
                                                <GripHorizontal size={14} className="text-white/10 group-hover:text-cyan-400" />
                                            ) : (
                                                <GripVertical size={14} className="text-white/10 group-hover:text-cyan-400" />
                                            )}
                                        </PanelResizeHandle>
                                    )}
                                </React.Fragment>
                            ))}
                        </PanelGroup>
                    </Panel>

                    <PanelResizeHandle className="h-1 bg-black hover:bg-cyan-500/30 transition-colors flex items-center justify-center group cursor-row-resize">
                        <GripHorizontal size={14} className="text-white/10 group-hover:text-cyan-400" />
                    </PanelResizeHandle>

                    <Panel defaultSize={50} minSize={10}>
                        <PanelGroup direction="vertical">
                            <Panel minSize={20}>
                                <div className="h-full bg-white relative">
                                    <iframe srcDoc={previewContent} title="p" sandbox="allow-scripts" className="w-full h-full border-none" />
                                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-2 pointer-events-none">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] font-bold uppercase tracking-tighter">Live_Sync_OK</span>
                                    </div>
                                </div>
                            </Panel>

                            {showConsole && (
                                <>
                                    <PanelResizeHandle className="h-1 bg-black hover:bg-cyan-500/30 transition-colors flex items-center justify-center group cursor-row-resize" />
                                    <Panel defaultSize={30} minSize={10}>
                                        <div className="h-full bg-[#131417] flex flex-col border-t border-white/5 font-mono">
                                            <div className="px-4 py-2 bg-[#010101] border-b border-white/5 flex justify-between items-center shrink-0">
                                                <div className="flex items-center space-x-2">
                                                    <Terminal size={12} className="text-cyan-500" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Console</span>
                                                </div>
                                                <button onClick={() => setLogs([])} className="text-[8px] font-bold text-slate-600 hover:text-white uppercase">Clear</button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-4 text-[11px] space-y-2 selection:bg-cyan-500/20">
                                                {logs.map((log, i) => (
                                                    <div key={i} className={`flex space-x-2 ${log.type === 'ERR' ? 'text-rose-400' : 'text-cyan-400'}`}>
                                                        <span className="opacity-20 flex-shrink-0">[{new Date(log.id).toLocaleTimeString([], {hour12: false, minute:'2-digit', second: '2-digit'})}]</span>
                                                        <span className="break-all">{log.content}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Panel>
                                </>
                            )}
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </main>

            {/* EXPANDED FOOTER */}
            <footer className="h-10 bg-[#010101] border-t border-white/5 flex items-center justify-between px-4 shrink-0 overflow-x-auto">
                <div className="flex items-center h-full min-w-max">
                    <button onClick={() => setShowConsole(!showConsole)} className={`flex items-center space-x-2 px-4 h-full transition-all ${showConsole ? 'bg-white/10 text-cyan-400 shadow-[inset_0_2px_0_#06b6d4]' : 'text-slate-500 hover:text-white'}`}>
                        <Terminal size={12} /> <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Console</span>
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <button onClick={() => setActiveSidebar('assets')} className={`flex items-center space-x-2 px-4 h-full transition-all ${activeSidebar === 'assets' ? 'bg-white/10 text-cyan-400 shadow-[inset_0_2px_0_#06b6d4]' : 'text-slate-500 hover:text-white'}`}>
                        <Package size={12} /> <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Assets</span>
                    </button>
                    <button onClick={() => setActiveSidebar('comments')} className={`flex items-center space-x-2 px-4 h-full transition-all ${activeSidebar === 'comments' ? 'bg-white/10 text-cyan-400 shadow-[inset_0_2px_0_#06b6d4]' : 'text-slate-500 hover:text-white'}`}>
                        <MessageSquare size={12} /> <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Comments</span>
                    </button>
                </div>

                <div className="flex items-center h-full space-x-px min-w-max">
                    <button onClick={() => { setActiveModal('collection'); fetchCollections(); }} className="flex items-center space-x-2 px-4 h-full text-slate-500 hover:text-white transition-all border-l border-white/5">
                        <FolderPlus size={12} /> <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Collection</span>
                    </button>
                    <button onClick={handleFork} className="flex items-center space-x-2 px-4 h-full text-slate-500 hover:text-white transition-all border-l border-white/5">
                        <GitFork size={12} /> <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Fork</span>
                    </button>
                    <button onClick={() => setActiveModal('embed')} className="flex items-center space-x-2 px-4 h-full text-slate-500 hover:text-white transition-all border-l border-white/5">
                        <Code size={12} /> <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Embed</span>
                    </button>
                    <button onClick={handleExport} className="flex items-center space-x-2 px-4 h-full text-slate-500 hover:text-white transition-all border-l border-white/5">
                        <Download size={12} /> <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Export</span>
                    </button>
                    <button onClick={() => setActiveModal('share')} className="flex items-center space-x-2 px-6 h-full bg-cyan-500 text-black font-black uppercase text-[9px] tracking-widest hover:bg-white transition-all">
                        <Share2 size={12} /> <span>Share</span>
                    </button>
                </div>
            </footer>

            {/* SIDEBAR OVERLAY */}
            <AnimatePresence>
                {activeSidebar && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveSidebar(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />
                        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="fixed right-0 top-0 w-[400px] h-full bg-[#131417] border-l border-white/10 z-[70] p-10 flex flex-col">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white flex items-center capitalize">
                                    {activeSidebar}_Interface
                                </h3>
                                <button onClick={() => setActiveSidebar(null)} className="text-gray-500 hover:text-white transition-all"><X size={24} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {activeSidebar === 'settings' || activeSidebar === 'assets' ? (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            {externalLibraries.map((lib, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group">
                                                    <span className="text-[10px] font-bold text-gray-400 truncate flex-1 pr-4">{lib}</span>
                                                    <button onClick={() => setExternalLibraries(externalLibraries.filter(l => l !== lib))} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                                </div>
                                            ))}
                                            <button onClick={() => {
                                                const url = prompt('Inject Neural Module (CDN URL):');
                                                if(url) setExternalLibraries([...externalLibraries, url]);
                                            }} className="w-full py-4 border-2 border-dashed border-white/5 rounded-xl text-[9px] font-black uppercase text-gray-600 hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center justify-center">
                                                <PlusCircle size={14} className="mr-2" /> Add_Module
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-white/10 uppercase font-black tracking-widest text-xs">Neural_Chat_Restricted</div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MODALS */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#1d1e22] border border-white/10 w-full max-w-xl rounded-3xl p-12 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                            
                            {activeModal === 'share' && (
                                <div className="space-y-10">
                                    <div className="flex items-center space-x-4 mb-8">
                                        <Share2 className="text-cyan-400" size={24} />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-white">Broadcast_Module</h3>
                                    </div>
                                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <code className="text-xs text-cyan-500/60 truncate mr-10">{window.location.href}</code>
                                        <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Linked copied.'); }} className="p-3 bg-white/5 text-white hover:bg-white hover:text-black rounded-xl transition-all">
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'embed' && (
                                <div className="space-y-10">
                                    <div className="flex items-center space-x-4 mb-8">
                                        <Code className="text-cyan-400" size={24} />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-white">Neural_Embedding</h3>
                                    </div>
                                    <textarea readOnly value={`<iframe src="${window.location.origin}/editor/${project?.slug}" style="width:100%; height:500px; border:none;" sandbox="allow-scripts"></iframe>`} className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-[10px] font-mono text-cyan-500/60 focus:ring-0" />
                                </div>
                            )}

                            {activeModal === 'collection' && (
                                <div className="space-y-10">
                                    <div className="flex items-center space-x-4 mb-8">
                                        <FolderPlus className="text-cyan-400" size={24} />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-white">Archive_To_Collection</h3>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto space-y-3">
                                        {collections.map(c => (
                                            <button key={c.id} onClick={() => addToCollection(c.id)} className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-cyan-500/40 text-left flex justify-between items-center transition-all">
                                                <span className="font-bold text-white uppercase text-xs tracking-widest">{c.title}</span>
                                                <span className="text-[10px] text-gray-500">{c.projects_count} Cores</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-white/5 flex space-x-4">
                                        <input value={newCollectionTitle} onChange={e => setNewCollectionTitle(e.target.value)} placeholder="New_Collection_Title..." className="flex-1 bg-black/40 border-white/10 rounded-xl px-6 text-sm focus:ring-cyan-500 text-white" />
                                        <button onClick={createCollection} className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] rounded-xl hover:bg-cyan-400 transition-all">Create</button>
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setActiveModal(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-all"><X size={24} /></button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}