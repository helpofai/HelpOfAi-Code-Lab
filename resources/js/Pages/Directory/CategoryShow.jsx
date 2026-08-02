import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { motion } from 'framer-motion';
import { FolderHeart, ChevronRight, Hash, Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import ProjectPreviewContent from '@/Components/ProjectPreviewContent';

export default function CategoryShow({ category, projects }) {
    return (
        <PublicLayout>
            <Head title={`${category} Projects`} />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-[var(--bg-main)] border-b border-[var(--border)]">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-6">
                        <Link href={route('public.categories.index')} className="hover:text-cyan-500 transition-colors">Categories</Link>
                        <ChevronRight size={10} />
                        <span className="text-cyan-500">{category}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                            <Hash size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic leading-none mb-2">
                                {category}
                            </h1>
                            <p className="text-[var(--text-muted)] text-sm md:text-base font-medium">
                                Browse {projects.total} projects in this category
                            </p>
                        </div>
                    </div>
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
                            className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col"
                        >
                            {/* Preview Area */}
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

                            {/* Details */}
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

                {projects.data.length === 0 && (
                    <div className="text-center py-32 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
                        <FolderHeart size={48} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                        <h3 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">No Projects Found</h3>
                        <p className="text-[var(--text-muted)] mt-2 font-medium">There are no projects available in this category yet.</p>
                        <Link href={route('public.categories.index')} className="mt-6 btn-secondary inline-flex items-center gap-2">
                            <ArrowRight size={16} /> Browse Other Categories
                        </Link>
                    </div>
                )}
                
                {/* Pagination (Simple) */}
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
