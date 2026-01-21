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
    Terminal,
    LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';
import NotificationDropdown from '@/Components/Visuals/NotificationDropdown';
import Dropdown from '@/Components/Dropdown';

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
        { name: 'Support', icon: LifeBuoy, href: route('support.index'), active: route().current('support.index') },
    ];

    const adminItems = [
        { name: 'Admin Command', icon: Shield, href: route('admin.dashboard'), active: route().current('admin.dashboard') },
        { name: 'User Matrix', icon: Users, href: route('admin.users'), active: route().current('admin.users') },
        { name: 'Support Queue', icon: LifeBuoy, href: route('admin.support'), active: route().current('admin.support') },
        { name: 'Front Management', icon: LayoutDashboard, href: route('admin.front-management'), active: route().current('admin.front-management') },
        { name: 'System Update', icon: Terminal, href: route('admin.update'), active: route().current('admin.update') },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex overflow-hidden transition-colors duration-300">
            {/* Desktop Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? '260px' : '80px' }}
                className="hidden lg:flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border)] sticky top-0 h-screen z-50 shrink-0"
            >
                <div className="h-20 flex items-center px-6 border-b border-[var(--border)] shrink-0">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500 text-white dark:bg-white dark:text-black rounded">
                            <Code2 size={20} />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold tracking-tight text-[var(--text-main)] uppercase italic">HOACodeLab</span>
                        )}
                    </Link>
                </div>

                <div className="flex-1 py-6 overflow-y-auto">
                    <div className="px-4 mb-8">
                        {isSidebarOpen && <div className="px-4 mb-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em]">Personal</div>}
                        <nav className="space-y-1">
                            {userItems.map((item) => (
                                <Link 
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-3 rounded transition-all ${item.active ? 'bg-cyan-500 text-white dark:text-black font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]'}`}
                                >
                                    <item.icon size={18} />
                                    {isSidebarOpen && <span className="text-[10px] uppercase tracking-widest">{item.name}</span>}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {user?.role === 'admin' && (
                        <div className="px-4 mb-8">
                            <div className="h-px bg-[var(--border)] mx-4 mb-6" />
                            {isSidebarOpen && <div className="px-4 mb-4 text-[9px] font-bold text-rose-500/60 uppercase tracking-[0.3em]">Command</div>}
                            <nav className="space-y-1">
                                {adminItems.map((item) => (
                                    <Link 
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-4 p-3 rounded transition-all ${item.active ? 'bg-rose-500 text-white font-bold' : 'text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/5'}`}
                                    >
                                        <item.icon size={18} />
                                        {isSidebarOpen && <span className="text-[10px] uppercase tracking-widest">{item.name}</span>}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-[var(--border)] shrink-0 space-y-4">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex-1 flex justify-center p-2 hover:bg-[var(--bg-elevated)] rounded transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)]">
                            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                        {user && (
                            <Link href={route('logout')} method="post" as="button" className="p-2 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 rounded border border-[var(--border)] transition-all">
                                <LogOut size={16} />
                            </Link>
                        )}
                    </div>
                </div>
            </motion.aside>

            <div className="flex-1 flex flex-col min-w-0 relative h-screen">
                <header className="hidden lg:flex h-20 border-b border-[var(--border)] bg-[var(--bg-main)] sticky top-0 z-30 px-10 shrink-0 items-center justify-between">
                    <div>{header}</div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 pr-6 border-r border-[var(--border)]">
                            <ThemeSwitcher />
                            <NotificationDropdown />
                        </div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 group focus:outline-none">
                                    <div className="text-right hidden xl:block">
                                        <p className="text-[10px] font-black uppercase text-[var(--text-main)] leading-none">{user.name}</p>
                                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase mt-1">Uplink_Active</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-lg overflow-hidden">
                                        <Users size={18} />
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route('dashboard')}>Dashboard</Dropdown.Link>
                                <Dropdown.Link href={route('my-projects')}>My Projects</Dropdown.Link>
                                <Dropdown.Link href={route('explore')}>Explore</Dropdown.Link>
                                <div className="border-t border-[var(--border)] my-1" />
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('support.index')}>Support</Dropdown.Link>
                                <div className="border-t border-[var(--border)] my-1" />
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="text-rose-500 hover:bg-rose-500/10">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <header className="lg:hidden h-16 bg-[var(--bg-surface)] border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <Link href="/" className="flex items-center gap-3">
                        <Code2 className="text-cyan-500 dark:text-cyan-400" size={20} />
                        <span className="font-bold text-[var(--text-main)] text-sm uppercase italic">HOACodeLab</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-[var(--text-muted)]"><Menu size={20} /></button>
                </header>

                <main className="flex-1 overflow-y-auto relative">
                    {children}
                </main>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-72 bg-[var(--bg-surface)] border-l border-[var(--border)] z-[70] p-8 flex flex-col lg:hidden shadow-2xl">
                            <div className="flex justify-between items-center mb-12">
                                <div className="flex items-center gap-3">
                                    <Code2 className="text-cyan-500" size={24} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">System</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X size={20} /></button>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {userItems.map((item) => (
                                    <Link key={item.name} href={item.href} className={`flex items-center gap-4 p-4 rounded ${item.active ? 'bg-cyan-500 text-white dark:text-black font-bold' : 'text-[var(--text-muted)]'}`}>
                                        <item.icon size={18} />
                                        <span className="uppercase tracking-widest text-[10px]">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                            
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <ThemeSwitcher />
                                <NotificationDropdown />
                            </div>

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