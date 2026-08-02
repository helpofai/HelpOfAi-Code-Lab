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

import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Bold, Italic, Link, Image, List, Code, Quote, Eye, EyeOff } from 'lucide-react';

const parseMarkdown = (text) => {
    if (!text) return '';
    let html = text
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2 text-purple-400">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-purple-500 border-b border-white/10 pb-2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black mt-8 mb-4 text-white uppercase tracking-tight">$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong class="text-white">$1</strong>')
        .replace(/\*(.*)\*/gim, '<em class="text-slate-300">$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' class='rounded-xl border border-white/10 my-4 max-h-96 w-auto' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' class='text-purple-400 hover:underline'>$1</a>")
        .replace(/`([^`]+)`/gim, '<code class="bg-black/30 border border-white/10 rounded px-1.5 py-0.5 text-xs font-mono text-purple-300">$1</code>')
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 italic text-slate-400 my-4">$1</blockquote>')
        .replace(/\n/gim, '<br />');
    
    return html;
};

export default function MarkdownEditor({ value, onChange }) {
    const [showPreview, setShowPreview] = useState(true);
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const insertText = (template) => {
        if (!editorRef.current) return;
        const editor = editorRef.current;
        const selection = editor.getSelection();
        const text = editor.getModel().getValueInRange(selection);
        const newText = template.replace('$1', text || 'text');
        
        const op = { range: selection, text: newText, forceMoveMarkers: true };
        editor.executeEdits("my-source", [op]);
    };

    return (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-surface)] flex flex-col h-[600px]">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => insertText('**$1**')} className="p-2 hover:bg-[var(--bg-main)] rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><Bold size={14} /></button>
                    <button type="button" onClick={() => insertText('*$1*')} className="p-2 hover:bg-[var(--bg-main)] rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><Italic size={14} /></button>
                    <div className="w-px h-4 bg-[var(--border)] mx-1" />
                    <button type="button" onClick={() => insertText('[$1](url)')} className="p-2 hover:bg-[var(--bg-main)] rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><Link size={14} /></button>
                    <button type="button" onClick={() => insertText('![$1](url)')} className="p-2 hover:bg-[var(--bg-main)] rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><Image size={14} /></button>
                    <div className="w-px h-4 bg-[var(--border)] mx-1" />
                    <button type="button" onClick={() => insertText('\n- $1')} className="p-2 hover:bg-[var(--bg-main)] rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><List size={14} /></button>
                    <button type="button" onClick={() => insertText('`$1`')} className="p-2 hover:bg-[var(--bg-main)] rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><Code size={14} /></button>
                    <button type="button" onClick={() => insertText('> $1')} className="p-2 hover:bg-[var(--bg-main)] rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><Quote size={14} /></button>
                </div>
                <button type="button" onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${showPreview ? 'bg-purple-500 text-white' : 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border)]'}`}>
                    {showPreview ? <Eye size={12} /> : <EyeOff size={12} />} Preview
                </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                <div className={`${showPreview ? 'w-1/2 border-r border-[var(--border)]' : 'w-full'} h-full relative`}>
                    <Editor
                        height="100%"
                        defaultLanguage="markdown"
                        value={value}
                        onChange={onChange}
                        onMount={handleEditorDidMount}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            wordWrap: 'on',
                            lineNumbers: 'off',
                            padding: { top: 16, bottom: 16 },
                            scrollBeyondLastLine: false,
                            fontFamily: 'JetBrains Mono, monospace',
                            renderLineHighlight: 'none',
                            hideCursorInOverviewRuler: true,
                            overviewRulerBorder: false,
                        }}
                    />
                </div>
                
                {showPreview && (
                    <div className="w-1/2 h-full overflow-y-auto p-6 bg-[var(--bg-main)] custom-scrollbar">
                        <div 
                            className="prose prose-invert prose-sm max-w-none text-[var(--text-muted)]"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
