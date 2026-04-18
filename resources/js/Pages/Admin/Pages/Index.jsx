import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Globe, Eye, Lock, Unlock, Search, ChevronRight } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import { motion } from 'framer-motion';

export default function PageIndex({ pages }) {
    const [search, setSearch] = useState('');

    const handleDelete = (id) => {
        if (confirm('De-replicate this page node from the system?')) {
            router.delete(route('admin.pages.destroy', id));
        }
    };

    const filteredPages = pages.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-500">
                                <FileText size={20} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Page_Matrix</h2>
                                <p className="text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1">Content Substrate</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                                <input 
                                    type="text"
                                    placeholder="Search Archives..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 w-full transition-all"
                                />
                            </div>
                            <Link href={route('admin.pages.create')} className="flex items-center px-6 py-2 bg-cyan-500 text-black rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-cyan-500/10 shrink-0">
                                <Plus className="mr-2" size={14} strokeWidth={3} /> New_Page_Node
                            </Link>
                        </div>
                    </div>
                }
            >
                <Head title="Page Management" />
                <div className="relative min-h-full p-6 md:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[var(--bg-main)]/50 border-b border-[var(--border)] text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                                        <tr>
                                            <th className="px-8 py-6">Identity (Title)</th>
                                            <th className="px-8 py-6">Signal_Path (Slug)</th>
                                            <th className="px-8 py-6">Visibility</th>
                                            <th className="px-8 py-6">Type</th>
                                            <th className="px-8 py-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)] text-[10px] font-bold uppercase tracking-widest">
                                        {filteredPages.map((page) => (
                                            <tr key={page.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-cyan-500/5 flex items-center justify-center text-cyan-500/50 group-hover:text-cyan-500 transition-colors">
                                                            <FileText size={14} />
                                                        </div>
                                                        <span className="text-[var(--text-main)] italic">{page.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[var(--text-muted)] font-mono text-[9px]">/{page.slug}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        {page.is_published ? (
                                                            <><Unlock size={12} className="text-emerald-500" /> <span className="text-emerald-500">Live</span></>
                                                        ) : (
                                                            <><Lock size={12} className="text-rose-500" /> <span className="text-rose-500">Hibernating</span></>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {page.is_system ? (
                                                        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[8px] font-black border border-rose-500/20">System_Core</span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[8px] font-black border border-[var(--border)]">Custom_Node</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <a href={`/p/${page.slug}`} target="_blank" className="p-2 hover:bg-cyan-500/10 rounded-lg text-cyan-500 transition-all opacity-0 group-hover:opacity-100"><Eye size={14} /></a>
                                                        <Link href={route('admin.pages.edit', page.id)} className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-white transition-all"><Edit size={14} /></Link>
                                                        {!page.is_system && (
                                                            <button onClick={() => handleDelete(page.id)} className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredPages.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">No page nodes detected in current sector.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
