import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { Code2, Fingerprint, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { T as ThemeSwitcher } from "./ThemeSwitcher-Bh1r3iWC.js";
function GuestLayout({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-cyan-500/30 relative flex flex-col items-center justify-center p-6 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "fixed top-6 right-6 z-50", children: /* @__PURE__ */ jsx(ThemeSwitcher, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-20 w-full max-w-lg", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "flex flex-col items-center mb-12", children: [
        /* @__PURE__ */ jsx(Link, { href: "/", className: "relative group", children: /* @__PURE__ */ jsx("div", { className: "p-5 bg-cyan-500 text-white dark:bg-white dark:text-black rounded-2xl shadow-2xl transition-transform group-hover:scale-105 active:scale-95", children: /* @__PURE__ */ jsx(Code2, { size: 32, strokeWidth: 2 }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center space-y-2", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black italic uppercase tracking-tighter", children: "HOACodeLab" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-cyan-500 font-bold uppercase tracking-[0.5em]", children: "Secure Platform" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.1 },
          className: "bg-[var(--bg-surface)] border border-[var(--border)] p-10 md:p-16 rounded-[2rem] shadow-2xl relative overflow-hidden",
          children: /* @__PURE__ */ jsx("div", { className: "relative z-10", children })
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 0.4 },
          transition: { delay: 0.5 },
          className: "mt-12 flex justify-between items-center px-6 text-[8px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)]",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Fingerprint, { size: 12 }),
              " ",
              /* @__PURE__ */ jsx("span", { children: "System Secure" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { children: "v1.4.8" }),
              " ",
              /* @__PURE__ */ jsx(Cpu, { size: 12 })
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  GuestLayout as G
};
