import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { CheckCircle2, Activity, XCircle, Mail, Edit, Trash2, Search, Send, Plus } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
import { motion, AnimatePresence } from "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function EmailIndex({ templates, logs, stats }) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("templates");
  const handleDelete = (id) => {
    if (confirm("Delete this template?")) {
      router.delete(route("admin.email.destroy", id));
    }
  };
  const filteredTemplates = templates.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
  );
  const filteredLogs = logs.filter(
    (l) => l.recipient.toLowerCase().includes(search.toLowerCase()) || l.subject.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-500/10 border border-purple-400/30 rounded-lg text-purple-500", children: /* @__PURE__ */ jsx(Mail, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "Mail_System" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Intelligence Hub" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full md:w-auto", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 14 }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search Matrix...",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-purple-500/50 focus:ring-0 w-full"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("admin.email.send"), className: "flex items-center px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:text-purple-500 transition-all shrink-0", children: [
              /* @__PURE__ */ jsx(Send, { className: "mr-2", size: 14 }),
              " Send_Console"
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("admin.email.create"), className: "flex items-center px-6 py-2 bg-purple-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-purple-500/10 shrink-0", children: [
              /* @__PURE__ */ jsx(Plus, { className: "mr-2", size: 14, strokeWidth: 3 }),
              " New_Template"
            ] })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Email Settings" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-6 md:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto relative z-10 space-y-12", children: [
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                { label: "Protocols Executed", value: stats.total_sent, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5" },
                { label: "Broadcast Volume", value: stats.broadcasts, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/5" },
                { label: "Signal Failures", value: stats.total_failed, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/5" }
              ].map((stat, i) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.1 }, className: `p-6 rounded-3xl border border-[var(--border)] ${stat.bg} backdrop-blur-md flex items-center justify-between`, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1", children: stat.label }),
                  /* @__PURE__ */ jsx("p", { className: "text-3xl font-black italic", children: stat.value })
                ] }),
                /* @__PURE__ */ jsx(stat.icon, { className: stat.color, size: 32 })
              ] }, i)) }),
              /* @__PURE__ */ jsxs("div", { className: "flex border-b border-[var(--border)] overflow-x-auto no-scrollbar", children: [
                /* @__PURE__ */ jsxs("button", { onClick: () => setView("templates"), className: `px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${view === "templates" ? "text-purple-500" : "text-[var(--text-muted)] hover:text-white"}`, children: [
                  "Template_Protocols",
                  view === "templates" && /* @__PURE__ */ jsx(motion.div, { layoutId: "emailTab", className: "absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" })
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => setView("history"), className: `px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${view === "history" ? "text-purple-500" : "text-[var(--text-muted)] hover:text-white"}`, children: [
                  "Transmission_History",
                  view === "history" && /* @__PURE__ */ jsx(motion.div, { layoutId: "emailTab", className: "absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: view === "templates" ? /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
                filteredTemplates.map((template) => /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 hover:border-purple-500/50 transition-all shadow-xl group relative overflow-hidden", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-purple-500/10 group-hover:bg-purple-500 transition-all" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-4 bg-purple-500/5 rounded-2xl text-purple-500 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Mail, { size: 24 }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                      /* @__PURE__ */ jsx(Link, { href: route("admin.email.edit", template.id), className: "p-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-[var(--text-muted)] hover:text-purple-500 transition-all shadow-lg", children: /* @__PURE__ */ jsx(Edit, { size: 16 }) }),
                      /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(template.id), className: "p-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-[var(--text-muted)] hover:text-rose-500 transition-all shadow-lg", children: /* @__PURE__ */ jsx(Trash2, { size: 16 }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-black italic uppercase tracking-tighter mb-2", children: template.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6 truncate", children: template.subject }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-6 border-t border-[var(--border)]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-mono text-[var(--text-muted)] uppercase", children: [
                      "ID_",
                      template.id.toString().padStart(4, "0")
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-purple-500 uppercase tracking-widest", children: new Date(template.updated_at).toLocaleDateString() })
                  ] })
                ] }, template.id)),
                filteredTemplates.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic", children: "No protocols found in database." })
              ] }, "templates") : /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-[var(--bg-main)]/50 border-b border-[var(--border)] text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Recipient" }),
                  /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Subject" }),
                  /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Type" }),
                  /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Status" }),
                  /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Timestamp" })
                ] }) }),
                /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-[var(--border)] text-[10px] font-bold uppercase tracking-widest", children: [
                  filteredLogs.map((log) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-white/[0.02] transition-colors group", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-[var(--text-main)] italic", children: log.recipient }),
                    /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-[var(--text-muted)] truncate max-w-xs", children: log.subject }),
                    /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[8px] font-black ${log.type === "broadcast" ? "bg-purple-500/10 text-purple-500" : "bg-cyan-500/10 text-cyan-500"}`, children: log.type }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: log.status === "sent" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-emerald-500", children: "Delivered" })
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-rose-500" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "Failed" })
                    ] }) }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center gap-4", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[var(--text-muted)] font-mono text-[9px]", children: new Date(log.created_at).toLocaleString() }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => router.post(route("admin.email.resend", log.id)),
                          className: "p-2 hover:bg-purple-500/10 rounded-lg text-purple-500 opacity-0 group-hover:opacity-100 transition-all",
                          title: "Resend Protocol",
                          children: /* @__PURE__ */ jsx(RefreshCw, { size: 14 })
                        }
                      )
                    ] }) })
                  ] }, log.id)),
                  filteredLogs.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-8 py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic", children: "No transmission logs detected." }) })
                ] })
              ] }) }) }, "history") })
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  EmailIndex as default
};
