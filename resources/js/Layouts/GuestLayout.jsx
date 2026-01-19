import { Link } from '@inertiajs/react';
import NeuralNetwork from '@/Components/Visuals/NeuralNetwork';
import CursorGlow from '@/Components/Visuals/CursorGlow';
import { Code2, ShieldCheck, Cpu, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-hidden relative flex flex-col items-center justify-center p-6">
            {/* DEPTH LAYERS */}
            <div className="fixed inset-0 z-0">
                <NeuralNetwork />
                <CursorGlow />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10" />
            </div>

            {/* SCANLINE OVERLAY */}
            <div className="fixed inset-0 z-50 pointer-events-none bg-scanlines opacity-[0.03]" />

            <div className="relative z-20 w-full max-w-xl">
                {/* HEADER */}
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center mb-12"
                >
                    <Link href="/" className="relative group">
                        <div className="absolute -inset-10 bg-cyan-500/20 rounded-full blur-[60px] animate-pulse" />
                        <div className="relative p-6 bg-black border border-cyan-500/50 rounded-[2rem] shadow-[0_0_50px_rgba(34,211,238,0.3)]">
                            <Code2 className="text-cyan-400" size={48} strokeWidth={1.5} />
                        </div>
                    </Link>
                    <div className="mt-10 flex flex-col items-center space-y-3">
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">HOACodeLab</h1>
                        <div className="flex items-center space-x-4">
                            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
                            <span className="text-xs text-cyan-400 font-bold uppercase tracking-[0.8em]">SECURE_UPLINK</span>
                            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
                        </div>
                    </div>
                </motion.div>

                {/* THE PORTAL PANEL */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative group"
                >
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-500/50 via-transparent to-blue-500/50 rounded-[3.5rem] blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative bg-[#020617]/80 backdrop-blur-3xl border border-white/10 p-16 rounded-[3.5rem] shadow-2xl overflow-hidden">
                        {/* Internal Diagnostic Grid */}
                        <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
                        
                        {/* Corner Accents */}
                        <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-cyan-500/30" />
                        <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-cyan-500/30" />
                        <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-cyan-500/30" />
                        <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-cyan-500/30" />

                        <div className="relative z-10">
                            {children}
                        </div>
                    </div>
                </motion.div>

                {/* FOOTER DATA */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1 }}
                    className="mt-16 flex justify-between items-center px-10"
                >
                    <div className="flex items-center space-x-4 text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500/60">
                        <Fingerprint size={16} className="animate-pulse" />
                        <span>BIO_IDENT_ACTIVE</span>
                    </div>
                    <div className="flex items-center space-x-4 text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500/60">
                        <span>NODE: 833B_AUTH</span>
                        <Cpu size={16} />
                    </div>
                </motion.div>
            </div>

            <style>{`
                .bg-scanlines {
                    background: linear-gradient(to bottom, transparent 50%, black 50%);
                    background-size: 100% 4px;
                }
                .bg-grid-white {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
                }
            `}</style>
        </div>
    );
}