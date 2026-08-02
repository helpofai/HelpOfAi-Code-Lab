import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Head, Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CreditCard, Zap, Activity, ArrowRight, ShieldCheck, Sparkles, User, Database, Shield, Tag, ShoppingBag, Lock, Eye, Layout, AppWindow, Braces, Terminal, Code2, Monitor, Share2, Globe, CheckCircle2, Rocket, Clock } from "lucide-react";
import axios from "axios";
import { P as PublicLayout } from "./PublicLayout-Bk6Js6hx.js";
import { A as AdUnit } from "./AdUnit-CJudqw2U.js";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import { D as DEFAULT_TEMPLATE, M as MonacoWrapper } from "./MonacoWrapper-CBx8khtF.js";
import { P as ProjectPreviewContent } from "./ProjectPreviewContent-D0P3mb04.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./ProBackground-D5SseK5s.js";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@monaco-editor/react";
function PaymentModal({ isOpen, onClose, user }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState("stripe");
  const toast = useToast();
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.post("/api/subscription/checkout", { gateway: selectedGateway });
      if (res.data.url) {
        window.location.href = res.data.url;
        return;
      }
      if (res.data.gateway === "razorpay") {
        const options = {
          key: res.data.key,
          amount: res.data.amount,
          currency: "INR",
          name: "HOACodeLab Pro",
          description: "Monthly Pro Subscription",
          order_id: res.data.order_id,
          handler: async function(response) {
            try {
              await axios.post("/api/subscription/verify", {
                gateway: "razorpay",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              window.location.href = "/dashboard?payment=success";
            } catch (e) {
              toast.error("Payment verification failed.");
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
        onClose();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Connection failed.");
    } finally {
      setIsProcessing(false);
    }
  };
  const gateways = [
    { id: "stripe", name: "Global_Card", desc: "Credit / Debit Card", icon: CreditCard, color: "text-indigo-500" },
    { id: "razorpay", name: "Razorpay", desc: "UPI / Cards / Net", icon: Zap, color: "text-blue-500" },
    { id: "phonepe", name: "PhonePe", desc: "Direct UPI App", icon: Activity, color: "text-purple-500" }
  ];
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[150] flex items-center justify-center p-6", children: [
    /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose, className: "absolute inset-0 bg-black/80 backdrop-blur-xl" }),
    /* @__PURE__ */ jsx(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "p-8 lg:p-12 space-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)] leading-none", children: "Initialize_Checkout" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-cyan-500 uppercase tracking-[0.4em]", children: "Secure Payment Gateway" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-2 hover:bg-white/5 rounded-full transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: gateways.map((gw) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedGateway(gw.id),
          className: `w-full p-6 rounded-2xl border transition-all flex items-center justify-between group ${selectedGateway === gw.id ? "bg-cyan-500/5 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]" : "bg-[var(--bg-elevated)] border-[var(--border)] hover:border-white/10"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsx("div", { className: `p-3 rounded-xl bg-black/20 ${selectedGateway === gw.id ? gw.color : "text-[var(--text-muted)]"}`, children: /* @__PURE__ */ jsx(gw.icon, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsx("p", { className: `text-xs font-black uppercase tracking-widest ${selectedGateway === gw.id ? "text-[var(--text-main)]" : "text-[var(--text-muted)]"}`, children: gw.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-[var(--text-muted)] uppercase italic", children: gw.desc })
              ] })
            ] }),
            selectedGateway === gw.id && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-cyan-500 animate-pulse" })
          ]
        },
        gw.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)]", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            disabled: isProcessing,
            onClick: handlePayment,
            className: "w-full py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-cyan-500/10 active:scale-[0.98] disabled:opacity-50",
            children: [
              isProcessing ? "Synchronizing..." : "Authorize Transaction",
              " ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-2 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { size: 12, className: "text-emerald-500" }),
          " Secure Encrypted Connection"
        ] })
      ] })
    ] }) })
  ] }) });
}
const HomeEditor = () => {
  const [html, setHtml] = useState(DEFAULT_TEMPLATE.html);
  const [css, setCss] = useState(DEFAULT_TEMPLATE.css);
  const [js, setJs] = useState(DEFAULT_TEMPLATE.js);
  const [activeTab, setActiveTab] = useState("html");
  const [previewContent, setPreviewContent] = useState("");
  const [logs, setLogs] = useState([]);
  const compile = async () => {
    let compiledCss = css;
    let compiledJs = js;
    if (window.Sass && (css.includes("$") || css.includes("{"))) {
      window.Sass.compile(css, (result) => {
        if (result.text) compiledCss = result.text;
      });
    }
    const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { background: #050505; color: white; margin: 0; padding: 0; min-height: 100vh; display: flex; flex-direction: column; }
                    ${compiledCss}
                </style>
                <script>
                    console.log = (...args) => {
                        window.parent.postMessage({ type: 'LOG', content: args.join(' ') }, '*');
                    };
                <\/script>
            </head>
            <body>${html}<script>${compiledJs}<\/script></body>
            </html>
        `;
    setPreviewContent(content);
  };
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.type === "LOG") {
        setLogs((prev) => [...prev, e.data.content].slice(-3));
      }
    };
    window.addEventListener("message", handleMessage);
    const timeout = setTimeout(compile, 800);
    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  }, [html, css, js]);
  return /* @__PURE__ */ jsxs("div", { className: "relative group max-w-6xl mx-auto text-left", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-[2.5rem] blur-3xl opacity-50" }),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "h-14 bg-[var(--bg-main)] border-b border-[var(--border)] flex items-center justify-between px-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 mr-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-rose-500/40" }),
            /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-amber-500/40" }),
            /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500/40" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["html", "css", "js"].map((tab) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab(tab),
              className: `px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"}`,
              children: tab
            },
            tab
          )) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5 rounded-full", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-emerald-500 animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase text-emerald-500/80 tracking-widest", children: "Live_Sandbox" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 h-[500px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative border-r border-[var(--border)] bg-[#050505]", children: [
          /* @__PURE__ */ jsx("div", { className: "h-full pt-2", children: /* @__PURE__ */ jsx(
            MonacoWrapper,
            {
              language: activeTab,
              value: activeTab === "html" ? html : activeTab === "css" ? css : js,
              onChange: (val) => {
                if (activeTab === "html") setHtml(val);
                else if (activeTab === "css") setCss(val);
                else setJs(val);
              },
              fontSize: 13
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-4 right-4 z-20", children: /* @__PURE__ */ jsx(AnimatePresence, { children: logs.length > 0 && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl space-y-1",
              children: logs.map((log, i) => /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-mono text-cyan-500 flex gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "opacity-30", children: [
                  "[",
                  (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour12: false, minute: "2-digit", second: "2-digit" }),
                  "]"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: log })
              ] }, i))
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white relative overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "iframe",
            {
              srcDoc: previewContent,
              className: "w-full h-full border-none",
              title: "sandbox-preview",
              sandbox: "allow-scripts"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 pointer-events-none opacity-10", children: /* @__PURE__ */ jsx(Code2, { size: 100, className: "text-black" }) })
        ] })
      ] })
    ] })
  ] });
};
const ProjectPreview = ({ project }) => {
  const targetRoute = project.is_for_sale ? route("project.show", { slug: project.slug }) : route("editor", { slug: project.slug });
  return /* @__PURE__ */ jsxs(Link, { href: targetRoute, className: "group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 block shadow-xl", children: [
    /* @__PURE__ */ jsx("div", { className: "aspect-video bg-white relative overflow-hidden", children: /* @__PURE__ */ jsx(ProjectPreviewContent, { project }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4 text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate", children: project.title }),
        /* @__PURE__ */ jsx("div", { className: "px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border)] text-[8px] font-black uppercase tracking-widest text-cyan-500", children: project.settings?.preprocessors?.js || "js" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 uppercase font-bold", children: [
          /* @__PURE__ */ jsx(User, { size: 10, className: "text-cyan-500/40" }),
          " ",
          project.user?.name || "Unknown"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 uppercase font-bold", children: [
          /* @__PURE__ */ jsx(Clock, { size: 10, className: "text-cyan-500/40" }),
          " ",
          new Date(project.created_at).toLocaleDateString()
        ] })
      ] }),
      project.is_for_sale && /* @__PURE__ */ jsxs("div", { className: "pt-4 mt-4 border-t border-[var(--border)] flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-lg font-black text-cyan-500 font-mono tracking-tighter", children: [
          "$",
          project.price
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 font-black text-[10px] uppercase tracking-widest rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-colors", children: [
          /* @__PURE__ */ jsx(Zap, { size: 12, className: "fill-current" }),
          " View Details"
        ] })
      ] })
    ] })
  ] });
};
function Welcome({ auth, siteSettings }) {
  const [featured, setFeatured] = useState([]);
  const [paidProjects, setPaidProjects] = useState([]);
  const [privateProjects, setPrivateProjects] = useState([]);
  const [globalStats, setGlobalStats] = useState({ projects: 0, users: 0, public_projects: 0 });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const toast = useToast();
  const { globalAds } = usePage().props;
  useEffect(() => {
    if (!window.Babel) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
      document.head.appendChild(script);
    }
    if (!window.Sass) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js";
      document.head.appendChild(script);
    }
    axios.get("/api/explore/featured").then((res) => setFeatured(res.data));
    axios.get("/api/explore/paid").then((res) => setPaidProjects(res.data));
    axios.get("/api/explore/private").then((res) => setPrivateProjects(res.data));
    axios.get("/api/explore/stats").then((res) => setGlobalStats(res.data));
  }, []);
  const getSetting = (key, defaultVal) => siteSettings?.[key] || defaultVal;
  const handleBuy = (project) => {
    if (!auth.user) {
      window.location.href = route("login");
      return;
    }
    window.location.href = route("checkout.project", { project: project.slug });
  };
  const handleUpgrade = async () => {
    if (!auth.user) {
      window.location.href = route("login");
      return;
    }
    if (auth.user.role === "paid-user" || auth.user.role === "admin") {
      try {
        const res = await axios.post("/api/subscription/portal");
        if (res.data.url) window.location.href = res.data.url;
      } catch (e) {
        toast.error("Failed to communicate with billing node.");
      }
    } else {
      setIsPaymentModalOpen(true);
    }
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: getSetting("seo_meta_title", "HOACodeLab // Technical Prototyping Node") }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: getSetting("seo_meta_description", "High-performance cloud editor for modern web developers.") }),
      /* @__PURE__ */ jsx("script", { src: "https://checkout.razorpay.com/v1/checkout.js" })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "pt-48 pb-32 px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-500/10 rounded-full mb-10", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 12, className: "text-cyan-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic", children: "v1.5.0 Stable Build" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-6xl md:text-9xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-[0.8] mb-12", children: [
          "Modern ",
          /* @__PURE__ */ jsx("br", {}),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[var(--text-muted)]", children: "Code Editor" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] text-sm md:text-lg max-w-2xl mx-auto font-bold uppercase tracking-[0.3em] leading-relaxed mb-20 opacity-80 italic", children: "High-performance development substrate for modern web creators." })
      ] }),
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2, duration: 1 }, children: /* @__PURE__ */ jsx(HomeEditor, {}) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 border-y border-[var(--border)] bg-[var(--bg-surface)]", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-left", children: [
      { l: "Active Users", v: globalStats.users, i: User },
      { l: "Projects Created", v: globalStats.projects, i: Database },
      { l: "Uptime", v: "99.9%", i: Shield },
      { l: "Performance", v: "0.04ms", i: Zap }
    ].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 border-l border-[var(--border)] pl-8 first:border-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(s.i, { size: 14, className: "text-cyan-500/40" }),
        " ",
        s.l
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-3xl font-black text-[var(--text-main)] tracking-tighter italic", children: s.v })
    ] }, i)) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-32 px-6 border-b border-[var(--border)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-end mb-16", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-cyan-500", children: [
          /* @__PURE__ */ jsx(Activity, { size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.3em]", children: "Live Feed" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: "Featured Projects" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: featured.length > 0 ? featured.slice(0, 3).map((project, idx) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsx(ProjectPreview, { project }),
        idx === 0 && globalAds?.in_feed && /* @__PURE__ */ jsx("div", { className: "md:col-span-3 my-8", children: globalAds.in_feed.map((ad) => /* @__PURE__ */ jsx(AdUnit, { ad }, ad.id)) })
      ] }, project.id)) : [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { className: "group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "aspect-video bg-[var(--bg-elevated)]" }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "h-4 w-2/3 bg-white/5 rounded animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-1/2 bg-white/5 rounded animate-pulse" })
        ] })
      ] }, i)) })
    ] }) }),
    paidProjects.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-32 px-6 border-b border-[var(--border)] bg-cyan-500/[0.02]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-end mb-16", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-cyan-500", children: [
          /* @__PURE__ */ jsx(Tag, { size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.3em]", children: "Marketplace" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: "Premium Modules" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: paidProjects.map((project) => /* @__PURE__ */ jsxs("div", { className: "group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-xl flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "aspect-video bg-white relative overflow-hidden", children: [
          /* @__PURE__ */ jsx(ProjectPreviewContent, { project }),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30", children: [
            "$",
            project.price
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4 text-left flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate", children: project.title }) }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 uppercase font-bold", children: [
            /* @__PURE__ */ jsx(User, { size: 10, className: "text-cyan-500/40" }),
            " ",
            project.user?.name || "Unknown"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "pt-4 mt-auto", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleBuy(project),
              className: "w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(ShoppingBag, { size: 14 }),
                " Buy Now"
              ]
            }
          ) })
        ] })
      ] }, project.id)) })
    ] }) }),
    privateProjects.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-32 px-6 border-b border-[var(--border)] bg-[var(--bg-main)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-end mb-16", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-rose-500", children: [
          /* @__PURE__ */ jsx(Lock, { size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.3em]", children: "Restricted" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: "Private Projects" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--text-muted)] mt-2", children: "Code view is restricted for these projects." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: privateProjects.map((project) => /* @__PURE__ */ jsxs(Link, { href: route("project.show", project.slug), className: "group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-rose-500/30 transition-all hover:-translate-y-1 shadow-xl flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "aspect-video bg-white relative overflow-hidden", children: [
          /* @__PURE__ */ jsx(ProjectPreviewContent, { project }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] z-20 pointer-events-none flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { className: "text-rose-500/50 w-16 h-16" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30", children: "Restricted" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4 text-left flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate", children: project.title }) }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 uppercase font-bold", children: [
            /* @__PURE__ */ jsx(User, { size: 10, className: "text-rose-500/40" }),
            " ",
            project.user?.name || "Unknown"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "pt-4 mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "w-full py-3 bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-rose-500 border border-[var(--border)] group-hover:border-rose-500/50 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(Eye, { size: 14 }),
            " View Restricted Project"
          ] }) })
        ] })
      ] }, project.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-24 px-6 border-y border-[var(--border)] bg-[#050505] overflow-hidden relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 backdrop-blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-12 md:gap-24 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 hover:text-cyan-500 transition-colors cursor-default", children: [
          /* @__PURE__ */ jsx(Layout, { size: 40 }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "HTML5" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 hover:text-blue-500 transition-colors cursor-default", children: [
          /* @__PURE__ */ jsx(AppWindow, { size: 40 }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "CSS3" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 hover:text-yellow-500 transition-colors cursor-default", children: [
          /* @__PURE__ */ jsx(Braces, { size: 40 }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "JavaScript" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 hover:text-pink-500 transition-colors cursor-default", children: [
          /* @__PURE__ */ jsx(Terminal, { size: 40 }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "Sass/SCSS" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-32 px-6 bg-[var(--bg-surface)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-20 space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: "How It Works" }),
        /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em]", children: "Build. Publish. Monetize." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [
        { step: "01", title: "Code", desc: "Use our lightning-fast browser editor to build UI components with HTML, CSS, and JS.", icon: Code2 },
        { step: "02", title: "Preview", desc: "Watch your code compile in real-time with our neural sandbox instance.", icon: Monitor },
        { step: "03", title: "Publish", desc: "Share your work publicly or restrict access for premium users only.", icon: Share2 },
        { step: "04", title: "Monetize", desc: "Set a price or lock your code behind ads to earn from your creations.", icon: ShoppingBag }
      ].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "relative group p-8 bg-[var(--bg-main)] border border-[var(--border)] rounded-3xl hover:border-cyan-500/30 transition-all hover:-translate-y-2 shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity", children: /* @__PURE__ */ jsx(s.icon, { size: 100, className: "text-cyan-500" }) }),
        /* @__PURE__ */ jsx("div", { className: "text-6xl font-black text-white/5 mb-6 italic tracking-tighter group-hover:text-cyan-500/10 transition-colors", children: s.step }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter mb-4 relative z-10", children: s.title }),
        /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] text-xs font-bold leading-relaxed relative z-10", children: s.desc })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "features", className: "py-48 px-6 bg-[var(--bg-main)] text-left", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16", children: [
      { t: "Cloud Based", d: "Every line of code executed securely in your neural browser instance.", i: Globe },
      { t: "Instant Sync", d: "Changes reflected instantly. Pixel-perfect rendering.", i: Zap },
      { t: "Secure Storage", d: "Encrypted storage for your modules.", i: Lock }
    ].map((p, i) => /* @__PURE__ */ jsxs("div", { className: "space-y-8 group", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-[var(--border)] group-hover:w-24 group-hover:bg-cyan-500 transition-all duration-500" }),
      /* @__PURE__ */ jsx("div", { className: "p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-fit", children: /* @__PURE__ */ jsx(p.i, { className: "text-cyan-500", size: 32 }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: p.t }),
      /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest leading-loose italic", children: p.d })
    ] }, i)) }) }),
    /* @__PURE__ */ jsx("section", { id: "pricing", className: "py-32 px-6 border-y border-[var(--border)] bg-[var(--bg-surface)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-20 space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: "Pricing Plans" }),
        /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em]", children: "Choose your plan" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-10 border border-[var(--border)] rounded-3xl bg-[var(--bg-main)] text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2", children: "Starter" }),
          /* @__PURE__ */ jsx("div", { className: "text-4xl font-black text-[var(--text-main)] italic mb-8", children: "Free" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-4 mb-10 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]", children: ["Unlimited Public Projects", "Basic Asset Library", "Community Support"].map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: "text-cyan-500" }),
            " ",
            item
          ] }, i)) }),
          /* @__PURE__ */ jsx(Link, { href: route("register"), className: "w-full py-4 flex items-center justify-center border border-[var(--border)] rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all", children: "Get Started" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-10 border border-cyan-500/30 rounded-3xl bg-[var(--bg-elevated)] text-left shadow-2xl relative", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "absolute top-6 right-6 text-cyan-500", size: 24 }),
          /* @__PURE__ */ jsx("div", { className: "text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-2", children: "Pro" }),
          /* @__PURE__ */ jsx("div", { className: "text-4xl font-black text-[var(--text-main)] italic mb-8", children: "Pro" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-4 mb-10 text-xs font-bold uppercase tracking-widest text-[var(--text-main)]", children: ["Private Projects", "Priority Rendering", "Collaboration Tools"].map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: "text-cyan-500" }),
            " ",
            item
          ] }, i)) }),
          /* @__PURE__ */ jsx("button", { onClick: handleUpgrade, className: "w-full py-4 bg-cyan-500 text-black font-black uppercase text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform", children: auth.user?.role === "paid-user" || auth.user?.role === "admin" ? "Manage Subscription" : "Upgrade Now" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-64 px-6 text-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-16", children: [
      /* @__PURE__ */ jsx(Rocket, { className: "text-cyan-500 mx-auto animate-bounce", size: 48 }),
      /* @__PURE__ */ jsx("h2", { className: "text-6xl md:text-9xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: "Start Coding Today" }),
      /* @__PURE__ */ jsx(Link, { href: route("register"), className: "px-16 py-6 bg-[var(--text-main)] text-[var(--bg-main)] font-black uppercase text-xs tracking-[0.5em] rounded hover:bg-cyan-500 hover:text-white transition-all shadow-2xl active:scale-95 inline-block italic", children: "Sign Up Free" })
    ] }) }),
    /* @__PURE__ */ jsx(
      PaymentModal,
      {
        isOpen: isPaymentModalOpen,
        onClose: () => setIsPaymentModalOpen(false),
        user: auth.user
      }
    )
  ] });
}
export {
  Welcome as default
};
