import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import useThemeStore from '@/Stores/useThemeStore';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useThemeStore();

    const options = [
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'dark', icon: Moon, label: 'Dark' },
        { id: 'auto', icon: Monitor, label: 'Auto' },
    ];

    return (
        <div className="flex items-center bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border)] shadow-inner">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`relative p-2 rounded flex items-center gap-2 transition-all ${
                        theme === opt.id 
                        ? 'text-cyan-500' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                    title={opt.label}
                >
                    {theme === opt.id && (
                        <motion.div 
                            layoutId="activeTheme"
                            className="absolute inset-0 bg-white dark:bg-white/5 rounded shadow-sm border border-black/5 dark:border-white/10"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <opt.icon size={14} className="relative z-10" />
                </button>
            ))}
        </div>
    );
}