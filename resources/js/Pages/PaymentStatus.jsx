import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, ArrowRight, Home, Code, ShoppingBag, Loader2, ShieldCheck, Zap } from 'lucide-react';

export default function PaymentStatus({ auth, status, project, message }) {
    const isSuccess = status === 'success';
    const isPending = status === 'pending';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic">Handshake_Status</h2>}
        >
            <Head title="Payment Status" />

            <div className="py-24 px-6 flex items-center justify-center min-h-[70vh]">
                <div className="max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[3rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className={`absolute top-0 left-0 w-full h-2 ${isSuccess ? 'bg-emerald-500' : (isPending ? 'bg-amber-500' : 'bg-rose-500')}`} />
                    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-10 ${isSuccess ? 'bg-emerald-500' : (isPending ? 'bg-amber-500' : 'bg-rose-500')}`} />

                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl ${
                        isSuccess ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20' : 
                        isPending ? 'bg-amber-500/10 text-amber-500 shadow-amber-500/20' : 
                        'bg-rose-500/10 text-rose-500 shadow-rose-500/20'
                    }`}>
                        {isSuccess ? <CheckCircle size={48} /> : (isPending ? <Loader2 size={48} className="animate-spin" /> : <XCircle size={48} />)}
                    </div>

                    <div className="space-y-3">
                        <h3 className={`text-2xl font-black uppercase italic tracking-tighter ${
                            isSuccess ? 'text-emerald-500' : 
                            isPending ? 'text-amber-500' : 
                            'text-rose-500'
                        }`}>
                            {isSuccess ? 'Handshake_Confirmed' : (isPending ? 'Transmission_Pending' : 'Transmission_Failed')}
                        </h3>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] leading-relaxed">
                            {isSuccess 
                                ? `Access granted to node: ${project?.title || 'Premium Module'}` 
                                : isPending 
                                    ? 'Verifying neural payment bridge. Please do not close this terminal.'
                                    : message || 'The neural transaction was interrupted or declined.'}
                        </p>
                    </div>

                    <div className="pt-8 space-y-3">
                        {isSuccess ? (
                            <Link 
                                href={project ? route('editor', project.slug) : route('dashboard')}
                                className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Code size={16} /> Enter_Neural_Editor <ArrowRight size={14} />
                            </Link>
                        ) : isPending ? (
                             <div className="w-full py-4 bg-[var(--bg-main)] border border-amber-500/20 text-amber-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3">
                                <Zap size={16} className="animate-pulse" /> Syncing_Chain...
                             </div>
                        ) : (
                            <Link 
                                href={project ? route('checkout.project', project.slug) : route('dashboard')}
                                className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={16} /> Retry_Handshake
                            </Link>
                        )}
                        
                        <Link 
                            href={route('dashboard')}
                            className="w-full py-4 bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)] rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:text-[var(--text-main)] transition-all flex items-center justify-center gap-2"
                        >
                            <Home size={16} /> Return_To_Core
                        </Link>
                    </div>

                    <div className="pt-6">
                        <div className="flex items-center justify-center gap-3 px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]">
                            <ShieldCheck size={14} className={isSuccess ? 'text-emerald-500' : 'text-[var(--text-muted)]'} />
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                {isSuccess ? 'Transaction_Verified_Secure' : 'Awaiting_Security_Confirmation'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
