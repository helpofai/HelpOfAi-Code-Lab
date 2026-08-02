import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Globe, Clock, Zap } from "lucide-react";
import { P as PublicLayout } from "./PublicLayout-Bk6Js6hx.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./ProBackground-D5SseK5s.js";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "./AdUnit-CJudqw2U.js";
function PageViewer({ page }) {
  return /* @__PURE__ */ jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: page.meta_title || `${page.title} // HOACodeLab` }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: page.meta_description }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: page.meta_keywords })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "relative z-10 pt-48 pb-32 px-6", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-0.5 bg-cyan-500" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic", children: [
              "Node_Protocol_",
              page.id
            ] })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-5xl md:text-7xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-none mb-12", children: page.title }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8 mb-20 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] border-y border-[var(--border)] py-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Globe, { size: 14, className: "text-cyan-500/40" }),
              " Signal: Global"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Clock, { size: 14, className: "text-cyan-500/40" }),
              " Revised: ",
              new Date(page.updated_at).toLocaleDateString()
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Zap, { size: 14, className: "text-cyan-500/40" }),
              " Verified: Stable"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "prose prose-invert prose-cyan max-w-none mx-auto text-left\r\n                                prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:text-[var(--text-main)] prose-headings:text-left\r\n                                prose-p:text-[var(--text-muted)] prose-p:leading-relaxed prose-p:text-lg\r\n                                prose-strong:text-white\r\n                                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline\r\n                                prose-code:bg-cyan-500/10 prose-code:text-cyan-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded\r\n                                prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-pre:p-8\r\n                                prose-li:text-[var(--text-muted)]\r\n                            ",
              dangerouslySetInnerHTML: { __html: page.content }
            }
          )
        ]
      }
    ) }) })
  ] });
}
export {
  PageViewer as default
};
