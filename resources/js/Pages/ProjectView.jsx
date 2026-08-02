/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Code2, ExternalLink, Shield, Zap, Lock, ShoppingCart, User, Clock, CheckCircle2, Download, Bookmark, Loader2, Copy, Star } from 'lucide-react';
import AdUnit from '@/Components/AdUnit';
import axios from 'axios';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function ProjectView({ project, canEdit }) {
    const { globalAds } = usePage().props;
    const { auth } = usePage().props;
    const [compiled, setCompiled] = useState({ css: '', js: '' });
    const [isCompiling, setIsCompiling] = useState(true);
    const [activeTab, setActiveTab] = useState('html');
    const [isRequesting, setIsRequesting] = useState(false);
    const [accessRequestStatus, setAccessRequestStatus] = useState(project.access_request_status || null);
    
    // Reward Ads State
    const [rewardAdsCompleted, setRewardAdsCompleted] = useState(0);
    const [isPlayingAd, setIsPlayingAd] = useState(false);
    const [adTimeLeft, setAdTimeLeft] = useState(0);

    const toast = useToast();

    // Get an ad for the locked content block
    // globalAds is grouped by location so it's an object, not an array.
    const lockAd = globalAds?.adsLock?.[0] || globalAds?.video_reward?.[0] || globalAds?.in_feed?.[0] || Object.values(globalAds || {})[0]?.[0];

    useEffect(() => {
        const compile = async () => {
            let cCss = project.code?.css || '';
            let cJs = project.code?.js || '';
            const preps = project.settings?.preprocessors || { css: 'css', js: 'js' };

            try {
                if ((preps.css === 'scss' || preps.css === 'sass') && window.Sass) {
                    window.Sass.compile(cCss, (result) => {
                        setCompiled(prev => ({ ...prev, css: result.text || cCss }));
                    });
                } else {
                    setCompiled(prev => ({ ...prev, css: cCss }));
                }

                if ((preps.js === 'babel' || preps.js === 'typescript') && window.Babel) {
                    const result = window.Babel.transform(cJs, { presets: ['env', 'react', 'typescript'] }).code;
                    setCompiled(prev => ({ ...prev, js: result }));
                } else {
                    setCompiled(prev => ({ ...prev, js: cJs }));
                }
            } catch (e) {
                console.error("Preview_Sync_Error");
            } finally {
                setIsCompiling(false);
            }
        };
        compile();
    }, [project]);

    useEffect(() => {
        let timer;
        if (isPlayingAd && adTimeLeft > 0) {
            timer = setTimeout(() => {
                setAdTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isPlayingAd && adTimeLeft === 0) {
            setIsPlayingAd(false);
            setRewardAdsCompleted(prev => prev + 1);
        }
        return () => clearTimeout(timer);
    }, [isPlayingAd, adTimeLeft]);

    const playRewardAd = () => {
        setIsPlayingAd(true);
        setAdTimeLeft(5); // 5 seconds ad duration
    };

    const libs = (project.settings?.externalLibraries || []).map(lib => lib.endsWith('.css') ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"></script>`).join('\n');
    const srcDoc = `<!DOCTYPE html><html><head><style>body { margin: 0; overflow: hidden; background: white; font-family: sans-serif; } ${compiled.css}</style>${libs}</head><body>${project.code?.html || ''}<script>${compiled.js}</script></body></html>`;

    const handleDownload = () => {
        const content = `
<!-- HOACodeLab Export: ${project.title} -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    ${libs}
    <style>
        ${compiled.css}
    </style>
</head>
<body>
    ${project.code?.html || ''}
    
    <script>
        ${compiled.js}
    </script>
</body>
</html>`;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.slug}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopyCode = () => {
        if (!isLocked && displayCode[activeTab]) {
            navigator.clipboard.writeText(displayCode[activeTab]);
            toast.success('Code copied to clipboard!');
        }
    };

    const handleRequestAccess = async () => {
        setIsRequesting(true);
        try {
            const res = await axios.post(`/api/projects/${project.id}/request-access`);
            setAccessRequestStatus(res.data.status);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('Failed to request access.');
        } finally {
            setIsRequesting(false);
        }
    };

    const isOwner = project ? project.user_id === auth.user?.id : true;
    const isHighLevelUser = auth?.user && (auth.user.identity_status === 'verified' || auth.user.level > 4);
    const isPublicAdLocked = !canEdit && project.is_public && !project.is_for_sale && !isHighLevelUser && rewardAdsCompleted < 1;

    const isLocked = !canEdit && (project.is_for_sale || project.is_restricted || isPublicAdLocked);
    const lockType = project.is_restricted ? 'private' : (project.is_for_sale ? 'paid' : (isPublicAdLocked ? 'public_ad' : 'none'));
    
    // Obfuscate code if locked
    const displayCode = {
        html: isLocked ? (project.code?.html?.substring(0, 50) + '\n\n... [CODE LOCKED] ...\n') : project.code?.html,
        css: isLocked ? (project.code?.css?.substring(0, 50) + '\n\n... [CODE LOCKED] ...\n') : project.code?.css,
        js: isLocked ? (project.code?.js?.substring(0, 50) + '\n\n... [CODE LOCKED] ...\n') : project.code?.js,
    };

    return (
        <PublicLayout>
            <Head>
                <title>{`${project.title} - View Project`}</title>
                <meta name="description" content={project.description || `Buy ${project.title} on our marketplace.`} />
                <meta property="og:title" content={project.title} />
                <meta property="og:description" content={project.description || `Premium source code for ${project.title}.`} />
                <meta property="og:image" content={project.og_image_url || ''} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": project.title,
                        "description": project.description,
                        "applicationCategory": "DeveloperApplication",
                        "offers": {
                            "@type": "Offer",
                            "price": project.price,
                            "priceCurrency": "USD"
                        },
                        "author": {
                            "@type": "Person",
                            "name": project.user?.name || 'Vendor'
                        },
                        ...(project.reviews_count > 0 ? {
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": project.average_rating,
                                "reviewCount": project.reviews_count
                            }
                        } : {})
                    })}
                </script>
            </Head>
            
            <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Header Title */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-cyan-500 font-bold tracking-widest uppercase text-xs">
                                <Zap size={14} className="fill-current" />
                                <span>{project.is_restricted ? 'Private Module' : (project.is_for_sale ? 'Premium Module' : 'Open Source Component')}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">
                                {project.title}
                            </h1>
                            <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed max-w-2xl">
                                {project.description || 'No description provided for this module.'}
                            </p>
                            <div className="flex items-center gap-6 text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest mt-4">
                                <span className="flex items-center gap-2">
                                    <User size={12} className="text-cyan-500" />
                                    By @{project.user?.name || 'Unknown'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock size={12} className="text-cyan-500" />
                                    {new Date(project.created_at).toLocaleDateString()}
                                </span>
                                {project.version && (
                                    <span className="flex items-center gap-2 px-2 py-0.5 bg-cyan-500/10 text-cyan-500 rounded font-bold">
                                        v{project.version}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Interactive Preview Container */}
                        <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-[var(--border)] shadow-2xl bg-white group">
                            {!isCompiling ? (
                                <iframe 
                                    srcDoc={srcDoc} 
                                    className="w-full h-full border-none"
                                    sandbox="allow-scripts" 
                                    title={`preview-${project.id}`} 
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
                                    <span className="text-sm font-black uppercase text-slate-400 tracking-widest">Building_Preview...</span>
                                </div>
                            )}
                            
                            {/* Overlay UI elements */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-white">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Live Demo</span>
                            </div>
                        </div>
                        
                        {/* Source Code View Area */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                                <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-widest flex items-center gap-2">
                                    <Code2 size={16} className="text-cyan-500" /> Source Code
                                </h3>
                                
                                {canEdit && (
                                    <div className="flex gap-2">
                                        <button onClick={handleDownload} className="btn-secondary text-[10px] py-1.5 px-3 flex items-center gap-2">
                                            <Download size={12} /> Export HTML
                                        </button>
                                        <Link href={route('editor', project.slug)} className="btn-primary text-[10px] py-1.5 px-3 flex items-center gap-2">
                                            <Bookmark size={12} /> Edit / Fork
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/10 relative">
                                {/* Tabs */}
                                <div className="flex items-center justify-between border-b border-white/10 bg-black/40">
                                    <div className="flex">
                                        {['html', 'css', 'js'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === tab ? 'text-cyan-500 border-b-2 border-cyan-500 bg-white/5' : 'text-white/50 hover:text-white/80'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {!isLocked && (
                                        <button 
                                            onClick={handleCopyCode} 
                                            className="mr-4 text-white/50 hover:text-white transition-colors p-2 rounded-lg bg-white/5 hover:bg-white/10"
                                            title="Copy Code"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    )}
                                </div>
                                
                                {/* Editor Content */}
                                <div className="relative min-h-[300px] max-h-[500px] overflow-auto p-4">
                                    <pre className={`font-mono text-xs leading-relaxed text-gray-300 ${isLocked ? 'blur-sm select-none' : ''}`}>
                                        <code>{displayCode[activeTab]}</code>
                                    </pre>

                                    {/* Lock Overlay with Ads */}
                                    {isLocked && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-6">
                                            {(lockType === 'private' && rewardAdsCompleted < 2) || lockType === 'public_ad' ? (
                                                <div className="bg-black border border-[var(--border)] p-6 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none" />
                                                    <h4 className="text-lg font-black uppercase text-white tracking-widest flex items-center justify-center gap-2">
                                                        <Zap size={18} className="text-cyan-500" /> Unlock Protocol
                                                    </h4>
                                                    <p className="text-xs text-gray-400 font-medium">
                                                        {lockType === 'private'
                                                            ? `This module is restricted. Complete ${2 - rewardAdsCompleted} more sponsor ad${2 - rewardAdsCompleted > 1 ? 's' : ''} to reveal the request access protocol.`
                                                            : 'This is a public module. Complete 1 sponsor ad to view the code.'}
                                                    </p>
                                                    
                                                    {isPlayingAd ? (
                                                        <div className="w-full relative bg-[#1a1a1a] rounded-xl border border-white/10 flex flex-col items-center justify-center overflow-hidden min-h-[150px]">
                                                            {lockAd ? (
                                                                <div className="w-full max-h-[250px] overflow-hidden flex items-center justify-center">
                                                                    <AdUnit ad={lockAd} />
                                                                </div>
                                                            ) : (
                                                                <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
                                                            )}
                                                            
                                                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-white text-xs font-bold z-20 border border-white/10 shadow-lg">
                                                                {adTimeLeft}s
                                                            </div>
                                                            
                                                            {!lockAd && (
                                                                <>
                                                                    <span className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Sponsor Advertisement</span>
                                                                    <div className="text-4xl font-black text-white z-10">{adTimeLeft}s</div>
                                                                </>
                                                            )}
                                                            <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-1000 z-20" style={{ width: `${((5 - adTimeLeft) / 5) * 100}%` }} />
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={playRewardAd}
                                                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                                        >
                                                            {lockType === 'private'
                                                                ? `Initialize Ad Sequence (${rewardAdsCompleted}/2)`
                                                                : 'Watch Ad to Unlock Code'}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
                                                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
                                                        <Lock size={24} className="text-rose-500" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-lg font-black uppercase text-[var(--text-main)] italic tracking-tighter">
                                                            {lockType === 'private' ? 'Access Restricted' : 'Code Locked'}
                                                        </h4>
                                                        <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                                                            {lockType === 'private' 
                                                                ? 'This is a private module. The creator has restricted code access.' 
                                                                : 'Purchase this premium module to unlock the full source code, export options, and commercial usage rights.'}
                                                        </p>
                                                        {lockType === 'private' && (
                                                            <div className="pt-2">
                                                                {!auth?.user ? (
                                                                    <Link href={route('login')} className="w-full py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase inline-block text-center hover:bg-rose-600 transition-colors">Login to Request Access</Link>
                                                                ) : !accessRequestStatus ? (
                                                                    <button onClick={handleRequestAccess} disabled={isRequesting} className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                                                        {isRequesting ? <Loader2 size={14} className="animate-spin" /> : null}
                                                                        {isRequesting ? 'Requesting...' : 'Request Code Access'}
                                                                    </button>
                                                                ) : accessRequestStatus === 'pending' ? (
                                                                    <div className="w-full py-2 border border-rose-500/30 text-rose-500 rounded-lg text-[10px] font-black uppercase bg-rose-500/10">
                                                                        Access Request Pending
                                                                    </div>
                                                                ) : accessRequestStatus === 'rejected' ? (
                                                                    <div className="w-full py-2 bg-black text-rose-500 border border-rose-500/30 rounded-lg text-[10px] font-black uppercase">
                                                                        Access Rejected by Author
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {lockType === 'paid' && (
                                                        <Link 
                                                            href={route('checkout.project', project.slug)}
                                                            className="w-full flex items-center justify-center gap-3 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                                        >
                                                            <ShoppingCart size={16} /> Unlock Now for ${project.price}
                                                        </Link>
                                                    )}
                                                    
                                                    {/* Ad Block inside lock screen */}
                                                    {lockAd && (
                                                        <div className="pt-4 border-t border-[var(--border)] mt-4 opacity-80 scale-90 origin-top">
                                                            <AdUnit ad={lockAd} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="pt-12 border-t border-[var(--border)] mt-12">
                            <h3 className="text-xl font-black uppercase text-[var(--text-main)] tracking-widest flex items-center gap-3 mb-8">
                                <Star size={24} className="text-amber-500 fill-amber-500" /> 
                                Verified Reviews 
                                <span className="text-sm font-medium text-amber-500 ml-2">
                                    {project.average_rating > 0 ? `${project.average_rating} / 5.0` : 'No reviews yet'}
                                </span>
                            </h3>

                            {project.has_purchased && (
                                <div className="mb-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                                    <h4 className="text-sm font-black uppercase text-[var(--text-main)] tracking-widest mb-4">Write a Review</h4>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const rating = e.target.rating.value;
                                        const comment = e.target.comment.value;
                                        axios.post(route('reviews.store', project.slug), { rating, comment })
                                            .then(res => {
                                                toast.success('Review submitted successfully!');
                                                window.location.reload();
                                            })
                                            .catch(err => {
                                                toast.error(err.response?.data?.message || 'Failed to submit review');
                                            });
                                    }}>
                                        <div className="mb-4">
                                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Rating</label>
                                            <select name="rating" className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-cyan-500" required>
                                                <option value="5">5 Stars - Excellent</option>
                                                <option value="4">4 Stars - Good</option>
                                                <option value="3">3 Stars - Average</option>
                                                <option value="2">2 Stars - Poor</option>
                                                <option value="1">1 Star - Terrible</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Comment (Optional)</label>
                                            <textarea name="comment" rows="3" className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-cyan-500 placeholder:text-[var(--text-muted)]" placeholder="What did you like about this project?"></textarea>
                                        </div>
                                        <button type="submit" className="px-6 py-2 bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-cyan-400 transition-colors">
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            )}

                            {project.reviews?.length > 0 ? (
                                <div className="space-y-6">
                                    {project.reviews.map(review => (
                                        <div key={review.id} className="p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold uppercase text-xs border border-cyan-500/20">
                                                        {review.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-[var(--text-main)]">
                                                            {review.user?.name || 'Anonymous'}
                                                        </div>
                                                        <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={i < review.rating ? "fill-amber-500" : "opacity-30"} />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
                                                    "{review.comment}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl border-dashed">
                                    <p className="text-sm text-[var(--text-muted)]">Be the first to review this project.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Call to Action */}
                    <div className="space-y-8">
                        {/* Action Card */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-8 shadow-xl sticky top-32">
                            <div className="space-y-2 text-center border-b border-[var(--border)] pb-8">
                                <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
                                    {project.is_restricted ? 'Access_Level' : 'Acquisition_Cost'}
                                </h4>
                                <div className="text-5xl font-black text-cyan-500 font-mono tracking-tighter">
                                    {project.is_restricted ? 'PRIVATE' : (project.is_for_sale ? `$${project.price}` : 'FREE')}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {canEdit ? (
                                    <Link 
                                        href={route('editor', project.slug)}
                                        className="w-full flex items-center justify-center gap-3 py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                                    >
                                        <Code2 size={18} /> Open in Editor
                                    </Link>
                                ) : project.is_restricted ? (
                                    <div className="w-full flex items-center justify-center gap-3 py-5 bg-[var(--bg-main)] text-rose-500 border border-rose-500/20 font-black uppercase text-xs tracking-widest rounded-xl opacity-80 cursor-not-allowed">
                                        <Lock size={18} /> Code Restricted
                                    </div>
                                ) : project.is_for_sale ? (
                                    <Link 
                                        href={route('checkout.project', project.slug)}
                                        className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                                    >
                                        <ShoppingCart size={18} /> Purchase Module
                                    </Link>
                                ) : (
                                    <Link 
                                        href={route('editor', project.slug)}
                                        className="w-full flex items-center justify-center gap-3 py-5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border)] font-black uppercase text-xs tracking-widest rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
                                    >
                                        <Code2 size={18} /> View Source
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-3 pt-4">
                                {[
                                    'Instant access to source code',
                                    project.is_for_sale ? 'Commercial usage rights' : 'Personal usage rights',
                                    'Cloud sync enabled'
                                ].map((perk, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[10px] uppercase font-bold text-[var(--text-muted)]">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        {perk}
                                    </div>
                                ))}
                            </div>
                            
                            {project.is_for_sale && !canEdit && (
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3 mt-4">
                                    <Shield size={16} className="text-emerald-500 mt-1 shrink-0" />
                                    <p className="text-[10px] font-bold text-emerald-500/80 leading-relaxed uppercase tracking-wider">
                                        Secure Neural Gateway processing. Payments are protected and encrypted.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* GitHub Commits Card */}
                        {project.settings?.github_commits?.length > 0 && (
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-6 shadow-xl">
                                <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Code2 size={14} /> Version History
                                </h4>
                                <div className="space-y-4">
                                    {project.settings.github_commits.map((commit, idx) => (
                                        <div key={idx} className="border-l-2 border-emerald-500/30 pl-4 py-1">
                                            <div className="text-xs text-[var(--text-main)] font-bold mb-1">
                                                {commit.message.split('\n')[0]}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest">
                                                <span className="text-emerald-500">#{commit.sha}</span>
                                                <span>•</span>
                                                <span>{new Date(commit.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
