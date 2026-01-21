import { Link } from '@inertiajs/react';
import ProBackground from '@/Components/Visuals/ProBackground';
import { Code2, Fingerprint, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeSwitcher from '@/Components/Visuals/ThemeSwitcher';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-cyan-500/30 relative flex flex-col items-center justify-center p-6 transition-colors duration-300">
            <ProBackground />

            {/* Theme Switcher for Guests */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeSwitcher />
            </div>

            <div className="relative z-20 w-full max-w-lg">
                {/* HEADER */}
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center mb-12">
                    <Link href="/" className="relative group">
                        <div className="p-5 bg-cyan-500 text-white dark:bg-white dark:text-black rounded-2xl shadow-2xl transition-transform group-hover:scale-105 active:scale-95">
                            <Code2 size={32} strokeWidth={2} />
                        </div>
                    </Link>
                    <div className="mt-8 text-center space-y-2">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter">HOACodeLab</h1>
                        <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.5em]">Secure_Protocol_Active</p>
                    </div>
                </motion.div>

                {/* CONTENT PANEL */}
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                    className="bg-[var(--bg-surface)] border border-[var(--border)] p-10 md:p-16 rounded-[2rem] shadow-2xl relative overflow-hidden"
                >
                    <div className="relative z-10">
                        {children}
                    </div>
                </motion.div>

                {/* FOOTER DATA */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.5 }}
                    className="mt-12 flex justify-between items-center px-6 text-[8px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)]"
                >
                    <div className="flex items-center gap-3"><Fingerprint size={12}/> <span>Ident_Check_Stable</span></div>
                    <div className="flex items-center gap-3"><span>Node_833B</span> <Cpu size={12}/></div>
                </motion.div>
            </div>
        </div>
    );
}