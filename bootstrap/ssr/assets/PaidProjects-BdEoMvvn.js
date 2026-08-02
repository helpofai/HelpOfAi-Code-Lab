import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head, Link } from "@inertiajs/react";
import { Tag, ArrowLeft, Play, ExternalLink, ShoppingBag, Package } from "lucide-react";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
const MiniPreview = ({ project }) => {
  const { code, title, settings } = project;
  const srcDoc = useMemo(() => {
    if (!code) return "";
    const html = typeof code === "object" ? code.html : "";
    const css = typeof code === "object" ? code.css : "";
    const js = typeof code === "object" ? code.js : "";
    const externalLibs = settings?.externalLibraries || [];
    const libs = externalLibs.map(
      (lib) => lib.endsWith(".css") ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"><\/script>`
    ).join("\n");
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    body { background: white; margin: 0; padding: 0; overflow: hidden; height: 100vh; }
                    .scaled-content { 
                        transform: scale(0.5); 
                        transform-origin: top left; 
                        width: 200%; 
                        height: 200%; 
                    }
                    ${css || ""}
                </style>
                ${libs}
            </head>
            <body><div class="scaled-content">${html || ""}</div><script>${js || ""}<\/script></body>
            </html>
        `;
  }, [code, settings]);
  if (!code) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-[var(--bg-main)] opacity-20", children: /* @__PURE__ */ jsx(Package, { size: 40 }) });
  }
  return /* @__PURE__ */ jsx(
    "iframe",
    {
      srcDoc,
      className: "w-full h-full border-none bg-white pointer-events-none",
      sandbox: "allow-scripts",
      title,
      loading: "lazy"
    }
  );
};
function PaidProjects({ auth, projects }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic", children: "Paid_Projects_Catalog" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Paid Projects" }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 px-10 space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 rounded-lg text-cyan-500", children: /* @__PURE__ */ jsx(Tag, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Marketplace Assets" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest", children: "Active monetization nodes" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("admin.sales.index"), className: "px-6 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
              " Back to Sales"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: projects.data.map((project) => /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm hover:border-cyan-500/30 transition-all group flex flex-col", children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-video bg-[var(--bg-main)] relative overflow-hidden flex items-center justify-center border-b border-[var(--border)]", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-10 transition-opacity z-10 pointer-events-none" }),
              /* @__PURE__ */ jsx(MiniPreview, { project }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20", children: /* @__PURE__ */ jsx(Link, { href: route("editor", project.slug), className: "p-3 bg-cyan-500 text-black rounded-full shadow-xl hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Play, { size: 20, fill: "black" }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30", children: [
                "$",
                project.price
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 flex-1 flex flex-col space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic truncate", children: project.title }),
                  /* @__PURE__ */ jsx(Link, { href: route("editor", project.slug), target: "_blank", className: "text-[var(--text-muted)] hover:text-cyan-500 transition-colors", children: /* @__PURE__ */ jsx(ExternalLink, { size: 14 }) })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-[var(--text-muted)] font-bold mt-1", children: [
                  "Owned by @",
                  project.user?.name
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 pt-6 border-t border-[var(--border)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(ShoppingBag, { size: 10, className: "text-cyan-500" }),
                    " Total Sales"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-black text-[var(--text-main)] font-mono", children: project.purchases_count })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(Tag, { size: 10, className: "text-emerald-500" }),
                    " Revenue"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-sm font-black text-emerald-500 font-mono", children: [
                    "$",
                    (project.purchases_count * project.price).toFixed(2)
                  ] })
                ] })
              ] })
            ] })
          ] }, project.id)) }),
          projects.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 pt-10", children: projects.links.map((link, i) => /* @__PURE__ */ jsx(
            Link,
            {
              href: link.url,
              dangerouslySetInnerHTML: { __html: link.label },
              className: `px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${link.active ? "bg-cyan-500 border-cyan-500 text-black shadow-lg" : "bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]"} ${!link.url && "opacity-30 pointer-events-none"}`
            },
            i
          )) })
        ] })
      ]
    }
  );
}
export {
  PaidProjects as default
};
