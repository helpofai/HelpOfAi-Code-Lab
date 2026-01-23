import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Calendar, User, ArrowLeft, Share2, ArrowRight, Code2 } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogShow({ post, relatedPosts = [] }) {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans selection:bg-purple-500/30">
            <ProBackground />
            <Head>
                <title>{post.meta_title || post.title} // HOACodeLab</title>
                <meta name="description" content={post.meta_description || post.content.substring(0, 160)} />
                <meta name="keywords" content={post.meta_keywords || post.category} />
                <link rel="canonical" href={post.canonical_url || window.location.href} />
                
                {/* Open Graph */}
                <meta property="og:title" content={post.meta_title || post.title} />
                <meta property="og:description" content={post.meta_description || post.content.substring(0, 160)} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={post.og_image ? `/storage/${post.og_image}` : (post.image_path ? `/storage/${post.image_path}` : '/default-og.png')} />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.meta_title || post.title} />
                <meta name="twitter:description" content={post.meta_description || post.content.substring(0, 160)} />
                <meta name="twitter:image" content={post.og_image ? `/storage/${post.og_image}` : (post.image_path ? `/storage/${post.image_path}` : '/default-og.png')} />
            </Head>

            <nav className="fixed top-0 w-full h-20 border-b border-[var(--border)] bg-[var(--bg-main)]/80 backdrop-blur-xl z-50 px-6 md:px-12 flex items-center justify-between">
                <Link href={route('blog.index')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-purple-500 transition-colors">
                    <ArrowLeft size={14} /> Return_To_Grid
                </Link>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-24 px-6">
                <article className="max-w-4xl mx-auto">
                    <header className="mb-16 text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-purple-500/30 text-purple-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            {post.category}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-tight">{post.title}</h1>
                        <div className="flex items-center justify-center gap-8 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest border-y border-[var(--border)] py-6">
                            <span className="flex items-center gap-2"><User size={14}/> {post.user.name}</span>
                            <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                    </header>

                    {post.image_path && (
                        <div className="mb-16 rounded-[2rem] overflow-hidden border border-[var(--border)] shadow-2xl">
                            <img src={`/storage/${post.image_path}`} alt={post.title} className="w-full h-auto" />
                        </div>
                    )}

                    <div className="prose prose-invert prose-lg max-w-none mx-auto
                        prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:text-[var(--text-main)]
                        prose-p:text-[var(--text-main)] prose-p:leading-relaxed
                        prose-a:text-purple-500 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-purple-400
                        prose-pre:bg-[var(--bg-elevated)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-2xl
                        prose-code:text-purple-400 prose-code:font-bold prose-code:bg-[var(--bg-elevated)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                        prose-li:text-[var(--text-main)] prose-ul:text-[var(--text-main)] prose-ol:text-[var(--text-main)]
                    ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    <footer className="mt-24 pt-12 border-t border-[var(--border)] flex justify-between items-center">
                        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                            End_Of_Transmission
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-purple-500 transition-colors">
                            <Share2 size={14} /> Share_Signal
                        </button>
                    </footer>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="max-w-7xl mx-auto mt-32 border-t border-[var(--border)] pt-24">
                        <div className="text-center mb-16 space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                Related_Data
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Recommended Signals</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <Link href={route('blog.show', relatedPost.slug)} key={relatedPost.id} className="group block h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                                    <div className="aspect-[4/3] bg-[var(--bg-elevated)] relative overflow-hidden">
                                        {relatedPost.image_path ? (
                                            <img src={`/storage/${relatedPost.image_path}`} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors">
                                                <Code2 size={48} className="text-purple-500/20 group-hover:text-purple-500/40 transition-colors" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                                                {relatedPost.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <h3 className="text-lg font-bold uppercase leading-tight group-hover:text-purple-500 transition-colors line-clamp-2">{relatedPost.title}</h3>
                                        <div className="pt-4 flex items-center text-purple-500 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            Read <ArrowRight size={14} className="ml-2" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
