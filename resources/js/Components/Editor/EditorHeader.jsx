import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Code2, Settings, Wand2, Cloud, GitFork, Loader2, PanelBottom, PanelRight, PanelTop, CloudUpload, Share2, ChevronRight } from 'lucide-react';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorHeader({ handleSave, handleCloudSave, isSaving, isOwner, formatCode, isFormatting, setActiveSidebar, setActiveModal }) {
    const { auth } = usePage().props;
    const { title, setTitle, layout, setLayout } = useProjectStore();
    const [isTitleExpanded, setIsTitleExpanded] = useState(false);

    return (
        <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center px-4 shrink-0 relative z-50 transition-colors duration-300">
            <div className={`flex items-center gap-2 transition-all duration-300 ${isTitleExpanded ? 'w-full' : 'w-auto'}`}>
                <Link href="/dashboard" className={`flex items-center gap-2 group shrink-0 ${isTitleExpanded ? 'hidden sm:flex' : 'flex'}`}>
                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded">
                        <Code2 className="text-cyan-400" size={18} />
                    </div>
                    {!isTitleExpanded && <span className="font-bold tracking-tight text-white uppercase text-sm hidden lg:block italic">HOACodeLab</span>}
                </Link>
                
                <div 
                    onClick={() => setIsTitleExpanded(!isTitleExpanded)}
                    className={`flex items-center gap-2 bg-black/20 border border-white/5 rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-300 ${isTitleExpanded ? 'flex-1' : 'w-10 sm:w-48'}`}
                >
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0 placeholder-white/20 truncate leading-none transition-all duration-300 ${isTitleExpanded ? 'w-full block' : 'hidden sm:block'}`}
                        placeholder="Untitled"
                    />
                    {!isTitleExpanded && <span className="sm:hidden text-cyan-500 font-black text-[10px] uppercase tracking-tighter shrink-0">Node</span>}
                    <ChevronRight size={14} className={`text-slate-600 transition-transform duration-300 ${isTitleExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <div className={`flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth ml-auto justify-end px-2 ${isTitleExpanded ? 'hidden sm:flex' : 'flex'}`}>
                {/* Layout Controls (Desktop Only) */}
                <div className="hidden lg:flex items-center bg-black/20 p-1 rounded-lg border border-white/5 gap-1 shrink-0">
                    <button onClick={() => setLayout('bottom')} className={`p-1.5 rounded transition-all ${layout === 'bottom' ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:text-white'}`}><PanelBottom size={14} /></button>
                    <button onClick={() => setLayout('right')} className={`p-1.5 rounded transition-all ${layout === 'right' ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:text-white'}`}><PanelRight size={14} /></button>
                    <button onClick={() => setLayout('top')} className={`p-1.5 rounded transition-all ${layout === 'top' ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:text-white'}`}><PanelTop size={14} /></button>
                </div>

                <button 
                    onClick={formatCode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border)] rounded text-[10px] font-bold uppercase tracking-widest shrink-0"
                >
                    <Wand2 size={12} className={isFormatting ? 'animate-spin' : ''} />
                    <span className="hidden sm:block">Format</span>
                </button>
                
                <button 
                    onClick={() => setActiveSidebar('settings')}
                    className="p-2 bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border)] rounded shrink-0"
                >
                    <Settings size={14} />
                </button>
                
                <button 
                    onClick={() => setActiveModal('share')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded text-[10px] font-bold uppercase tracking-widest shrink-0"
                >
                    <Share2 size={14} />
                    <span className="hidden sm:block">Share</span>
                </button>

                {auth.user?.google_drive_token && (
                    <button 
                        onClick={handleCloudSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest shrink-0"
                    >
                         {isSaving ? <Loader2 size={12} className="animate-spin" /> : <CloudUpload size={14} />}
                         <span className="hidden sm:block">Cloud</span>
                    </button>
                )}

                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary shrink-0 px-4 py-2 rounded font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 bg-cyan-500 text-black shadow-lg"
                >
                    {isSaving ? <Loader2 size={12} className="animate-spin" /> : (isOwner ? <Cloud size={12} /> : <GitFork size={12} />)}
                    <span>{isOwner ? 'Save' : 'Fork'}</span>
                </button>
            </div>
        </header>
    );
}