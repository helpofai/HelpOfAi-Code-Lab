import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { motion } from 'framer-motion';
import { Tag, Hash } from 'lucide-react';

export default function Tags({ tags }) {
    return (
        <PublicLayout>
            <Head title="Browse Tags" />

            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-purple-500/20"
                    >
                        <Tag size={12} />
                        Trending Tags
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-[var(--text-main)] uppercase tracking-tighter italic mb-6 leading-none"
                    >
                        Browse By <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Tag</span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto font-medium"
                    >
                        Find exactly what you're looking for by browsing our most popular technology tags and keywords.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
                <div className="flex flex-wrap justify-center gap-4">
                    {tags.map((tag, index) => (
                        <motion.div
                            key={tag.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (index % 20) * 0.03 }}
                        >
                            <Link 
                                href={route('public.tags.show', { slug: tag.name })}
                                className="group flex items-center gap-3 px-6 py-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-full hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300"
                            >
                                <Hash size={16} className="text-[var(--text-muted)] group-hover:text-purple-500 transition-colors" />
                                <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-tight group-hover:text-purple-500 transition-colors">
                                    {tag.name}
                                </span>
                                <span className="text-[10px] font-black text-[var(--text-muted)] bg-[var(--bg-main)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                                    {tag.count}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {tags.length === 0 && (
                    <div className="text-center py-20 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
                        <Tag size={48} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                        <h3 className="text-xl font-black text-[var(--text-main)] uppercase">No Tags Found</h3>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
