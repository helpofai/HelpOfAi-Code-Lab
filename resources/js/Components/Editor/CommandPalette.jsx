import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Wand2, Layout, PanelBottom, PanelRight, PanelTop,
    Share2, Download, GitFork, FilePlus, Layers, Settings,
    Terminal, Search, ArrowRight, Command
} from 'lucide-react';

const COMMANDS = [
    { id: 'save', label: 'Save Project', icon: Save, shortcut: 'Ctrl+S', action: 'save' },
    { id: 'format', label: 'Format Code', icon: Wand2, shortcut: 'Ctrl+Shift+F', action: 'format' },
    { id: 'new', label: 'New Project', icon: FilePlus, shortcut: 'Ctrl+N', action: 'new' },
    { id: 'fork', label: 'Fork Project', icon: GitFork, shortcut: 'Ctrl+Shift+D', action: 'fork' },
    { id: 'console', label: 'Toggle Console', icon: Terminal, shortcut: 'Ctrl+J', action: 'console' },
    { id: 'layout-bottom', label: 'Layout: Bottom', icon: PanelBottom, shortcut: '', action: 'layout-bottom' },
    { id: 'layout-right', label: 'Layout: Right', icon: PanelRight, shortcut: '', action: 'layout-right' },
    { id: 'layout-top', label: 'Layout: Top', icon: PanelTop, shortcut: '', action: 'layout-top' },
    { id: 'share', label: 'Share Project', icon: Share2, shortcut: '', action: 'share' },
    { id: 'export', label: 'Export HTML', icon: Download, shortcut: '', action: 'export' },
    { id: 'sidebar', label: 'Toggle Sidebar', icon: Layers, shortcut: 'Ctrl+B', action: 'sidebar' },
    { id: 'settings', label: 'Project Settings', icon: Settings, shortcut: '', action: 'settings' },
];

export default function CommandPalette({ isOpen, onClose, onExecute }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const filtered = useMemo(() => {
        if (!query.trim()) return COMMANDS;
        const q = query.toLowerCase();
        return COMMANDS.filter(c =>
            c.label.toLowerCase().includes(q) || c.id.includes(q)
        );
    }, [query]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const execute = (cmd) => {
        onExecute(cmd.action);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            e.preventDefault();
            execute(filtered[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh]"
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Search input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                        <Search size={16} className="text-[var(--text-muted)] shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a command..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                        />
                        <kbd className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                            esc
                        </kbd>
                    </div>

                    {/* Command list */}
                    <div className="max-h-64 overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <div className="px-4 py-8 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                No commands found
                            </div>
                        ) : (
                            filtered.map((cmd, i) => {
                                const Icon = cmd.icon;
                                return (
                                    <button
                                        key={cmd.id}
                                        onClick={() => execute(cmd)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                                            i === selectedIndex
                                                ? 'bg-cyan-500/10 text-cyan-400'
                                                : 'text-[var(--text-main)] hover:bg-[var(--bg-elevated)]'
                                        }`}
                                        onMouseEnter={() => setSelectedIndex(i)}
                                    >
                                        <Icon size={16} className="shrink-0" />
                                        <span className="text-xs font-medium flex-1">{cmd.label}</span>
                                        {cmd.shortcut && (
                                            <kbd className="text-[10px] font-mono text-[var(--text-muted)]">
                                                {cmd.shortcut}
                                            </kbd>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                            <ArrowRight size={10} /> select
                        </span>
                        <span className="flex items-center gap-1">
                            <Command size={10} /> execute
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
