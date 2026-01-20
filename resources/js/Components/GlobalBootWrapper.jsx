import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SystemBoot from '@/Components/Visuals/SystemBoot';
import ScrollToTop from '@/Components/Visuals/ScrollToTop';

export default function GlobalBootWrapper({ children }) {
    const [isBooted, setIsBooted] = useState(false);

    return (
        <>
            <AnimatePresence mode="wait">
                {!isBooted && (
                    <SystemBoot key="boot" onComplete={() => setIsBooted(true)} />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isBooted ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="min-h-screen h-full"
            >
                {children}
                <ScrollToTop />
            </motion.div>
        </>
    );
}