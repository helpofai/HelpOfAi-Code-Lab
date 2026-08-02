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

import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Search, Filter, SlidersHorizontal, ChevronRight, LayoutGrid, Code2, Tag, ArrowRight, User, Eye, Lock, ShoppingBag, Loader2 } from 'lucide-react';
import axios from 'axios';
import ProjectPreviewContent from '@/Components/ProjectPreviewContent';

export default function Explore({ auth, siteSettings }) {
    const { globalAds } = usePage().props;
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    
    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        category: 'ALL',
        type: 'all', // all, public, paid, private
        sort: 'latest', // latest, oldest, price_low, price_high
        min_price: 0,
        max_price: 500,
        timeframe: 'all_time', // all_time, today, this_week, this_month
        rating: 0, // 0 means all
    });

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Fetch Categories
        axios.get('/api/explore/categories').then(res => {
            setCategories(res.data || []);
        });
    }, []);

    useEffect(() => {
        fetchProjects(true);
    }, [filters]);

    const fetchProjects = async (reset = false) => {
        if (reset) {
            setLoading(true);
            setPage(1);
        }
        
        try {
            const currentPage = reset ? 1 : page;
            const params = {
                ...filters,
                page: currentPage
            };
            
            const res = await axios.get('/api/explore', { params });
            const data = res.data.data;
            
            if (reset) {
                setProjects(data);
            } else {
                setProjects(prev => [...prev, ...data]);
            }
            
            setHasMore(res.data.current_page < res.data.last_page);
            if (!reset) setPage(currentPage + 1);
            
        } catch (error) {
            console.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <PublicLayout>
            <Head title="Explore Modules" />
            
            <div className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen flex flex-col md:flex-row gap-8">
                
                {/* Advanced Filter Sidebar */}
                <div className="w-full md:w-80 flex-shrink-0 space-y-6">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl sticky top-24">
                        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-6">
                            <SlidersHorizontal size={20} className="text-cyan-500" />
                            <h2 className="text-xl font-black uppercase text-[var(--text-main)] tracking-widest italic">Filters</h2>
                        </div>
                        
                        <div className="space-y-8">
                            {/* Search */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Search</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        placeholder="Search modules..." 
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-[var(--text-main)]"
                                    />
                                    <Search size={16} className="absolute left-4 top-3.5 text-[var(--text-muted)]" />
                                </div>
                            </div>
                            
                            {/* Type Filter */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Access Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['all', 'public', 'paid', 'private'].map(type => (
                                        <button 
                                            key={type}
                                            onClick={() => handleFilterChange('type', type)}
                                            className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                                                filters.type === type 
                                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-500' 
                                                    : 'bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-muted)] hover:border-cyan-500/30 hover:text-[var(--text-main)]'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Price Range Slider */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex justify-between">
                                    <span>Price Range</span>
                                    <span className="text-cyan-500">${filters.min_price} - ${filters.max_price}</span>
                                </label>
                                
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="0" max="1000" step="5"
                                        value={filters.max_price}
                                        onChange={(e) => handleFilterChange('max_price', parseInt(e.target.value))}
                                        className="w-full h-2 bg-[var(--bg-main)] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Category Filter */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Category</label>
                                <select 
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-[var(--text-main)] uppercase tracking-wider font-bold"
                                >
                                    <option value="ALL">All Categories</option>
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Timeframe Filter */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Timeframe</label>
                                <select 
                                    value={filters.timeframe}
                                    onChange={(e) => handleFilterChange('timeframe', e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-[var(--text-main)] uppercase tracking-wider font-bold"
                                >
                                    <option value="all_time">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="this_week">This Week</option>
                                    <option value="this_month">This Month</option>
                                </select>
                            </div>
                            
                            {/* Rating Filter */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Minimum Rating</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 3, 4, 5].map(stars => (
                                        <button 
                                            key={stars}
                                            onClick={() => handleFilterChange('rating', stars)}
                                            className={`py-2 text-[10px] font-black tracking-widest rounded-lg border transition-all ${
                                                filters.rating === stars 
                                                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                                                    : 'bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-muted)] hover:border-amber-500/30 hover:text-[var(--text-main)]'
                                            }`}
                                        >
                                            {stars === 0 ? 'ANY' : `${stars}+ ⭐`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Sort Filter */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Sort By</label>
                                <select 
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-[var(--text-main)] uppercase tracking-wider font-bold"
                                >
                                    <option value="latest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                </select>
                            </div>
                            
                            <button 
                                onClick={() => setFilters({search: '', category: 'ALL', type: 'all', sort: 'latest', min_price: 0, max_price: 500, timeframe: 'all_time', rating: 0})}
                                className="w-full py-3 bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500/50 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between mb-8 border-b border-[var(--border)] pb-4">
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--text-main)] uppercase tracking-tighter italic">
                            All Modules
                        </h1>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                            {projects.length} Results
                        </div>
                    </div>

                    {loading && projects.length === 0 ? (
                        <div className="flex justify-center items-center py-32">
                            <Loader2 size={32} className="text-cyan-500 animate-spin" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-32 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl">
                            <LayoutGrid size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                            <h3 className="text-xl font-black uppercase text-[var(--text-main)] tracking-widest">No Modules Found</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <Link href={route('project.show', project.slug)} key={project.id} className={`group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all hover:-translate-y-1 shadow-xl flex flex-col ${project.is_restricted ? 'hover:border-rose-500/30' : 'hover:border-cyan-500/30'}`}>
                                        <div className={`aspect-video relative overflow-hidden flex items-center justify-center ${project.is_restricted ? 'bg-white' : 'bg-white'}`}>
                                            
                                            <ProjectPreviewContent project={project} />
                                            
                                            {project.is_restricted ? (
                                                <>
                                                    <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] z-20 pointer-events-none flex items-center justify-center">
                                                        <Lock className="text-rose-500/50 w-16 h-16" />
                                                    </div>
                                                    <div className="absolute top-4 right-4 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30">
                                                        Restricted
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {project.is_for_sale && (
                                                        <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30">
                                                            ${project.price}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        
                                        <div className="p-6 space-y-4 text-left flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate">{project.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                                                <span className="flex items-center gap-1 uppercase font-bold">
                                                    <User size={10} className={project.is_restricted ? "text-rose-500/40" : "text-cyan-500/40"} /> 
                                                    {project.user?.name || 'Unknown'}
                                                </span>
                                            </div>
                                            <div className="pt-4 mt-auto">
                                                <div className={`w-full py-3 bg-[var(--bg-elevated)] border border-[var(--border)] text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 ${
                                                    project.is_restricted 
                                                        ? 'text-[var(--text-muted)] group-hover:text-rose-500 group-hover:border-rose-500/50' 
                                                        : (project.is_for_sale 
                                                            ? 'text-white bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border-none' 
                                                            : 'text-[var(--text-muted)] group-hover:text-cyan-500 group-hover:border-cyan-500/50')
                                                }`}>
                                                    {project.is_restricted ? (
                                                        <><Eye size={14} /> View Restricted</>
                                                    ) : project.is_for_sale ? (
                                                        <><ShoppingBag size={14} /> Buy Now</>
                                                    ) : (
                                                        <><Code2 size={14} /> Open Source</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            
                            {hasMore && (
                                <div className="pt-8 flex justify-center">
                                    <button 
                                        onClick={() => fetchProjects(false)}
                                        disabled={loading}
                                        className="py-3 px-8 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-main)] hover:border-cyan-500/50 hover:text-cyan-500 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Load More Modules'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                
            </div>
        </PublicLayout>
    );
}
