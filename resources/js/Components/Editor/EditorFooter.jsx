/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

import React from 'react';
import { Terminal, Package, FolderPlus, GitFork, Code, Download, Share2, Cloud, RefreshCw, Users } from 'lucide-react';

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
        <footer className="h-10 bg-[var(--bg-main)] border-t border-[var(--border)] overflow-x-auto no-scrollbar shrink-0 transition-colors duration-300">
            <div className="flex items-center justify-between min-w-max h-full px-4">
                <div className="flex items-center h-full">
                    <button 
                        onClick={() => setShowConsole(!showConsole)} 
                        className={`flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${showConsole ? 'bg-cyan-500 text-white dark:text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]'}`}
                    >
                        <Terminal size={14} /> Console
                    </button>
                    <div className="w-px h-4 bg-[var(--border)] mx-1"></div>
                    <button 
                        onClick={() => setActiveSidebar('assets')} 
                        className={`flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSidebar === 'assets' ? 'bg-cyan-500 text-white dark:text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]'}`}
                    >
                        <Package size={14} /> Assets
                    </button>
                    <div className="w-px h-4 bg-[var(--border)] mx-1"></div>
                    <button 
                        onClick={() => setActiveSidebar('cloud')} 
                        className={`flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSidebar === 'cloud' ? 'bg-cyan-500 text-white dark:text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]'}`}
                    >
                        <Cloud size={14} /> Cloud
                    </button>
                    <div className="w-px h-4 bg-[var(--border)] mx-1"></div>
                    <button 
                        onClick={() => setActiveSidebar('history')} 
                        className={`flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSidebar === 'history' ? 'bg-cyan-500 text-white dark:text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]'}`}
                    >
                        <RefreshCw size={14} /> History
                    </button>
                    <div className="w-px h-4 bg-[var(--border)] mx-1"></div>
                    <button 
                        onClick={() => setActiveSidebar('team')} 
                        className={`flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSidebar === 'team' ? 'bg-purple-500 text-white dark:text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]'}`}
                    >
                        <Users size={14} /> Team
                    </button>
                </div>

                <div className="flex items-center h-full gap-1">
                    {[
                        { label: 'Collection', icon: FolderPlus, act: () => { setActiveModal('collection'); fetchCollections(); } },
                        { label: 'Fork', icon: GitFork, act: handleFork },
                        { label: 'Embed', icon: Code, act: () => setActiveModal('embed') },
                        { label: 'Export', icon: Download, act: handleExport },
                    ].map((item) => (
                        <button key={item.label} onClick={item.act} className="flex items-center gap-2 px-3 h-full text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)] transition-all whitespace-nowrap">
                            <item.icon size={12} /> <span className="hidden md:block">{item.label}</span>
                        </button>
                    ))}
                    <div className="w-px h-4 bg-[var(--border)] mx-2"></div>
                    <button onClick={() => setActiveModal('share')} className="h-full px-6 flex items-center gap-2 bg-[var(--bg-elevated)] border-x border-[var(--border)] hover:bg-cyan-500 hover:text-white dark:hover:text-black text-cyan-500 font-bold uppercase text-[10px] tracking-widest transition-all whitespace-nowrap">
                        <Share2 size={12} /> Share
                    </button>
                </div>
            </div>
        </footer>
    );
}