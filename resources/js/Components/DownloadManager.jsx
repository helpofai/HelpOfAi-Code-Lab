/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/Components/Toast/ToastProvider';

const DownloadContext = createContext();

export const useDownloadManager = () => useContext(DownloadContext);

export default function DownloadManagerProvider({ children }) {
    const [downloads, setDownloads] = useState([]);
    const toast = useToast();

    const startDownload = async (url, filename, title) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newDownload = {
            id,
            title,
            progress: 0,
            status: 'downloading', // downloading, success, error
            loaded: 0,
            total: 0
        };

        setDownloads(prev => [...prev, newDownload]);

        try {
            const res = await axios.get(url, {
                responseType: 'blob',
                onDownloadProgress: (progressEvent) => {
                    const total = progressEvent.total || 0;
                    const loaded = progressEvent.loaded || 0;
                    const progress = total ? Math.round((loaded * 100) / total) : 0;
                    
                    setDownloads(prev => prev.map(d => 
                        d.id === id ? { ...d, progress, loaded, total } : d
                    ));
                }
            });

            const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);

            setDownloads(prev => prev.map(d => 
                d.id === id ? { ...d, status: 'success', progress: 100 } : d
            ));

            // Auto-remove after 3 seconds on success
            setTimeout(() => {
                removeDownload(id);
            }, 3000);

        } catch (error) {
            console.error("Download failed", error);
            setDownloads(prev => prev.map(d => 
                d.id === id ? { ...d, status: 'error' } : d
            ));
            toast.error(`Failed to download ${title}`);
        }
    };

    const removeDownload = (id) => {
        setDownloads(prev => prev.filter(d => d.id !== id));
    };

    return (
        <DownloadContext.Provider value={{ startDownload }}>
            {children}
            
            {/* The Moveable Widget Container */}
            <AnimatePresence>
                {downloads.length > 0 && (
                    <motion.div
                        drag
                        dragMomentum={false}
                        initial={{ opacity: 0, y: 50, x: 0 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-[100] w-80 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden cursor-move"
                        style={{ touchAction: "none" }}
                    >
                        <div className="bg-[var(--bg-surface-hover)] px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Download size={16} className="text-cyan-500" />
                                Downloads ({downloads.length})
                            </h3>
                            <button 
                                onClick={() => setDownloads([])}
                                className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto p-2 space-y-2">
                            {downloads.map(download => (
                                <div key={download.id} className="p-3 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-medium truncate pr-4" title={download.title}>
                                            {download.title}
                                        </p>
                                        {download.status === 'downloading' && <Loader2 size={16} className="animate-spin text-cyan-500 shrink-0" />}
                                        {download.status === 'success' && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                                        {download.status === 'error' && <AlertCircle size={16} className="text-red-500 shrink-0" />}
                                    </div>
                                    
                                    {download.status === 'downloading' && (
                                        <div className="space-y-1">
                                            <div className="w-full bg-[var(--bg-surface)] rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                    className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300" 
                                                    style={{ width: `${download.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                                                <span>{download.progress}%</span>
                                                <span>{(download.loaded / 1024 / 1024).toFixed(1)} MB / {download.total ? (download.total / 1024 / 1024).toFixed(1) + ' MB' : '...'}</span>
                                            </div>
                                        </div>
                                    )}

                                    {download.status === 'error' && (
                                        <p className="text-xs text-red-400">Download failed. Please try again.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DownloadContext.Provider>
    );
}
