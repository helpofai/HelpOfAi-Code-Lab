import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Menu, X, Github, Share2, Globe } from "lucide-react";
import { T as ThemeSwitcher } from "./ThemeSwitcher-Bh1r3iWC.js";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { N as NotificationDropdown } from "./NotificationDropdown-DwAPkSZZ.js";
import { A as AdUnit } from "./AdUnit-CJudqw2U.js";
function PublicLayout({ children }) {
  const { auth, siteSettings, globalAds } = usePage().props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "fixed top-0 left-0 right-0 h-[3px] bg-rainbow-gradient z-[200] origin-left",
        initial: { scaleX: 0 },
        animate: { scaleX: 1 },
        transition: { duration: 1 }
      }
    ),
    /* @__PURE__ */ jsx("nav", { className: `fixed top-0 w-full h-20 border-b transition-all duration-500 z-[100] px-6 md:px-12 ${scrolled ? "bg-[var(--bg-main)]/90 backdrop-blur-2xl border-[var(--border)]" : "bg-transparent border-transparent"}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto h-full flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-3 group", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500 text-white dark:bg-white dark:text-black rounded shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Code2, { size: 20 }) }),
          /* @__PURE__ */ jsx("span", { className: "text-xl font-black tracking-tighter text-[var(--text-main)] uppercase italic hidden xs:block", children: "HOACodeLab" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-l border-[var(--border)] pl-6 h-6", children: [
          /* @__PURE__ */ jsx("a", { href: "/#features", className: "hover:text-cyan-500 transition-colors", children: "Features" }),
          /* @__PURE__ */ jsx(Link, { href: route("explore"), className: "hover:text-cyan-500 transition-colors", children: "Explore" }),
          /* @__PURE__ */ jsx(Link, { href: route("marketplace"), className: "hover:text-cyan-500 transition-colors", children: "Marketplace" }),
          /* @__PURE__ */ jsx(Link, { href: route("blog.index"), className: "hover:text-cyan-500 transition-colors", children: "Blog" }),
          /* @__PURE__ */ jsx(Link, { href: "/p/about", className: "hover:text-cyan-500 transition-colors", children: "About" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx(ThemeSwitcher, {}) }),
        auth.user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [
          /* @__PURE__ */ jsx(NotificationDropdown, {}),
          /* @__PURE__ */ jsx(Link, { href: route("dashboard"), className: "px-5 md:px-6 py-2 border border-[var(--border)] rounded font-black text-[10px] uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all italic whitespace-nowrap", children: "Dashboard" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Link, { href: route("login"), className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors whitespace-nowrap", children: "Login" }),
          /* @__PURE__ */ jsx(Link, { href: route("register"), className: "px-5 md:px-8 py-2.5 bg-cyan-500 text-black rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg shadow-cyan-500/10 whitespace-nowrap", children: "Get Started" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsMobileMenuOpen(true), className: "lg:hidden p-2 text-[var(--text-muted)]", children: /* @__PURE__ */ jsx(Menu, { size: 20 }) })
      ] })
    ] }) }),
    globalAds?.top_banner && /* @__PURE__ */ jsx("div", { className: "pt-24 max-w-7xl mx-auto px-6 relative z-10", children: globalAds.top_banner.map((ad) => /* @__PURE__ */ jsx(AdUnit, { ad }, ad.id)) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isMobileMenuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIsMobileMenuOpen(false), className: "fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm" }),
      /* @__PURE__ */ jsxs(motion.div, { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, className: "fixed right-0 top-0 bottom-0 w-72 bg-[var(--bg-surface)] border-l border-[var(--border)] z-[120] p-8 flex flex-col shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-12", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest text-cyan-500 italic", children: "Navigation_Link" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsMobileMenuOpen(false), className: "text-[var(--text-muted)] hover:text-white", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-6", children: [
          { name: "Home", href: "/" },
          { name: "Features", href: "/#features" },
          { name: "Blog", href: route("blog.index") },
          { name: "About", href: "/p/about" },
          { name: "Pricing", href: "/#pricing" }
        ].map((item) => /* @__PURE__ */ jsx(
          Link,
          {
            href: item.href,
            onClick: () => setIsMobileMenuOpen(false),
            className: "block text-lg font-black uppercase italic tracking-tighter hover:text-cyan-500 transition-colors",
            children: item.name
          },
          item.name
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t border-[var(--border)] space-y-4", children: [
          /* @__PURE__ */ jsx(ThemeSwitcher, {}),
          /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]", children: "HOACodeLab" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "relative z-10 min-h-[calc(100vh-400px)]", children }),
    globalAds?.footer && /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 py-6 relative z-10 border-t border-[var(--border)]", children: globalAds.footer.map((ad) => /* @__PURE__ */ jsx(AdUnit, { ad }, ad.id)) }),
    /* @__PURE__ */ jsx("footer", { className: "py-24 bg-[var(--bg-main)] border-t border-[var(--border)] px-6 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-8 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded", children: /* @__PURE__ */ jsx(Code2, { size: 24 }) }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-black tracking-tighter text-[var(--text-main)] uppercase italic", children: "HOACodeLab" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest max-w-xs leading-loose italic", children: "Secure. Scalable. Optimized development substrate for modern web creators." }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: [Github, Share2, Globe].map((Icon, i) => /* @__PURE__ */ jsx("a", { href: "#", className: "p-3 border border-[var(--border)] rounded-full text-[var(--text-muted)] hover:text-cyan-500 transition-all", children: /* @__PURE__ */ jsx(Icon, { size: 16 }) }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8 text-left", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic", children: "Platform" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/#features", className: "hover:text-white transition-colors", children: "Features" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/#pricing", className: "hover:text-white transition-colors", children: "Pricing" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: route("blog.index"), className: "hover:text-white transition-colors", children: "Blog" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: "/p/about", className: "hover:text-white transition-colors", children: "About" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8 text-left", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic", children: "Legal" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: "/p/privacy-policy", className: "hover:text-white transition-colors", children: "Privacy Policy" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: "/p/terms", className: "hover:text-white transition-colors", children: "Terms of Service" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: "/p/contact", className: "hover:text-white transition-colors", children: "Contact" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-8 text-left", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-[9px] font-black uppercase tracking-[0.5em] text-cyan-500 italic", children: "Newsletter" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest", children: "Subscribe for system patches." }),
          /* @__PURE__ */ jsxs("form", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("input", { type: "email", placeholder: "USER@NET.LINK", className: "flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-cyan-500" }),
            /* @__PURE__ */ jsx("button", { className: "px-6 py-3 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-[10px] tracking-widest rounded hover:bg-cyan-500 hover:text-white transition-colors shadow-lg", children: "Join" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]", children: [
        /* @__PURE__ */ jsx("span", { children: "© 2026 HOACodeLab // All Rights Reserved" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-full", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" }),
          /* @__PURE__ */ jsx("span", { children: "Systems Operational" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  PublicLayout as P
};
