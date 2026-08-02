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

import React, { useRef, useEffect, useMemo } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import useProjectStore from '@/Stores/useProjectStore';

const EditorLoader = () => <div className="h-full w-full bg-[#050505] flex items-center justify-center font-mono text-[10px] text-cyan-500 uppercase tracking-[0.3em]">Loading...</div>;

export default function MonacoWrapper({ language, value, onChange, fontSize, wordWrap, externalLibraries = [] }) {
    const { theme, minimap } = useProjectStore();
    const monaco = useMonaco();
    const editorRef = useRef(null);

    // Theme Definitions
    useEffect(() => {
        if (!monaco) return;

        monaco.editor.defineTheme('dracula', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6272a4' },
                { token: 'keyword', foreground: 'ff79c6' },
                { token: 'identifier', foreground: '50fa7b' },
                { token: 'string', foreground: 'f1fa8c' },
                { token: 'type', foreground: '8be9fd' },
            ],
            colors: {
                'editor.background': '#282a36',
                'editor.foreground': '#f8f8f2',
                'editor.lineHighlightBackground': '#44475a',
                'editorCursor.foreground': '#f8f8f0',
                'editorWhitespace.foreground': '#3b3a32',
                'editorIndentGuide.activeBackground': '#939393',
                'editor.selectionBackground': '#44475a',
            }
        });
    }, [monaco]);

    // Advanced Feature: Emmet & Auto-Typings
    useEffect(() => {
        if (!monaco) return;

        // 1. Load Emmet via CDN with Error Handling
        if (!window.emmetMonaco) {
            const script = document.createElement('script');
            script.src = "https://unpkg.com/emmet-monaco-es/dist/emmet-monaco.min.js";
            script.onload = () => {
                if (window.emmetMonaco) {
                    window.emmetMonaco.emmetHTML(monaco);
                    window.emmetMonaco.emmetCSS(monaco);
                }
            };
            script.onerror = () => {
                console.warn("Error: Emmet Module Offline.");
            };
            document.head.appendChild(script);
        } else {
            window.emmetMonaco.emmetHTML(monaco);
            window.emmetMonaco.emmetCSS(monaco);
        }

        // 2. Auto-Typings
        const loadTypings = async (libUrl) => {
            try {
                const match = libUrl.match(/npm\/([^@/]+)/) || libUrl.match(/unpkg\.com\/([^@/]+)/);
                if (!match) return;
                
                const pkgName = match[1];
                const typeUrl = `https://unpkg.com/@types/${pkgName}/index.d.ts`;
                
                const res = await fetch(typeUrl);
                if (res.ok) {
                    const content = await res.text();
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(
                        content, 
                        `file:///node_modules/@types/${pkgName}/index.d.ts`
                    );
                }
            } catch (e) {}
        };

        if (language === 'js') {
            externalLibraries.forEach(loadTypings);
        }

    }, [monaco, language, externalLibraries]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Drag and Drop URL Support
        const domNode = editor.getDomNode();
        if (domNode) {
            domNode.addEventListener('drop', (e) => {
                e.preventDefault();
                const url = e.dataTransfer.getData('text/plain');
                if (url && (url.startsWith('http') || url.startsWith('/storage'))) {
                    const selection = editor.getSelection();
                    const range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
                    const op = { range: range, text: url, forceMoveMarkers: true };
                    editor.executeEdits("my-source", [op]);
                }
            });
        }

        // Defaults
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            allowNonTsExtensions: true,
            checkJs: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
        });
    };

    const options = useMemo(() => ({
        minimap: { enabled: minimap },
        fontSize: fontSize || 14,
        wordWrap: wordWrap || 'on',
        automaticLayout: true,
        padding: { top: 10 },
        scrollBeyondLastLine: false,
        fixedOverflowWidgets: true,
        fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace',
        renderLineHighlight: 'all',
        lineNumbers: 'on',
        roundedSelection: true,
        scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
        },
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: "on",
        mouseWheelZoom: true,
        smoothScrolling: true,
        contextmenu: true,
    }), [fontSize, wordWrap, minimap]);

    return (
        <Editor
            height="100%"
            theme={theme}
            path={language === 'js' ? 'main.js' : `index.${language}`}
            defaultLanguage={language === 'js' ? 'javascript' : language}
            value={value}
            onChange={onChange}
            onMount={handleEditorDidMount}
            options={options}
            loading={<EditorLoader />}
            keepCurrentModel={true}
        />
    );
}
