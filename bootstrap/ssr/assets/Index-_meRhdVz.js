import { jsxs, jsx } from "react/jsx-runtime";
import { router, Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, Code2, User, Calendar, ArrowRight } from "lucide-react";
import { P as PublicLayout } from "./PublicLayout-Bk6Js6hx.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./ProBackground-D5SseK5s.js";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "./AdUnit-CJudqw2U.js";
function BlogIndex({ posts, categories, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [activeCategory, setActiveCategory] = useState(filters.category || "ALL");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (filters.search || "")) {
        router.get(route("blog.index"), { search, category: activeCategory !== "ALL" ? activeCategory : void 0 }, { preserveState: true, preserveScroll: true, replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    router.get(route("blog.index"), { search, category: cat !== "ALL" ? cat : void 0 }, { preserveState: true, preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Blog // Transmissions" }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 pt-32 pb-24 px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 12 }),
          " Signal_Stream"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-5xl md:text-7xl font-black uppercase tracking-tighter italic", children: "Transmissions" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-[var(--bg-surface)] border border-[var(--border)] p-2 md:p-4 rounded-3xl shadow-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 justify-center md:justify-start", children: ["ALL", ...categories].map((cat) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleCategoryChange(cat),
            className: `px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]"}`,
            children: cat
          },
          cat
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-64", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 14 }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Search Transmissions...",
              className: "w-full bg-[var(--bg-elevated)] border-none rounded-full py-3 pl-10 pr-4 text-xs font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-purple-500/50"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10", children: posts.data.length > 0 ? posts.data.map((post, i) => /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.1 },
          children: /* @__PURE__ */ jsxs(Link, { href: route("blog.show", post.slug), className: "group block h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500", children: [
            /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] bg-[var(--bg-elevated)] relative overflow-hidden", children: [
              post.image_path ? /* @__PURE__ */ jsx("img", { src: `/storage/${post.image_path}`, alt: post.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors", children: /* @__PURE__ */ jsx(Code2, { size: 48, className: "text-purple-500/20 group-hover:text-purple-500/40 transition-colors" }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white", children: post.category }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-4", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold uppercase leading-tight group-hover:text-purple-500 transition-colors line-clamp-2", children: post.title }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(User, { size: 12 }),
                  " ",
                  post.user.name
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { size: 12 }),
                  " ",
                  new Date(post.published_at).toLocaleDateString()
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-4 flex items-center text-purple-500 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300", children: [
                "Read_Transmission ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 14, className: "ml-2" })
              ] })
            ] })
          ] })
        },
        post.id
      )) : /* @__PURE__ */ jsxs("div", { className: "col-span-full py-32 text-center text-[var(--text-muted)] italic", children: [
        /* @__PURE__ */ jsx(Code2, { size: 48, className: "mx-auto mb-4 opacity-20" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-bold uppercase tracking-widest", children: "Signal_Lost" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs", children: "No transmissions found matching your criteria." })
      ] }) })
    ] }) })
  ] });
}
export {
  BlogIndex as default
};
