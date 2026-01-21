import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollToTop from '@/Components/Visuals/ScrollToTop';

export default function GlobalBootWrapper({ children }) {
    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
            >
                {children}
                <ScrollToTop />
            </motion.div>
        </div>
    );
}