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

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, ArrowRight, Home, Code, ShoppingBag, Loader2, ShieldCheck, Zap, Activity, Cpu, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PaymentStatus({ auth, status, project, message }) {
    const isSuccess = status === 'success';
    const isPending = status === 'pending';

    return (

        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic">Handshake_Status</h2>}
        >
            <Head title="Payment Status" />

            <div className="py-24 px-6 flex items-center justify-center min-h-[70vh]">
                <div className="max-w-xl w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-1 md:p-2 relative overflow-hidden shadow-2xl"
                    >
                        {/* Animated Border Glow */}
                        <motion.div 
                            className={`absolute inset-0 opacity-20 blur-xl transition-colors duration-700 ${
                                isSuccess ? 'bg-emerald-500' : isPending ? 'bg-cyan-500' : 'bg-rose-500'
                            }`}
                            animate={isPending ? { scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />

                        <div className="bg-[var(--bg-main)] rounded-[1.25rem] p-8 md:p-12 relative z-10 overflow-hidden">
                            {/* Scanning overlay for pending state */}
                            {isPending && (
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent w-full h-[200px]"
                                    animate={{ top: ['-200px', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                />
                            )}
                            
                            <div className="flex flex-col items-center text-center space-y-8">
                                
                                {/* Icon container */}
                                <div className="relative">
                                    <motion.div 
                                        className={`w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl border ${
                                            isSuccess ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-emerald-500/20' : 
                                            isPending ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30 shadow-cyan-500/20' : 
                                            'bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-rose-500/20'
                                        }`}
                                        animate={isPending ? { rotate: [0, 90, 180, 270, 360] } : {}}
                                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                    >
                                        <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-2xl"></div>
                                        {isSuccess ? <CheckCircle size={56} className="relative z-10" /> : 
                                         isPending ? <Fingerprint size={56} className="relative z-10" /> : 
                                         <XCircle size={56} className="relative z-10" />}
                                    </motion.div>
                                    
                                    {isPending && (
                                        <motion.div 
                                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            <Loader2 size={16} className="text-black animate-spin" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Status Text */}
                                <div className="space-y-4 w-full">
                                    <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-widest ${
                                        isSuccess ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 
                                        isPending ? 'text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 
                                        'text-rose-500 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]'
                                    }`}>
                                        {isSuccess ? 'Handshake Confirmed' : (isPending ? 'Verifying Node' : 'Sequence Failed')}
                                    </h3>
                                    
                                    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 md:p-6 text-left relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[var(--text-muted)] to-transparent opacity-30"></div>
                                        <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider leading-relaxed">
                                            <span className="text-cyan-500">{'>'} SYSTEM_LOG: </span> 
                                            {isSuccess 
                                                ? `Cryptographic signature validated. Full access granted to module [${project?.title || 'PREMIUM'}].` 
                                                : isPending 
                                                    ? 'Establishing neural bridge... confirming payment sequence. Awaiting blockchain validation block. Do not disconnect.'
                                                    : message || 'Neural transaction was interrupted. Connection reset by peer.'}
                                        </p>
                                        
                                        {isPending && (
                                            <div className="mt-4 space-y-2">
                                                <div className="flex justify-between text-[8px] text-[var(--text-muted)] font-black tracking-[0.2em] uppercase">
                                                    <span>Decryption Progress</span>
                                                    <span className="text-cyan-500 animate-pulse">Syncing...</span>
                                                </div>
                                                <div className="w-full h-1 bg-[var(--bg-main)] rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="h-full bg-cyan-500"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: ["0%", "45%", "80%", "95%"] }}
                                                        transition={{ duration: 10, times: [0, 0.4, 0.8, 1] }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="w-full space-y-3 pt-4">
                                    {isSuccess ? (
                                        <Link 
                                            href={project ? route('editor', project.slug) : route('dashboard')}
                                            className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <Code size={18} className="group-hover:animate-bounce" /> Initialise Editor
                                        </Link>
                                    ) : isPending ? (
                                        <div className="w-full py-4 bg-[var(--bg-main)] border border-cyan-500/30 text-cyan-500 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 relative overflow-hidden">
                                            <motion.div 
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            />
                                            <Activity size={18} className="animate-pulse" /> Establishing Connection...
                                        </div>
                                    ) : (
                                        <Link 
                                            href={project ? route('checkout.project', project.slug) : route('dashboard')}
                                            className="w-full py-4 bg-rose-500 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Zap size={18} /> Retry Connection Sequence
                                        </Link>
                                    )}
                                    
                                    <Link 
                                        href={route('dashboard')}
                                        className="w-full py-4 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-xl font-black uppercase text-xs tracking-widest hover:text-[var(--text-main)] hover:border-gray-500/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Home size={18} /> Abort to Mainframe
                                    </Link>
                                </div>

                                {/* Security Footer */}
                                <div className="flex items-center justify-center gap-3 px-6 py-3 bg-[var(--bg-main)] rounded-full border border-[var(--border)]">
                                    <ShieldCheck size={14} className={isSuccess ? 'text-emerald-500' : isPending ? 'text-cyan-500 animate-pulse' : 'text-rose-500'} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                        {isSuccess ? 'Transaction Cryptographically Secured' : isPending ? 'Securing Quantum Link...' : 'Security Handshake Terminated'}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
