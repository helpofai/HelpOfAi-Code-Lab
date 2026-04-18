import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Save, ArrowLeft, Globe, Shield, Zap, Info } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TiptapEditor from '@/Components/Editor/TiptapEditor';

export default function CreateEdit({ page = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: page?.title || '',
        slug: page?.slug || '',
        content: page?.content || '',
        meta_title: page?.meta_title || '',
        meta_description: page?.meta_description || '',
        meta_keywords: page?.meta_keywords || '',
        is_published: page ? page.is_published : true,
    });

    const isEdit = !!page;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.pages.update', page.id));
        } else {
            post(route('admin.pages.store'));
        }
    };

    // Auto-slugify
    useEffect(() => {
        if (!isEdit && data.title) {
            setData('slug', data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
        }
    }, [data.title]);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-4">
                            <Link href={route('admin.pages.index')} className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-white transition-all">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="text-left">
                                <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">{isEdit ? 'Update_Protocol' : 'Initialize_Node'}</h2>
                                <p className="text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1">{isEdit ? page.title : 'New Substrate Module'}</p>
                            </div>
                        </div>
                    </div>
                }
            >
                <Head title={isEdit ? 'Edit Page' : 'New Page'} />
                <div className="relative min-h-full p-6 md:p-12 overflow-y-auto text-left">
                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                        
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-6">
                                <div className="space-y-2">
                                    <InputLabel value="Node_Identity (Title)" />
                                    <TextInput 
                                        value={data.title} 
                                        onChange={e => setData('title', e.target.value)} 
                                        className="w-full bg-[var(--bg-elevated)] font-bold text-lg" 
                                        placeholder="e.g. Privacy Protocol" 
                                    />
                                    {errors.title && <p className="text-rose-500 text-[10px] font-black uppercase">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <InputLabel value="Signal_Path (Slug)" />
                                    <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-1">
                                        <span className="text-[var(--text-muted)] font-mono text-xs">/</span>
                                        <input 
                                            value={data.slug} 
                                            onChange={e => setData('slug', e.target.value)} 
                                            className="bg-transparent border-none p-2 text-cyan-500 font-mono text-xs focus:ring-0 w-full"
                                            placeholder="privacy-protocol"
                                        />
                                    </div>
                                    {errors.slug && <p className="text-rose-500 text-[10px] font-black uppercase">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <InputLabel value="Data_Buffer (Content)" />
                                        <span className="text-[8px] font-black text-cyan-500/50 uppercase tracking-widest italic">WYSIWYG Rich Text</span>
                                    </div>
                                    <TiptapEditor 
                                        content={data.content} 
                                        onChange={content => setData('content', content)} 
                                    />
                                    {errors.content && <p className="text-rose-500 text-[10px] font-black uppercase">{errors.content}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* SEO Panel */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 flex items-center gap-2 italic">
                                    <Globe size={14} /> Search_Discovery
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <InputLabel value="Meta_Title" />
                                        <TextInput value={data.meta_title} onChange={e => setData('meta_title', e.target.value)} className="w-full bg-[var(--bg-elevated)] text-[10px]" />
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Meta_Description" />
                                        <textarea value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} className="w-full h-24 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-[10px] focus:ring-0 resize-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel value="Keywords" />
                                        <TextInput value={data.meta_keywords} onChange={e => setData('meta_keywords', e.target.value)} className="w-full bg-[var(--bg-elevated)] text-[10px]" />
                                    </div>
                                </div>
                            </div>

                            {/* Status Panel */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] flex items-center gap-2 italic">
                                    <Zap size={14} /> Protocol_Status
                                </h3>
                                
                                <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Public Link</span>
                                    <button 
                                        type="button"
                                        onClick={() => setData('is_published', !data.is_published)}
                                        className={`relative w-10 h-5 rounded-full transition-colors ${data.is_published ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${data.is_published ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <PrimaryButton disabled={processing} className="w-full py-4 bg-cyan-500 text-black border-cyan-500 hover:bg-white transition-all shadow-xl shadow-cyan-500/10">
                                    <Save size={16} className="mr-2" /> Commit_Protocol
                                </PrimaryButton>
                            </div>
                        </div>

                    </form>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
