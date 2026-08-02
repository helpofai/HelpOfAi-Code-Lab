import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { CreditCard, Activity, CheckCircle2, History, TrendingUp, Wallet, DollarSign } from "lucide-react";
import axios from "axios";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function VendorPayments({ sales, totalEarnings }) {
  const { auth } = usePage().props;
  const user = auth.user;
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    stripe_account_id: user.stripe_account_id || "",
    razorpay_account_id: user.razorpay_account_id || "",
    phonepe_merchant_id: user.phonepe_merchant_id || "",
    paytm_merchant_id: user.paytm_merchant_id || ""
  });
  const handleSavePayouts = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post("/api/vendors/payout-accounts", formData);
      toast.success("Payout rules saved successfully.");
    } catch (e2) {
      toast.error(e2.response?.data?.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-emerald-500/10 border border-emerald-500/20 rounded", children: /* @__PURE__ */ jsx(DollarSign, { className: "text-emerald-500", size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-[var(--text-main)] uppercase italic leading-none", children: "Payments & Payouts" }),
          /* @__PURE__ */ jsx("p", { className: "text-[8px] text-emerald-500 font-bold uppercase tracking-[0.4em] mt-1", children: "Vendors Revenue Management" })
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Payments - Vendors Portal" }),
        /* @__PURE__ */ jsx("div", { className: "p-6 md:p-12 overflow-y-auto min-h-screen", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSavePayouts, className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl space-y-8 text-left relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-[var(--text-main)] uppercase italic tracking-tighter flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(CreditCard, { size: 24, className: "text-emerald-500" }),
                  " Payout Routing Rules"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[var(--text-muted)] mt-2", children: "Configure where your 70% share of marketplace sales should be sent." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Stripe Connect Account ID" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "acct_xxxxxxxx",
                      value: formData.stripe_account_id,
                      onChange: (e) => setFormData({ ...formData, stripe_account_id: e.target.value }),
                      className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Razorpay Route ID" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "acc_xxxxxxxx",
                      value: formData.razorpay_account_id,
                      onChange: (e) => setFormData({ ...formData, razorpay_account_id: e.target.value }),
                      className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "PhonePe Merchant ID" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "M1234567890",
                      value: formData.phonepe_merchant_id,
                      onChange: (e) => setFormData({ ...formData, phonepe_merchant_id: e.target.value }),
                      className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Paytm Merchant ID (MID)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "PAYTM_MID_xxxxxx",
                      value: formData.paytm_merchant_id,
                      onChange: (e) => setFormData({ ...formData, paytm_merchant_id: e.target.value }),
                      className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "submit",
                  disabled: isSaving,
                  className: "px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3",
                  children: [
                    isSaving ? /* @__PURE__ */ jsx(Activity, { className: "animate-spin", size: 18 }) : /* @__PURE__ */ jsx(CheckCircle2, { size: 18 }),
                    "Save Routing Rules"
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl space-y-8 relative", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-[var(--text-main)] uppercase italic tracking-tighter flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(History, { size: 24, className: "text-cyan-500" }),
                  " Sales History"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[var(--text-muted)] mt-2", children: "A chronological record of your marketplace sales and automated payouts." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
                /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[var(--border)] text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest", children: [
                  /* @__PURE__ */ jsx("th", { className: "pb-4", children: "Date" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-4", children: "Product" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-4", children: "Buyer" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-4", children: "Gross" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-4", children: "Your Cut (70%)" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "text-sm", children: sales.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "py-8 text-center text-[var(--text-muted)] font-bold", children: "No sales generated yet. Start promoting your products!" }) }) : sales.map((sale) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-[var(--border)] border-dashed hover:bg-[var(--bg-elevated)] transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "py-4 text-[var(--text-muted)]", children: new Date(sale.created_at).toLocaleDateString() }),
                  /* @__PURE__ */ jsx("td", { className: "py-4 text-[var(--text-main)] font-bold", children: sale.project?.title }),
                  /* @__PURE__ */ jsxs("td", { className: "py-4 text-[var(--text-muted)]", children: [
                    "@",
                    sale.user?.name
                  ] }),
                  /* @__PURE__ */ jsxs("td", { className: "py-4 font-mono text-[var(--text-muted)]", children: [
                    "$",
                    Number(sale.amount).toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxs("td", { className: "py-4 font-mono text-emerald-500 font-bold", children: [
                    "$",
                    (Number(sale.amount) * 0.7).toFixed(2)
                  ] })
                ] }, sale.id)) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4 shadow-xl", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "text-emerald-500 mx-auto", size: 32 }),
              /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Total Vendors Earnings" }),
              /* @__PURE__ */ jsxs("div", { className: "text-5xl font-black tracking-tighter text-[var(--text-main)]", children: [
                "$",
                Number(totalEarnings).toFixed(2)
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-4 border-t border-[var(--border)] pt-4", children: "Gross earnings derived from all sales across the platform." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl space-y-6", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-[var(--border)] pb-4", children: [
                /* @__PURE__ */ jsx(Wallet, { size: 20, className: "text-emerald-500" }),
                " Vendors Wallet"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]", children: [
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Available to Withdraw" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-xl font-black text-emerald-500 font-mono", children: [
                    "$",
                    Number(user.available_balance || 0).toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border)]", children: [
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Pending Withdrawal" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-xl font-black text-amber-500 font-mono", children: [
                    "$",
                    Number(user.pending_balance || 0).toFixed(2)
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: async () => {
                    const amount = prompt("Enter amount to withdraw (min $10):", user.available_balance);
                    if (!amount || isNaN(amount) || amount < 10) return alert("Invalid amount.");
                    try {
                      await axios.post("/api/vendors/request-payout", { amount: parseFloat(amount) });
                      toast.success("Withdrawal requested successfully!");
                      window.location.reload();
                    } catch (e) {
                      toast.error(e.response?.data?.message || "Failed to request withdrawal.");
                    }
                  },
                  disabled: !user.available_balance || user.available_balance < 10,
                  className: "w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50",
                  children: "Request Withdrawal"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[9px] text-center font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2", children: "Only applicable if admin manual routing is enabled." })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-3 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "p-8 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl space-y-6 shadow-xl", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-[var(--border)] pb-4", children: [
              /* @__PURE__ */ jsx(DollarSign, { size: 20, className: "text-emerald-500" }),
              " Payment Gateway Setup Guide"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h5", { className: "text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2", children: "How to connect your payouts" }),
                /* @__PURE__ */ jsxs("ol", { className: "text-xs text-[var(--text-muted)] font-medium space-y-3 list-decimal list-inside marker:text-emerald-500/50", children: [
                  /* @__PURE__ */ jsx("li", { children: "Go to your respective payment gateway (Stripe or Razorpay) dashboard." }),
                  /* @__PURE__ */ jsxs("li", { children: [
                    "Navigate to ",
                    /* @__PURE__ */ jsx("strong", { children: "Developer Settings" }),
                    " or ",
                    /* @__PURE__ */ jsx("strong", { children: "API Keys" }),
                    "."
                  ] }),
                  /* @__PURE__ */ jsx("li", { children: "Generate your standard API keys (Client ID / Secret)." }),
                  /* @__PURE__ */ jsxs("li", { children: [
                    "Enter the details into the integration cards above and click ",
                    /* @__PURE__ */ jsx("strong", { children: "Verify" }),
                    "."
                  ] }),
                  /* @__PURE__ */ jsx("li", { children: "Once verified, your account is immediately eligible to receive automated 70% payouts on every sale." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-t md:border-t-0 md:border-l border-[var(--border)] pt-6 md:pt-0 md:pl-8", children: [
                /* @__PURE__ */ jsx("h5", { className: "text-[11px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2", children: "How does the 70/30 split work?" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--text-muted)] font-medium leading-relaxed", children: [
                  "Our marketplace utilizes an automated multi-gateway split payment infrastructure. When a customer buys your software, the transaction is instantly routed and split: ",
                  /* @__PURE__ */ jsx("strong", { children: "70%" }),
                  " goes directly into your connected Stripe or Razorpay account, and 30% is retained as a platform fee."
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-2", children: "You must have at least one active, verified payment gateway connection to list paid products on the marketplace." })
              ] })
            ] })
          ] }) })
        ] }) }) })
      ]
    }
  );
}
export {
  VendorPayments as default
};
