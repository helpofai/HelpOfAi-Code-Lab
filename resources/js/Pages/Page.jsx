import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Zap, Clock, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PublicLayout from '@/Layouts/PublicLayout';

export default function PageViewer({ page }) {
    return (
        <PublicLayout>
            <Head>
                <title>{page.meta_title || `${page.title} // HOACodeLab`}</title>
                <meta name="description" content={page.meta_description} />
                <meta name="keywords" content={page.meta_keywords} />
            </Head>

            <main className="relative z-10 pt-48 pb-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-0.5 bg-cyan-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">Node_Protocol_{page.id}</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-none mb-12">
                            {page.title}
                        </h1>

                        <div className="flex items-center gap-8 mb-20 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] border-y border-[var(--border)] py-6">
                            <div className="flex items-center gap-2"><Globe size={14} className="text-cyan-500/40" /> Signal: Global</div>
                            <div className="flex items-center gap-2"><Clock size={14} className="text-cyan-500/40" /> Revised: {new Date(page.updated_at).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2"><Zap size={14} className="text-cyan-500/40" /> Verified: Stable</div>
                        </div>

                        <div 
                            className="prose prose-invert prose-cyan max-w-none mx-auto text-left
                                prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:text-[var(--text-main)] prose-headings:text-left
                                prose-p:text-[var(--text-muted)] prose-p:leading-relaxed prose-p:text-lg
                                prose-strong:text-white
                                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                                prose-code:bg-cyan-500/10 prose-code:text-cyan-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-pre:p-8
                                prose-li:text-[var(--text-muted)]
                            "
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </motion.div>
                </div>
            </main>
        </PublicLayout>
    );
}
