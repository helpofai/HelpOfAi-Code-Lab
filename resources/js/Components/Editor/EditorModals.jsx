import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Code, FolderPlus, Lock, Globe, ArrowLeft, GitCompare, ArrowRight, Tag, CreditCard } from 'lucide-react';
import { DiffEditor } from '@monaco-editor/react';
import { useToast } from '@/Components/Toast/ToastProvider';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorModals({ 
    activeModal, 
    setActiveModal, 
    project, 
    collections, 
    addToCollection, 
    createCollection,
    diffRevision
}) {
    const [newCollectionTitle, setNewCollectionTitle] = useState('');
    const [diffType, setDiffType] = useState('html');
    const { isPrivate, setIsPrivate, isForSale, setIsForSale, price, setPrice, html, css, js } = useProjectStore();
    const toast = useToast();

    const handleCreateCollection = () => {
        if (!newCollectionTitle) return;
        createCollection(newCollectionTitle);
        setNewCollectionTitle('');
    };

    const currentCode = { html, css, js };

    return (
        <AnimatePresence>
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <motion.div 
                        initial={{ scale: 0.98, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.98, opacity: 0 }} 
                        className={`relative bg-[var(--bg-surface)] border border-[var(--border)] w-full ${activeModal === 'diff' ? 'max-w-6xl h-[80vh]' : 'max-w-lg'} rounded-2xl p-10 shadow-2xl overflow-hidden transition-all duration-300 flex flex-col`}
                    >
                        <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)] z-10 transition-all"><X size={20} /></button>
                        
                        {activeModal === 'diff' && diffRevision && (
                            <div className="flex-1 flex flex-col min-h-0 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500"><GitCompare size={20} /></div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Review Changes</h3>
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Comparing current with v{diffRevision.id}: {diffRevision.commit_message}</p>
                                        </div>
                                    </div>
                                    <div className="flex bg-[var(--bg-main)] p-1 rounded-lg border border-[var(--border)]">
                                        {['html', 'css', 'js'].map(type => (
                                            <button 
                                                key={type} 
                                                onClick={() => setDiffType(type)}
                                                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${diffType === type ? 'bg-cyan-500 text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 border border-[var(--border)] rounded-xl overflow-hidden bg-[#1e1e1e]">
                                    <DiffEditor
                                        height="100%"
                                        language={diffType === 'js' ? 'javascript' : diffType}
                                        theme="vs-dark"
                                        original={diffRevision.code[diffType]}
                                        modified={currentCode[diffType]}
                                        options={{
                                            renderSideBySide: true,
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 13,
                                            fontFamily: 'JetBrains Mono, Menlo, monospace',
                                            automaticLayout: true,
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-[var(--border)] text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-900/30 border border-red-500/30 rounded" /> Original</div>
                                        <ArrowRight size={10} />
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-900/30 border border-emerald-500/30 rounded" /> Modified</div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="px-6 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg hover:text-[var(--text-main)] transition-colors">Close Review</button>
                                </div>
                            </div>
                        )}

                        {activeModal === 'share' && (
                            <div className="space-y-8 text-left">
                                <div className="flex items-center gap-3">
                                    <Share2 className="text-purple-500" size={20} />
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Share Project</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                                        <code className="text-[10px] text-purple-400 truncate mr-6 font-mono select-all">
                                            {project?.slug ? `${window.location.origin}/editor/${project.slug}` : 'Save project to generate link'}
                                        </code>
                                        {project?.slug && (
                                            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/editor/${project.slug}`); toast.success('Link Copied.'); }} className="p-2 hover:bg-[var(--bg-elevated)] rounded text-[var(--text-main)] transition-all">
                                                <Copy size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {project && (
                                        <>
                                            <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
                                                <div className="flex items-center gap-3">
                                                    {isPrivate ? <Lock size={16} className="text-rose-500" /> : <Globe size={16} className="text-emerald-500" />}
                                                    <div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">
                                                            {isPrivate ? 'Private Access' : 'Public Access'}
                                                        </div>
                                                        <div className="text-[9px] text-[var(--text-muted)]">
                                                            {isPrivate ? 'Only you can view this project.' : 'Visible to everyone.'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-[var(--bg-main)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                                                </label>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
                                                    <div className="flex items-center gap-3">
                                                        <Tag size={16} className={isForSale ? 'text-cyan-500' : 'text-[var(--text-muted)]'} />
                                                        <div>
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">
                                                                Marketplace Listing
                                                            </div>
                                                            <div className="text-[9px] text-[var(--text-muted)]">
                                                                List this project for sale on the marketplace.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={isForSale} onChange={(e) => setIsForSale(e.target.checked)} className="sr-only peer" />
                                                        <div className="w-9 h-5 bg-[var(--bg-main)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                                                    </label>
                                                </div>

                                                {isForSale && (
                                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-cyan-500">Set Price (USD)</span>
                                                            <CreditCard size={14} className="text-cyan-500/50" />
                                                        </div>
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            value={price}
                                                            onChange={(e) => setPrice(e.target.value)}
                                                            className="w-full bg-[var(--bg-main)] border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-cyan-400 font-mono outline-none focus:border-cyan-500 transition-all"
                                                            placeholder="0.00"
                                                        />
                                                        <p className="text-[8px] text-[var(--text-muted)] italic">Code will be blurred until purchased. Previews remain public.</p>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                                    <button onClick={() => setActiveModal('embed')} className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 transition-colors">
                                        <Code size={14} /> Get Embed Code
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeModal === 'embed' && (
                            <div className="space-y-8 text-left">
                                <div className="flex items-center gap-3">
                                    <Code className="text-cyan-500" size={20} />
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Embed Project</h3>
                                </div>
                                <textarea 
                                    readOnly 
                                    value={project?.slug ? `<iframe src="${window.location.origin}/editor/${project.slug}" style="width:100%; height:500px; border:none; border-radius: 8px; overflow:hidden;" sandbox="allow-scripts allow-same-origin"></iframe>` : 'Save project first.'} 
                                    className="w-full h-32 bg-[var(--bg-main)] border border-[var(--border)] rounded p-4 text-[10px] font-mono text-cyan-500 focus:ring-0 resize-none" 
                                    onClick={(e) => e.target.select()}
                                />
                                <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
                                    <button onClick={() => setActiveModal('share')} className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 transition-colors">
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <button onClick={() => { navigator.clipboard.writeText(`<iframe src="${window.location.origin}/editor/${project?.slug}" style="width:100%; height:500px; border:none; border-radius: 8px; overflow:hidden;" sandbox="allow-scripts allow-same-origin"></iframe>`); toast.success('Embed Code Copied.'); }} className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 flex items-center gap-2 transition-colors">
                                        <Copy size={14} /> Copy Code
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeModal === 'collection' && (
                            <div className="space-y-8 text-left">
                                <div className="flex items-center gap-3">
                                    <FolderPlus className="text-cyan-500" size={20} />
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Add to Collection</h3>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                    {collections.map(c => (
                                        <button key={c.id} onClick={() => addToCollection(c.id)} className="w-full p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded hover:border-cyan-500/40 text-left flex justify-between items-center transition-all">
                                            <span className="font-bold text-[var(--text-main)] uppercase text-[10px] tracking-widest">{c.title}</span>
                                            <span className="text-[9px] text-[var(--text-muted)] font-black">{c.projects_count} Projects</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-[var(--border)] flex gap-2">
                                    <input value={newCollectionTitle} onChange={e => setNewCollectionTitle(e.target.value)} placeholder="Title..." className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded px-4 text-xs focus:ring-cyan-500 text-[var(--text-main)] font-bold uppercase tracking-widest" />
                                    <button onClick={handleCreateCollection} className="btn-primary text-[9px]">Create</button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}