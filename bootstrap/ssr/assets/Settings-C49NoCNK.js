import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head } from "@inertiajs/react";
import "react";
import { Save, Activity, ShieldCheck, AlertCircle, Settings } from "lucide-react";
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
function EmailSettings({ settings }) {
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({
    mail_mailer: settings?.mail_mailer || "smtp",
    mail_host: settings?.mail_host || "",
    mail_port: settings?.mail_port || "587",
    mail_username: settings?.mail_username || "",
    mail_password: settings?.mail_password || "",
    mail_encryption: settings?.mail_encryption || "tls",
    mail_from_address: settings?.mail_from_address || "",
    mail_from_name: settings?.mail_from_name || "HOACodeLab"
  });
  const { data: testData, setData: setTestData, post: postTest, processing: testProcessing, errors: testErrors } = useForm({
    email: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.email.settings.update"));
  };
  const runTest = (e) => {
    e.preventDefault();
    postTest(route("admin.email.test"));
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500", children: /* @__PURE__ */ jsx(Settings, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "SMTP_Config" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Mail Server Protocols" })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "SMTP Settings" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
              /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Mailer" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.mail_mailer, onChange: (e) => setData("mail_mailer", e.target.value), className: "bg-[var(--bg-elevated)]" }),
                    errors.mail_mailer && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.mail_mailer })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Host" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.mail_host, onChange: (e) => setData("mail_host", e.target.value), className: "bg-[var(--bg-elevated)]", placeholder: "smtp.mailgun.org" }),
                    errors.mail_host && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.mail_host })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Port" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.mail_port, onChange: (e) => setData("mail_port", e.target.value), className: "bg-[var(--bg-elevated)]", placeholder: "587" }),
                    errors.mail_port && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.mail_port })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Encryption" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.mail_encryption, onChange: (e) => setData("mail_encryption", e.target.value), className: "bg-[var(--bg-elevated)]", placeholder: "tls" }),
                    errors.mail_encryption && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.mail_encryption })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Username" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.mail_username, onChange: (e) => setData("mail_username", e.target.value), className: "bg-[var(--bg-elevated)]" }),
                    errors.mail_username && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.mail_username })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Password" }),
                    /* @__PURE__ */ jsx(TextInput, { type: "password", value: data.mail_password, onChange: (e) => setData("mail_password", e.target.value), className: "bg-[var(--bg-elevated)]" }),
                    errors.mail_password && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.mail_password })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "From Address" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.mail_from_address, onChange: (e) => setData("mail_from_address", e.target.value), className: "bg-[var(--bg-elevated)]" }),
                    errors.mail_from_address && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.mail_from_address })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "From Name" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.mail_from_name, onChange: (e) => setData("mail_from_name", e.target.value), className: "bg-[var(--bg-elevated)]" }),
                    errors.mail_from_name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.mail_from_name })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-6 border-t border-[var(--border)]", children: /* @__PURE__ */ jsxs(PrimaryButton, { className: "bg-purple-500 hover:bg-purple-600 border-purple-500 px-8 py-3", disabled: processing, children: [
                  /* @__PURE__ */ jsx(Save, { size: 16, className: "mr-2" }),
                  " Save_Configuration"
                ] }) })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-6 space-y-6", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Activity, { size: 14 }),
                    " Connection_Diagnostics"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-xs space-y-2", children: /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)]", children: "Test your configuration by sending a ping packet to an external address." }) }),
                  /* @__PURE__ */ jsxs("form", { onSubmit: runTest, className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(InputLabel, { value: "Test Email Address" }),
                      /* @__PURE__ */ jsx(
                        TextInput,
                        {
                          type: "email",
                          value: testData.email,
                          onChange: (e) => setTestData("email", e.target.value),
                          className: "bg-[var(--bg-elevated)]",
                          placeholder: "you@example.com"
                        }
                      ),
                      testErrors.email && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: testErrors.email })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        disabled: testProcessing,
                        className: "w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx(ShieldCheck, { size: 14 }),
                          " Test Connection"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsx(AlertCircle, { className: "text-amber-500 shrink-0", size: 20 }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-amber-500 uppercase tracking-widest", children: "Security Warning" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-amber-500/80 leading-relaxed", children: "SMTP credentials are stored in the database. Ensure your database connection is secure (SSL) and your .env file is protected." })
                  ] })
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto mt-20 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "p-10 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[3rem] shadow-2xl relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-10 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsx(Settings, { size: 200 }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-10", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-500", children: /* @__PURE__ */ jsx(Activity, { size: 24 }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter", children: "Mail_Setup_Protocol" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1", children: "Beginner Integration Guide" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12 text-left", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
                  /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-purple-500" }),
                      " Phase 01: SMTP Acquisition"
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[var(--text-muted)] leading-relaxed uppercase tracking-widest font-medium", children: "To enable mail transmission, you need credentials from a service provider. Recommended modules for beginners:" }),
                    /* @__PURE__ */ jsx("ul", { className: "space-y-3 pt-2", children: [
                      { name: "Mailtrap", desc: "Safe testing environment. Won't send real emails to users." },
                      { name: "Brevo (Sendinblue)", desc: "Free tier for real transmissions. 300 emails/day." },
                      { name: "Gmail SMTP", desc: 'Requires "App Passwords" to be enabled in Google Security.' }
                    ].map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] group hover:border-purple-500/30 transition-all", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-purple-500 font-black text-xs", children: [
                        "0",
                        i + 1
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-white uppercase tracking-widest mb-1", children: item.name }),
                        /* @__PURE__ */ jsx("p", { className: "text-[9px] text-[var(--text-muted)] leading-normal", children: item.desc })
                      ] })
                    ] }, i)) })
                  ] }),
                  /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-cyan-500" }),
                      " Phase 02: Kernel Configuration"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4 font-mono text-[10px] text-slate-400", children: [
                      /* @__PURE__ */ jsxs("p", { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: "# STEP 1:" }),
                        " Copy your host (e.g. live.smtp.mailtrap.io)"
                      ] }),
                      /* @__PURE__ */ jsxs("p", { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: "# STEP 2:" }),
                        " Set Port to ",
                        /* @__PURE__ */ jsx("span", { className: "text-white", children: "587" }),
                        " (TLS) or ",
                        /* @__PURE__ */ jsx("span", { className: "text-white", children: "465" }),
                        " (SSL)"
                      ] }),
                      /* @__PURE__ */ jsxs("p", { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: "# STEP 3:" }),
                        " Inject Username & Password accurately"
                      ] }),
                      /* @__PURE__ */ jsxs("p", { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: "# STEP 4:" }),
                        " Match 'From Address' with your provider settings"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
                  /* @__PURE__ */ jsxs("section", { className: "space-y-4 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]", children: [
                    /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(ShieldCheck, { size: 16 }),
                      " Verification Protocol"
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-emerald-500/70 leading-relaxed font-bold uppercase tracking-widest italic", children: [
                      "Once settings are saved, use the ",
                      /* @__PURE__ */ jsx("span", { className: "text-white underline", children: "Connection Diagnostics" }),
                      " panel to send a test signal. If you receive the transmission, the uplink is successful."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(AlertCircle, { size: 16 }),
                      " Diagnostic Troubleshooting"
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [
                      { q: "Authentication Failed?", a: "Verify password. If using Gmail, ensure 2FA and App Password are active." },
                      { q: "Connection Timeout?", a: "Check Port. Try 587 with TLS or 465 with SSL. Ports 25 is often blocked." },
                      { q: "Emails going to Spam?", a: "Verify your domain's SPF, DKIM, and DMARC records at your provider." }
                    ].map((item, i) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[9px] font-black text-white uppercase tracking-widest", children: item.q }),
                      /* @__PURE__ */ jsx("p", { className: "text-[9px] text-[var(--text-muted)] italic", children: item.a })
                    ] }, i)) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "pt-8 border-t border-[var(--border)]", children: /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] italic text-center", children: "System Notification" }) })
                ] })
              ] })
            ] }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  EmailSettings as default
};
