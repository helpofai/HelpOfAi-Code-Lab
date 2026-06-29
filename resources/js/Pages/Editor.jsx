import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import AdUnit from '@/Components/AdUnit';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import useProjectStore from '@/Stores/useProjectStore';
import { useEditorActions } from '@/Hooks/useEditorActions';
import { useToast } from '@/Components/Toast/ToastProvider';
import useHotkeys from '@/Hooks/useHotkeys';
import CommandPalette from '@/Components/Editor/CommandPalette';
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
    const { globalAds } = usePage().props;
    const lockAd = globalAds?.adsLock?.[0] || globalAds?.video_reward?.[0] || globalAds?.in_feed?.[0] || Object.values(globalAds || {})[0]?.[0];
    const [previewContent, setPreviewContent] = useState('');
    const [activeSidebar, setActiveSidebar] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [showConsole, setShowConsole] = useState(false);
    const [logs, setLogs] = useState([]);
    const [collections, setCollections] = useState([]);
    const [projectData, setProjectData] = useState(initialProject);
    const [diffRevision, setDiffRevision] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(initialProject?.has_purchased || false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const toast = useToast();

    const isNewProject = !initialProject;
    const isOwner = useMemo(() => {
        if (!auth.user) return false;
        if (!initialProject) return true; 
        return initialProject.user_id === auth.user.id;
    }, [auth.user, initialProject]);

    const isVerifiedOrHighLevel = auth?.user && (auth.user.identity_status === 'verified' || auth.user.level > 4);
    const requiresVideoAd = !isNewProject && !isOwner && initialProject.is_public && !initialProject.is_for_sale && !isVerifiedOrHighLevel;

    const [hasCompletedVideoAd, setHasCompletedVideoAd] = useState(!requiresVideoAd);
    const [isPlayingAd, setIsPlayingAd] = useState(false);
    const [adTimeLeft, setAdTimeLeft] = useState(0);

    useEffect(() => {
        let timer;
        if (isPlayingAd && adTimeLeft > 0) {
            timer = setTimeout(() => {
                setAdTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isPlayingAd && adTimeLeft === 0) {
            setIsPlayingAd(false);
            setHasCompletedVideoAd(true);
        }
        return () => clearTimeout(timer);
    }, [isPlayingAd, adTimeLeft]);

    const playRewardAd = () => {
        setIsPlayingAd(true);
        setAdTimeLeft(5); // 5 seconds ad duration
    };

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
                    toast.success('Neural Unlock Successful. Code Access Granted.');
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

    // Keyboard Shortcuts
    useHotkeys({
        'ctrl+s': (e) => { e.preventDefault(); handleSave(); },
        'ctrl+shift+f': (e) => { e.preventDefault(); formatCode(); },
        'ctrl+k': (e) => { e.preventDefault(); setPaletteOpen(prev => !prev); },
        'ctrl+j': (e) => { e.preventDefault(); setShowConsole(prev => !prev); },
        'ctrl+b': (e) => { e.preventDefault(); setActiveSidebar(prev => prev ? null : 'settings'); },
    }, [handleSave, formatCode]);

    const handlePaletteExecute = (action) => {
        switch (action) {
            case 'save': handleSave(); break;
            case 'format': formatCode(); break;
            case 'new': window.location.href = '/editor'; break;
            case 'fork': handleFork(); break;
            case 'console': setShowConsole(prev => !prev); break;
            case 'layout-bottom': useProjectStore.getState().setLayout('bottom'); break;
            case 'layout-right': useProjectStore.getState().setLayout('right'); break;
            case 'layout-top': useProjectStore.getState().setLayout('top'); break;
            case 'share': setActiveModal('share'); break;
            case 'export': handleExport(); break;
            case 'sidebar': setActiveSidebar(prev => prev ? null : 'settings'); break;
            case 'settings': setActiveModal('settings'); break;
        }
    };

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
            script.onerror = () => setLogs(prev => [...prev, { type: 'ERR', content: 'Error: Babel Compiler Offline.', id: Date.now() }]);
            document.head.appendChild(script);
        }
        if (!window.Sass) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js";
            script.onerror = () => setLogs(prev => [...prev, { type: 'ERR', content: 'Error: Sass Compiler Offline.', id: Date.now() }]);
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
        if (!projectData?.id) return toast.warning('Initialize core first.');
        await axios.post(`/api/collections/${id}/add`, { project_id: projectData.id });
        toast.success('Module linked.');
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
            
            {/* Video Reward Ad Overlay */}
            {!hasCompletedVideoAd && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                    <div className="bg-[#111] border border-[var(--border)] p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
                        <h4 className="text-xl font-black uppercase text-white tracking-widest flex items-center justify-center gap-2">
                            <svg className="w-6 h-6 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> 
                            Unlock Code Editor
                        </h4>
                        <p className="text-sm text-gray-400 font-medium">
                            To view the source code of this public module, please watch a short sponsor message. (Verified users and Level 5+ bypass this automatically).
                        </p>
                        
                        {isPlayingAd ? (
                            <div className="w-full relative bg-[#000] rounded-xl border border-white/10 flex flex-col items-center justify-center overflow-hidden min-h-[150px]">
                                {lockAd ? (
                                    <div className="w-full max-h-[250px] overflow-hidden flex items-center justify-center">
                                        <AdUnit ad={lockAd} />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                                )}
                                
                                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-white text-xs font-bold z-20 border border-white/10 shadow-lg">
                                    {adTimeLeft}s
                                </div>
                                
                                {!lockAd && (
                                    <>
                                        <span className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Sponsor Advertisement</span>
                                        <div className="text-5xl font-black text-white z-10">{adTimeLeft}s</div>
                                    </>
                                )}
                                <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-1000 z-20" style={{ width: `${((5 - adTimeLeft) / 5) * 100}%` }} />
                            </div>
                        ) : (
                            <button 
                                onClick={playRewardAd}
                                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                            >
                                Play Video Ad to Unlock
                            </button>
                        )}
                        <Link href={route('explore')} className="block text-xs font-bold text-gray-500 hover:text-white transition-colors pt-4">Return to Explore</Link>
                    </div>
                </div>
            )}

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

            <CommandPalette
                isOpen={paletteOpen}
                onClose={() => setPaletteOpen(false)}
                onExecute={handlePaletteExecute}
            />
        </div>
    );
}
