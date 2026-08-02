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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Activity, RefreshCw } from 'lucide-react';

export default function NoInternetOverlay() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => setIsOffline(false);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg-main)]/90 backdrop-blur-xl font-sans"
                >
                    {/* Matrix / Sci-Fi Background Decor */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500 rounded-full blur-[120px] opacity-20"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500 rounded-full blur-[120px] opacity-20"></div>
                        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-5"></div>
                    </div>

                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="max-w-md w-full relative z-10 px-6"
                    >
                        <div className="bg-[var(--bg-surface)] border border-rose-500/30 rounded-3xl p-1 relative overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.15)]">
                            
                            {/* Animated Edge Glow */}
                            <motion.div 
                                className="absolute inset-0 bg-rose-500 opacity-20 blur-xl"
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />

                            <div className="bg-[var(--bg-main)] rounded-[1.25rem] p-8 relative z-10 text-center space-y-6">
                                {/* Animated Icon */}
                                <div className="relative mx-auto w-24 h-24">
                                    <motion.div 
                                        className="w-full h-full rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/20"
                                        animate={{ 
                                            boxShadow: ['0 0 10px rgba(225,29,72,0)', '0 0 30px rgba(225,29,72,0.4)', '0 0 10px rgba(225,29,72,0)']
                                        }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <WifiOff size={48} className="text-rose-500 relative z-10 drop-shadow-xl" />
                                    </motion.div>
                                    
                                    {/* Scanner line */}
                                    <motion.div 
                                        className="absolute inset-0 border-t-2 border-rose-500 rounded-2xl opacity-50"
                                        animate={{ y: [0, 96, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-2xl font-black uppercase tracking-widest text-rose-500 drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                                        Link_Severed
                                    </h2>
                                    
                                    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-left relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-rose-500 to-transparent opacity-50"></div>
                                        <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider leading-relaxed">
                                            <span className="text-rose-500">{'>'} SYSTEM_LOG: </span> 
                                            Neural connection to the mainframe has been lost. Awaiting restoration of local uplink signals.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="w-full py-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(225,29,72,0.1)]"
                                    >
                                        <RefreshCw size={16} className="group-hover:animate-spin" /> Force Reconnect
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
