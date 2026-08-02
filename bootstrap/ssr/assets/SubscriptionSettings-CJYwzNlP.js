import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { CreditCard, Zap, HardDrive, ShieldCheck, Terminal, Activity, AlertTriangle, Book, Save, Crown } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
import { T as TextInput } from "./TextInput-DN069oHs.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import axios from "axios";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function SubscriptionSettings({ auth, settings }) {
  const { data, setData, post, processing, recentlySuccessful } = useForm({
    settings
  });
  const [activeSector, setActiveSector] = useState("monetization");
  const [activeGateway, setActiveGateway] = useState("stripe");
  const [isTesting, setIsTesting] = useState(null);
  const toast = useToast();
  const testGateway = async (gateway) => {
    setIsTesting(gateway);
    try {
      const res = await axios.post(route("admin.subscriptions.test-gateway"), { gateway });
      toast.success(res.data.message);
    } catch (e) {
      toast.error("Handshake_Failed: " + (e.response?.data?.message || "Unknown protocol error."));
    } finally {
      setIsTesting(null);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.subscriptions.update"));
  };
  const updateSetting = (key, value) => {
    setData("settings", {
      ...data.settings,
      [key]: value
    });
  };
  const sectors = [
    { id: "monetization", name: "Monetization", icon: CreditCard, color: "text-amber-500" },
    { id: "billing", name: "Billing_Config", icon: Zap, color: "text-blue-500" },
    { id: "quotas", name: "Resource_Quotas", icon: HardDrive, color: "text-cyan-500" },
    { id: "security", name: "Security_&_Auth", icon: ShieldCheck, color: "text-rose-500" },
    { id: "system", name: "System_Config", icon: Terminal, color: "text-purple-500" }
  ];
  const Toggle = ({ value, onToggle, label, description }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] hover:border-white/10 transition-all", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]", children: label }),
      /* @__PURE__ */ jsx("p", { className: "text-[8px] text-[var(--text-muted)] uppercase italic", children: description })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onToggle,
        className: `relative w-12 h-6 rounded-full transition-all duration-300 ${value === "1" ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-700"}`,
        children: /* @__PURE__ */ jsx("div", { className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${value === "1" ? "translate-x-7" : "translate-x-1"}` })
      }
    )
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500", children: /* @__PURE__ */ jsx(Crown, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "Global_Command" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] text-amber-500 uppercase tracking-[0.4em] font-bold mt-1", children: "SaaS Deployment Protocols" })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Advanced Settings" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [
              /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 space-y-2", children: sectors.map((sector) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setActiveSector(sector.id),
                  className: `w-full flex items-center gap-4 px-6 py-4 rounded-xl border transition-all ${activeSector === sector.id ? "bg-white/5 border-white/10 text-[var(--text-main)] shadow-lg" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"}`,
                  children: [
                    /* @__PURE__ */ jsx(sector.icon, { size: 18, className: activeSector === sector.id ? sector.color : "" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: sector.name })
                  ]
                },
                sector.id
              )) }),
              /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsx("form", { onSubmit: submit, className: "space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden", children: [
                activeSector === "monetization" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8", children: [
                    /* @__PURE__ */ jsx(CreditCard, { className: "text-amber-500", size: 20 }),
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest", children: "Pricing_&_Revenue" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(InputLabel, { value: "Monthly_Uplink_Price ($)" }),
                      /* @__PURE__ */ jsx(TextInput, { type: "number", step: "0.01", value: data.settings.pro_monthly_price, onChange: (e) => updateSetting("pro_monthly_price", e.target.value), className: "bg-[var(--bg-elevated)] font-mono" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(InputLabel, { value: "Yearly_Uplink_Price ($)" }),
                      /* @__PURE__ */ jsx(TextInput, { type: "number", step: "0.01", value: data.settings.pro_yearly_price, onChange: (e) => updateSetting("pro_yearly_price", e.target.value), className: "bg-[var(--bg-elevated)] font-mono" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(InputLabel, { value: "Trial_Period_Duration (Days)" }),
                      /* @__PURE__ */ jsx(TextInput, { type: "number", value: data.settings.pro_trial_days, onChange: (e) => updateSetting("pro_trial_days", e.target.value), className: "bg-[var(--bg-elevated)] font-mono" })
                    ] })
                  ] })
                ] }),
                activeSector === "billing" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[var(--border)] pb-6 mb-8", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(Zap, { className: "text-blue-500", size: 20 }),
                      /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest", children: "Gateway_Configuration" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border)] overflow-x-auto no-scrollbar", children: ["test", "stripe", "razorpay", "paytm", "phonepe"].map((gw) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setActiveGateway(gw),
                        className: `px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${activeGateway === gw ? "bg-white text-black shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`,
                        children: gw
                      },
                      gw
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                    /* @__PURE__ */ jsx(
                      Toggle,
                      {
                        value: data.settings[`${activeGateway}_enabled`],
                        onToggle: () => updateSetting(`${activeGateway}_enabled`, data.settings[`${activeGateway}_enabled`] === "1" ? "0" : "1"),
                        label: `${activeGateway.toUpperCase()}_Protocol_Status`,
                        description: `Activate or hibernate the ${activeGateway} payment bridge.`
                      }
                    ),
                    activeGateway === "test" && /* @__PURE__ */ jsx("div", { className: "space-y-6 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-amber-500/20 pb-4", children: [
                        /* @__PURE__ */ jsx(Activity, { className: "text-amber-500", size: 18 }),
                        /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-white uppercase tracking-[0.2em]", children: "Neural_Test_Bridge" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-relaxed", children: 'This bridge allows for instant purchase verification without external ciphers. Use this for testing the "Lock Settings" and "Marketplace" flows in development.' }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-amber-500/10 rounded-lg text-amber-500 text-[9px] font-black uppercase tracking-widest", children: [
                        /* @__PURE__ */ jsx(AlertTriangle, { size: 14 }),
                        " Warning: Do not enable in production environments."
                      ] })
                    ] }) }),
                    activeGateway === "stripe" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "STRIPE_KEY" }),
                        /* @__PURE__ */ jsx(TextInput, { placeholder: "pk_test_...", value: data.settings.stripe_key, onChange: (e) => updateSetting("stripe_key", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "STRIPE_SECRET" }),
                        /* @__PURE__ */ jsx(TextInput, { type: "password", placeholder: "sk_test_...", value: data.settings.stripe_secret, onChange: (e) => updateSetting("stripe_secret", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "STRIPE_WEBHOOK_SECRET" }),
                        /* @__PURE__ */ jsx(TextInput, { type: "password", placeholder: "whsec_...", value: data.settings.stripe_webhook_secret, onChange: (e) => updateSetting("stripe_webhook_secret", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "STRIPE_PRO_PRICE_ID" }),
                        /* @__PURE__ */ jsx(TextInput, { placeholder: "price_...", value: data.settings.stripe_pro_price_id, onChange: (e) => updateSetting("stripe_pro_price_id", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-8", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-blue-500/20 pb-4", children: [
                          /* @__PURE__ */ jsx(Book, { className: "text-blue-400", size: 18 }),
                          /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-white uppercase tracking-[0.2em]", children: "Stripe Integration Manual" })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-relaxed", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "1" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Obtain API Keys:" }),
                              " Access the ",
                              /* @__PURE__ */ jsx("a", { href: "https://dashboard.stripe.com/apikeys", target: "_blank", className: "text-blue-400 underline", children: "Stripe Keys Dashboard" }),
                              '. Toggle "Test Mode" if developing. Copy the ',
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Publishable Key" }),
                              " (STRIPE_KEY) and ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Secret Key" }),
                              " (STRIPE_SECRET)."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "2" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Create Subscription Product:" }),
                              " Go to ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Product Catalog" }),
                              '. Create a "Pro Plan". Add a recurring price. Copy the ',
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "API ID" }),
                              " (starts with ",
                              /* @__PURE__ */ jsx("code", { className: "text-emerald-400", children: "price_..." }),
                              ") and paste it into the Price ID field above."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "3" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Webhook Signal Hub:" }),
                              " Navigate to ",
                              /* @__PURE__ */ jsxs("span", { className: "text-white", children: [
                                "Developers ",
                                ">",
                                " Webhooks"
                              ] }),
                              ". Add an endpoint with the following URL:"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "ml-10 group relative", children: /* @__PURE__ */ jsxs("code", { className: "block bg-black/40 p-4 rounded-xl text-emerald-400 font-mono border border-white/5 break-all select-all", children: [
                            window.location.origin,
                            "/api/subscription/stripe/webhook"
                          ] }) }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "4" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Event Selection:" }),
                              " While adding the webhook, select ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "checkout.session.completed" }),
                              " and ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "customer.subscription.deleted" }),
                              ". These events manage automatic user upgrades/downgrades."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "5" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Final Security:" }),
                              " Once created, click ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: '"Reveal"' }),
                              " under Signing Secret. Copy the ",
                              /* @__PURE__ */ jsx("code", { className: "text-emerald-400", children: "whsec_..." }),
                              " string into STRIPE_WEBHOOK_SECRET."
                            ] })
                          ] })
                        ] }) })
                      ] })
                    ] }),
                    activeGateway === "razorpay" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "RAZORPAY_KEY" }),
                        /* @__PURE__ */ jsx(TextInput, { placeholder: "rzp_test_...", value: data.settings.razorpay_key, onChange: (e) => updateSetting("razorpay_key", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "RAZORPAY_SECRET" }),
                        /* @__PURE__ */ jsx(TextInput, { type: "password", placeholder: "Secret Key", value: data.settings.razorpay_secret, onChange: (e) => updateSetting("razorpay_secret", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-8", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-blue-500/20 pb-4", children: [
                          /* @__PURE__ */ jsx(Book, { className: "text-blue-400", size: 18 }),
                          /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-white uppercase tracking-[0.2em]", children: "Razorpay Integration Manual" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-relaxed", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "1" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Handshake Credentials:" }),
                              " Go to ",
                              /* @__PURE__ */ jsxs("a", { href: "https://dashboard.razorpay.com/app/keys", target: "_blank", className: "text-blue-400 underline", children: [
                                "Razorpay Settings ",
                                ">",
                                " API Keys"
                              ] }),
                              ". Generate a new key. Copy ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Key ID" }),
                              " and ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Key Secret" }),
                              " to the fields above."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "2" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Webhook Sync:" }),
                              " Navigate to ",
                              /* @__PURE__ */ jsxs("span", { className: "text-white", children: [
                                "Settings ",
                                ">",
                                " Webhooks"
                              ] }),
                              ". Add a new webhook URL:"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "ml-10 group relative", children: /* @__PURE__ */ jsxs("code", { className: "block bg-black/40 p-4 rounded-xl text-emerald-400 font-mono border border-white/5 break-all select-all", children: [
                            window.location.origin,
                            "/api/subscription/razorpay/webhook"
                          ] }) }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "3" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Active Listeners:" }),
                              " Set the Webhook Secret (optional, but recommended). Subscribe to ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "subscription.authenticated" }),
                              ", ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "subscription.activated" }),
                              ", and ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "subscription.charged" }),
                              " events."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "4" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Currency Protocol:" }),
                              " Ensure your account supports ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "INR" }),
                              " (Indian Rupee) or the target currency of your deployment matrix."
                            ] })
                          ] })
                        ] })
                      ] })
                    ] }),
                    activeGateway === "paytm" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "PAYTM_MERCHANT_ID" }),
                        /* @__PURE__ */ jsx(TextInput, { placeholder: "Merchant ID", value: data.settings.paytm_merchant_id, onChange: (e) => updateSetting("paytm_merchant_id", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "PAYTM_MERCHANT_KEY" }),
                        /* @__PURE__ */ jsx(TextInput, { type: "password", placeholder: "Merchant Key", value: data.settings.paytm_merchant_key, onChange: (e) => updateSetting("paytm_merchant_key", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "PAYTM_WEBSITE" }),
                        /* @__PURE__ */ jsx(TextInput, { placeholder: "WEBSTAGING / DEFAULT", value: data.settings.paytm_website, onChange: (e) => updateSetting("paytm_website", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-8", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-blue-500/20 pb-4", children: [
                          /* @__PURE__ */ jsx(Book, { className: "text-blue-400", size: 18 }),
                          /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-white uppercase tracking-[0.2em]", children: "Paytm Integration Manual" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-relaxed", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "1" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Cipher Acquisition:" }),
                              " Log in to ",
                              /* @__PURE__ */ jsx("a", { href: "https://dashboard.paytm.com/next/apikeys", target: "_blank", className: "text-blue-400 underline", children: "Paytm for Business" }),
                              ". Navigate to ",
                              /* @__PURE__ */ jsxs("span", { className: "text-white", children: [
                                "Developer Settings ",
                                ">",
                                " API Keys"
                              ] }),
                              ". Copy your ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "MID" }),
                              " and ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Merchant Key" }),
                              "."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "2" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Environment Logic:" }),
                              " Set Website to ",
                              /* @__PURE__ */ jsx("span", { className: "text-white font-black", children: "WEBSTAGING" }),
                              " while using Test Keys. Switch to ",
                              /* @__PURE__ */ jsx("span", { className: "text-white font-black", children: "DEFAULT" }),
                              " when deploying in the production matrix."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "3" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Callback Uplink:" }),
                              " Add the following URL to your Paytm Dashboard settings to receive transmission status updates:"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "ml-10 group relative", children: /* @__PURE__ */ jsxs("code", { className: "block bg-black/40 p-4 rounded-xl text-emerald-400 font-mono border border-white/5 break-all select-all", children: [
                            window.location.origin,
                            "/api/subscription/paytm/webhook"
                          ] }) })
                        ] })
                      ] })
                    ] }),
                    activeGateway === "phonepe" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "PHONEPE_MERCHANT_ID" }),
                        /* @__PURE__ */ jsx(TextInput, { placeholder: "PGMD...", value: data.settings.phonepe_merchant_id, onChange: (e) => updateSetting("phonepe_merchant_id", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(InputLabel, { value: "PHONEPE_SALT_KEY" }),
                        /* @__PURE__ */ jsx(TextInput, { type: "password", placeholder: "Salt Key", value: data.settings.phonepe_salt_key, onChange: (e) => updateSetting("phonepe_salt_key", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ jsx(InputLabel, { value: "SALT_INDEX" }),
                          /* @__PURE__ */ jsx(TextInput, { type: "number", value: data.settings.phonepe_salt_index, onChange: (e) => updateSetting("phonepe_salt_index", e.target.value), className: "w-full bg-[var(--bg-elevated)] font-mono text-[10px]" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ jsx(InputLabel, { value: "ENVIRONMENT" }),
                          /* @__PURE__ */ jsxs("select", { value: data.settings.phonepe_env, onChange: (e) => updateSetting("phonepe_env", e.target.value), className: "w-full bg-[var(--bg-elevated)] border-[var(--border)] rounded-md text-[10px] font-bold uppercase p-2 focus:ring-blue-500", children: [
                            /* @__PURE__ */ jsx("option", { value: "UAT", children: "UAT (Test)" }),
                            /* @__PURE__ */ jsx("option", { value: "PRODUCTION", children: "PRODUCTION" })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-10 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-8", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-blue-500/20 pb-4", children: [
                          /* @__PURE__ */ jsx(Book, { className: "text-blue-400", size: 18 }),
                          /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-white uppercase tracking-[0.2em]", children: "PhonePe Integration Manual" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-relaxed", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "1" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Merchant Onboarding:" }),
                              " Access the ",
                              /* @__PURE__ */ jsx("a", { href: "https://www.phonepe.com/business-solutions/payment-gateway/", target: "_blank", className: "text-blue-400 underline", children: "PhonePe Business Portal" }),
                              ". Obtain your ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "PG Merchant ID" }),
                              " and ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Salt Key" }),
                              "."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "2" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Salt Logic:" }),
                              " The ",
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Salt Index" }),
                              " is usually ",
                              /* @__PURE__ */ jsx("span", { className: "text-white font-black", children: "1" }),
                              ". If PhonePe provided multiple keys, use the index corresponding to the key you injected above."
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0", children: "3" }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Uplink URL:" }),
                              " Configure your PhonePe Merchant dashboard to transmit signals to this endpoint:"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "ml-10 group relative", children: /* @__PURE__ */ jsxs("code", { className: "block bg-black/40 p-4 rounded-xl text-emerald-400 font-mono border border-white/5 break-all select-all", children: [
                            window.location.origin,
                            "/api/subscription/phonepe/webhook"
                          ] }) })
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 pt-6 border-t border-[var(--border)]", children: /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => testGateway(activeGateway),
                      disabled: isTesting === activeGateway,
                      className: "flex-1 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2",
                      children: [
                        isTesting === activeGateway ? /* @__PURE__ */ jsx(Activity, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx(ShieldCheck, { size: 14 }),
                        "Verify_",
                        activeGateway.toUpperCase(),
                        "_Handshake"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl", children: /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed", children: [
                    "Establishing secure uplink with ",
                    activeGateway.toUpperCase(),
                    " API node. Verify credentials before commit."
                  ] }) })
                ] }),
                activeSector === "quotas" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8", children: [
                    /* @__PURE__ */ jsx(HardDrive, { className: "text-cyan-500", size: 20 }),
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest", children: "Resource_Constraints" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(InputLabel, { value: "Free_Project_Quota" }),
                      /* @__PURE__ */ jsx(TextInput, { type: "number", value: data.settings.free_project_limit, onChange: (e) => updateSetting("free_project_limit", e.target.value), className: "bg-[var(--bg-elevated)] font-mono" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(InputLabel, { value: "Max_Upload_Payload (MB)" }),
                      /* @__PURE__ */ jsx(TextInput, { type: "number", value: data.settings.max_upload_size_mb, onChange: (e) => updateSetting("max_upload_size_mb", e.target.value), className: "bg-[var(--bg-elevated)] font-mono" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Toggle,
                    {
                      value: data.settings.enforce_pro_privacy,
                      onToggle: () => updateSetting("enforce_pro_privacy", data.settings.enforce_pro_privacy === "1" ? "0" : "1"),
                      label: "Gated_Privacy_Shield",
                      description: "Only allow Pro users to create restricted nodes."
                    }
                  )
                ] }),
                activeSector === "security" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8", children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { className: "text-rose-500", size: 20 }),
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest", children: "Access_Security" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx(
                      Toggle,
                      {
                        value: data.settings.enable_public_signups,
                        onToggle: () => updateSetting("enable_public_signups", data.settings.enable_public_signups === "1" ? "0" : "1"),
                        label: "Public_Node_Registration",
                        description: "Allow new entities to register without invitation."
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Toggle,
                      {
                        value: data.settings.require_email_verification,
                        onToggle: () => updateSetting("require_email_verification", data.settings.require_email_verification === "1" ? "0" : "1"),
                        label: "Identity_Verification",
                        description: "Enforce email verification for all new uplinks."
                      }
                    )
                  ] })
                ] }),
                activeSector === "system" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8", children: [
                    /* @__PURE__ */ jsx(Terminal, { className: "text-purple-500", size: 20 }),
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest", children: "Core_Diagnostics" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(InputLabel, { value: "Maintenance_Bypass_Cipher" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsx(TextInput, { value: data.settings.maintenance_bypass_key, readOnly: true, className: "bg-[var(--bg-elevated)] font-mono text-emerald-500 cursor-not-allowed" }),
                        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => updateSetting("maintenance_bypass_key", "HOA-" + Math.random().toString(36).substr(2, 8).toUpperCase()), className: "px-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl hover:bg-white/5 transition-colors", children: /* @__PURE__ */ jsx(Zap, { size: 14 }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsx(InputLabel, { value: "API_Burst_Limit (Requests/Min)" }),
                      /* @__PURE__ */ jsx(TextInput, { type: "number", value: data.settings.global_rate_limit, onChange: (e) => updateSetting("global_rate_limit", e.target.value), className: "bg-[var(--bg-elevated)] font-mono" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Toggle,
                      {
                        value: data.settings.allow_guest_preview,
                        onToggle: () => updateSetting("allow_guest_preview", data.settings.allow_guest_preview === "1" ? "0" : "1"),
                        label: "Guest_Live_Stream",
                        description: "Allow unauthenticated users to preview public cores."
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-[var(--border)] flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-rose-500/50 text-left", children: [
                    /* @__PURE__ */ jsx(AlertTriangle, { size: 14 }),
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase tracking-widest", children: "Irreversible_System_Change" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    recentlySuccessful && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse", children: "Sync_Verified" }),
                    /* @__PURE__ */ jsxs(PrimaryButton, { disabled: processing, className: "px-12 py-4", children: [
                      /* @__PURE__ */ jsx(Save, { size: 16, className: "mr-2" }),
                      " Commit_Protocols"
                    ] })
                  ] })
                ] })
              ] }) }) })
            ] }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  SubscriptionSettings as default
};
