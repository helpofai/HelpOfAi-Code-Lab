import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import MonacoWrapper from './MonacoWrapper';
import useProjectStore from '@/Stores/useProjectStore';

const EditorGroup = ({ direction = "horizontal", html, setHtml, css, setCss, js, setJs, fontSize, wordWrap }) => (
    <PanelGroup direction={direction} className="h-full">
        <Panel defaultSize={33} minSize={10} className="flex flex-col border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic">HTML_Source</div>
            <div className="flex-1 relative min-h-0">
                <MonacoWrapper language="html" value={html} onChange={setHtml} fontSize={fontSize} wordWrap={wordWrap} />
            </div>
        </Panel>
        <PanelResizeHandle className={`${direction === 'horizontal' ? 'w-px' : 'h-px'} bg-[var(--border)] hover:bg-cyan-500/20 transition-colors`} />
        
        <Panel defaultSize={33} minSize={10} className="flex flex-col border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic">CSS_Style</div>
            <div className="flex-1 relative min-h-0">
                <MonacoWrapper language="css" value={css} onChange={setCss} fontSize={fontSize} wordWrap={wordWrap} />
            </div>
        </Panel>
        <PanelResizeHandle className={`${direction === 'horizontal' ? 'w-px' : 'h-px'} bg-[var(--border)] hover:bg-cyan-500/20 transition-colors`} />

        <Panel defaultSize={34} minSize={10} className="flex flex-col bg-[var(--bg-surface)] overflow-hidden">
            <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic">JS_Logic</div>
            <div className="flex-1 relative min-h-0">
                <MonacoWrapper language="js" value={js} onChange={setJs} fontSize={fontSize} wordWrap={wordWrap} />
            </div>
        </Panel>
    </PanelGroup>
);

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

export default function EditorPanels({ previewContent }) {
    const { html, css, js, setHtml, setCss, setJs, fontSize, wordWrap, layout } = useProjectStore();

    const editorProps = { html, setHtml, css, setCss, js, setJs, fontSize, wordWrap };

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