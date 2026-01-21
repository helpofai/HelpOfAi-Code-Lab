import React, { useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

import { 
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3, 
    List, ListOrdered, CheckSquare,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Quote, Code, Link as LinkIcon, Image as ImageIcon,
    Undo, Redo, Minus, Eraser, WrapText,
    Terminal, Info, FileEdit, Cpu, Zap
} from 'lucide-react';

const lowlight = createLowlight(common);

const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
    <button 
        type="button"
        onClick={onClick} 
        disabled={disabled} 
        title={title}
        className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
            isActive 
            ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] scale-105' 
            : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-purple-400'
        } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

const SectionDivider = () => <div className="w-px h-6 bg-[var(--border)] mx-2 opacity-50" />;

const MenuBar = ({ editor }) => {
    if (!editor) return null;
    const fileInputRef = React.useRef(null);

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL_ENDPOINT', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            editor.chain().focus().setImage({ src: res.data.url }).run();
        } catch (err) {
            alert("Upload failed. Verify connection.");
        }
    };

    const addImage = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-wrap items-center p-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
            <div className="flex items-center group">
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} title="Revert Changes"><Undo size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} title="Apply Redo"><Redo size={16} /></ToolbarButton>
            </div>
            
            <SectionDivider />

            <div className="flex items-center">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Strong_Text"><Bold size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Emphasis_Text"><Italic size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline_Link"><UnderlineIcon size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Redact_Text"><Strikethrough size={16} /></ToolbarButton>
            </div>

            <SectionDivider />

            <div className="flex items-center">
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Header_Primary"><Heading1 size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Header_Secondary"><Heading2 size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Header_Tertiary"><Heading3 size={16} /></ToolbarButton>
            </div>

            <SectionDivider />

            <div className="flex items-center">
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align_Start"><AlignLeft size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align_Center"><AlignCenter size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align_End"><AlignRight size={16} /></ToolbarButton>
            </div>

            <SectionDivider />

            <div className="flex items-center">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Unordered_Stack"><List size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Index_Stack"><ListOrdered size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task_Protocol"><CheckSquare size={16} /></ToolbarButton>
            </div>
            
            <SectionDivider />

            <div className="flex items-center">
                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Inject_Hyperlink"><LinkIcon size={16} /></ToolbarButton>
                <ToolbarButton onClick={addImage} title="Inject_Media"><ImageIcon size={16} /></ToolbarButton>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Cite_Source"><Quote size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Initialize_Code_Terminal"><Terminal size={16} /></ToolbarButton>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Reset_Buffer"><Eraser size={16} /></ToolbarButton>
            </div>
        </div>
    );
};

export default function TipTapEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Use advanced code block instead
            }),
            Underline,
            Typography,
            TaskList,
            TaskItem.configure({ nested: true }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: { class: 'rounded-xl bg-[#050505] border border-white/5 p-6 font-mono text-sm' }
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Image.configure({
                inline: true,
                HTMLAttributes: { class: 'rounded-2xl border border-[var(--border)] max-w-full h-auto my-8 shadow-2xl' },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-purple-500 font-bold underline decoration-purple-500/30 hover:decoration-purple-500 transition-all' },
            }),
            Placeholder.configure({
                placeholder: 'Begin transmission payload here...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[500px] p-10 text-[var(--text-main)] selection:bg-purple-500/30',
            },
        },
    });

    // Sync external value changes (e.g. initial load or reset)
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, false);
        }
    }, [value, editor]);

    const stats = useMemo(() => {
        if (!editor) return { words: 0, characters: 0, time: 0 };
        const text = editor.getText();
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const time = Math.ceil(words / 200); // Avg 200 wpm
        return { words, characters, time };
    }, [editor?.getText()]);

    return (
        <div className="border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--bg-surface)] flex flex-col shadow-2xl transition-all group focus-within:border-purple-500/50">
            <MenuBar editor={editor} />
            
            <div className="flex-1 bg-[var(--bg-main)] custom-scrollbar overflow-y-auto max-h-[700px] relative">
                <EditorContent editor={editor} />
                
                {/* Floating focus indicator */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        <Zap size={10} className="text-purple-500 animate-pulse" />
                        <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest">Focus_Active</span>
                    </div>
                </div>
            </div>

            {/* Advanced Status Bar */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <FileEdit size={12} className="text-purple-500" />
                        <span>Words: <span className="text-[var(--text-main)]">{stats.words}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Cpu size={12} className="text-cyan-500" />
                        <span>Buffer: <span className="text-[var(--text-main)]">{stats.characters} Chars</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Info size={12} className="text-amber-500" />
                        <span>Read_Time: <span className="text-[var(--text-main)]">{stats.time} Min</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-500">Sync_Verified</span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .tiptap ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }
                .tiptap ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .tiptap ul[data-type="taskList"] input[type="checkbox"] {
                    margin-top: 0.4rem;
                    cursor: pointer;
                    accent-color: #a855f7;
                }
                .tiptap .prose pre {
                    background: #050505;
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                }
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: var(--text-muted);
                    pointer-events: none;
                    height: 0;
                }
            `}} />
        </div>
    );
}
