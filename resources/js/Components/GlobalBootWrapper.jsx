import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollToTop from '@/Components/Visuals/ScrollToTop';
import useThemeStore from '@/Stores/useThemeStore';

export default function GlobalBootWrapper({ children }) {
    const { theme } = useThemeStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const root = window.document.documentElement;
        
        const applyTheme = () => {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const activeTheme = theme === 'auto' ? systemTheme : theme;

            root.classList.remove('light', 'dark');
            root.classList.add(activeTheme);
            
            // Set data-theme attribute for extra compatibility
            root.setAttribute('data-theme', activeTheme);
            
            // Sync background to prevent flashes
            root.style.backgroundColor = activeTheme === 'dark' ? '#050505' : '#ffffff';
            root.style.colorScheme = activeTheme;
        };

        applyTheme();

        // Listen for system theme changes if set to 'auto'
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'auto') applyTheme();
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // Prevent hydration mismatch by only rendering after mount
    if (!isMounted) return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen flex flex-col"
            >
                {children}
                <ScrollToTop />
            </motion.div>
        </div>
    );
}