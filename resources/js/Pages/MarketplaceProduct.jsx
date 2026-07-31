import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ShoppingCart, ShoppingBag, ExternalLink, Github, Zap, Shield, Key, Download, CheckCircle2, User, Clock, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarketplaceProduct({ project, canEdit }) {
    const { auth } = usePage().props;
    const isOwner = project.user_id === auth.user?.id;
    const hasPurchased = canEdit && !isOwner; // Rough approximation for this view
    const [activeTab, setActiveTab] = useState(0);

    return (
        <PublicLayout>
            <Head title={`${project.title} - Marketplace`} />
            
            <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* Header Area */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-emerald-500 font-bold tracking-widest uppercase text-xs">
                                <ShoppingBag size={14} className="fill-current" />
                                <span>Premium Marketplace Product</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">
                                {project.title}
                            </h1>
                            <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed max-w-2xl">
                                {project.meta_description || project.description || 'A premium script available for purchase on the Marketplace.'}
                            </p>
                            
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                                    <Code2 size={16} className="text-cyan-500" /> Technology Stack
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags?.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border)] rounded text-[10px] font-black uppercase tracking-widest">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Demo / Visual Area */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden mt-8">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                            
                            {project.settings?.thumbnail_url ? (
                                <img src={project.settings.thumbnail_url} alt={project.title} className="w-full h-auto max-h-[400px] object-cover rounded-2xl mb-6 shadow-lg border border-[var(--border)]" />
                            ) : (
                                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 mt-6">
                                    <Github size={48} className="text-emerald-500" />
                                </div>
                            )}

                            {project.settings?.gallery_images && project.settings.gallery_images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full px-4">
                                    {project.settings.gallery_images.map((img, i) => (
                                        <img key={i} src={img} alt={`Gallery ${i}`} className="w-full h-24 object-cover rounded-xl border border-[var(--border)] hover:scale-105 transition-transform cursor-pointer shadow-md" />
                                    ))}
                                </div>
                            )}
                            
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-main)] italic">Source Code Repository</h3>
                            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mt-2">
                                This product is linked directly to the vendors' private GitHub repository. 
                                Upon purchase, you will receive an automated download of the latest code.
                            </p>
                            
                            {project.settings?.demo_url && (
                                <a href={project.settings.demo_url} target="_blank" rel="noopener noreferrer" className="mt-6 mb-4 px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-emerald-500 text-[var(--text-main)] font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center gap-2">
                                    <ExternalLink size={16} className="text-emerald-500" /> View Live Demo
                                </a>
                            )}
                        </div>

                        {/* Features / Details */}
                        <div className="space-y-6 mt-8">
                            <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-widest italic border-b border-[var(--border)] pb-4">
                                Product Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><Download size={20} /></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Instant Delivery</h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Download the `.zip` archive immediately after purchase.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500"><Key size={20} /></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">License Key</h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Includes a unique cryptographically signed RSA License Key.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Documentation Tabs */}
                        {project.settings?.markdown_files?.length > 0 && (
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl mt-8">
                                <div className="flex overflow-x-auto border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                                    {project.settings.markdown_files.map((file, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveTab(idx)}
                                            className={`px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                                                activeTab === idx 
                                                    ? 'border-emerald-500 text-emerald-500 bg-[var(--bg-surface)]' 
                                                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]/50'
                                            }`}
                                        >
                                            {file.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-8 prose prose-sm max-w-none dark:prose-invert prose-headings:font-black prose-a:text-cyan-500 hover:prose-a:text-cyan-400">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {project.settings.markdown_files[activeTab]?.content || 'No content.'}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar / Checkout Card */}
                    <div className="space-y-8">
                        <div className="bg-[var(--bg-surface)] border border-emerald-500/30 rounded-3xl p-8 space-y-8 shadow-xl sticky top-32">
                            
                            <div className="flex items-center gap-4 border-b border-[var(--border)] pb-6">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 text-emerald-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Vendors</p>
                                    <p className="text-sm font-bold text-[var(--text-main)]">@{project.user?.name}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-center">
                                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Purchase Price</h4>
                                <div className="text-5xl font-black text-[var(--text-main)] tracking-tighter">
                                    ${project.price}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {isOwner ? (
                                    <div className="w-full flex items-center justify-center gap-3 py-5 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] font-black uppercase text-xs tracking-widest rounded-xl">
                                        This is your product
                                    </div>
                                ) : hasPurchased ? (
                                    <Link 
                                        href={route('my-account')}
                                        className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                    >
                                        <Download size={18} /> Access Downloads
                                    </Link>
                                ) : (
                                    <Link 
                                        href={route('checkout.project', project.slug)}
                                        className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                                    >
                                        <ShoppingCart size={18} /> Buy Now
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                                {[
                                    'Full Source Code Download',
                                    'RSA Digital License Key',
                                    'Direct from Vendors Repo',
                                    'Secure Stripe / Razorpay'
                                ].map((perk, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[10px] uppercase font-bold text-[var(--text-muted)]">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        {perk}
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}

