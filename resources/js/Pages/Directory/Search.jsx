import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Eye, ShoppingBag, FolderHeart, ArrowRight } from 'lucide-react';
import ProjectPreviewContent from '@/Components/ProjectPreviewContent';

export default function Search({ projects, filters }) {
    const [query, setQuery] = useState(filters.q || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('public.search'), { q: query }, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title={`Search Results for "${filters.q || ''}"`} />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-[var(--bg-main)] border-b border-[var(--border)]">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-[var(--text-main)] uppercase tracking-tighter italic mb-8 leading-none"
                    >
                        Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Projects</span>
                    </motion.h1>
                    
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSearch}
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <SearchIcon className="text-[var(--text-muted)]" size={24} />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search source code, templates, scripts..."
                            className="w-full bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-full py-6 pl-16 pr-8 text-lg font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-xl"
                        />
                        <button
                            type="submit"
                            className="absolute inset-y-2 right-2 bg-cyan-500 text-black dark:text-white px-8 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-cyan-400 transition-colors shadow-lg"
                        >
                            Search
                        </button>
                    </motion.form>

                    {filters.q && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px]"
                        >
                            Found {projects.total} results for "{filters.q}"
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.data.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col"
                        >
                            <div className="aspect-video relative bg-[#0a0a0a] border-b border-[var(--border)] overflow-hidden">
                                {project.is_restricted ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                        <ShoppingBag className="text-amber-500 mb-2 opacity-50" size={24} />
                                        <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">Premium Resource</p>
                                    </div>
                                ) : (
                                    <ProjectPreviewContent project={project} />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <Link href={route('project.show', project.slug)} className="btn-primary scale-90 group-hover:scale-100 transition-all flex items-center gap-2">
                                        <Eye size={16} /> View Details
                                    </Link>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-[var(--text-main)] leading-tight mb-2 line-clamp-2 group-hover:text-cyan-500 transition-colors">
                                    {project.title}
                                </h3>
                                
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--border)]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[10px] font-bold text-[var(--text-main)] border border-[var(--border)] uppercase">
                                            {project.user?.name?.substring(0, 2)}
                                        </div>
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider truncate max-w-[100px]">
                                            {project.user?.name}
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)]">
                                        {project.is_for_sale ? `$${project.price}` : 'Free'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {projects.data.length === 0 && filters.q && (
                    <div className="text-center py-32 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
                        <SearchIcon size={48} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                        <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">No Results Found</h3>
                        <p className="text-[var(--text-muted)] mt-2 font-medium">We couldn't find anything matching "{filters.q}". Try different keywords.</p>
                        <Link href={route('public.search')} className="mt-6 btn-secondary inline-flex items-center gap-2">
                            <SearchIcon size={16} /> Clear Search
                        </Link>
                    </div>
                )}
                
                {projects.data.length === 0 && !filters.q && (
                    <div className="text-center py-32 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
                        <SearchIcon size={48} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                        <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">Start Searching</h3>
                        <p className="text-[var(--text-muted)] mt-2 font-medium">Enter a keyword above to find projects.</p>
                    </div>
                )}
                
                {projects.last_page > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {projects.links.map((link, k) => (
                            <Link
                                key={k}
                                href={link.url || '#'}
                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${
                                    link.active 
                                    ? 'bg-cyan-500 text-black dark:text-white border-transparent' 
                                    : 'bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-cyan-500'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
