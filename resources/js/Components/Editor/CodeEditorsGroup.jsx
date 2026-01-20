import React from 'react';
import Editor from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GripHorizontal, GripVertical } from 'lucide-react';
import useProjectStore from '@/Stores/useProjectStore';

export default function CodeEditorsGroup({ isMobile }) {
    const { html, css, js, setHtml, setCss, setJs, fontSize, wordWrap } = useProjectStore();

    const editors = [
        { type: 'html', value: html, setter: setHtml, color: 'bg-orange-500' },
        { type: 'css', value: css, setter: setCss, color: 'bg-blue-500' },
        { type: 'js', value: js, setter: setJs, color: 'bg-yellow-400' }
    ];

    return (
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
            {editors.map((editor, idx) => (
                <React.Fragment key={editor.type}>
                    <Panel defaultSize={33.33} minSize={10}>
                        <div className="h-full flex flex-col border-b md:border-b-0 md:border-r border-white/5 bg-[#1d1e22]">
                            <div className="px-4 py-2 bg-[#010101] border-b border-white/5 flex items-center justify-between shrink-0">
                                <div className="flex items-center space-x-2">
                                    <span className={`w-2 h-2 rounded-full ${editor.color}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{editor.type}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-h-0 relative">
                                <Editor
                                    height="100%"
                                    theme="vs-dark"
                                    language={editor.type === 'js' ? 'javascript' : editor.type}
                                    value={editor.value}
                                    onChange={(v) => editor.setter(v || '')}
                                    options={{ 
                                        minimap: { enabled: false }, 
                                        fontSize: fontSize, 
                                        wordWrap: wordWrap,
                                        automaticLayout: true,
                                        padding: { top: 10 },
                                        scrollBeyondLastLine: false,
                                    }}
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
    );
}