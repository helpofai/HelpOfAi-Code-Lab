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

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollToTop from '@/Components/Visuals/ScrollToTop';
import useThemeStore from '@/Stores/useThemeStore';
import { ToastProvider } from '@/Components/Toast/ToastProvider';

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
            // Light: #fafafa, Dark: #030303
            root.style.backgroundColor = activeTheme === 'dark' ? '#030303' : '#fafafa';
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
        <ToastProvider>
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
        </ToastProvider>
    );
}