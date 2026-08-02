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
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, AlertTriangle, XOctagon, Home, RefreshCw, Terminal, Activity, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ErrorPage({ status }) {
    const getErrorConfig = () => {
        switch (status) {
            case 404:
                return {
                    title: '404_NODE_NOT_FOUND',
                    description: 'The neural pathway you requested does not exist or has been severed. Please verify the destination coordinates.',
                    icon: AlertTriangle,
                    color: 'text-amber-500',
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/30',
                    shadow: 'shadow-amber-500/20',
                    glow: 'bg-amber-500',
                };
            case 403:
                return {
                    title: '403_ACCESS_DENIED',
                    description: 'Clearance level insufficient. You do not have the required cryptographic privileges to access this sector.',
                    icon: ShieldAlert,
                    color: 'text-rose-500',
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/30',
                    shadow: 'shadow-rose-500/20',
                    glow: 'bg-rose-500',
                };
            case 500:
                return {
                    title: '500_SYSTEM_FAILURE',
                    description: 'A critical logic error occurred in the core mainframe. Diagnostic protocols have been initiated.',
                    icon: XOctagon,
                    color: 'text-rose-500',
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/30',
                    shadow: 'shadow-rose-500/20',
                    glow: 'bg-rose-500',
                };
            case 503:
                return {
                    title: '503_MAINTENANCE_MODE',
                    description: 'The core network is currently undergoing scheduled upgrades or maintenance. Systems will resume shortly.',
                    icon: Activity,
                    color: 'text-cyan-500',
                    bg: 'bg-cyan-500/10',
                    border: 'border-cyan-500/30',
                    shadow: 'shadow-cyan-500/20',
                    glow: 'bg-cyan-500',
                };
            default:
                return {
                    title: `${status}_ANOMALY_DETECTED`,
                    description: 'An unknown anomaly interrupted your connection request to the server.',
                    icon: Terminal,
                    color: 'text-purple-500',
                    bg: 'bg-purple-500/10',
                    border: 'border-purple-500/30',
                    shadow: 'shadow-purple-500/20',
                    glow: 'bg-purple-500',
                };
        }
    };

    const config = getErrorConfig();
    const Icon = config.icon;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <Head title={`Error ${status}`} />

            {/* Matrix / Sci-Fi Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
                <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px] opacity-20 ${config.glow}`}></div>
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-5"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full relative z-10"
            >
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-1 relative overflow-hidden shadow-2xl">
                    
                    {/* Animated Edge Glow */}
                    <motion.div 
                        className={`absolute inset-0 opacity-30 blur-xl ${config.glow}`}
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    />

                    <div className="bg-[var(--bg-main)] rounded-[1.25rem] p-8 md:p-12 relative z-10">
                        <div className="flex flex-col items-center text-center space-y-8">
                            
                            {/* Error Icon */}
                            <div className="relative">
                                <motion.div 
                                    className={`w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl border ${config.bg} ${config.color} ${config.border} ${config.shadow}`}
                                    animate={{ 
                                        boxShadow: ['0 0 20px rgba(0,0,0,0)', `0 0 40px ${config.glow}40`, '0 0 20px rgba(0,0,0,0)']
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <Icon size={64} className="relative z-10 drop-shadow-2xl" />
                                </motion.div>
                                
                                {/* Glitch Overlay */}
                                <motion.div 
                                    className={`absolute inset-0 bg-transparent border-2 border-dashed ${config.border} rounded-3xl`}
                                    animate={{ rotate: [0, -2, 2, -1, 1, 0], scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
                                />
                            </div>

                            {/* Error Details */}
                            <div className="space-y-4 w-full">
                                <h1 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter ${config.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                                    {config.title}
                                </h1>
                                
                                <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-6 text-left relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[var(--text-muted)] to-transparent opacity-30"></div>
                                    <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest leading-relaxed">
                                        <span className={config.color}>{'>'} DIAGNOSTIC: </span> 
                                        {config.description}
                                    </p>
                                    <p className="text-[10px] font-mono text-[var(--text-muted)] opacity-50 uppercase tracking-widest mt-4">
                                        ERROR_CODE: {status} | T_STAMP: {new Date().toISOString()}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full flex flex-col md:flex-row gap-4 pt-4">
                                <button 
                                    onClick={() => window.history.back()}
                                    className={`flex-1 py-4 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[var(--bg-surface)] transition-all flex items-center justify-center gap-2 group`}
                                >
                                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Step Back
                                </button>
                                
                                <Link 
                                    href="/"
                                    className={`flex-1 py-4 ${config.glow} text-black rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}
                                >
                                    <Home size={16} /> Mainframe
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
