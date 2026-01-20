import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GripHorizontal, Layout, Eye, Code2 } from 'lucide-react';
import axios from 'axios';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserBabel from 'prettier/parser-babel';

import useProjectStore from '@/Stores/useProjectStore';
import EditorHeader from '@/Components/Editor/EditorHeader';
import CodeEditorsGroup from '@/Components/Editor/CodeEditorsGroup';
import PreviewPanel from '@/Components/Editor/PreviewPanel';
import ConsolePanel from '@/Components/Editor/ConsolePanel';
import EditorFooter from '@/Components/Editor/EditorFooter';
import EditorSidebar from '@/Components/Editor/EditorSidebar';
import EditorModals from '@/Components/Editor/EditorModals';

export default function CodeEditor({ auth, project: initialProject }) {
    const { html, css, js, setHtml, setCss, setJs, setProject, title, externalLibraries } = useProjectStore();
    const [previewContent, setPreviewContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [project, setProjectData] = useState(initialProject);
    const [activeSidebar, setActiveSidebar] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [showConsole, setShowConsole] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isFormatting, setIsFormatting] = useState(false);
    const [collections, setCollections] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'

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
    }, [initialProject, setProject]);

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

    const srcDoc = useMemo(() => {
        const libs = externalLibraries.map(lib => lib.endsWith('.css') ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"></script>`).join('\n');
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    body { background: white; margin: 0; padding: 0; font-family: sans-serif; }
                    ${css}
                </style>
                ${libs}
                <script>
                    const safeStringify = (obj) => {
                        try {
                            return JSON.stringify(obj, null, 2);
                        } catch (e) {
                            return String(obj);
                        }
                    };
                    console.log = (...args) => {
                        const content = args.map(arg => 
                            typeof arg === 'object' ? safeStringify(arg) : String(arg)
                        ).join(' ');
                        window.parent.postMessage({ type: 'LOG', content }, '*');
                    };
                    window.onerror = (m, u, l) => {
                        window.parent.postMessage({ type: 'ERR', content: m + ' (Line: ' + l + ')' }, '*');
                    };
                    window.addEventListener('unhandledrejection', (event) => {
                        window.parent.postMessage({ type: 'ERR', content: 'Unhandled Rejection: ' + event.reason }, '*');
                    });
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
        if (!project) return true; 
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

    const createCollection = async (newTitle) => {
        if (!newTitle) return;
        const res = await axios.post('/api/collections', { title: newTitle });
        setCollections([...collections, res.data]);
    };

    const MobileView = () => (
        <div className="flex-1 flex flex-col min-h-0 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#252830] p-1 rounded-full border border-white/10 flex shadow-xl">
                <button 
                    onClick={() => setMobileTab('editor')}
                    className={`p-2 rounded-full transition-all ${mobileTab === 'editor' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    <Code2 size={18} />
                </button>
                <button 
                    onClick={() => setMobileTab('preview')}
                    className={`p-2 rounded-full transition-all ${mobileTab === 'preview' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    <Eye size={18} />
                </button>
            </div>

            <div className={`flex-1 flex flex-col ${mobileTab === 'editor' ? 'block' : 'hidden'}`}>
                <CodeEditorsGroup isMobile={true} />
            </div>

            <div className={`flex-1 flex flex-col ${mobileTab === 'preview' ? 'block' : 'hidden'}`}>
                <div className="flex-1 min-h-0">
                    <PreviewPanel previewContent={previewContent} />
                </div>
                {showConsole && (
                    <div className="h-[30%] border-t border-white/10">
                        <ConsolePanel logs={logs} setLogs={setLogs} />
                    </div>
                )}
            </div>
        </div>
    );

    const DesktopView = () => (
        <PanelGroup direction="vertical">
            <Panel defaultSize={50} minSize={20}>
                <CodeEditorsGroup isMobile={false} />
            </Panel>

            <PanelResizeHandle className="h-1 bg-black hover:bg-cyan-500/30 transition-colors flex items-center justify-center group cursor-row-resize">
                <GripHorizontal size={14} className="text-white/10 group-hover:text-cyan-400" />
            </PanelResizeHandle>

            <Panel defaultSize={50} minSize={10}>
                <PanelGroup direction="vertical">
                    <Panel minSize={20}>
                        <PreviewPanel previewContent={previewContent} />
                    </Panel>

                    {showConsole && (
                        <>
                            <PanelResizeHandle className="h-1 bg-black hover:bg-cyan-500/30 transition-colors flex items-center justify-center group cursor-row-resize" />
                            <Panel defaultSize={30} minSize={10}>
                                <ConsolePanel logs={logs} setLogs={setLogs} />
                            </Panel>
                        </>
                    )}
                </PanelGroup>
            </Panel>
        </PanelGroup>
    );

    return (
        <div className="h-screen bg-[#131417] text-slate-300 overflow-hidden flex flex-col font-sans">
            <Head title={project ? project.title : 'Neural Lab // Editor'} />

            <EditorHeader 
                isSaving={isSaving}
                handleSave={handleSave}
                isOwner={isOwner}
                project={project}
                isFormatting={isFormatting}
                formatCode={formatCode}
                setActiveSidebar={setActiveSidebar}
            />

            <main className="flex-1 flex flex-col min-h-0 bg-[#131417]">
                {isMobile ? <MobileView /> : <DesktopView />}
            </main>

            <EditorFooter 
                showConsole={showConsole} 
                setShowConsole={setShowConsole} 
                activeSidebar={activeSidebar} 
                setActiveSidebar={setActiveSidebar} 
                setActiveModal={setActiveModal} 
                handleFork={handleFork}
                handleExport={handleExport}
                fetchCollections={fetchCollections}
            />

            <EditorSidebar 
                activeSidebar={activeSidebar} 
                setActiveSidebar={setActiveSidebar} 
            />

            <EditorModals 
                activeModal={activeModal} 
                setActiveModal={setActiveModal} 
                project={project} 
                collections={collections} 
                addToCollection={addToCollection} 
                createCollection={createCollection} 
            />
        </div>
    );
}