import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SystemBoot({ onComplete }) {
    const [status, setStatus] = useState([]);
    const messages = [
        "> INITIALIZING NEURAL_LINK...",
        "> SCANNING GLOBAL NODES [OK]",
        "> BYPASSING LATENCY FIREWALL...",
        "> INJECTING CORE DRIVERS...",
        "> PROTOCOL V4.2 ACTIVATED",
        "> ACCESS GRANTED."
    ];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                setStatus(prev => [...prev, messages[i]]);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 1000);
            }
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center font-mono p-10">
            <div className="max-w-md w-full">
                {status.map((msg, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-cyan-500 text-xs mb-2 flex items-center"
                    >
                        <span className="w-2 h-2 bg-cyan-500 mr-3 animate-pulse" />
                        {msg}
                    </motion.div>
                ))}
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "100%" }} 
                    transition={{ duration: 2.5, ease: "linear" }}
                    className="h-1 bg-cyan-900 mt-6"
                >
                    <div className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
                </motion.div>
            </div>
        </div>
    );
}
