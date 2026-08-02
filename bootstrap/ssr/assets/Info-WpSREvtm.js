import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function AdminInfo({ infoFiles }) {
  const [activeFile, setActiveFile] = useState(infoFiles[0]?.name || null);
  const activeContent = infoFiles.find((f) => f.name === activeFile)?.content || "";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center w-full relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-rose-500/10 border border-rose-400/30 rounded-lg", children: /* @__PURE__ */ jsx(Info, { className: "text-rose-500", size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-[var(--text-main)] uppercase italic leading-none", children: "System_Intelligence" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] text-rose-500 font-bold uppercase tracking-[0.4em] mt-1", children: "Documentation & Logistics" })
          ] })
        ] }) }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "System Intelligence" }),
          /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col min-h-full", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full border-b border-[var(--border)] bg-[var(--bg-surface)]/50 backdrop-blur-md overflow-x-auto no-scrollbar shrink-0 sticky top-0 z-20 transition-all", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-8 flex", children: infoFiles.map((file) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveFile(file.name),
                className: `flex items-center gap-3 px-8 py-5 transition-all relative group whitespace-nowrap ${activeFile === file.name ? "text-rose-500" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`,
                children: [
                  /* @__PURE__ */ jsx(FileText, { size: 14, className: activeFile === file.name ? "opacity-100" : "opacity-40 group-hover:opacity-100" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.2em] italic", children: file.display }),
                  activeFile === file.name && /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      layoutId: "activeTabIndicator",
                      className: "absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]",
                      initial: false
                    }
                  )
                ]
              },
              file.name
            )) }) }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 bg-[var(--bg-main)]/30 relative", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto p-8 lg:p-16 text-left", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -15 },
                transition: { duration: 0.25 },
                className: "prose prose-invert prose-rose max-w-none text-left\r\n                                        prose-headings:text-left prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic\r\n                                        prose-h1:text-5xl prose-h1:mb-12 prose-h1:text-white\r\n                                        prose-h2:text-2xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4\r\n                                        prose-p:text-[var(--text-muted)] prose-p:leading-relaxed prose-p:text-lg\r\n                                        prose-code:bg-rose-500/10 prose-code:text-rose-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none\r\n                                        prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-pre:p-8\r\n                                        prose-li:text-[var(--text-muted)]\r\n                                        prose-strong:text-white\r\n                                        prose-table:text-left\r\n                                    ",
                children: /* @__PURE__ */ jsx(
                  ReactMarkdown,
                  {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeRaw],
                    children: activeContent || "# Empty\nThis page contains no data."
                  }
                )
              },
              activeFile
            ) }) }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  AdminInfo as default
};
