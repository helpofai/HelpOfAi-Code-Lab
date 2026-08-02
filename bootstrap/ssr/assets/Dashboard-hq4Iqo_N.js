import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Store, Plus, DollarSign, Briefcase, ArrowUpRight, ShoppingCart, Activity, Code2, Github, CheckCircle2, RefreshCw, Trash2, Shield, ChevronRight, CreditCard } from "lucide-react";
import axios from "axios";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function VendorsDashboard({ totalEarnings = 0, totalSales = 0, projectCount = 0, recentSales = [] }) {
  const { auth } = usePage().props;
  const user = auth.user;
  const toast = useToast();
  const [connections, setConnections] = useState([]);
  const [newConnection, setNewConnection] = useState({ provider: "github", name: "", token: "" });
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  useEffect(() => {
    fetchConnections();
  }, []);
  const fetchConnections = async () => {
    try {
      const { data } = await axios.get("/api/vendors/connections");
      setConnections(data);
    } catch (e) {
      console.error("Failed to load connections");
    }
  };
  const handleAddConnection = async (e) => {
    e.preventDefault();
    setIsAddingConnection(true);
    try {
      await axios.post("/api/vendors/connections", newConnection);
      toast.success("Connection added and verified!");
      setNewConnection({ provider: "github", name: "", token: "" });
      fetchConnections();
    } catch (e2) {
      toast.error(e2.response?.data?.message || "Verification failed. Check token.");
    } finally {
      setIsAddingConnection(false);
    }
  };
  const handleVerifyConnection = async (id) => {
    try {
      const { data } = await axios.post(`/api/vendors/connections/${id}/verify`);
      if (data.is_valid) toast.success("Connection verified successfully!");
      else toast.error("Connection failed.");
      fetchConnections();
    } catch (e) {
      toast.error("Connection verification failed.");
      fetchConnections();
    }
  };
  const handleDeleteConnection = async (id) => {
    if (!confirm("Remove this integration?")) return;
    try {
      await axios.delete(`/api/vendors/connections/${id}`);
      toast.success("Connection removed.");
      fetchConnections();
    } catch (e) {
      toast.error("Failed to remove connection.");
    }
  };
  const isHealthy = connections.some((c) => c.is_valid);
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20", children: /* @__PURE__ */ jsx(Store, { className: "text-white", size: 24 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-[var(--text-main)] tracking-tight leading-none", children: "Vendors Command Center" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-purple-500 font-bold uppercase tracking-widest mt-1", children: "Advanced Analytics & Operations" })
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Vendors Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "p-6 md:p-8 lg:p-12 overflow-y-auto min-h-screen pb-32", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 md:p-12 shadow-2xl shadow-indigo-500/20 group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:rotate-12 transition-transform duration-700", children: /* @__PURE__ */ jsx(Store, { size: 200 }) }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
              /* @__PURE__ */ jsxs("h1", { className: "text-3xl md:text-5xl font-black text-white tracking-tighter mb-4", children: [
                "Welcome back, ",
                user.name.split(" ")[0]
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-indigo-100 font-medium max-w-xl text-lg leading-relaxed", children: "You are currently viewing your advanced Vendors Dashboard. Manage your integrations, track your revenue, and deploy new products to the marketplace." }),
              /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-4", children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("vendors.sell"),
                    className: "px-6 py-3 bg-white text-indigo-600 font-black uppercase tracking-widest text-xs rounded-full hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { size: 16 }),
                      " Deploy New Product"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("vendors.payments"),
                    className: "px-6 py-3 bg-indigo-500/30 border border-indigo-400/30 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-indigo-500/50 hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm",
                    children: [
                      /* @__PURE__ */ jsx(DollarSign, { size: 16 }),
                      " View Payouts"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("vendors.projects"),
                    className: "px-6 py-3 bg-purple-500/30 border border-purple-400/30 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-purple-500/50 hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm",
                    children: [
                      /* @__PURE__ */ jsx(Briefcase, { size: 16 }),
                      " Manage Projects"
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all group", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-emerald-500/10 rounded-2xl", children: /* @__PURE__ */ jsx(DollarSign, { className: "text-emerald-500", size: 24 }) }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full", children: [
                  /* @__PURE__ */ jsx(ArrowUpRight, { size: 14 }),
                  " 70% Cut"
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1", children: "Total Earnings" }),
              /* @__PURE__ */ jsxs("div", { className: "text-4xl font-black text-[var(--text-main)] tracking-tighter group-hover:text-emerald-500 transition-colors", children: [
                "$",
                Number(totalEarnings).toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all group", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-500/10 rounded-2xl", children: /* @__PURE__ */ jsx(ShoppingCart, { className: "text-blue-500", size: 24 }) }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1", children: "Total Sales" }),
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-black text-[var(--text-main)] tracking-tighter group-hover:text-blue-500 transition-colors", children: totalSales })
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("vendors.projects"), className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-purple-500/30 transition-all group block", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-purple-500/10 rounded-2xl", children: /* @__PURE__ */ jsx(Briefcase, { className: "text-purple-500", size: 24 }) }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[var(--text-muted)] group-hover:text-purple-500 transition-colors uppercase tracking-widest", children: "View All" })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1", children: "Active Products" }),
              /* @__PURE__ */ jsx("div", { className: "text-4xl font-black text-[var(--text-main)] tracking-tighter group-hover:text-purple-500 transition-colors", children: projectCount })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: `absolute inset-0 opacity-5 ${isHealthy ? "bg-emerald-500" : "bg-red-500"}` }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6 relative z-10", children: /* @__PURE__ */ jsx("div", { className: `p-3 rounded-2xl ${isHealthy ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`, children: /* @__PURE__ */ jsx(Activity, { size: 24 }) }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1 relative z-10", children: "Pipeline Status" }),
              /* @__PURE__ */ jsx("div", { className: `text-2xl font-black tracking-tighter mt-2 relative z-10 ${isHealthy ? "text-emerald-500" : "text-red-500"}`, children: isHealthy ? "Operational" : "Action Required" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)] font-medium mt-2 relative z-10", children: isHealthy ? "Source control linked." : "Link a repository." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" }),
                /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between mb-8", children: /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-black text-[var(--text-main)] tracking-tighter flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(Code2, { size: 28, className: "text-cyan-500" }),
                    " Source Code Integrations"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[var(--text-muted)] mt-2 max-w-md", children: "Connect your repository providers. This allows our asset server to securely fetch your source code and compile license keys for your buyers automatically." })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  connections.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-8 border border-dashed border-[var(--border)] rounded-2xl text-center space-y-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-[var(--bg-main)] rounded-full flex items-center justify-center mx-auto text-[var(--text-muted)]", children: /* @__PURE__ */ jsx(Github, { size: 32 }) }),
                    /* @__PURE__ */ jsx("h4", { className: "text-lg font-black text-[var(--text-main)]", children: "No integrations yet" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--text-muted)] font-medium max-w-sm mx-auto", children: "You need to link at least one repository provider to sell digital products on the marketplace." })
                  ] }),
                  connections.map((conn) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-cyan-500/50 rounded-2xl transition-all group", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
                      /* @__PURE__ */ jsx("div", { className: `p-3 rounded-xl shadow-inner ${conn.provider === "github" ? "bg-[#24292e] text-white" : conn.provider === "gitlab" ? "bg-orange-500/20 text-orange-500" : "bg-blue-500/20 text-blue-500"}`, children: /* @__PURE__ */ jsx(Github, { size: 24 }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h4", { className: "text-base font-black text-[var(--text-main)]", children: conn.name }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] bg-[var(--bg-main)] px-2 py-1 rounded-md", children: conn.provider }),
                          conn.is_valid ? /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-emerald-500 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md", children: [
                            /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }),
                            " Verified"
                          ] }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md", children: "Failed Connection" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                      /* @__PURE__ */ jsx("button", { onClick: () => handleVerifyConnection(conn.id), className: "p-2.5 text-cyan-500 hover:bg-cyan-500/10 rounded-xl transition-all", title: "Verify Connection", children: /* @__PURE__ */ jsx(RefreshCw, { size: 18 }) }),
                      /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteConnection(conn.id), className: "p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all", title: "Remove Connection", children: /* @__PURE__ */ jsx(Trash2, { size: 18 }) })
                    ] })
                  ] }, conn.id)),
                  /* @__PURE__ */ jsxs("form", { onSubmit: handleAddConnection, className: "mt-8 p-6 border border-[var(--border)] rounded-2xl bg-[var(--bg-main)]/30 space-y-5", children: [
                    /* @__PURE__ */ jsxs("h5", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Plus, { size: 16, className: "text-cyan-500" }),
                      " Add New Provider"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Provider" }),
                        /* @__PURE__ */ jsxs(
                          "select",
                          {
                            value: newConnection.provider,
                            onChange: (e) => setNewConnection({ ...newConnection, provider: e.target.value }),
                            className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-main)] py-3 px-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all",
                            children: [
                              /* @__PURE__ */ jsx("option", { value: "github", children: "GitHub" }),
                              /* @__PURE__ */ jsx("option", { value: "gitlab", children: "GitLab" }),
                              /* @__PURE__ */ jsx("option", { value: "bitbucket", children: "Bitbucket" })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Label Name" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "e.g. Work Account",
                            value: newConnection.name,
                            onChange: (e) => setNewConnection({ ...newConnection, name: e.target.value }),
                            className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-main)] py-3 px-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all",
                            required: true
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Access Token" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "password",
                            placeholder: "Token (ghp_...)",
                            value: newConnection.token,
                            onChange: (e) => setNewConnection({ ...newConnection, token: e.target.value }),
                            className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-mono text-[var(--text-main)] py-3 px-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all",
                            required: true
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: isAddingConnection,
                        className: "w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20",
                        children: isAddingConnection ? /* @__PURE__ */ jsx(Activity, { className: "animate-spin", size: 18 }) : "Establish Connection"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl space-y-6 shadow-xl relative overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gray-500 to-gray-700" }),
                /* @__PURE__ */ jsxs("h4", { className: "text-lg font-black text-[var(--text-main)] uppercase tracking-tighter flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(Shield, { size: 24, className: "text-gray-400" }),
                  " Access Token Guide"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("h5", { className: "text-xs font-black text-[var(--text-main)] uppercase tracking-widest", children: "GitHub Token Generation" }),
                    /* @__PURE__ */ jsxs("ol", { className: "text-sm text-[var(--text-muted)] font-medium space-y-3 list-decimal list-inside", children: [
                      /* @__PURE__ */ jsxs("li", { children: [
                        "Go to GitHub ",
                        /* @__PURE__ */ jsx("strong", { children: "Account Settings" }),
                        " > ",
                        /* @__PURE__ */ jsx("strong", { children: "Developer Settings" }),
                        "."
                      ] }),
                      /* @__PURE__ */ jsxs("li", { children: [
                        "Select ",
                        /* @__PURE__ */ jsx("strong", { children: "Tokens (classic)" }),
                        "."
                      ] }),
                      /* @__PURE__ */ jsxs("li", { children: [
                        "Click ",
                        /* @__PURE__ */ jsx("strong", { children: "Generate new token" }),
                        "."
                      ] }),
                      /* @__PURE__ */ jsxs("li", { children: [
                        "Under scopes, check the ",
                        /* @__PURE__ */ jsx("strong", { className: "text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded", children: "repo" }),
                        " box."
                      ] }),
                      /* @__PURE__ */ jsx("li", { children: "Generate, copy, and paste it above." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4 md:border-l border-[var(--border)] md:pl-8", children: [
                    /* @__PURE__ */ jsx("h5", { className: "text-xs font-black text-[var(--text-main)] uppercase tracking-widest", children: "Security Architecture" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--text-muted)] font-medium leading-relaxed", children: "Your source code remains entirely in your private repository. Our asset server only uses this token to fetch a zipball of your code at the exact moment of a successful purchase, which is then securely routed to the buyer with an RSA digital signature." })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl space-y-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 px-2", children: "Quick Actions" }),
                /* @__PURE__ */ jsxs(Link, { href: route("vendors.sell"), className: "flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-main)] group transition-all", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Store, { size: 20 }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-[var(--text-main)]", children: "Sell a Product" })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" })
                ] }),
                /* @__PURE__ */ jsxs(Link, { href: route("vendors.payments"), className: "flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-main)] group transition-all", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(DollarSign, { size: 20 }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-[var(--text-main)]", children: "Payments & Payouts" })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" })
                ] }),
                /* @__PURE__ */ jsxs(Link, { href: route("my-account"), className: "flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-main)] group transition-all", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(CreditCard, { size: 20 }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-[var(--text-main)]", children: "Payout Accounts" })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" })
                ] }),
                /* @__PURE__ */ jsxs(Link, { href: route("support.index"), className: "flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-main)] group transition-all", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-orange-500/10 text-orange-500 rounded-xl group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Shield, { size: 20 }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-[var(--text-main)]", children: "Vendor Support" })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-6 px-2 flex items-center justify-between", children: [
                  "Recent Sales",
                  /* @__PURE__ */ jsx(Link, { href: route("vendors.payments"), className: "text-indigo-500 hover:underline", children: "View All" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-4", children: recentSales && recentSales.length > 0 ? recentSales.map((sale) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-main)]/50 border border-[var(--border)]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[var(--text-main)] truncate max-w-[120px]", children: sale.project?.name || "Product" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-[var(--text-muted)]", children: new Date(sale.created_at).toLocaleDateString() })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-right flex flex-col", children: /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-emerald-500", children: [
                    "+$",
                    (sale.amount * 0.7).toFixed(2)
                  ] }) })
                ] }, sale.id)) : /* @__PURE__ */ jsxs("div", { className: "text-center p-6 text-[var(--text-muted)]", children: [
                  /* @__PURE__ */ jsx(ShoppingCart, { className: "mx-auto mb-2 opacity-50", size: 24 }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "No recent sales." })
                ] }) })
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  VendorsDashboard as default
};
