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

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
    const { siteSettings } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                {/* Social Login Buttons */}
                {siteSettings.facebook_enabled && (
                    <a href={route('social.redirect', 'facebook')} className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-blue-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl text-blue-500 hover:text-white">
                        Sign up with Facebook
                    </a>
                )}
                {siteSettings.google_enabled && (
                    <a href={route('social.redirect', 'google')} className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-red-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl text-red-500 hover:text-white">
                        Sign up with Google
                    </a>
                )}

                {(siteSettings.facebook_enabled || siteSettings.google_enabled) && (
                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-[var(--border)]"></div>
                        <span className="flex-shrink mx-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Or continue with</span>
                        <div className="flex-grow border-t border-[var(--border)]"></div>
                    </div>
                )}

                <div className="space-y-2">
                    <InputLabel htmlFor="name" value="Name" />
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full pl-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Full Name"
                        />
                    </div>
                    <InputError message={errors.name} />
                </div>

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
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            placeholder="••••••••••••"
                        />
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full pl-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            placeholder="••••••••••••"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="pt-4">
                    <PrimaryButton className="w-full justify-center py-4 text-[10px] tracking-[0.2em] relative overflow-hidden group" disabled={processing}>
                        <span className="relative z-10 flex items-center gap-3">
                            {processing && <Loader2 className="animate-spin" size={14} />}
                            Register <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </PrimaryButton>
                </div>

                <div className="text-center pt-4 border-t border-[var(--border)]">
                    <Link href={route('login')} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                        Already have an account? <span className="text-cyan-500">Log In</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
