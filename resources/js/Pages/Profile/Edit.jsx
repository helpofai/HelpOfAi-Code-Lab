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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import IdentityVerificationForm from './Partials/IdentityVerificationForm';
import UserLevelBadge from '@/Components/Visuals/UserLevelBadge';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import { User, Shield, AlertTriangle, Fingerprint, Crown, Zap, CreditCard, BadgeCheck } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const isPro = user.role === 'admin' || user.role === 'paid-user';

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans">
                        <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-500">
                            <User size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">User Profile</h2>
                            <p className="text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1">Identity & Security</p>
                        </div>
                    </div>
                }
            >
                <Head title="Profile" />

                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    
                    <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-[var(--bg-elevated)] border-2 border-cyan-500/30 flex items-center justify-center text-cyan-500 mb-6 shadow-lg shadow-cyan-500/10">
                                        <User size={48} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-[var(--text-main)] flex items-center justify-center gap-2">
                                        {user.name}
                                        {user.identity_status === 'verified' && <BadgeCheck className="text-emerald-500" size={20} title="Verified Identity" />}
                                    </h3>
                                    <div className="flex justify-center mt-2">
                                        <UserLevelBadge level={user.level} size="md" />
                                    </div>
                                    <p className="text-xs font-mono text-[var(--text-muted)] mt-2">{user.email}</p>
                                    
                                    <div className="mt-8 w-full space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
                                            <div className="flex items-center gap-3">
                                                <Fingerprint size={16} className="text-cyan-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">User_ID</span>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-[var(--text-main)]">#{user.id.toString().padStart(4, '0')}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
                                            <div className="flex items-center gap-3">
                                                <Shield size={16} className="text-emerald-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Clearance</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{user.role || 'User'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SaaS Plans */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-8">
                                    <Crown size={20} className="text-amber-500" />
                                    <h3 className="text-sm font-black uppercase tracking-widest">Access_Protocols</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className={`p-5 rounded-2xl border transition-all ${!isPro ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-[var(--border)] opacity-50'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Initiate</span>
                                            {!isPro && <span className="text-[8px] font-black text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Current</span>}
                                        </div>
                                        <h4 className="text-lg font-black italic">Free_Tier</h4>
                                        <p className="text-[9px] text-[var(--text-muted)] uppercase mt-2">10 Neural Cores • Community Access</p>
                                    </div>

                                    <div className={`p-5 rounded-2xl border transition-all ${isPro ? 'border-amber-500/50 bg-amber-500/5' : 'border-[var(--border)] hover:border-amber-500/30'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Operator</span>
                                            {isPro && <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Active</span>}
                                        </div>
                                        <h4 className="text-lg font-black italic">Pro_Link</h4>
                                        <p className="text-[9px] text-[var(--text-muted)] uppercase mt-2">Unlimited Cores • Private Nodes • SSH Access</p>
                                        
                                        {!isPro && (
                                            <button className="w-full mt-6 py-3 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all shadow-lg shadow-amber-500/20">
                                                Upgrade_Clearance
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Forms Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-xl">
                                <IdentityVerificationForm className="max-w-xl" />
                            </div>

                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-xl">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>

                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-xl">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>

                            <div className="bg-[var(--bg-surface)] border border-rose-500/20 rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <AlertTriangle size={64} className="text-rose-500" />
                                </div>
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}