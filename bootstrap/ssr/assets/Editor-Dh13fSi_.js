import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { usePage, Link, Head } from "@inertiajs/react";
import axios from "axios";
import { A as AdUnit } from "./AdUnit-CJudqw2U.js";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { u as useProjectStore, M as MonacoWrapper } from "./MonacoWrapper-CBx8khtF.js";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import { AnimatePresence, motion } from "framer-motion";
import { Save, Wand2, FilePlus, GitFork, Terminal, PanelBottom, PanelRight, PanelTop, Share2, Download, Layers, Settings, Search, ArrowRight, Command, Code2, ChevronRight, Loader2, CloudUpload, Cloud, Lock, ShoppingBag, Sparkles, Package, RefreshCw, Users, FolderPlus, Code, Server, Shield, X, PlusCircle, Trash2, Activity, Unlock, Tag, CreditCard, GitCompare, Copy, Globe, ArrowLeft } from "lucide-react";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import "./useThemeStore-alQMI_Ky.js";
import { DiffEditor } from "@monaco-editor/react";
import "zustand";
import "zustand/middleware";
const useEditorActions = (projectData, setProjectData, setLogs) => {
  const { auth } = usePage().props;
  const {
    html,
    css,
    js,
    title,
    isPrivate,
    isForSale,
    price,
    externalLibraries,
    setHtml,
    setCss,
    setJs,
    google_drive_file_id,
    setGoogleDriveFileId,
    theme,
    preprocessors
  } = useProjectStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const formatCode = useCallback(() => {
    setIsFormatting(true);
    setLogs((prev) => [...prev, { type: "LOG", content: "Formatting code via Web Worker...", id: Date.now() }]);
    try {
      const worker = new Worker(new URL("../Workers/prettier.worker.js", import.meta.url), { type: "module" });
      worker.postMessage({
        html,
        css,
        js,
        options: { printWidth: 80, tabWidth: 2, useTabs: false, semi: true, singleQuote: false }
      });
      worker.onmessage = (e) => {
        if (e.data.success) {
          setHtml(e.data.formatted.html);
          setCss(e.data.formatted.css);
          setJs(e.data.formatted.js);
          setLogs((prev) => [...prev, { type: "LOG", content: "Neural Optimization Complete.", id: Date.now() }]);
        } else {
          setLogs((prev) => [...prev, { type: "ERR", content: `Format Error: ${e.data.error}`, id: Date.now() }]);
        }
        setIsFormatting(false);
        worker.terminate();
      };
      worker.onerror = (err) => {
        setLogs((prev) => [...prev, { type: "ERR", content: "Worker Thread Error.", id: Date.now() }]);
        setIsFormatting(false);
        worker.terminate();
      };
    } catch (err) {
      setLogs((prev) => [...prev, { type: "ERR", content: "Failed to spawn worker.", id: Date.now() }]);
      setIsFormatting(false);
    }
  }, [html, css, js, setHtml, setCss, setJs, setLogs]);
  const handleFork = useCallback(async () => {
    if (!projectData?.id) return alert("Initialize module before forking.");
    try {
      const data = {
        title: `${title} (Fork)`,
        code: { html, css, js },
        settings: { externalLibraries, theme, preprocessors },
        is_public: !isPrivate,
        is_private: isPrivate,
        is_for_sale: false,
        // Fork is always free by default
        price: 0
      };
      const res = await axios.post("/api/projects", data);
      window.location.href = `/editor/${res.data.slug}`;
    } catch (e) {
      setLogs((prev) => [...prev, { type: "ERR", content: "Fork operation failed.", id: Date.now() }]);
    }
  }, [projectData, title, html, css, js, externalLibraries, isPrivate, theme, preprocessors, setLogs]);
  const handleSave = useCallback(async () => {
    if (!auth.user) {
      if (confirm("Authentication required. Redirect to login?")) {
        window.location.href = route("login");
      }
      return;
    }
    const isOwner = !projectData || projectData.user_id === auth.user.id;
    if (!isOwner && projectData?.id) {
      return handleFork();
    }
    setIsSaving(true);
    try {
      const data = {
        title,
        code: { html, css, js },
        settings: { externalLibraries, theme, preprocessors },
        is_public: !isPrivate,
        is_private: isPrivate,
        is_for_sale: isForSale,
        price
      };
      const endpoint = projectData?.id ? `/api/projects/${projectData.id}` : "/api/projects";
      const method = projectData?.id ? "put" : "post";
      const res = await axios[method](endpoint, data);
      setProjectData(res.data);
      if (!projectData?.id) window.history.pushState({}, "", `/editor/${res.data.slug}`);
      setLogs((prev) => [...prev, { type: "LOG", content: "Cloud sync successful.", id: Date.now() }]);
    } catch (e) {
      setLogs((prev) => [...prev, { type: "ERR", content: "Sync failed. Verify connection.", id: Date.now() }]);
    } finally {
      setIsSaving(false);
    }
  }, [auth.user, projectData, title, html, css, js, externalLibraries, isPrivate, isForSale, price, theme, preprocessors, handleFork, setProjectData, setLogs]);
  const handleCloudSave = useCallback(async () => {
    if (!auth.user?.google_drive_token) return alert("Cloud Link Inactive. Connect via Cloud Sync page.");
    setIsSaving(true);
    setLogs((prev) => [...prev, { type: "LOG", content: "Initiating Cloud Uplink...", id: Date.now() }]);
    try {
      const res = await axios.post("/api/google-drive/save", {
        title,
        code: { html, css, js },
        settings: { externalLibraries, theme, preprocessors },
        drive_file_id: google_drive_file_id
      });
      if (res.data.id) {
        setGoogleDriveFileId(res.data.id);
        setLogs((prev) => [...prev, { type: "LOG", content: "Cloud Node Synced: " + res.data.id, id: Date.now() }]);
      }
    } catch (e) {
      setLogs((prev) => [...prev, { type: "ERR", content: "Cloud Uplink Failed.", id: Date.now() }]);
    } finally {
      setIsSaving(false);
    }
  }, [auth.user, title, html, css, js, google_drive_file_id, setGoogleDriveFileId, setLogs]);
  return {
    isSaving,
    isFormatting,
    formatCode,
    handleSave,
    handleFork,
    handleCloudSave
  };
};
function useHotkeys(hotkeys, deps = []) {
  const handler = useCallback((e) => {
    const key = e.key.toLowerCase();
    const mods = [];
    if (e.ctrlKey || e.metaKey) mods.push("ctrl");
    if (e.shiftKey) mods.push("shift");
    if (e.altKey) mods.push("alt");
    const combo = mods.length ? `${mods.join("+")}+${key}` : key;
    if (hotkeys[combo]) {
      e.preventDefault();
      e.stopPropagation();
      hotkeys[combo](e);
      return;
    }
    if (e.metaKey && !e.ctrlKey) {
      const metaCombo = `ctrl+${mods.filter((m) => m !== "ctrl").join("+")}+${key}`.replace(/^ctrl\+$/, "");
      if (hotkeys[metaCombo]) {
        e.preventDefault();
        e.stopPropagation();
        hotkeys[metaCombo](e);
      }
    }
  }, [hotkeys, ...deps]);
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
const COMMANDS = [
  { id: "save", label: "Save Project", icon: Save, shortcut: "Ctrl+S", action: "save" },
  { id: "format", label: "Format Code", icon: Wand2, shortcut: "Ctrl+Shift+F", action: "format" },
  { id: "new", label: "New Project", icon: FilePlus, shortcut: "Ctrl+N", action: "new" },
  { id: "fork", label: "Fork Project", icon: GitFork, shortcut: "Ctrl+Shift+D", action: "fork" },
  { id: "console", label: "Toggle Console", icon: Terminal, shortcut: "Ctrl+J", action: "console" },
  { id: "layout-bottom", label: "Layout: Bottom", icon: PanelBottom, shortcut: "", action: "layout-bottom" },
  { id: "layout-right", label: "Layout: Right", icon: PanelRight, shortcut: "", action: "layout-right" },
  { id: "layout-top", label: "Layout: Top", icon: PanelTop, shortcut: "", action: "layout-top" },
  { id: "share", label: "Share Project", icon: Share2, shortcut: "", action: "share" },
  { id: "export", label: "Export HTML", icon: Download, shortcut: "", action: "export" },
  { id: "sidebar", label: "Toggle Sidebar", icon: Layers, shortcut: "Ctrl+B", action: "sidebar" },
  { id: "settings", label: "Project Settings", icon: Settings, shortcut: "", action: "settings" }
];
function CommandPalette({ isOpen, onClose, onExecute }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.includes(q)
    );
  }, [query]);
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);
  const execute = (cmd) => {
    onExecute(cmd.action);
    onClose();
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      execute(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh]",
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95, y: -10 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: -10 },
            transition: { duration: 0.15 },
            className: "relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]", children: [
                /* @__PURE__ */ jsx(Search, { size: 16, className: "text-[var(--text-muted)] shrink-0" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: inputRef,
                    value: query,
                    onChange: (e) => setQuery(e.target.value),
                    onKeyDown: handleKeyDown,
                    placeholder: "Type a command...",
                    className: "flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                  }
                ),
                /* @__PURE__ */ jsx("kbd", { className: "text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded border border-[var(--border)]", children: "esc" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "max-h-64 overflow-y-auto p-1", children: filtered.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-8 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "No commands found" }) : filtered.map((cmd, i) => {
                const Icon = cmd.icon;
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => execute(cmd),
                    className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${i === selectedIndex ? "bg-cyan-500/10 text-cyan-400" : "text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"}`,
                    onMouseEnter: () => setSelectedIndex(i),
                    children: [
                      /* @__PURE__ */ jsx(Icon, { size: 16, className: "shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium flex-1", children: cmd.label }),
                      cmd.shortcut && /* @__PURE__ */ jsx("kbd", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: cmd.shortcut })
                    ]
                  },
                  cmd.id
                );
              }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-4 py-2 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(ArrowRight, { size: 10 }),
                  " select"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Command, { size: 10 }),
                  " execute"
                ] })
              ] })
            ]
          }
        )
      ]
    }
  ) });
}
function EditorHeader({ handleSave, handleCloudSave, isSaving, isOwner, formatCode, isFormatting, setActiveSidebar, setActiveModal }) {
  const { auth } = usePage().props;
  const { title, setTitle, layout, setLayout } = useProjectStore();
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  return /* @__PURE__ */ jsxs("header", { className: "h-16 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center px-4 shrink-0 relative z-50 transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 transition-all duration-300 ${isTitleExpanded ? "w-full" : "w-auto"}`, children: [
      /* @__PURE__ */ jsxs(Link, { href: "/dashboard", className: `flex items-center gap-2 group shrink-0 ${isTitleExpanded ? "hidden sm:flex" : "flex"}`, children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 border border-cyan-500/20 rounded", children: /* @__PURE__ */ jsx(Code2, { className: "text-cyan-400", size: 18 }) }),
        !isTitleExpanded && /* @__PURE__ */ jsx("span", { className: "font-bold tracking-tight text-white uppercase text-sm hidden lg:block italic", children: "HOACodeLab" })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => setIsTitleExpanded(!isTitleExpanded),
          className: `flex items-center gap-2 bg-black/20 border border-white/5 rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-300 ${isTitleExpanded ? "flex-1" : "w-10 sm:w-48"}`,
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: title,
                onChange: (e) => setTitle(e.target.value),
                onClick: (e) => e.stopPropagation(),
                className: `bg-transparent border-none p-0 text-white font-bold text-sm focus:ring-0 placeholder-white/20 truncate leading-none transition-all duration-300 ${isTitleExpanded ? "w-full block" : "hidden sm:block"}`,
                placeholder: "Untitled"
              }
            ),
            !isTitleExpanded && /* @__PURE__ */ jsx("span", { className: "sm:hidden text-cyan-500 font-black text-[10px] uppercase tracking-tighter shrink-0", children: "Project" }),
            /* @__PURE__ */ jsx(ChevronRight, { size: 14, className: `text-slate-600 transition-transform duration-300 ${isTitleExpanded ? "rotate-180" : ""}` })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth ml-auto justify-end px-2 ${isTitleExpanded ? "hidden sm:flex" : "flex"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center bg-black/20 p-1 rounded-lg border border-white/5 gap-1 shrink-0", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setLayout("bottom"), className: `p-1.5 rounded transition-all ${layout === "bottom" ? "bg-cyan-500 text-white" : "text-slate-500 hover:text-white"}`, children: /* @__PURE__ */ jsx(PanelBottom, { size: 14 }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setLayout("right"), className: `p-1.5 rounded transition-all ${layout === "right" ? "bg-cyan-500 text-white" : "text-slate-500 hover:text-white"}`, children: /* @__PURE__ */ jsx(PanelRight, { size: 14 }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setLayout("top"), className: `p-1.5 rounded transition-all ${layout === "top" ? "bg-cyan-500 text-white" : "text-slate-500 hover:text-white"}`, children: /* @__PURE__ */ jsx(PanelTop, { size: 14 }) })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: formatCode,
          className: "flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border)] rounded text-[10px] font-bold uppercase tracking-widest shrink-0",
          children: [
            /* @__PURE__ */ jsx(Wand2, { size: 12, className: isFormatting ? "animate-spin" : "" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: "Format" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveSidebar("settings"),
          className: "p-2 bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border)] rounded shrink-0",
          children: /* @__PURE__ */ jsx(Settings, { size: 14 })
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveModal("share"),
          className: "flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded text-[10px] font-bold uppercase tracking-widest shrink-0",
          children: [
            /* @__PURE__ */ jsx(Share2, { size: 14 }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: "Share" })
          ]
        }
      ),
      auth.user?.google_drive_token && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleCloudSave,
          disabled: isSaving,
          className: "flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest shrink-0",
          children: [
            isSaving ? /* @__PURE__ */ jsx(Loader2, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsx(CloudUpload, { size: 14 }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: "Cloud" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleSave,
          disabled: isSaving,
          className: "btn-primary shrink-0 px-4 py-2 rounded font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 bg-cyan-500 text-black shadow-lg",
          children: [
            isSaving ? /* @__PURE__ */ jsx(Loader2, { size: 12, className: "animate-spin" }) : isOwner ? /* @__PURE__ */ jsx(Cloud, { size: 12 }) : /* @__PURE__ */ jsx(GitFork, { size: 12 }),
            /* @__PURE__ */ jsx("span", { children: isOwner ? "Save" : "Fork" })
          ]
        }
      )
    ] })
  ] });
}
const PaidOverlay = ({ price, projectId, slug }) => {
  const handlePurchase = () => {
    window.location.href = route("checkout.project", { project: slug });
  };
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xs w-full bg-[var(--bg-surface)] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl text-center space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]", children: /* @__PURE__ */ jsx(Lock, { size: 30 }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Lock Settings" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2 leading-relaxed", children: "This source code is protected. Purchase access to unlock the full logic matrix." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-2xl font-black text-cyan-500 font-mono", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs opacity-50", children: "$" }),
      price
    ] }),
    /* @__PURE__ */ jsxs(PrimaryButton, { onClick: handlePurchase, className: "w-full", children: [
      /* @__PURE__ */ jsx(ShoppingBag, { size: 14, className: "mr-2" }),
      " Unlock Project"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Sparkles, { size: 10, className: "text-cyan-500" }),
        " Full Code"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Sparkles, { size: 10, className: "text-cyan-500" }),
        " Fork Rights"
      ] })
    ] })
  ] }) });
};
const EditorGroup = ({ direction = "horizontal", html, setHtml, css, setCss, js, setJs, fontSize, wordWrap, preprocessors, isLocked, price, projectId, slug }) => /* @__PURE__ */ jsxs(PanelGroup, { direction, className: "h-full relative", children: [
  isLocked && /* @__PURE__ */ jsx(PaidOverlay, { price, projectId, slug }),
  /* @__PURE__ */ jsxs(Panel, { defaultSize: 33, minSize: 10, className: `flex flex-col border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden ${isLocked ? "blur-sm grayscale" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("span", { children: "HTML_Source" }),
      /* @__PURE__ */ jsx("span", { className: "text-[7px] text-cyan-500/50", children: preprocessors.html })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 relative min-h-0", children: /* @__PURE__ */ jsx(MonacoWrapper, { language: "html", value: html, onChange: setHtml, fontSize, wordWrap }) })
  ] }),
  /* @__PURE__ */ jsx(PanelResizeHandle, { className: `${direction === "horizontal" ? "w-px" : "h-px"} bg-[var(--border)] hover:bg-cyan-500/20 transition-colors` }),
  /* @__PURE__ */ jsxs(Panel, { defaultSize: 33, minSize: 10, className: `flex flex-col border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden ${isLocked ? "blur-sm grayscale" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("span", { children: "CSS_Style" }),
      /* @__PURE__ */ jsx("span", { className: "text-[7px] text-cyan-500/50", children: preprocessors.css })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 relative min-h-0", children: /* @__PURE__ */ jsx(MonacoWrapper, { language: "css", value: css, onChange: setCss, fontSize, wordWrap }) })
  ] }),
  /* @__PURE__ */ jsx(PanelResizeHandle, { className: `${direction === "horizontal" ? "w-px" : "h-px"} bg-[var(--border)] hover:bg-cyan-500/20 transition-colors` }),
  /* @__PURE__ */ jsxs(Panel, { defaultSize: 34, minSize: 10, className: `flex flex-col bg-[var(--bg-surface)] overflow-hidden ${isLocked ? "blur-sm grayscale" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 bg-[var(--bg-main)] text-[9px] font-black uppercase text-[var(--text-muted)] border-b border-[var(--border)] tracking-widest italic flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("span", { children: "JS_Logic" }),
      /* @__PURE__ */ jsx("span", { className: "text-[7px] text-cyan-500/50", children: preprocessors.js })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 relative min-h-0", children: /* @__PURE__ */ jsx(MonacoWrapper, { language: "js", value: js, onChange: setJs, fontSize, wordWrap }) })
  ] })
] });
const MobileEditorTabs = ({ html, setHtml, css, setCss, js, setJs, fontSize, wordWrap, preprocessors, isLocked, price, projectId, slug }) => {
  const [activeTab, setActiveTab] = useState("html");
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col overflow-hidden bg-[var(--bg-surface)] relative", children: [
    isLocked && /* @__PURE__ */ jsx(PaidOverlay, { price, projectId, slug }),
    /* @__PURE__ */ jsx("div", { className: "flex bg-[var(--bg-main)] border-b border-[var(--border)] overflow-x-auto no-scrollbar scroll-smooth", children: /* @__PURE__ */ jsx("div", { className: "flex min-w-full", children: ["html", "css", "js"].map((tab) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActiveTab(tab),
        className: `flex-1 min-w-[120px] px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? "text-cyan-500 border-cyan-500 bg-cyan-500/5" : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)]"}`,
        children: tab === "html" ? `HTML (${preprocessors.html})` : tab === "css" ? `CSS (${preprocessors.css})` : `JS (${preprocessors.js})`
      },
      tab
    )) }) }),
    /* @__PURE__ */ jsxs("div", { className: `flex-1 relative min-h-0 ${isLocked ? "blur-sm grayscale" : ""}`, children: [
      activeTab === "html" && /* @__PURE__ */ jsx(MonacoWrapper, { language: "html", value: html, onChange: setHtml, fontSize, wordWrap }),
      activeTab === "css" && /* @__PURE__ */ jsx(MonacoWrapper, { language: "css", value: css, onChange: setCss, fontSize, wordWrap }),
      activeTab === "js" && /* @__PURE__ */ jsx(MonacoWrapper, { language: "js", value: js, onChange: setJs, fontSize, wordWrap })
    ] })
  ] });
};
const PreviewPanel = ({ previewContent }) => /* @__PURE__ */ jsxs(Panel, { defaultSize: 50, minSize: 20, className: "bg-[var(--bg-surface)] relative", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-4 z-10 pointer-events-none", children: /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-30", children: "Live_Preview" }) }),
  /* @__PURE__ */ jsx(
    "iframe",
    {
      srcDoc: previewContent,
      className: "w-full h-full border-none bg-white",
      sandbox: "allow-scripts",
      title: "preview"
    }
  )
] });
function EditorPanels({ previewContent, hasPurchased, isOwner }) {
  const { html, css, js, setHtml, setCss, setJs, fontSize, wordWrap, layout, preprocessors, isForSale, price, title, slug } = useProjectStore();
  useProjectStore.getState().id;
  const isLocked = isForSale && !isOwner && !hasPurchased;
  const editorProps = { html, setHtml, css, setCss, js, setJs, fontSize, wordWrap, preprocessors, isLocked, price, projectId: useProjectStore.getState().id || title, slug };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (isMobile) {
    return /* @__PURE__ */ jsxs(PanelGroup, { direction: "vertical", className: "h-full", children: [
      /* @__PURE__ */ jsx(Panel, { defaultSize: 50, minSize: 20, children: /* @__PURE__ */ jsx(MobileEditorTabs, { ...editorProps }) }),
      /* @__PURE__ */ jsx(PanelResizeHandle, { className: "h-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" }),
      /* @__PURE__ */ jsx(PreviewPanel, { previewContent })
    ] });
  }
  if (layout === "right") {
    return /* @__PURE__ */ jsxs(PanelGroup, { direction: "horizontal", className: "h-full", children: [
      /* @__PURE__ */ jsx(Panel, { defaultSize: 60, minSize: 20, children: /* @__PURE__ */ jsx(EditorGroup, { direction: "vertical", ...editorProps }) }),
      /* @__PURE__ */ jsx(PanelResizeHandle, { className: "w-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" }),
      /* @__PURE__ */ jsx(PreviewPanel, { previewContent })
    ] });
  }
  if (layout === "top") {
    return /* @__PURE__ */ jsxs(PanelGroup, { direction: "vertical", className: "h-full", children: [
      /* @__PURE__ */ jsx(PreviewPanel, { previewContent }),
      /* @__PURE__ */ jsx(PanelResizeHandle, { className: "h-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" }),
      /* @__PURE__ */ jsx(Panel, { defaultSize: 50, minSize: 20, children: /* @__PURE__ */ jsx(EditorGroup, { direction: "horizontal", ...editorProps }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(PanelGroup, { direction: "vertical", className: "h-full", children: [
    /* @__PURE__ */ jsx(Panel, { defaultSize: 50, minSize: 20, children: /* @__PURE__ */ jsx(EditorGroup, { direction: "horizontal", ...editorProps }) }),
    /* @__PURE__ */ jsx(PanelResizeHandle, { className: "h-px bg-[var(--border)] hover:bg-cyan-500/20 transition-colors" }),
    /* @__PURE__ */ jsx(PreviewPanel, { previewContent })
  ] });
}
function EditorFooter({
  showConsole,
  setShowConsole,
  activeSidebar,
  setActiveSidebar,
  setActiveModal,
  handleFork,
  handleExport,
  fetchCollections
}) {
  return /* @__PURE__ */ jsx("footer", { className: "h-10 bg-[var(--bg-main)] border-t border-[var(--border)] overflow-x-auto no-scrollbar shrink-0 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between min-w-max h-full px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center h-full", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowConsole(!showConsole),
          className: `flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${showConsole ? "bg-cyan-500 text-white dark:text-black shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"}`,
          children: [
            /* @__PURE__ */ jsx(Terminal, { size: 14 }),
            " Console"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-[var(--border)] mx-1" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveSidebar("assets"),
          className: `flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSidebar === "assets" ? "bg-cyan-500 text-white dark:text-black shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"}`,
          children: [
            /* @__PURE__ */ jsx(Package, { size: 14 }),
            " Assets"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-[var(--border)] mx-1" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveSidebar("cloud"),
          className: `flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSidebar === "cloud" ? "bg-cyan-500 text-white dark:text-black shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"}`,
          children: [
            /* @__PURE__ */ jsx(Cloud, { size: 14 }),
            " Cloud"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-[var(--border)] mx-1" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveSidebar("history"),
          className: `flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSidebar === "history" ? "bg-cyan-500 text-white dark:text-black shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"}`,
          children: [
            /* @__PURE__ */ jsx(RefreshCw, { size: 14 }),
            " History"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-[var(--border)] mx-1" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveSidebar("team"),
          className: `flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeSidebar === "team" ? "bg-purple-500 text-white dark:text-black shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"}`,
          children: [
            /* @__PURE__ */ jsx(Users, { size: 14 }),
            " Team"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center h-full gap-1", children: [
      [
        { label: "Collection", icon: FolderPlus, act: () => {
          setActiveModal("collection");
          fetchCollections();
        } },
        { label: "Fork", icon: GitFork, act: handleFork },
        { label: "Embed", icon: Code, act: () => setActiveModal("embed") },
        { label: "Export", icon: Download, act: handleExport }
      ].map((item) => /* @__PURE__ */ jsxs("button", { onClick: item.act, className: "flex items-center gap-2 px-3 h-full text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)] transition-all whitespace-nowrap", children: [
        /* @__PURE__ */ jsx(item.icon, { size: 12 }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "hidden md:block", children: item.label })
      ] }, item.label)),
      /* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-[var(--border)] mx-2" }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setActiveModal("share"), className: "h-full px-6 flex items-center gap-2 bg-[var(--bg-elevated)] border-x border-[var(--border)] hover:bg-cyan-500 hover:text-white dark:hover:text-black text-cyan-500 font-bold uppercase text-[10px] tracking-widest transition-all whitespace-nowrap", children: [
        /* @__PURE__ */ jsx(Share2, { size: 12 }),
        " Share"
      ] })
    ] })
  ] }) });
}
function EditorSidebar({
  activeSidebar,
  setActiveSidebar,
  setLogs,
  projectData,
  handleSave,
  handleFork,
  handleExport,
  fetchCollections,
  setActiveModal,
  diffRevision,
  handleCloudSave
}) {
  const { auth } = usePage().props;
  const isPro = auth.user?.role === "admin" || auth.user?.role === "paid-user";
  const {
    html,
    css,
    js,
    title,
    externalLibraries,
    setExternalLibraries,
    fontSize,
    setFontSize,
    wordWrap,
    setWordWrap,
    isPrivate,
    setIsPrivate,
    isForSale,
    setIsForSale,
    price,
    setPrice,
    google_drive_file_id,
    setGoogleDriveFileId,
    setProject,
    setHtml,
    setCss,
    setJs,
    // Added these
    // Advanced Settings
    theme,
    setTheme,
    minimap,
    setMinimap,
    preprocessors,
    setPreprocessor
  } = useProjectStore();
  const injectTemplate = (id) => {
    if (!confirm("This protocol will overwrite current buffers. Proceed?")) return;
    if (id === "3d-card") {
      setHtml(`<div class="neural-container">
  <div class="card">
    <div class="glow"></div>
    <div class="content">
      <div class="header">
        <span class="version">Build v1.5.0</span>
        <div class="pulse-icon"></div>
      </div>
      <h2>HOA_CodeLab</h2>
      <p>Prototyping Environment</p>
      <div class="footer">
        <span id="status">Status: Active</span>
        <div class="latency">0.04ms</div>
      </div>
    </div>
  </div>
</div>`);
      setCss(`body {
  background: #050505 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
}

.neural-container {
  perspective: 1000px;
}

.card {
  width: 320px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 30px;
  position: relative;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
  cursor: crosshair;
}

.glow {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(6, 182, 212, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

h2 {
  color: white;
  font-family: sans-serif;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -1px;
  margin: 20px 0 5px;
}

p {
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.version {
  color: #06b6d4;
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
}

.pulse-icon {
  width: 6px; height: 6px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 2s infinite;
}

.footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8px;
  font-weight: 900;
  color: #475569;
  text-transform: uppercase;
  font-family: monospace;
}

.latency { color: #06b6d4; }

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}`);
      setJs(`const card = document.querySelector('.card');
const container = document.querySelector('.neural-container');

if (container && card) {
  container.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--x', \`\${x}px\`);
    card.style.setProperty('--y', \`\${y}px\`);
    
    const rotateX = (y - rect.height / 2) / 10;
    const rotateY = (rect.width / 2 - x) / 10;
    
    card.style.transform = \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

console.log("Success: 3D Card Engine Online.");`);
    } else if (id === "neural-matrix") {
      setHtml(`<div class="neural-substrate">
  <canvas id="neural-canvas"></canvas>
  <div class="ui-overlay">
    <div class="status-bar">
      <span class="pulse"></span>
      <span>STATUS: OPTIMIZED</span>
    </div>
    <div class="telemetry">
      <h1>SYSTEM CORE</h1>
      <p>INTERACTIVE MATRIX</p>
    </div>
    <div class="footer-stats">
      <div class="stat">CORES: 128</div>
      <div class="stat">LATENCY: 0.02ms</div>
    </div>
  </div>
</div>`);
      setCss(`body {
  background: #050505 !important;
  margin: 0; overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.neural-substrate {
  position: relative;
  width: 100vw; height: 100vh;
}

#neural-canvas {
  position: absolute;
  inset: 0; z-index: 1;
}

.ui-overlay {
  position: relative;
  z-index: 2; height: 100%;
  display: flex; flex-direction: column;
  justify-content: space-between;
  padding: 40px; pointer-events: none;
}

.status-bar {
  display: flex; items-center: center; gap: 10px;
  color: #06b6d4; font-size: 10px; font-weight: 900;
  letter-spacing: 2px;
}

.pulse {
  width: 8px; height: 8px; background: #06b6d4;
  border-radius: 50%; animation: glow 2s infinite;
}

h1 {
  color: white; font-size: 4rem; font-weight: 900;
  margin: 0; letter-spacing: -2px; font-style: italic;
  text-shadow: 0 0 30px rgba(6,182,212,0.3);
}

p {
  color: #475569; font-size: 12px; font-weight: 800;
  letter-spacing: 5px; margin-top: 5px;
}

.footer-stats {
  display: flex; gap: 40px;
  color: #1e293b; font-size: 9px; font-weight: 900;
  letter-spacing: 2px; border-top: 1px solid #1e293b;
  padding-top: 20px;
}

@keyframes glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.5); }
}`);
      setJs(`const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x > canvas.width || this.x < 0) this.vx *= -1;
    if (this.y > canvas.height || this.y < 0) this.vy *= -1;
    
    let dx = mouse.x - this.x; let dy = mouse.y - this.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < mouse.radius) {
      this.x -= dx/20; this.y -= dy/20;
    }
  }
  draw() {
    ctx.fillStyle = 'rgba(6,182,212,0.8)';
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

function init() {
  particles = [];
  for (let i=0; i<100; i++) particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update(); p.draw();
    particles.forEach(other => {
      let dx = p.x - other.x; let dy = p.y - other.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.strokeStyle = \`rgba(6, 182, 212, \${1 - dist/100})\`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(animate);
}

resize(); init(); animate();
console.log("Success: System Online.");`);
    }
    setActiveSidebar(null);
  };
  const [isLinking, setIsLinking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [revisions, setRevisions] = useState([]);
  const [isLoadingRevisions, setIsLoadingRevisions] = useState(false);
  const [userAssets, setUserAssets] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    if (activeSidebar === "history" && projectData?.id) {
      fetchRevisions();
    }
    if (activeSidebar === "assets") {
      fetchAssets();
    }
  }, [activeSidebar]);
  const fetchRevisions = async () => {
    setIsLoadingRevisions(true);
    try {
      const res = await axios.get(`/api/projects/${projectData.id}/revisions`);
      setRevisions(res.data);
    } catch (e) {
      console.error("Archive_Access_Denied");
    } finally {
      setIsLoadingRevisions(false);
    }
  };
  const restoreRevision = async (id) => {
    if (!confirm("Revert core to this state? Current local buffers will be overwritten.")) return;
    try {
      const res = await axios.post(`/api/projects/${projectData.id}/revisions/${id}/restore`);
      setProject(res.data);
      toast.success("Core_Restoration_Complete");
    } catch (e) {
      toast.error("Restoration_Protocol_Failed");
    }
  };
  const openDiff = (revision) => {
    diffRevision(revision);
  };
  const fetchAssets = async () => {
    setIsLoadingAssets(true);
    try {
      const res = await axios.get("/api/assets");
      setUserAssets(res.data);
    } catch (e) {
      console.error("Asset_Index_Failed");
    } finally {
      setIsLoadingAssets(false);
    }
  };
  const handleAssetUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    setIsUploading(true);
    try {
      await axios.post("/api/assets", formData);
      fetchAssets();
    } catch (e2) {
      toast.error("Asset_Transmission_Failed");
    } finally {
      setIsUploading(false);
    }
  };
  const copyAssetUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL_Copied_to_Buffer");
  };
  const deleteAsset = async (id) => {
    if (!confirm("Purge asset from memory?")) return;
    try {
      await axios.delete(`/api/assets/${id}`);
      setUserAssets(userAssets.filter((a) => a.id !== id));
    } catch (e) {
      toast.error("Purge_Failed");
    }
  };
  const linkCloud = async () => {
    setIsLinking(true);
    try {
      window.location.href = "/api/google-drive/auth";
    } catch (e) {
      console.error("Connection_Refused");
    } finally {
      setIsLinking(false);
    }
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: activeSidebar && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: () => setActiveSidebar(null),
        className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { type: "spring", damping: 25, stiffness: 200 },
        className: "fixed right-0 top-0 bottom-0 w-[400px] max-w-full bg-[var(--bg-surface)] border-l border-[var(--border)] z-[101] shadow-2xl flex flex-col",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg-main)]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20", children: [
                activeSidebar === "settings" && /* @__PURE__ */ jsx(Settings, { size: 16 }),
                activeSidebar === "assets" && /* @__PURE__ */ jsx(Server, { size: 16 }),
                activeSidebar === "cloud" && /* @__PURE__ */ jsx(Cloud, { size: 16 }),
                activeSidebar === "history" && /* @__PURE__ */ jsx(RefreshCw, { size: 16 }),
                activeSidebar === "team" && /* @__PURE__ */ jsx(Shield, { size: 16 })
              ] }),
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-[0.3em] text-[var(--text-main)] italic", children: [
                activeSidebar === "settings" && "System_Config",
                activeSidebar === "assets" && "Asset_Manager",
                activeSidebar === "cloud" && "Cloud_Core",
                activeSidebar === "history" && "Core_History",
                activeSidebar === "team" && "Unit_Personnel"
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => setActiveSidebar(null), className: "p-2 hover:bg-[var(--bg-elevated)] rounded-lg text-[var(--text-muted)] hover:text-white transition-all", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-8 custom-scrollbar", children: [
            activeSidebar === "settings" && /* @__PURE__ */ jsx("div", { className: "space-y-8 text-left", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic", children: "Pro_Editor_Theme" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: theme,
                    onChange: (e) => setTheme(e.target.value),
                    className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)] focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "vs-dark", children: "Standard Dark" }),
                      /* @__PURE__ */ jsx("option", { value: "light", children: "High Contrast Light" }),
                      /* @__PURE__ */ jsx("option", { value: "dracula", children: "Dracula Pro" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic", children: "Minimap" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setMinimap(!minimap),
                    className: `relative w-8 h-4 rounded-full transition-colors ${minimap ? "bg-cyan-500" : "bg-slate-700"}`,
                    children: /* @__PURE__ */ jsx(
                      motion.div,
                      {
                        animate: { x: minimap ? 18 : 2 },
                        className: "absolute top-0.5 w-3 h-3 bg-white rounded-full"
                      }
                    )
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)] space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 italic", children: "External_Resources" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setExternalLibraries([...externalLibraries, ""]),
                      className: "p-1 bg-cyan-500/10 text-cyan-500 rounded hover:bg-cyan-500 hover:text-black transition-all",
                      children: /* @__PURE__ */ jsx(PlusCircle, { size: 12 })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  externalLibraries.map((lib, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 group", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: lib,
                        onChange: (e) => {
                          const newLibs = [...externalLibraries];
                          newLibs[index] = e.target.value;
                          setExternalLibraries(newLibs);
                        },
                        placeholder: "https://cdn.link/library.js",
                        className: "flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded px-3 py-1.5 text-[9px] text-[var(--text-main)] focus:border-cyan-500 outline-none"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setExternalLibraries(externalLibraries.filter((_, i) => i !== index)),
                        className: "p-1.5 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded transition-all",
                        children: /* @__PURE__ */ jsx(Trash2, { size: 12 })
                      }
                    )
                  ] }, index)),
                  externalLibraries.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-[8px] text-[var(--text-muted)] italic py-2", children: "No external CDN libraries linked." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)] space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 italic", children: "Template_Protocols" }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                  {
                    id: "3d-card",
                    name: "3D_Neural_Card",
                    icon: Layers,
                    desc: "Perspective & Glow"
                  },
                  {
                    id: "neural-matrix",
                    name: "Neural_Matrix_v2",
                    icon: Activity,
                    desc: "Generative Particles"
                  }
                ].map((template) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => injectTemplate(template.id),
                    className: "p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl hover:border-cyan-500/40 transition-all text-left group",
                    children: [
                      /* @__PURE__ */ jsx(template.icon, { size: 16, className: "text-[var(--text-muted)] group-hover:text-cyan-500 transition-colors mb-3" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black uppercase text-white mb-1", children: template.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-[7px] font-bold text-[var(--text-muted)] uppercase", children: template.desc })
                    ]
                  },
                  template.id
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)] space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 italic", children: "Preprocessors" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic", children: "Styles (CSS)" }),
                    /* @__PURE__ */ jsx("div", { className: "flex bg-[var(--bg-main)] p-1 rounded border border-[var(--border)]", children: ["css", "scss", "sass"].map((type) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setPreprocessor("css", type),
                        className: `flex-1 py-1.5 text-[8px] font-bold uppercase rounded transition-all ${preprocessors.css === type ? "bg-cyan-500 text-black" : "text-[var(--text-muted)] hover:text-white"}`,
                        children: type
                      },
                      type
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic", children: "Scripts (JS)" }),
                    /* @__PURE__ */ jsx("div", { className: "flex bg-[var(--bg-main)] p-1 rounded border border-[var(--border)]", children: ["js", "babel", "typescript"].map((type) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setPreprocessor("js", type),
                        className: `flex-1 py-1.5 text-[8px] font-bold uppercase rounded transition-all ${preprocessors.js === type ? "bg-cyan-500 text-black" : "text-[var(--text-muted)] hover:text-white"}`,
                        children: type === "babel" ? "React/JSX" : type
                      },
                      type
                    )) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-6 border-t border-[var(--border)]", children: [
                /* @__PURE__ */ jsxs("label", { className: "text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic", children: [
                  "Font Size (",
                  fontSize,
                  "px)"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "range",
                    min: "10",
                    max: "24",
                    value: fontSize,
                    onChange: (e) => setFontSize(parseInt(e.target.value)),
                    className: "w-full h-1 bg-[var(--bg-elevated)] rounded-full appearance-none cursor-pointer accent-cyan-500"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic", children: "Word Wrap" }),
                /* @__PURE__ */ jsxs("div", { className: "flex bg-[var(--bg-main)] p-1 rounded border border-[var(--border)]", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setWordWrap("on"), className: `flex-1 py-2 text-[9px] font-bold uppercase rounded transition-all ${wordWrap === "on" ? "bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`, children: "On" }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setWordWrap("off"), className: `flex-1 py-2 text-[9px] font-bold uppercase rounded transition-all ${wordWrap === "off" ? "bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`, children: "Off" })
                ] })
              ] }),
              isPro && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)] space-y-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("label", { className: "text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] italic", children: "Privacy" }) }),
                  /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-xl border transition-all ${isPrivate ? "bg-rose-500/5 border-rose-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`, children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        isPrivate ? /* @__PURE__ */ jsx(Lock, { size: 14, className: "text-rose-500" }) : /* @__PURE__ */ jsx(Unlock, { size: 14, className: "text-emerald-500" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: isPrivate ? "Private" : "Public" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setIsPrivate(!isPrivate),
                          className: `relative w-10 h-5 rounded-full transition-colors ${isPrivate ? "bg-rose-500" : "bg-slate-700"}`,
                          children: /* @__PURE__ */ jsx(
                            motion.div,
                            {
                              animate: { x: isPrivate ? 20 : 2 },
                              className: "absolute top-1 w-3 h-3 bg-white rounded-full"
                            }
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[8px] leading-relaxed text-[var(--text-muted)] font-medium uppercase tracking-tighter italic", children: isPrivate ? "Restricted: This project is hidden from the explore page and search." : "Open: This project is visible to the entire community." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)] space-y-4", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 italic", children: "Marketplace_Monetization" }),
                  /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-xl border transition-all ${isForSale ? "bg-cyan-500/5 border-cyan-500/20" : "bg-[var(--bg-main)] border-[var(--border)]"}`, children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx(Tag, { size: 14, className: isForSale ? "text-cyan-500" : "text-[var(--text-muted)]" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: "List for Sale" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setIsForSale(!isForSale),
                          className: `relative w-10 h-5 rounded-full transition-colors ${isForSale ? "bg-cyan-500" : "bg-slate-700"}`,
                          children: /* @__PURE__ */ jsx(
                            motion.div,
                            {
                              animate: { x: isForSale ? 20 : 2 },
                              className: "absolute top-1 w-3 h-3 bg-white rounded-full"
                            }
                          )
                        }
                      )
                    ] }),
                    isForSale && /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, className: "space-y-3 pt-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase text-cyan-500 tracking-widest", children: "Unit Price (USD)" }),
                        /* @__PURE__ */ jsx(CreditCard, { size: 12, className: "text-cyan-500/50" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "number",
                          step: "0.01",
                          value: price,
                          onChange: (e) => setPrice(e.target.value),
                          className: "w-full bg-[var(--bg-main)] border border-cyan-500/30 rounded-lg px-3 py-2 text-[10px] text-cyan-400 font-mono outline-none focus:border-cyan-500 transition-all",
                          placeholder: "0.00"
                        }
                      ),
                      /* @__PURE__ */ jsx("p", { className: "text-[7px] text-[var(--text-muted)] italic uppercase font-bold tracking-tighter", children: "Code will be blurred until purchased. Live previews remain accessible." })
                    ] })
                  ] })
                ] })
              ] })
            ] }) }),
            activeSidebar === "team" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-left", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-purple-500 font-black text-[10px] uppercase tracking-widest italic", children: [
                /* @__PURE__ */ jsx(Shield, { size: 14 }),
                " Unit_Personnel"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-4", children: projectData?.team ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "p-4 bg-[var(--bg-elevated)] border border-purple-500/20 rounded-xl", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase text-purple-500 mb-2", children: "Assigned Unit" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-white", children: projectData.team.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest italic", children: "Active_Agents" }),
                  /* @__PURE__ */ jsxs("div", { className: "divide-y divide-[var(--border)] bg-[var(--bg-main)] rounded-xl border border-[var(--border)]", children: [
                    /* @__PURE__ */ jsxs("div", { className: "p-3 flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-500 font-black", children: "Y" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-white", children: "You (Active)" })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "p-3 flex items-center justify-between opacity-40", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-[var(--text-muted)] font-black", children: "A" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[var(--text-muted)]", children: "Agent_0x (Offline)" })
                    ] }) })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "py-20 text-center space-y-4 opacity-40 italic", children: [
                /* @__PURE__ */ jsx(Users, { size: 32, className: "mx-auto" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest", children: "Isolated_Module" }),
                /* @__PURE__ */ jsx("p", { className: "text-[8px] font-bold uppercase", children: "Assign to a team in Archives to enable collaboration." })
              ] }) })
            ] }),
            activeSidebar === "assets" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-left", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl border-dashed border-cyan-500/20 relative group hover:bg-cyan-500/5 transition-all", children: [
                /* @__PURE__ */ jsx("input", { type: "file", onChange: handleAssetUpload, className: "absolute inset-0 opacity-0 cursor-pointer z-10", disabled: isUploading }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-3 bg-cyan-500/10 rounded-full text-cyan-500 group-hover:scale-110 transition-transform", children: isUploading ? /* @__PURE__ */ jsx(RefreshCw, { className: "animate-spin", size: 24 }) : /* @__PURE__ */ jsx(PlusCircle, { size: 24 }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-cyan-500", children: "Transmit_Asset" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[8px] text-[var(--text-muted)] uppercase font-medium", children: "Add images or scripts to your project" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] italic", children: "Module_Payloads" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[8px] font-bold bg-[var(--bg-elevated)] px-2 py-0.5 rounded text-cyan-500 border border-[var(--border)]", children: [
                    userAssets.length,
                    " Assets"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: isLoadingAssets ? /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-[9px] font-bold text-[var(--text-muted)] animate-pulse uppercase tracking-widest italic", children: "Indexing Assets..." }) : userAssets.length > 0 ? userAssets.map((asset) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    draggable: true,
                    onDragStart: (e) => e.dataTransfer.setData("text/plain", asset.url),
                    className: "p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl group hover:border-cyan-500/20 transition-all text-left cursor-grab active:cursor-grabbing",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-3 pointer-events-none", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[var(--bg-elevated)] rounded-lg overflow-hidden border border-[var(--border)] flex items-center justify-center", children: asset.type.startsWith("image/") ? /* @__PURE__ */ jsx("img", { src: asset.url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Code, { size: 14, className: "text-cyan-500/40" }) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-tight text-[var(--text-main)] truncate", children: asset.name }),
                          /* @__PURE__ */ jsxs("p", { className: "text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: [
                            (asset.size / 1024).toFixed(1),
                            " KB"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => copyAssetUrl(asset.url),
                            className: "flex-1 py-1.5 bg-cyan-500 text-black rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white transition-colors",
                            children: "Copy URL"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => deleteAsset(asset.id),
                            className: "p-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all",
                            children: /* @__PURE__ */ jsx(Trash2, { size: 12 })
                          }
                        )
                      ] })
                    ]
                  },
                  asset.id
                )) : /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic opacity-40", children: "No payloads detected." }) })
              ] })
            ] }),
            activeSidebar === "history" && /* @__PURE__ */ jsx("div", { className: "space-y-8 text-left", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] italic", children: "Archive_Timeline" }),
                /* @__PURE__ */ jsx("button", { onClick: fetchRevisions, className: "p-1.5 hover:bg-[var(--bg-elevated)] rounded transition-colors text-[var(--text-muted)] hover:text-cyan-500", children: /* @__PURE__ */ jsx(RefreshCw, { size: 14 }) })
              ] }),
              projectData?.id ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: isLoadingRevisions ? /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-[9px] font-bold text-[var(--text-muted)] animate-pulse uppercase tracking-widest italic", children: "Accessing Logs..." }) : revisions.length > 0 ? revisions.map((rev) => /* @__PURE__ */ jsxs("div", { className: "p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl group hover:border-cyan-500/30 transition-all", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-tight text-[var(--text-main)]", children: rev.commit_message }),
                    /* @__PURE__ */ jsx("p", { className: "text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: new Date(rev.created_at).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-1 bg-[var(--bg-main)] rounded text-[8px] font-black text-cyan-500 uppercase", children: [
                    "v",
                    rev.id
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => restoreRevision(rev.id),
                      className: "flex-1 py-1.5 bg-white text-black rounded text-[8px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-colors",
                      children: "Restore"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => openDiff(rev),
                      className: "flex-1 py-1.5 bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)] rounded text-[8px] font-black uppercase tracking-widest hover:text-white transition-colors",
                      children: "Compare"
                    }
                  )
                ] })
              ] }, rev.id)) : /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic", children: "No projects found." }) }) }) : /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl text-center italic space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest", children: "Core not initialized." }),
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-[var(--text-muted)]/50 uppercase font-medium", children: "Save project to enable history." })
              ] })
            ] }) }),
            activeSidebar === "cloud" && /* @__PURE__ */ jsx("div", { className: "space-y-8 text-left", children: /* @__PURE__ */ jsxs("div", { className: "p-8 bg-[var(--bg-main)] border border-[var(--border)] rounded-3xl relative overflow-hidden text-center space-y-6 group", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsx(Cloud, { size: 100 }) }),
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto shadow-2xl shadow-cyan-500/20", children: /* @__PURE__ */ jsx(Cloud, { size: 32 }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-white uppercase tracking-widest", children: "Satellite_Link" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-medium leading-relaxed px-4", children: "Synchronize local modules with remote cloud archives for decentralized access." })
              ] }),
              !auth.user?.google_drive_token ? /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: linkCloud,
                  disabled: isLinking,
                  className: "w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all flex items-center justify-center gap-3",
                  children: [
                    isLinking ? /* @__PURE__ */ jsx(RefreshCw, { className: "animate-spin", size: 14 }) : /* @__PURE__ */ jsx(Server, { size: 14 }),
                    " Connect"
                  ]
                }
              ) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-emerald-500 uppercase tracking-widest", children: "Linked" })
                  ] }),
                  /* @__PURE__ */ jsx(Link, { href: "/cloud-sync", className: "text-[9px] font-black text-[var(--text-muted)] hover:text-white uppercase tracking-widest underline", children: "Manage_Storage" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleCloudSave,
                    className: "w-full py-3 bg-cyan-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-cyan-500/20",
                    children: "Sync Data"
                  }
                )
              ] })
            ] }) })
          ] })
        ]
      }
    )
  ] }) });
}
function EditorModals({
  activeModal,
  setActiveModal,
  project,
  collections,
  addToCollection,
  createCollection,
  diffRevision
}) {
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [diffType, setDiffType] = useState("html");
  const { isPrivate, setIsPrivate, isForSale, setIsForSale, price, setPrice, html, css, js } = useProjectStore();
  const toast = useToast();
  const handleCreateCollection = () => {
    if (!newCollectionTitle) return;
    createCollection(newCollectionTitle);
    setNewCollectionTitle("");
  };
  const currentCode = { html, css, js };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: activeModal && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-6", children: [
    /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setActiveModal(null), className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { scale: 0.98, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.98, opacity: 0 },
        className: `relative bg-[var(--bg-surface)] border border-[var(--border)] w-full ${activeModal === "diff" ? "max-w-6xl h-[80vh]" : "max-w-lg"} rounded-2xl p-10 shadow-2xl overflow-hidden transition-all duration-300 flex flex-col`,
        children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setActiveModal(null), className: "absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)] z-10 transition-all", children: /* @__PURE__ */ jsx(X, { size: 20 }) }),
          activeModal === "diff" && diffRevision && /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-h-0 space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 rounded-lg text-cyan-500", children: /* @__PURE__ */ jsx(GitCompare, { size: 20 }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Review Changes" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: [
                    "Comparing current with v",
                    diffRevision.id,
                    ": ",
                    diffRevision.commit_message
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex bg-[var(--bg-main)] p-1 rounded-lg border border-[var(--border)]", children: ["html", "css", "js"].map((type) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setDiffType(type),
                  className: `px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${diffType === type ? "bg-cyan-500 text-black shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`,
                  children: type
                },
                type
              )) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 border border-[var(--border)] rounded-xl overflow-hidden bg-[#1e1e1e]", children: /* @__PURE__ */ jsx(
              DiffEditor,
              {
                height: "100%",
                language: diffType === "js" ? "javascript" : diffType,
                theme: "vs-dark",
                original: diffRevision.code[diffType],
                modified: currentCode[diffType],
                options: {
                  renderSideBySide: true,
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "JetBrains Mono, Menlo, monospace",
                  automaticLayout: true,
                  scrollBeyondLastLine: false
                }
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-[var(--border)] text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-red-900/30 border border-red-500/30 rounded" }),
                  " Original"
                ] }),
                /* @__PURE__ */ jsx(ArrowRight, { size: 10 }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-emerald-900/30 border border-emerald-500/30 rounded" }),
                  " Modified"
                ] })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => setActiveModal(null), className: "px-6 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg hover:text-[var(--text-main)] transition-colors", children: "Close Review" })
            ] })
          ] }),
          activeModal === "share" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Share2, { className: "text-purple-500", size: 20 }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Share Project" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-colors", children: [
                /* @__PURE__ */ jsx("code", { className: "text-[10px] text-purple-400 truncate mr-6 font-mono select-all", children: project?.slug ? `${window.location.origin}/editor/${project.slug}` : "Save project to generate link" }),
                project?.slug && /* @__PURE__ */ jsx("button", { onClick: () => {
                  navigator.clipboard.writeText(`${window.location.origin}/editor/${project.slug}`);
                  toast.success("Link Copied.");
                }, className: "p-2 hover:bg-[var(--bg-elevated)] rounded text-[var(--text-main)] transition-all", children: /* @__PURE__ */ jsx(Copy, { size: 14 }) })
              ] }),
              project && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    isPrivate ? /* @__PURE__ */ jsx(Lock, { size: 16, className: "text-rose-500" }) : /* @__PURE__ */ jsx(Globe, { size: 16, className: "text-emerald-500" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]", children: isPrivate ? "Private Access" : "Public Access" }),
                      /* @__PURE__ */ jsx("div", { className: "text-[9px] text-[var(--text-muted)]", children: isPrivate ? "Only you can view this project." : "Visible to everyone." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                    /* @__PURE__ */ jsx("input", { type: "checkbox", checked: isPrivate, onChange: (e) => setIsPrivate(e.target.checked), className: "sr-only peer" }),
                    /* @__PURE__ */ jsx("div", { className: "w-9 h-5 bg-[var(--bg-main)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(Tag, { size: 16, className: isForSale ? "text-cyan-500" : "text-[var(--text-muted)]" }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]", children: "Marketplace Listing" }),
                        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-[var(--text-muted)]", children: "List this project for sale on the marketplace." })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                      /* @__PURE__ */ jsx("input", { type: "checkbox", checked: isForSale, onChange: (e) => setIsForSale(e.target.checked), className: "sr-only peer" }),
                      /* @__PURE__ */ jsx("div", { className: "w-9 h-5 bg-[var(--bg-main)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" })
                    ] })
                  ] }),
                  isForSale && /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-cyan-500", children: "Set Price (USD)" }),
                      /* @__PURE__ */ jsx(CreditCard, { size: 14, className: "text-cyan-500/50" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        step: "0.01",
                        value: price,
                        onChange: (e) => setPrice(e.target.value),
                        className: "w-full bg-[var(--bg-main)] border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-cyan-400 font-mono outline-none focus:border-cyan-500 transition-all",
                        placeholder: "0.00"
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { className: "text-[8px] text-[var(--text-muted)] italic", children: "Code will be blurred until purchased. Previews remain public." })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-4 border-t border-[var(--border)]", children: /* @__PURE__ */ jsxs("button", { onClick: () => setActiveModal("embed"), className: "text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 transition-colors", children: [
              /* @__PURE__ */ jsx(Code, { size: 14 }),
              " Get Embed Code"
            ] }) })
          ] }),
          activeModal === "embed" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Code, { className: "text-cyan-500", size: 20 }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Embed Project" })
            ] }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                readOnly: true,
                value: project?.slug ? `<iframe src="${window.location.origin}/editor/${project.slug}" style="width:100%; height:500px; border:none; border-radius: 8px; overflow:hidden;" sandbox="allow-scripts allow-same-origin"></iframe>` : "Save project first.",
                className: "w-full h-32 bg-[var(--bg-main)] border border-[var(--border)] rounded p-4 text-[10px] font-mono text-cyan-500 focus:ring-0 resize-none",
                onClick: (e) => e.target.select()
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-[var(--border)]", children: [
              /* @__PURE__ */ jsxs("button", { onClick: () => setActiveModal("share"), className: "text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 transition-colors", children: [
                /* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
                " Back"
              ] }),
              /* @__PURE__ */ jsxs("button", { onClick: () => {
                navigator.clipboard.writeText(`<iframe src="${window.location.origin}/editor/${project?.slug}" style="width:100%; height:500px; border:none; border-radius: 8px; overflow:hidden;" sandbox="allow-scripts allow-same-origin"></iframe>`);
                toast.success("Embed Code Copied.");
              }, className: "text-[10px] font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 flex items-center gap-2 transition-colors", children: [
                /* @__PURE__ */ jsx(Copy, { size: 14 }),
                " Copy Code"
              ] })
            ] })
          ] }),
          activeModal === "collection" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(FolderPlus, { className: "text-cyan-500", size: 20 }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Add to Collection" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-h-48 overflow-y-auto space-y-1 custom-scrollbar", children: collections.map((c) => /* @__PURE__ */ jsxs("button", { onClick: () => addToCollection(c.id), className: "w-full p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded hover:border-cyan-500/40 text-left flex justify-between items-center transition-all", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-[var(--text-main)] uppercase text-[10px] tracking-widest", children: c.title }),
              /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-[var(--text-muted)] font-black", children: [
                c.projects_count,
                " Projects"
              ] })
            ] }, c.id)) }),
            /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)] flex gap-2", children: [
              /* @__PURE__ */ jsx("input", { value: newCollectionTitle, onChange: (e) => setNewCollectionTitle(e.target.value), placeholder: "Title...", className: "flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded px-4 text-xs focus:ring-cyan-500 text-[var(--text-main)] font-bold uppercase tracking-widest" }),
              /* @__PURE__ */ jsx("button", { onClick: handleCreateCollection, className: "btn-primary text-[9px]", children: "Create" })
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
function ConsolePanel({ logs, setLogs }) {
  const scrollRef = useRef(null);
  const [command, setCommand] = useState("");
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  const handleExecute = (e) => {
    if (e.key === "Enter" && command.trim()) {
      const iframe = document.querySelector('iframe[title="preview"]');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "REPL_EXEC", code: command }, "*");
        setCommand("");
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "h-full bg-[var(--bg-main)] flex flex-col border-t border-[var(--border)] font-mono transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border)] flex justify-between items-center shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-left", children: [
        /* @__PURE__ */ jsx(Terminal, { size: 12, className: "text-cyan-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] italic", children: "System_Console" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setLogs([]), className: "text-[8px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] uppercase tracking-widest", children: "Flush_Log" })
    ] }),
    /* @__PURE__ */ jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-4 text-[10px] space-y-1.5 custom-scrollbar font-mono text-left", children: [
      logs.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-[var(--text-muted)] italic opacity-40", children: "Awaiting stream..." }),
      logs.map((log, i) => /* @__PURE__ */ jsxs("div", { className: `flex gap-3 ${log.type === "ERR" ? "text-rose-500" : "text-cyan-500"} opacity-80`, children: [
        /* @__PURE__ */ jsxs("span", { className: "opacity-30 shrink-0 select-none text-[8px]", children: [
          "[",
          new Date(log.id).toLocaleTimeString([], { hour12: false, minute: "2-digit", second: "2-digit" }),
          "]"
        ] }),
        /* @__PURE__ */ jsx("pre", { className: "break-all whitespace-pre-wrap font-inherit leading-relaxed", children: log.content })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 border-t border-[var(--border)] bg-[var(--bg-surface)] flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(ChevronRight, { size: 14, className: "text-cyan-500 shrink-0" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: command,
          onChange: (e) => setCommand(e.target.value),
          onKeyDown: handleExecute,
          placeholder: "Enter command...",
          className: "w-full bg-transparent border-none outline-none text-[10px] text-cyan-500 placeholder:text-cyan-500/20 lowercase tracking-widest"
        }
      )
    ] })
  ] });
}
function Editor({ auth, project: initialProject }) {
  const {
    html,
    css,
    js,
    setProject,
    title,
    isPrivate,
    isForSale,
    price,
    externalLibraries,
    setGoogleDriveFileId,
    preprocessors
  } = useProjectStore();
  const { globalAds } = usePage().props;
  const lockAd = globalAds?.adsLock?.[0] || globalAds?.video_reward?.[0] || globalAds?.in_feed?.[0] || Object.values(globalAds || {})[0]?.[0];
  const [previewContent, setPreviewContent] = useState("");
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [projectData, setProjectData] = useState(initialProject);
  const [diffRevision, setDiffRevision] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(initialProject?.has_purchased || false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const toast = useToast();
  const isNewProject = !initialProject;
  const isOwner = useMemo(() => {
    if (!auth.user) return false;
    if (!initialProject) return true;
    return initialProject.user_id === auth.user.id;
  }, [auth.user, initialProject]);
  const isVerifiedOrHighLevel = auth?.user && (auth.user.identity_status === "verified" || auth.user.level > 4);
  const requiresVideoAd = !isNewProject && !isOwner && initialProject.is_public && !initialProject.is_for_sale && !isVerifiedOrHighLevel;
  const [hasCompletedVideoAd, setHasCompletedVideoAd] = useState(!requiresVideoAd);
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(0);
  useEffect(() => {
    let timer;
    if (isPlayingAd && adTimeLeft > 0) {
      timer = setTimeout(() => {
        setAdTimeLeft((prev) => prev - 1);
      }, 1e3);
    } else if (isPlayingAd && adTimeLeft === 0) {
      setIsPlayingAd(false);
      setHasCompletedVideoAd(true);
    }
    return () => clearTimeout(timer);
  }, [isPlayingAd, adTimeLeft]);
  const playRewardAd = () => {
    setIsPlayingAd(true);
    setAdTimeLeft(5);
  };
  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
      setProjectData(initialProject);
      setHasPurchased(initialProject.has_purchased || false);
      if (initialProject.code?.google_drive_file_id) {
        setGoogleDriveFileId(initialProject.code.google_drive_file_id);
      }
    }
  }, [initialProject, setProject, setGoogleDriveFileId]);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const purchased = urlParams.get("purchased");
    const sessionId = urlParams.get("session_id");
    if (purchased === "true" && sessionId && projectData?.id) {
      const verifyPurchase = async () => {
        try {
          await axios.post("/api/purchase/verify", {
            gateway: "stripe",
            project_id: projectData.id,
            session_id: sessionId
          });
          setHasPurchased(true);
          toast.success("Neural Unlock Successful. Code Access Granted.");
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
          console.error("Purchase verification failed.");
        }
      };
      verifyPurchase();
    }
  }, [projectData]);
  const {
    isSaving,
    isFormatting,
    formatCode,
    handleSave,
    handleFork,
    handleCloudSave
  } = useEditorActions(projectData, setProjectData, setLogs);
  useHotkeys({
    "ctrl+s": (e) => {
      e.preventDefault();
      handleSave();
    },
    "ctrl+shift+f": (e) => {
      e.preventDefault();
      formatCode();
    },
    "ctrl+k": (e) => {
      e.preventDefault();
      setPaletteOpen((prev) => !prev);
    },
    "ctrl+j": (e) => {
      e.preventDefault();
      setShowConsole((prev) => !prev);
    },
    "ctrl+b": (e) => {
      e.preventDefault();
      setActiveSidebar((prev) => prev ? null : "settings");
    }
  }, [handleSave, formatCode]);
  const handlePaletteExecute = (action) => {
    switch (action) {
      case "save":
        handleSave();
        break;
      case "format":
        formatCode();
        break;
      case "new":
        window.location.href = "/editor";
        break;
      case "fork":
        handleFork();
        break;
      case "console":
        setShowConsole((prev) => !prev);
        break;
      case "layout-bottom":
        useProjectStore.getState().setLayout("bottom");
        break;
      case "layout-right":
        useProjectStore.getState().setLayout("right");
        break;
      case "layout-top":
        useProjectStore.getState().setLayout("top");
        break;
      case "share":
        setActiveModal("share");
        break;
      case "export":
        handleExport();
        break;
      case "sidebar":
        setActiveSidebar((prev) => prev ? null : "settings");
        break;
      case "settings":
        setActiveModal("settings");
        break;
    }
  };
  const [compiling, setCompiling] = useState(false);
  const compileCode = async () => {
    setCompiling(true);
    let compiledCss = css;
    let compiledJs = js;
    const { preprocessors: preprocessors2 } = useProjectStore.getState();
    try {
      if (preprocessors2.css === "scss" || preprocessors2.css === "sass") {
        if (window.Sass) {
          compiledCss = await new Promise((resolve) => {
            window.Sass.compile(css, (result) => resolve(result.text || css));
          });
        } else {
          console.warn("Sass compiler not loaded yet.");
        }
      }
      if (preprocessors2.js === "babel" || preprocessors2.js === "typescript") {
        if (window.Babel) {
          compiledJs = window.Babel.transform(js, {
            presets: ["env", "react", "typescript"],
            filename: "script.tsx"
          }).code;
        } else {
          console.warn("Babel compiler not loaded yet.");
        }
      }
    } catch (err) {
      setLogs((prev) => [...prev, { type: "ERR", content: "Compilation Error: " + err.message, id: Date.now() }]);
    }
    const libs = externalLibraries.map((lib) => lib.endsWith(".css") ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"><\/script>`).join("\n");
    const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    body { background: white; margin: 0; padding: 0; font-family: sans-serif; }
                    ${compiledCss}
                </style>
                ${libs}
                <script>
                    const safeStringify = (obj) => {
                        try {
                            return JSON.stringify(obj, null, 2);
                        } catch (e) {
                            return String(obj);
                        }
                    };
                    console.log = (...args) => {
                        const content = args.map(arg => 
                            typeof arg === 'object' ? safeStringify(arg) : String(arg)
                        ).join(' ');
                        window.parent.postMessage({ type: 'LOG', content }, '*');
                    };
                    window.onerror = (m, u, l) => {
                        window.parent.postMessage({ type: 'ERR', content: m + ' (Line: ' + l + ')' }, '*');
                    };
                    window.addEventListener('unhandledrejection', (event) => {
                        window.parent.postMessage({ type: 'ERR', content: 'Unhandled Rejection: ' + event.reason }, '*');
                    });
                    
                    // REPL Listener
                    window.addEventListener('message', (e) => {
                        if (e.data.type === 'REPL_EXEC') {
                            try {
                                const result = eval(e.data.code);
                                window.parent.postMessage({ type: 'LOG', content: '> ' + safeStringify(result) }, '*');
                            } catch (err) {
                                window.parent.postMessage({ type: 'ERR', content: 'REPL Error: ' + err.message }, '*');
                            }
                        }
                    });
                <\/script>
            </head>
            <body>${html}<script>${compiledJs}<\/script></body>
            </html>
        `;
    setPreviewContent(content);
    setCompiling(false);
  };
  useEffect(() => {
    if (!window.Babel) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
      script.onerror = () => setLogs((prev) => [...prev, { type: "ERR", content: "Error: Babel Compiler Offline.", id: Date.now() }]);
      document.head.appendChild(script);
    }
    if (!window.Sass) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js";
      script.onerror = () => setLogs((prev) => [...prev, { type: "ERR", content: "Error: Sass Compiler Offline.", id: Date.now() }]);
      document.head.appendChild(script);
    }
    const handleMessage = (e) => {
      if (e.data.type === "LOG" || e.data.type === "ERR") {
        setLogs((prev) => [...prev, { type: e.data.type, content: e.data.content, id: Date.now() }].slice(-50));
      }
    };
    window.addEventListener("message", handleMessage);
    const timeout = setTimeout(compileCode, 800);
    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  }, [html, css, js, externalLibraries, preprocessors]);
  const handleExport = () => {
    const blob = new Blob([previewContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}.html`;
    a.click();
  };
  const fetchCollections = async () => {
    const res = await axios.get("/api/collections");
    setCollections(res.data);
  };
  const addToCollection = async (id) => {
    if (!projectData?.id) return toast.warning("Initialize core first.");
    await axios.post(`/api/collections/${id}/add`, { project_id: projectData.id });
    toast.success("Module linked.");
    setActiveModal(null);
  };
  const createCollection = async (newTitle) => {
    if (!newTitle) return;
    const res = await axios.post("/api/collections", { title: newTitle });
    setCollections([...collections, res.data]);
  };
  const pageTitle = (projectData?.meta_title || title || "Editor") + " // HOACodeLab";
  const pageDescription = projectData?.meta_description || "Prototyping node on HOACodeLab.";
  const ogImage = projectData?.og_image_url || `${window.location.origin}/favicon.svg`;
  return /* @__PURE__ */ jsxs("div", { className: "h-screen bg-[var(--bg-main)] flex flex-col font-sans overflow-hidden transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: pageTitle }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: pageDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: pageTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: pageDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: ogImage }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: ogImage })
    ] }),
    !hasCompletedVideoAd && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#111] border border-[var(--border)] p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsxs("h4", { className: "text-xl font-black uppercase text-white tracking-widest flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-cyan-500", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
        "Unlock Code Editor"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 font-medium", children: "To view the source code of this public module, please watch a short sponsor message. (Verified users and Level 5+ bypass this automatically)." }),
      isPlayingAd ? /* @__PURE__ */ jsxs("div", { className: "w-full relative bg-[#000] rounded-xl border border-white/10 flex flex-col items-center justify-center overflow-hidden min-h-[150px]", children: [
        lockAd ? /* @__PURE__ */ jsx("div", { className: "w-full max-h-[250px] overflow-hidden flex items-center justify-center", children: /* @__PURE__ */ jsx(AdUnit, { ad: lockAd }) }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-cyan-500/5 animate-pulse" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-white text-xs font-bold z-20 border border-white/10 shadow-lg", children: [
          adTimeLeft,
          "s"
        ] }),
        !lockAd && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest text-white/50 mb-2", children: "Sponsor Advertisement" }),
          /* @__PURE__ */ jsxs("div", { className: "text-5xl font-black text-white z-10", children: [
            adTimeLeft,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-1000 z-20", style: { width: `${(5 - adTimeLeft) / 5 * 100}%` } })
      ] }) : /* @__PURE__ */ jsx(
        "button",
        {
          onClick: playRewardAd,
          className: "w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]",
          children: "Play Video Ad to Unlock"
        }
      ),
      /* @__PURE__ */ jsx(Link, { href: route("explore"), className: "block text-xs font-bold text-gray-500 hover:text-white transition-colors pt-4", children: "Return to Explore" })
    ] }) }),
    /* @__PURE__ */ jsx(
      EditorHeader,
      {
        handleSave,
        handleCloudSave,
        isSaving,
        isOwner,
        isFormatting,
        formatCode,
        setActiveSidebar,
        setActiveModal
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 flex flex-col", children: /* @__PURE__ */ jsxs(PanelGroup, { direction: "vertical", className: "flex-1 h-full", children: [
      /* @__PURE__ */ jsx(Panel, { defaultSize: showConsole ? 70 : 100, minSize: 20, children: /* @__PURE__ */ jsx(EditorPanels, { previewContent, hasPurchased, isOwner }) }),
      showConsole && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(PanelResizeHandle, { className: "h-1 bg-black hover:bg-cyan-500/30 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-px bg-white/10" }) }),
        /* @__PURE__ */ jsx(Panel, { defaultSize: 30, minSize: 10, children: /* @__PURE__ */ jsx(ConsolePanel, { logs, setLogs }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      EditorFooter,
      {
        showConsole,
        setShowConsole,
        activeSidebar,
        setActiveSidebar,
        setActiveModal,
        handleFork,
        handleExport,
        fetchCollections
      }
    ),
    /* @__PURE__ */ jsx(
      EditorSidebar,
      {
        activeSidebar,
        setActiveSidebar,
        projectData,
        setLogs,
        diffRevision: setDiffRevision,
        setActiveModal,
        handleSave,
        handleFork,
        handleCloudSave,
        fetchCollections
      }
    ),
    /* @__PURE__ */ jsx(
      EditorModals,
      {
        activeModal,
        setActiveModal,
        project: projectData,
        collections,
        addToCollection,
        createCollection,
        diffRevision
      }
    ),
    /* @__PURE__ */ jsx(
      CommandPalette,
      {
        isOpen: paletteOpen,
        onClose: () => setPaletteOpen(false),
        onExecute: handlePaletteExecute
      }
    )
  ] });
}
export {
  Editor as default
};
