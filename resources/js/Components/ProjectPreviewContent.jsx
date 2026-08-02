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
import { Zap } from 'lucide-react';

const ProjectPreviewContent = ({ project }) => {
    const [compiled, setCompiled] = useState({ css: '', js: '' });
    const [isCompiling, setIsCompiling] = useState(true);

    useEffect(() => {
        const compile = async () => {
            let cCss = project.code?.css || '';
            let cJs = project.code?.js || '';
            const preps = project.settings?.preprocessors || { css: 'css', js: 'js' };

            try {
                if ((preps.css === 'scss' || preps.css === 'sass') && window.Sass) {
                    window.Sass.compile(cCss, (result) => {
                        setCompiled(prev => ({ ...prev, css: result.text || cCss }));
                    });
                } else {
                    setCompiled(prev => ({ ...prev, css: cCss }));
                }

                if ((preps.js === 'babel' || preps.js === 'typescript') && window.Babel) {
                    const result = window.Babel.transform(cJs, { presets: ['env', 'react', 'typescript'] }).code;
                    setCompiled(prev => ({ ...prev, js: result }));
                } else {
                    setCompiled(prev => ({ ...prev, js: cJs }));
                }
            } catch (e) {
                console.error("Preview_Sync_Error");
            } finally {
                setIsCompiling(false);
            }
        };
        compile();
    }, [project]);

    const libs = (project.settings?.externalLibraries || []).map(lib => lib.endsWith('.css') ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"></script>`).join('\n');
    const srcDoc = `<!DOCTYPE html><html><head><style>body { margin: 0; overflow: hidden; background: white; font-family: sans-serif; } ${compiled.css}</style>${libs}</head><body>${project.code?.html || ''}<script>${compiled.js}</script></body></html>`;

    if (project.settings?.thumbnail_url) {
        return (
            <div className="w-full h-full relative group">
                <img 
                    src={project.settings.thumbnail_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="p-3 bg-cyan-500 text-black rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform"><Zap size={20} fill="currentColor" /></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative group">
            {!isCompiling ? (
                <iframe srcDoc={srcDoc} className="w-full h-full border-none pointer-events-none scale-75 origin-top-left" style={{ width: '133.33%', height: '133.33%' }} sandbox="allow-scripts" title={`preview-${project.id}`} />
            ) : (
                <div className="w-full h-full bg-[var(--bg-main)] animate-pulse flex items-center justify-center text-[10px] font-black uppercase text-[var(--text-muted)]">Syncing_Node...</div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="p-3 bg-cyan-500 text-black rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform"><Zap size={20} fill="currentColor" /></div>
            </div>
            <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[8px] font-black text-white uppercase tracking-widest">Live Preview</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectPreviewContent;
