import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Zap, Cpu, Bold, Italic, Strikethrough, Heading1, Heading2, List, Image as Image$1, Code, Undo, Redo } from "lucide-react";
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const addImage = () => {
    const url = window.prompt("IMAGE_PROTOCOL_LINK:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };
  const items = [
    { icon: Bold, title: "Bold", action: () => editor.chain().focus().toggleBold().run(), active: "bold" },
    { icon: Italic, title: "Italic", action: () => editor.chain().focus().toggleItalic().run(), active: "italic" },
    { icon: Strikethrough, title: "Strike", action: () => editor.chain().focus().toggleStrike().run(), active: "strike" },
    { icon: Heading1, title: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: "heading", options: { level: 1 } },
    { icon: Heading2, title: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: "heading", options: { level: 2 } },
    { icon: List, title: "Bullet List", action: () => editor.chain().focus().toggleBulletList().run(), active: "bulletList" },
    { icon: Image$1, title: "Image", action: addImage, active: "image" },
    { icon: Code, title: "Code Block", action: () => editor.chain().focus().toggleCodeBlock().run(), active: "codeBlock" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1 p-2 bg-[var(--bg-main)] border-b border-[var(--border)] rounded-t-2xl", children: [
    items.map((item, index) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: item.action,
        className: `p-2 rounded-lg transition-all ${editor.isActive(item.active, item.options || {}) ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"}`,
        title: item.title,
        children: /* @__PURE__ */ jsx(item.icon, { size: 14, strokeWidth: 2.5 })
      },
      index
    )),
    /* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-[var(--border)] mx-1" }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => editor.chain().focus().undo().run(), className: "p-2 text-[var(--text-muted)] hover:text-white transition-colors", children: /* @__PURE__ */ jsx(Undo, { size: 14 }) }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => editor.chain().focus().redo().run(), className: "p-2 text-[var(--text-muted)] hover:text-white transition-colors", children: /* @__PURE__ */ jsx(Redo, { size: 14 }) })
  ] });
};
const ManualBubbleMenu = ({ editor }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, visible: false });
  useEffect(() => {
    const update = () => {
      const { selection } = editor.state;
      const { empty } = selection;
      if (empty) {
        setPosition((prev) => ({ ...prev, visible: false }));
        return;
      }
      const { view } = editor;
      const { from, to } = selection;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      const left = (start.left + end.left) / 2;
      const top = start.top - 10;
      setPosition({
        top: top - 45,
        // Menu height adjustment
        left,
        visible: true
      });
    };
    editor.on("selectionUpdate", update);
    editor.on("focus", update);
    editor.on("blur", () => setTimeout(() => setPosition((prev) => ({ ...prev, visible: false })), 200));
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("focus", update);
    };
  }, [editor]);
  if (!position.visible) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed z-[9999] flex items-center gap-0.5 p-1 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -translate-x-1/2 animate-in zoom-in-95 fade-in duration-150",
      style: { top: `${position.top}px`, left: `${position.left}px` },
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => editor.chain().focus().toggleBold().run(),
            className: `p-2 rounded-lg transition-all ${editor.isActive("bold") ? "text-cyan-500 bg-cyan-500/10" : "text-slate-400 hover:text-white"}`,
            children: /* @__PURE__ */ jsx(Bold, { size: 14, strokeWidth: 3 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => editor.chain().focus().toggleItalic().run(),
            className: `p-2 rounded-lg transition-all ${editor.isActive("italic") ? "text-cyan-500 bg-cyan-500/10" : "text-slate-400 hover:text-white"}`,
            children: /* @__PURE__ */ jsx(Italic, { size: 14, strokeWidth: 3 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => editor.chain().focus().toggleCode().run(),
            className: `p-2 rounded-lg transition-all ${editor.isActive("code") ? "text-cyan-500 bg-cyan-500/10" : "text-slate-400 hover:text-white"}`,
            children: /* @__PURE__ */ jsx(Code, { size: 14, strokeWidth: 3 })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-white/10 mx-1" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            className: `p-2 rounded-lg transition-all ${editor.isActive("heading", { level: 1 }) ? "text-cyan-500 bg-cyan-500/10" : "text-slate-400 hover:text-white"}`,
            children: /* @__PURE__ */ jsx(Heading1, { size: 14, strokeWidth: 3 })
          }
        )
      ]
    }
  );
};
function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-cyan-500 underline decoration-cyan-500/30 font-bold"
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-2xl border border-[var(--border)] shadow-2xl max-w-full my-8 mx-auto block"
        }
      })
    ],
    content,
    onUpdate: ({ editor: editor2 }) => {
      onChange(editor2.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-cyan max-w-none focus:outline-none p-10 min-h-[500px] text-base leading-relaxed selection:bg-cyan-500/30"
      }
    }
  });
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden focus-within:border-cyan-500/30 transition-all shadow-2xl relative group", children: [
    /* @__PURE__ */ jsx(MenuBar, { editor }),
    editor && /* @__PURE__ */ jsx(ManualBubbleMenu, { editor }),
    /* @__PURE__ */ jsx("div", { className: "custom-scrollbar overflow-y-auto bg-black/10", children: /* @__PURE__ */ jsx(EditorContent, { editor }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-3 bg-[var(--bg-main)] border-t border-[var(--border)] flex justify-between items-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: "Editor Active" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-[var(--border)]" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: [
          /* @__PURE__ */ jsx(Zap, { size: 10, className: "text-cyan-500/40" }),
          " Handshake: 0.04ms"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] italic opacity-40 group-hover:opacity-100 transition-opacity", children: "HOACodeLab // Technical_Substrate" }),
        /* @__PURE__ */ jsx(Cpu, { size: 12, className: "text-cyan-500/20" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent w-full" })
    ] })
  ] });
}
export {
  TiptapEditor as T
};
