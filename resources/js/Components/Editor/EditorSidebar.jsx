import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, PlusCircle, Lock, Unlock, Crown } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';
import useProjectStore from '@/Stores/useProjectStore';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';

export default function EditorSidebar({ activeSidebar, setActiveSidebar }) {
    const { auth } = usePage().props;
    const isPro = auth.user?.role === 'admin' || auth.user?.role === 'paid-user';

    const { 
        externalLibraries, setExternalLibraries, 
        fontSize, setFontSize, 
        wordWrap, setWordWrap,
        isPrivate, setIsPrivate
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
                        className="fixed right-0 top-0 w-full md:w-[320px] h-full bg-[var(--bg-surface)] border-l border-[var(--border)] z-[70] p-8 flex flex-col shadow-2xl transition-colors duration-300"
                    >
                        <div className="flex justify-between items-center mb-12 shrink-0">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] flex items-center capitalize italic">
                                {activeSidebar}_Settings
                            </h3>
                            <button onClick={() => setActiveSidebar(null)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"><X size={20} /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {activeSidebar === 'assets' && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-cyan-500 mb-4 italic text-left">External_Modules</h4>
                                        {externalLibraries.map((lib, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-main)] border border-[var(--border)] rounded group text-left">
                                                <span className="text-[9px] font-bold text-[var(--text-muted)] truncate flex-1 pr-4">{lib}</span>
                                                <button onClick={() => setExternalLibraries(externalLibraries.filter(l => l !== lib))} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                            </div>
                                        ))}
                                        <button onClick={() => {
                                            const url = prompt('Module URL:');
                                            if(url) setExternalLibraries([...externalLibraries, url]);
                                        }} className="w-full py-3 border border-dashed border-[var(--border)] rounded text-[9px] font-bold uppercase text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/30 transition-all flex items-center justify-center">
                                            <PlusCircle size={12} className="mr-2" /> Add_Source
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSidebar === 'settings' && (
                                <div className="space-y-10 text-left">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Interface_Theme</label>
                                            <ThemeSwitcher />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Font_Size ({fontSize}px)</label>
                                            <input 
                                                type="range" min="10" max="24" value={fontSize} 
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                className="w-full h-1 bg-[var(--bg-elevated)] rounded-full appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Word_Wrap</label>
                                            <div className="flex bg-[var(--bg-main)] p-1 rounded border border-[var(--border)]">
                                                <button onClick={() => setWordWrap('on')} className={`flex-1 py-2 text-[9px] font-bold uppercase rounded transition-all ${wordWrap === 'on' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>On</button>
                                                <button onClick={() => setWordWrap('off')} className={`flex-1 py-2 text-[9px] font-bold uppercase rounded transition-all ${wordWrap === 'off' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Off</button>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-[var(--border)] space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] italic">Privacy_Shield</label>
                                                {!isPro && (
                                                    <Link href="#" className="flex items-center gap-1 text-[8px] font-black text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                        <Crown size={8} /> Upgrade
                                                    </Link>
                                                )}
                                            </div>
                                            
                                            <div className={`p-4 rounded-xl border transition-all ${isPrivate ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        {isPrivate ? <Lock size={14} className="text-rose-500" /> : <Unlock size={14} className="text-emerald-500" />}
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{isPrivate ? 'Private_Core' : 'Public_Stream'}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => isPro && setIsPrivate(!isPrivate)}
                                                        disabled={!isPro}
                                                        className={`relative w-10 h-5 rounded-full transition-colors ${!isPro ? 'bg-slate-800 opacity-50 cursor-not-allowed' : (isPrivate ? 'bg-rose-500' : 'bg-slate-700')}`}
                                                    >
                                                        <motion.div 
                                                            animate={{ x: isPrivate ? 20 : 2 }}
                                                            className="absolute top-1 w-3 h-3 bg-white rounded-full"
                                                        />
                                                    </button>
                                                </div>
                                                <p className="text-[8px] leading-relaxed text-[var(--text-muted)] font-medium uppercase tracking-tighter italic">
                                                    {isPrivate 
                                                        ? 'Restricted: This node is hidden from the explore grid and search protocols.' 
                                                        : 'Open: This node is visible to the entire community matrix.'}
                                                </p>
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