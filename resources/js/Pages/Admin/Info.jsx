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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Info, FileText, ChevronRight, BookOpen, 
    Zap, ShieldAlert, Terminal, ArrowLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ProBackground from '@/Components/Visuals/ProBackground';

export default function AdminInfo({ infoFiles }) {
    const [activeFile, setActiveFile] = useState(infoFiles[0]?.name || null);

    const activeContent = infoFiles.find(f => f.name === activeFile)?.content || '';

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center w-full relative z-10">
                        <div className="flex items-center space-x-4 text-left">
                            <div className="p-2 bg-rose-500/10 border border-rose-400/30 rounded-lg">
                                <Info className="text-rose-500" size={20} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">System_Intelligence</h2>
                                <p className="text-[8px] text-rose-500 font-bold uppercase tracking-[0.4em] mt-1">Documentation & Logistics</p>
                            </div>
                        </div>
                    </div>
                }
            >
                <Head title="System Intelligence" />
                
                <div className="relative flex flex-col min-h-full">
                    
                    {/* Top Navigation Tabs */}
                    <div className="w-full border-b border-[var(--border)] bg-[var(--bg-surface)]/50 backdrop-blur-md overflow-x-auto no-scrollbar shrink-0 sticky top-0 z-20 transition-all">
                        <div className="max-w-6xl mx-auto px-8 flex">
                            {infoFiles.map((file) => (
                                <button
                                    key={file.name}
                                    onClick={() => setActiveFile(file.name)}
                                    className={`flex items-center gap-3 px-8 py-5 transition-all relative group whitespace-nowrap ${
                                        activeFile === file.name 
                                        ? 'text-rose-500' 
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                                    }`}
                                >
                                    <FileText size={14} className={activeFile === file.name ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{file.display}</span>
                                    
                                    {activeFile === file.name && (
                                        <motion.div 
                                            layoutId="activeTabIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                                            initial={false}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Display Area */}
                    <div className="flex-1 bg-[var(--bg-main)]/30 relative">
                        <div className="max-w-6xl mx-auto p-8 lg:p-16 text-left">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFile}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.25 }}
                                    className="prose prose-invert prose-rose max-w-none text-left
                                        prose-headings:text-left prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic
                                        prose-h1:text-5xl prose-h1:mb-12 prose-h1:text-white
                                        prose-h2:text-2xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4
                                        prose-p:text-[var(--text-muted)] prose-p:leading-relaxed prose-p:text-lg
                                        prose-code:bg-rose-500/10 prose-code:text-rose-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                        prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-pre:p-8
                                        prose-li:text-[var(--text-muted)]
                                        prose-strong:text-white
                                        prose-table:text-left
                                    "
                                >
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]} 
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {activeContent || "# Empty\nThis page contains no data."}
                                    </ReactMarkdown>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </AuthenticatedLayout>
        </div>
    );
}
