import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { 
    RefreshCw, GitBranch, GitCommit, Clock, 
    CheckCircle, AlertCircle, Server, Terminal,
    ArrowUpCircle, Activity, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Update({ currentVersion, buildId, lastCommitDate, commits, localPendingMigrations, systemInfo, gitStatus }) {
    const { flash = {} } = usePage().props;
    const [isChecking, setIsChecking] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateLogs, setUpdateLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const logsEndRef = useRef(null);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [updateLogs]);

    const handleCheckUpdate = () => {
        setIsChecking(true);
        router.post(route('admin.update.check'), {}, {
            preserveScroll: true,
            onFinish: () => setIsChecking(false),
        });
    };

    const handleUpdateNow = async () => {
        if (!confirm("Are you sure you want to update the system? This might cause brief downtime.")) return;

        setIsUpdating(true);
        setUpdateLogs([]);
        setProgress(0);

        try {
            const response = await fetch(route('admin.update.start'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': usePage().props.auth?.csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split('\n\n');
                buffer = lines.pop(); // Keep the last incomplete chunk in the buffer

                for (const line of lines) {
                    if (line.trim().startsWith('data: ')) {
                        try {
                            const jsonStr = line.replace(/^data: /, '').trim();
                            if (!jsonStr) continue;
                            
                            const data = JSON.parse(jsonStr);
                            setUpdateLogs(prev => {
                                // Avoid duplicates if possible
                                if (prev.length > 0 && prev[prev.length - 1].message === data.message) return prev;
                                return [...prev, data];
                            });
                            
                            if (data.progress) setProgress(data.progress);
                            
                            if (data.status === 'done' || data.status === 'success' && data.progress === 100) {
                                setTimeout(() => window.location.reload(), 2000);
                            }
                        } catch (e) {
                            console.warn('Error parsing stream line:', line, e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Update failed', error);
            setUpdateLogs(prev => [...prev, { message: 'Connection failed or interrupted. Please check logs manually.', status: 'error' }]);
        } finally {
            // Keep the "Updating" state for a moment if successful to show 100%
            if (progress < 100) {
                 setIsUpdating(false);
            }
        }
    };

    const hasChangedFiles = flash.changedFiles && flash.changedFiles.length > 0;
    const hasRemoteMigrations = flash.remotePendingMigrations && flash.remotePendingMigrations.length > 0;
    const hasLocalMigrations = localPendingMigrations && localPendingMigrations.length > 0;
    const latestVersion = flash.latestVersion;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                            <GitBranch className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-tight italic">System_Update</h2>
                            <p className="text-[8px] text-purple-500/60 uppercase tracking-[0.4em] font-bold">Version Control Protocol</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="System Update" />

            <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10">
                
                {/* STATUS CARD */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                        <div className="w-full">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`w-3 h-3 rounded-full ${flash.updateAvailable ? 'bg-amber-500 animate-pulse' : 'bg-green-500'} shadow-[0_0_10px_currentColor]`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                                    Current_Status: {flash.updateAvailable ? 'UPDATE_PENDING' : 'OPTIMAL'}
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                                    VER: <span className="text-purple-400">{currentVersion}</span>
                                    {latestVersion && latestVersion !== currentVersion && (
                                        <span className="text-slate-500 ml-2 text-xl">→ <span className="text-amber-400">{latestVersion}</span></span>
                                    )}
                                </h3>
                                <span className="text-[10px] md:text-xs text-slate-600 font-mono uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Build: {buildId}</span>
                            </div>
                            <p className="text-xs font-mono text-slate-400 flex items-center">
                                <Clock size={12} className="mr-2" /> Last Sync: {lastCommitDate}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 sm:space-x-4">
                            <button 
                                onClick={handleCheckUpdate}
                                disabled={isChecking || isUpdating}
                                className={`group flex-1 sm:flex-initial justify-center px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed ${isChecking ? 'animate-pulse' : ''}`}
                            >
                                <RefreshCw size={14} className={isChecking ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'} />
                                <span>{isChecking ? 'Syncing...' : 'Check_Updates'}</span>
                            </button>

                            {flash.updateAvailable && (
                                gitStatus === 'OK' ? (
                                    <button 
                                        onClick={handleUpdateNow}
                                        disabled={isUpdating}
                                        className="group flex-1 sm:flex-initial justify-center px-6 md:px-8 py-3 md:py-4 bg-purple-600 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl hover:bg-purple-500 transition-all flex items-center space-x-3 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                                    >
                                        <ArrowUpCircle size={14} className={isUpdating ? 'animate-bounce' : ''} />
                                        <span>{isUpdating ? 'Updating...' : 'Update_Now'}</span>
                                    </button>
                                ) : (
                                    <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-[10px] font-bold text-rose-400 uppercase tracking-wide">
                                        Auto-Update Unavailable (Git/Proc_Open Disabled). Please update manually via FTP.
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* LIVE TERMINAL LOGS */}
                    <AnimatePresence>
                        {isUpdating && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-8 overflow-hidden"
                            >
                                <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-4 font-mono text-xs max-h-64 overflow-y-auto custom-scrollbar">
                                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                                        <span className="text-slate-500 uppercase tracking-widest text-[10px]">System_Log</span>
                                        <span className="text-purple-400 font-bold">{progress}%</span>
                                    </div>
                                    <div className="space-y-1">
                                        {updateLogs.length === 0 && (
                                            <div className="text-slate-500 italic">Initializing stream connection...</div>
                                        )}
                                        {updateLogs.map((log, i) => (
                                            <div key={i} className={`flex items-start space-x-2 ${log.status === 'error' ? 'text-rose-400' : log.status === 'success' ? 'text-green-400' : 'text-slate-300'}`}>
                                                <span className="text-slate-600">[{log.timestamp}]</span>
                                                <span>{log.message}</span>
                                            </div>
                                        ))}
                                        <div ref={logsEndRef} />
                                    </div>
                                </div>
                                <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-purple-500"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {flash.message && !isUpdating && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-8 p-4 rounded-xl border ${flash.updateAvailable ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-green-500/10 border-green-500/30 text-green-400'} flex items-center space-x-3`}
                        >
                            {flash.updateAvailable ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                            <span className="text-xs font-bold uppercase tracking-wider">{flash.message}</span>
                        </motion.div>
                    )}
                </div>

                {/* DATABASE STATUS */}
                {(hasLocalMigrations || hasRemoteMigrations) && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <Database size={20} className="text-amber-500" />
                            <h4 className="text-sm font-black uppercase tracking-widest text-amber-500">Database_Schema_Alert</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Local Pending Migrations</div>
                                {hasLocalMigrations ? (
                                    <ul className="space-y-2">
                                        {localPendingMigrations.map(m => (
                                            <li key={m} className="text-xs font-mono text-white bg-black/40 px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between">
                                                <span>{m}</span>
                                                <span className="text-[9px] text-amber-500 font-bold uppercase">Pending</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-xs text-green-400 font-bold uppercase flex items-center"><CheckCircle size={14} className="mr-2"/> Local Schema Synced</div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Incoming Migrations (Remote)</div>
                                {hasRemoteMigrations ? (
                                    <ul className="space-y-2">
                                        {flash.remotePendingMigrations.map(m => (
                                            <li key={m} className="text-xs font-mono text-white bg-black/40 px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between">
                                                <span className="truncate">{m.split('/').pop()}</span>
                                                <span className="text-[9px] text-amber-500 font-bold uppercase">Incoming</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-xs text-green-400 font-bold uppercase flex items-center"><CheckCircle size={14} className="mr-2"/> No Incoming Schema Changes</div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* CHANGED FILES */}
                {hasChangedFiles && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/40 border border-white/5 rounded-[2rem] p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <GitBranch size={20} className="text-cyan-500" />
                                <h4 className="text-sm font-black uppercase tracking-widest text-cyan-500">Incoming_File_Manifest</h4>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{flash.changedFiles.length} Files Modified</span>
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-1">
                            {flash.changedFiles.map((file, i) => (
                                <div key={i} className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-xl transition-colors font-mono text-xs border-b border-white/5 last:border-0">
                                    <span className={`w-6 text-center font-bold ${file.status === 'M' ? 'text-amber-400' : file.status === 'A' ? 'text-green-400' : 'text-rose-400'}`}>
                                        [{file.status}]
                                    </span>
                                    <span className="text-slate-300 truncate">{file.file}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* LOGS & ENV */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center space-x-3 px-2">
                            <Terminal size={16} className="text-purple-500" />
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Changelog_Stream</h4>
                        </div>

                        <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
                            {commits.map((commit, i) => (
                                <motion.div 
                                    key={commit.hash}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-6 border-b border-white/5 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-3">
                                            <GitCommit size={16} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                                            <span className="text-xs font-mono text-purple-400/60 group-hover:text-purple-400 transition-colors">{commit.hash}</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{commit.time}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors pl-7">{commit.message}</p>
                                    <div className="pl-7 mt-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
                                        Authored by: {commit.author}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-3 px-2">
                            <Server size={16} className="text-cyan-500" />
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">System_Diagnostics</h4>
                        </div>
                        
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-6">
                             <div className="space-y-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">PHP Runtime</span>
                                <div className="text-sm font-mono text-white flex justify-between">
                                    <span>{systemInfo?.php_version || '8.x'}</span>
                                    <span className="text-white/20 text-[10px]">{systemInfo?.os}</span>
                                </div>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="space-y-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Core Framework</span>
                                <div className="text-sm font-mono text-white">Laravel {systemInfo?.laravel_version}</div>
                            </div>
                            <div className="h-px bg-white/5" />
                             <div className="space-y-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Environment</span>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${systemInfo?.environment === 'production' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                        <span className={`text-sm font-bold uppercase ${systemInfo?.environment === 'production' ? 'text-green-500' : 'text-amber-500'}`}>{systemInfo?.environment || 'Unknown'}</span>
                                    </div>
                                    {systemInfo?.debug_mode && (
                                        <span className="text-[8px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-wider">Debug_Mode</span>
                                    )}
                                </div>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Database</span>
                                    <span className="text-xs text-white uppercase font-bold">{systemInfo?.database_connection}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Cache</span>
                                    <span className="text-xs text-white uppercase font-bold">{systemInfo?.cache_driver}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <Activity className="text-cyan-400" size={20} />
                                <span className="text-xs font-black uppercase tracking-widest text-white">Server_Time</span>
                            </div>
                            <p className="text-sm font-mono text-cyan-400">
                                {systemInfo?.server_time}
                            </p>
                            <p className="text-[9px] text-cyan-500/50 mt-1 uppercase tracking-widest">{systemInfo?.timezone}</p>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}