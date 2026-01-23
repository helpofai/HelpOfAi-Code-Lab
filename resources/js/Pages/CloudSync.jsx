import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cloud, Zap, Clock, ExternalLink, Share2, Trash2, 
    Search, Terminal, Database, Shield, RefreshCw,
    CloudOff, AlertTriangle, FileJson, Download,
    Cpu, Activity, Settings, Book, Key, Terminal as TerminalIcon,
    Save, Lock, CheckCircle2, FolderPlus, Link as LinkIcon, Code2,
    LayoutGrid, List
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

function CloudFileThumbnail({ file }) {
    const [fileContent, setFileContent] = useState(null);
    
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get(`/api/google-drive/fetch/${file.id}`);
                setFileContent(res.data);
            } catch (e) {}
        };
        fetchContent();
    }, [file.id]);

    const srcDoc = useMemo(() => {
        if (!fileContent?.code) return '';
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    html, body { background: #1d1e22; margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                    ${fileContent.code.css || ''}
                </style>
            </head>
            <body>${fileContent.code.html || ''}</body>
            </html>
        `;
    }, [fileContent]);

    return (
        <div className="w-full h-full bg-[#1d1e22] relative overflow-hidden">
            {fileContent ? (
                <div className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-[2s]">
                    <iframe srcDoc={srcDoc} title="t" className="border-none pointer-events-none absolute" style={{ width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: '0 0' }} sandbox="allow-scripts" />
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5"><div className="w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>
            )}
        </div>
    );
}

export default function CloudSync() {
    const { auth } = usePage().props;
    const [driveFiles, setDriveFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [importingId, setImportingId] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const { data, setData, post, processing } = useForm({
        google_client_id: auth.user.personal_google_client_id || '',
        google_client_secret: auth.user.personal_google_client_secret || '',
    });

    const fetchDriveFiles = useCallback(async () => {
        if (!auth.user.google_drive_token) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.get('/api/google-drive/list');
            setDriveFiles(res.data);
        } catch (e) {
            console.error("Cloud_Uplink_Refused");
        } finally { setIsLoading(false); }
    }, [auth.user.google_drive_token]);

    useEffect(() => {
        fetchDriveFiles();
    }, [fetchDriveFiles]);

    const submitConfig = (e) => {
        e.preventDefault();
        post(route('google-drive.save-config'), {
            preserveScroll: true,
            onSuccess: () => alert('Personal_API_Ciphers_Stored')
        });
    };

    const handleGoogleAuth = async () => {
        if (!auth.user.personal_google_client_id) return alert('Config_Required');
        try {
            const res = await axios.get('/api/google-drive/auth');
            window.location.href = res.data.url;
        } catch (e) { alert('Auth_Failed'); }
    };

    const disconnectDrive = async () => {
        if (!confirm('Terminate satellite link? Access tokens will be purged.')) return;
        try {
            await axios.post('/api/google-drive/disconnect');
            router.reload();
        } catch (e) { alert('Disconnect_Failed'); }
    };

    const importToLocal = async (fileId) => {
        setImportingId(fileId);
        try {
            const res = await axios.get(`/api/google-drive/fetch/${fileId}`);
            // Save to local DB via project store API
            const saveRes = await axios.post('/api/projects', {
                title: res.data.title + ' (Imported)',
                code: res.data.code,
                is_public: false,
                is_private: true
            });
            alert('Node_Replicated: Redirecting to local instance.');
            window.location.href = `/editor/${saveRes.data.slug}`;
        } catch (e) { alert('Replication_Failed'); }
        finally { setImportingId(null); }
    };

    const deleteDriveFile = async (fileId) => {
        if (!confirm('Destroy remote node permanently?')) return;
        try {
            await axios.delete(`/api/google-drive/delete/${fileId}`);
            setDriveFiles(driveFiles.filter(f => f.id !== fileId));
        } catch (e) { alert('Deletion_Failed'); }
    };

    const filteredFiles = driveFiles.filter(f => 
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 relative overflow-hidden transition-colors duration-300">
            <ProBackground />

            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6 relative z-10 text-left">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded shadow-sm">
                                <Cloud className="text-cyan-500" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">Cloud Sync</h2>
                                <p className="text-[8px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1">Google Drive Integration</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                                <input 
                                    type="text"
                                    placeholder="Search Remote Array..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-[var(--bg-surface)] border border-[var(--border)] rounded pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 w-full"
                                />
                            </div>
                            <div className="flex bg-[var(--bg-surface)] p-1 rounded border border-[var(--border)]">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)]'}`}><LayoutGrid size={16} /></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)]'}`}><List size={16} /></button>
                            </div>
                            <button onClick={fetchDriveFiles} className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:border-cyan-500/30 transition-all">
                                <RefreshCw size={14} className={isLoading ? 'animate-spin text-cyan-500' : 'text-[var(--text-muted)]'} />
                            </button>
                        </div>
                    </div>
                }
            >
                <Head title="Cloud Hub // Advanced Sync" />
                
                <div className="relative min-h-screen p-6 md:p-12 overflow-y-auto text-left">
                    <div className="max-w-7xl mx-auto relative z-10 space-y-12">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            
                            {/* Infrastructure Section */}
                            <div className="lg:col-span-1 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-purple-500 font-black text-[10px] uppercase tracking-widest italic">
                                        <LinkIcon size={14} /> Connection Settings
                                    </div>
                                    <form onSubmit={submitConfig} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20 group-hover:bg-purple-500 transition-all" />
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <InputLabel value="Client_ID" />
                                                <TextInput value={data.google_client_id} onChange={e => setData('google_client_id', e.target.value)} className="bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                            </div>
                                            <div className="space-y-2">
                                                <InputLabel value="Client_Secret" />
                                                <TextInput type="password" value={data.google_client_secret} onChange={e => setData('google_client_secret', e.target.value)} className="bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                            </div>
                                        </div>
                                        <PrimaryButton disabled={processing} className="w-full justify-center py-4 text-[10px] tracking-[0.2em]">Save Settings</PrimaryButton>
                                    </form>
                                </div>

                                <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] space-y-6 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all" />
                                    <div className="flex items-center gap-3 text-emerald-500">
                                        <Shield size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Connection Status</span>
                                    </div>
                                    <div className="space-y-4 text-[9px] font-bold uppercase tracking-widest">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-muted)]">State:</span>
                                            <span className={auth.user.google_drive_token ? 'text-emerald-500' : 'text-rose-500'}>{auth.user.google_drive_token ? 'ACTIVE' : 'OFFLINE'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-muted)]">Root Folder:</span>
                                            <span className="text-cyan-500 truncate ml-4">ID_{auth.user.google_drive_folder_id || 'N/A'}</span>
                                        </div>
                                    </div>
                                    {!auth.user.google_drive_token ? (
                                        <button onClick={handleGoogleAuth} className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-cyan-500 transition-all italic">Connect Google Drive</button>
                                    ) : (
                                        <button onClick={disconnectDrive} className="w-full py-3 bg-rose-500/10 border border-rose-500/20 rounded text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Disconnect</button>
                                    )}
                                </div>
                            </div>

                            {/* Distributed Node Array */}
                            <div className="lg:col-span-2 space-y-8 text-left">
                                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-full min-h-[600px]">
                                    <div className="p-8 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-elevated)]">
                                        <div className="flex items-center gap-3">
                                            <Database size={16} className="text-cyan-500" />
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-main)] italic">Cloud Files</h3>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] font-black text-cyan-500 uppercase tracking-widest">Folder: /HOACodeLab_Nodes</div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-x-auto p-6">
                                        {isLoading ? (
                                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest animate-pulse text-cyan-500 italic">Loading Files...</span>
                                            </div>
                                        ) : !auth.user.google_drive_token ? (
                                            <div className="flex flex-col items-center justify-center py-32 opacity-40 italic space-y-4">
                                                <CloudOff size={48} className="mx-auto" />
                                                <span className="text-[10px] font-black uppercase tracking-widest block">Connect Google Drive to view files.</span>
                                            </div>
                                        ) : filteredFiles.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-32 text-[var(--text-muted)] italic">
                                                <span className="text-[10px] font-black uppercase tracking-widest">No files found.</span>
                                            </div>
                                        ) : viewMode === 'grid' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredFiles.map((file, idx) => (
                                                    <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="group bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all shadow-lg text-left">
                                                        <div className="aspect-video bg-black relative border-b border-[var(--border)] overflow-hidden">
                                                            <CloudFileThumbnail file={file} />
                                                            <div className="absolute top-3 right-3 px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-widest z-20 bg-cyan-500/10 border-cyan-500/30 text-cyan-500">Cloud</div>
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="text-sm font-black text-[var(--text-main)] uppercase italic tracking-tight group-hover:text-cyan-500 transition-colors mb-4 truncate">{file.name.replace('.hoa.json', '')}</h3>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => importToLocal(file.id)} disabled={importingId === file.id} className="flex-1 py-2 bg-cyan-500 text-black rounded font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2">
                                                                    {importingId === file.id ? <RefreshCw size={12} className="animate-spin" /> : <Code2 size={12} />} Open
                                                                </button>
                                                                <a href={file.webViewLink} target="_blank" className="p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-white transition-colors"><ExternalLink size={14} /></a>
                                                                <button onClick={() => deleteDriveFile(file.id)} className="p-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <table className="w-full text-left">
                                                <thead className="bg-[var(--bg-main)]/50 border-b border-[var(--border)] text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                                                    <tr>
                                                        <th className="px-8 py-5">File Name</th>
                                                        <th className="px-8 py-5 text-right">Operations</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[var(--border)]">
                                                    {filteredFiles.map((file) => (
                                                        <tr key={file.id} className="hover:bg-white/[0.02] transition-colors group">
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="p-3 bg-white/5 rounded-2xl text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500"><FileJson size={18} /></div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-sm font-black uppercase tracking-tighter block leading-none">{file.name.replace('.hoa.json', '')}</span>
                                                                        <span className="text-[8px] text-[var(--text-muted)] font-mono uppercase italic">Synced: {new Date(file.modifiedTime).toLocaleString()}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6 text-right">
                                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button 
                                                                        onClick={() => importToLocal(file.id)}
                                                                        disabled={importingId === file.id}
                                                                        className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all"
                                                                        title="Load Remote Node"
                                                                    >
                                                                        <Code2 size={16} className={importingId === file.id ? 'animate-spin' : ''} />
                                                                    </button>
                                                                    <a href={file.webViewLink} target="_blank" className="p-3 bg-white/5 rounded-xl text-[var(--text-muted)] hover:text-white transition-all"><ExternalLink size={16} /></a>
                                                                    <button onClick={() => deleteDriveFile(file.id)} className="p-3 bg-rose-500/10 rounded-xl text-rose-500/50 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Easy Setup Guide */}
                        <div className="mt-20 pt-20 border-t border-[var(--border)]">
                            <div className="max-w-4xl mx-auto space-y-16">
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/10 rounded-full">
                                        <Zap size={12} className="text-cyan-500" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">Setup Instructions</span>
                                    </div>
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter">Easy Setup Guide</h3>
                                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-[0.2em]">Follow the signal path to establish your decentralized node.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-12 relative">
                                    {/* Vertical Signal Line */}
                                    <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-emerald-500 opacity-20 hidden md:block" />

                                    {/* Step 1 */}
                                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                            <Key size={18} className="text-cyan-500" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <h4 className="text-lg font-black uppercase italic tracking-tight text-white">01. Enable Google Drive API</h4>
                                                <span className="text-[8px] font-black uppercase px-2 py-1 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-md">Google Cloud Console</span>
                                            </div>
                                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 text-[10px] font-bold uppercase tracking-widest leading-loose text-[var(--text-muted)] italic">
                                                Open the <a href="https://console.cloud.google.com" target="_blank" className="text-cyan-400 underline">Google_Cloud_Dashboard</a> and create a project. In the <span className="text-white">Library</span>, enable the <span className="text-white underline">Google_Drive_API</span>. This grants the kernel permission to interact with satellite storage.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                            <Shield size={18} className="text-purple-500" />
                                        </div>
                                        <div className="flex-1 space-y-4 text-left">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                                                <h4 className="text-lg font-black uppercase italic tracking-tight text-white">02. Create Credentials</h4>
                                                <span className="text-[8px] font-black uppercase px-2 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-md text-left">OAuth Client ID</span>
                                            </div>
                                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 space-y-6">
                                                <p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-[var(--text-muted)] italic">
                                                    Create an <span className="text-white font-black">OAuth_2.0_Client_ID</span> (Web Application). Inject the following URI into the <span className="text-white">Authorized Redirect URIs</span> field:
                                                </p>
                                                <div className="group relative">
                                                    <code className="block bg-black px-4 py-3 rounded-xl text-emerald-500 lowercase text-[11px] font-mono border border-white/5 break-all leading-normal group-hover:border-emerald-500/30 transition-all">
                                                        {window.location.origin}/api/google-drive/callback
                                                    </code>
                                                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="bg-emerald-500 text-black text-[8px] font-black px-2 py-1 rounded shadow-xl uppercase">Callback URL</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <RefreshCw size={18} className="text-emerald-500" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <h4 className="text-lg font-black uppercase italic tracking-tight text-white">03. Connect Account</h4>
                                                <span className="text-[8px] font-black uppercase px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md">Final Step</span>
                                            </div>
                                            <div className="bg-black border border-white/5 rounded-2xl p-8 space-y-6 text-left">
                                                <div className="flex items-start gap-4">
                                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] leading-relaxed text-slate-400 italic">
                                                        Commit your Client ID and Secret in the <span className="text-white">Connection Settings</span> panel. Click <span className="text-cyan-500">'Connect Google Drive'</span> to perform the handshake. 
                                                        The platform will autonomousely create a <span className="text-white">/HOACodeLab_Nodes</span> directory in your Drive root.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}