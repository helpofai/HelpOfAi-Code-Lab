import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, Shield, Database, CloudOff, RefreshCw, Code2, ExternalLink, Trash2, FileJson, Zap, Key, CheckCircle2, Cloud, Search, LayoutGrid, List } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import { T as TextInput } from "./TextInput-DN069oHs.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function CloudFileThumbnail({ file }) {
  const [fileContent, setFileContent] = useState(null);
  const [compiledContent, setCompiledContent] = useState({ html: "", css: "", js: "" });
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`/api/google-drive/fetch/${file.id}`);
        setFileContent(res.data);
        let cCss = res.data.code.css || "";
        let cJs = res.data.code.js || "";
        const preps = res.data.settings?.preprocessors || { css: "css", js: "js" };
        if (preps.css === "scss" || preps.css === "sass") {
          if (window.Sass) {
            window.Sass.compile(cCss, (result) => {
              if (result.text) setCompiledContent((prev) => ({ ...prev, css: result.text }));
            });
          }
        } else {
          setCompiledContent((prev) => ({ ...prev, css: cCss }));
        }
        if (preps.js === "babel" || preps.js === "typescript") {
          if (window.Babel) {
            try {
              const result = window.Babel.transform(cJs, { presets: ["env", "react", "typescript"] }).code;
              setCompiledContent((prev) => ({ ...prev, js: result }));
            } catch (e) {
            }
          }
        } else {
          setCompiledContent((prev) => ({ ...prev, js: cJs }));
        }
        setCompiledContent((prev) => ({ ...prev, html: res.data.code.html || "" }));
      } catch (e) {
      }
    };
    fetchContent();
  }, [file.id]);
  const srcDoc = useMemo(() => {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    html, body { background: #1d1e22; margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                    ${compiledContent.css}
                </style>
            </head>
            <body>${compiledContent.html}<script>${compiledContent.js}<\/script></body>
            </html>
        `;
  }, [compiledContent]);
  return /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-[#1d1e22] relative overflow-hidden", children: fileContent ? /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-[2s]", children: /* @__PURE__ */ jsx("iframe", { srcDoc, title: "t", className: "border-none pointer-events-none absolute", style: { width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "0 0" }, sandbox: "allow-scripts" }) }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-white/5", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" }) }) });
}
function CloudSync() {
  const { auth } = usePage().props;
  const [driveFiles, setDriveFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [importingId, setImportingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const toast = useToast();
  const { data, setData, post, processing } = useForm({
    google_client_id: auth.user.personal_google_client_id || "",
    google_client_secret: auth.user.personal_google_client_secret || ""
  });
  const fetchDriveFiles = useCallback(async () => {
    if (!auth.user.google_drive_token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get("/api/google-drive/list");
      setDriveFiles(res.data);
    } catch (e) {
      console.error("Connection_Refused");
    } finally {
      setIsLoading(false);
    }
  }, [auth.user.google_drive_token]);
  useEffect(() => {
    if (!window.Babel) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
      document.head.appendChild(script);
    }
    if (!window.Sass) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js";
      document.head.appendChild(script);
    }
    fetchDriveFiles();
  }, [fetchDriveFiles]);
  const submitConfig = (e) => {
    e.preventDefault();
    post(route("google-drive.save-config"), {
      preserveScroll: true,
      onSuccess: () => toast.success("Personal_API_Ciphers_Stored")
    });
  };
  const handleGoogleAuth = async () => {
    if (!auth.user.personal_google_client_id) return toast.warning("Config_Required");
    try {
      const res = await axios.get("/api/google-drive/auth");
      window.location.href = res.data.url;
    } catch (e) {
      toast.error("Auth_Failed");
    }
  };
  const disconnectDrive = async () => {
    if (!confirm("Terminate satellite link? Access tokens will be purged.")) return;
    try {
      await axios.post("/api/google-drive/disconnect");
      router.reload();
    } catch (e) {
      toast.error("Disconnect_Failed");
    }
  };
  const importToLocal = async (fileId) => {
    setImportingId(fileId);
    try {
      const res = await axios.get(`/api/google-drive/fetch/${fileId}`);
      const saveRes = await axios.post("/api/projects", {
        title: res.data.title + " (Imported)",
        code: res.data.code,
        settings: res.data.settings || {},
        is_public: false,
        is_private: true
      });
      toast.success("Node_Replicated: Redirecting to local instance.");
      window.location.href = `/editor/${saveRes.data.slug}`;
    } catch (e) {
      toast.error("Replication_Failed");
    } finally {
      setImportingId(null);
    }
  };
  const deleteDriveFile = async (fileId) => {
    if (!confirm("Destroy remote node permanently?")) return;
    try {
      await axios.delete(`/api/google-drive/delete/${fileId}`);
      setDriveFiles(driveFiles.filter((f) => f.id !== fileId));
    } catch (e) {
      toast.error("Deletion_Failed");
    }
  };
  const filteredFiles = driveFiles.filter(
    (f) => f.name.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 relative overflow-hidden transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6 relative z-10 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 border border-cyan-500/20 rounded shadow-sm", children: /* @__PURE__ */ jsx(Cloud, { className: "text-cyan-500", size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-[var(--text-main)] uppercase italic leading-none", children: "Cloud Sync" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1", children: "Google Drive Integration" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full md:w-auto", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 14 }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search Remote Array...",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 w-full"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex bg-[var(--bg-surface)] p-1 rounded border border-[var(--border)]", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => setViewMode("grid"), className: `p-2 rounded ${viewMode === "grid" ? "bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm" : "text-[var(--text-muted)]"}`, children: /* @__PURE__ */ jsx(LayoutGrid, { size: 16 }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => setViewMode("list"), className: `p-2 rounded ${viewMode === "list" ? "bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-sm" : "text-[var(--text-muted)]"}`, children: /* @__PURE__ */ jsx(List, { size: 16 }) })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: fetchDriveFiles, className: "p-2.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:border-cyan-500/30 transition-all", children: /* @__PURE__ */ jsx(RefreshCw, { size: 14, className: isLoading ? "animate-spin text-cyan-500" : "text-[var(--text-muted)]" }) })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Cloud Hub // Advanced Sync" }),
          /* @__PURE__ */ jsx("div", { className: "relative min-h-screen p-6 md:p-12 overflow-y-auto text-left", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto relative z-10 space-y-12", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-12", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-purple-500 font-black text-[10px] uppercase tracking-widest italic", children: [
                    /* @__PURE__ */ jsx(Link, { size: 14 }),
                    " Connection Settings"
                  ] }),
                  /* @__PURE__ */ jsxs("form", { onSubmit: submitConfig, className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 space-y-6 shadow-xl relative overflow-hidden group", children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-purple-500/20 group-hover:bg-purple-500 transition-all" }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "Client_ID" }),
                        /* @__PURE__ */ jsx(TextInput, { value: data.google_client_id, onChange: (e) => setData("google_client_id", e.target.value), className: "bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "Client_Secret" }),
                        /* @__PURE__ */ jsx(TextInput, { type: "password", value: data.google_client_secret, onChange: (e) => setData("google_client_secret", e.target.value), className: "bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, className: "w-full justify-center py-4 text-[10px] tracking-[0.2em]", children: "Save Settings" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] space-y-6 relative overflow-hidden group", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-emerald-500", children: [
                    /* @__PURE__ */ jsx(Shield, { size: 16 }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "Connection Status" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-[9px] font-bold uppercase tracking-widest", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[var(--text-muted)]", children: "State:" }),
                      /* @__PURE__ */ jsx("span", { className: auth.user.google_drive_token ? "text-emerald-500" : "text-rose-500", children: auth.user.google_drive_token ? "ACTIVE" : "OFFLINE" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[var(--text-muted)]", children: "Root Folder:" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-cyan-500 truncate ml-4", children: [
                        "ID_",
                        auth.user.google_drive_folder_id || "N/A"
                      ] })
                    ] })
                  ] }),
                  !auth.user.google_drive_token ? /* @__PURE__ */ jsx("button", { onClick: handleGoogleAuth, className: "w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-cyan-500 transition-all italic", children: "Connect Google Drive" }) : /* @__PURE__ */ jsx("button", { onClick: disconnectDrive, className: "w-full py-3 bg-rose-500/10 border border-rose-500/20 rounded text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all", children: "Disconnect" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 space-y-8 text-left", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-full min-h-[600px]", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-elevated)]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(Database, { size: 16, className: "text-cyan-500" }),
                    /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-main)] italic", children: "Cloud Files" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx("div", { className: "px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] font-black text-cyan-500 uppercase tracking-widest", children: "Folder: /HOACodeLab_Nodes" }) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-x-auto p-6", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest animate-pulse text-cyan-500 italic", children: "Loading Files..." })
                ] }) : !auth.user.google_drive_token ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-32 opacity-40 italic space-y-4", children: [
                  /* @__PURE__ */ jsx(CloudOff, { size: 48, className: "mx-auto" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest block", children: "Connect Google Drive to view files." })
                ] }) : filteredFiles.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-32 text-[var(--text-muted)] italic", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "No files found." }) }) : viewMode === "grid" ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: filteredFiles.map((file, idx) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: idx * 0.05 }, className: "group bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all shadow-lg text-left", children: [
                  /* @__PURE__ */ jsxs("div", { className: "aspect-video bg-black relative border-b border-[var(--border)] overflow-hidden", children: [
                    /* @__PURE__ */ jsx(CloudFileThumbnail, { file }),
                    /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-widest z-20 bg-cyan-500/10 border-cyan-500/30 text-cyan-500", children: "Cloud" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black text-[var(--text-main)] uppercase italic tracking-tight group-hover:text-cyan-500 transition-colors mb-4 truncate", children: file.name.replace(".hoa.json", "") }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsxs("button", { onClick: () => importToLocal(file.id), disabled: importingId === file.id, className: "flex-1 py-2 bg-cyan-500 text-black rounded font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2", children: [
                        importingId === file.id ? /* @__PURE__ */ jsx(RefreshCw, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsx(Code2, { size: 12 }),
                        " Open"
                      ] }),
                      /* @__PURE__ */ jsx("a", { href: file.webViewLink, target: "_blank", className: "p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-white transition-colors", children: /* @__PURE__ */ jsx(ExternalLink, { size: 14 }) }),
                      /* @__PURE__ */ jsx("button", { onClick: () => deleteDriveFile(file.id), className: "p-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-500 hover:bg-rose-500 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
                    ] })
                  ] })
                ] }, file.id)) }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
                  /* @__PURE__ */ jsx("thead", { className: "bg-[var(--bg-main)]/50 border-b border-[var(--border)] text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-8 py-5", children: "File Name" }),
                    /* @__PURE__ */ jsx("th", { className: "px-8 py-5 text-right", children: "Operations" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[var(--border)]", children: filteredFiles.map((file) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-white/[0.02] transition-colors group", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "p-3 bg-white/5 rounded-2xl text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500", children: /* @__PURE__ */ jsx(FileJson, { size: 18 }) }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-black uppercase tracking-tighter block leading-none", children: file.name.replace(".hoa.json", "") }),
                        /* @__PURE__ */ jsxs("span", { className: "text-[8px] text-[var(--text-muted)] font-mono uppercase italic", children: [
                          "Synced: ",
                          new Date(file.modifiedTime).toLocaleString()
                        ] })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => importToLocal(file.id),
                          disabled: importingId === file.id,
                          className: "p-3 bg-cyan-500/10 rounded-xl text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all",
                          title: "Load Remote Node",
                          children: /* @__PURE__ */ jsx(Code2, { size: 16, className: importingId === file.id ? "animate-spin" : "" })
                        }
                      ),
                      /* @__PURE__ */ jsx("a", { href: file.webViewLink, target: "_blank", className: "p-3 bg-white/5 rounded-xl text-[var(--text-muted)] hover:text-white transition-all", children: /* @__PURE__ */ jsx(ExternalLink, { size: 16 }) }),
                      /* @__PURE__ */ jsx("button", { onClick: () => deleteDriveFile(file.id), className: "p-3 bg-rose-500/10 rounded-xl text-rose-500/50 hover:bg-rose-500 hover:text-white transition-all", children: /* @__PURE__ */ jsx(Trash2, { size: 16 }) })
                    ] }) })
                  ] }, file.id)) })
                ] }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-20 pt-20 border-t border-[var(--border)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-16", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/10 rounded-full", children: [
                  /* @__PURE__ */ jsx(Zap, { size: 12, className: "text-cyan-500" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic", children: "Setup Instructions" })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black uppercase italic tracking-tighter", children: "Easy Setup Guide" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)] font-bold uppercase tracking-[0.2em]", children: "Follow the signal path to establish your decentralized node." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-12 relative", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-emerald-500 opacity-20 hidden md:block" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-8 relative z-10", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]", children: /* @__PURE__ */ jsx(Key, { size: 18, className: "text-cyan-500" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-lg font-black uppercase italic tracking-tight text-white", children: "01. Enable Google Drive API" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase px-2 py-1 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-md", children: "Google Cloud Console" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 text-[10px] font-bold uppercase tracking-widest leading-loose text-[var(--text-muted)] italic", children: [
                      "Open the ",
                      /* @__PURE__ */ jsx("a", { href: "https://console.cloud.google.com", target: "_blank", className: "text-cyan-400 underline", children: "Google_Cloud_Dashboard" }),
                      " and create a project. In the ",
                      /* @__PURE__ */ jsx("span", { className: "text-white", children: "Library" }),
                      ", enable the ",
                      /* @__PURE__ */ jsx("span", { className: "text-white underline", children: "Google_Drive_API" }),
                      ". This grants the kernel permission to interact with satellite storage."
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-8 relative z-10", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]", children: /* @__PURE__ */ jsx(Shield, { size: 18, className: "text-purple-500" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4 text-left", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 text-left", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-lg font-black uppercase italic tracking-tight text-white", children: "02. Create Credentials" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase px-2 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-md text-left", children: "OAuth Client ID" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 space-y-6", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold uppercase tracking-widest leading-loose text-[var(--text-muted)] italic", children: [
                        "Create an ",
                        /* @__PURE__ */ jsx("span", { className: "text-white font-black", children: "OAuth_2.0_Client_ID" }),
                        " (Web Application). Inject the following URI into the ",
                        /* @__PURE__ */ jsx("span", { className: "text-white", children: "Authorized Redirect URIs" }),
                        " field:"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
                        /* @__PURE__ */ jsxs("code", { className: "block bg-black px-4 py-3 rounded-xl text-emerald-500 lowercase text-[11px] font-mono border border-white/5 break-all leading-normal group-hover:border-emerald-500/30 transition-all", children: [
                          window.location.origin,
                          "/api/google-drive/callback"
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "bg-emerald-500 text-black text-[8px] font-black px-2 py-1 rounded shadow-xl uppercase", children: "Callback URL" }) })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-8 relative z-10", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]", children: /* @__PURE__ */ jsx(RefreshCw, { size: 18, className: "text-emerald-500" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-lg font-black uppercase italic tracking-tight text-white", children: "03. Connect Account" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md", children: "Final Step" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "bg-black border border-white/5 rounded-2xl p-8 space-y-6 text-left", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                      /* @__PURE__ */ jsx(CheckCircle2, { className: "text-emerald-500 shrink-0", size: 16 }),
                      /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold uppercase tracking-[0.1em] leading-relaxed text-slate-400 italic", children: [
                        "Commit your Client ID and Secret in the ",
                        /* @__PURE__ */ jsx("span", { className: "text-white", children: "Connection Settings" }),
                        " panel. Click ",
                        /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: "'Connect Google Drive'" }),
                        " to perform the handshake. The platform will autonomousely create a ",
                        /* @__PURE__ */ jsx("span", { className: "text-white", children: "/HOACodeLab_Nodes" }),
                        " directory in your Drive root."
                      ] })
                    ] }) })
                  ] })
                ] })
              ] })
            ] }) })
          ] }) })
        ]
      }
    )
  ] });
}
export {
  CloudSync as default
};
