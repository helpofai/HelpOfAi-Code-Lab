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
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { siteSettings } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
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
                {/* Social Login Buttons */}
                {siteSettings.facebook_enabled == 1 && (
                    <a href={route('social.redirect', 'facebook')} className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-blue-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl text-blue-500 hover:text-white">
                        Log in with Facebook
                    </a>
                )}
                {siteSettings.google_enabled == 1 && (
                    <a href={route('social.redirect', 'google')} className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-red-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl text-red-500 hover:text-white">
                        Log in with Google
                    </a>
                )}
                {siteSettings.github_enabled == 1 && (
                    <a href={route('social.redirect', 'github')} className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-slate-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl text-slate-500 hover:text-white">
                        Log in with GitHub
                    </a>
                )}

                {(siteSettings.facebook_enabled == 1 || siteSettings.google_enabled == 1 || siteSettings.github_enabled == 1) && (
                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-[var(--border)]"></div>
                        <span className="flex-shrink mx-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Or continue with</span>
                        <div className="flex-grow border-t border-[var(--border)]"></div>
                    </div>
                )}

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
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="w-full pl-12 pr-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                        <span className="ml-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Remember me</span>
                    </label>

                    {data.remember && (
                        <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest animate-pulse">
                            Session extended
                        </span>
                    )}

                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest hover:text-white transition-colors">
                            Forgot password?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? <Loader2 className="animate-spin" size={16} /> : 'Log In'}
                </PrimaryButton>

                <div className="text-center pt-4 border-t border-[var(--border)]">
                    <Link href={route('register')} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                        No account? <span className="text-cyan-500">Create an account</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
