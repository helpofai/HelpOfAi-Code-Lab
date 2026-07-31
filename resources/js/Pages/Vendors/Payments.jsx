import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DollarSign, Activity, CheckCircle2, History, TrendingUp, CreditCard, ArrowRight, Wallet } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function VendorPayments({ sales, totalEarnings }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const toast = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        stripe_account_id: user.stripe_account_id || '',
        razorpay_account_id: user.razorpay_account_id || '',
        phonepe_merchant_id: user.phonepe_merchant_id || '',
        paytm_merchant_id: user.paytm_merchant_id || '',
    });

    const handleSavePayouts = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.post('/api/vendors/payout-accounts', formData);
            toast.success("Payout rules saved successfully.");
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded">
                        <DollarSign className="text-emerald-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">Payments & Payouts</h2>
                        <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.4em] mt-1">Vendors Revenue Management</p>
                    </div>
                </div>
            }
        >
            <Head title="Payments - Vendors Portal" />
            
            <div className="p-6 md:p-12 overflow-y-auto min-h-screen">
                <div className="max-w-6xl mx-auto space-y-8">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            
                            <form onSubmit={handleSavePayouts} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl space-y-8 text-left relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                                
                                <div>
                                    <h3 className="text-xl font-black text-[var(--text-main)] uppercase italic tracking-tighter flex items-center gap-2">
                                        <CreditCard size={24} className="text-emerald-500" /> Payout Routing Rules
                                    </h3>
                                    <p className="text-sm font-bold text-[var(--text-muted)] mt-2">
                                        Configure where your 70% share of marketplace sales should be sent. 
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Stripe Connect Account ID</label>
                                            <input 
                                                type="text" 
                                                placeholder="acct_xxxxxxxx" 
                                                value={formData.stripe_account_id} 
                                                onChange={e => setFormData({...formData, stripe_account_id: e.target.value})} 
                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Razorpay Route ID</label>
                                            <input 
                                                type="text" 
                                                placeholder="acc_xxxxxxxx" 
                                                value={formData.razorpay_account_id} 
                                                onChange={e => setFormData({...formData, razorpay_account_id: e.target.value})} 
                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">PhonePe Merchant ID</label>
                                            <input 
                                                type="text" 
                                                placeholder="M1234567890" 
                                                value={formData.phonepe_merchant_id} 
                                                onChange={e => setFormData({...formData, phonepe_merchant_id: e.target.value})} 
                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Paytm Merchant ID (MID)</label>
                                            <input 
                                                type="text" 
                                                placeholder="PAYTM_MID_xxxxxx" 
                                                value={formData.paytm_merchant_id} 
                                                onChange={e => setFormData({...formData, paytm_merchant_id: e.target.value})} 
                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3"
                                    >
                                        {isSaving ? <Activity className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                                        Save Routing Rules
                                    </button>
                                </div>
                            </form>

                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl space-y-8 relative">
                                <div>
                                    <h3 className="text-xl font-black text-[var(--text-main)] uppercase italic tracking-tighter flex items-center gap-2">
                                        <History size={24} className="text-cyan-500" /> Sales History
                                    </h3>
                                    <p className="text-sm font-bold text-[var(--text-muted)] mt-2">
                                        A chronological record of your marketplace sales and automated payouts.
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-[var(--border)] text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                                                <th className="pb-4">Date</th>
                                                <th className="pb-4">Product</th>
                                                <th className="pb-4">Buyer</th>
                                                <th className="pb-4">Gross</th>
                                                <th className="pb-4">Your Cut (70%)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {sales.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="py-8 text-center text-[var(--text-muted)] font-bold">
                                                        No sales generated yet. Start promoting your products!
                                                    </td>
                                                </tr>
                                            ) : (
                                                sales.map(sale => (
                                                    <tr key={sale.id} className="border-b border-[var(--border)] border-dashed hover:bg-[var(--bg-elevated)] transition-colors">
                                                        <td className="py-4 text-[var(--text-muted)]">{new Date(sale.created_at).toLocaleDateString()}</td>
                                                        <td className="py-4 text-[var(--text-main)] font-bold">{sale.project?.title}</td>
                                                        <td className="py-4 text-[var(--text-muted)]">@{sale.user?.name}</td>
                                                        <td className="py-4 font-mono text-[var(--text-muted)]">${Number(sale.amount).toFixed(2)}</td>
                                                        <td className="py-4 font-mono text-emerald-500 font-bold">${(Number(sale.amount) * 0.70).toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Vendor Earnings Summary */}
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                                <TrendingUp className="text-emerald-500 mx-auto" size={32} />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Total Vendors Earnings</h4>
                                <div className="text-5xl font-black tracking-tighter text-[var(--text-main)]">
                                    ${Number(totalEarnings).toFixed(2)}
                                </div>
                                <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-4 border-t border-[var(--border)] pt-4">
                                    Gross earnings derived from all sales across the platform.
                                </p>
                            </div>

                            {/* Wallet Balances */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl space-y-6">
                                <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-[var(--border)] pb-4">
                                    <Wallet size={20} className="text-emerald-500" /> Vendors Wallet
                                </h4>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Available to Withdraw</div>
                                        </div>
                                        <div className="text-xl font-black text-emerald-500 font-mono">${Number(user.available_balance || 0).toFixed(2)}</div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Pending Withdrawal</div>
                                        </div>
                                        <div className="text-xl font-black text-amber-500 font-mono">${Number(user.pending_balance || 0).toFixed(2)}</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={async () => {
                                        const amount = prompt("Enter amount to withdraw (min $10):", user.available_balance);
                                        if (!amount || isNaN(amount) || amount < 10) return alert('Invalid amount.');
                                        
                                        try {
                                            await axios.post('/api/vendors/request-payout', { amount: parseFloat(amount) });
                                            toast.success('Withdrawal requested successfully!');
                                            window.location.reload();
                                        } catch (e) {
                                            toast.error(e.response?.data?.message || 'Failed to request withdrawal.');
                                        }
                                    }}
                                    disabled={!user.available_balance || user.available_balance < 10}
                                    className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    Request Withdrawal
                                </button>
                                <p className="text-[9px] text-center font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">
                                    Only applicable if admin manual routing is enabled.
                                </p>
                            </div>
                        </div>

                        {/* Multi-Gateway Setup Guide Block at the Bottom */}
                        <div className="lg:col-span-3 mt-4">
                            <div className="p-8 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl space-y-6 shadow-xl">
                                <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-[var(--border)] pb-4">
                                    <DollarSign size={20} className="text-emerald-500" /> Payment Gateway Setup Guide
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h5 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                            How to connect your payouts
                                        </h5>
                                        <ol className="text-xs text-[var(--text-muted)] font-medium space-y-3 list-decimal list-inside marker:text-emerald-500/50">
                                            <li>Go to your respective payment gateway (Stripe or Razorpay) dashboard.</li>
                                            <li>Navigate to <strong>Developer Settings</strong> or <strong>API Keys</strong>.</li>
                                            <li>Generate your standard API keys (Client ID / Secret).</li>
                                            <li>Enter the details into the integration cards above and click <strong>Verify</strong>.</li>
                                            <li>Once verified, your account is immediately eligible to receive automated 70% payouts on every sale.</li>
                                        </ol>
                                    </div>
                                    <div className="space-y-4 border-t md:border-t-0 md:border-l border-[var(--border)] pt-6 md:pt-0 md:pl-8">
                                        <h5 className="text-[11px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                            How does the 70/30 split work?
                                        </h5>
                                        <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                                            Our marketplace utilizes an automated multi-gateway split payment infrastructure.
                                            When a customer buys your software, the transaction is instantly routed and split: <strong>70%</strong> goes directly into your connected Stripe or Razorpay account, and 30% is retained as a platform fee.
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-2">
                                            You must have at least one active, verified payment gateway connection to list paid products on the marketplace.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
