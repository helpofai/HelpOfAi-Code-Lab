import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Search, Filter, SlidersHorizontal, ChevronRight, LayoutGrid, Code2, Tag, ArrowRight, User, Eye, Lock, ShoppingBag, Loader2 } from 'lucide-react';
import axios from 'axios';
import ProjectPreviewContent from '@/Components/ProjectPreviewContent';

export default function Marketplace({ auth, siteSettings }) {
    const { globalAds } = usePage().props;
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    
    // Filters State - Defaulted to 'paid' for Marketplace
    const [filters, setFilters] = useState({
        search: '',
        category: 'ALL',
        type: 'paid', // Force paid (Marketplace logic)
        sort: 'latest', 
        min_price: 0,
        max_price: 1000,
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
            <Head title="Premium Marketplace" />
            
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Search Marketplace</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        placeholder="Search themes, scripts..." 
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-[var(--text-main)]"
                                    />
                                    <Search size={16} className="absolute left-4 top-3.5 text-[var(--text-muted)]" />
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
                                        min="0" max="2000" step="10"
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
                                onClick={() => setFilters({search: '', category: 'ALL', type: 'paid', sort: 'latest', min_price: 0, max_price: 1000})}
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
                            Premium Marketplace
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
                            <ShoppingBag size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                            <h3 className="text-xl font-black uppercase text-[var(--text-main)] tracking-widest">No Products Found</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <Link href={route('project.show', project.slug)} key={project.id} className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all hover:-translate-y-1 shadow-xl flex flex-col hover:border-cyan-500/30">
                                        <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-white">
                                            
                                            <ProjectPreviewContent project={project} />
                                            
                                            {project.is_for_sale && (
                                                <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30">
                                                    ${project.price}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-6 space-y-4 text-left flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate">{project.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                                                <span className="flex items-center gap-1 uppercase font-bold">
                                                    <User size={10} className="text-cyan-500/40" /> 
                                                    {project.user?.name || 'Unknown Vendor'}
                                                </span>
                                            </div>
                                            <div className="pt-4 mt-auto">
                                                <div className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 text-white bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border-none">
                                                    <ShoppingBag size={14} /> Buy Now
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
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Load More Products'}
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
