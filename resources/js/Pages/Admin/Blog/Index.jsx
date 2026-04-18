import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';
import { FileText, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';

export default function BlogIndex({ posts }) {
    const handleDelete = (id) => {
        if (confirm('Permanently delete this post?')) {
            router.delete(route('admin.blog.destroy', id));
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
                                <FileText size={20} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Blog system</h2>
                                <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Content Management</p>
                            </div>
                        </div>
                        <Link href={route('admin.blog.create')} className="flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl">
                            <Plus className="mr-2" size={14} strokeWidth={3} /> New_Entry
                        </Link>
                    </div>
                }
            >
                <Head title="Blog Management" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Title</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Category</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Status</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {posts.map((post) => (
                                            <tr key={post.id} className="group hover:bg-[var(--bg-elevated)] transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[var(--text-main)]">{post.title}</span>
                                                        <span className="text-[10px] font-mono text-[var(--text-muted)]">/{post.slug}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-500 px-2 py-1 rounded border border-purple-500/20">{post.category}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${post.is_published ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {post.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                                                        {post.is_published ? 'Published' : 'Draft'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={route('admin.blog.edit', post.id)} className="p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg hover:border-purple-500 hover:text-purple-500 transition-colors"><Edit size={14}/></Link>
                                                        <button onClick={() => handleDelete(post.id)} className="p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
