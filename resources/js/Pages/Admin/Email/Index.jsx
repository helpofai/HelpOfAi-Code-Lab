import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';
import { Mail, Plus, Edit, Trash2, Send } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';

export default function EmailIndex({ templates }) {
    const handleDelete = (id) => {
        if (confirm('Delete this template?')) {
            router.delete(route('admin.email.destroy', id));
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500">
                                <Mail size={20} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Mail_System</h2>
                                <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Template Protocols</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href={route('admin.email.send')} className="flex items-center px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:text-purple-500 transition-all">
                                <Send className="mr-2" size={14} /> Send_Console
                            </Link>
                            <Link href={route('admin.email.create')} className="flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl">
                                <Plus className="mr-2" size={14} strokeWidth={3} /> New_Template
                            </Link>
                        </div>
                    </div>
                }
            >
                <Head title="Email Templates" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <div key={template.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-purple-500/50 transition-all shadow-lg group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-purple-500/5 rounded-xl text-purple-500">
                                            <Mail size={24} />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={route('admin.email.edit', template.id)} className="p-2 hover:bg-purple-500/10 rounded text-[var(--text-muted)] hover:text-purple-500"><Edit size={14} /></Link>
                                            <button onClick={() => handleDelete(template.id)} className="p-2 hover:bg-rose-500/10 rounded text-[var(--text-muted)] hover:text-rose-500"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{template.name}</h3>
                                    <p className="text-xs text-[var(--text-muted)] mb-4 truncate">{template.subject}</p>
                                    <div className="text-[10px] font-mono bg-[var(--bg-elevated)] p-2 rounded border border-[var(--border)] text-[var(--text-muted)]">
                                        ID: {template.id} | Last Sync: {new Date(template.updated_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
