import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import useProjectStore from '@/Stores/useProjectStore';
import { useEditorActions } from '@/Hooks/useEditorActions';
import EditorHeader from '@/Components/Editor/EditorHeader';
import EditorPanels from '@/Components/Editor/EditorPanels';
import EditorFooter from '@/Components/Editor/EditorFooter';
import EditorSidebar from '@/Components/Editor/EditorSidebar';
import EditorModals from '@/Components/Editor/EditorModals';
import ConsolePanel from '@/Components/Editor/ConsolePanel';

export default function Editor({ auth, project: initialProject }) {
    const { 
        html, css, js, setProject, title, isPrivate, 
        isForSale, price,
        externalLibraries, setGoogleDriveFileId, preprocessors 
    } = useProjectStore();
    const [previewContent, setPreviewContent] = useState('');
    const [activeSidebar, setActiveSidebar] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [showConsole, setShowConsole] = useState(false);
    const [logs, setLogs] = useState([]);
    const [collections, setCollections] = useState([]);
    const [projectData, setProjectData] = useState(initialProject);
    const [diffRevision, setDiffRevision] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(initialProject?.has_purchased || false);

    // Initialize Store
    useEffect(() => {
        if (initialProject) {
            setProject(initialProject);
            setProjectData(initialProject);
            setHasPurchased(initialProject.has_purchased || false);
            if (initialProject.code?.google_drive_file_id) {
                setGoogleDriveFileId(initialProject.code.google_drive_file_id);
            }
        }
    }, [initialProject, setProject, setGoogleDriveFileId]);

    // Handle Purchase Verification from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const purchased = urlParams.get('purchased');
        const sessionId = urlParams.get('session_id');

        if (purchased === 'true' && sessionId && projectData?.id) {
            const verifyPurchase = async () => {
                try {
                    await axios.post('/api/purchase/verify', {
                        gateway: 'stripe',
                        project_id: projectData.id,
                        session_id: sessionId
                    });
                    setHasPurchased(true);
                    alert('Neural Unlock Successful. Code Access Granted.');
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (e) {
                    console.error('Purchase verification failed.');
                }
            };
            verifyPurchase();
        }
    }, [projectData]);

    // Custom Hook for Editor Actions
    const { 
        isSaving, 
        isFormatting, 
        formatCode, 
        handleSave, 
        handleFork, 
        handleCloudSave 
    } = useEditorActions(projectData, setProjectData, setLogs);

    // Live Preview Logic (Debounced)
    const [compiling, setCompiling] = useState(false);

    const compileCode = async () => {
        setCompiling(true);
        let compiledCss = css;
        let compiledJs = js;
        const { preprocessors } = useProjectStore.getState();

        try {
            // 1. Compile CSS (Sass/SCSS)
            if (preprocessors.css === 'scss' || preprocessors.css === 'sass') {
                if (window.Sass) {
                    compiledCss = await new Promise((resolve) => {
                        window.Sass.compile(css, (result) => resolve(result.text || css));
                    });
                } else {
                    console.warn("Sass compiler not loaded yet.");
                }
            }

            // 2. Compile JS (Babel/JSX/TS)
            if (preprocessors.js === 'babel' || preprocessors.js === 'typescript') {
                if (window.Babel) {
                    compiledJs = window.Babel.transform(js, {
                        presets: ['env', 'react', 'typescript'],
                        filename: 'script.tsx'
                    }).code;
                } else {
                    console.warn("Babel compiler not loaded yet.");
                }
            }
        } catch (err) {
            setLogs(prev => [...prev, { type: 'ERR', content: 'Compilation Error: ' + err.message, id: Date.now() }]);
        }

        const libs = externalLibraries.map(lib => lib.endsWith('.css') ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"></script>`).join('\n');
        
        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    body { background: white; margin: 0; padding: 0; font-family: sans-serif; }
                    ${compiledCss}
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
                    
                    // REPL Listener
                    window.addEventListener('message', (e) => {
                        if (e.data.type === 'REPL_EXEC') {
                            try {
                                const result = eval(e.data.code);
                                window.parent.postMessage({ type: 'LOG', content: '> ' + safeStringify(result) }, '*');
                            } catch (err) {
                                window.parent.postMessage({ type: 'ERR', content: 'REPL Error: ' + err.message }, '*');
                            }
                        }
                    });
                </script>
            </head>
            <body>${html}<script>${compiledJs}</script></body>
            </html>
        `;
        
        setPreviewContent(content);
        setCompiling(false);
    };

    useEffect(() => {
        // Load Compilers on Mount with Error Handling
        if (!window.Babel) {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
            script.onerror = () => setLogs(prev => [...prev, { type: 'ERR', content: 'Uplink_Failed: Babel Compiler Offline.', id: Date.now() }]);
            document.head.appendChild(script);
        }
        if (!window.Sass) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js";
            script.onerror = () => setLogs(prev => [...prev, { type: 'ERR', content: 'Uplink_Failed: Sass Compiler Offline.', id: Date.now() }]);
            document.head.appendChild(script);
        }

        const handleMessage = (e) => {
            if (e.data.type === 'LOG' || e.data.type === 'ERR') {
                setLogs(prev => [...prev, { type: e.data.type, content: e.data.content, id: Date.now() }].slice(-50));
            }
        };
        window.addEventListener('message', handleMessage);

        const timeout = setTimeout(compileCode, 800);
        return () => { window.removeEventListener('message', handleMessage); clearTimeout(timeout); };
    }, [html, css, js, externalLibraries, preprocessors]);

    const isOwner = useMemo(() => {
        if (!auth.user) return false;
        if (!projectData) return true; 
        return projectData.user_id === auth.user.id;
    }, [auth.user, projectData]);

    const handleExport = () => {
        const blob = new Blob([previewContent], { type: 'text/html' });
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

    const pageTitle = (projectData?.meta_title || title || 'Editor') + ' // HOACodeLab';
    const pageDescription = projectData?.meta_description || 'Prototyping node on HOACodeLab.';
    const ogImage = projectData?.og_image_url || `${window.location.origin}/favicon.svg`;

    return (
        <div className="h-screen bg-[var(--bg-main)] flex flex-col font-sans overflow-hidden transition-colors duration-300">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={ogImage} />
            </Head>
            
            <EditorHeader 
                handleSave={handleSave} 
                handleCloudSave={handleCloudSave}
                isSaving={isSaving} 
                isOwner={isOwner}
                isFormatting={isFormatting}
                formatCode={formatCode}
                setActiveSidebar={setActiveSidebar}
                setActiveModal={setActiveModal}
            />

            <div className="flex-1 min-h-0 flex flex-col">
                <PanelGroup direction="vertical" className="flex-1 h-full">
                    <Panel defaultSize={showConsole ? 70 : 100} minSize={20}>
                        <EditorPanels previewContent={previewContent} hasPurchased={hasPurchased} isOwner={isOwner} />
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
                projectData={projectData}
                setLogs={setLogs}
                diffRevision={setDiffRevision}
                setActiveModal={setActiveModal}
                handleSave={handleSave}
                handleFork={handleFork}
                handleCloudSave={handleCloudSave}
                fetchCollections={fetchCollections}
            />

            <EditorModals 
                activeModal={activeModal} 
                setActiveModal={setActiveModal} 
                project={projectData} 
                collections={collections} 
                addToCollection={addToCollection} 
                createCollection={createCollection} 
                diffRevision={diffRevision}
            />
        </div>
    );
}
