import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Code, FolderPlus, Download } from 'lucide-react';

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
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setActiveModal(null)} 
                        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.9, opacity: 0 }} 
                        className="relative bg-[#1d1e22] border border-white/10 w-full max-w-xl rounded-3xl p-12 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                        
                        {activeModal === 'share' && (
                            <div className="space-y-10">
                                <div className="flex items-center space-x-4 mb-8">
                                    <Share2 className="text-cyan-400" size={24} />
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white">Broadcast_Module</h3>
                                </div>
                                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <code className="text-xs text-cyan-500/60 truncate mr-10">{window.location.href}</code>
                                    <button 
                                        onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Linked copied.'); }} 
                                        className="p-3 bg-white/5 text-white hover:bg-white hover:text-black rounded-xl transition-all"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeModal === 'embed' && (
                            <div className="space-y-10">
                                <div className="flex items-center space-x-4 mb-8">
                                    <Code className="text-cyan-400" size={24} />
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white">Neural_Embedding</h3>
                                </div>
                                <textarea 
                                    readOnly 
                                    value={`<iframe src="${window.location.origin}/editor/${project?.slug}" style="width:100%; height:500px; border:none;" sandbox="allow-scripts"></iframe>`} 
                                    className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-[10px] font-mono text-cyan-500/60 focus:ring-0" 
                                />
                            </div>
                        )}

                        {activeModal === 'collection' && (
                            <div className="space-y-10">
                                <div className="flex items-center space-x-4 mb-8">
                                    <FolderPlus className="text-cyan-400" size={24} />
                                    <h3 className="text-xl font-black uppercase tracking-widest text-white">Archive_To_Collection</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto space-y-3">
                                    {collections.map(c => (
                                        <button 
                                            key={c.id} 
                                            onClick={() => addToCollection(c.id)} 
                                            className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-cyan-500/40 text-left flex justify-between items-center transition-all"
                                        >
                                            <span className="font-bold text-white uppercase text-xs tracking-widest">{c.title}</span>
                                            <span className="text-[10px] text-gray-500">{c.projects_count} Cores</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-white/5 flex space-x-4">
                                    <input 
                                        value={newCollectionTitle} 
                                        onChange={e => setNewCollectionTitle(e.target.value)} 
                                        placeholder="New_Collection_Title..." 
                                        className="flex-1 bg-black/40 border-white/10 rounded-xl px-6 text-sm focus:ring-cyan-500 text-white" 
                                    />
                                    <button 
                                        onClick={handleCreateCollection} 
                                        className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] rounded-xl hover:bg-cyan-400 transition-all"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => setActiveModal(null)} 
                            className="absolute top-10 right-10 text-gray-500 hover:text-white transition-all"
                        >
                            <X size={24} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}