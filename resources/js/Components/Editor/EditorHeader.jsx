import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Code2, Settings, Wand2, Loader2, Cloud, GitFork } from 'lucide-react';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorHeader({ 
    isSaving, 
    handleSave, 
    isOwner, 
    project, 
    isFormatting, 
    formatCode, 
    setActiveSidebar 
}) {
    const { auth } = usePage().props;
    const { title, setTitle } = useProjectStore();

    return (
        <header className="h-16 bg-[#010101] border-b border-white/5 flex items-center justify-between px-4 md:px-6 z-50 shrink-0">
            <div className="flex items-center space-x-4 md:space-x-6">
                <Link href="/dashboard" className="flex items-center space-x-3 group">
                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                        <Code2 className="text-cyan-400" size={20} />
                    </div>
                    <span className="font-black tracking-tighter text-white uppercase text-sm hidden md:inline">HOACodeLab</span>
                </Link>
                <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                <div className="flex flex-col">
                    <input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0 w-32 md:w-48 placeholder-gray-600 truncate"
                        placeholder="Untitled_Module..."
                    />
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1 hidden md:block">
                        Node: {auth.user ? auth.user.name : 'Guest'}
                    </span>
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3">
                <button 
                    onClick={formatCode} 
                    className="px-3 md:px-4 py-2 bg-[#252830] hover:bg-[#343742] text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                    <Wand2 size={14} className={isFormatting ? 'animate-spin' : ''} /> 
                    <span className="hidden md:inline">Format</span>
                </button>
                <button 
                    onClick={() => setActiveSidebar('settings')} 
                    className="p-2.5 bg-[#252830] hover:bg-[#343742] text-white rounded-md transition-all"
                >
                    <Settings size={16} />
                </button>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className={`px-4 md:px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${
                        isOwner || !project ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-white' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    }`}
                >
                    {isSaving ? (
                        <Loader2 size={14} className="animate-spin md:mr-2" />
                    ) : (isOwner || !project ? <Cloud size={14} className="md:mr-2" /> : <GitFork size={14} className="md:mr-2" />)}
                    <span className="hidden md:inline">{isOwner || !project ? 'Save_Sync' : 'Fork_Module'}</span>
                </button>
            </div>
        </header>
    );
}