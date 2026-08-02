/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, TrendingUp, DollarSign, Calendar, ArrowRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index({ auth, sales, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic">Neural_Sales_Matrix</h2>}
        >
            <Head title="Sales Management" />

            <div className="py-12 px-10 space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Revenue', value: `$${stats.total_revenue}`, icon: DollarSign, color: 'text-emerald-500' },
                        { label: 'Total Sales', value: stats.total_sales, icon: ShoppingBag, color: 'text-cyan-500' },
                        { label: 'Monthly Sales', value: stats.sales_this_month, icon: Calendar, color: 'text-purple-500' },
                        { label: 'Monthly Revenue', value: `$${stats.revenue_this_month}`, icon: TrendingUp, color: 'text-rose-500' },
                    ].map((stat, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label} 
                            className="bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border)] ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <div className="text-2xl font-black text-[var(--text-main)] font-mono">{stat.value}</div>
                            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Table */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-main)]">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500"><ShoppingBag size={20} /></div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic">Recent Transactions</h3>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest">Real-time purchase logs</p>
                            </div>
                        </div>
                        <Link href={route('admin.sales.paid-projects')} className="px-6 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/30 transition-all flex items-center gap-2">
                            View Paid Projects <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-main)] border-b border-[var(--border)]">
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Transaction_ID</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Project</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Buyer</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Amount</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Gateway</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Status</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {sales.data.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-[var(--bg-main)]/50 transition-colors group">
                                        <td className="px-8 py-5 text-[10px] font-mono text-cyan-500/70 uppercase">#{sale.payment_id || sale.id}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                                    <Package size={14} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase text-[var(--text-main)] tracking-widest">{sale.project?.title}</div>
                                                    <div className="text-[9px] text-[var(--text-muted)] font-bold italic">By @{sale.project?.user?.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-[10px] font-black uppercase text-[var(--text-main)] tracking-widest">{sale.user?.name}</div>
                                            <div className="text-[9px] text-[var(--text-muted)] font-bold">{sale.user?.email}</div>
                                        </td>
                                        <td className="px-8 py-5 text-[10px] font-black text-[var(--text-main)] font-mono">${sale.amount}</td>
                                        <td className="px-8 py-5">
                                            <span className="px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                                {sale.payment_method}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500 tracking-widest">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                {sale.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                            {new Date(sale.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {sales.links.length > 3 && (
                        <div className="px-8 py-6 bg-[var(--bg-main)] border-t border-[var(--border)] flex justify-center gap-2">
                            {sales.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        link.active 
                                        ? 'bg-cyan-500 border-cyan-500 text-black shadow-lg' 
                                        : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                                    } ${!link.url && 'opacity-30 pointer-events-none'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
