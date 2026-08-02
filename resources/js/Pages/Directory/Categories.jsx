import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { motion } from 'framer-motion';
import { FolderHeart, ChevronRight, Hash, ArrowRight } from 'lucide-react';

export default function Categories({ categories }) {
    return (
        <PublicLayout>
            <Head title="Browse Categories" />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-cyan-500/20"
                    >
                        <FolderHeart size={12} />
                        Explore Categories
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-[var(--text-main)] uppercase tracking-tighter italic mb-6 leading-none"
                    >
                        Browse By <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Category</span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto font-medium"
                    >
                        Discover thousands of premium source codes, templates, and digital assets curated across specialized technology domains.
                    </motion.p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link 
                                href={route('public.categories.show', { slug: category.category })}
                                className="group block h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/5 group-hover:bg-cyan-500/10 rounded-full blur-2xl transition-all duration-500" />
                                
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black dark:group-hover:text-white transition-all duration-500 shadow-lg">
                                            <Hash size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tight mb-2 group-hover:text-cyan-500 transition-colors">
                                            {category.category}
                                        </h3>
                                    </div>
                                    
                                    <div className="mt-8 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-main)] px-3 py-1.5 rounded-full border border-[var(--border)]">
                                            {category.count} Projects
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-cyan-500 group-hover:text-black dark:group-hover:text-white group-hover:border-cyan-500 transition-all duration-300">
                                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-20 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
                        <FolderHeart size={48} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                        <h3 className="text-xl font-black text-[var(--text-main)] uppercase">No Categories Found</h3>
                        <p className="text-[var(--text-muted)] mt-2">Projects have not been categorized yet.</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
