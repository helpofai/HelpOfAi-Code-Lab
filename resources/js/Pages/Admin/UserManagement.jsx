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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Shield, Trash2, Search, 
    UserCheck, AlertTriangle, UserMinus,
    ChevronDown, Save, Loader2, Check,
    Plus, Edit, Lock, Unlock, X, UserPlus,
    Mail, ShieldAlert, Cpu, ShieldCheck, Crown, BadgeCheck, FileImage, Zap
} from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import UserLevelBadge from '@/Components/Visuals/UserLevelBadge';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function UserManagement() {
    const { auth } = usePage().props;
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [showModal, setShowModal] = useState(null); 
    const [identityModalUser, setIdentityModalUser] = useState(null);
    const [levelModalUser, setLevelModalUser] = useState(null);
    const [newLevel, setNewLevel] = useState(1);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (id, newRole) => {
        setUpdatingId(id);
        try {
            await axios.put(`/api/admin/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
        } catch (e) {
            toast.error('Failed to update clearance.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleToggleBlock = async (id) => {
        setUpdatingId(id);
        try {
            await axios.post(`/api/admin/users/${id}/block`);
            setUsers(users.map(u => u.id === id ? { ...u, is_blocked: !u.is_blocked } : u));
        } catch (e) {
            toast.error('Blocking protocol failed.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleTogglePro = async (id) => {
        setUpdatingId(id);
        try {
            const res = await axios.post(`/api/admin/users/${id}/toggle-pro`);
            const user = users.find(u => u.id === id);
            const isPro = user.role === 'paid-user';
            setUsers(users.map(u => u.id === id ? { ...u, role: isPro ? 'user' : 'paid-user' } : u));
        } catch (e) {
            toast.error('Pro status toggle failed.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('EXTERMINATE NODE: Permanent removal. Continue?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (e) {
            toast.error('Deletion protocol failed.');
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            if (showModal === 'create') {
                const res = await axios.post('/api/admin/users', formData);
                setUsers([res.data, ...users]);
            } else {
                const res = await axios.put(`/api/admin/users/${editingUser.id}`, formData);
                setUsers(users.map(u => u.id === editingUser.id ? res.data : u));
            }
            setShowModal(null);
            setFormData({ name: '', email: '', password: '', role: 'user' });
        } catch (e) {
            toast.error('Protocol error: Check unique constraints.');
        }
    };

    const handleVerifyIdentity = async (status, reason = '') => {
        try {
            await axios.post(`/api/admin/users/${identityModalUser.id}/verify-identity`, { status, reason });
            setUsers(users.map(u => u.id === identityModalUser.id ? { ...u, identity_status: status, identity_rejected_reason: status === 'rejected' ? reason : null } : u));
            setIdentityModalUser(null);
            toast.success(`Identity marked as ${status}.`);
        } catch (e) {
            toast.error('Failed to update identity status.');
        }
    };

    const handleUpdateLevel = async () => {
        try {
            const res = await axios.post(`/api/admin/users/${levelModalUser.id}/update-level`, { level: newLevel });
            setUsers(users.map(u => u.id === levelModalUser.id ? { ...u, level: res.data.user.level } : u));
            setLevelModalUser(null);
            toast.success('User level updated successfully.');
        } catch (e) {
            toast.error('Failed to update user level.');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleStyles = (role) => {
        switch(role) {
            case 'admin': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
            case 'paid-user': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
            case 'member': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
            default: return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
                        <AuthenticatedLayout
                header={
                <div className="flex justify-between items-center w-full text-left">
                    <div className="flex items-center space-x-4 text-left">
                        <div className="p-2 bg-rose-500/10 border border-rose-400/30 rounded-lg">
                            <Users className="text-rose-400" size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black text-[var(--text-main)] tracking-tighter uppercase leading-tight italic">User_Matrix</h2>
                            <p className="text-[8px] text-rose-500 uppercase tracking-[0.4em] font-bold">Total Active Nodes: {users.length}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                            <input 
                                type="text"
                                placeholder="Identify_Node..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:border-rose-500/50 focus:ring-0 w-64 transition-all text-[var(--text-main)] placeholder-[var(--text-muted)]"
                            />
                        </div>
                        <button 
                            onClick={() => { setFormData({ name: '', email: '', password: '', role: 'user' }); setShowModal('create'); }}
                            className="flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-xl"
                        >
                            <Plus className="mr-2" size={14} strokeWidth={3} /> Create_Node
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="User Management" />
            <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                <AnimatedGrid />
                <div className="max-w-7xl mx-auto relative z-10">
                    <AnimatePresence mode="wait">
                        {isLoading && !users.length ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-48 space-y-6">
                                <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] animate-pulse">Syncing_User_Database...</span>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--bg-surface)] backdrop-blur-3xl border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto text-left">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Node_Ident</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Clearance</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Level</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Status</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border)]">
                                            {filteredUsers.map((user) => (
                                                <motion.tr key={user.id} layout className="group hover:bg-[var(--bg-elevated)] transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm font-black uppercase tracking-tight transition-colors flex items-center gap-2 ${user.is_blocked ? 'text-rose-500 line-through opacity-50' : 'text-[var(--text-main)] group-hover:text-cyan-500'}`}>
                                                                {user.name}
                                                                {user.identity_status === 'verified' && <BadgeCheck className="text-emerald-500" size={14} title="Verified Identity" />}
                                                            </span>
                                                            <span className="text-[10px] font-mono text-[var(--text-muted)] lowercase">{user.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="relative inline-block w-40">
                                                            <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} disabled={updatingId === user.id}
                                                                className={`w-full appearance-none px-4 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest focus:ring-0 focus:border-[var(--text-main)] transition-all cursor-pointer ${getRoleStyles(user.role)}`}
                                                            >
                                                                <option value="user">User</option><option value="member">Member</option><option value="paid-user">Paid-User</option><option value="admin">Admin</option>
                                                            </select>
                                                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-left">
                                                        <UserLevelBadge level={user.level} size="md" />
                                                    </td>
                                                    <td className="px-8 py-6 text-left">
                                                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${user.is_blocked ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 'text-green-400 border-green-500/20 bg-green-500/5'}`}>
                                                            {user.is_blocked ? <ShieldAlert size={10} /> : <ShieldCheck size={10} />}
                                                            <span>{user.is_blocked ? 'Isolated' : 'Optimal'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all">
                                                            {user.identity_status === 'pending' && (
                                                                <button onClick={() => setIdentityModalUser(user)} className="p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all" title="Review Identity Docs">
                                                                    <FileImage size={16} />
                                                                </button>
                                                            )}
                                                            <button onClick={() => { setEditingUser(user); setFormData({ name: user.name, email: user.email, role: user.role }); setShowModal('edit'); }}
                                                                className="p-2.5 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-xl hover:bg-cyan-500 hover:text-white transition-all" title="Edit Node"
                                                            ><Edit size={16} /></button>
                                                            <button onClick={() => { setLevelModalUser(user); setNewLevel(user.level || 1); }}
                                                                className="p-2.5 bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20 rounded-xl hover:bg-fuchsia-500 hover:text-white transition-all" title="Adjust Level"
                                                            ><Zap size={16} /></button>
                                                            <button onClick={() => handleTogglePro(user.id)} disabled={user.role === 'admin' || updatingId === user.id}
                                                                className={`p-2.5 border rounded-xl transition-all ${user.role === 'paid-user' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-black' : 'bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-amber-500/20 hover:text-amber-500'}`}
                                                                title={user.role === 'paid-user' ? 'Revoke Pro' : 'Grant Pro'}
                                                            ><Crown size={16} /></button>
                                                            <button onClick={() => handleToggleBlock(user.id)} disabled={user.id === auth.user.id}
                                                                className={`p-2.5 border rounded-xl transition-all ${user.is_blocked ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white'}`}
                                                                title={user.is_blocked ? 'Unblock' : 'Block'}
                                                            >{user.is_blocked ? <Unlock size={16} /> : <Lock size={16} />}</button>
                                                            <button onClick={() => handleDeleteUser(user.id)} disabled={user.id === auth.user.id}
                                                                className="p-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all" title="Delete Node"
                                                            ><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-lg rounded-[3rem] p-12 shadow-2xl overflow-hidden text-left text-[var(--text-main)]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                            <div className="flex items-center space-x-4 mb-10 text-left">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30">
                                    {showModal === 'create' ? <UserPlus className="text-cyan-500" size={24} /> : <Edit className="text-cyan-500" size={24} />}
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-widest text-[var(--text-main)]">{showModal === 'create' ? 'Init_New_Node' : 'Re_Config_Node'}</h3>
                            </div>
                            <form onSubmit={handleSaveUser} className="space-y-6">
                                <div className="space-y-2 text-left"><InputLabel value="Node_Alias" /><TextInput value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="IDENT_NAME..." required /></div>
                                <div className="space-y-2 text-left"><InputLabel value="Neural_Address" /><TextInput type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="IDENT_EMAIL..." required /></div>
                                {showModal === 'create' && <div className="space-y-2 text-left"><InputLabel value="Access_Cipher" /><TextInput type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="SECURE_PASSWORD..." required /></div>}
                                <div className="space-y-2 text-left"><InputLabel value="Clearance_Level" />
                                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] font-mono text-xs rounded-xl px-6 py-4 outline-none focus:border-cyan-500/50 transition-all uppercase tracking-widest"
                                    ><option value="user">User</option><option value="member">Member</option><option value="paid-user">Paid-User</option><option value="admin">Admin</option></select>
                                </div>
                                <div className="pt-6 flex space-x-4">
                                    <button type="button" onClick={() => setShowModal(null)} className="flex-1 py-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all">Cancel_Abort</button>
                                    <PrimaryButton className="flex-1 py-4">Execute_Changes</PrimaryButton>
                                </div>
                            </form>
                            <button onClick={() => setShowModal(null)} className="absolute top-10 right-10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"><X size={24} /></button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {identityModalUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIdentityModalUser(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-hidden text-left text-[var(--text-main)] max-h-[90vh] overflow-y-auto">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                            <div className="flex items-center space-x-4 mb-8 text-left">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                                    <BadgeCheck className="text-emerald-500" size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-widest text-[var(--text-main)]">Review Identity: {identityModalUser.name}</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Selfie Match</h4>
                                    <div className="bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border)] h-64 flex items-center justify-center overflow-hidden">
                                        <img src={identityModalUser.identity_selfie_path} alt="Selfie" className="max-w-full max-h-full object-contain rounded-lg" />
                                    </div>
                                    <a href={identityModalUser.identity_selfie_path} target="_blank" rel="noreferrer" className="text-xs text-emerald-500 hover:underline">View Full Size</a>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">National ID Document</h4>
                                    <div className="bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border)] h-64 flex items-center justify-center overflow-hidden">
                                        {identityModalUser.identity_document_path?.endsWith('.pdf') ? (
                                            <a href={identityModalUser.identity_document_path} target="_blank" rel="noreferrer" className="text-emerald-500 flex flex-col items-center gap-2">
                                                <FileImage size={48} />
                                                <span className="text-xs font-bold">Open PDF Document</span>
                                            </a>
                                        ) : (
                                            <img src={identityModalUser.identity_document_path} alt="Document" className="max-w-full max-h-full object-contain rounded-lg" />
                                        )}
                                    </div>
                                    <a href={identityModalUser.identity_document_path} target="_blank" rel="noreferrer" className="text-xs text-emerald-500 hover:underline">View Full Size</a>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-[var(--border)] flex space-x-4">
                                <button type="button" onClick={() => {
                                    const reason = prompt('Enter reason for rejection:');
                                    if (reason !== null) handleVerifyIdentity('rejected', reason);
                                }} className="flex-1 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                                    Reject & Notify
                                </button>
                                <button type="button" onClick={() => handleVerifyIdentity('verified')} className="flex-1 py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                                    Approve Identity
                                </button>
                            </div>
                            <button onClick={() => setIdentityModalUser(null)} className="absolute top-10 right-10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"><X size={24} /></button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {levelModalUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLevelModalUser(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-sm rounded-[3rem] p-12 shadow-2xl overflow-hidden text-left text-[var(--text-main)]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
                            <div className="flex items-center space-x-4 mb-8 text-left">
                                <div className="p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/30">
                                    <Zap className="text-fuchsia-500" size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-widest text-[var(--text-main)]">Adjust Level</h3>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <p className="text-xs text-[var(--text-muted)] font-bold">Manually override the level for <span className="text-[var(--text-main)]">{levelModalUser.name}</span>. This will lock their level from automatic adjustments.</p>
                                <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl">
                                    <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Current</span>
                                    <UserLevelBadge level={levelModalUser.level} size="md" />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="New Level (1-10)" />
                                    <input type="number" min="1" max="10" value={newLevel} onChange={(e) => setNewLevel(parseInt(e.target.value) || 1)}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-lg font-black text-center text-fuchsia-500 focus:border-fuchsia-500 focus:ring-0 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button type="button" onClick={() => setLevelModalUser(null)} className="flex-1 py-4 bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-[var(--text-main)] transition-all">
                                    Cancel
                                </button>
                                <button type="button" onClick={handleUpdateLevel} className="flex-1 py-4 bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all">
                                    Update Level
                                </button>
                            </div>
                            <button onClick={() => setLevelModalUser(null)} className="absolute top-10 right-10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"><X size={24} /></button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </AuthenticatedLayout>
        </div>
    );
}