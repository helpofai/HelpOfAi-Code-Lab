import React, { useRef, useEffect, useMemo } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

const EditorLoader = () => <div className="h-full w-full bg-[#1e1e1e]" />;

export default function MonacoWrapper({ language, value, onChange, fontSize, wordWrap, onCursorChange }) {
    
    const handleEditorDidMount = (editor, monaco) => {
        if (onCursorChange) {
            editor.onDidChangeCursorPosition((e) => {
                onCursorChange({
                    line: e.position.lineNumber,
                    column: e.position.column
                });
            });
        }
    };

    const options = useMemo(() => ({
        minimap: { enabled: false },
        fontSize: fontSize || 14,
        wordWrap: wordWrap || 'on',
        automaticLayout: true,
        padding: { top: 10 },
        scrollBeyondLastLine: false,
        fixedOverflowWidgets: true,
        fontFamily: 'Consolas, "Courier New", monospace',
        renderLineHighlight: 'none',
        contextmenu: false,
    }), [fontSize, wordWrap]);

    return (
        <Editor
            height="100%"
            theme="vs-dark"
            path={language} // Critical for unique model identification
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