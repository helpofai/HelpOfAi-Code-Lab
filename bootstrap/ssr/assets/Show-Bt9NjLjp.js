import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import "react";
import { ArrowLeft, User, Calendar, Share2, Code2, ArrowRight } from "lucide-react";
import { P as PublicLayout } from "./PublicLayout-Bk6Js6hx.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./ProBackground-D5SseK5s.js";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "./AdUnit-CJudqw2U.js";
function BlogShow({ post, relatedPosts = [] }) {
  return /* @__PURE__ */ jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsxs("title", { children: [
        post.meta_title || post.title,
        " // HOACodeLab"
      ] }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: post.meta_description || (post.content ? post.content.substring(0, 160) : "") }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: post.meta_keywords || post.category }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: post.canonical_url || window.location.href }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: post.meta_title || post.title }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: post.meta_description || (post.content ? post.content.substring(0, 160) : "") }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "article" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: window.location.href }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: post.og_image ? `/storage/${post.og_image}` : post.image_path ? `/storage/${post.image_path}` : "/default-og.png" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: post.meta_title || post.title }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: post.meta_description || (post.content ? post.content.substring(0, 160) : "") }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: post.og_image ? `/storage/${post.og_image}` : post.image_path ? `/storage/${post.image_path}` : "/default-og.png" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 pt-32 pb-24 px-6 text-left", children: [
      /* @__PURE__ */ jsxs("article", { className: "max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs(Link, { href: route("blog.index"), className: "inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-purple-500 transition-colors mb-12", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
          " Return_To_Grid"
        ] }),
        /* @__PURE__ */ jsxs("header", { className: "mb-16 space-y-8", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded border border-purple-500/30 text-purple-500 text-[10px] font-black uppercase tracking-[0.2em]", children: post.category }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-tight", children: post.title }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest border-y border-[var(--border)] py-6", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(User, { size: 14 }),
              " ",
              post.user?.name
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 14 }),
              " ",
              new Date(post.published_at).toLocaleDateString()
            ] })
          ] })
        ] }),
        post.image_path && /* @__PURE__ */ jsx("div", { className: "mb-16 rounded-[2rem] overflow-hidden border border-[var(--border)] shadow-2xl", children: /* @__PURE__ */ jsx("img", { src: `/storage/${post.image_path}`, alt: post.title, className: "w-full h-auto" }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "prose prose-invert prose-lg max-w-none mx-auto text-left\n                            prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:text-[var(--text-main)] prose-headings:text-left\n                            prose-p:text-[var(--text-main)] prose-p:leading-relaxed prose-p:text-left\n                            prose-a:text-purple-500 prose-a:no-underline hover:prose-a:underline\n                            prose-strong:text-purple-400\n                            prose-pre:bg-[var(--bg-elevated)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-2xl\n                            prose-code:text-purple-400 prose-code:font-bold prose-code:bg-[var(--bg-elevated)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded\n                            prose-li:text-[var(--text-main)] prose-li:text-left prose-ul:text-[var(--text-main)] prose-ol:text-[var(--text-main)]\n                        ",
            dangerouslySetInnerHTML: { __html: post.content }
          }
        ),
        /* @__PURE__ */ jsxs("footer", { className: "mt-24 pt-12 border-t border-[var(--border)] flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest", children: "End_Of_Transmission" }),
          /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-purple-500 transition-colors", children: [
            /* @__PURE__ */ jsx(Share2, { size: 14 }),
            " Share_Signal"
          ] })
        ] })
      ] }),
      relatedPosts.length > 0 && /* @__PURE__ */ jsxs("section", { className: "max-w-7xl mx-auto mt-32 border-t border-[var(--border)] pt-24", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]", children: "Related_Data" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-center", children: "Recommended Signals" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: relatedPosts.map((relatedPost) => /* @__PURE__ */ jsxs(Link, { href: route("blog.show", relatedPost.slug), className: "group block h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500", children: [
          /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] bg-[var(--bg-elevated)] relative overflow-hidden", children: [
            relatedPost.image_path ? /* @__PURE__ */ jsx("img", { src: `/storage/${relatedPost.image_path}`, alt: relatedPost.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors", children: /* @__PURE__ */ jsx(Code2, { size: 48, className: "text-purple-500/20 group-hover:text-purple-500/40 transition-colors" }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white", children: relatedPost.category }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold uppercase leading-tight group-hover:text-purple-500 transition-colors line-clamp-2", children: relatedPost.title }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 flex items-center text-purple-500 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300", children: [
              "Read ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 14, className: "ml-2" })
            ] })
          ] })
        ] }, relatedPost.id)) })
      ] })
    ] })
  ] });
}
export {
  BlogShow as default
};
