import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Calendar, User, ArrowRight, Sparkles, Search } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';

export default function BlogIndex({ posts, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeCategory, setActiveCategory] = useState(filters.category || 'ALL');

    // Simple debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('blog.index'), { search, category: activeCategory !== 'ALL' ? activeCategory : undefined }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        router.get(route('blog.index'), { search, category: cat !== 'ALL' ? cat : undefined }, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans selection:bg-purple-500/30">
            <ProBackground />
            <Head title="Blog // Transmissions" />

            <nav className="fixed top-0 w-full h-20 border-b border-[var(--border)] bg-[var(--bg-main)]/80 backdrop-blur-xl z-50 px-6 md:px-12 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 text-white rounded"><Code2 size={20} /></div>
                    <span className="text-xl font-black tracking-tighter uppercase italic">HOACodeLab</span>
                </Link>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <Link href={route('login')} className="text-[10px] font-black uppercase tracking-widest hover:text-purple-500 transition-colors">Login</Link>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Sparkles size={12} /> Signal_Stream
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Transmissions</h1>
                    </div>

                    {/* Filters & Search */}
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-[var(--bg-surface)] border border-[var(--border)] p-2 md:p-4 rounded-3xl shadow-xl">
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {['ALL', ...categories].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeCategory === cat 
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                                            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search Transmissions..." 
                                className="w-full bg-[var(--bg-elevated)] border-none rounded-full py-3 pl-10 pr-4 text-xs font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-purple-500/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.data.length > 0 ? posts.data.map((post, i) => (
                            <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={route('blog.show', post.slug)} className="group block h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                                    <div className="aspect-[4/3] bg-[var(--bg-elevated)] relative overflow-hidden">
                                        {post.image_path ? (
                                            <img src={`/storage/${post.image_path}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors">
                                                <Code2 size={48} className="text-purple-500/20 group-hover:text-purple-500/40 transition-colors" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <h2 className="text-xl font-bold uppercase leading-tight group-hover:text-purple-500 transition-colors line-clamp-2">{post.title}</h2>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><User size={12}/> {post.user.name}</span>
                                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.published_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="pt-4 flex items-center text-purple-500 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            Read_Transmission <ArrowRight size={14} className="ml-2" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-32 text-center text-[var(--text-muted)] italic">
                                <Code2 size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-bold uppercase tracking-widest">Signal_Lost</p>
                                <p className="text-xs">No transmissions found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
