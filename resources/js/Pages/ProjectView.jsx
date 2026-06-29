import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Code2, ExternalLink, Shield, Zap, Lock, ShoppingCart, User, Clock, CheckCircle2, Download, Bookmark, Loader2 } from 'lucide-react';
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
    const lockAd = globalAds?.find(a => a.location === 'in_feed' && a.is_active) || globalAds?.[0];

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

    const isLocked = !canEdit && (project.is_for_sale || project.is_restricted);
    const lockType = project.is_restricted ? 'private' : (project.is_for_sale ? 'paid' : 'none');
    
    // Obfuscate code if locked
    const displayCode = {
        html: isLocked ? (project.code?.html?.substring(0, 50) + '\n\n... [CODE LOCKED] ...\n') : project.code?.html,
        css: isLocked ? (project.code?.css?.substring(0, 50) + '\n\n... [CODE LOCKED] ...\n') : project.code?.css,
        js: isLocked ? (project.code?.js?.substring(0, 50) + '\n\n... [CODE LOCKED] ...\n') : project.code?.js,
    };

    return (
        <PublicLayout>
            <Head title={`${project.title} - View Project`} />
            
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
                                <div className="flex border-b border-white/10 bg-black/40">
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
                                
                                {/* Editor Content */}
                                <div className="relative min-h-[300px] max-h-[500px] overflow-auto p-4">
                                    <pre className={`font-mono text-xs leading-relaxed text-gray-300 ${isLocked ? 'blur-sm select-none' : ''}`}>
                                        <code>{displayCode[activeTab]}</code>
                                    </pre>

                                    {/* Lock Overlay with Ads */}
                                    {isLocked && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-6">
                                            {lockType === 'private' && rewardAdsCompleted < 2 ? (
                                                <div className="bg-black border border-[var(--border)] p-6 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none" />
                                                    <h4 className="text-lg font-black uppercase text-white tracking-widest flex items-center justify-center gap-2">
                                                        <Zap size={18} className="text-cyan-500" /> Unlock Protocol
                                                    </h4>
                                                    <p className="text-xs text-gray-400 font-medium">
                                                        This module is restricted. Complete {2 - rewardAdsCompleted} more sponsor ad{2 - rewardAdsCompleted > 1 ? 's' : ''} to reveal the request access protocol.
                                                    </p>
                                                    
                                                    {isPlayingAd ? (
                                                        <div className="w-full aspect-video bg-[#1a1a1a] rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
                                                            <span className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Sponsor Advertisement</span>
                                                            <div className="text-4xl font-black text-white z-10">{adTimeLeft}s</div>
                                                            <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-1000" style={{ width: `${((5 - adTimeLeft) / 5) * 100}%` }} />
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={playRewardAd}
                                                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                                        >
                                                            Initialize Ad Sequence ({rewardAdsCompleted}/2)
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
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
