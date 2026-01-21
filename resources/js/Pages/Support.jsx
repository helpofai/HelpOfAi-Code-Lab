import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LifeBuoy, Plus, MessageSquare, 
    Clock, AlertCircle, Send, X,
    ChevronLeft, Loader2, Paperclip
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

export default function Support({ auth, tickets: initialTickets }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [activeTicket, setActiveTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const scrollRef = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        subject: '', message: '', priority: 'medium', attachment: null
    });

    const openTicket = async (ticket) => {
        setActiveTicket(ticket);
        setIsLoadingMessages(true);
        try {
            const res = await axios.get(route('support.show', ticket.id));
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
            const res = await axios.post(route('support.reply', activeTicket.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessages([...messages, res.data]);
            setReplyText('');
            setAttachment(null);
        } catch (e) {
            console.error("Transmission failed");
        }
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, activeTicket]);

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('support.store'), {
            onSuccess: () => { setShowCreateModal(false); reset(); window.location.reload(); }
        });
    };

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
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Support_Uplink</h2>
                                <p className="text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1">Direct Line to Core</p>
                            </div>
                        </div>
                        <button onClick={() => setShowCreateModal(true)} className="flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-xl">
                            <Plus className="mr-2" size={14} strokeWidth={3} /> New_Ticket
                        </button>
                    </div>
                }
            >
                <Head title="Support" />
                <div className="relative min-h-full flex overflow-hidden h-[calc(100vh-80px)]">
                    {/* Ticket List */}
                    <div className={`w-full lg:w-1/3 border-r border-[var(--border)] overflow-y-auto p-6 ${activeTicket ? 'hidden lg:block' : 'block'}`}>
                        <div className="space-y-4">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} onClick={() => openTicket(ticket)}
                                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeTicket?.id === ticket.id ? 'bg-[var(--bg-elevated)] border-cyan-500/50 shadow-lg' : 'bg-[var(--bg-surface)] border-[var(--border)] hover:border-cyan-500/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-widest ${getStatusColor(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span>
                                        <span className="text-[8px] font-mono text-[var(--text-muted)]">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-sm font-bold uppercase truncate">{ticket.subject}</h3>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-1 truncate">{ticket.messages[0]?.message || 'No messages'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`w-full lg:w-2/3 bg-[var(--bg-main)] flex flex-col ${!activeTicket ? 'hidden lg:flex' : 'flex'}`}>
                        {activeTicket ? (
                            <>
                                {/* Chat Header */}
                                <div className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--bg-surface)] shrink-0">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setActiveTicket(null)} className="lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"><ChevronLeft size={20}/></button>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-wide">{activeTicket.subject}</h3>
                                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                                                <span className="uppercase tracking-widest">ID: #{activeTicket.id}</span>
                                                <span>•</span>
                                                <span className="uppercase tracking-widest">{activeTicket.priority} Priority</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
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
                                                            {isMe ? 'You' : 'Admin'} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Input */}
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
                                        <input 
                                            value={replyText} 
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your response..."
                                            className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-0 transition-all outline-none"
                                            disabled={activeTicket.status === 'closed'}
                                        />
                                        <button disabled={activeTicket.status === 'closed'} className="p-3 bg-cyan-500 text-white rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                            <Send size={18} />
                                        </button>
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

                {/* Create Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden text-left">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)]">Transmit_Issue</h3>
                                    <button onClick={() => setShowCreateModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X size={20} /></button>
                                </div>
                                <form onSubmit={submitCreate} className="space-y-6">
                                    <div className="space-y-2"><InputLabel value="Subject" /><TextInput value={data.subject} onChange={e => setData('subject', e.target.value)} className="bg-[var(--bg-elevated)]" /></div>
                                    <div className="space-y-2"><InputLabel value="Priority" /><div className="grid grid-cols-3 gap-3">{['low', 'medium', 'high'].map(p => (<button key={p} type="button" onClick={() => setData('priority', p)} className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest ${data.priority === p ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)]'}`}>{p}</button>))}</div></div>
                                    <div className="space-y-2"><InputLabel value="Message" /><textarea value={data.message} onChange={e => setData('message', e.target.value)} className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] rounded-xl p-4 min-h-[120px] focus:border-cyan-500 focus:ring-0 outline-none" /></div>
                                    <div className="space-y-2"><InputLabel value="Attachment (Optional)" /><input type="file" onChange={e => setData('attachment', e.target.files[0])} className="w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[var(--bg-elevated)] file:text-[var(--text-main)] hover:file:bg-cyan-500 hover:file:text-white transition-all" /></div>
                                    <PrimaryButton disabled={processing} className="w-full justify-center py-4">Transmit</PrimaryButton>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </AuthenticatedLayout>
        </div>
    );
}
