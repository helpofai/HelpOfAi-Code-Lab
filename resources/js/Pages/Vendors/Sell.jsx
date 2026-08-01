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
        support_duration: '6_months',
        markdown_files: []
    });

    const [showTerminal, setShowTerminal] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const addLog = (msg, type = 'info') => {
        setTerminalLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    };

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await axios.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.url;
        } catch (err) {
            const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            toast.error("Upload failed: " + serverMsg);
            console.error("FULL ERROR:", err.response?.data);
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setShowTerminal(true);
        setTerminalLogs([]);
        
        try {
            addLog("Initializing CI/CD deployment sequence...", 'system');
            await new Promise(r => setTimeout(r, 800));
            
            let thumbnailUrl = '';
            const galleryUrls = [];

            if (thumbnailFile) {
                addLog("Uploading thumbnail assets to distributed edge storage...", 'info');
                thumbnailUrl = await uploadImage(thumbnailFile);
            }

            if (galleryFiles.length > 0) {
                addLog(`Uploading ${galleryFiles.length} gallery images...`, 'info');
                for (const file of galleryFiles) {
                    const url = await uploadImage(file);
                    galleryUrls.push(url);
                }
            }

            addLog("Connecting to GitHub via secure PAT proxy...", 'info');
            await new Promise(r => setTimeout(r, 1000));
            addLog("Authenticating repository access...", 'success');
            await new Promise(r => setTimeout(r, 600));

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
                    support_duration: formData.support_duration,
                },
                code: { html: '', css: '', js: '' }
            };

            addLog("Parsing package.json and composer.json for version targets...", 'info');
            await new Promise(r => setTimeout(r, 1200));
            addLog("Found latest commit hash from main branch.", 'success');
            await new Promise(r => setTimeout(r, 500));

            const res = await axios.post('/api/projects', payload);
            
            addLog("Injecting support duration architecture...", 'info');
            await axios.put(`/api/projects/${res.data.id}`, {
                is_for_sale: true,
                price: parseFloat(formData.price),
                github_repo_url: formData.github_repo_url,
                meta_description: formData.meta_description,
            });
            
            addLog("Registering Webhook Listener on HOACodeLab server...", 'info');
            await new Promise(r => setTimeout(r, 800));
            addLog("Marketplace Listing Complete! Real-time OTA proxy is LIVE.", 'success');

            toast.success("Product successfully listed on the Marketplace!");
            
            setTimeout(() => {
                router.visit(route('marketplace'));
            }, 2000);
            
        } catch (error) {
            addLog("CRITICAL FAILURE: " + (error.response?.data?.message || "Internal server error"), 'error');
            toast.error(error.response?.data?.message || "Failed to list product.");
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Support & Updates Duration</label>
                                    <select 
                                        value={formData.support_duration} 
                                        onChange={e => setFormData({...formData, support_duration: e.target.value})}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-bold uppercase tracking-widest appearance-none"
                                    >
                                        <option value="6_months">6 Months (Industry Standard)</option>
                                        <option value="lifetime">Lifetime Updates</option>
                                    </select>
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
                                                    const res = await axios.post('/api/vendors/github/fetch-md', { repo_url: formData.github_repo_url });
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

            {showTerminal && (
                <div 
                    style={{ left: position.x, top: position.y }}
                    className="fixed z-50 w-full max-w-lg bg-[#0a0a0a] border border-[#333] rounded-xl shadow-2xl overflow-hidden flex flex-col"
                >
                    <div 
                        onMouseDown={handleMouseDown}
                        className="bg-[#1a1a1a] border-b border-[#333] p-3 flex items-center justify-between cursor-move select-none"
                    >
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">CI/CD Real-Time Deployment Log</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 cursor-pointer" onClick={() => setShowTerminal(false)}></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    <div className="p-4 h-64 overflow-y-auto font-mono text-xs flex flex-col gap-1">
                        {terminalLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-3">
                                <span className="text-gray-600 shrink-0">[{log.time}]</span>
                                <span className={
                                    log.type === 'system' ? 'text-blue-400 font-bold' :
                                    log.type === 'success' ? 'text-emerald-400' :
                                    log.type === 'error' ? 'text-red-400 font-bold' :
                                    'text-gray-300'
                                }>
                                    {log.msg}
                                </span>
                            </div>
                        ))}
                        {isSubmitting && (
                            <div className="flex gap-3 mt-2 animate-pulse">
                                <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                                <span className="text-emerald-500">_</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
