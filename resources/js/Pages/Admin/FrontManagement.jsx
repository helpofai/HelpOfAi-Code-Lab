import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutTemplate, Save, CheckCircle, 
    Type, Globe, ToggleRight, ChevronDown, Layers, Activity, Network, Star, DollarSign
} from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';

const Section = ({ title, icon: Icon, children, defaultOpen = false, color = "indigo" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const colors = {
        indigo: "text-indigo-500 border-indigo-500/30",
        emerald: "text-emerald-500 border-emerald-500/30",
        cyan: "text-cyan-500 border-cyan-500/30",
        rose: "text-rose-500 border-rose-500/30",
        amber: "text-amber-500 border-amber-500/30",
        purple: "text-purple-500 border-purple-500/30",
        blue: "text-blue-500 border-blue-500/30",
    };

    const textColor = colors[color].split(" ")[0];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden"
        >
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 hover:bg-white/5 transition-colors"
            >
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60 flex items-center">
                    <Icon size={16} className={`mr-3 ${textColor}`} /> {title}
                </h3>
                <ChevronDown className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 pt-0 space-y-6 border-t border-white/5 mt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function FrontManagement({ settings }) {
    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        settings: settings
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.front-management.update'));
    };

    const handleSettingChange = (key, value) => {
        setData('settings', {
            ...data.settings,
            [key]: value
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-indigo-500/10 border border-indigo-400/30 rounded-lg">
                            <LayoutTemplate className="text-indigo-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-tight italic">Frontend_Core</h2>
                            <p className="text-[8px] text-indigo-500/60 uppercase tracking-[0.4em] font-bold">Public Interface Control</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Frontend Management" />
            
            <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                <AnimatedGrid />
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* SEO & METADATA */}
                        <Section title="SEO & Metadata" icon={Globe} color="blue">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Meta Title</label>
                                    <input 
                                        type="text" 
                                        value={data.settings.seo_meta_title || ''}
                                        onChange={(e) => handleSettingChange('seo_meta_title', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                                        placeholder="Page Title | Brand Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Meta Description</label>
                                    <textarea 
                                        value={data.settings.seo_meta_description || ''}
                                        onChange={(e) => handleSettingChange('seo_meta_description', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors font-medium h-24 resize-none"
                                        placeholder="Brief description of the page for search engines..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Keywords (Comma Separated)</label>
                                    <input 
                                        type="text" 
                                        value={data.settings.seo_meta_keywords || ''}
                                        onChange={(e) => handleSettingChange('seo_meta_keywords', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors font-medium"
                                        placeholder="html, css, javascript, online editor"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Social Share Image (OG:Image)</label>
                                    
                                    {data.settings.seo_og_image && (
                                        <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                            <img src={data.settings.seo_og_image} alt="OG Preview" className="h-32 w-auto object-contain rounded-lg" />
                                        </div>
                                    )}

                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('seo_og_image', e.target.files[0])}
                                        className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20"
                                    />
                                    {errors.seo_og_image && <div className="text-red-500 text-xs mt-1">{errors.seo_og_image}</div>}
                                </div>
                            </div>
                        </Section>

                        {/* BRANDING & IDENTITY */}
                        <Section title="Branding & Identity" icon={Globe} color="emerald">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Site Logo</label>
                                    
                                    {data.settings.site_logo && (
                                        <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                            <img src={data.settings.site_logo} alt="Current Logo" className="h-12 w-auto object-contain" />
                                        </div>
                                    )}

                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('site_logo', e.target.files[0])}
                                        className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                                    />
                                    {errors.site_logo && <div className="text-red-500 text-xs mt-1">{errors.site_logo}</div>}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Site Favicon</label>
                                    
                                    {data.settings.site_favicon && (
                                        <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                            <img src={data.settings.site_favicon} alt="Current Favicon" className="h-8 w-8 object-contain" />
                                        </div>
                                    )}

                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('site_favicon', e.target.files[0])}
                                        className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                                    />
                                    {errors.site_favicon && <div className="text-red-500 text-xs mt-1">{errors.site_favicon}</div>}
                                </div>
                            </div>
                        </Section>

                        {/* TYPOGRAPHY CONFIGURATION */}
                        <Section title="Typography_System" icon={Type} color="indigo">
                            <div className="space-y-8">
                                {/* Global Font Settings */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2">Global Settings</h4>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Font Family</label>
                                            <input 
                                                type="text" 
                                                value={data.settings.typography_font_family || ''}
                                                onChange={(e) => handleSettingChange('typography_font_family', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                                                placeholder="Inter, sans-serif"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Body Text Configuration */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2">Body Text Protocol</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Base Size</label>
                                            <input 
                                                type="text" 
                                                value={data.settings.typography_body_size || ''}
                                                onChange={(e) => handleSettingChange('typography_body_size', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                                                placeholder="1rem"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Line Height</label>
                                            <input 
                                                type="text" 
                                                value={data.settings.typography_line_height_body || ''}
                                                onChange={(e) => handleSettingChange('typography_line_height_body', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                                                placeholder="1.6"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Weight</label>
                                            <input 
                                                type="text" 
                                                value={data.settings.typography_font_weight_body || ''}
                                                onChange={(e) => handleSettingChange('typography_font_weight_body', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                                                placeholder="400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Headings Configuration */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2">Header Matrix</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                         <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Line Height</label>
                                            <input 
                                                type="text" 
                                                value={data.settings.typography_line_height_headings || ''}
                                                onChange={(e) => handleSettingChange('typography_line_height_headings', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                                                placeholder="1.2"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Letter Spacing</label>
                                            <input 
                                                type="text" 
                                                value={data.settings.typography_letter_spacing_headings || ''}
                                                onChange={(e) => handleSettingChange('typography_letter_spacing_headings', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                                                placeholder="-0.02em"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Transform</label>
                                             <select 
                                                value={data.settings.typography_transform_headings || 'none'}
                                                onChange={(e) => handleSettingChange('typography_transform_headings', e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium appearance-none"
                                            >
                                                <option value="none">None</option>
                                                <option value="uppercase">Uppercase</option>
                                                <option value="capitalize">Capitalize</option>
                                                <option value="lowercase">Lowercase</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                                        {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => (
                                            <div key={tag} className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{tag.toUpperCase()} Size</label>
                                                <input 
                                                    type="text" 
                                                    value={data.settings[`typography_${tag}_size`] || ''}
                                                    onChange={(e) => handleSettingChange(`typography_${tag}_size`, e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* HERO SECTION */}
                        <Section title="Hero_Configuration" icon={Type} color="indigo" defaultOpen={true}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Hero Title</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_hero_title || ''}
                                    onChange={(e) => handleSettingChange('home_hero_title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-bold tracking-tight"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Hero Subtitle</label>
                                <textarea 
                                    value={data.settings.home_hero_subtitle || ''}
                                    onChange={(e) => handleSettingChange('home_hero_subtitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium h-32 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">CTA Text</label>
                                    <input 
                                        type="text" 
                                        value={data.settings.home_hero_cta_text || ''}
                                        onChange={(e) => handleSettingChange('home_hero_cta_text', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">CTA Link</label>
                                    <input 
                                        type="text" 
                                        value={data.settings.home_hero_cta_link || ''}
                                        onChange={(e) => handleSettingChange('home_hero_cta_link', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* ANNOUNCEMENT BANNER */}
                        <Section title="Announcement_System" icon={ToggleRight} color="emerald">
                             <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                                <span className="text-sm font-bold text-white uppercase tracking-tight">Banner Active Status</span>
                                <button 
                                    type="button"
                                    onClick={() => handleSettingChange('announcement_banner_active', data.settings.announcement_banner_active === '1' ? '0' : '1')}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${data.settings.announcement_banner_active === '1' ? 'bg-emerald-500' : 'bg-white/20'}`}
                                >
                                    <span 
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${data.settings.announcement_banner_active === '1' ? 'translate-x-6' : 'translate-x-0'}`} 
                                    />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Banner Text</label>
                                <input 
                                    type="text" 
                                    value={data.settings.announcement_banner_text || ''}
                                    onChange={(e) => handleSettingChange('announcement_banner_text', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                                />
                            </div>
                        </Section>

                        {/* FEATURED PROJECTS */}
                        <Section title="Featured_Module_Feed" icon={Globe} color="cyan">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Section Title</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_featured_title || ''}
                                    onChange={(e) => handleSettingChange('home_featured_title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 transition-colors font-bold"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Section Subtitle</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_featured_subtitle || ''}
                                    onChange={(e) => handleSettingChange('home_featured_subtitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 transition-colors font-medium"
                                />
                            </div>
                        </Section>

                        {/* TECH STACK */}
                        <Section title="Tech_Stack_Modules" icon={Layers} color="amber">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500">Section Title</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_tech_title || ''}
                                    onChange={(e) => handleSettingChange('home_tech_title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-amber-500 transition-colors font-bold"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500">Section Subtitle</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_tech_subtitle || ''}
                                    onChange={(e) => handleSettingChange('home_tech_subtitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-amber-500 transition-colors font-medium"
                                />
                            </div>
                        </Section>

                         {/* DIAGNOSTICS */}
                         <Section title="Engine_Diagnostics" icon={Activity} color="rose">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Section Title</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_diagnostics_title || ''}
                                    onChange={(e) => handleSettingChange('home_diagnostics_title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-rose-500 transition-colors font-bold"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Primary Description</label>
                                <textarea 
                                    value={data.settings.home_diagnostics_desc || ''}
                                    onChange={(e) => handleSettingChange('home_diagnostics_desc', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-rose-500 transition-colors font-medium h-24 resize-none"
                                />
                            </div>
                        </Section>

                        {/* UPLINK */}
                         <Section title="Uplink_Sync" icon={Network} color="blue">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Section Title</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_uplink_title || ''}
                                    onChange={(e) => handleSettingChange('home_uplink_title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Section Subtitle</label>
                                <textarea 
                                    value={data.settings.home_uplink_subtitle || ''}
                                    onChange={(e) => handleSettingChange('home_uplink_subtitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors font-medium h-24 resize-none"
                                />
                            </div>
                        </Section>

                        {/* FEATURES */}
                        <Section title="Core_Interface_Modules" icon={Star} color="purple">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500">Section Title</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_features_title || ''}
                                    onChange={(e) => handleSettingChange('home_features_title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-colors font-bold"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500">Section Subtitle</label>
                                <textarea 
                                    value={data.settings.home_features_subtitle || ''}
                                    onChange={(e) => handleSettingChange('home_features_subtitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-colors font-medium h-24 resize-none"
                                />
                            </div>
                        </Section>

                        {/* PRICING */}
                        <Section title="Security_Clearance" icon={DollarSign} color="cyan">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Section Title</label>
                                <input 
                                    type="text" 
                                    value={data.settings.home_pricing_title || ''}
                                    onChange={(e) => handleSettingChange('home_pricing_title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 transition-colors font-bold"
                                />
                            </div>
                        </Section>

                        <div className="flex justify-end pt-8">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="group flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                            >
                                {recentlySuccessful ? (
                                    <>
                                        <CheckCircle className="mr-2" size={18} />
                                        System_Updated
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 group-hover:rotate-12 transition-transform" size={18} />
                                        Save_Configuration
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}