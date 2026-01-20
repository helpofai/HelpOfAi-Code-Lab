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
                    <Panel defaultSize={33} minSize={10} className="flex flex-col border-r border-white/5 bg-[#1d1e22]">
                        <div className="px-4 py-2 bg-[#010101] text-[10px] font-black uppercase text-gray-400 border-b border-white/5">HTML</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="html" value={html} onChange={setHtml} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-black hover:bg-cyan-500/30 flex items-center justify-center">
                        <GripVertical size={12} className="text-white/20" />
                    </PanelResizeHandle>
                    
                    <Panel defaultSize={33} minSize={10} className="flex flex-col border-r border-white/5 bg-[#1d1e22]">
                        <div className="px-4 py-2 bg-[#010101] text-[10px] font-black uppercase text-gray-400 border-b border-white/5">CSS</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="css" value={css} onChange={setCss} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-black hover:bg-cyan-500/30 flex items-center justify-center">
                        <GripVertical size={12} className="text-white/20" />
                    </PanelResizeHandle>

                    <Panel defaultSize={34} minSize={10} className="flex flex-col bg-[#1d1e22]">
                        <div className="px-4 py-2 bg-[#010101] text-[10px] font-black uppercase text-gray-400 border-b border-white/5">JS</div>
                        <div className="flex-1 relative min-h-0">
                            <MonacoWrapper language="js" value={js} onChange={setJs} fontSize={fontSize} wordWrap={wordWrap} />
                        </div>
                    </Panel>
                </PanelGroup>
            </Panel>
            
            <PanelResizeHandle className="h-1 bg-black hover:bg-cyan-500/30 flex items-center justify-center">
                <GripHorizontal size={12} className="text-white/20" />
            </PanelResizeHandle>

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