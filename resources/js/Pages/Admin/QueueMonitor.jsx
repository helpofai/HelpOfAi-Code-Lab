import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Activity, RefreshCcw, Trash2, CheckCircle2, XCircle, Clock, Server, AlertTriangle, Terminal, Play } from 'lucide-react';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function QueueMonitor({ auth, pendingJobs, failedJobs, queueStats }) {
    const toast = useToast();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRetry = (id) => {
        router.post(route('admin.queue.retry', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Job pushed back to queue for retry.')
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this failed job record permanently?')) {
            router.delete(route('admin.queue.delete', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Failed job deleted.')
            });
        }
    };

    const handleClearPending = () => {
        if (confirm('Are you sure you want to clear all pending jobs? This cannot be undone.')) {
            router.delete(route('admin.queue.clear-pending'), {
                preserveScroll: true,
                onSuccess: () => toast.success('All pending jobs have been cleared.')
            });
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['pendingJobs', 'failedJobs', 'queueStats'],
            preserveScroll: true,
            onFinish: () => setTimeout(() => setIsRefreshing(false), 500)
        });
    };

    const handleProcessQueue = () => {
        setIsProcessing(true);
        toast.success('Starting queue processor. Please wait...', { duration: 3000 });
        router.post(route('admin.queue.process'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Queue processed successfully!');
            },
            onError: () => toast.error('Failed to process queue or timeout occurred.'),
            onFinish: () => setIsProcessing(false)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-[var(--text-main)] leading-tight tracking-widest uppercase">System Queue Monitor</h2>}
        >
            <Head title="Queue Monitor" />

            <div className="py-12 relative overflow-hidden">
                <div className="absolute top-20 left-20 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-20 right-20 w-[30rem] h-[30rem] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8 space-y-10 relative z-10">
                    
                    {/* Worker Notice for Shared Hosting */}
                    {((Array.isArray(pendingJobs) ? pendingJobs.length : Object.keys(pendingJobs || {}).length) > 0) && (
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="p-2 bg-blue-500/20 text-blue-500 rounded-xl"><Terminal size={20} /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-400">Manual Queue Processor</h4>
                                    <p className="text-xs text-blue-100/70 mt-1">If you are on shared hosting without background workers, you can process the pending jobs manually here.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleProcessQueue} 
                                    disabled={isProcessing}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'}`}
                                >
                                    {isProcessing ? <RefreshCcw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                                    {isProcessing ? 'Processing...' : 'Process Queue Now'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Stats Header */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 text-indigo-500/10"><Clock size={120} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2 relative z-10">Pending Jobs</h4>
                            <div className="text-4xl font-black text-[var(--text-primary)] italic relative z-10">{queueStats.pending}</div>
                        </div>
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 text-blue-500/10"><Activity size={120} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2 relative z-10">Processing Now</h4>
                            <div className="text-4xl font-black text-blue-500 italic relative z-10">{queueStats.processing}</div>
                        </div>
                        <div className="bg-[var(--bg-surface)] border border-rose-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(244,63,94,0.1)] relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 text-rose-500/10"><AlertTriangle size={120} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-2 relative z-10">Failed Jobs</h4>
                            <div className="text-4xl font-black text-rose-500 italic relative z-10">{queueStats.failed}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        {/* Pending Jobs Table */}
                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl rounded-[2rem] border border-[var(--border)] shadow-xl overflow-hidden flex flex-col min-h-[400px]">
                            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between bg-indigo-500/5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/20 text-indigo-500 rounded-xl"><Server size={24} /></div>
                                    <div>
                                        <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Active Queue</h3>
                                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Jobs waiting or processing</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {((Array.isArray(pendingJobs) ? pendingJobs.length : Object.keys(pendingJobs || {}).length) > 0) && (
                                        <button onClick={handleClearPending} className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
                                            Clear Pending
                                        </button>
                                    )}
                                    <button onClick={handleRefresh} className={`p-2 hover:bg-[var(--bg-elevated)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-white ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} title="Refresh">
                                        <RefreshCcw size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[var(--border)] bg-black/20">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Job Name</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Status</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {((Array.isArray(pendingJobs) ? pendingJobs : Object.values(pendingJobs || {})).length > 0) ? (Array.isArray(pendingJobs) ? pendingJobs : Object.values(pendingJobs)).map(job => (
                                            <tr key={job.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-xs font-bold text-[var(--text-primary)] mb-1">{job.name.split('\\').pop()}</div>
                                                    <div className="text-[10px] text-[var(--text-muted)] font-mono">{job.queue}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {job.status === 'processing' ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 animate-pulse"><Activity size={12}/> Processing</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"><Clock size={12}/> Pending</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right text-[10px] font-mono text-[var(--text-muted)]">
                                                    {job.created_at}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-[var(--text-muted)]">
                                                        <CheckCircle2 size={40} className="mb-3 text-emerald-500/50" />
                                                        <p className="text-sm font-bold">Queue is empty</p>
                                                        <p className="text-[10px] uppercase tracking-widest mt-1">All background tasks completed</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Failed Jobs Table */}
                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl rounded-[2rem] border border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.05)] overflow-hidden flex flex-col min-h-[400px]">
                            <div className="p-8 border-b border-rose-500/20 flex items-center justify-between bg-rose-500/5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl"><AlertTriangle size={24} /></div>
                                    <div>
                                        <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Failed Jobs</h3>
                                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Tasks requiring intervention</p>
                                    </div>
                                </div>
                                <button onClick={handleRefresh} className={`p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-rose-500 ${isRefreshing ? 'animate-spin' : ''}`} title="Refresh">
                                    <RefreshCcw size={16} />
                                </button>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-rose-500/20 bg-rose-500/5">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Job Name / Error</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {((Array.isArray(failedJobs) ? failedJobs : Object.values(failedJobs || {})).length > 0) ? (Array.isArray(failedJobs) ? failedJobs : Object.values(failedJobs)).map(job => (
                                            <tr key={job.id} className="border-b border-[var(--border)] last:border-0 hover:bg-rose-500/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="text-xs font-bold text-rose-400 mb-1">{job.name.split('\\').pop()}</div>
                                                    <div className="text-[10px] text-[var(--text-muted)] font-mono mb-2">{job.failed_at}</div>
                                                    <div className="text-[10px] text-[var(--text-muted)] max-w-sm font-mono truncate p-2 bg-black/40 rounded border border-white/5">{job.exception}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right align-top">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleRetry(job.id)}
                                                            className="p-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors border border-indigo-500/20"
                                                            title="Retry Job"
                                                        >
                                                            <RefreshCcw size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(job.id)}
                                                            className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors border border-rose-500/20"
                                                            title="Delete Permanently"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="2" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-[var(--text-muted)]">
                                                        <XCircle size={40} className="mb-3 text-[var(--border)]" />
                                                        <p className="text-sm font-bold">No failed jobs</p>
                                                        <p className="text-[10px] uppercase tracking-widest mt-1">System is healthy</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Auto-Queue Setup Instructions for Shared Hosting */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl mt-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><Server size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Automated Queue Setup (cPanel / Shared Hosting)</h3>
                                <p className="text-sm text-[var(--text-muted)] mt-1">Follow these steps to fully automate background jobs without needing Laravel Horizon.</p>
                            </div>
                        </div>
                        <div className="bg-black/40 border border-[var(--border)] rounded-xl p-6 text-sm text-[var(--text-muted)] space-y-4 font-mono leading-relaxed">
                            <p className="text-white font-bold mb-2 text-base font-sans">1. Go to your cPanel.</p>
                            <p className="text-white font-bold mb-2 text-base font-sans">2. Search for "Cron Jobs".</p>
                            <p className="text-white font-bold mb-2 text-base font-sans">3. Create a new Cron Job and set it to run Every Minute <span className="text-indigo-400">(* * * * *)</span>.</p>
                            <p className="text-white font-bold mb-2 text-base font-sans">4. In the Command field, enter your server's path to run the scheduler:</p>
                            <div className="p-4 bg-black rounded-lg border border-indigo-500/20 text-indigo-300 select-all my-3">
                                /usr/local/bin/php /home/yourusername/public_html/artisan schedule:run &gt;&gt; /dev/null 2&gt;&amp;1
                            </div>
                            <p className="italic text-xs text-white/50 font-sans mt-2">
                                (Note: Adjust <code className="text-rose-400">/usr/local/bin/php</code> to your server's actual PHP 8 path, and <code className="text-rose-400">/home/yourusername/...</code> to the path of your project).
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
