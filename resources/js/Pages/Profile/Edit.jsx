import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import { User, Shield, AlertTriangle, Fingerprint } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-500">
                            <User size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Node_Profile</h2>
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
                                    <h3 className="text-xl font-black uppercase tracking-tight text-[var(--text-main)]">{user.name}</h3>
                                    <p className="text-xs font-mono text-[var(--text-muted)] mt-1">{user.email}</p>
                                    
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
                        </div>

                        {/* Forms Column */}
                        <div className="lg:col-span-2 space-y-8">
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