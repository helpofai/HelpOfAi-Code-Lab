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

import React, { useMemo, useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Tag, Users, ShoppingBag, ArrowLeft, ExternalLink, Package, Play } from 'lucide-react';

const MiniPreview = ({ project }) => {
    const { code, title, settings } = project;
    
    const srcDoc = useMemo(() => {
        if (!code) return '';
        const html = typeof code === 'object' ? code.html : '';
        const css = typeof code === 'object' ? code.css : '';
        const js = typeof code === 'object' ? code.js : '';

        const externalLibs = settings?.externalLibraries || [];
        const libs = externalLibs.map(lib => 
            lib.endsWith('.css') 
                ? `<link rel="stylesheet" href="${lib}">` 
                : `<script src="${lib}"></script>`
        ).join('\n');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    body { background: white; margin: 0; padding: 0; overflow: hidden; height: 100vh; }
                    .scaled-content { 
                        transform: scale(0.5); 
                        transform-origin: top left; 
                        width: 200%; 
                        height: 200%; 
                    }
                    ${css || ''}
                </style>
                ${libs}
            </head>
            <body><div class="scaled-content">${html || ''}</div><script>${js || ''}</script></body>
            </html>
        `;
    }, [code, settings]);

    if (!code) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-main)] opacity-20">
                <Package size={40} />
            </div>
        );
    }

    return (
        <iframe 
            srcDoc={srcDoc}
            className="w-full h-full border-none bg-white pointer-events-none"
            sandbox="allow-scripts"
            title={title}
            loading="lazy"
        />
    );
};

export default function PaidProjects({ auth, projects }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic">Paid_Projects_Catalog</h2>}
        >
            <Head title="Paid Projects" />

            <div className="py-12 px-10 space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500"><Tag size={20} /></div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic">Marketplace Assets</h3>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest">Active monetization nodes</p>
                        </div>
                    </div>
                    <Link href={route('admin.sales.index')} className="px-6 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all flex items-center gap-2">
                        <ArrowLeft size={14} /> Back to Sales
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.data.map((project) => (
                        <div key={project.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm hover:border-cyan-500/30 transition-all group flex flex-col">
                            <div className="aspect-video bg-[var(--bg-main)] relative overflow-hidden flex items-center justify-center border-b border-[var(--border)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-10 transition-opacity z-10 pointer-events-none" />
                                
                                <MiniPreview project={project} />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                    <Link href={route('editor', project.slug)} className="p-3 bg-cyan-500 text-black rounded-full shadow-xl hover:scale-110 transition-transform">
                                        <Play size={20} fill="black" />
                                    </Link>
                                </div>

                                <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30">
                                    ${project.price}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col space-y-6">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic truncate">{project.title}</h4>
                                        <Link href={route('editor', project.slug)} target="_blank" className="text-[var(--text-muted)] hover:text-cyan-500 transition-colors">
                                            <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                    <p className="text-[9px] text-[var(--text-muted)] font-bold mt-1">Owned by @{project.user?.name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--border)]">
                                    <div className="space-y-1">
                                        <div className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest flex items-center gap-1.5">
                                            <ShoppingBag size={10} className="text-cyan-500" /> Total Sales
                                        </div>
                                        <div className="text-sm font-black text-[var(--text-main)] font-mono">{project.purchases_count}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest flex items-center gap-1.5">
                                            <Tag size={10} className="text-emerald-500" /> Revenue
                                        </div>
                                        <div className="text-sm font-black text-emerald-500 font-mono">${(project.purchases_count * project.price).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {projects.links.length > 3 && (
                    <div className="flex justify-center gap-2 pt-10">
                        {projects.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    link.active 
                                    ? 'bg-cyan-500 border-cyan-500 text-black shadow-lg' 
                                    : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                                } ${!link.url && 'opacity-30 pointer-events-none'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
