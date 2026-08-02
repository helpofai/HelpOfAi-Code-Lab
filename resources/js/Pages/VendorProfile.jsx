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

import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, MapPin, Calendar, Github, Twitter, Globe, ArrowRight, Code, Star, Box } from 'lucide-react';
import ProjectPreviewContent from '@/Components/ProjectPreviewContent';

export default function VendorProfile({ vendor, projects }) {
    return (
        <PublicLayout>
            <Head>
                <title>{`${vendor.name} - Profile`}</title>
                <meta name="description" content={vendor.bio || `View ${vendor.name}'s profile and premium projects.`} />
                <meta property="og:title" content={`${vendor.name} on Marketplace`} />
                <meta property="og:description" content={vendor.bio || `View ${vendor.name}'s profile and premium projects.`} />
                <meta property="og:image" content={vendor.avatar || ''} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfilePage",
                        "mainEntity": {
                            "@type": "Person",
                            "name": vendor.name,
                            "identifier": vendor.username,
                            "description": vendor.bio,
                            "image": vendor.avatar
                        }
                    })}
                </script>
            </Head>
            
            {/* Header/Cover Section */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-[var(--bg-main)]">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="shrink-0 relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-[var(--bg-main)] shadow-2xl relative z-10 bg-[var(--bg-surface)] flex items-center justify-center">
                                {vendor.avatar ? (
                                    <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-5xl font-black uppercase">
                                        {vendor.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {/* Pro Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-[var(--bg-main)] p-1 rounded-xl z-20 shadow-xl">
                                <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 px-3 py-1 rounded-lg flex items-center gap-1">
                                    <ShieldCheck size={14} className="text-white" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
                            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight mb-2">
                                {vendor.name}
                            </h1>
                            <p className="text-cyan-500 font-mono text-sm mb-6 flex items-center justify-center md:justify-start gap-2">
                                @{vendor.username || vendor.name.toLowerCase().replace(/\s+/g, '')}
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            </p>
                            
                            <p className="text-[var(--text-muted)] text-lg max-w-2xl leading-relaxed mb-8">
                                {vendor.bio || "Full-stack developer building premium tools, templates, and systems. Specialized in React, Laravel, and advanced UI/UX architecture."}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
                                <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium">
                                    <Box size={16} className="text-cyan-500" />
                                    <span><strong className="text-[var(--text-main)] font-black">{projects.length}</strong> Products</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium">
                                    <Calendar size={16} className="text-emerald-500" />
                                    <span>Joined <strong className="text-[var(--text-main)]">{vendor.created_at}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="bg-[var(--bg-surface)] py-20 border-t border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Products by {vendor.name}</h2>
                            <p className="text-[var(--text-muted)] mt-2">Premium source code, templates, and tools.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.length > 0 ? projects.map(project => (
                            <div key={project.id} className="group flex flex-col bg-[var(--bg-main)] border border-[var(--border)] rounded-3xl overflow-hidden hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300">
                                {/* Preview Card */}
                                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-main)] border-b border-[var(--border)]">
                                    <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]"></div>
                                    </div>
                                    
                                    <div className="absolute inset-0 p-4">
                                        <div className="w-full h-full rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500 ease-out">
                                            {project.project_type === 'monaco' ? (
                                                <ProjectPreviewContent project={project} />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[var(--bg-main)]">
                                                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                                                        <Github size={32} />
                                                    </div>
                                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono">GitHub_Repository</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="px-2 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                            {project.project_type === 'monaco' ? 'Code Editor' : 'Repository'}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-[var(--text-main)] mb-2 group-hover:text-cyan-500 transition-colors">
                                        <Link href={`/project/${project.slug}`}>
                                            {project.title}
                                        </Link>
                                    </h3>
                                    
                                    <p className="text-[var(--text-muted)] text-sm line-clamp-2 mb-6 flex-1">
                                        {project.description || "Premium software package with full source code access."}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                                        <div className="font-mono">
                                            <span className="text-lg font-black text-[var(--text-main)]">${project.price}</span>
                                        </div>
                                        <Link 
                                            href={`/project/${project.slug}`}
                                            className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-main)] group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-white transition-all shadow-sm"
                                        >
                                            <ArrowRight size={18} className="transform group-hover:-rotate-45 transition-transform duration-300" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-[var(--bg-main)] rounded-3xl border border-dashed border-[var(--border)]">
                                <Box size={48} className="mx-auto text-[var(--border)] mb-4" />
                                <p className="text-lg font-medium text-[var(--text-muted)]">This user hasn't published any projects yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
