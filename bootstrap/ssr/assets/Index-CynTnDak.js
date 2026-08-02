import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, TrendingUp, Settings, Search, Plus, Globe, FileCode2, CheckCircle2, XCircle, Edit2, Trash2, Activity, Pointer, DollarSign, Save } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { I as InputError } from "./InputError-BBff0LOp.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function AdsIndex({ auth, ads, chartData }) {
  const { siteSettings } = usePage().props;
  const [activeTab, setActiveTab] = useState("units");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const { data: networkData, setData: setNetworkData, post: postNetwork, processing: networkProcessing } = useForm({
    settings: {
      adsense_publisher_id: siteSettings.adsense_publisher_id || "",
      adsense_auto_ads: siteSettings.adsense_auto_ads || "0",
      facebook_app_id: siteSettings.facebook_app_id || ""
    }
  });
  const handleNetworkSubmit = (e) => {
    e.preventDefault();
    postNetwork(route("admin.ads.settings"));
  };
  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    name: "",
    provider: "adsense",
    location: "top_banner",
    client_id: "",
    slot_id: "",
    format: "auto",
    custom_code: "",
    is_active: true
  });
  const filteredAds = ads.filter(
    (ad) => ad.name.toLowerCase().includes(searchTerm.toLowerCase()) || ad.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const openModal = (ad = null) => {
    clearErrors();
    if (ad) {
      setEditingAd(ad);
      setData({
        name: ad.name,
        provider: ad.provider,
        location: ad.location,
        client_id: ad.client_id || "",
        slot_id: ad.slot_id || "",
        format: ad.format || "auto",
        custom_code: ad.custom_code || "",
        is_active: ad.is_active
      });
    } else {
      setEditingAd(null);
      reset();
      setData("is_active", true);
    }
    setIsModalOpen(true);
  };
  const submit = (e) => {
    e.preventDefault();
    if (editingAd) {
      put(route("admin.ads.update", editingAd.id), {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      post(route("admin.ads.store"), {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this ad unit?")) {
      destroy(route("admin.ads.destroy", id));
    }
  };
  const toggleStatus = (ad) => {
    put(route("admin.ads.update", ad.id), {
      data: { ...ad, is_active: !ad.is_active },
      preserveScroll: true
    });
  };
  const totals = useMemo(() => {
    if (!chartData) return { impressions: 0, clicks: 0, revenue: 0 };
    return chartData.reduce((acc, curr) => ({
      impressions: acc.impressions + curr.impressions,
      clicks: acc.clicks + curr.clicks,
      revenue: acc.revenue + curr.revenue
    }), { impressions: 0, clicks: 0, revenue: 0 });
  }, [chartData]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ jsxs("div", { className: "bg-[#050505] border border-[var(--border)] rounded-xl p-4 shadow-2xl", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-2", children: label }),
        /* @__PURE__ */ jsxs("p", { className: "text-cyan-500 font-black text-sm", children: [
          "Impressions: ",
          payload[0].value.toLocaleString()
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-emerald-500 font-black text-sm", children: [
          "Revenue: $",
          payload[1].value.toFixed(2)
        ] })
      ] });
    }
    return null;
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { user: auth.user, header: /* @__PURE__ */ jsx("h2", { className: "font-black text-xl text-[var(--text-main)] uppercase tracking-widest italic", children: "Ad Management" }), children: [
    /* @__PURE__ */ jsx(Head, { title: "Ad Management" }),
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "py-12 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-50" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 w-full md:w-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 bg-cyan-500/20 text-cyan-500 rounded-xl", children: /* @__PURE__ */ jsx(Megaphone, { size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-black text-sm uppercase tracking-widest text-[var(--text-main)]", children: "Global Ads" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)] mt-1", children: "Manage Units & Performance" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block h-8 w-px bg-[var(--border)] mx-2" }),
          /* @__PURE__ */ jsxs("div", { className: "flex bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setActiveTab("units"),
                className: `px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "units" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`,
                children: "Ad Units"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveTab("reports"),
                className: `px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "reports" ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1"}`,
                children: [
                  /* @__PURE__ */ jsx(TrendingUp, { size: 12 }),
                  " Reports"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveTab("networks"),
                className: `px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "networks" ? "bg-purple-500 text-black shadow-lg shadow-purple-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1"}`,
                children: [
                  /* @__PURE__ */ jsx(Settings, { size: 12 }),
                  " Networks"
                ]
              }
            )
          ] })
        ] }),
        activeTab === "units" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 16 }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "SEARCH ADS...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-main)] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => openModal(), className: "flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx(Plus, { size: 14 }),
            " New Ad"
          ] })
        ] })
      ] }),
      activeTab === "units" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        filteredAds.map((ad) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden transition-all hover:border-cyan-500/50 ${!ad.is_active && "opacity-70 grayscale"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${ad.provider === "adsense" ? "bg-amber-500/20 text-amber-500" : ad.provider === "facebook" ? "bg-blue-500/20 text-blue-500" : "bg-emerald-500/20 text-emerald-500"}`, children: ad.provider === "adsense" ? /* @__PURE__ */ jsx(Globe, { size: 20 }) : ad.provider === "facebook" ? /* @__PURE__ */ jsx(Globe, { size: 20 }) : /* @__PURE__ */ jsx(FileCode2, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-black text-sm uppercase tracking-widest text-[var(--text-main)]", children: ad.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: [
                  ad.location.replace("_", " "),
                  " • ",
                  ad.provider
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => toggleStatus(ad), className: `p-2 rounded-lg transition-all ${ad.is_active ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white" : "bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"}`, children: ad.is_active ? /* @__PURE__ */ jsx(CheckCircle2, { size: 16 }) : /* @__PURE__ */ jsx(XCircle, { size: 16 }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => openModal(ad), className: "p-2 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg hover:text-cyan-500 transition-all", children: /* @__PURE__ */ jsx(Edit2, { size: 16 }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(ad.id), className: "p-2 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg hover:text-red-500 transition-all", children: /* @__PURE__ */ jsx(Trash2, { size: 16 }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            ad.client_id && /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] p-2 rounded truncate", children: [
              "Client: ",
              ad.client_id
            ] }),
            ad.slot_id && /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] p-2 rounded truncate", children: [
              "Slot: ",
              ad.slot_id
            ] })
          ] })
        ] }, ad.id)),
        filteredAds.length === 0 && /* @__PURE__ */ jsxs("div", { className: "col-span-full py-12 text-center border border-dashed border-[var(--border)] rounded-2xl", children: [
          /* @__PURE__ */ jsx(Megaphone, { className: "mx-auto h-12 w-12 text-[var(--text-muted)] opacity-20 mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-black text-[var(--text-main)] uppercase tracking-widest italic mb-2", children: "No Ad Units Found" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)]", children: 'Click "New Ad" to integrate AdSense, Facebook, or Custom banners.' })
        ] })
      ] }),
      activeTab === "reports" && /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsx(Activity, { size: 64, className: "text-cyan-500" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Total Impressions (30 Days)" }),
            /* @__PURE__ */ jsx("p", { className: "text-4xl font-black text-cyan-500 tracking-tighter italic", children: totals.impressions.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsx(Pointer, { size: 64, className: "text-purple-500" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Total Clicks (30 Days)" }),
            /* @__PURE__ */ jsx("p", { className: "text-4xl font-black text-purple-500 tracking-tighter italic", children: totals.clicks.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsx(DollarSign, { size: 64, className: "text-emerald-500" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Est. Revenue (30 Days)" }),
            /* @__PURE__ */ jsxs("p", { className: "text-4xl font-black text-emerald-500 tracking-tighter italic", children: [
              "$",
              totals.revenue.toFixed(2)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-[var(--text-main)] uppercase tracking-widest italic mb-8", children: "Performance Trajectory" }),
          /* @__PURE__ */ jsx("div", { className: "h-[400px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: chartData, margin: { top: 10, right: 30, left: 0, bottom: 0 }, children: [
            /* @__PURE__ */ jsxs("defs", { children: [
              /* @__PURE__ */ jsxs("linearGradient", { id: "colorImpressions", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#06b6d4", stopOpacity: 0.3 }),
                /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#06b6d4", stopOpacity: 0 })
              ] }),
              /* @__PURE__ */ jsxs("linearGradient", { id: "colorRevenue", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.3 }),
                /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)", vertical: false }),
            /* @__PURE__ */ jsx(XAxis, { dataKey: "date", stroke: "var(--text-muted)", fontSize: 10, tickMargin: 10, axisLine: false, tickLine: false }),
            /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", stroke: "var(--text-muted)", fontSize: 10, tickMargin: 10, axisLine: false, tickLine: false }),
            /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", stroke: "var(--text-muted)", fontSize: 10, tickMargin: 10, axisLine: false, tickLine: false }),
            /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
            /* @__PURE__ */ jsx(Area, { yAxisId: "left", type: "monotone", dataKey: "impressions", stroke: "#06b6d4", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorImpressions)" }),
            /* @__PURE__ */ jsx(Area, { yAxisId: "right", type: "monotone", dataKey: "revenue", stroke: "#10b981", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorRevenue)" })
          ] }) }) })
        ] })
      ] }),
      activeTab === "networks" && /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsx(Settings, { className: "text-cyan-500", size: 24 }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-[var(--text-main)] uppercase tracking-widest italic", children: "Global Ad Network Settings" })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleNetworkSubmit, className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-[var(--text-main)] uppercase tracking-widest border-b border-[var(--border)] pb-2", children: "Google AdSense" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Publisher ID" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: networkData.settings.adsense_publisher_id,
                    onChange: (e) => setNetworkData("settings", { ...networkData.settings, adsense_publisher_id: e.target.value }),
                    className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-mono text-[var(--text-main)] p-3 focus:ring-cyan-500",
                    placeholder: "ca-pub-1234567890"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] mt-1", children: "Your main AdSense Publisher ID for auto ads." })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Enable Auto Ads" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: networkData.settings.adsense_auto_ads,
                    onChange: (e) => setNetworkData("settings", { ...networkData.settings, adsense_auto_ads: e.target.value }),
                    className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "0", children: "Disabled" }),
                      /* @__PURE__ */ jsx("option", { value: "1", children: "Enabled" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] mt-1", children: "Insert Google Auto Ads script in the site header." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 pt-6 border-t border-[var(--border)]", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-[var(--text-main)] uppercase tracking-widest border-b border-[var(--border)] pb-2", children: "Facebook Audience Network" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "App ID" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: networkData.settings.facebook_app_id,
                  onChange: (e) => setNetworkData("settings", { ...networkData.settings, facebook_app_id: e.target.value }),
                  className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-mono text-[var(--text-main)] p-3 focus:ring-cyan-500",
                  placeholder: "1234567890"
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-8 flex justify-end", children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: networkProcessing,
              className: "flex items-center gap-2 px-8 py-4 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx(Save, { size: 16 }),
                " Save Configuration"
              ]
            }
          ) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isModalOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-black/80 backdrop-blur-sm", onClick: () => setIsModalOpen(false) }),
      /* @__PURE__ */ jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic mb-6", children: editingAd ? "Edit Ad Unit" : "Create Ad Unit" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Ad Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data.name, onChange: (e) => setData("name", e.target.value), required: true, className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500", placeholder: "e.g. Header Banner" }),
              /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Provider" }),
              /* @__PURE__ */ jsxs("select", { value: data.provider, onChange: (e) => setData("provider", e.target.value), className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500", children: [
                /* @__PURE__ */ jsx("option", { value: "adsense", children: "Google AdSense" }),
                /* @__PURE__ */ jsx("option", { value: "facebook", children: "Facebook Audience Network" }),
                /* @__PURE__ */ jsx("option", { value: "custom", children: "Custom HTML/JS" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Location" }),
              /* @__PURE__ */ jsxs("select", { value: data.location, onChange: (e) => setData("location", e.target.value), className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500", children: [
                /* @__PURE__ */ jsx("option", { value: "top_banner", children: "Top Banner" }),
                /* @__PURE__ */ jsx("option", { value: "sidebar", children: "Sidebar" }),
                /* @__PURE__ */ jsx("option", { value: "in_feed", children: "In-Feed (Between Projects)" }),
                /* @__PURE__ */ jsx("option", { value: "footer", children: "Footer" }),
                /* @__PURE__ */ jsx("option", { value: "video_reward", children: "Video Reward Ad" }),
                /* @__PURE__ */ jsx("option", { value: "adsLock", children: "Ads Lock" })
              ] })
            ] }),
            data.provider !== "custom" && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Format" }),
              /* @__PURE__ */ jsxs("select", { value: data.format, onChange: (e) => setData("format", e.target.value), className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-xs font-bold text-[var(--text-main)] p-3 focus:ring-cyan-500", children: [
                /* @__PURE__ */ jsx("option", { value: "auto", children: "Auto Responsive" }),
                /* @__PURE__ */ jsx("option", { value: "fluid", children: "Fluid" }),
                /* @__PURE__ */ jsx("option", { value: "horizontal", children: "Horizontal" }),
                /* @__PURE__ */ jsx("option", { value: "vertical", children: "Vertical" }),
                /* @__PURE__ */ jsx("option", { value: "rectangle", children: "Rectangle" }),
                /* @__PURE__ */ jsx("option", { value: "video", children: "Video" })
              ] })
            ] })
          ] }),
          data.provider !== "custom" ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border)]", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Publisher / Client ID" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data.client_id, onChange: (e) => setData("client_id", e.target.value), className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded text-xs font-mono text-[var(--text-main)] p-3 focus:ring-cyan-500", placeholder: "ca-pub-1234567890" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Ad Slot ID" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: data.slot_id, onChange: (e) => setData("slot_id", e.target.value), className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded text-xs font-mono text-[var(--text-main)] p-3 focus:ring-cyan-500", placeholder: "1234567890" })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2", children: "Custom Ad Code (HTML/JS)" }),
            /* @__PURE__ */ jsx("textarea", { value: data.custom_code, onChange: (e) => setData("custom_code", e.target.value), rows: "6", className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded font-mono text-xs text-[var(--text-main)] p-3 focus:ring-cyan-500", placeholder: "<!-- Paste Ad Code Here -->" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border)]", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", id: "is_active", checked: data.is_active, onChange: (e) => setData("is_active", e.target.checked), className: "rounded border-gray-300 text-cyan-500 shadow-sm focus:ring-cyan-500 bg-[var(--bg-main)]" }),
            /* @__PURE__ */ jsx("label", { htmlFor: "is_active", className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]", children: "Enable this Ad Unit instantly" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4 pt-4 border-t border-[var(--border)]", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-6 py-3 border border-[var(--border)] text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest rounded hover:text-[var(--text-main)] transition-all", children: "Cancel" }),
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "px-6 py-3 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded hover:bg-white transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50", children: editingAd ? "Save Changes" : "Create Ad Unit" })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AdsIndex as default
};
