import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';

export default function BlogIndex({ posts }) {
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
                    <div className="text-center mb-24 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Sparkles size={12} /> Signal_Stream
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Transmissions</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.data.map((post, i) => (
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
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
