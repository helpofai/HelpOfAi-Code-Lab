import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Tooltip wrapper for icon buttons.
 * Usage: <Tooltip content="Save (Ctrl+S)"><button>...</button></Tooltip>
 */
export default function Tooltip({ content, shortcut, children, position = 'top', delay = 500 }) {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);

    const show = () => {
        timerRef.current = setTimeout(() => setVisible(true), delay);
    };

    const hide = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setVisible(false);
    };

    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
        left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
        right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-zinc-800 border-x-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800 border-x-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-zinc-800 border-y-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-zinc-800 border-y-transparent border-l-transparent',
    };

    return (
        <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
            {children}
            <AnimatePresence>
                {visible && content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.12 }}
                        className={`absolute z-[9998] px-2.5 py-1.5 bg-zinc-800 border border-white/10 rounded-md shadow-xl pointer-events-none whitespace-nowrap ${positions[position]}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-white/90 leading-none">{content}</span>
                            {shortcut && (
                                <kbd className="text-[9px] font-mono text-white/40 bg-white/5 px-1 py-0.5 rounded border border-white/10 leading-none">
                                    {shortcut}
                                </kbd>
                            )}
                        </div>
                        <div className={`absolute border-4 ${arrows[position]}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
