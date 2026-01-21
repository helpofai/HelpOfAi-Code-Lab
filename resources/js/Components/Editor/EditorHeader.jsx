import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Code2, Settings, Wand2, Cloud, GitFork, Loader2 } from 'lucide-react';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorHeader({ handleSave, isSaving, isOwner, formatCode, isFormatting, setActiveSidebar }) {
    const { auth } = usePage().props;
    const { title, setTitle } = useProjectStore();

    return (
        <header className="h-16 bg-[#0a0a0a] border-b border-white/[0.03] flex items-center justify-between px-4 shrink-0 relative z-50">
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

            <div className="flex items-center gap-3">
                <button 
                    onClick={formatCode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                    <Wand2 size={12} className={isFormatting ? 'animate-spin' : ''} />
                    <span className="hidden md:block">Format</span>
                </button>
                <button 
                    onClick={() => setActiveSidebar('settings')}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded transition-all"
                >
                    <Settings size={14} />
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary"
                >
                    {isSaving ? <Loader2 size={12} className="animate-spin inline mr-2" /> : (isOwner ? <Cloud size={12} className="inline mr-2" /> : <GitFork size={12} className="inline mr-2" />)}
                    <span>{isOwner ? 'Save' : 'Fork'}</span>
                </button>
            </div>
        </header>
    );
}