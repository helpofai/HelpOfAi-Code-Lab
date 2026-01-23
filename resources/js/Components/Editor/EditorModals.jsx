import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Code, FolderPlus, Lock, Globe, ArrowLeft } from 'lucide-react';
import useProjectStore from '@/Stores/useProjectStore';

export default function EditorModals({ 
    activeModal, 
    setActiveModal, 
    project, 
    collections, 
    addToCollection, 
    createCollection 
}) {
    const [newCollectionTitle, setNewCollectionTitle] = useState('');
    const { isPrivate, setIsPrivate } = useProjectStore();

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
                                    <Share2 className="text-purple-500" size={20} />
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Share Project</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                                        <code className="text-[10px] text-purple-400 truncate mr-6 font-mono select-all">
                                            {project?.slug ? `${window.location.origin}/editor/${project.slug}` : 'Save project to generate link'}
                                        </code>
                                        {project?.slug && (
                                            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/editor/${project.slug}`); alert('Link Copied.'); }} className="p-2 hover:bg-[var(--bg-elevated)] rounded text-[var(--text-main)] transition-all">
                                                <Copy size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {project && (
                                        <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
                                            <div className="flex items-center gap-3">
                                                {isPrivate ? <Lock size={16} className="text-rose-500" /> : <Globe size={16} className="text-emerald-500" />}
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">
                                                        {isPrivate ? 'Private Access' : 'Public Access'}
                                                    </div>
                                                    <div className="text-[9px] text-[var(--text-muted)]">
                                                        {isPrivate ? 'Only you can view this node.' : 'Visible to the entire network.'}
                                                    </div>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="sr-only peer" />
                                                <div className="w-9 h-5 bg-[var(--bg-main)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                                            </label>
                                        </div>
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
                                    <button onClick={() => { navigator.clipboard.writeText(`<iframe src="${window.location.origin}/editor/${project?.slug}" style="width:100%; height:500px; border:none; border-radius: 8px; overflow:hidden;" sandbox="allow-scripts allow-same-origin"></iframe>`); alert('Embed Code Copied.'); }} className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 flex items-center gap-2 transition-colors">
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