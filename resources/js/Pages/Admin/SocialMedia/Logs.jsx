import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Share2, Activity, AlertCircle, CheckCircle2, ChevronRight, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialMediaLogs({ auth, logs }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Social Media Activity Logs</h2>}
        >
            <Head title="Social Media Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-4 sm:px-0">
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-primary)] flex items-center gap-3">
                                <Activity className="text-blue-500" size={32} />
                                Broadcast Activity Logs
                            </h1>
                            <p className="text-[var(--text-muted)] mt-2 text-sm">
                                View real-time status of automated project broadcasts to Telegram and WhatsApp.
                            </p>
                        </div>
                        <Link 
                            href={route('admin.social-media.settings')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all shadow-sm"
                        >
                            <ArrowLeft size={16} /> Back to Settings
                        </Link>
                    </div>

                    <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] shadow-2xl sm:rounded-[2rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] uppercase tracking-wider text-[10px] font-black border-b border-[var(--border)]">
                                    <tr>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Platform</th>
                                        <th className="px-6 py-4">Project</th>
                                        <th className="px-6 py-4">Error Message</th>
                                        <th className="px-6 py-4">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {logs.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-[var(--text-muted)]">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Activity size={48} className="mb-4 opacity-20" />
                                                    <p className="font-semibold text-lg">No broadcast logs found</p>
                                                    <p className="text-sm mt-1">Logs will appear here once projects are published.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.data.map((log) => (
                                            <motion.tr 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={log.id} 
                                                className="hover:bg-[var(--bg-elevated)]/50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    {log.status === 'success' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold uppercase">
                                                            <CheckCircle2 size={14} /> Success
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase">
                                                            <AlertCircle size={14} /> Failed
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {log.platform === 'telegram' ? (
                                                            <Send size={16} className="text-blue-500" />
                                                        ) : (
                                                            <MessageCircle size={16} className="text-green-500" />
                                                        )}
                                                        <span className="font-semibold text-[var(--text-primary)] capitalize">{log.platform}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {log.project ? (
                                                        <div className="flex items-center gap-2 max-w-[200px] truncate">
                                                            <span className="text-[var(--text-primary)] font-medium truncate" title={log.project.title}>{log.project.title}</span>
                                                            <a href={`/project/${log.project_id}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400">
                                                                <ChevronRight size={14} />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[var(--text-muted)] italic">Deleted Project</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs truncate text-[var(--text-muted)] font-mono text-[10px]" title={log.error_message}>
                                                    {log.error_message || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--text-muted)]">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {logs.links && logs.links.length > 3 && (
                            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)] flex justify-center">
                                <div className="flex gap-1 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border)]">
                                    {logs.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                link.active 
                                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
