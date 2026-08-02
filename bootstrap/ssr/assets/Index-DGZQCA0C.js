import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head, Link, router } from "@inertiajs/react";
import "react";
import { Eye, EyeOff, Edit, Trash2, FileText, Plus } from "lucide-react";
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
function BlogIndex({ posts }) {
  const handleDelete = (id) => {
    if (confirm("Permanently delete this post?")) {
      router.delete(route("admin.blog.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500", children: /* @__PURE__ */ jsx(FileText, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "Blog system" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Content Management" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Link, { href: route("admin.blog.create"), className: "flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl", children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2", size: 14, strokeWidth: 3 }),
            " New_Entry"
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Blog Management" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto relative z-10", children: /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[var(--border)] bg-[var(--bg-elevated)]", children: [
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: "Title" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: "Category" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] text-right", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[var(--border)]", children: posts.map((post) => /* @__PURE__ */ jsxs("tr", { className: "group hover:bg-[var(--bg-elevated)] transition-colors", children: [
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[var(--text-main)]", children: post.title }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: [
                    "/",
                    post.slug
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-500 px-2 py-1 rounded border border-purple-500/20", children: post.category }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${post.is_published ? "text-emerald-500" : "text-amber-500"}`, children: [
                  post.is_published ? /* @__PURE__ */ jsx(Eye, { size: 14 }) : /* @__PURE__ */ jsx(EyeOff, { size: 14 }),
                  post.is_published ? "Published" : "Draft"
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                  /* @__PURE__ */ jsx(Link, { href: route("admin.blog.edit", post.id), className: "p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg hover:border-purple-500 hover:text-purple-500 transition-colors", children: /* @__PURE__ */ jsx(Edit, { size: 14 }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(post.id), className: "p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
                ] }) })
              ] }, post.id)) })
            ] }) }) }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  BlogIndex as default
};
