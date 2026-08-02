import { Link, usePage, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code2, Globe, ArrowRight, Zap, 
    Menu, X, Shield, User,
    Github, Share2, Sparkles, Activity
} from 'lucide-react';
import { useToast } from '@/Components/Toast/ToastProvider';
import NoInternetOverlay from '@/Components/NoInternetOverlay';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';
import ProBackground from '@/Components/Visuals/ProBackground';
import NotificationDropdown from '@/Components/Visuals/NotificationDropdown';
import AdUnit from '@/Components/AdUnit';

export default function PublicLayout({ children }) {
    const { auth, siteSettings, globalAds } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const toast = useToast();

    const { data, setData, post, processing, reset, errors } = useForm({
        email: '',
    });

    const submitNewsletter = (e) => {
        e.preventDefault();
        post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Successfully subscribed to the newsletter!');
                reset('email');
            },
            onError: (errs) => {
                if (errs.email) {
                    toast.error(errs.email);
                } else {
                    toast.error('Failed to subscribe. Please try again.');
                }
            }
        });
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getSetting = (key, defaultVal) => siteSettings?.[key] || defaultVal;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-300">
            <ProBackground />

            {/* Global Progress Bar */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-[3px] bg-rainbow-gradient z-[200] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1 }}
            />

            <nav className={`fixed top-0 w-full h-20 border-b transition-all duration-500 z-[100] px-6 md:px-12 ${
                scrolled 
                ? 'bg-[var(--bg-main)]/90 backdrop-blur-2xl border-[var(--border)]' 
                : 'bg-transparent border-transparent'
            }`}>
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-2 bg-cyan-500 text-white dark:bg-white dark:text-black rounded shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                                <Code2 size={20} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-[var(--text-main)] uppercase italic hidden xs:block">HOACodeLab</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-l border-[var(--border)] pl-6 h-6">
                            <a href="/#features" className="hover:text-cyan-500 transition-colors">Features</a>
                            <Link href={route('explore')} className="hover:text-cyan-500 transition-colors">Explore</Link>
                            <Link href={route('public.search')} className="hover:text-cyan-500 transition-colors">Search</Link>
                            <Link href={route('public.categories.index')} className="hover:text-cyan-500 transition-colors">Categories</Link>
                            <Link href={route('public.tags.index')} className="hover:text-cyan-500 transition-colors hidden lg:block">Tags</Link>
                            <Link href={route('blog.index')} className="hover:text-cyan-500 transition-colors hidden md:block">Blog</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="hidden md:block"><ThemeSwitcher /></div>
                        {auth.user ? (
                            <div className="flex items-center gap-3 md:gap-4">
                                <NotificationDropdown />
                                <Link href={route('dashboard')} className="px-5 md:px-6 py-2 border border-[var(--border)] rounded font-black text-[10px] uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all italic whitespace-nowrap">Dashboard</Link>
                            </div>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors whitespace-nowrap">Login</Link>
                                <Link href={route('register')} className="px-5 md:px-8 py-2.5 bg-cyan-500 text-black rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg shadow-cyan-500/10 whitespace-nowrap">Get Started</Link>
                            </>
                        )}
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-[var(--text-muted)]">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Top Banner Ad */}
            {globalAds?.top_banner && (
                <div className="pt-24 max-w-7xl mx-auto px-6 relative z-10">
                    {globalAds.top_banner.map(ad => <AdUnit key={ad.id} ad={ad} />)}
                </div>
            )}

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-72 bg-[var(--bg-surface)] border-l border-[var(--border)] z-[120] p-8 flex flex-col shadow-2xl">
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-xs font-black uppercase tracking-widest text-cyan-500 italic">Navigation_Link</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-muted)] hover:text-white"><X size={20} /></button>
                            </div>
                            <nav className="flex-1 space-y-6">
                                {[
                                    { name: 'Home', href: '/' },
                                    { name: 'Explore', href: route('explore') },
                                    { name: 'Search', href: route('public.search') },
                                    { name: 'Categories', href: route('public.categories.index') },
                                    { name: 'Tags', href: route('public.tags.index') },
                                    { name: 'Features', href: '/#features' },
                                    { name: 'Blog', href: route('blog.index') },
                                    { name: 'About', href: '/p/about' },
                                ].map((item) => (
                                    <Link 
                                        key={item.name} 
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-lg font-black uppercase italic tracking-tighter hover:text-cyan-500 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="pt-8 border-t border-[var(--border)] space-y-4">
                                <ThemeSwitcher />
                                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">HOACodeLab</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="relative z-10 min-h-[calc(100vh-400px)]">
                {children}
            </main>

            {/* Footer Ad */}
            {globalAds?.footer && (
                <div className="max-w-7xl mx-auto px-6 py-6 relative z-10 border-t border-[var(--border)]">
                    {globalAds.footer.map(ad => <AdUnit key={ad.id} ad={ad} />)}
                </div>
            )}

            <footer className="py-24 bg-[var(--bg-main)] border-t border-[var(--border)] px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                        <div className="lg:col-span-4 space-y-8 text-left">
                            <Link href="/" className="flex items-center gap-4">
                                {siteSettings?.site_logo ? (
                                    <img src={siteSettings.site_logo} alt="Logo" className="h-10 w-auto object-contain" />
                                ) : (
                                    <div className="p-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded"><Code2 size={24} /></div>
                                )}
                                <span className="text-2xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">{siteSettings?.site_name || 'HOACodeLab'}</span>
                            </Link>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest max-w-xs leading-loose italic">Secure. Scalable. Optimized development substrate for modern web creators.</p>
                            <div className="flex gap-4">
                                {[Github, Share2, Globe].map((Icon, i) => (<a key={i} href="#" className="p-3 border border-[var(--border)] rounded-full text-[var(--text-muted)] hover:text-cyan-500 transition-all"><Icon size={16} /></a>))}
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-8 text-left">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Platform</h4>
                            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                <li><a href="/#features" className="hover:text-[var(--text-main)] transition-colors">Features</a></li>
                                <li><a href="/#pricing" className="hover:text-[var(--text-main)] transition-colors">Pricing</a></li>
                                <li><Link href={route('public.categories.index')} className="hover:text-[var(--text-main)] transition-colors">Categories</Link></li>
                                <li><Link href={route('public.tags.index')} className="hover:text-[var(--text-main)] transition-colors">Tags</Link></li>
                                <li><Link href={route('blog.index')} className="hover:text-[var(--text-main)] transition-colors">Blog</Link></li>
                            </ul>
                        </div>
                        <div className="lg:col-span-2 space-y-8 text-left">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Legal</h4>
                            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                <li><Link href="/p/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/p/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                <li><Link href="/p/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div className="lg:col-span-4 space-y-8 text-left">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic">Newsletter</h4>
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Subscribe for system patches.</p>
                            <form className="flex flex-col gap-2 relative" onSubmit={submitNewsletter}>
                                <div className="flex gap-2">
                                    <input 
                                        type="email" 
                                        placeholder="USER@NET.LINK" 
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-cyan-500" 
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-[10px] tracking-widest rounded hover:bg-cyan-500 hover:text-white transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        {processing ? '...' : 'Join'}
                                    </button>
                                </div>
                                {errors.email && <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">{errors.email}</div>}
                            </form>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">
                        <span>© 2026 {siteSettings?.site_name || 'HOACodeLab'} // All Rights Reserved</span>
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span>Systems Operational</span>
                        </div>
                    </div>
                </div>
            </footer>
            <NoInternetOverlay />
        </div>
    );
}
