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

import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log In" />

            {status && (
                <div className="mb-6 p-4 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Email Address" />
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full pl-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="password" value="Password" />
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full pl-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••••••"
                        />
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded bg-[var(--bg-main)] border-[var(--border)] text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="ms-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-cyan-500 transition-colors select-none">
                            Remember Me
                        </span>
                    </label>
                    
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-cyan-500 transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    )}
                </div>

                <div className="pt-4">
                    <PrimaryButton className="w-full justify-center py-4 text-[10px] tracking-[0.2em] relative overflow-hidden group" disabled={processing}>
                        <span className="relative z-10 flex items-center gap-3">
                            {processing && <Loader2 className="animate-spin" size={14} />}
                            Log In <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </PrimaryButton>
                </div>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border)]"></div>
                        </div>
                        <div className="relative flex justify-center text-[8px] uppercase tracking-widest">
                            <span className="bg-[var(--bg-surface)] px-2 text-slate-500 font-black">Social_Authentication</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <a href={route('social.redirect', 'google')} className="flex flex-col items-center gap-2 p-3 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-all group">
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Google</span>
                        </a>
                        <a href={route('social.redirect', 'facebook')} className="flex flex-col items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl hover:bg-blue-500/10 transition-all group">
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Facebook</span>
                        </a>
                        <a href={route('social.redirect', 'github')} className="flex flex-col items-center gap-2 p-3 bg-slate-500/5 border border-slate-500/10 rounded-xl hover:bg-slate-500/10 transition-all group">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">GitHub</span>
                        </a>
                    </div>
                </div>
                
                <div className="text-center pt-4 border-t border-[var(--border)]">
                    <Link href={route('register')} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                        No account? <span className="text-cyan-500">Create an account</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
