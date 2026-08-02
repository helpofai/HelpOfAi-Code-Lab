import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head } from "@inertiajs/react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCheck, Loader2, CheckCircle, Save, ToggleRight, ChevronDown } from "lucide-react";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
const Section = ({ title, icon: Icon, children, defaultOpen = true, color = "indigo" }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const colors = {
    indigo: "text-indigo-500 border-indigo-500/30",
    emerald: "text-emerald-500 border-emerald-500/30",
    cyan: "text-cyan-500 border-cyan-500/30",
    rose: "text-rose-500 border-rose-500/30"
  };
  const textColor = colors[color].split(" ")[0];
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setIsOpen(!isOpen),
            className: "w-full flex items-center justify-between p-8 hover:bg-white/5 transition-colors",
            children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-[0.4em] text-white/60 flex items-center", children: [
                /* @__PURE__ */ jsx(Icon, { size: 16, className: `mr-3 ${textColor}` }),
                " ",
                title
              ] }),
              /* @__PURE__ */ jsx(ChevronDown, { className: `text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsx("div", { className: "p-8 pt-0 space-y-6 border-t border-white/5 mt-2", children })
          }
        ) })
      ]
    }
  );
};
function FeatureManagement({ settings }) {
  const { data, setData, post, processing, recentlySuccessful } = useForm({
    settings
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.features.update"), {
      preserveScroll: true
    });
  };
  const handleToggle = (key) => {
    setData("settings", {
      ...data.settings,
      [key]: data.settings[key] === "1" ? "0" : "1"
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-emerald-500/10 border border-emerald-400/30 rounded-lg", children: /* @__PURE__ */ jsx(ToggleRight, { className: "text-emerald-400", size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white tracking-tighter uppercase leading-tight italic", children: "Feature_Management" }),
          /* @__PURE__ */ jsx("p", { className: "text-[8px] text-emerald-500/60 uppercase tracking-[0.4em] font-bold", children: "System Capabilities Control" })
        ] })
      ] }) }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Feature Management" }),
        /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
          /* @__PURE__ */ jsx(AnimatedGrid, {}),
          /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto relative z-10", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
            /* @__PURE__ */ jsx(Section, { title: "Authentication & Security", icon: ShieldCheck, color: "emerald", children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white/5 p-6 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 bg-emerald-500/10 rounded-lg mt-1", children: /* @__PURE__ */ jsx(UserCheck, { className: "text-emerald-500", size: 16 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-white uppercase tracking-tight", children: "Require Email Verification" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-white/50 mt-1", children: "When enabled, users must verify their email address before accessing the dashboard or protected areas." })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleToggle("feature_user_verification"),
                  className: `relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out focus:outline-none shrink-0 ${data.settings.feature_user_verification === "1" ? "bg-emerald-500" : "bg-white/20"}`,
                  children: /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${data.settings.feature_user_verification === "1" ? "translate-x-7" : "translate-x-0"}`
                    }
                  )
                }
              )
            ] }) }) }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-8", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "group flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
                children: processing ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 animate-spin", size: 18 }) : recentlySuccessful ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2", size: 18 }),
                  "Saved"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Save, { className: "mr-2 group-hover:rotate-12 transition-transform", size: 18 }),
                  "Save_Configuration"
                ] })
              }
            ) })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  FeatureManagement as default
};
