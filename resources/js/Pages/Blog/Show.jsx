import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';

export default function BlogShow({ post }) {
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
                        prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
                        prose-p:text-[var(--text-main)] prose-p:leading-relaxed
                        prose-a:text-purple-500 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-purple-400
                        prose-pre:bg-[var(--bg-elevated)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-2xl
                    ">
                        {/* We use whitespace-pre-wrap for basic formatting if it's plain text, 
                            or a markdown parser could be used here. For now, assuming raw text/html safely. */}
                        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
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
            </main>
        </div>
    );
}
