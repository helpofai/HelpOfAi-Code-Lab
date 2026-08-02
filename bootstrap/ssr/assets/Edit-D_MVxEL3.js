import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout, U as UserLevelBadge } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, Head } from "@inertiajs/react";
import DeleteUserForm from "./DeleteUserForm-BTWD-efZ.js";
import UpdatePasswordForm from "./UpdatePasswordForm-BdyY6w2r.js";
import UpdateProfileInformation from "./UpdateProfileInformationForm-CNo_7Ror.js";
import IdentityVerificationForm from "./IdentityVerificationForm-H9PFSPP6.js";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
import { User, BadgeCheck, Fingerprint, Shield, Crown, AlertTriangle } from "lucide-react";
import "react";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
import "./InputError-BBff0LOp.js";
import "./InputLabel-CmSwOA3P.js";
import "./Modal-DoHBVxpV.js";
import "./TextInput-DN069oHs.js";
import "./PrimaryButton-KUoqN0Ht.js";
import "./ToastProvider-DwHz5v_B.js";
function Edit({ mustVerifyEmail, status }) {
  const user = usePage().props.auth.user;
  const isPro = user.role === "admin" || user.role === "paid-user";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-500", children: /* @__PURE__ */ jsx(User, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "User Profile" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Identity & Security" })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Profile" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-[var(--bg-elevated)] border-2 border-cyan-500/30 flex items-center justify-center text-cyan-500 mb-6 shadow-lg shadow-cyan-500/10", children: /* @__PURE__ */ jsx(User, { size: 48, strokeWidth: 1.5 }) }),
                    /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black uppercase tracking-tight text-[var(--text-main)] flex items-center justify-center gap-2", children: [
                      user.name,
                      user.identity_status === "verified" && /* @__PURE__ */ jsx(BadgeCheck, { className: "text-emerald-500", size: 20, title: "Verified Identity" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-2", children: /* @__PURE__ */ jsx(UserLevelBadge, { level: user.level, size: "md" }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-[var(--text-muted)] mt-2", children: user.email }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-8 w-full space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(Fingerprint, { size: 16, className: "text-cyan-500" }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "User_ID" })
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold text-[var(--text-main)]", children: [
                          "#",
                          user.id.toString().padStart(4, "0")
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(Shield, { size: 16, className: "text-emerald-500" }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Clearance" })
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded", children: user.role || "User" })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
                    /* @__PURE__ */ jsx(Crown, { size: 20, className: "text-amber-500" }),
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest", children: "Access_Protocols" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: `p-5 rounded-2xl border transition-all ${!isPro ? "border-cyan-500/50 bg-cyan-500/5" : "border-[var(--border)] opacity-50"}`, children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-cyan-500", children: "Initiate" }),
                        !isPro && /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20", children: "Current" })
                      ] }),
                      /* @__PURE__ */ jsx("h4", { className: "text-lg font-black italic", children: "Free_Tier" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[9px] text-[var(--text-muted)] uppercase mt-2", children: "10 Neural Cores • Community Access" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: `p-5 rounded-2xl border transition-all ${isPro ? "border-amber-500/50 bg-amber-500/5" : "border-[var(--border)] hover:border-amber-500/30"}`, children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-amber-500", children: "Operator" }),
                        isPro && /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20", children: "Active" })
                      ] }),
                      /* @__PURE__ */ jsx("h4", { className: "text-lg font-black italic", children: "Pro_Link" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[9px] text-[var(--text-muted)] uppercase mt-2", children: "Unlimited Cores • Private Nodes • SSH Access" }),
                      !isPro && /* @__PURE__ */ jsx("button", { className: "w-full mt-6 py-3 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all shadow-lg shadow-amber-500/20", children: "Upgrade_Clearance" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
                /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-xl", children: /* @__PURE__ */ jsx(IdentityVerificationForm, { className: "max-w-xl" }) }),
                /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-xl", children: /* @__PURE__ */ jsx(
                  UpdateProfileInformation,
                  {
                    mustVerifyEmail,
                    status,
                    className: "max-w-xl"
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-xl", children: /* @__PURE__ */ jsx(UpdatePasswordForm, { className: "max-w-xl" }) }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-rose-500/20 rounded-[2rem] p-8 shadow-xl relative overflow-hidden", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-6 opacity-10", children: /* @__PURE__ */ jsx(AlertTriangle, { size: 64, className: "text-rose-500" }) }),
                  /* @__PURE__ */ jsx(DeleteUserForm, { className: "max-w-xl" })
                ] })
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  Edit as default
};
