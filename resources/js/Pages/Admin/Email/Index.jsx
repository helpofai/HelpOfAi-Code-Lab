import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Mail, Plus, Edit, Trash2, Send, Clock, CheckCircle2, XCircle, Activity, ChevronRight, Search } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailIndex({ templates, logs, stats }) {
    const [search, setSearch] = useState('');
    const [view, setView] = useState('templates'); // 'templates' or 'history'

    const handleDelete = (id) => {
        if (confirm('Delete this template?')) {
            router.delete(route('admin.email.destroy', id));
        }
    };

    const filteredTemplates = templates.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.subject.toLowerCase().includes(search.toLowerCase())
    );

    const filteredLogs = logs.filter(l => 
        l.recipient.toLowerCase().includes(search.toLowerCase()) || 
        l.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-purple-500/10 border border-purple-400/30 rounded-lg text-purple-500">
                                <Mail size={20} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Mail_System</h2>
                                <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Intelligence Hub</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                                <input 
                                    type="text"
                                    placeholder="Search Matrix..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-[var(--bg-surface)] border border-[var(--border)] rounded pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-purple-500/50 focus:ring-0 w-full"
                                />
                            </div>
                            <Link href={route('admin.email.send')} className="flex items-center px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:text-purple-500 transition-all shrink-0">
                                <Send className="mr-2" size={14} /> Send_Console
                            </Link>
                            <Link href={route('admin.email.create')} className="flex items-center px-6 py-2 bg-purple-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-purple-500/10 shrink-0">
                                <Plus className="mr-2" size={14} strokeWidth={3} /> New_Template
                            </Link>
                        </div>
                    </div>
                }
            >
                <Head title="Email Settings" />
                <div className="relative min-h-full p-6 md:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    
                    <div className="max-w-7xl mx-auto relative z-10 space-y-12">
                        
                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Protocols Executed', value: stats.total_sent, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                                { label: 'Broadcast Volume', value: stats.broadcasts, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/5' },
                                { label: 'Signal Failures', value: stats.total_failed, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/5' },
                            ].map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`p-6 rounded-3xl border border-[var(--border)] ${stat.bg} backdrop-blur-md flex items-center justify-between`}>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">{stat.label}</p>
                                        <p className="text-3xl font-black italic">{stat.value}</p>
                                    </div>
                                    <stat.icon className={stat.color} size={32} />
                                </motion.div>
                            ))}
                        </div>

                        {/* View Switcher */}
                        <div className="flex border-b border-[var(--border)] overflow-x-auto no-scrollbar">
                            <button onClick={() => setView('templates')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${view === 'templates' ? 'text-purple-500' : 'text-[var(--text-muted)] hover:text-white'}`}>
                                Template_Protocols
                                {view === 'templates' && <motion.div layoutId="emailTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />}
                            </button>
                            <button onClick={() => setView('history')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${view === 'history' ? 'text-purple-500' : 'text-[var(--text-muted)] hover:text-white'}`}>
                                Transmission_History
                                {view === 'history' && <motion.div layoutId="emailTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {view === 'templates' ? (
                                <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTemplates.map((template) => (
                                        <div key={template.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 hover:border-purple-500/50 transition-all shadow-xl group relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/10 group-hover:bg-purple-500 transition-all" />
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-4 bg-purple-500/5 rounded-2xl text-purple-500 group-hover:scale-110 transition-transform">
                                                    <Mail size={24} />
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={route('admin.email.edit', template.id)} className="p-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-[var(--text-muted)] hover:text-purple-500 transition-all shadow-lg"><Edit size={16} /></Link>
                                                    <button onClick={() => handleDelete(template.id)} className="p-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-[var(--text-muted)] hover:text-rose-500 transition-all shadow-lg"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{template.name}</h3>
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6 truncate">{template.subject}</p>
                                            <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                                                <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">ID_{template.id.toString().padStart(4, '0')}</span>
                                                <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest">{new Date(template.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredTemplates.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">No protocols found in database.</div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-[var(--bg-main)]/50 border-b border-[var(--border)] text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                                                <tr>
                                                    <th className="px-8 py-6">Recipient</th>
                                                    <th className="px-8 py-6">Subject</th>
                                                    <th className="px-8 py-6">Type</th>
                                                    <th className="px-8 py-6">Status</th>
                                                    <th className="px-8 py-6">Timestamp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--border)] text-[10px] font-bold uppercase tracking-widest">
                                                {filteredLogs.map((log) => (
                                                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-8 py-6 text-[var(--text-main)] italic">{log.recipient}</td>
                                                        <td className="px-8 py-6 text-[var(--text-muted)] truncate max-w-xs">{log.subject}</td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black ${log.type === 'broadcast' ? 'bg-purple-500/10 text-purple-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                                                                {log.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2">
                                                                {log.status === 'sent' ? (
                                                                    <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span className="text-emerald-500">Delivered</span></>
                                                                ) : (
                                                                    <><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> <span className="text-rose-500">Failed</span></>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex justify-end items-center gap-4">
                                                                <span className="text-[var(--text-muted)] font-mono text-[9px]">{new Date(log.created_at).toLocaleString()}</span>
                                                                <button 
                                                                    onClick={() => router.post(route('admin.email.resend', log.id))}
                                                                    className="p-2 hover:bg-purple-500/10 rounded-lg text-purple-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                    title="Resend Protocol"
                                                                >
                                                                    <RefreshCw size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredLogs.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">No transmission logs detected.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
