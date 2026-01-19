import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    LayoutDashboard, 
    Code2, 
    User, 
    Settings, 
    LogOut, 
    ChevronLeft, 
    ChevronRight,
    Menu,
    X,
    Database,
    Shield,
    Activity,
    Cpu,
    Globe,
    Lock,
    Users,
    Key,
    Server,
    Boxes,
    Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        { name: 'System Logs', icon: Terminal, href: '#', active: false },
        { name: 'Security', icon: Key, href: '#', active: false },
    ];

    const systemStats = [
        { label: 'CPU', val: '12%', icon: Cpu },
        { label: 'NET', val: '1ms', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-mono flex">
            {/* Desktop Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '80px' }}
                className="hidden lg:flex flex-col bg-black/40 backdrop-blur-3xl border-r border-white/5 sticky top-0 h-screen z-50 overflow-hidden"
            >
                {/* Sidebar Header */}
                <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0 justify-between">
                    <Link href="/" className="flex items-center space-x-3 overflow-hidden">
                        <div className="p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                            <Code2 className="text-cyan-400" size={20} />
                        </div>
                        {isSidebarOpen && (
                            <motion.span 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="font-black tracking-tighter text-white whitespace-nowrap uppercase italic"
                            >
                                HOACodeLab
                            </motion.span>
                        )}
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
                    {/* User Section */}
                    <div className="px-4 mb-8">
                        {isSidebarOpen && (
                            <div className="px-4 mb-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Personal_Uplink</div>
                        )}
                        <nav className="space-y-1">
                            {userItems.map((item) => (
                                <Link 
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-4 p-3 rounded-xl transition-all group ${
                                        item.active 
                                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <item.icon size={18} className={item.active ? 'text-cyan-400' : 'group-hover:text-cyan-400'} />
                                    {isSidebarOpen && (
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Admin Section (Only if admin) */}
                    {user?.role === 'admin' && (
                        <div className="px-4 mb-8">
                            <div className="h-px bg-white/5 mx-4 mb-6" />
                            {isSidebarOpen && (
                                <div className="px-4 mb-4 text-[9px] font-black text-rose-500/40 uppercase tracking-[0.4em]">Command_Control</div>
                            )}
                            <nav className="space-y-1">
                                {adminItems.map((item) => (
                                    <Link 
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-4 p-3 rounded-xl transition-all group ${
                                            item.active 
                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                                : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/5'
                                        }`}
                                    >
                                        <item.icon size={18} className={item.active ? 'text-rose-400' : 'group-hover:text-rose-400'} />
                                        {isSidebarOpen && (
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 space-y-4 border-t border-white/5 shrink-0">
                    {isSidebarOpen && (
                        <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-[10px]">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[10px] font-black text-white truncate">{user?.name}</span>
                                        <span className="text-[8px] text-cyan-500/50 font-bold uppercase tracking-widest">{user?.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="flex-1 flex items-center justify-center p-3 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white border border-transparent hover:border-white/5"
                        >
                            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </button>

                        {user && (
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="p-3 text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                                title="Disconnect Session"
                            >
                                <LogOut size={18} />
                            </Link>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
                {/* Desktop Header */}
                {header && (
                    <header className="hidden lg:block h-20 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-30 px-10 shrink-0">
                        <div className="h-full flex items-center">
                            {header}
                        </div>
                    </header>
                )}

                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <Link href="/" className="flex items-center space-x-3">
                        <Code2 className="text-cyan-400" size={24} />
                        <span className="font-black tracking-tighter text-white text-sm uppercase">HOACodeLab</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400">
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {children}
                </main>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] lg:hidden" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-80 bg-[#020617] border-l border-white/10 z-[70] p-8 flex flex-col lg:hidden shadow-2xl">
                            <div className="flex justify-between items-center mb-12">
                                <div className="flex items-center space-x-3">
                                    <Code2 className="text-cyan-400" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System_Menu</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
                            </div>
                            <nav className="flex-1 space-y-4">
                                {userItems.map((item) => (
                                    <Link key={item.name} href={item.href} className={`flex items-center space-x-4 p-4 rounded-2xl ${item.active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500'}`}>
                                        <item.icon size={20} />
                                        <span className="font-black uppercase tracking-widest text-xs">{item.name}</span>
                                    </Link>
                                ))}
                                {user?.role === 'admin' && (
                                    <>
                                        <div className="h-px bg-white/5 my-6" />
                                        <div className="text-[8px] font-black text-rose-500/40 uppercase tracking-[0.4em] mb-4">Command_Control</div>
                                        {adminItems.map((item) => (
                                            <Link key={item.name} href={item.href} className={`flex items-center space-x-4 p-4 rounded-2xl ${item.active ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-500'}`}>
                                                <item.icon size={20} />
                                                <span className="font-black uppercase tracking-widest text-xs">{item.name}</span>
                                            </Link>
                                        ))}
                                    </>
                                )}
                            </nav>
                            <Link href={route('logout')} method="post" as="button" className="flex items-center space-x-4 p-4 text-rose-500 font-black uppercase tracking-widest mt-auto border border-rose-500/20 rounded-2xl">
                                <LogOut size={20} /> <span className="text-xs">Disconnect_Session</span>
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.2); }
            ` }} />
        </div>
    );
}
