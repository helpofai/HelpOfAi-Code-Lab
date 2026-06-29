import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Plus, Search, Edit2, Trash2, Globe, FileCode2, CheckCircle2, XCircle } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import InputError from '@/Components/InputError';

export default function AdsIndex({ auth, ads }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        provider: 'adsense',
        location: 'top_banner',
        client_id: '',
        slot_id: '',
        format: 'auto',
        custom_code: '',
        is_active: true,
    });

    const filteredAds = ads.filter(ad => 
        ad.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        ad.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (ad = null) => {
        clearErrors();
        if (ad) {
            setEditingAd(ad);
            setData({
                name: ad.name,
                provider: ad.provider,
                location: ad.location,
                client_id: ad.client_id || '',
                slot_id: ad.slot_id || '',
                format: ad.format || 'auto',
                custom_code: ad.custom_code || '',
                is_active: ad.is_active,
            });
        } else {
            setEditingAd(null);
            reset();
            setData('is_active', true);
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingAd) {
            put(route('admin.ads.update', editingAd.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('admin.ads.store'), {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this ad unit?')) {
            destroy(route('admin.ads.destroy', id));
        }
    };

    const toggleStatus = (ad) => {
        put(route('admin.ads.update', ad.id), {
            data: { ...ad, is_active: !ad.is_active },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-[var(--text-main)] uppercase tracking-widest italic">Ad Management</h2>}>
            <Head title="Ad Management" />
            <ProBackground />

            <div className="py-12 relative z-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-50" />
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="p-3 bg-cyan-500/20 text-cyan-500 rounded-xl"><Megaphone size={24} /></div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest text-[var(--text-main)]">Global Ads</h3>
                                <p className="text-xs font-bold text-[var(--text-muted)] mt-1">Manage AdSense, Facebook, and Custom Ads</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                <input
                                    type="text"
                                    placeholder="SEARCH ADS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-main)] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                />
                            </div>
                            <button onClick={() => openModal()} className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap">
                                <Plus size={14} /> New Ad
                            </button>
                        </div>
                    </div>

                    {/* Ads List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredAds.map(ad => (
                            <motion.div key={ad.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden transition-all hover:border-cyan-500/50 ${!ad.is_active && 'opacity-70 grayscale'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${ad.provider === 'adsense' ? 'bg-amber-500/20 text-amber-500' : ad.provider === 'facebook' ? 'bg-blue-500/20 text-blue-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                            {ad.provider === 'adsense' ? <Globe size={20} /> : ad.provider === 'facebook' ? <Globe size={20} /> : <FileCode2 size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm uppercase tracking-widest text-[var(--text-main)]">{ad.name}</h4>
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                                {ad.location.replace('_', ' ')} • {ad.provider}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toggleStatus(ad)} className={`p-2 rounded-lg transition-all ${ad.is_active ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                                            {ad.is_active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                        </button>
                                        <button onClick={() => openModal(ad)} className="p-2 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg hover:text-cyan-500 transition-all"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(ad.id)} className="p-2 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {ad.client_id && <div className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] p-2 rounded truncate">Client: {ad.client_id}</div>}
                                    {ad.slot_id && <div className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] p-2 rounded truncate">Slot: {ad.slot_id}</div>}
                                </div>
                            </motion.div>
                        ))}
                        {filteredAds.length === 0 && (
                            <div className="col-span-full py-12 text-center border border-dashed border-[var(--border)] rounded-2xl">
                                <Megaphone className="mx-auto h-12 w-12 text-[var(--text-muted)] opacity-20 mb-4" />
                                <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest italic mb-2">No Ad Units Found</h3>
                                <p className="text-xs font-bold text-[var(--text-muted)]">Click "New Ad" to integrate AdSense, Facebook, or Custom banners.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Ad Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic mb-6">
                                {editingAd ? 'Edit Ad Unit' : 'Create Ad Unit'}
                            </h3>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Ad Name</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500" placeholder="e.g. Header Banner" />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Provider</label>
                                        <select value={data.provider} onChange={e => setData('provider', e.target.value)} className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500">
                                            <option value="adsense">Google AdSense</option>
                                            <option value="facebook">Facebook Audience Network</option>
                                            <option value="custom">Custom HTML/JS</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Location</label>
                                        <select value={data.location} onChange={e => setData('location', e.target.value)} className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500">
                                            <option value="top_banner">Top Banner</option>
                                            <option value="sidebar">Sidebar</option>
                                            <option value="in_feed">In-Feed (Between Projects)</option>
                                            <option value="footer">Footer</option>
                                        </select>
                                    </div>
                                    {data.provider !== 'custom' && (
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Format</label>
                                            <select value={data.format} onChange={e => setData('format', e.target.value)} className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500">
                                                <option value="auto">Auto Responsive</option>
                                                <option value="fluid">Fluid</option>
                                                <option value="horizontal">Horizontal</option>
                                                <option value="vertical">Vertical</option>
                                                <option value="rectangle">Rectangle</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {data.provider !== 'custom' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border)]">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Publisher / Client ID</label>
                                            <input type="text" value={data.client_id} onChange={e => setData('client_id', e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded text-xs font-mono text-[var(--text-main)] p-3 focus:ring-cyan-500" placeholder="ca-pub-1234567890" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Ad Slot ID</label>
                                            <input type="text" value={data.slot_id} onChange={e => setData('slot_id', e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded text-xs font-mono text-[var(--text-main)] p-3 focus:ring-cyan-500" placeholder="1234567890" />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Custom Ad Code (HTML/JS)</label>
                                        <textarea value={data.custom_code} onChange={e => setData('custom_code', e.target.value)} rows="6" className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded font-mono text-xs text-[var(--text-main)] p-3 focus:ring-cyan-500" placeholder="<!-- Paste Ad Code Here -->" />
                                    </div>
                                )}

                                <div className="flex items-center gap-3 bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border)]">
                                    <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded border-gray-300 text-cyan-500 shadow-sm focus:ring-cyan-500 bg-[var(--bg-main)]" />
                                    <label htmlFor="is_active" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">Enable this Ad Unit instantly</label>
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-[var(--border)]">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-[var(--border)] text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest rounded hover:text-[var(--text-main)] transition-all">Cancel</button>
                                    <button type="submit" disabled={processing} className="px-6 py-3 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded hover:bg-white transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50">
                                        {editingAd ? 'Save Changes' : 'Create Ad Unit'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
