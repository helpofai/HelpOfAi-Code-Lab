import { jsx, jsxs } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, ArrowRight, Users, Code2, DollarSign, Activity, TrendingUp, Cpu } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function AdminDashboard() {
  const { auth } = usePage().props;
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/stats");
        setStats(res.data);
      } catch (e) {
        console.error("Diagnostic failure:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-64 space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-rose-500 uppercase tracking-[0.5em] animate-pulse", children: "Initializing_Admin_Core..." })
    ] }) });
  }
  if (!stats) {
    return /* @__PURE__ */ jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-64 space-y-6", children: /* @__PURE__ */ jsx("div", { className: "text-rose-500 font-bold", children: "Failed to load system diagnostics." }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-rose-500/10 border border-rose-400/30 rounded-lg", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "text-rose-500", size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-[var(--text-main)] uppercase italic leading-none", children: "Admin_Command" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-rose-500 font-bold uppercase tracking-[0.4em] mt-1", children: "Level 0 Security Clearance Active" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black text-emerald-500 uppercase tracking-widest", children: "System_Optimal" })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Admin Dashboard" }),
          /* @__PURE__ */ jsx("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto relative z-10 space-y-10", children: [
            stats.users.pending_verifications > 0 && /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex items-center justify-between shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 100 }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-amber-500/20 text-amber-500 rounded-xl", children: /* @__PURE__ */ jsx(AlertCircle, { size: 24, className: "animate-pulse" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-widest text-amber-500", children: "Identity Verifications Pending" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-[var(--text-muted)] mt-1", children: [
                    stats.users.pending_verifications,
                    " user(s) have submitted identity documents requiring admin approval."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Link, { href: route("admin.users"), className: "relative z-10 flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-all shadow-lg", children: [
                "Review Documents ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
              { label: "TOTAL_USERS", val: stats.users.total, icon: Users, color: "text-cyan-500" },
              { label: "TOTAL_CORES", val: stats.projects.total, icon: Code2, color: "text-purple-500" },
              { label: "ESTIMATED_MRR", val: `$${stats.revenue.monthly}`, icon: DollarSign, color: "text-emerald-500" },
              { label: "SYSTEM_UPTIME", val: stats.system.uptime, icon: Activity, color: "text-rose-500" }
            ].map((s, i) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: i * 0.1 },
                className: "bg-[var(--bg-surface)] border border-[var(--border)] p-8 rounded-2xl shadow-xl text-left",
                children: [
                  /* @__PURE__ */ jsx(s.icon, { className: `${s.color} mb-4 opacity-80`, size: 24 }),
                  /* @__PURE__ */ jsx("div", { className: "text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-1", children: s.label }),
                  /* @__PURE__ */ jsx("div", { className: "text-3xl font-black text-[var(--text-main)] tracking-tighter italic", children: s.val })
                ]
              },
              i
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 text-left", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] p-10 rounded-[2rem] shadow-xl relative overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-8 opacity-10", children: /* @__PURE__ */ jsx(TrendingUp, { size: 120 }) }),
                /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-10 flex items-center", children: [
                  /* @__PURE__ */ jsx(TrendingUp, { size: 16, className: "mr-3 text-emerald-500" }),
                  " Revenue_Growth_Matrix"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-[300px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: stats.revenue.chart, children: [
                  /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorRev", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.3 }),
                    /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
                  ] }) }),
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#ffffff05", vertical: false }),
                  /* @__PURE__ */ jsx(
                    XAxis,
                    {
                      dataKey: "name",
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: "#64748b", fontSize: 10, fontWeight: "bold" },
                      dy: 10
                    }
                  ),
                  /* @__PURE__ */ jsx(YAxis, { hide: true }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: { backgroundColor: "#050505", border: "1px solid #ffffff10", borderRadius: "12px" },
                      itemStyle: { color: "#10b981", fontSize: "10px", fontWeight: "black", textTransform: "uppercase" },
                      labelStyle: { color: "#64748b", fontSize: "8px", marginBottom: "4px" }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Area,
                    {
                      type: "monotone",
                      dataKey: "revenue",
                      stroke: "#10b981",
                      strokeWidth: 3,
                      fillOpacity: 1,
                      fill: "url(#colorRev)",
                      animationDuration: 2e3
                    }
                  )
                ] }) }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 bg-[var(--bg-surface)] border border-[var(--border)] p-10 rounded-[2rem] shadow-xl", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-10 flex items-center", children: [
                  /* @__PURE__ */ jsx(Cpu, { size: 16, className: "mr-3 text-rose-500" }),
                  " User Roles Overview"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-8", children: Object.entries(stats.users.roles).map(([role, count]) => /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: role }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-black text-[var(--text-main)]", children: count })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { width: 0 },
                      animate: { width: `${count / stats.users.total * 100}%` },
                      className: `h-full ${role === "admin" ? "bg-rose-500" : "bg-cyan-500"}`
                    }
                  ) })
                ] }, role)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] p-10 rounded-[2rem] shadow-xl", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-10 flex items-center", children: [
                /* @__PURE__ */ jsx(Users, { size: 16, className: "mr-3 text-cyan-500" }),
                " Recent Users"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
                /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left border-b border-[var(--border)]", children: [
                  /* @__PURE__ */ jsx("th", { className: "pb-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Ident" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right", children: "Arrival" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[var(--border)]", children: stats.users.latest.map((u) => /* @__PURE__ */ jsxs("tr", { className: "group", children: [
                  /* @__PURE__ */ jsx("td", { className: "py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[var(--text-main)] group-hover:text-cyan-500 transition-colors", children: u.name }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] text-[var(--text-muted)]", children: u.email })
                  ] }) }),
                  /* @__PURE__ */ jsx("td", { className: "py-4 text-right", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: new Date(u.created_at).toLocaleDateString() }) })
                ] }, u.id)) })
              ] }) })
            ] })
          ] }) })
        ]
      }
    )
  ] });
}
export {
  AdminDashboard as default
};
