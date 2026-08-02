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

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
};

const COLORS = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    error: 'border-red-500/40 bg-red-500/10 text-red-400',
    info: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
};

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = ++toastId;
        setToasts(prev => [...prev.slice(-4), { id, message, type }]);

        if (duration > 0) {
            timersRef.current[id] = setTimeout(() => removeToast(id), duration);
        }

        return id;
    }, [removeToast]);

    const toast = useCallback({
        success: (msg, dur) => addToast(msg, 'success', dur),
        error: (msg, dur) => addToast(msg, 'error', dur ?? 5000),
        info: (msg, dur) => addToast(msg, 'info', dur),
        warning: (msg, dur) => addToast(msg, 'warning', dur ?? 4000),
    }, [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => {
                        const Icon = ICONS[t.type];
                        const color = COLORS[t.type];
                        return (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-lg border backdrop-blur-xl shadow-2xl ${color}`}
                                onClick={() => removeToast(t.id)}
                                role="alert"
                            >
                                <Icon size={16} className="shrink-0 mt-0.5" />
                                <p className="text-xs font-medium flex-1 leading-relaxed">{t.message}</p>
                                <button
                                    className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                                    onClick={(e) => { e.stopPropagation(); removeToast(t.id); }}
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
}
