import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { FileText, Save, Image as ImageIcon, X } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TiptapEditor from '@/Components/Editor/TiptapEditor';

export default function BlogCreateEdit({ post }) {
    const { data, setData, post: store, put, processing, errors } = useForm({
        title: post?.title || '',
        content: post?.content || '',
        category: post?.category || 'General',
        image: null,
        is_published: post?.is_published || false,
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
        meta_keywords: post?.meta_keywords || '',
        og_image: null,
        canonical_url: post?.canonical_url || '',
    });

    const [preview, setPreview] = useState(post?.image_path ? `/storage/${post.image_path}` : null);
    const [ogPreview, setOgPreview] = useState(post?.og_image ? `/storage/${post.og_image}` : null);

    const submit = (e) => {
        e.preventDefault();
        if (post) {
            router.post(route('admin.blog.update', post.id), { ...data, _method: 'put' });
        } else {
            store(route('admin.blog.store'));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleOgImageChange = (e) => {
        const file = e.target.files[0];
        setData('og_image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setOgPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500">
                            <FileText size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">{post ? 'Edit_Blog' : 'New_Blog'}</h2>
                            <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Content Editor</p>
                        </div>
                    </div>
                }
            >
                <Head title={post ? 'Edit Post' : 'New Post'} />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-5xl mx-auto relative z-10">
                        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-2">
                                    <InputLabel value="Title" />
                                    <TextInput value={data.title} onChange={e => setData('title', e.target.value)} className="bg-[var(--bg-surface)]" placeholder="Enter title..." />
                                    {errors.title && <p className="text-rose-500 text-xs">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="Content" />
                                    <TiptapEditor 
                                        content={data.content} 
                                        onChange={(value) => setData('content', value)} 
                                    />
                                    {errors.content && <p className="text-rose-500 text-xs">{errors.content}</p>}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
                                    <div className="space-y-2">
                                        <InputLabel value="Status" />
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="status" checked={!data.is_published} onChange={() => setData('is_published', false)} className="text-purple-500 focus:ring-purple-500 bg-[var(--bg-elevated)]" />
                                                <span className="text-xs font-bold uppercase">Draft</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="status" checked={data.is_published} onChange={() => setData('is_published', true)} className="text-purple-500 focus:ring-purple-500 bg-[var(--bg-elevated)]" />
                                                <span className="text-xs font-bold uppercase">Published</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <InputLabel value="Category" />
                                        <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-bold uppercase focus:border-purple-500 outline-none text-[var(--text-main)]">
                                            <option value="General">General</option>
                                            <option value="Tutorial">Tutorial</option>
                                            <option value="Update">Update</option>
                                            <option value="News">News</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel value="Cover Image" />
                                        <div className="relative aspect-video bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--border)] rounded-xl flex items-center justify-center overflow-hidden hover:border-purple-500/50 transition-colors group cursor-pointer">
                                            <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                            {preview ? (
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center text-[var(--text-muted)] group-hover:text-purple-500">
                                                    <ImageIcon size={24} />
                                                    <span className="text-[10px] font-black uppercase mt-2">Upload</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-[var(--border)] space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Advanced_SEO</h3>
                                        <div className="space-y-2">
                                            <InputLabel value="Meta Title" />
                                            <TextInput value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} className="bg-[var(--bg-elevated)]" placeholder="SEO Title..." />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel value="Meta Description" />
                                            <textarea value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-3 text-xs focus:border-purple-500 outline-none text-[var(--text-main)] h-20 resize-none" placeholder="SEO Description..." />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel value="Keywords" />
                                            <TextInput value={data.meta_keywords} onChange={e => setData('meta_keywords', e.target.value)} className="bg-[var(--bg-elevated)]" placeholder="comma, separated, tags" />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel value="Canonical URL" />
                                            <TextInput value={data.canonical_url} onChange={e => setData('canonical_url', e.target.value)} className="bg-[var(--bg-elevated)]" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel value="OG Image (Social)" />
                                            <div className="relative aspect-[1.91/1] bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--border)] rounded-xl flex items-center justify-center overflow-hidden hover:border-purple-500/50 transition-colors group cursor-pointer">
                                                <input type="file" onChange={handleOgImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                                {ogPreview ? (
                                                    <img src={ogPreview} alt="OG Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center text-[var(--text-muted)] group-hover:text-purple-500">
                                                        <ImageIcon size={24} />
                                                        <span className="text-[10px] font-black uppercase mt-2">Upload Social Card</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <PrimaryButton className="w-full justify-center py-3 bg-purple-500 hover:bg-purple-600 border-purple-500" disabled={processing}>
                                        <Save size={16} className="mr-2" /> Save_Blog
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
