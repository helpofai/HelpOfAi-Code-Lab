import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Zap, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { useToast } from '@/Components/Toast/ToastProvider';
import axios from 'axios';

export default function PaymentModal({ isOpen, onClose, user }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState('stripe');
    const toast = useToast();

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const res = await axios.post('/api/subscription/checkout', { gateway: selectedGateway });
            
            if (res.data.url) {
                window.location.href = res.data.url;
                return;
            }

            // Handle Razorpay (Non-URL based)
            if (res.data.gateway === 'razorpay') {
                const options = {
                    key: res.data.key,
                    amount: res.data.amount,
                    currency: "INR",
                    name: "HOACodeLab Pro",
                    description: "Monthly Pro Subscription",
                    order_id: res.data.order_id,
                    handler: async function (response) {
                        try {
                            await axios.post('/api/subscription/verify', {
                                gateway: 'razorpay',
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            window.location.href = '/dashboard?payment=success';
                        } catch (e) {
                            toast.error('Payment verification failed.');
                        }
                    },
                    prefill: {
                        name: res.data.user.name,
                        email: res.data.user.email,
                    },
                    theme: { color: "#06b6d4" }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
                onClose();
            }
        } catch (e) {
            toast.error(e.response?.data?.message || 'Uplink failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    const gateways = [
        { id: 'stripe', name: 'Global_Card', desc: 'Credit / Debit Card', icon: CreditCard, color: 'text-indigo-500' },
        { id: 'razorpay', name: 'Razorpay', desc: 'UPI / Cards / Net', icon: Zap, color: 'text-blue-500' },
        { id: 'phonepe', name: 'PhonePe', desc: 'Direct UPI App', icon: Activity, color: 'text-purple-500' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col transition-all duration-300">
                        <div className="p-8 lg:p-12 space-y-10">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)] leading-none">Initialize_Checkout</h3>
                                    <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.4em]">Secure Payment Gateway</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
                            </div>

                            <div className="space-y-4">
                                {gateways.map((gw) => (
                                    <button
                                        key={gw.id}
                                        onClick={() => setSelectedGateway(gw.id)}
                                        className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between group ${
                                            selectedGateway === gw.id 
                                            ? 'bg-cyan-500/5 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                                            : 'bg-[var(--bg-elevated)] border-[var(--border)] hover:border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`p-3 rounded-xl bg-black/20 ${selectedGateway === gw.id ? gw.color : 'text-[var(--text-muted)]'}`}>
                                                <gw.icon size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`text-xs font-black uppercase tracking-widest ${selectedGateway === gw.id ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>{gw.name}</p>
                                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase italic">{gw.desc}</p>
                                            </div>
                                        </div>
                                        {selectedGateway === gw.id && <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-[var(--border)]">
                                <button 
                                    disabled={isProcessing}
                                    onClick={handlePayment}
                                    className="w-full py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-cyan-500/10 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isProcessing ? 'Synchronizing...' : 'Authorize Transaction'} <ArrowRight size={16} />
                                </button>
                                <div className="mt-6 flex items-center justify-center gap-2 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">
                                    <ShieldCheck size={12} className="text-emerald-500" /> AES-256 Encrypted Neural Uplink
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}