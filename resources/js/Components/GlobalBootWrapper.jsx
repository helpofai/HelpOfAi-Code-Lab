import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SystemBoot from '@/Components/Visuals/SystemBoot';

export default function GlobalBootWrapper({ children }) {
    const [isBooted, setIsBooted] = useState(false);

    // We can also trigger re-boots on Inertia navigation if desired, 
    // but usually, a single boot per session is more professional.
    
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
            </motion.div>
        </>
    );
}
