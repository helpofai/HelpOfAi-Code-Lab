import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Wallet, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function Index({ auth, payouts }) {
    const toast = useToast();
    const [processingId, setProcessingId] = useState(null);

    const handleMarkAsPaid = (payoutId) => {
        if (!confirm("Are you sure you want to mark this payout as PAID? Make sure you have actually transferred the money to the vendor's account.")) return;
        
        setProcessingId(payoutId);
        router.post(route('admin.payouts.mark-paid', payoutId), {
            reference_id: `MANUAL_WIRE_${new Date().getTime()}`,
            admin_notes: 'Paid manually by Admin'
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Payout marked as completed.');
                setProcessingId(null);
            },
            onError: () => {
                toast.error('Failed to update payout.');
                setProcessingId(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic">Vendor_Payouts</h2>}
        >
            <Head title="Vendor Payouts" />

            <div className="py-12 px-10 space-y-10">
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-main)]">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Wallet size={20} /></div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic">Withdrawal Requests</h3>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest">Manage manual vendor payouts</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-main)] border-b border-[var(--border)]">
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Vendor</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Amount</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Status</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Gateway Preference</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Requested At</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {payouts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-12 text-center">
                                            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">No payout requests found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.data.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-[var(--bg-main)]/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="text-[10px] font-black uppercase text-[var(--text-main)] tracking-widest">{payout.user?.name}</div>
                                                <div className="text-[9px] text-[var(--text-muted)] font-bold">{payout.user?.email}</div>
                                            </td>
                                            <td className="px-8 py-5 text-[10px] font-black text-emerald-500 font-mono">${payout.amount}</td>
                                            <td className="px-8 py-5">
                                                {payout.status === 'pending' ? (
                                                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-500 tracking-widest">
                                                        <Clock size={12} /> Pending
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500 tracking-widest">
                                                        <CheckCircle size={12} /> Completed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                                    {payout.payment_method || 'ANY'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                                {new Date(payout.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {payout.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleMarkAsPaid(payout.id)}
                                                        disabled={processingId === payout.id}
                                                        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50"
                                                    >
                                                        {processingId === payout.id ? 'Processing...' : 'Mark as Paid'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
