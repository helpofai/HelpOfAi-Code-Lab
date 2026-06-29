import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
                
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full w-24 h-24 mx-auto animate-pulse" />
                    <div className="relative bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-main)] p-6 rounded-3xl border border-[var(--border)] shadow-2xl">
                        <Mail className="text-cyan-400 w-12 h-12" />
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-[var(--bg-surface)]">
                            <ShieldCheck className="text-white w-4 h-4" />
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-3 max-w-sm">
                    <h2 className="text-2xl font-black uppercase tracking-widest text-[var(--text-main)]">
                        Verify Identity
                    </h2>
                    <p className="text-sm font-medium text-[var(--text-muted)] leading-relaxed">
                        Transmission logged. To gain full access to the mainframe, please verify your neural link (email address) using the encrypted message we just dispatched.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl w-full"
                    >
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-black uppercase tracking-widest text-left">
                            A fresh verification token has been deployed to your inbox.
                        </p>
                    </motion.div>
                )}

                <form onSubmit={submit} className="w-full space-y-6 mt-4">
                    <div className="flex flex-col space-y-4">
                        <PrimaryButton 
                            disabled={processing} 
                            className="w-full flex justify-center items-center py-4 text-xs font-black"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            RESEND_VERIFICATION_TOKEN
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </PrimaryButton>

                        <div className="flex justify-center border-t border-[var(--border)] pt-6 mt-4">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-cyan-400 transition-colors flex items-center space-x-2"
                            >
                                <span>Terminate_Session</span>
                            </Link>
                        </div>
                    </div>
                </form>

            </div>
        </GuestLayout>
    );
}
