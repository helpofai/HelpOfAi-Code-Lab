import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head } from "@inertiajs/react";
import "react";
import { Users, Crown, Shield, Send } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
import { T as TextInput } from "./TextInput-DN069oHs.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function EmailSend({ templates, userCounts }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    template_id: "",
    recipient_type: "all",
    specific_email: ""
  });
  const submit = (e) => {
    if (!confirm(`Are you sure you want to send this email to ${data.recipient_type.toUpperCase()} recipients?`)) return;
    e.preventDefault();
    post(route("admin.email.send.process"), {
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500", children: /* @__PURE__ */ jsx(Send, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "Broadcast_Console" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Global Messaging" })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Send Email" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
              /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-6 space-y-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Target_Audience" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(Users, { size: 16, className: "text-[var(--text-muted)]" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "All Users" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-lg font-black", children: userCounts.all })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 text-amber-500", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(Crown, { size: 16 }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Pro Users" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-lg font-black", children: userCounts.pro })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-purple-500/5 rounded-xl border border-purple-500/20 text-purple-500", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(Shield, { size: 16 }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Admins" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-lg font-black", children: userCounts.admins })
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Select Protocol (Template)" }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: templates.map((t) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      onClick: () => setData("template_id", t.id),
                      className: `cursor-pointer p-4 rounded-xl border transition-all ${data.template_id === t.id ? "bg-purple-500 text-white border-purple-500 shadow-lg" : "bg-[var(--bg-elevated)] border-[var(--border)] hover:border-purple-500/50"}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "font-bold text-sm mb-1", children: t.name }),
                        /* @__PURE__ */ jsx("div", { className: `text-xs truncate ${data.template_id === t.id ? "text-white/80" : "text-[var(--text-muted)]"}`, children: t.subject })
                      ]
                    },
                    t.id
                  )) }),
                  errors.template_id && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: "Please select a template." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Target Sector (Recipients)" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: data.recipient_type,
                      onChange: (e) => setData("recipient_type", e.target.value),
                      className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-sm focus:border-purple-500 outline-none text-[var(--text-main)]",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "all", children: "All Users (Broadcast)" }),
                        /* @__PURE__ */ jsx("option", { value: "pro", children: "Pro Users (Premium)" }),
                        /* @__PURE__ */ jsx("option", { value: "admins", children: "Administrators (Command)" }),
                        /* @__PURE__ */ jsx("option", { value: "specific", children: "Specific User (Direct)" })
                      ]
                    }
                  )
                ] }),
                data.recipient_type === "specific" && /* @__PURE__ */ jsxs("div", { className: "space-y-2 animate-in fade-in slide-in-from-top-4", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Target Email" }),
                  /* @__PURE__ */ jsx(
                    TextInput,
                    {
                      type: "email",
                      value: data.specific_email,
                      onChange: (e) => setData("specific_email", e.target.value),
                      className: "bg-[var(--bg-elevated)]",
                      placeholder: "user@example.com"
                    }
                  ),
                  errors.specific_email && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.specific_email })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "pt-6 border-t border-[var(--border)] flex justify-end", children: /* @__PURE__ */ jsxs(PrimaryButton, { className: "bg-purple-500 hover:bg-purple-600 border-purple-500 px-8 py-4 text-xs font-black uppercase tracking-widest", disabled: processing, children: [
                  /* @__PURE__ */ jsx(Send, { size: 16, className: "mr-2" }),
                  " Initialize_Broadcast"
                ] }) })
              ] }) })
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  EmailSend as default
};
