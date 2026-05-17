import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Lock, CreditCard, Sparkles, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import MonacoWrapper from './MonacoWrapper';
import useProjectStore from '@/Stores/useProjectStore';
import PrimaryButton from '@/Components/PrimaryButton';

const PaidOverlay = ({ price, projectId, slug }) => {
    const handlePurchase = () => {
        window.location.href = route('checkout.project', { project: slug });
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <div className="max-w-xs w-full bg-[var(--bg-surface)] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <Lock size={30} />
                </div>
                <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Neural Lock</h3>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2 leading-relaxed">This source code is protected. Purchase access to unlock the full logic matrix.</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-2xl font-black text-cyan-500 font-mono">
                    <span className="text-xs opacity-50">$</span>{price}
                </div>
                <PrimaryButton onClick={handlePurchase} className="w-full">
                    <ShoppingBag size={14} className="mr-2" /> Unlock Node
                </PrimaryButton>
                <div className="flex items-center justify-center gap-4 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                    <div className="flex items-center gap-1"><Sparkles size={10} className="text-cyan-500" /> Full Code</div>
                    <div className="flex items-center gap-1"><Sparkles size={10} className="text-cyan-500" /> Fork Rights</div>
                </div>
            </div>
        </div>
    );
};

const EditorGroup = ({ direction = "horizontal", html, setHtml, css, setCss, js, setJs, fontSize, wordWrap, preprocessors, isLocked, price, projectId, slug }) => (
    <PanelGroup direction={direction} className="h-full relative">
        {isLocked && <PaidOverlay price={price} projectId={projectId} slug={slug} />}
        
        <Panel defaultSize={33} minSize={10} className={`flex flex-col border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden ${isLocked ? 'blur-sm grayscale' : ''}`}>
            <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic flex justify-between items-center">
                <span>HTML_Source</span>
                <span className="text-[7px] text-cyan-500/50">{preprocessors.html}</span>
            </div>
            <div className="flex-1 relative min-h-0">
                <MonacoWrapper language="html" value={html} onChange={setHtml} fontSize={fontSize} wordWrap={wordWrap} />
            </div>
        </Panel>
        <PanelResizeHandle className={`${direction === 'horizontal' ? 'w-px' : 'h-px'} bg-[var(--border)] hover:bg-cyan-500/20 transition-colors`} />
        
        <Panel defaultSize={33} minSize={10} className={`flex flex-col border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden ${isLocked ? 'blur-sm grayscale' : ''}`}>
            <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic flex justify-between items-center">
                <span>CSS_Style</span>
                <span className="text-[7px] text-cyan-500/50">{preprocessors.css}</span>
            </div>
            <div className="flex-1 relative min-h-0">
                <MonacoWrapper language="css" value={css} onChange={setCss} fontSize={fontSize} wordWrap={wordWrap} />
            </div>
        </Panel>
        <PanelResizeHandle className={`${direction === 'horizontal' ? 'w-px' : 'h-px'} bg-[var(--border)] hover:bg-cyan-500/20 transition-colors`} />

        <Panel defaultSize={34} minSize={10} className={`flex flex-col bg-[var(--bg-surface)] overflow-hidden ${isLocked ? 'blur-sm grayscale' : ''}`}>
            <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic flex justify-between items-center">
                <span>JS_Logic</span>
                <span className="text-[7px] text-cyan-500/50">{preprocessors.js}</span>
            </div>
            <div className="flex-1 relative min-h-0">
                <MonacoWrapper language="js" value={js} onChange={setJs} fontSize={fontSize} wordWrap={wordWrap} />
            </div>
        </Panel>
    </PanelGroup>
);

const MobileEditorTabs = ({ html, setHtml, css, setCss, js, setJs, fontSize, wordWrap, preprocessors, isLocked, price, projectId, slug }) => {
    const [activeTab, setActiveTab] = useState('html');

    return (
        <div className="h-full flex flex-col overflow-hidden bg-[var(--bg-surface)] relative">
            {isLocked && <PaidOverlay price={price} projectId={projectId} slug={slug} />}
            
            <div className="flex bg-[var(--bg-main)] border-b border-[var(--border)] overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex min-w-full">
                    {['html', 'css', 'js'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[120px] px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${
                                activeTab === tab 
                                ? 'text-cyan-500 border-cyan-500 bg-cyan-500/5' 
                                : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)]'
                            }`}
                        >
                            {tab === 'html' ? `HTML (${preprocessors.html})` : 
                             tab === 'css' ? `CSS (${preprocessors.css})` : 
                             `JS (${preprocessors.js})`}
                        </button>
                    ))}
                </div>
            </div>
            <div className={`flex-1 relative min-h-0 ${isLocked ? 'blur-sm grayscale' : ''}`}>
                {activeTab === 'html' && <MonacoWrapper language="html" value={html} onChange={setHtml} fontSize={fontSize} wordWrap={wordWrap} />}
                {activeTab === 'css' && <MonacoWrapper language="css" value={css} onChange={setCss} fontSize={fontSize} wordWrap={wordWrap} />}
                {activeTab === 'js' && <MonacoWrapper language="js" value={js} onChange={setJs} fontSize={fontSize} wordWrap={wordWrap} />}
            </div>
        </div>
    );
};

const PreviewPanel = ({ previewContent }) => (
    <Panel defaultSize={50} minSize={20} className="bg-[var(--bg-surface)] relative">
        <div className="absolute top-2 right-4 z-10 pointer-events-none">
            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-30">Live_Preview</span>
        </div>
        <iframe 
            srcDoc={previewContent}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts"
            title="preview"
        />
    </Panel>
);

export default function EditorPanels({ previewContent, hasPurchased, isOwner }) {
    const { html, css, js, setHtml, setCss, setJs, fontSize, wordWrap, layout, preprocessors, isForSale, price, title, slug } = useProjectStore();
    const projectId = useProjectStore.getState().id; // Need to ensure ID is in store or passed

    const isLocked = isForSale && !isOwner && !hasPurchased;

    const editorProps = { html, setHtml, css, setCss, js, setJs, fontSize, wordWrap, preprocessors, isLocked, price, projectId: useProjectStore.getState().id || title, slug };

    // Detect if we are on mobile (simple check)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMobile) {
        return (
            <PanelGroup direction="vertical" className="h-full">
                <Panel defaultSize={50} minSize={20}>
                    <MobileEditorTabs {...editorProps} />
                </Panel>
                <PanelResizeHandle className="h-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" />
                <PreviewPanel previewContent={previewContent} />
            </PanelGroup>
        );
    }

    if (layout === 'right') {
        return (
            <PanelGroup direction="horizontal" className="h-full">
                <Panel defaultSize={60} minSize={20}>
                    <EditorGroup direction="vertical" {...editorProps} />
                </Panel>
                <PanelResizeHandle className="w-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" />
                <PreviewPanel previewContent={previewContent} />
            </PanelGroup>
        );
    }

    if (layout === 'top') {
        return (
            <PanelGroup direction="vertical" className="h-full">
                <PreviewPanel previewContent={previewContent} />
                <PanelResizeHandle className="h-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" />
                <Panel defaultSize={50} minSize={20}>
                    <EditorGroup direction="horizontal" {...editorProps} />
                </Panel>
            </PanelGroup>
        );
    }

    // Default 'bottom' layout
    return (
        <PanelGroup direction="vertical" className="h-full">
            <Panel defaultSize={50} minSize={20}>
                <EditorGroup direction="horizontal" {...editorProps} />
            </Panel>
            <PanelResizeHandle className="h-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" />
            <PreviewPanel previewContent={previewContent} />
        </PanelGroup>
    );
}