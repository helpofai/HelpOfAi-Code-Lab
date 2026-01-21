import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import MonacoWrapper from './MonacoWrapper';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorPanels({ previewContent }) {
    const { html, css, js, setHtml, setCss, setJs, fontSize, wordWrap } = useProjectStore();

    return (
        <PanelGroup direction="vertical" className="h-full">
            <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="horizontal" className="h-full">
                    <Panel defaultSize={33} minSize={10} className="flex flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]">
                        <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic">HTML_Source</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="html" value={html} onChange={setHtml} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" />
                    
                    <Panel defaultSize={33} minSize={10} className="flex flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]">
                        <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic">CSS_Style</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="css" value={css} onChange={setCss} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" />

                    <Panel defaultSize={34} minSize={10} className="flex flex-col bg-[var(--bg-surface)]">
                        <div className="px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic">JS_Logic</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="js" value={js} onChange={setJs} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                </PanelGroup>
            </Panel>
            
            <PanelResizeHandle className="h-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" />

            <Panel defaultSize={50} minSize={20} className="bg-[var(--bg-surface)]">
                <iframe 
                    srcDoc={previewContent}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts"
                    title="preview"
                />
            </Panel>
        </PanelGroup>
    );
}