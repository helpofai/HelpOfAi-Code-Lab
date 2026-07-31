import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShoppingBag, Upload, Github, DollarSign, Activity, ChevronRight, Code2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function Sell() {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        category: 'Scripts',
        price: 19.99,
        github_repo_url: '',
        demo_url: '',
        meta_description: '',
        tags: '',
        markdown_files: []
    });

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post('/api/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            let thumbnailUrl = '';
            const galleryUrls = [];

            if (thumbnailFile) {
                toast.info("Uploading thumbnail...");
                thumbnailUrl = await uploadImage(thumbnailFile);
            }

            if (galleryFiles.length > 0) {
                toast.info(`Uploading ${galleryFiles.length} gallery images...`);
                for (const file of galleryFiles) {
                    const url = await uploadImage(file);
                    galleryUrls.push(url);
                }
            }

            const payload = {
                title: formData.title,
                category: formData.category,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                meta_description: formData.meta_description,
                is_for_sale: true,
                is_public: true,
                is_private: false,
                price: parseFloat(formData.price),
                github_repo_url: formData.github_repo_url,
                settings: {
                    demo_url: formData.demo_url,
                    markdown_files: formData.markdown_files || [],
                    thumbnail_url: thumbnailUrl,
                    gallery_images: galleryUrls,
                },
                code: { html: '', css: '', js: '' }
            };

            const res = await axios.post('/api/projects', payload);
            
            await axios.put(`/api/projects/${res.data.id}`, {
                is_for_sale: true,
                price: parseFloat(formData.price),
                github_repo_url: formData.github_repo_url,
                meta_description: formData.meta_description,
            });

            toast.success("Product successfully listed on the Marketplace!");
            router.visit(route('marketplace'));
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to list product.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded">
                        <ShoppingBag className="text-emerald-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">Sell a Product</h2>
                        <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.4em] mt-1">Marketplace Distribution</p>
                    </div>
                </div>
            }
        >
            <Head title="Sell Product" />
            
            <div className="p-6 md:p-12 overflow-y-auto min-h-screen">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-emerald-500/5 text-left">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/50">
                            <Upload className="text-black" size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-emerald-500 uppercase italic tracking-tighter">List your Software</h3>
                            <p className="text-sm font-bold text-[var(--text-muted)] mt-2">
                                Sell your scripts, themes, and plugins to thousands of buyers. 
                                We automatically handle 70/30 payment splits and generate RSA-signed license keys.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl space-y-8 text-left">
                        
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-[0.2em] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                                <Code2 size={16} className="text-cyan-500" /> Basic Information
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Product Title</label>
                                    <input 
                                        required type="text" 
                                        placeholder="e.g. Next.js SaaS Boilerplate" 
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})} 
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-bold"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Category</label>
                                    <select 
                                        value={formData.category} 
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-bold uppercase tracking-widest appearance-none"
                                    >
                                        <option value="Scripts">PHP Scripts</option>
                                        <option value="Themes">Themes & Templates</option>
                                        <option value="Plugins">Plugins</option>
                                        <option value="Mobile">Mobile Apps</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Short Description</label>
                                <textarea 
                                    required rows="3" 
                                    placeholder="Briefly describe what your product does..." 
                                    value={formData.meta_description} 
                                    onChange={e => setFormData({...formData, meta_description: e.target.value})}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Main Thumbnail Image</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => setThumbnailFile(e.target.files[0])} 
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-3 text-[var(--text-main)] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-black hover:file:bg-emerald-400 transition-all cursor-pointer"
                                    />
                                    {thumbnailFile && <p className="text-[10px] text-emerald-500 font-bold mt-1">Selected: {thumbnailFile.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Gallery Images (Multiple)</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        multiple
                                        onChange={e => setGalleryFiles(Array.from(e.target.files))} 
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-3 text-[var(--text-main)] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 transition-all cursor-pointer"
                                    />
                                    {galleryFiles.length > 0 && <p className="text-[10px] text-cyan-500 font-bold mt-1">Selected: {galleryFiles.length} files</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-[0.2em] border-b border-[var(--border)] pb-2 flex items-center gap-2 mt-8">
                                <DollarSign size={16} className="text-emerald-500" /> Pricing & Delivery
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Price (USD)</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-4 top-4 text-[var(--text-muted)]" />
                                        <input 
                                            required type="number" min="0" step="0.01" 
                                            value={formData.price} 
                                            onChange={e => setFormData({...formData, price: e.target.value})} 
                                            className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl pl-12 p-4 text-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-black text-lg"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Tags (Comma Separated)</label>
                                    <input 
                                        type="text" 
                                        placeholder="react, tailwind, saas" 
                                        value={formData.tags} 
                                        onChange={e => setFormData({...formData, tags: e.target.value})} 
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                                    />
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                        <Github size={14} /> GitHub Private Repo URL
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            required type="url" 
                                            placeholder="https://github.com/yourusername/private-repo" 
                                            value={formData.github_repo_url} 
                                            onChange={e => setFormData({...formData, github_repo_url: e.target.value})} 
                                            className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                if (!formData.github_repo_url) return toast.error("Please enter a GitHub URL first.");
                                                try {
                                                    const res = await axios.post('/api/vendor/github/fetch-md', { repo_url: formData.github_repo_url });
                                                    setFormData({...formData, markdown_files: res.data.markdown_files});
                                                    toast.success(`Fetched ${res.data.markdown_files.length} markdown file(s)!`);
                                                } catch (e) {
                                                    toast.error(e.response?.data?.message || "Failed to fetch markdown files.");
                                                }
                                            }}
                                            className="px-6 py-4 bg-gray-800 text-white hover:bg-gray-700 font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg"
                                        >
                                            Fetch Docs
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-[var(--text-muted)] font-bold mt-2">
                                        Click <strong>Fetch Docs</strong> to pull README and other .md files to display on your product page.
                                        Our asset server will also automatically stream the zipball of this repository to buyers.
                                    </p>
                                    
                                    {formData.markdown_files?.length > 0 && (
                                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                            <p className="text-xs font-bold text-emerald-500 mb-2">Ready to publish:</p>
                                            <ul className="list-disc list-inside text-sm text-[var(--text-main)]">
                                                {formData.markdown_files.map((md, idx) => (
                                                    <li key={idx} className="font-mono">{md.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3"
                            >
                                {isSubmitting ? <Activity className="animate-spin" size={18} /> : <ShoppingBag size={18} />}
                                List on Marketplace
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
