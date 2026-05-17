import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingBag, ShieldCheck, Zap, ArrowLeft, CreditCard, Wallet, Lock, Sparkles, CheckCircle2, FlaskConical } from 'lucide-react';
import axios from 'axios';

export default function Checkout({ auth, project, stripeKey, enabledGateways = [] }) {
    const [processing, setProcessing] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState(enabledGateways[0] || 'stripe');

    const gatewayMeta = {
        test: { name: 'Neural_Test_Bridge', icon: FlaskConical },
        stripe: { name: 'Stripe_Global', icon: CreditCard },
        razorpay: { name: 'Razorpay_INR', icon: Wallet },
        paytm: { name: 'Paytm_Node', icon: Zap },
        phonepe: { name: 'PhonePe_Secure', icon: ShieldCheck },
    };

    const handlePurchase = async () => {
        if (!selectedGateway) return alert('Please select a payment protocol.');
        setProcessing(true);
        try {
            const res = await axios.post('/api/purchase/checkout', {
                project_id: project.id,
                gateway: selectedGateway
            });

            if ((selectedGateway === 'stripe' || selectedGateway === 'test') && res.data.url) {
                window.location.href = res.data.url;
            } else if (selectedGateway === 'razorpay') {
                const options = {
                    key: res.data.key,
                    amount: res.data.amount,
                    currency: "INR",
                    name: "HOACodeLab",
                    description: `Unlocking Node: ${project.title}`,
                    order_id: res.data.order_id,
                    handler: async (response) => {
                        try {
                            await axios.post('/api/purchase/verify', {
                                gateway: 'razorpay',
                                project_id: project.id,
                                ...response
                            });
                            window.location.href = route('purchase.status', { status: 'success', project_id: project.id });
                        } catch (e) {
                            window.location.href = route('purchase.status', { status: 'failed', project_id: project.id, message: 'Verification failed' });
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
            } else {
                // Implement other gateways if needed
                alert(`${selectedGateway} protocol implementation pending.`);
            }
        } catch (e) {
            alert(e.response?.data?.message || 'Handshake failed.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic">Checkout_Terminal</h2>}
        >
            <Head>
                <title>Checkout // HOACodeLab</title>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            </Head>

            <div className="py-12 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Project Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-8 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 shadow-inner">
                                    <ShoppingBag size={40} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-cyan-500">
                                        <Zap size={14} className="fill-current" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Premium Node</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-[var(--text-main)] uppercase italic tracking-tighter">{project.title}</h3>
                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Created by @{project.user.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    'Full Source Code Access',
                                    'Unlimited Fork Rights',
                                    'Commercial Usage Permitted',
                                    'Lifetime Module Updates',
                                    'Asset Matrix Integration',
                                    'Priority Support Link'
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]">
                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-6 shadow-sm">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-main)] italic">Payment_Gateway_Protocol</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {enabledGateways.length > 0 ? (
                                    enabledGateways.map((gw) => {
                                        const meta = gatewayMeta[gw] || { name: gw, icon: CreditCard };
                                        const Icon = meta.icon;
                                        return (
                                            <button 
                                                key={gw}
                                                onClick={() => setSelectedGateway(gw)}
                                                className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${selectedGateway === gw ? 'bg-cyan-500/5 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-[var(--bg-main)] border-[var(--border)] opacity-50 hover:opacity-100'}`}
                                            >
                                                <Icon size={32} className={selectedGateway === gw ? 'text-cyan-500' : 'text-[var(--text-muted)]'} />
                                                <span className="text-xs font-black uppercase tracking-widest">{meta.name}</span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-2 p-8 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-center">
                                        <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Uplink_Failed: No active payment bridges detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary & Action */}
                    <div className="space-y-8">
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-8 shadow-sm sticky top-8">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-main)] italic">Order_Summary</h4>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                    <span>Unit Price</span>
                                    <span className="text-[var(--text-main)]">${project.price}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                    <span>Gateway Fee</span>
                                    <span className="text-emerald-500">$0.00</span>
                                </div>
                                <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                                    <span className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">Total Execution</span>
                                    <span className="text-3xl font-black text-cyan-500 font-mono">${project.price}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePurchase}
                                disabled={processing}
                                className="w-full py-5 bg-cyan-500 text-black rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {processing ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Lock size={16} /> Process_Handshake
                                    </>
                                )}
                            </button>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-emerald-500/20">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/80">Secured_Neural_Transaction</span>
                                </div>
                                <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold text-center tracking-tighter leading-relaxed">
                                    By processing this handshake, you agree to our Module Usage Protocols and Neural Core License.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
