import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { P as PublicLayout } from "./PublicLayout-Bk6Js6hx.js";
import { Head, Link } from "@inertiajs/react";
import { ShieldCheck, Box, Calendar, Github, ArrowRight } from "lucide-react";
import { P as ProjectPreviewContent } from "./ProjectPreviewContent-D0P3mb04.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./ProBackground-D5SseK5s.js";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "./AdUnit-CJudqw2U.js";
function VendorProfile({ vendor, projects }) {
  return /* @__PURE__ */ jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: `${vendor.name} - Profile` }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: vendor.bio || `View ${vendor.name}'s profile and premium projects.` }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: `${vendor.name} on Marketplace` }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: vendor.bio || `View ${vendor.name}'s profile and premium projects.` }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: vendor.avatar || "" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
          "@type": "Person",
          "name": vendor.name,
          "identifier": vendor.username,
          "description": vendor.bio,
          "image": vendor.avatar
        }
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative pt-32 pb-20 overflow-hidden bg-[var(--bg-main)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0 opacity-20", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center md:items-start gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "shrink-0 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-[var(--bg-main)] shadow-2xl relative z-10 bg-[var(--bg-surface)] flex items-center justify-center", children: vendor.avatar ? /* @__PURE__ */ jsx("img", { src: vendor.avatar, alt: vendor.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-5xl font-black uppercase", children: vendor.name.charAt(0) }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 -right-4 bg-[var(--bg-main)] p-1 rounded-xl z-20 shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-emerald-400 to-emerald-600 px-3 py-1 rounded-lg flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { size: 14, className: "text-white" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-white uppercase tracking-widest", children: "Verified" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center md:text-left flex-1 mt-4 md:mt-0", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight mb-2", children: vendor.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-cyan-500 font-mono text-sm mb-6 flex items-center justify-center md:justify-start gap-2", children: [
            "@",
            vendor.username || vendor.name.toLowerCase().replace(/\s+/g, ""),
            /* @__PURE__ */ jsx("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] text-lg max-w-2xl leading-relaxed mb-8", children: vendor.bio || "Full-stack developer building premium tools, templates, and systems. Specialized in React, Laravel, and advanced UI/UX architecture." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium", children: [
              /* @__PURE__ */ jsx(Box, { size: 16, className: "text-cyan-500" }),
              /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-[var(--text-main)] font-black", children: projects.length }),
                " Products"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 16, className: "text-emerald-500" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Joined ",
                /* @__PURE__ */ jsx("strong", { className: "text-[var(--text-main)]", children: vendor.created_at })
              ] })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)] py-20 border-t border-[var(--border)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-12", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-black text-[var(--text-main)] tracking-tight", children: [
          "Products by ",
          vendor.name
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] mt-2", children: "Premium source code, templates, and tools." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: projects.length > 0 ? projects.map((project) => /* @__PURE__ */ jsxs("div", { className: "group flex flex-col bg-[var(--bg-main)] border border-[var(--border)] rounded-3xl overflow-hidden hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "aspect-video relative overflow-hidden bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-main)] border-b border-[var(--border)]", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 p-4", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500 ease-out", children: project.project_type === "monaco" ? /* @__PURE__ */ jsx(ProjectPreviewContent, { project }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-4 bg-[var(--bg-main)]", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500", children: /* @__PURE__ */ jsx(Github, { size: 32 }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono", children: "GitHub_Repository" })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-4", children: /* @__PURE__ */ jsx("div", { className: "px-2 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider", children: project.project_type === "monaco" ? "Code Editor" : "Repository" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-[var(--text-main)] mb-2 group-hover:text-cyan-500 transition-colors", children: /* @__PURE__ */ jsx(Link, { href: `/project/${project.slug}`, children: project.title }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] text-sm line-clamp-2 mb-6 flex-1", children: project.description || "Premium software package with full source code access." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-6 border-t border-[var(--border)]", children: [
            /* @__PURE__ */ jsx("div", { className: "font-mono", children: /* @__PURE__ */ jsxs("span", { className: "text-lg font-black text-[var(--text-main)]", children: [
              "$",
              project.price
            ] }) }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: `/project/${project.slug}`,
                className: "w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-main)] group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-white transition-all shadow-sm",
                children: /* @__PURE__ */ jsx(ArrowRight, { size: 18, className: "transform group-hover:-rotate-45 transition-transform duration-300" })
              }
            )
          ] })
        ] })
      ] }, project.id)) : /* @__PURE__ */ jsxs("div", { className: "col-span-full py-20 text-center bg-[var(--bg-main)] rounded-3xl border border-dashed border-[var(--border)]", children: [
        /* @__PURE__ */ jsx(Box, { size: 48, className: "mx-auto text-[var(--border)] mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-[var(--text-muted)]", children: "This user hasn't published any projects yet." })
      ] }) })
    ] }) })
  ] });
}
export {
  VendorProfile as default
};
