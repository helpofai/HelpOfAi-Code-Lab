import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
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
            <Head title="Init_Protocol" />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <InputLabel htmlFor="name" value="Designation" />
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
                            placeholder="Agent Name"
                        />
                    </div>
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Communication_Link" />
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
                            placeholder="unit@hoacodelab.com"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="password" value="Access_Cipher" />
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
                    <InputLabel htmlFor="password_confirmation" value="Verify_Cipher" />
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
                            Initialize_Uplink <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </PrimaryButton>
                </div>

                <div className="text-center pt-4 border-t border-[var(--border)]">
                    <Link href={route('login')} className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                        Already Operational? <span className="text-cyan-500">Access_Portal</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
