import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ShieldCheck, Github, Code2, ArrowRight, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function Onboarding() {
    const { data, setData, post, processing, errors } = useForm({
        agreed_to_terms: false,
        bio: '',
        github_url: '',
    });

    const [step, setStep] = useState(1);
    const toast = useToast();

    const handleNext = () => {
        if (step === 1 && !data.agreed_to_terms) {
            toast.error('You must agree to the marketplace terms to proceed.');
            return;
        }
        if (step === 2 && data.bio.length < 10) {
            toast.error('Please write a short bio (at least 10 characters).');
            return;
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('vendor.onboarding.store'), {
            onError: () => toast.error('Please fix the errors before continuing.')
        });
    };

    const handleSkip = () => {
        if (confirm("Are you sure you want to skip vendor onboarding? You won't be able to sell products until you complete this.")) {
            router.post(route('vendor.onboarding.skip'));
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center relative overflow-hidden font-sans">
            <Head title="Vendor Onboarding" />
            
            {/* Close Button */}
            <button 
                onClick={handleSkip} 
                className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-400 rounded-full transition-colors z-50 group"
                title="Skip Vendor Onboarding"
            >
                <X size={24} className="group-hover:scale-110 transition-transform" />
            </button>
            
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>

            <div className="max-w-2xl w-full mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                        <Rocket size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter italic uppercase mb-2">Vendor Initialization</h1>
                    <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Complete your profile to start selling</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-3">
                            <div className={`w-10 h-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-white/10'}`}></div>
                        </div>
                    ))}
                </div>

                {/* Glass Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[400px]">
                    
                    <form onSubmit={submit}>
                        <AnimatePresence mode="wait">
                            
                            {/* STEP 1: TERMS */}
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-4">
                                        <ShieldCheck size={48} className="mx-auto text-emerald-400" />
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Marketplace Agreement</h2>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                            By joining HelpOfAi CodeLab, you agree to maintain high-quality code standards. All submissions must be your original work or properly licensed. 
                                        </p>
                                    </div>
                                    <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                                        <label className="flex items-start gap-4 cursor-pointer group">
                                            <div className="relative flex items-center justify-center mt-1">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-6 h-6 rounded-lg bg-black/50 border border-white/20 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer transition-colors"
                                                    checked={data.agreed_to_terms}
                                                    onChange={e => setData('agreed_to_terms', e.target.checked)}
                                                />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-sm mb-1 group-hover:text-cyan-400 transition-colors">I agree to the Developer Terms of Service</span>
                                                <span className="block text-xs text-[var(--text-muted)]">I confirm that I have read and agree to follow the marketplace guidelines.</span>
                                                {errors.agreed_to_terms && <p className="text-xs text-rose-500 mt-2">{errors.agreed_to_terms}</p>}
                                            </div>
                                        </label>
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="button" onClick={handleNext} className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors flex items-center gap-2 group">
                                            Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: BIO */}
                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-4">
                                        <Code2 size={48} className="mx-auto text-purple-400" />
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Developer Bio</h2>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                            Tell the community about yourself. This will appear on your public vendor profile and alongside your projects.
                                        </p>
                                    </div>
                                    <div>
                                        <textarea
                                            value={data.bio}
                                            onChange={e => setData('bio', e.target.value)}
                                            rows="4"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white placeholder-white/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none text-sm leading-relaxed"
                                            placeholder="I'm a full-stack developer specializing in React and Laravel..."
                                        />
                                        {errors.bio && <p className="text-xs text-rose-500 mt-2">{errors.bio}</p>}
                                    </div>
                                    <div className="flex justify-between">
                                        <button type="button" onClick={handleBack} className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2">
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                        <button type="button" onClick={handleNext} className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-colors flex items-center gap-2 group">
                                            Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: GITHUB */}
                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-4">
                                        <Github size={48} className="mx-auto text-cyan-400" />
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Connect GitHub</h2>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                            Link your GitHub profile to establish trust with buyers.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                <span className="text-[var(--text-muted)] font-mono text-sm">https://github.com/</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={data.github_url.replace('https://github.com/', '')}
                                                onChange={e => setData('github_url', `https://github.com/${e.target.value}`)}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-[160px] pr-5 text-white placeholder-white/30 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all font-mono text-sm"
                                                placeholder="username"
                                            />
                                        </div>
                                        {errors.github_url && <p className="text-xs text-rose-500 mt-2">{errors.github_url}</p>}
                                    </div>
                                    
                                    <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-cyan-100/70 leading-relaxed">
                                            Once you complete this step, your vendor dashboard will be fully unlocked.
                                        </p>
                                    </div>

                                    <div className="flex justify-between">
                                        <button type="button" onClick={handleBack} className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2">
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                        <button type="submit" disabled={processing} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 group disabled:opacity-50">
                                            {processing ? 'Processing...' : 'Complete Setup'} <CheckCircle2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </div>
    );
}
