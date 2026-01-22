import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Code2, Settings, Wand2, Cloud, GitFork, Loader2, PanelBottom, PanelRight, PanelTop, CloudUpload } from 'lucide-react';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorHeader({ handleSave, handleCloudSave, isSaving, isOwner, formatCode, isFormatting, setActiveSidebar }) {
    const { auth } = usePage().props;
    const { title, setTitle, layout, setLayout } = useProjectStore();

    return (
        <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0 relative z-50 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded">
                        <Code2 className="text-cyan-400" size={18} />
                    </div>
                    <span className="font-bold tracking-tight text-white uppercase text-sm hidden md:block italic">HOACodeLab</span>
                </Link>
                <div className="h-6 w-px bg-white/5 hidden md:block" />
                <div className="flex flex-col">
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0 w-32 md:w-48 placeholder-white/20 truncate leading-none"
                        placeholder="Untitled_Module"
                    />
                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">
                        Node: {auth.user ? auth.user.name : 'Guest'}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Layout Controls */}
                <div className="hidden lg:flex items-center bg-black/20 p-1 rounded-lg border border-white/5 gap-1">
                    <button 
                        onClick={() => setLayout('bottom')}
                        className={`p-1.5 rounded transition-all ${layout === 'bottom' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title="Bottom Preview"
                    >
                        <PanelBottom size={14} />
                    </button>
                    <button 
                        onClick={() => setLayout('right')}
                        className={`p-1.5 rounded transition-all ${layout === 'right' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title="Right Preview"
                    >
                        <PanelRight size={14} />
                    </button>
                    <button 
                        onClick={() => setLayout('top')}
                        className={`p-1.5 rounded transition-all ${layout === 'top' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title="Top Preview"
                    >
                        <PanelTop size={14} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={formatCode}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border)] rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                        <Wand2 size={12} className={isFormatting ? 'animate-spin' : ''} />
                        <span className="hidden md:block">Format</span>
                    </button>
                    <button 
                        onClick={() => setActiveSidebar('settings')}
                        className="p-2 bg-[var(--bg-elevated)] hover:bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border)] rounded transition-all"
                    >
                        <Settings size={14} />
                    </button>
                    {auth.user?.google_drive_token && (
                        <button 
                            onClick={handleCloudSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                            title="Save to Google Drive"
                        >
                             {isSaving ? <Loader2 size={12} className="animate-spin inline" /> : <CloudUpload size={14} />}
                             <span className="hidden md:block">Push Cloud</span>
                        </button>
                    )}
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary"
                    >
                        {isSaving ? <Loader2 size={12} className="animate-spin inline mr-2" /> : (isOwner ? <Cloud size={12} className="inline mr-2" /> : <GitFork size={12} className="inline mr-2" />)}
                        <span>{isOwner ? 'Save' : 'Fork'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}