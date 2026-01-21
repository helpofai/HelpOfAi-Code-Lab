import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Code, FolderPlus } from 'lucide-react';

export default function EditorModals({ 
    activeModal, 
    setActiveModal, 
    project, 
    collections, 
    addToCollection, 
    createCollection 
}) {
    const [newCollectionTitle, setNewCollectionTitle] = useState('');

    const handleCreateCollection = () => {
        if (!newCollectionTitle) return;
        createCollection(newCollectionTitle);
        setNewCollectionTitle('');
    };

    return (
        <AnimatePresence>
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-lg rounded-2xl p-10 shadow-2xl overflow-hidden transition-colors duration-300">
                        <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"><X size={20} /></button>
                        
                        {activeModal === 'share' && (
                            <div className="space-y-8 text-left">
                                <div className="flex items-center gap-3">
                                    <Share2 className="text-cyan-500" size={20} />
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Broadcast_Module</h3>
                                </div>
                                <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded flex items-center justify-between">
                                    <code className="text-[10px] text-cyan-500 truncate mr-6 font-mono">{window.location.href}</code>
                                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Copied.'); }} className="p-2 hover:bg-[var(--bg-elevated)] rounded text-[var(--text-main)] transition-all"><Copy size={14} /></button>
                                </div>
                            </div>
                        )}

                        {activeModal === 'embed' && (
                            <div className="space-y-8 text-left">
                                <div className="flex items-center gap-3">
                                    <Code className="text-cyan-500" size={20} />
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Embed_Core</h3>
                                </div>
                                <textarea readOnly value={`<iframe src="${window.location.origin}/editor/${project?.slug}" style="width:100%; height:500px; border:none;" sandbox="allow-scripts"></iframe>`} className="w-full h-32 bg-[var(--bg-main)] border border-[var(--border)] rounded p-4 text-[10px] font-mono text-cyan-500 focus:ring-0 resize-none" />
                            </div>
                        )}

                        {activeModal === 'collection' && (
                            <div className="space-y-8 text-left">
                                <div className="flex items-center gap-3">
                                    <FolderPlus className="text-cyan-500" size={20} />
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Categorize</h3>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                    {collections.map(c => (
                                        <button key={c.id} onClick={() => addToCollection(c.id)} className="w-full p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded hover:border-cyan-500/40 text-left flex justify-between items-center transition-all">
                                            <span className="font-bold text-[var(--text-main)] uppercase text-[10px] tracking-widest">{c.title}</span>
                                            <span className="text-[9px] text-[var(--text-muted)] font-black">{c.projects_count} Cores</span>
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