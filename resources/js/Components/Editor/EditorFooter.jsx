import React from 'react';
import { Terminal, Package, MessageSquare, FolderPlus, GitFork, Code, Download, Share2 } from 'lucide-react';

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
        <footer className="h-10 bg-[#010101] border-t border-white/5 flex items-center justify-between px-4 shrink-0 overflow-x-auto">
            <div className="flex items-center h-full min-w-max">
                <button 
                    onClick={() => setShowConsole(!showConsole)} 
                    className={`flex items-center space-x-2 px-4 h-full transition-all ${showConsole ? 'bg-white/10 text-cyan-400 shadow-[inset_0_2px_0_#06b6d4]' : 'text-slate-500 hover:text-white'}`}
                >
                    <Terminal size={12} /> 
                    <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Console</span>
                </button>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <button 
                    onClick={() => setActiveSidebar('assets')} 
                    className={`flex items-center space-x-2 px-4 h-full transition-all ${activeSidebar === 'assets' ? 'bg-white/10 text-cyan-400 shadow-[inset_0_2px_0_#06b6d4]' : 'text-slate-500 hover:text-white'}`}
                >
                    <Package size={12} /> 
                    <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Assets</span>
                </button>
                <button 
                    onClick={() => setActiveSidebar('settings')} 
                    className={`flex items-center space-x-2 px-4 h-full transition-all ${activeSidebar === 'settings' ? 'bg-white/10 text-cyan-400 shadow-[inset_0_2px_0_#06b6d4]' : 'text-slate-500 hover:text-white'}`}
                >
                    <MessageSquare size={12} /> 
                    <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Settings</span>
                </button>
            </div>

            <div className="flex items-center h-full space-x-px min-w-max">
                <button 
                    onClick={() => { setActiveModal('collection'); fetchCollections(); }} 
                    className="flex items-center space-x-2 px-4 h-full text-slate-500 hover:text-white transition-all border-l border-white/5"
                >
                    <FolderPlus size={12} /> 
                    <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Collection</span>
                </button>
                <button 
                    onClick={handleFork} 
                    className="flex items-center space-x-2 px-4 h-full text-slate-500 hover:text-white transition-all border-l border-white/5"
                >
                    <GitFork size={12} /> 
                    <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Fork</span>
                </button>
                <button 
                    onClick={() => setActiveModal('embed')} 
                    className="flex items-center space-x-2 px-4 h-full text-slate-500 hover:text-white transition-all border-l border-white/5"
                >
                    <Code size={12} /> 
                    <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Embed</span>
                </button>
                <button 
                    onClick={handleExport} 
                    className="flex items-center space-x-2 px-4 h-full text-slate-500 hover:text-white transition-all border-l border-white/5"
                >
                    <Download size={12} /> 
                    <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Export</span>
                </button>
                <button 
                    onClick={() => setActiveModal('share')} 
                    className="flex items-center space-x-2 px-6 h-full bg-cyan-500 text-black font-black uppercase text-[9px] tracking-widest hover:bg-white transition-all"
                >
                    <Share2 size={12} /> <span>Share</span>
                </button>
            </div>
        </footer>
    );
}