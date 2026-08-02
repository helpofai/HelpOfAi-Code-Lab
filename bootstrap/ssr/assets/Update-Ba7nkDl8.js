import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, Head, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { Clock, RefreshCw, Loader2, ArrowUpCircle, Terminal, AlertCircle, CheckCircle, Box, Layers, Database, GitBranch, GitCommit, Server, Activity } from "lucide-react";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import { AnimatePresence, motion } from "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function Update({ currentVersion, buildId, lastCommitDate, commits, localPendingMigrations, systemInfo, gitStatus }) {
  const { flash = {} } = usePage().props;
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const [updateLogs, setUpdateLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState(null);
  const logsEndRef = useRef(null);
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [updateLogs]);
  const handleCheckUpdate = () => {
    setIsChecking(true);
    router.post(route("admin.update.check"), {}, {
      preserveScroll: true,
      onFinish: () => {
        setIsChecking(false);
        setLastCheckedTime((/* @__PURE__ */ new Date()).toLocaleTimeString());
      }
    });
  };
  const handleUpdateNow = async () => {
    if (!confirm("Are you sure you want to update the system? This might cause brief downtime.")) return;
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || usePage().props.auth?.csrf_token;
    if (!token) {
      toast.error("Security token missing. Please refresh the page and try again.");
      return;
    }
    console.log("Starting update process with token:", token.substring(0, 10) + "...");
    setIsUpdating(true);
    setUpdateLogs([{ message: "Initializing connection...", timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(), status: "info" }]);
    setProgress(5);
    try {
      const response = await fetch(route("admin.update.start"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("Stream reader finished.");
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split("\n\n");
        buffer = lines.pop();
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith(":")) continue;
          if (trimmedLine.startsWith("data: ")) {
            try {
              const jsonStr = trimmedLine.replace(/^data: /, "").trim();
              const data = JSON.parse(jsonStr);
              console.log("Log received:", data.message);
              setUpdateLogs((prev) => [...prev, data]);
              if (data.progress) setProgress(data.progress);
              if (data.status === "done" || data.status === "success" && data.progress === 100) {
                setProgress(100);
                setTimeout(() => window.location.reload(), 3e3);
              }
            } catch (e) {
              console.error("JSON Parse Error:", e, trimmedLine);
            }
          }
        }
      }
    } catch (error) {
      console.error("Update Stream Error:", error);
      setUpdateLogs((prev) => [...prev, {
        message: `CONNECTION_ERROR: ${error.message}. Check browser console for details.`,
        status: "error",
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      }]);
    } finally {
      console.log("Update flow concluded.");
    }
  };
  const handleMigrate = async () => {
    if (!confirm("Execute database schema update? This action is irreversible.")) return;
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || usePage().props.auth?.csrf_token;
    if (!token) return toast.error("Security token missing.");
    setIsUpdating(true);
    setUpdateLogs([{ message: "Initializing schema migration protocol...", timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(), status: "info" }]);
    setProgress(10);
    try {
      const response = await fetch(route("admin.update.migrate"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop();
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.replace(/^data: /, ""));
              setUpdateLogs((prev) => [...prev, data]);
              if (data.progress) setProgress(data.progress);
              if (data.status === "done") setTimeout(() => window.location.reload(), 2e3);
            } catch (e) {
            }
          }
        }
      }
    } catch (error) {
      setUpdateLogs((prev) => [...prev, { message: `MIGRATION_ERROR: ${error.message}`, status: "error", timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() }]);
    }
  };
  const handleInstallDependencies = async () => {
    if (!confirm("Install PHP dependencies (Composer)? This may take a few minutes.")) return;
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || usePage().props.auth?.csrf_token;
    if (!token) return toast.error("Security token missing.");
    setIsUpdating(true);
    setUpdateLogs([{ message: "Initializing Composer...", timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(), status: "info" }]);
    setProgress(10);
    try {
      const response = await fetch(route("admin.update.dependencies"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token }
      });
      await processStream(response);
    } catch (error) {
      setUpdateLogs((prev) => [...prev, { message: `ERROR: ${error.message}`, status: "error", timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() }]);
    }
  };
  const handleBuildAssets = async () => {
    if (!confirm("Build Frontend Assets (NPM)? This is resource intensive.")) return;
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || usePage().props.auth?.csrf_token;
    if (!token) return toast.error("Security token missing.");
    setIsUpdating(true);
    setUpdateLogs([{ message: "Initializing Asset Compiler...", timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(), status: "info" }]);
    setProgress(10);
    try {
      const response = await fetch(route("admin.update.assets"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token }
      });
      await processStream(response);
    } catch (error) {
      setUpdateLogs((prev) => [...prev, { message: `ERROR: ${error.message}`, status: "error", timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() }]);
    }
  };
  const processStream = async (response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop();
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data: ")) {
          try {
            const data = JSON.parse(trimmed.replace(/^data: /, ""));
            setUpdateLogs((prev) => [...prev, data]);
            if (data.progress) setProgress(data.progress);
            if (data.status === "done") setTimeout(() => window.location.reload(), 2e3);
          } catch (e) {
          }
        }
      }
    }
  };
  const hasChangedFiles = flash.changedFiles && flash.changedFiles.length > 0;
  const hasRemoteMigrations = flash.remotePendingMigrations && flash.remotePendingMigrations.length > 0;
  const hasLocalMigrations = localPendingMigrations && localPendingMigrations.length > 0;
  const latestVersion = flash.latestVersion;
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-500/10 border border-purple-400/30 rounded-lg", children: /* @__PURE__ */ jsx(GitBranch, { className: "text-purple-400", size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white tracking-tighter uppercase leading-tight italic", children: "System_Update" }),
          /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500/60 uppercase tracking-[0.4em] font-bold", children: "Version Control Protocol" })
        ] })
      ] }) }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "System Update" }),
        /* @__PURE__ */ jsxs("div", { className: "p-8 lg:p-12 max-w-6xl mx-auto space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-32 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full ${flash.updateAvailable ? "bg-amber-500 animate-pulse" : "bg-green-500"} shadow-[0_0_10px_currentColor]` }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black uppercase tracking-widest text-white/50", children: [
                    "Current Status: ",
                    flash.updateAvailable ? "Update Available" : "Up to Date"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center gap-3", children: [
                    "VER: ",
                    /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: currentVersion }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 uppercase tracking-tighter font-black", children: "Stable" }),
                    latestVersion && latestVersion !== currentVersion && /* @__PURE__ */ jsxs("span", { className: "text-slate-500 ml-2 text-xl", children: [
                      "→ ",
                      /* @__PURE__ */ jsx("span", { className: "text-amber-400", children: latestVersion })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] md:text-xs text-slate-600 font-mono uppercase tracking-widest bg-white/5 px-2 py-1 rounded", children: [
                    "Build: ",
                    buildId
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs font-mono text-slate-400 flex items-center", children: [
                  /* @__PURE__ */ jsx(Clock, { size: 12, className: "mr-2" }),
                  " Last Sync: ",
                  lastCommitDate
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row w-full lg:w-auto gap-3 sm:space-x-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-full sm:w-auto", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleCheckUpdate,
                      disabled: isChecking || isUpdating,
                      className: `group flex-1 sm:flex-initial justify-center px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed ${isChecking ? "animate-pulse" : ""}`,
                      children: [
                        /* @__PURE__ */ jsx(RefreshCw, { size: 14, className: isChecking ? "animate-spin" : "group-hover:rotate-180 transition-transform" }),
                        /* @__PURE__ */ jsx("span", { children: isChecking ? "Syncing..." : "Check for Updates" })
                      ]
                    }
                  ),
                  lastCheckedTime && /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-slate-500 text-center font-mono", children: [
                    "Last checked: ",
                    lastCheckedTime
                  ] })
                ] }),
                flash.updateAvailable && (gitStatus === "OK" ? /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: handleUpdateNow,
                    disabled: isUpdating,
                    className: `group flex-1 sm:flex-initial justify-center px-6 md:px-8 py-3 md:py-4 ${isUpdating ? "bg-purple-800" : "bg-purple-600 hover:bg-purple-500"} text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl transition-all flex items-center space-x-3 shadow-lg shadow-purple-500/20 disabled:opacity-80 disabled:cursor-not-allowed`,
                    children: [
                      isUpdating ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx(ArrowUpCircle, { size: 14, className: "group-hover:translate-y-[-2px] transition-transform" }),
                      /* @__PURE__ */ jsx("span", { children: isUpdating ? "Updating..." : "Update Now" })
                    ]
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-[10px] font-bold text-rose-400 uppercase tracking-wide flex items-center justify-center", children: "Git/Proc_Open Restricted." }))
              ] })
            ] }),
            /* @__PURE__ */ jsx(AnimatePresence, { children: isUpdating && /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { height: 0, opacity: 0 },
                animate: { height: "auto", opacity: 1 },
                exit: { height: 0, opacity: 0 },
                className: "mt-10 relative z-10",
                children: /* @__PURE__ */ jsxs("div", { className: "bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl", children: [
                  /* @__PURE__ */ jsxs("div", { className: "px-6 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                      /* @__PURE__ */ jsx(Terminal, { size: 12, className: "text-purple-400" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Update Log" })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "text-purple-400 font-mono text-xs font-bold", children: [
                      progress,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "p-6 font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto custom-scrollbar bg-black/40", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    updateLogs.map((log, i) => /* @__PURE__ */ jsxs("div", { className: `flex items-start space-x-3 ${log.status === "error" ? "text-rose-400" : log.status === "success" ? "text-green-400" : "text-slate-300"}`, children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-slate-600 shrink-0 select-none", children: [
                        "[",
                        log.timestamp || "--:--",
                        "]"
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "break-all whitespace-pre-wrap", children: log.message })
                    ] }, i)),
                    /* @__PURE__ */ jsx("div", { ref: logsEndRef })
                  ] }) }),
                  /* @__PURE__ */ jsx("div", { className: "w-full bg-white/5 h-1.5 relative overflow-hidden", children: /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { width: 0 },
                      animate: { width: `${progress}%` },
                      className: "h-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-[0_0_15px_#a855f7]"
                    }
                  ) })
                ] })
              }
            ) }),
            flash.message && !isUpdating && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                className: `mt-8 p-4 rounded-xl border ${flash.updateAvailable ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-green-500/10 border-green-500/30 text-green-400"} flex items-center space-x-3 relative z-10`,
                children: [
                  flash.updateAvailable ? /* @__PURE__ */ jsx(AlertCircle, { size: 20 }) : /* @__PURE__ */ jsx(CheckCircle, { size: 20 }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: flash.message })
                ]
              }
            )
          ] }),
          !isUpdating && /* @__PURE__ */ jsxs("div", { className: "bg-slate-900/40 border border-white/5 rounded-[2rem] p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
              /* @__PURE__ */ jsx(Terminal, { size: 20, className: "text-slate-400" }),
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase tracking-widest text-slate-400", children: "Advanced" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-xs font-bold text-white uppercase tracking-wider", children: "Dependency Manager" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 mt-1", children: "Install PHP libraries via Composer." })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: handleInstallDependencies,
                    disabled: isUpdating,
                    className: "w-full px-4 py-2 bg-sky-500/10 hover:bg-sky-500 hover:text-white border border-sky-500/20 text-sky-500 font-bold uppercase text-[9px] tracking-widest rounded transition-all flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx(Box, { size: 12 }),
                      "Update PHP Libs"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-xs font-bold text-white uppercase tracking-wider", children: "Asset Compiler" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 mt-1", children: "Build frontend assets via NPM." })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: handleBuildAssets,
                    disabled: isUpdating,
                    className: "w-full px-4 py-2 bg-pink-500/10 hover:bg-pink-500 hover:text-white border border-pink-500/20 text-pink-500 font-bold uppercase text-[9px] tracking-widest rounded transition-all flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx(Layers, { size: 12 }),
                      "Build Assets"
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          (hasLocalMigrations || hasRemoteMigrations) && !isUpdating && /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
              /* @__PURE__ */ jsx(Database, { size: 20, className: "text-amber-500" }),
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase tracking-widest text-amber-500", children: "Database Status" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-white/40", children: "Local Pending Migrations" }),
                  hasLocalMigrations && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleMigrate,
                      disabled: isUpdating,
                      className: "px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-[9px] tracking-widest rounded transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2",
                      children: [
                        isUpdating ? /* @__PURE__ */ jsx(Loader2, { size: 10, className: "animate-spin" }) : /* @__PURE__ */ jsx(Database, { size: 10 }),
                        "Run Migrations"
                      ]
                    }
                  )
                ] }),
                hasLocalMigrations ? /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: localPendingMigrations.map((m) => /* @__PURE__ */ jsxs("li", { className: "text-xs font-mono text-white bg-black/40 px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: m }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-amber-500 font-bold uppercase", children: "Pending" })
                ] }, m)) }) : /* @__PURE__ */ jsxs("div", { className: "text-xs text-green-400 font-bold uppercase flex items-center", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { size: 14, className: "mr-2" }),
                  " Local Schema Synced"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-white/40", children: "Incoming Migrations (Remote)" }),
                hasRemoteMigrations ? /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: flash.remotePendingMigrations.map((m) => /* @__PURE__ */ jsxs("li", { className: "text-xs font-mono text-white bg-black/40 px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: m.split("/").pop() }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-amber-500 font-bold uppercase", children: "Incoming" })
                ] }, m)) }) : /* @__PURE__ */ jsxs("div", { className: "text-xs text-green-400 font-bold uppercase flex items-center", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { size: 14, className: "mr-2" }),
                  " No Incoming Schema Changes"
                ] })
              ] })
            ] })
          ] }),
          hasChangedFiles && !isUpdating && /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-black/40 border border-white/5 rounded-[2rem] p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx(GitBranch, { size: 20, className: "text-cyan-500" }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase tracking-widest text-cyan-500", children: "Changed Files" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black uppercase tracking-widest text-white/30", children: [
                flash.changedFiles.length,
                " Files Modified"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-h-96 overflow-y-auto custom-scrollbar space-y-1", children: flash.changedFiles.map((file, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 p-3 hover:bg-white/5 rounded-xl transition-colors font-mono text-xs border-b border-white/5 last:border-0", children: [
              /* @__PURE__ */ jsxs("span", { className: `w-6 text-center font-bold ${file.status === "M" ? "text-amber-400" : file.status === "A" ? "text-green-400" : "text-rose-400"}`, children: [
                "[",
                file.status,
                "]"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-300 truncate", children: file.file })
            ] }, i)) })
          ] }),
          !isUpdating && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 px-2", children: [
                /* @__PURE__ */ jsx(Terminal, { size: 16, className: "text-purple-500" }),
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-black uppercase tracking-[0.3em] text-white", children: "Changelog" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "bg-black/20 border border-white/5 rounded-2xl overflow-hidden", children: commits.map((commit, i) => /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: i * 0.05 },
                  className: "p-6 border-b border-white/5 hover:bg-white/5 transition-colors group",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                        /* @__PURE__ */ jsx(GitCommit, { size: 16, className: "text-slate-600 group-hover:text-purple-400 transition-colors" }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-purple-400/60 group-hover:text-purple-400 transition-colors", children: commit.hash })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase tracking-wider", children: commit.time })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-300 group-hover:text-white transition-colors pl-7", children: commit.message }),
                    /* @__PURE__ */ jsxs("div", { className: "pl-7 mt-2 text-[9px] font-black uppercase tracking-widest text-slate-600", children: [
                      "Authored by: ",
                      commit.author
                    ] })
                  ]
                },
                commit.hash
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 px-2", children: [
                /* @__PURE__ */ jsx(Server, { size: 16, className: "text-cyan-500" }),
                /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-2", children: [
                  "System Info",
                  /* @__PURE__ */ jsx(Activity, { size: 10, className: "text-cyan-500/50 animate-pulse" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-black/20 border border-white/5 rounded-2xl p-6 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-slate-500", children: "PHP Runtime" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-sm font-mono text-white flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { children: systemInfo?.php_version || "8.x" }),
                    /* @__PURE__ */ jsx("span", { className: "text-white/20 text-[10px]", children: systemInfo?.os })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-px bg-white/5" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-slate-500", children: "Core Framework" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-sm font-mono text-white", children: [
                    "Laravel ",
                    systemInfo?.laravel_version
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-px bg-white/5" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-slate-500", children: "Environment" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                      /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full animate-pulse ${systemInfo?.environment === "production" ? "bg-green-500" : "bg-amber-500"}` }),
                      /* @__PURE__ */ jsx("span", { className: `text-sm font-bold uppercase ${systemInfo?.environment === "production" ? "text-green-500" : "text-amber-500"}`, children: systemInfo?.environment || "Unknown" })
                    ] }),
                    systemInfo?.debug_mode && /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-wider", children: "Debug_Mode" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-px bg-white/5" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1", children: "Database" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-white uppercase font-bold", children: systemInfo?.database_connection })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1", children: "Cache" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-white uppercase font-bold", children: systemInfo?.cache_driver })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
                  /* @__PURE__ */ jsx(Activity, { className: "text-cyan-400", size: 20 }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest text-white", children: "Server Time" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-mono text-cyan-400", children: systemInfo?.server_time }),
                /* @__PURE__ */ jsx("p", { className: "text-[9px] text-cyan-500/50 mt-1 uppercase tracking-widest", children: systemInfo?.timezone })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Update as default
};
