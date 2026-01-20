import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Code2, Settings, Wand2, Cloud, GitFork, Loader2 } from 'lucide-react';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorHeader({ handleSave, isSaving, isOwner }) {
    const { auth } = usePage().props;
    const { title, setTitle } = useProjectStore();

    return (
        <header className="h-16 bg-[#010101] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                        <Code2 className="text-cyan-400" size={20} />
                    </div>
                    <span className="font-black tracking-tight text-white uppercase text-sm hidden md:block">HOACodeLab</span>
                </Link>
                <div className="h-6 w-px bg-white/10 hidden md:block" />
                <div>
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0 w-32 md:w-48 placeholder-gray-600 truncate"
                        placeholder="Untitled Project"
                    />
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {auth.user ? auth.user.name : 'Guest'}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 bg-[#252830] hover:bg-[#343742] text-white rounded-md transition-all">
                    <Settings size={16} />
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-md text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : (isOwner ? <Cloud size={14} /> : <GitFork size={14} />)}
                    <span>{isOwner ? 'Save' : 'Fork'}</span>
                </button>
            </div>
        </header>
    );
}