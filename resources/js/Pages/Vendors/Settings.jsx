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
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Save, User, Wallet, FileText, Link as LinkIcon, Shield } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import { useToast } from '@/Components/Toast/ToastProvider';
import axios from 'axios';

export default function VendorSettings() {
    const { auth } = usePage().props;
    const user = auth.user;
    const toast = useToast();

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        github_username: user.github_username || '',
        twitter_username: user.twitter_username || '',
        website_url: user.website_url || '',
    });

    const [payoutData, setPayoutData] = useState({
        stripe_account_id: user.stripe_account_id || '',
        razorpay_account_id: user.razorpay_account_id || '',
    });
    const [savingPayout, setSavingPayout] = useState(false);

    const submitProfile = (e) => {
        e.preventDefault();
        put(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Profile settings updated successfully.'),
            onError: () => toast.error('Failed to update profile settings.'),
        });
    };

    const submitPayout = async (e) => {
        e.preventDefault();
        setSavingPayout(true);
        try {
            await axios.post('/api/vendors/payout-accounts', payoutData);
            toast.success('Payout accounts updated securely.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update payout accounts.');
        } finally {
            setSavingPayout(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500">
                            <Shield size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Vendor_Settings</h2>
                            <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Profile & Configuration</p>
                        </div>
                    </div>
                }
            >
                <Head title="Vendor Settings" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                        
                        {/* Profile Settings */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-8">
                            <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                                <User className="text-purple-500" size={24} />
                                <h3 className="text-lg font-black uppercase tracking-widest">Public Profile Settings</h3>
                            </div>
                            
                            <form onSubmit={submitProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <InputLabel value="Vendor Name" />
                                        <TextInput 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)} 
                                            className="w-full bg-[var(--bg-elevated)]" 
                                            placeholder="Your display name"
                                        />
                                        {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Email Address" />
                                        <TextInput 
                                            value={data.email} 
                                            type="email"
                                            onChange={e => setData('email', e.target.value)} 
                                            className="w-full bg-[var(--bg-elevated)]" 
                                        />
                                        {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <InputLabel value="Bio / Description" />
                                    <textarea 
                                        value={data.bio}
                                        onChange={e => setData('bio', e.target.value)}
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none min-h-[100px] text-[var(--text-main)]"
                                        placeholder="Tell buyers about your software development expertise..."
                                    />
                                    {errors.bio && <p className="text-rose-500 text-xs mt-1">{errors.bio}</p>}
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <PrimaryButton className="bg-purple-500 hover:bg-purple-600 border-purple-500 px-8 py-3 text-xs" disabled={processing}>
                                        <Save size={16} className="mr-2" /> Save Profile
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                        {/* Payout Settings */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-8">
                            <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                                <Wallet className="text-emerald-500" size={24} />
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)]">Payout Configuration</h3>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">Configure where your earnings will be sent.</p>
                                </div>
                            </div>
                            
                            <form onSubmit={submitPayout} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <InputLabel value="Stripe Account ID (International)" />
                                        <TextInput 
                                            value={payoutData.stripe_account_id} 
                                            onChange={e => setPayoutData({...payoutData, stripe_account_id: e.target.value})} 
                                            className="w-full bg-[var(--bg-elevated)]" 
                                            placeholder="acct_1..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Razorpay Account ID (India)" />
                                        <TextInput 
                                            value={payoutData.razorpay_account_id} 
                                            onChange={e => setPayoutData({...payoutData, razorpay_account_id: e.target.value})} 
                                            className="w-full bg-[var(--bg-elevated)]" 
                                            placeholder="acc_..."
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <PrimaryButton className="bg-emerald-500 hover:bg-emerald-600 border-emerald-500 px-8 py-3 text-xs" disabled={savingPayout}>
                                        <Save size={16} className="mr-2" /> Update Payouts
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
