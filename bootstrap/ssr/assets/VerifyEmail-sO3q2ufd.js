import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import { G as GuestLayout } from "./GuestLayout-kM2zbqWZ.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { Mail, ShieldCheck, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "./ProBackground-D5SseK5s.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
function VerifyEmail({ status }) {
  const { post, processing } = useForm({});
  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Verify Email" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-8 space-y-6 text-center", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { scale: 0.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { type: "spring", stiffness: 200, damping: 20 },
          className: "relative",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full w-24 h-24 mx-auto animate-pulse" }),
            /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-main)] p-6 rounded-3xl border border-[var(--border)] shadow-2xl", children: [
              /* @__PURE__ */ jsx(Mail, { className: "text-cyan-400 w-12 h-12" }),
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-[var(--bg-surface)]", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "text-white w-4 h-4" }) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 max-w-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black uppercase tracking-widest text-[var(--text-main)]", children: "Verify Identity" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[var(--text-muted)] leading-relaxed", children: "Transmission logged. To gain full access to the mainframe, please verify your neural link (email address) using the encrypted message we just dispatched." })
      ] }),
      status === "verification-link-sent" && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl w-full",
          children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-black uppercase tracking-widest text-left", children: "A fresh verification token has been deployed to your inbox." })
          ]
        }
      ),
      /* @__PURE__ */ jsx("form", { onSubmit: submit, className: "w-full space-y-6 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ jsxs(
          PrimaryButton,
          {
            disabled: processing,
            className: "w-full flex justify-center items-center py-4 text-xs font-black",
            children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 mr-2" }),
              "RESEND_VERIFICATION_TOKEN",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center border-t border-[var(--border)] pt-6 mt-4", children: /* @__PURE__ */ jsx(
          Link,
          {
            href: route("logout"),
            method: "post",
            as: "button",
            className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-cyan-400 transition-colors flex items-center space-x-2",
            children: /* @__PURE__ */ jsx("span", { children: "Terminate_Session" })
          }
        ) })
      ] }) })
    ] })
  ] });
}
export {
  VerifyEmail as default
};
