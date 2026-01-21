import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    LayoutDashboard, 
    Code2, 
    LogOut, 
    ChevronLeft, 
    ChevronRight,
    Menu,
    X,
    Database,
    Shield,
    Activity,
    Globe,
    Users,
    Terminal
} from 'lucide-react';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: route('dashboard'), active: route().current('dashboard') },
        { name: 'Explore', icon: Globe, href: route('explore'), active: route().current('explore') },
        { name: 'Editor', icon: Code2, href: route('editor'), active: route().current('editor') },
        { name: 'My Projects', icon: Database, href: route('my-projects'), active: route().current('my-projects') },
    ];

    const adminItems = [
        { name: 'Admin Command', icon: Shield, href: route('admin.dashboard'), active: route().current('admin.dashboard') },
        { name: 'User Matrix', icon: Users, href: route('admin.users'), active: route().current('admin.users') },
        { name: 'Front Management', icon: LayoutDashboard, href: route('admin.front-management'), active: route().current('admin.front-management') },
        { name: 'System Update', icon: Terminal, href: route('admin.update'), active: route().current('admin.update') },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans flex overflow-hidden">
            {/* Desktop Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? '260px' : '80px' }}
                className="hidden lg:flex flex-col bg-[#0a0a0a] border-r border-white/5 sticky top-0 h-screen z-50 shrink-0"
            >
                <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
                            <Code2 className="text-cyan-400" size={20} />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold tracking-tight text-white uppercase italic">HOACodeLab</span>
                        )}
                    </Link>
                </div>

                <div className="flex-1 py-6 overflow-y-auto">
                    <div className="px-4 mb-8">
                        {isSidebarOpen && <div className="px-4 mb-4 text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">Personal</div>}
                        <nav className="space-y-1">
                            {userItems.map((item) => (
                                <Link 
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-3 rounded transition-all ${item.active ? 'bg-cyan-500 text-black font-bold' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    <item.icon size={18} />
                                    {isSidebarOpen && <span className="text-[10px] uppercase tracking-widest">{item.name}</span>}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {user?.role === 'admin' && (
                        <div className="px-4 mb-8">
                            <div className="h-px bg-white/5 mx-4 mb-6" />
                            {isSidebarOpen && <div className="px-4 mb-4 text-[9px] font-bold text-rose-500/40 uppercase tracking-[0.3em]">Command</div>}
                            <nav className="space-y-1">
                                {adminItems.map((item) => (
                                    <Link 
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-4 p-3 rounded transition-all ${item.active ? 'bg-rose-500 text-white font-bold' : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/5'}`}
                                    >
                                        <item.icon size={18} />
                                        {isSidebarOpen && <span className="text-[10px] uppercase tracking-widest">{item.name}</span>}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/5 shrink-0 space-y-4">
                    {isSidebarOpen && (
                        <div className="px-2">
                            <ThemeSwitcher />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex-1 flex justify-center p-2 hover:bg-white/5 rounded transition-colors text-slate-500 hover:text-white border border-white/5">
                            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                        {user && (
                            <Link href={route('logout')} method="post" as="button" className="p-2 text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/5 rounded border border-white/5 transition-all">
                                <LogOut size={16} />
                            </Link>
                        )}
                    </div>
                </div>
            </motion.aside>

            <div className="flex-1 flex flex-col min-w-0 relative h-screen">
                {header && (
                    <header className="hidden lg:block h-20 border-b border-white/5 bg-[#050505] sticky top-0 z-30 px-10 shrink-0">
                        <div className="h-full flex items-center">{header}</div>
                    </header>
                )}

                <header className="lg:hidden h-16 bg-[#0a0a0a] border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <Link href="/" className="flex items-center gap-3">
                        <Code2 className="text-cyan-400" size={20} />
                        <span className="font-bold text-white text-sm uppercase italic">HOACodeLab</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400"><Menu size={20} /></button>
                </header>

                <main className="flex-1 overflow-y-auto relative">
                    {children}
                </main>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/90 z-[60] lg:hidden" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-72 bg-[#0a0a0a] border-l border-white/10 z-[70] p-8 flex flex-col lg:hidden shadow-2xl">
                            <div className="flex justify-between items-center mb-12">
                                <div className="flex items-center gap-3">
                                    <Code2 className="text-cyan-400" size={24} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-white">System</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {userItems.map((item) => (
                                    <Link key={item.name} href={item.href} className={`flex items-center gap-4 p-4 rounded ${item.active ? 'bg-cyan-500 text-black font-bold' : 'text-slate-500'}`}>
                                        <item.icon size={18} />
                                        <span className="uppercase tracking-widest text-[10px]">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                            <Link href={route('logout')} method="post" as="button" className="flex items-center gap-4 p-4 text-rose-500 font-bold uppercase tracking-widest mt-auto border border-rose-500/20 rounded">
                                <LogOut size={18} /> <span className="text-[10px]">Logout</span>
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}