import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { FileText, Unlock, Lock, Eye, Edit, Trash2, Search, Plus } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function PageIndex({ pages }) {
  const [search, setSearch] = useState("");
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this page?")) {
      router.delete(route("admin.pages.destroy", id));
    }
  };
  const filteredPages = pages.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-500", children: /* @__PURE__ */ jsx(FileText, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "Page_Matrix" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Content Substrate" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full md:w-auto", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 14 }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search Archives...",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-cyan-500/50 focus:ring-0 w-full transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("admin.pages.create"), className: "flex items-center px-6 py-2 bg-cyan-500 text-black rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-cyan-500/10 shrink-0", children: [
              /* @__PURE__ */ jsx(Plus, { className: "mr-2", size: 14, strokeWidth: 3 }),
              " New_Page_Node"
            ] })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Page Management" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-6 md:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto relative z-10", children: /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-[var(--bg-main)]/50 border-b border-[var(--border)] text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Identity (Title)" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Signal_Path (Slug)" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Visibility" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6", children: "Type" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-right", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-[var(--border)] text-[10px] font-bold uppercase tracking-widest", children: [
                filteredPages.map((page) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-white/[0.02] transition-colors group", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded bg-cyan-500/5 flex items-center justify-center text-cyan-500/50 group-hover:text-cyan-500 transition-colors", children: /* @__PURE__ */ jsx(FileText, { size: 14 }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-[var(--text-main)] italic", children: page.title })
                  ] }) }),
                  /* @__PURE__ */ jsxs("td", { className: "px-8 py-6 text-[var(--text-muted)] font-mono text-[9px]", children: [
                    "/",
                    page.slug
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: page.is_published ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Unlock, { size: 12, className: "text-emerald-500" }),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-emerald-500", children: "Live" })
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Lock, { size: 12, className: "text-rose-500" }),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "Hibernating" })
                  ] }) }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: page.is_system ? /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[8px] font-black border border-rose-500/20", children: "System_Core" }) : /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[8px] font-black border border-[var(--border)]", children: "Custom_Node" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center gap-2", children: [
                    /* @__PURE__ */ jsx("a", { href: `/p/${page.slug}`, target: "_blank", className: "p-2 hover:bg-cyan-500/10 rounded-lg text-cyan-500 transition-all opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsx(Eye, { size: 14 }) }),
                    /* @__PURE__ */ jsx(Link, { href: route("admin.pages.edit", page.id), className: "p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-white transition-all", children: /* @__PURE__ */ jsx(Edit, { size: 14 }) }),
                    !page.is_system && /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(page.id), className: "p-2 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-all", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
                  ] }) })
                ] }, page.id)),
                filteredPages.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-8 py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic", children: "No page nodes detected in current sector." }) })
              ] })
            ] }) }) }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  PageIndex as default
};
