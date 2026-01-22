import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Code2, Heart, Eye, Calendar, User } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';

export default function Explore() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/explore', { params: { search } });
            setProjects(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProjects();
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans relative overflow-hidden transition-colors duration-300">
            <ProBackground />

            <AuthenticatedLayout
                header={
                    <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6 relative z-10">
                        <div className="text-left">
                            <h2 className="text-xl font-black uppercase italic tracking-tight">Community_Grid</h2>
                            <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em]">Discover Neural Fragments</p>
                        </div>
                        
                        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-cyan-500 transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Search Protocol..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-full pl-10 pr-4 py-2.5 text-[11px] font-bold uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 transition-all"
                            />
                        </form>
                    </div>
                }
            >
                <Head title="Explore // Community" />

                <div className="p-6 md:p-12 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-64 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]" />
                                ))}
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <Link 
                                        key={project.id} 
                                        href={route('editor', project.slug)}
                                        className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col"
                                    >
                                        {/* Preview Placeholder */}
                                        <div className="h-48 bg-black/50 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-surface)] opacity-50" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="px-4 py-2 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                    Initialize Node
                                                </div>
                                            </div>
                                            {/* Code Snippet Background Effect */}
                                            <div className="p-4 opacity-20 text-[6px] font-mono text-cyan-500 overflow-hidden leading-tight select-none">
                                                {`<html><body><div id="app">Processing...</div></body></html>`.repeat(10)}
                                            </div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col justify-between relative">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h3>
                                                    {project.category && (
                                                        <span className="px-2 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                                            {project.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                                    <User size={12} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{project.user?.name || 'Unknown_Agent'}</span>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[var(--text-muted)]">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-mono">
                                                        <Calendar size={10} />
                                                        {new Date(project.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-cyan-500/50">
                                                    <Code2 size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 space-y-4 opacity-50">
                                <Code2 size={48} className="mx-auto text-[var(--text-muted)]" />
                                <p className="text-xs font-black uppercase tracking-[0.3em]">No Public Nodes Detected</p>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
