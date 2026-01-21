import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserBabel from 'prettier/parser-babel';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import useProjectStore from '@/Stores/useProjectStore';
import EditorHeader from '@/Components/Editor/EditorHeader';
import EditorPanels from '@/Components/Editor/EditorPanels';
import EditorFooter from '@/Components/Editor/EditorFooter';
import EditorSidebar from '@/Components/Editor/EditorSidebar';
import EditorModals from '@/Components/Editor/EditorModals';
import ConsolePanel from '@/Components/Editor/ConsolePanel';

export default function Editor({ auth, project: initialProject }) {
    const { html, css, js, setHtml, setCss, setJs, setProject, title, externalLibraries } = useProjectStore();
    const [previewContent, setPreviewContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [activeSidebar, setActiveSidebar] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [showConsole, setShowConsole] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isFormatting, setIsFormatting] = useState(false);
    const [collections, setCollections] = useState([]);
    const [projectData, setProjectData] = useState(initialProject);

    // Initialize Store
    useEffect(() => {
        if (initialProject) {
            setProject(initialProject);
            setProjectData(initialProject);
        }
    }, [initialProject]);

    // Format Code
    const formatCode = async () => {
        setIsFormatting(true);
        setLogs(prev => [...prev, { type: 'LOG', content: 'Initializing synthesis...', id: Date.now() }]);
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
            
            setLogs(prev => [...prev, { type: 'LOG', content: 'Optimization complete.', id: Date.now() }]);
        } catch (err) { 
            console.error(err);
            setLogs(prev => [...prev, { type: 'ERR', content: `Error: ${err.message}`, id: Date.now() }]);
        } finally { 
            setIsFormatting(false); 
        }
    };

    // Live Preview Logic (Debounced)
    const srcDoc = useMemo(() => {
        const libs = externalLibraries.map(lib => lib.endsWith('.css') ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"></script>`).join('\n');
        return (
            `
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
        `
        );
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
        if (!projectData) return true; 
        return projectData.user_id === auth.user.id;
    }, [auth.user, projectData]);

    const handleSave = async () => {
        if (!auth.user) {
            if (confirm('Authentication required. Redirect to login?')) {
                window.location.href = route('login');
            }
            return;
        }

        if (!isOwner && projectData?.id) {
            return handleFork();
        }

        setIsSaving(true);
        try {
            const data = { title, code: { html, css, js }, settings: { externalLibraries }, is_public: true };
            const endpoint = projectData?.id ? `/api/projects/${projectData.id}` : '/api/projects';
            const method = projectData?.id ? 'put' : 'post';
            const res = await axios[method](endpoint, data);
            setProjectData(res.data);
            if (!projectData?.id) window.history.pushState({}, '', `/editor/${res.data.slug}`);
            setLogs(prev => [...prev, { type: 'LOG', content: 'Cloud sync successful.', id: Date.now() }]);
        } catch (e) {
            setLogs(prev => [...prev, { type: 'ERR', content: 'Sync failed. Verify connection.', id: Date.now() }]);
        } finally { setIsSaving(false); }
    };

    const handleFork = async () => {
        if (!projectData?.id) return alert('Initialize module before forking.');
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
        if (!projectData?.id) return alert('Initialize core first.');
        await axios.post(`/api/collections/${id}/add`, { project_id: projectData.id });
        alert('Module linked.');
        setActiveModal(null);
    };

    const createCollection = async (newTitle) => {
        if (!newTitle) return;
        const res = await axios.post('/api/collections', { title: newTitle });
        setCollections([...collections, res.data]);
    };

    return (
        <div className="h-screen bg-[#050505] flex flex-col font-sans overflow-hidden">
            <Head>
                <title>{projectData?.meta_title || title || 'Editor'} // HOACodeLab</title>
                <meta name="description" content={projectData?.meta_description || 'Prototyping node on HOACodeLab.'} />
            </Head>
            
            <EditorHeader 
                handleSave={handleSave} 
                isSaving={isSaving} 
                isOwner={isOwner}
                isFormatting={isFormatting}
                formatCode={formatCode}
                setActiveSidebar={setActiveSidebar}
            />

            <div className="flex-1 min-h-0 flex flex-col">
                <PanelGroup direction="vertical" className="flex-1 h-full">
                    <Panel defaultSize={showConsole ? 70 : 100} minSize={20}>
                        <EditorPanels previewContent={previewContent} />
                    </Panel>
                    
                    {showConsole && (
                        <>
                            <PanelResizeHandle className="h-1 bg-black hover:bg-cyan-500/30 flex items-center justify-center">
                                <div className="w-8 h-px bg-white/10" />
                            </PanelResizeHandle>
                            <Panel defaultSize={30} minSize={10}>
                                <ConsolePanel logs={logs} setLogs={setLogs} />
                            </Panel>
                        </>
                    )}
                </PanelGroup>
            </div>

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
                project={projectData} 
                collections={collections} 
                addToCollection={addToCollection} 
                createCollection={createCollection} 
            />
        </div>
    );
}
