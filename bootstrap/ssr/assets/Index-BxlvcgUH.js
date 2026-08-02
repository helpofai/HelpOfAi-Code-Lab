import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head, router } from "@inertiajs/react";
import { Settings, Wallet, Clock, CheckCircle } from "lucide-react";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function Index({ auth, payouts, routingMode: initialRoutingMode }) {
  const toast = useToast();
  const [processingId, setProcessingId] = useState(null);
  const [routingMode, setRoutingMode] = useState(initialRoutingMode || "auto");
  const handleToggleMode = (mode) => {
    const previousMode = routingMode;
    setRoutingMode(mode);
    router.post(route("admin.payouts.settings"), {
      payout_routing_mode: mode
    }, {
      preserveScroll: true,
      onSuccess: () => toast.success("Payout routing engine updated."),
      onError: () => {
        setRoutingMode(previousMode);
        toast.error("Failed to update routing engine.");
      }
    });
  };
  const handleMarkAsPaid = (payoutId) => {
    if (!confirm("Are you sure you want to mark this payout as PAID? Make sure you have actually transferred the money to the vendors account.")) return;
    setProcessingId(payoutId);
    router.post(route("admin.payouts.mark-paid", payoutId), {
      reference_id: `MANUAL_WIRE_${(/* @__PURE__ */ new Date()).getTime()}`,
      admin_notes: "Paid manually by Admin"
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Payout marked as completed.");
        setProcessingId(null);
      },
      onError: () => {
        toast.error("Failed to update payout.");
        setProcessingId(null);
      }
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic", children: "Vendors_Payouts" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Vendors Payouts" }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 px-10 space-y-10", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "px-8 py-6 flex justify-between items-center bg-[var(--bg-main)]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 rounded-lg text-cyan-500", children: /* @__PURE__ */ jsx(Settings, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Payout Routing Engine" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest", children: "Switch between Auto Gateway splits and Manual wire transfers" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-black uppercase tracking-widest ${routingMode === "auto" ? "text-cyan-500" : "text-[var(--text-muted)]"}`, children: "Auto" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleToggleMode(routingMode === "auto" ? "manual" : "auto"),
                  className: `relative w-12 h-6 rounded-full transition-colors ${routingMode === "auto" ? "bg-cyan-500" : "bg-rose-500"}`,
                  children: /* @__PURE__ */ jsx("span", { className: `absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${routingMode === "auto" ? "translate-x-0" : "translate-x-6"}` })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-black uppercase tracking-widest ${routingMode === "manual" ? "text-rose-500" : "text-[var(--text-muted)]"}`, children: "Manual" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "px-8 py-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-main)]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-emerald-500/10 rounded-lg text-emerald-500", children: /* @__PURE__ */ jsx(Wallet, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Withdrawal Requests" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest", children: "Manage manual vendors payouts" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-[var(--bg-main)] border-b border-[var(--border)]", children: [
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Vendors" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Amount" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Gateway Preference" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Requested At" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right", children: "Action" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[var(--border)]", children: payouts.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-8 py-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest", children: "No payout requests found." }) }) }) : payouts.data.map((payout) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-[var(--bg-main)]/50 transition-colors group", children: [
                /* @__PURE__ */ jsxs("td", { className: "px-8 py-5", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase text-[var(--text-main)] tracking-widest", children: payout.user?.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-[9px] text-[var(--text-muted)] font-bold", children: payout.user?.email })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-8 py-5 text-[10px] font-black text-emerald-500 font-mono", children: [
                  "$",
                  payout.amount
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-5", children: payout.status === "pending" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-500 tracking-widest", children: [
                  /* @__PURE__ */ jsx(Clock, { size: 12 }),
                  " Pending"
                ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500 tracking-widest", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { size: 12 }),
                  " Completed"
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-5", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: payout.payment_method || "ANY" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: new Date(payout.created_at).toLocaleDateString() }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-5 text-right", children: payout.status === "pending" && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleMarkAsPaid(payout.id),
                    disabled: processingId === payout.id,
                    className: "px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50",
                    children: processingId === payout.id ? "Processing..." : "Mark as Paid"
                  }
                ) })
              ] }, payout.id)) })
            ] }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  Index as default
};
