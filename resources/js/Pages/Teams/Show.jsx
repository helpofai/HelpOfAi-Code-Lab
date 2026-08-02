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
import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Users, Shield, UserPlus, Trash2, Mail, X, Check, Activity, Edit2 } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';

export default function TeamShow({ team, isOwner }) {
    const [showInviteModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const { data: inviteData, setData: setInviteData, post: postInvite, processing: inviteProcessing, reset: inviteReset, errors: inviteErrors } = useForm({
        email: '',
        role: 'member',
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing, errors: editErrors } = useForm({
        name: team.name,
    });

    const sendInvite = (e) => {
        e.preventDefault();
        postInvite(route('teams.members.store', team.id), {
            onSuccess: () => {
                setShowCreateModal(false);
                inviteReset();
            },
        });
    };

    const updateTeam = (e) => {
        e.preventDefault();
        putEdit(route('teams.update', team.id), {
            onSuccess: () => setShowEditModal(false),
        });
    };

    const deleteTeam = () => {
        if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
            router.delete(route('teams.destroy', team.id));
        }
    };

    const removeMember = (userId) => {
        if (confirm('Remove this user from the team?')) {
            router.delete(route('teams.members.destroy', { team: team.id, user: userId }));
        }
    };

    const cancelInvitation = (invitationId) => {
        if (confirm('Cancel this invitation?')) {
            router.delete(route('teams.invitations.destroy', { team: team.id, invitation: invitationId }));
        }
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
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">{team.name}</h2>
                                <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Unit Command</p>
                            </div>
                        </div>
                        {isOwner && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setShowEditModal(true)}
                                    className="p-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:text-purple-500 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl"
                                >
                                    <UserPlus className="mr-2" size={14} strokeWidth={3} /> Add_Member
                                </button>
                            </div>
                        )}
                    </div>
                }
            >
                <Head title={`Team: ${team.name}`} />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                        
                        {/* Members List */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex justify-between items-center">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                    <Shield size={14} /> Active_Personnel
                                </h3>
                                <span className="text-[10px] font-bold bg-[var(--bg-main)] px-3 py-1 rounded border border-[var(--border)]">{team.users.length + 1} Users</span>
                            </div>
                            <div className="divide-y divide-[var(--border)]">
                                {/* Owner */}
                                <div className="p-6 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-black">{team.owner.name.charAt(0)}</div>
                                        <div>
                                            <h4 className="font-bold text-sm">{team.owner.name}</h4>
                                            <p className="text-xs text-[var(--text-muted)]">{team.owner.email}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded text-[9px] font-black uppercase tracking-widest border border-purple-500/20">Commander</span>
                                </div>

                                {/* Members */}
                                {team.users.map((user) => (
                                    <div key={user.id} className="p-6 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--text-muted)]">{user.name.charAt(0)}</div>
                                            <div>
                                                <h4 className="font-bold text-sm">{user.name}</h4>
                                                <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1 bg-[var(--bg-main)] text-[var(--text-muted)] rounded text-[9px] font-black uppercase tracking-widest border border-[var(--border)]">{user.pivot.role}</span>
                                            {isOwner && (
                                                <button onClick={() => removeMember(user.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pending Invitations */}
                        {isOwner && team.invitations.length > 0 && (
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <div className="p-8 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                        <Mail size={14} /> Pending_Invites
                                    </h3>
                                </div>
                                <div className="divide-y divide-[var(--border)]">
                                    {team.invitations.map((invitation) => (
                                        <div key={invitation.id} className="p-6 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20">
                                                    <Activity size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm">{invitation.email}</h4>
                                                    <p className="text-xs text-[var(--text-muted)]">Role: {invitation.role}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => cancelInvitation(invitation.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Danger Zone */}
                        {isOwner && !team.personal_team && (
                            <div className="border border-rose-500/20 rounded-[2rem] p-8 mt-12 bg-rose-500/5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-bold text-rose-500 uppercase tracking-widest">Decommission Unit</h3>
                                        <p className="text-xs text-rose-500/60 mt-1">Permanently delete this team and all data.</p>
                                    </div>
                                    <button onClick={deleteTeam} className="px-6 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20">
                                        Delete Team
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Invite Modal */}
                <Modal show={showInviteModal} onClose={() => setShowCreateModal(false)}>
                    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg">
                        <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Invite New Personnel</h2>
                        <form onSubmit={sendInvite}>
                            <div className="mb-4">
                                <InputLabel value="Email Address" />
                                <TextInput 
                                    type="email"
                                    value={inviteData.email} 
                                    onChange={e => setInviteData('email', e.target.value)} 
                                    className="w-full bg-[var(--bg-elevated)]" 
                                    placeholder="agent@example.com"
                                />
                                {inviteErrors.email && <div className="text-rose-500 text-xs mt-1">{inviteErrors.email}</div>}
                            </div>
                            <div className="mb-6">
                                <InputLabel value="Role" />
                                <select 
                                    value={inviteData.role}
                                    onChange={e => setInviteData('role', e.target.value)}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm py-2 px-3 text-[var(--text-main)]"
                                >
                                    <option value="member">Member</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)]">Cancel</button>
                                <PrimaryButton disabled={inviteProcessing} className="bg-purple-500 hover:bg-purple-600 border-purple-500">Send Invite</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Edit Team Modal */}
                <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg">
                        <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Edit Unit Details</h2>
                        <form onSubmit={updateTeam}>
                            <div className="mb-4">
                                <InputLabel value="Unit Name" />
                                <TextInput 
                                    value={editData.name} 
                                    onChange={e => setEditData('name', e.target.value)} 
                                    className="w-full bg-[var(--bg-elevated)]" 
                                />
                                {editErrors.name && <div className="text-rose-500 text-xs mt-1">{editErrors.name}</div>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)]">Cancel</button>
                                <PrimaryButton disabled={editProcessing} className="bg-purple-500 hover:bg-purple-600 border-purple-500">Save Changes</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>
            </AuthenticatedLayout>
        </div>
    );
}
