import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head } from "@inertiajs/react";
import { ShoppingBag, Zap, CheckCircle2, Sparkles, ShieldCheck, Wallet, CreditCard, FlaskConical, Lock } from "lucide-react";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import axios from "axios";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function Checkout({ auth, project, stripeKey, enabledGateways = [] }) {
  const [processing, setProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(enabledGateways[0] || "stripe");
  const [domain, setDomain] = useState("");
  const [licenseType, setLicenseType] = useState("Standard");
  const [useCase, setUseCase] = useState("Personal");
  const [projectName, setProjectName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const toast = useToast();
  const calculatedPrice = licenseType === "Extended" ? project.price * 2.5 : project.price;
  const gatewayMeta = {
    test: { name: "Neural_Test_Bridge", icon: FlaskConical },
    stripe: { name: "Stripe_Global", icon: CreditCard },
    razorpay: { name: "Razorpay_INR", icon: Wallet },
    paytm: { name: "Paytm_Node", icon: Zap },
    phonepe: { name: "PhonePe_Secure", icon: ShieldCheck }
  };
  const handlePurchase = async () => {
    if (!selectedGateway) return toast.warning("Please select a payment protocol.");
    setProcessing(true);
    try {
      const res = await axios.post("/api/purchase/checkout", {
        project_id: project.id,
        gateway: selectedGateway,
        domain,
        license_type: licenseType,
        metadata: {
          use_case: useCase,
          project_name: projectName,
          phone,
          whatsapp,
          billing_address: billingAddress
        }
      });
      if ((selectedGateway === "stripe" || selectedGateway === "test") && res.data.url) {
        window.location.href = res.data.url;
      } else if (selectedGateway === "razorpay") {
        const options = {
          key: res.data.key,
          amount: res.data.amount,
          currency: "INR",
          name: "HOACodeLab",
          description: `Unlocking Node: ${project.title}`,
          order_id: res.data.order_id,
          handler: async (response) => {
            try {
              await axios.post("/api/purchase/verify", {
                gateway: "razorpay",
                project_id: project.id,
                ...response
              });
              window.location.href = route("purchase.status", { status: "success", project_id: project.id });
            } catch (e) {
              window.location.href = route("purchase.status", { status: "failed", project_id: project.id, message: "Verification failed" });
            }
          },
          prefill: {
            name: res.data.user.name,
            email: res.data.user.email
          },
          theme: { color: "#06b6d4" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.info(`${selectedGateway} protocol implementation pending.`);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Handshake failed.");
    } finally {
      setProcessing(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic", children: "Checkout_Terminal" }),
      children: [
        /* @__PURE__ */ jsxs(Head, { children: [
          /* @__PURE__ */ jsx("title", { children: "Checkout // HOACodeLab" }),
          /* @__PURE__ */ jsx("script", { src: "https://checkout.razorpay.com/v1/checkout.js" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "py-12 px-6 max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-8 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
                /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 shadow-inner", children: /* @__PURE__ */ jsx(ShoppingBag, { size: 40 }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-cyan-500", children: [
                    /* @__PURE__ */ jsx(Zap, { size: 14, className: "fill-current" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "Premium Node" })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-[var(--text-main)] uppercase italic tracking-tighter", children: project.title }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest", children: [
                    "Created by @",
                    project.user?.name || "Unknown"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                "Full Source Code Access",
                "Unlimited Fork Rights",
                "Commercial Usage Permitted",
                "Lifetime Module Updates",
                "Asset Matrix Integration",
                "Priority Support Link"
              ].map((feature, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "text-emerald-500 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: feature })
              ] }, i)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("h4", { className: "font-bold text-[var(--text-main)] uppercase tracking-widest text-sm flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Sparkles, { size: 16, className: "text-emerald-500" }),
                " License Details"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-main)] space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2", children: "License Type" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: licenseType,
                        onChange: (e) => setLicenseType(e.target.value),
                        className: "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-main)] focus:outline-none focus:border-cyan-500 transition-colors",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "Standard", children: "Standard License (1x)" }),
                          /* @__PURE__ */ jsx("option", { value: "Extended", children: "Extended License (2.5x Price)" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2", children: "Intended Use Case" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: useCase,
                        onChange: (e) => setUseCase(e.target.value),
                        className: "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-main)] focus:outline-none focus:border-cyan-500 transition-colors",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "Personal", children: "Personal" }),
                          /* @__PURE__ */ jsx("option", { value: "Commercial", children: "Commercial" }),
                          /* @__PURE__ */ jsx("option", { value: "Agency", children: "Agency" })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2", children: "Target Domain (Where will you install this?)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: domain,
                      onChange: (e) => setDomain(e.target.value),
                      placeholder: "e.g. yoursite.com",
                      className: "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-main)] focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600"
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] mt-1", children: "The license key generated will be registered to this domain." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2", children: "Project/App Name" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: projectName, onChange: (e) => setProjectName(e.target.value), placeholder: "My Awesome Startup", className: "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-main)] focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2", children: "Phone Number" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+1 234 567 890", className: "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-main)] focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2", children: "WhatsApp Number" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value), placeholder: "+1 234 567 890", className: "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-main)] focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2", children: "Billing Address / VAT" }),
                    /* @__PURE__ */ jsx("input", { type: "text", value: billingAddress, onChange: (e) => setBillingAddress(e.target.value), placeholder: "123 Main St...", className: "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-main)] focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-6 shadow-sm", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase tracking-[0.2em] text-[var(--text-main)] italic", children: "Payment_Gateway_Protocol" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: enabledGateways.length > 0 ? enabledGateways.map((gw) => {
                const meta = gatewayMeta[gw] || { name: gw, icon: CreditCard };
                const Icon = meta.icon;
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setSelectedGateway(gw),
                    className: `p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${selectedGateway === gw ? "bg-cyan-500/5 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]" : "bg-[var(--bg-main)] border-[var(--border)] opacity-50 hover:opacity-100"}`,
                    children: [
                      /* @__PURE__ */ jsx(Icon, { size: 32, className: selectedGateway === gw ? "text-cyan-500" : "text-[var(--text-muted)]" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest", children: meta.name })
                    ]
                  },
                  gw
                );
              }) : /* @__PURE__ */ jsx("div", { className: "col-span-2 p-8 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-center", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-rose-500 tracking-widest", children: "Error: No active payment bridges detected." }) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-8 shadow-sm sticky top-8", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase tracking-[0.2em] text-[var(--text-main)] italic", children: "Order_Summary" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: [
                /* @__PURE__ */ jsx("span", { children: "Unit Price" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[var(--text-main)]", children: [
                  "$",
                  project.price
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: [
                /* @__PURE__ */ jsx("span", { children: "Gateway Fee" }),
                /* @__PURE__ */ jsx("span", { className: "text-emerald-500", children: "$0.00" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-[var(--border)] flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-main)]", children: "Total Execution" }),
                /* @__PURE__ */ jsx("div", { className: "text-3xl font-black font-mono text-[var(--text-main)]", children: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(calculatedPrice) })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handlePurchase,
                disabled: processing,
                className: "w-full py-5 bg-cyan-500 text-black rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50",
                children: processing ? /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Lock, { size: 16 }),
                  " Process_Handshake"
                ] })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-[var(--bg-main)] rounded-xl border border-emerald-500/20", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { size: 16, className: "text-emerald-500" }),
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase tracking-widest text-emerald-500/80", children: "Secured_Neural_Transaction" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-[var(--text-muted)] uppercase font-bold text-center tracking-tighter leading-relaxed", children: "By processing this handshake, you agree to our Module Usage Protocols and Neural Core License." })
            ] })
          ] }) })
        ] }) })
      ]
    }
  );
}
export {
  Checkout as default
};
