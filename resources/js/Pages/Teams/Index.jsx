import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { Users, Plus, Settings, UserPlus, LogOut, Shield } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';

export default function TeamIndex({ ownedTeams, memberTeams, invitations }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
    });

    const createTeam = (e) => {
        e.preventDefault();
        post(route('teams.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            },
        });
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans selection:bg-purple-500/30">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500">
                                <Users size={20} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Team_Command</h2>
                                <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Collaborative Units</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl"
                        >
                            <Plus className="mr-2" size={14} strokeWidth={3} /> Create_Unit
                        </button>
                    </div>
                }
            >
                <Head title="Teams" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                        
                        {/* Invitations */}
                        {invitations.length > 0 && (
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 mb-6 flex items-center gap-2">
                                    <UserPlus size={14} /> Pending_Handshakes
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {invitations.map((invitation) => (
                                        <div key={invitation.id} className="bg-[var(--bg-surface)] border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-lg">{invitation.team.name}</h4>
                                                    <p className="text-xs text-[var(--text-muted)]">Invited by: {invitation.team.owner.name}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-[9px] font-black uppercase tracking-widest border border-purple-500/20">{invitation.role}</span>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <Link as="button" method="post" href={route('invitations.accept', invitation.id)} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">Accept</Link>
                                                <Link as="button" method="delete" href={route('invitations.destroy', invitation.id)} className="flex-1 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-colors">Reject</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Owned Teams */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-6 flex items-center gap-2">
                                <Shield size={14} /> Command_Units (Owned)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ownedTeams.map((team) => (
                                    <Link href={route('teams.show', team.id)} key={team.id} className="group block bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-lg group-hover:text-purple-500 transition-colors">{team.name}</h4>
                                            <Settings size={16} className="text-[var(--text-muted)] group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                                            <span className="flex items-center gap-1"><Users size={12} /> {team.users_count} Members</span>
                                            {team.personal_team && <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--bg-elevated)] px-2 py-0.5 rounded border border-[var(--border)]">Personal</span>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Member Teams */}
                        {memberTeams.length > 0 && (
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-6 flex items-center gap-2">
                                    <LogOut size={14} /> Assigned_Units (Member)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {memberTeams.map((team) => (
                                        <Link href={route('teams.show', team.id)} key={team.id} className="group block bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-2xl transition-all duration-300">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-lg group-hover:text-cyan-500 transition-colors">{team.name}</h4>
                                                <span className="text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-500 px-2 py-1 rounded border border-cyan-500/20">{team.pivot.role}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                                                <span className="flex items-center gap-1"><Shield size={12} /> Owner: {team.owner.name}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg">
                        <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Initialize New Unit</h2>
                        <form onSubmit={createTeam}>
                            <div className="mb-4">
                                <InputLabel value="Unit Name" />
                                <TextInput 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    className="w-full bg-[var(--bg-elevated)]" 
                                    placeholder="e.g. Design Ops"
                                />
                                {errors.name && <div className="text-rose-500 text-xs mt-1">{errors.name}</div>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)]">Cancel</button>
                                <PrimaryButton disabled={processing} className="bg-purple-500 hover:bg-purple-600 border-purple-500">Initialize</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>
            </AuthenticatedLayout>
        </div>
    );
}
