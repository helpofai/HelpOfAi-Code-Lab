import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, PlusCircle } from 'lucide-react';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorSidebar({ activeSidebar, setActiveSidebar }) {
    const { 
        externalLibraries, setExternalLibraries, 
        fontSize, setFontSize, 
        wordWrap, setWordWrap 
    } = useProjectStore();

    return (
        <AnimatePresence>
            {activeSidebar && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setActiveSidebar(null)} 
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" 
                    />
                    <motion.div 
                        initial={{ x: 400 }} 
                        animate={{ x: 0 }} 
                        exit={{ x: 400 }} 
                        className="fixed right-0 top-0 w-full md:w-[400px] h-full bg-[#131417] border-l border-white/10 z-[70] p-10 flex flex-col shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white flex items-center capitalize">
                                {activeSidebar}_Interface
                            </h3>
                            <button onClick={() => setActiveSidebar(null)} className="text-gray-500 hover:text-white transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2">
                            {activeSidebar === 'assets' && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-4">External Modules (CDN)</h4>
                                        {externalLibraries.map((lib, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-all">
                                                <span className="text-[10px] font-bold text-gray-400 truncate flex-1 pr-4" title={lib}>{lib}</span>
                                                <button onClick={() => setExternalLibraries(externalLibraries.filter(l => l !== lib))} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={14}/>
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => {
                                            const url = prompt('Inject Neural Module (CDN URL):');
                                            if(url && url.startsWith('http')) setExternalLibraries([...externalLibraries, url]);
                                        }} className="w-full py-4 border-2 border-dashed border-white/5 rounded-xl text-[9px] font-black uppercase text-gray-600 hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center justify-center">
                                            <PlusCircle size={14} className="mr-2" /> Add_Module
                                        </button>
                                    </div>
                                    
                                    <div className="pt-8 border-t border-white/10">
                                         <p className="text-[10px] text-gray-500 leading-relaxed">
                                            Supports .js and .css files. Resources are injected into the preview iframe.
                                         </p>
                                    </div>
                                </div>
                            )}

                            {activeSidebar === 'settings' && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-4">Editor Configuration</h4>
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Font Size ({fontSize}px)</label>
                                            <input 
                                                type="range" 
                                                min="10" 
                                                max="24" 
                                                value={fontSize} 
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Word Wrap</label>
                                            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                                                <button 
                                                    onClick={() => setWordWrap('on')}
                                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all ${wordWrap === 'on' ? 'bg-cyan-500 text-black' : 'text-gray-500 hover:text-white'}`}
                                                >
                                                    On
                                                </button>
                                                <button 
                                                    onClick={() => setWordWrap('off')}
                                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all ${wordWrap === 'off' ? 'bg-cyan-500 text-black' : 'text-gray-500 hover:text-white'}`}
                                                >
                                                    Off
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}