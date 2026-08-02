import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head, Link } from "@inertiajs/react";
import { DollarSign, ShoppingBag, Calendar, TrendingUp, ArrowRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function Index({ auth, sales, stats }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      user: auth.user,
      header: /* @__PURE__ */ jsx("h2", { className: "font-black text-xl text-[var(--text-main)] uppercase tracking-[0.2em] italic", children: "Neural_Sales_Matrix" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Sales Management" }),
        /* @__PURE__ */ jsxs("div", { className: "py-12 px-10 space-y-10", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
            { label: "Total Revenue", value: `$${stats.total_revenue}`, icon: DollarSign, color: "text-emerald-500" },
            { label: "Total Sales", value: stats.total_sales, icon: ShoppingBag, color: "text-cyan-500" },
            { label: "Monthly Sales", value: stats.sales_this_month, icon: Calendar, color: "text-purple-500" },
            { label: "Monthly Revenue", value: `$${stats.revenue_this_month}`, icon: TrendingUp, color: "text-rose-500" }
          ].map((stat, i) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.1 },
              className: "bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm hover:border-cyan-500/30 transition-all group",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-4", children: /* @__PURE__ */ jsx("div", { className: `p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border)] ${stat.color} group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsx(stat.icon, { size: 20 }) }) }),
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-[var(--text-main)] font-mono", children: stat.value }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1", children: stat.label })
              ]
            },
            stat.label
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-8 py-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-main)]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 rounded-lg text-cyan-500", children: /* @__PURE__ */ jsx(ShoppingBag, { size: 20 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-[var(--text-main)] italic", children: "Recent Transactions" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest", children: "Real-time purchase logs" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Link, { href: route("admin.sales.paid-projects"), className: "px-6 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/30 transition-all flex items-center gap-2", children: [
                "View Paid Projects ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-[var(--bg-main)] border-b border-[var(--border)]", children: [
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Transaction_ID" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Project" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Buyer" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Amount" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Gateway" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]", children: "Timestamp" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[var(--border)]", children: sales.data.map((sale) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-[var(--bg-main)]/50 transition-colors group", children: [
                /* @__PURE__ */ jsxs("td", { className: "px-8 py-5 text-[10px] font-mono text-cyan-500/70 uppercase", children: [
                  "#",
                  sale.payment_id || sale.id
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Package, { size: 14 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase text-[var(--text-main)] tracking-widest", children: sale.project?.title }),
                    /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-[var(--text-muted)] font-bold italic", children: [
                      "By @",
                      sale.project?.user?.name
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxs("td", { className: "px-8 py-5", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase text-[var(--text-main)] tracking-widest", children: sale.user?.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-[9px] text-[var(--text-muted)] font-bold", children: sale.user?.email })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-8 py-5 text-[10px] font-black text-[var(--text-main)] font-mono", children: [
                  "$",
                  sale.amount
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-5", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: sale.payment_method }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-5", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500 tracking-widest", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
                  sale.status
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: new Date(sale.created_at).toLocaleDateString() })
              ] }, sale.id)) })
            ] }) }),
            sales.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "px-8 py-6 bg-[var(--bg-main)] border-t border-[var(--border)] flex justify-center gap-2", children: sales.links.map((link, i) => /* @__PURE__ */ jsx(
              Link,
              {
                href: link.url,
                dangerouslySetInnerHTML: { __html: link.label },
                className: `px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${link.active ? "bg-cyan-500 border-cyan-500 text-black shadow-lg" : "bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]"} ${!link.url && "opacity-30 pointer-events-none"}`
              },
              i
            )) })
          ] })
        ] })
      ]
    }
  );
}
export {
  Index as default
};
