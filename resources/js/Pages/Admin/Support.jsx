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
import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    LifeBuoy, MessageSquare, Clock, 
    AlertCircle, Trash2, Search, 
    Send, ChevronLeft, Loader2, User, Paperclip, X
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import axios from 'axios';

export default function Support({ auth, tickets: initialTickets }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [activeTicket, setActiveTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const scrollRef = useRef(null);

    const openTicket = async (ticket) => {
        setActiveTicket(ticket);
        setIsLoadingMessages(true);
        try {
            const res = await axios.get(route('admin.support.show', ticket.id));
            setMessages(res.data.messages);
        } catch (e) {
            console.error("Link failure");
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const sendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() && !attachment) return;
        
        const formData = new FormData();
        formData.append('message', replyText);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            const res = await axios.post(route('admin.support.reply', activeTicket.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessages([...messages, res.data]);
            setReplyText('');
            setAttachment(null);
        } catch (e) {
            console.error("Transmission failed");
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            await axios.put(route('admin.support.status', activeTicket.id), { status: newStatus });
            setActiveTicket({ ...activeTicket, status: newStatus });
            setTickets(tickets.map(t => t.id === activeTicket.id ? { ...t, status: newStatus } : t));
        } catch (e) {}
    };

    const deleteTicket = async () => {
        if(!confirm('Delete ticket?')) return;
        try {
            await axios.delete(route('admin.support.destroy', activeTicket.id));
            setTickets(tickets.filter(t => t.id !== activeTicket.id));
            setActiveTicket(null);
        } catch(e) {}
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, activeTicket]);

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.id.toString().includes(search) || t.user?.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'open': return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
            case 'in_progress': return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
            case 'closed': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
            default: return 'text-slate-500 border-slate-500/30 bg-slate-500/10';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-500">
                                <LifeBuoy size={20} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Support_Center</h2>
                                <p className="text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1">Admin Command</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest focus:border-cyan-500/50 outline-none w-48" />
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest focus:border-cyan-500/50 outline-none cursor-pointer">
                                <option value="all">All</option><option value="open">Open</option><option value="in_progress">Active</option><option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                }
            >
                <Head title="Support Center" />
                <div className="relative min-h-full flex overflow-hidden h-[calc(100vh-80px)]">
                    {/* List */}
                    <div className={`w-full lg:w-1/3 border-r border-[var(--border)] overflow-y-auto p-6 ${activeTicket ? 'hidden lg:block' : 'block'}`}>
                        <div className="space-y-4">
                            {filteredTickets.map((ticket) => (
                                <div key={ticket.id} onClick={() => openTicket(ticket)}
                                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeTicket?.id === ticket.id ? 'bg-[var(--bg-elevated)] border-cyan-500/50 shadow-lg' : 'bg-[var(--bg-surface)] border-[var(--border)] hover:border-cyan-500/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-widest ${getStatusColor(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span>
                                            {ticket.status === 'open' && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
                                        </div>
                                        <span className="text-[8px] font-mono text-[var(--text-muted)]">{new Date(ticket.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <User size={10} className="text-[var(--text-muted)]" />
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">{ticket.user?.name}</span>
                                    </div>
                                    <h3 className="text-sm font-bold uppercase truncate">{ticket.subject}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className={`w-full lg:w-2/3 bg-[var(--bg-main)] flex flex-col ${!activeTicket ? 'hidden lg:flex' : 'flex'}`}>
                        {activeTicket ? (
                            <>
                                <div className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--bg-surface)] shrink-0">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setActiveTicket(null)} className="lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"><ChevronLeft size={20}/></button>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-wide">{activeTicket.subject}</h3>
                                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                                                <span className="uppercase tracking-widest">USER: {activeTicket.user?.name}</span>
                                                <span>•</span>
                                                <span className={`uppercase tracking-widest ${activeTicket.priority === 'high' ? 'text-rose-500' : 'text-cyan-500'}`}>{activeTicket.priority} Priority</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select value={activeTicket.status} onChange={e => updateStatus(e.target.value)} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer">
                                            <option value="open">Open</option><option value="in_progress">Active</option><option value="closed">Closed</option>
                                        </select>
                                        <button onClick={deleteTicket} className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                                    {isLoadingMessages ? (
                                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500" /></div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMe = msg.user_id === auth.user.id;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <div className={`px-5 py-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm relative ${
                                                            isMe 
                                                            ? 'bg-cyan-600 text-white rounded-tr-none' 
                                                            : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] rounded-tl-none'
                                                        }`}>
                                                            {msg.attachment_path && (
                                                                <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                                                                    <a href={`/storage/${msg.attachment_path}`} target="_blank" rel="noopener noreferrer">
                                                                        <img src={`/storage/${msg.attachment_path}`} alt="Attachment" className="max-w-full h-auto max-h-60 object-cover hover:scale-105 transition-transform duration-300" />
                                                                    </a>
                                                                </div>
                                                            )}
                                                            {msg.message}
                                                        </div>
                                                        <span className="text-[9px] mt-1.5 font-mono uppercase tracking-widest opacity-40 text-[var(--text-muted)]">
                                                            {isMe ? 'Admin' : activeTicket.user?.name} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface)]">
                                    {attachment && (
                                        <div className="flex items-center gap-2 mb-2 p-2 bg-[var(--bg-elevated)] rounded-lg text-xs w-fit">
                                            <Paperclip size={12} />
                                            <span className="truncate max-w-[200px]">{attachment.name}</span>
                                            <button onClick={() => setAttachment(null)} className="text-rose-500 hover:text-rose-400"><X size={12}/></button>
                                        </div>
                                    )}
                                    <form onSubmit={sendReply} className="flex gap-2">
                                        <label className="p-3 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-xl hover:text-cyan-500 cursor-pointer transition-all">
                                            <Paperclip size={18} />
                                            <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files[0])} accept="image/*" />
                                        </label>
                                        <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your response..." className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-0 transition-all outline-none" />
                                        <button className="p-3 bg-cyan-500 text-white rounded-xl hover:brightness-110 transition-all"><Send size={18} /></button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] opacity-30">
                                <MessageSquare size={64} className="mb-4" />
                                <span className="text-xs font-black uppercase tracking-[0.5em]">Select_Frequency</span>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
