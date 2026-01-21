import React from 'react';
import { Terminal, Package, Settings, FolderPlus, GitFork, Code, Download, Share2 } from 'lucide-react';

export default function EditorFooter({ 
    showConsole, 
    setShowConsole, 
    activeSidebar, 
    setActiveSidebar, 
    setActiveModal, 
    handleFork, 
    handleExport,
    fetchCollections
}) {
    return (
        <footer className="h-10 bg-[#050505] border-t border-white/[0.03] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center h-full">
                <button 
                    onClick={() => setShowConsole(!showConsole)} 
                    className={`flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all ${showConsole ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    <Terminal size={14} /> Console
                </button>
                <div className="w-px h-4 bg-white/5 mx-1"></div>
                <button 
                    onClick={() => setActiveSidebar('assets')} 
                    className={`flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeSidebar === 'assets' ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    <Package size={14} /> Assets
                </button>
            </div>

            <div className="flex items-center h-full gap-1">
                {[
                    { label: 'Collection', icon: FolderPlus, act: () => { setActiveModal('collection'); fetchCollections(); } },
                    { label: 'Fork', icon: GitFork, act: handleFork },
                    { label: 'Embed', icon: Code, act: () => setActiveModal('embed') },
                    { label: 'Export', icon: Download, act: handleExport },
                ].map((item) => (
                    <button key={item.label} onClick={item.act} className="flex items-center gap-2 px-3 h-full text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                        <item.icon size={12} /> <span className="hidden md:block">{item.label}</span>
                    </button>
                ))}
                <div className="w-px h-4 bg-white/5 mx-2"></div>
                <button onClick={() => setActiveModal('share')} className="h-full px-6 flex items-center gap-2 bg-[#111] hover:bg-white hover:text-black text-cyan-400 font-bold uppercase text-[10px] tracking-widest transition-all">
                    <Share2 size={12} /> Share
                </button>
            </div>
        </footer>
    );
}