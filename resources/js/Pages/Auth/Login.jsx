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
            <Head title="Log in // Protocol" />

            {status && (
                <div className="mb-6 p-4 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="User_Identifier" />
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
                            placeholder="agent@hoacodelab.com"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="password" value="Security_Key" />
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
                            Persist_Session
                        </span>
                    </label>
                    
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-cyan-500 transition-colors"
                        >
                            Recover_Key?
                        </Link>
                    )}
                </div>

                <div className="pt-4">
                    <PrimaryButton className="w-full justify-center py-4 text-[10px] tracking-[0.2em] relative overflow-hidden group" disabled={processing}>
                        <span className="relative z-10 flex items-center gap-3">
                            {processing && <Loader2 className="animate-spin" size={14} />}
                            Authenticate_Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </PrimaryButton>
                </div>
                
                <div className="text-center pt-4 border-t border-[var(--border)]">
                    <Link href={route('register')} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                        New Unit? <span className="text-cyan-500">Initialize_Registration</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
