import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Head, Link } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-Bk6Js6hx.js";
import { Package, Github, ExternalLink, Download, Key, User, ShieldCheck, Star, FileCode, Clock, ShoppingCart, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./ProBackground-D5SseK5s.js";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "./AdUnit-CJudqw2U.js";
function MarketplaceProduct({ project, canEdit }) {
  const { auth } = usePage().props;
  const isOwner = project.user_id === auth.user?.id;
  const hasPurchased = canEdit && !isOwner;
  const [activeTab, setActiveTab] = useState(0);
  return /* @__PURE__ */ jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `${project.title} - Marketplace` }),
    /* @__PURE__ */ jsx("div", { className: "pt-24 pb-20 px-6 max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-start gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-full", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl flex items-center justify-center shrink-0 shadow-inner", children: /* @__PURE__ */ jsx(Package, { size: 24, className: "text-cyan-500" }) }),
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-sm", children: project.category })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--text-main)] leading-[1.1]", children: project.title }),
              /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-[var(--text-muted)] font-medium max-w-3xl leading-relaxed", children: project.meta_description || "A premium source code product." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-4 border-t border-[var(--border)] w-full", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mr-2 flex items-center", children: "Tags:" }),
              project.tags?.map((tag, i) => /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border)] rounded-md text-[10px] font-bold uppercase tracking-wider hover:border-cyan-500/50 transition-colors cursor-default shadow-sm", children: tag }, i))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden mt-8", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" }),
          project.settings?.thumbnail_url ? /* @__PURE__ */ jsx("img", { src: project.settings.thumbnail_url, alt: project.title, className: "w-full h-auto max-h-[400px] object-cover rounded-2xl mb-6 shadow-lg border border-[var(--border)]" }) : /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 mt-6", children: /* @__PURE__ */ jsx(Github, { size: 48, className: "text-emerald-500" }) }),
          project.settings?.gallery_images && project.settings.gallery_images.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full px-4", children: project.settings.gallery_images.map((img, i) => /* @__PURE__ */ jsx("img", { src: img, alt: `Gallery ${i}`, className: "w-full h-24 object-cover rounded-xl border border-[var(--border)] hover:scale-105 transition-transform cursor-pointer shadow-md" }, i)) }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase tracking-tighter text-[var(--text-main)] italic", children: "Source Code Repository" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--text-muted)] max-w-md mx-auto mt-2", children: "This product is linked directly to the vendors' private GitHub repository. Upon purchase, you will receive an automated download of the latest code." }),
          project.settings?.demo_url && /* @__PURE__ */ jsxs("a", { href: project.settings.demo_url, target: "_blank", rel: "noopener noreferrer", className: "mt-6 mb-4 px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-emerald-500 text-[var(--text-main)] font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ExternalLink, { size: 16, className: "text-emerald-500" }),
            " View Live Demo"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 mt-8", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] uppercase tracking-widest italic border-b border-[var(--border)] pb-4", children: "Product Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "p-3 bg-emerald-500/10 rounded-xl text-emerald-500", children: /* @__PURE__ */ jsx(Download, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-[var(--text-main)] uppercase tracking-wider", children: "Instant Delivery" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)] mt-1", children: "Download the `.zip` archive immediately after purchase." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "p-3 bg-cyan-500/10 rounded-xl text-cyan-500", children: /* @__PURE__ */ jsx(Key, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-[var(--text-main)] uppercase tracking-wider", children: "License Key" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)] mt-1", children: "Includes a unique cryptographically signed RSA License Key." })
              ] })
            ] })
          ] })
        ] }),
        project.settings?.markdown_files?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl mt-8", children: [
          /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto border-b border-[var(--border)] bg-[var(--bg-elevated)]", children: project.settings.markdown_files.map((file, idx) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab(idx),
              className: `px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${activeTab === idx ? "border-emerald-500 text-emerald-500 bg-[var(--bg-surface)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]/50"}`,
              children: file.name
            },
            idx
          )) }),
          /* @__PURE__ */ jsx("div", { className: "p-8 prose prose-sm max-w-none dark:prose-invert prose-headings:font-black prose-a:text-cyan-500 hover:prose-a:text-cyan-400", children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], children: project.settings.markdown_files[activeTab]?.content || "No content." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl sticky top-32", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 pb-6 border-b border-[var(--border)]", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[var(--bg-main)] rounded-xl flex items-center justify-center border border-[var(--border)] relative shadow-inner shrink-0", children: /* @__PURE__ */ jsx(User, { size: 20, className: "text-emerald-500" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-black text-[var(--text-main)] uppercase tracking-tight flex items-center gap-2", children: [
              "@",
              project.user?.name,
              project.user?.identity_status === "verified" && /* @__PURE__ */ jsx(ShieldCheck, { size: 14, className: "text-emerald-500", title: "Verified Identity" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsx(Star, { size: 10, className: "text-amber-400 fill-amber-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]", children: project.user?.level ? `Level ${project.user.level} Vendor` : "New Vendor" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-elevated)] p-5 rounded-2xl border border-[var(--border)] mt-6 mb-6 space-y-4 shadow-inner", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[var(--text-muted)] font-bold uppercase tracking-wider flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FileCode, { size: 14, className: "text-cyan-500" }),
              " License"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[var(--text-main)] font-black uppercase bg-[var(--bg-main)] px-2 py-1 rounded border border-[var(--border)] shadow-sm", children: "Standard" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[var(--text-muted)] font-bold uppercase tracking-wider flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Clock, { size: 14, className: "text-purple-500" }),
              " Updated"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[var(--text-main)] font-black uppercase bg-[var(--bg-main)] px-2 py-1 rounded border border-[var(--border)] shadow-sm", children: "Recently" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[var(--text-muted)] font-bold uppercase tracking-wider flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Package, { size: 14, className: "text-emerald-500" }),
              " Version"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[var(--text-main)] font-black uppercase bg-[var(--bg-main)] px-2 py-1 rounded border border-[var(--border)] shadow-sm", children: project.version || "1.0.0" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center mb-6 mt-8", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]", children: "Purchase Price" }),
          /* @__PURE__ */ jsxs("div", { className: "text-5xl font-black text-[var(--text-main)] tracking-tighter", children: [
            "$",
            project.price
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: isOwner ? /* @__PURE__ */ jsx("div", { className: "w-full flex items-center justify-center gap-3 py-5 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] font-black uppercase text-xs tracking-widest rounded-xl", children: "This is your product" }) : hasPurchased ? /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("my-account"),
            className: "w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]",
            children: [
              /* @__PURE__ */ jsx(Download, { size: 18 }),
              " Access Downloads"
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("checkout.project", project.slug),
            className: "w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]",
            children: [
              /* @__PURE__ */ jsx(ShoppingCart, { size: 18 }),
              " Buy Now"
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 pt-6 border-t border-[var(--border)] mt-6", children: [
          "Full Source Code Download",
          "RSA Digital License Key",
          "Quality Assured",
          "Secure Payment Escrow"
        ].map((perk, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[10px] uppercase font-bold text-[var(--text-muted)]", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: "text-emerald-500" }),
          perk
        ] }, i)) })
      ] }) })
    ] }) })
  ] });
}
export {
  MarketplaceProduct as default
};
