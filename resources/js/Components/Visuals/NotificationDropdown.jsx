import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/api/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read_at).length);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {}
    };

    const markAllRead = async () => {
        try {
            await axios.put('/api/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (e) {}
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[var(--bg-surface)]" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-elevated)]">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-[9px] font-bold text-cyan-500 hover:underline">
                                        Mark_All_Read
                                    </button>
                                )}
                            </div>
                            
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div key={notification.id} className={`p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors ${!notification.read_at ? 'bg-cyan-500/5' : ''}`}>
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-xs font-bold text-[var(--text-main)]">{notification.data?.message || 'New Notification'}</p>
                                                    <p className="text-[9px] text-[var(--text-muted)]">{new Date(notification.created_at).toLocaleString()}</p>
                                                </div>
                                                {!notification.read_at && (
                                                    <button onClick={() => markAsRead(notification.id)} className="text-cyan-500 hover:text-cyan-400">
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-[var(--text-muted)] text-xs">
                                        No_New_Signals
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
