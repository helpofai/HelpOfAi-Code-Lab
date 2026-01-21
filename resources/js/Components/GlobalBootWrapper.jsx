import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollToTop from '@/Components/Visuals/ScrollToTop';
import useThemeStore from '@/Stores/useThemeStore';

export default function GlobalBootWrapper({ children }) {
    const { theme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const activeTheme = theme === 'auto' ? systemTheme : theme;

        root.classList.remove('light', 'dark');
        root.classList.add(activeTheme);
        
        // Ensure background matches theme immediately to prevent flash
        root.style.backgroundColor = activeTheme === 'dark' ? '#050505' : '#ffffff';
    }, [theme]);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans transition-colors duration-300">
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