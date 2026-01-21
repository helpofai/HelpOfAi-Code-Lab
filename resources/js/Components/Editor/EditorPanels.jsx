import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import MonacoWrapper from './MonacoWrapper';
import useProjectStore from '@/Stores/useProjectStore';
import { GripVertical, GripHorizontal } from 'lucide-react';

export default function EditorPanels({ previewContent }) {
    const { html, css, js, setHtml, setCss, setJs, fontSize, wordWrap } = useProjectStore();

    return (
        <PanelGroup direction="vertical" className="h-full">
            <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="horizontal" className="h-full">
                    <Panel defaultSize={33} minSize={10} className="flex flex-col border-r border-white/5 bg-[#0a0a0a]">
                        <div className="px-4 py-2 bg-[#050505] text-[9px] font-black uppercase text-slate-500 border-b border-white/5 tracking-widest italic">HTML_Source</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="html" value={html} onChange={setHtml} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-px bg-white/5 hover:bg-cyan-500/20 transition-colors" />
                    
                    <Panel defaultSize={33} minSize={10} className="flex flex-col border-r border-white/5 bg-[#0a0a0a]">
                        <div className="px-4 py-2 bg-[#050505] text-[9px] font-black uppercase text-slate-500 border-b border-white/5 tracking-widest italic">CSS_Style</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="css" value={css} onChange={setCss} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-px bg-white/5 hover:bg-cyan-500/20 transition-colors" />

                    <Panel defaultSize={34} minSize={10} className="flex flex-col bg-[#0a0a0a]">
                        <div className="px-4 py-2 bg-[#050505] text-[9px] font-black uppercase text-slate-500 border-b border-white/5 tracking-widest italic">JS_Logic</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="js" value={js} onChange={setJs} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                </PanelGroup>
            </Panel>
            
            <PanelResizeHandle className="h-px bg-white/5 hover:bg-cyan-500/20 transition-colors" />

            <Panel defaultSize={50} minSize={20} className="bg-white">
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