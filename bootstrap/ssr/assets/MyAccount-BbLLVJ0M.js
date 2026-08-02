import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout, U as UserLevelBadge } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Database, ShoppingBag, Briefcase, Fingerprint, Settings, Code2, Shield, BadgeCheck, DollarSign, CreditCard, Zap, ExternalLink, Search, Plus, Edit, Share2, Trash2, Key, Download, Lock, Bell, User } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import UpdatePasswordForm from "./UpdatePasswordForm-BdyY6w2r.js";
import UpdateProfileInformation from "./UpdateProfileInformationForm-CNo_7Ror.js";
import DeleteUserForm from "./DeleteUserForm-BTWD-efZ.js";
import IdentityVerificationForm from "./IdentityVerificationForm-H9PFSPP6.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
import "./InputError-BBff0LOp.js";
import "./InputLabel-CmSwOA3P.js";
import "./PrimaryButton-KUoqN0Ht.js";
import "./TextInput-DN069oHs.js";
import "./Modal-DoHBVxpV.js";
function MyAccount({ mustVerifyEmail, status, tokens: initialTokens = [] }) {
  const { auth } = usePage().props;
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [downloadState, setDownloadState] = useState({ active: false, percent: 0, loaded: 0, total: 0, title: "" });
  const [projectSearch, setProjectSearch] = useState("");
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [stripeId, setStripeId] = useState(auth.user.stripe_account_id || "");
  const [razorpayId, setRazorpayId] = useState(auth.user.razorpay_account_id || "");
  const [isUpdatingPayout, setIsUpdatingPayout] = useState(false);
  const handleUpdatePayout = async (type) => {
    setIsUpdatingPayout(true);
    try {
      const payload = type === "stripe" ? { stripe_account_id: stripeId } : { razorpay_account_id: razorpayId };
      await axios.post("/api/vendors/payout-accounts", payload);
      toast.success(`${type.toUpperCase()} account linked successfully!`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to link ${type} account.`);
    } finally {
      setIsUpdatingPayout(false);
    }
  };
  const [tokens, setTokens] = useState(initialTokens);
  const [newToken, setNewToken] = useState(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const handleGenerateToken = async () => {
    setIsGeneratingToken(true);
    try {
      const res = await axios.post(route("my-account.token.store"));
      setNewToken(res.data.token);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to generate token.");
      setIsGeneratingToken(false);
    }
  };
  const handleDeleteToken = async (id) => {
    if (!confirm("Are you sure you want to delete this token?")) return;
    try {
      await axios.delete(route("my-account.token.destroy", id));
      setTokens(tokens.filter((t) => t.id !== id));
      toast.success("Token deleted.");
    } catch (error) {
      toast.error("Failed to delete token.");
    }
  };
  const handleDownload = async (purchaseId, projectTitle) => {
    try {
      setDownloadState({ active: true, percent: 0, loaded: 0, total: 0, title: projectTitle });
      const res = await axios.get(`/api/purchases/${purchaseId}/download`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total;
          const loaded = progressEvent.loaded;
          const percent = total ? Math.round(loaded * 100 / total) : 0;
          setDownloadState({ active: true, percent, loaded, total, title: projectTitle });
        }
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const slug = projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      link.setAttribute("download", `${slug}-source.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => setDownloadState((prev) => ({ ...prev, active: false })), 2e3);
      toast.success("Download complete!");
    } catch (error) {
      console.error(error);
      setDownloadState((prev) => ({ ...prev, active: false }));
      toast.error("Download failed. The vendor may not have a valid GitHub connection.");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, purRes] = await Promise.all([
          axios.get("/api/projects"),
          axios.get("/api/purchases/my-purchases").catch(() => ({ data: [] }))
        ]);
        setProjects(projRes.data);
        setPurchases(purRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Connection failed. Could not sync user data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project successfully deleted.");
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard.");
  };
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-rose-500 border-rose-500/20 bg-rose-500/5";
      case "paid-user":
        return "text-amber-500 border-amber-500/20 bg-amber-500/5";
      default:
        return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    }
  };
  const sidebarTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "My Projects", icon: Database },
    { id: "purchases", label: "My Purchases", icon: ShoppingBag },
    ...auth.user.is_vendor ? [{ id: "vendor", label: "Vendors Settings", icon: Briefcase }] : [],
    { id: "profile", label: "Profile Details", icon: Fingerprint },
    { id: "settings", label: "App Settings", icon: Settings },
    { id: "api", label: "API & Tokens", icon: Code2 },
    { id: "security", label: "Security", icon: Shield }
  ];
  const filteredProjects = projects.filter((p) => p.title.toLowerCase().includes(projectSearch.toLowerCase()));
  const filteredPurchases = purchases.filter((p) => (p.project?.title || "").toLowerCase().includes(purchaseSearch.toLowerCase()));
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-2 bg-cyan-500/10 border border-cyan-500/20 rounded shadow-sm relative group cursor-pointer overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" }),
            /* @__PURE__ */ jsx(User, { className: "text-cyan-500 relative z-10", size: 20 })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-[var(--text-main)] uppercase italic leading-none tracking-tight", children: "My Account" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[8px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" }),
              "Online"
            ] })
          ] })
        ] }) }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Account Root" }),
          /* @__PURE__ */ jsx("div", { className: "relative flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1400px] mx-auto relative z-10 text-left flex flex-col lg:flex-row gap-8 lg:gap-12", children: [
            /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-72 shrink-0 space-y-3 flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 mb-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-cyan-500/50 transition-colors shadow-2xl", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-colors" }),
                /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-gradient-to-tr from-[var(--bg-main)] to-[var(--bg-surface)] border-2 border-cyan-500/30 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6 relative z-10", children: /* @__PURE__ */ jsx("span", { className: "text-3xl font-black text-cyan-500", children: auth.user.name.charAt(0) }) }),
                /* @__PURE__ */ jsxs("h3", { className: "text-base font-black uppercase tracking-widest text-[var(--text-main)] italic truncate w-full relative z-10 flex items-center justify-center gap-2", children: [
                  auth.user.name,
                  auth.user.identity_status === "verified" && /* @__PURE__ */ jsx(BadgeCheck, { className: "text-emerald-500 shrink-0", size: 16, title: "Verified Identity" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-mono truncate w-full mb-4 relative z-10", children: auth.user.email }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-2 w-full relative z-10", children: [
                  /* @__PURE__ */ jsx("span", { className: `px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md ${getRoleColor(auth.user.role)}`, children: auth.user.role }),
                  /* @__PURE__ */ jsx(UserLevelBadge, { level: auth.user.level || 1, size: "sm" })
                ] })
              ] }),
              sidebarTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setActiveTab(tab.id),
                    className: `flex items-center gap-4 w-full p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${isActive ? "text-black shadow-lg shadow-cyan-500/20 translate-x-2 border-transparent" : "bg-[var(--bg-surface)]/50 backdrop-blur-md border border-[var(--border)] text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/30"}`,
                    children: [
                      isActive && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500" }),
                      /* @__PURE__ */ jsx(Icon, { size: 18, className: "relative z-10" }),
                      /* @__PURE__ */ jsx("span", { className: "relative z-10", children: tab.label })
                    ]
                  },
                  tab.id
                );
              })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs(AnimatePresence, { mode: "wait", children: [
              activeTab === "overview" && /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                  transition: { duration: 0.3 },
                  className: "space-y-8",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6", children: [
                      { label: "Total Projects", val: projects.length, icon: Database, color: "text-cyan-500", bg: "bg-cyan-500/5" },
                      { label: "Purchases", val: purchases.length, icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-500/5" },
                      { label: "Premium Projects", val: projects.filter((p) => p.is_for_sale).length, icon: DollarSign, color: "text-rose-500", bg: "bg-rose-500/5" },
                      { label: "Total Spent", val: `$${purchases.reduce((acc, p) => acc + parseFloat(p.amount), 0).toFixed(2)}`, icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/5" }
                    ].map((s, i) => /* @__PURE__ */ jsxs("div", { className: `bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] p-6 rounded-3xl hover:border-${s.color.split("-")[1]}-500/30 transition-all duration-300 shadow-xl text-left group overflow-hidden relative`, children: [
                      /* @__PURE__ */ jsx("div", { className: `absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${s.bg}` }),
                      /* @__PURE__ */ jsx(s.icon, { className: `${s.color} mb-6 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10`, size: 28 }),
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 relative z-10", children: s.label }),
                      /* @__PURE__ */ jsx("div", { className: "text-3xl font-black text-[var(--text-main)] tracking-tighter italic relative z-10", children: s.val })
                    ] }, i)) }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-8", children: [
                      /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl rounded-3xl border border-[var(--border)] p-8 space-y-6 shadow-2xl", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-[var(--border)] pb-4", children: [
                          /* @__PURE__ */ jsx(Zap, { className: "text-amber-500", size: 20 }),
                          /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase text-[var(--text-main)] italic tracking-widest", children: "Recent Projects" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                          projects.slice(0, 4).map((p, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] hover:border-cyan-500/30 transition-colors group", children: [
                            /* @__PURE__ */ jsxs("div", { className: "min-w-0 pr-4", children: [
                              /* @__PURE__ */ jsx("span", { className: "text-sm font-black truncate block text-[var(--text-main)] italic", children: p.title }),
                              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[var(--text-muted)] font-mono uppercase", children: new Date(p.created_at).toLocaleDateString() })
                            ] }),
                            /* @__PURE__ */ jsx(Link, { href: route("editor", p.slug), className: "w-10 h-10 flex items-center justify-center bg-[var(--bg-surface)] rounded-xl text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors shrink-0", children: /* @__PURE__ */ jsx(ExternalLink, { size: 16 }) })
                          ] }, i)),
                          projects.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--text-muted)] block p-4 text-center", children: "No projects found." })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl rounded-3xl border border-[var(--border)] p-8 space-y-6 shadow-2xl", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-[var(--border)] pb-4", children: [
                          /* @__PURE__ */ jsx(CreditCard, { className: "text-emerald-500", size: 20 }),
                          /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase text-[var(--text-main)] italic tracking-widest", children: "Recent Purchases" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                          purchases.slice(0, 4).map((p, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] hover:border-emerald-500/30 transition-colors group", children: [
                            /* @__PURE__ */ jsxs("div", { className: "min-w-0 pr-4", children: [
                              /* @__PURE__ */ jsx("span", { className: "text-sm font-black truncate block text-[var(--text-main)] italic", children: p.project?.title || "Unknown Project" }),
                              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[var(--text-muted)] font-mono uppercase", children: [
                                "$",
                                p.amount,
                                " • ",
                                p.payment_method
                              ] })
                            ] }),
                            /* @__PURE__ */ jsx(Link, { href: route("editor", p.project?.slug), className: "w-10 h-10 flex items-center justify-center bg-[var(--bg-surface)] rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors shrink-0", children: /* @__PURE__ */ jsx(ExternalLink, { size: 16 }) })
                          ] }, i)),
                          purchases.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--text-muted)] block p-4 text-center", children: "No purchases found." })
                        ] })
                      ] })
                    ] })
                  ]
                },
                "overview"
              ),
              activeTab === "projects" && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                  transition: { duration: 0.3 },
                  className: "space-y-6",
                  children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 shadow-2xl", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-[var(--border)] pb-8", children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-xl font-black uppercase tracking-widest italic text-[var(--text-main)]", children: "All Projects" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 w-full md:w-auto", children: [
                        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
                          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 16 }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              placeholder: "Search projects...",
                              value: projectSearch,
                              onChange: (e) => setProjectSearch(e.target.value),
                              className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:uppercase placeholder:tracking-widest"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs(Link, { href: route("editor"), className: "btn-primary text-xs py-3 px-6 rounded-xl flex items-center gap-2 whitespace-nowrap", children: [
                          /* @__PURE__ */ jsx(Plus, { size: 16 }),
                          " Create"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                      filteredProjects.map((project) => /* @__PURE__ */ jsxs("div", { className: "group bg-[var(--bg-main)] border border-[var(--border)] p-6 flex flex-col justify-between gap-6 rounded-2xl hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-cyan-500/10", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 shrink-0 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all", children: /* @__PURE__ */ jsx(Code2, { size: 24 }) }),
                          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsx("h4", { className: "text-base font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate", children: project.title }),
                            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [
                              /* @__PURE__ */ jsx("span", { className: `px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${project.is_public ? "text-cyan-500 border-cyan-500/30 bg-cyan-500/10" : "text-rose-500 border-rose-500/30 bg-rose-500/10"}`, children: project.is_public ? "Public" : "Private" }),
                              project.is_for_sale && /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-500 border border-amber-500/30 bg-amber-500/10 rounded-lg", children: [
                                "Market ($",
                                project.price,
                                ")"
                              ] })
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-4 border-t border-[var(--border)]", children: [
                          /* @__PURE__ */ jsxs(Link, { href: route("editor", project.slug), className: "flex-1 flex justify-center items-center gap-2 py-2.5 bg-cyan-500/10 text-cyan-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all", children: [
                            /* @__PURE__ */ jsx(Edit, { size: 14 }),
                            " Open Editor"
                          ] }),
                          project.is_public && /* @__PURE__ */ jsx("button", { onClick: () => copyToClipboard(route("project.show", project.slug)), className: "px-4 py-2.5 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border)] rounded-xl hover:border-blue-500/50 hover:text-blue-500 transition-all", title: "Copy Public Link", children: /* @__PURE__ */ jsx(Share2, { size: 14 }) }),
                          /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(project.id), className: "px-4 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
                        ] })
                      ] }, project.id)),
                      filteredProjects.length === 0 && /* @__PURE__ */ jsxs("div", { className: "col-span-full text-center p-12 border-2 border-dashed border-[var(--border)] rounded-3xl text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-4", children: [
                        /* @__PURE__ */ jsx(Database, { size: 32, className: "opacity-20" }),
                        "No matching projects found."
                      ] })
                    ] })
                  ] })
                },
                "projects"
              ),
              activeTab === "purchases" && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                  transition: { duration: 0.3 },
                  className: "space-y-6",
                  children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl", children: [
                    /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-[var(--border)] flex flex-col md:flex-row justify-between md:items-center gap-6", children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-xl font-black uppercase tracking-widest italic text-[var(--text-main)]", children: "Payment History" }),
                      /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-64", children: [
                        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 16 }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Search transactions...",
                            value: purchaseSearch,
                            onChange: (e) => setPurchaseSearch(e.target.value),
                            className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:uppercase placeholder:tracking-widest"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse min-w-[800px]", children: [
                      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[var(--border)] bg-black/40", children: [
                        /* @__PURE__ */ jsx("th", { className: "px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Project Name" }),
                        /* @__PURE__ */ jsx("th", { className: "px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Amount" }),
                        /* @__PURE__ */ jsx("th", { className: "px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Payment Method" }),
                        /* @__PURE__ */ jsx("th", { className: "px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Date" }),
                        /* @__PURE__ */ jsx("th", { className: "px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right", children: "Action" })
                      ] }) }),
                      /* @__PURE__ */ jsxs("tbody", { children: [
                        filteredPurchases.map((p) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-[var(--border)] last:border-0 hover:bg-emerald-500/5 transition-colors group", children: [
                          /* @__PURE__ */ jsxs("td", { className: "px-8 py-6", children: [
                            /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-[var(--text-main)] italic uppercase", children: p.project?.title || "Unknown Project" }),
                            /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-[var(--text-muted)] font-mono mt-1", children: [
                              "ID: ",
                              p.id
                            ] }),
                            p.license_key && /* @__PURE__ */ jsxs("div", { className: "mt-2 inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-500 text-[10px] font-mono cursor-pointer hover:bg-cyan-500 hover:text-black transition-colors", onClick: () => copyToClipboard(p.license_key), children: [
                              /* @__PURE__ */ jsx(Key, { size: 10 }),
                              " ",
                              p.license_key
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("td", { className: "px-8 py-6 font-mono text-emerald-500 font-bold text-lg", children: new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency || "USD" }).format(p.amount) }),
                          /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsx("span", { className: "px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] group-hover:border-emerald-500/30 transition-colors", children: p.payment_method }) }),
                          /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-xs text-[var(--text-muted)] font-mono", children: new Date(p.created_at).toLocaleString() }),
                          /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-right", children: p.project ? /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                            /* @__PURE__ */ jsxs(Link, { href: route("editor", p.project.slug), className: "inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all shadow-lg shadow-cyan-500/10", children: [
                              /* @__PURE__ */ jsx(ExternalLink, { size: 14 }),
                              " Open"
                            ] }),
                            /* @__PURE__ */ jsxs("a", { href: `/api/purchases/${p.id}/invoice`, target: "_blank", className: "inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-purple-500/10", children: [
                              /* @__PURE__ */ jsx(ExternalLink, { size: 14 }),
                              " Invoice"
                            ] }),
                            /* @__PURE__ */ jsxs("button", { onClick: () => handleDownload(p.id, p.project.title), className: "inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all shadow-lg shadow-emerald-500/10", children: [
                              /* @__PURE__ */ jsx(Download, { size: 14 }),
                              " Download Zip"
                            ] })
                          ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-4 py-2 text-[10px] text-rose-500 uppercase font-bold tracking-widest bg-rose-500/10 rounded-xl", children: [
                            /* @__PURE__ */ jsx(Lock, { size: 12 }),
                            " Offline"
                          ] }) })
                        ] }, p.id)),
                        filteredPurchases.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "p-16 text-center text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
                          /* @__PURE__ */ jsx(ShoppingBag, { size: 32, className: "opacity-20" }),
                          "No purchases found."
                        ] }) }) })
                      ] })
                    ] }) })
                  ] })
                },
                "purchases"
              ),
              activeTab === "vendor" && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                  transition: { duration: 0.3 },
                  className: "space-y-8",
                  children: /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                      /* @__PURE__ */ jsx(Briefcase, { size: 24, className: "text-cyan-500" }),
                      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)]", children: "Vendors Settings" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10", children: "Manage your connected payout accounts." }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                      /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-6 flex flex-col gap-3", children: [
                        /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase text-[var(--text-main)]", children: "Stripe Connect" }),
                        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest", children: "Connect your Stripe account to receive 70% automatic splits." }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "e.g. acct_1N...",
                            value: stripeId,
                            onChange: (e) => setStripeId(e.target.value),
                            className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-3 text-xs font-mono text-[var(--text-main)] focus:border-cyan-500/50 focus:outline-none focus:ring-0"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => handleUpdatePayout("stripe"),
                            disabled: isUpdatingPayout || !stripeId.startsWith("acct_"),
                            className: "btn-primary py-2 px-4 text-[10px] font-bold uppercase tracking-widest self-start disabled:opacity-50",
                            children: "Save Stripe ID"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-6 flex flex-col gap-3", children: [
                        /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase text-[var(--text-main)]", children: "Razorpay Route" }),
                        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest", children: "Connect your Razorpay account to receive 70% automatic splits." }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "e.g. acc_1M...",
                            value: razorpayId,
                            onChange: (e) => setRazorpayId(e.target.value),
                            className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-3 text-xs font-mono text-[var(--text-main)] focus:border-cyan-500/50 focus:outline-none focus:ring-0"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => handleUpdatePayout("razorpay"),
                            disabled: isUpdatingPayout || !razorpayId.startsWith("acc_"),
                            className: "btn-primary py-2 px-4 text-[10px] font-bold uppercase tracking-widest self-start disabled:opacity-50",
                            children: "Save Razorpay ID"
                          }
                        )
                      ] })
                    ] })
                  ] }) })
                },
                "vendor"
              ),
              activeTab === "profile" && /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                  transition: { duration: 0.3 },
                  className: "space-y-8",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)] mb-2", children: "Profile Details" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10", children: "Update your profile information and email address." }),
                      /* @__PURE__ */ jsx(
                        UpdateProfileInformation,
                        {
                          mustVerifyEmail,
                          status,
                          className: "w-full"
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl", children: /* @__PURE__ */ jsx("div", { className: "max-w-xl", children: /* @__PURE__ */ jsx(IdentityVerificationForm, { className: "w-full" }) }) })
                  ]
                },
                "profile"
              ),
              activeTab === "settings" && /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                  transition: { duration: 0.3 },
                  className: "space-y-8",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                        /* @__PURE__ */ jsx(Settings, { size: 24, className: "text-purple-500" }),
                        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)]", children: "App Preferences" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10", children: "Customize your application experience." }),
                      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-6 flex justify-between items-center", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase text-[var(--text-main)]", children: "Dark Mode" }),
                          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest", children: "Toggle the application theme." })
                        ] }),
                        /* @__PURE__ */ jsx("button", { className: "px-4 py-2 bg-purple-500/10 text-purple-500 rounded font-black uppercase tracking-widest text-[10px] border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all", children: "Toggle Theme" })
                      ] }) })
                    ] }) }),
                    /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                        /* @__PURE__ */ jsx(Bell, { size: 24, className: "text-blue-500" }),
                        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)]", children: "Notifications" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10", children: "Manage your email and push notifications." }),
                      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [
                        { id: "notif_sales", label: "New Sales Alerts", desc: "Get notified when someone purchases your product." },
                        { id: "notif_updates", label: "Product Updates", desc: "Receive emails when a product you purchased is updated." },
                        { id: "notif_marketing", label: "Marketing Emails", desc: "Receive newsletters and promotional offers." }
                      ].map((notif, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-6 flex justify-between items-center", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase text-[var(--text-main)]", children: notif.label }),
                          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest", children: notif.desc })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "w-10 h-6 bg-blue-500/20 rounded-full relative cursor-pointer border border-blue-500/50", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-blue-500 rounded-full absolute top-1 left-1 shadow-sm" }) })
                      ] }, idx)) })
                    ] }) })
                  ]
                },
                "settings"
              ),
              activeTab === "api" && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                  transition: { duration: 0.3 },
                  className: "space-y-8",
                  children: /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                      /* @__PURE__ */ jsx(Code2, { size: 24, className: "text-pink-500" }),
                      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)]", children: "API & Personal Tokens" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10", children: "Generate tokens to interact with the HOACodeLab API natively." }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-8 text-center border-dashed mb-6", children: [
                      /* @__PURE__ */ jsx(Code2, { size: 32, className: "mx-auto mb-4 text-[var(--text-muted)] opacity-50" }),
                      /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase text-[var(--text-main)] mb-2", children: "Manage Tokens" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-6", children: "Generate a new API token below." }),
                      /* @__PURE__ */ jsx("button", { onClick: handleGenerateToken, disabled: isGeneratingToken, className: "px-6 py-3 bg-pink-500/10 text-pink-500 rounded-xl font-black uppercase tracking-widest text-xs border border-pink-500/20 hover:bg-pink-500 hover:text-white transition-all shadow-lg shadow-pink-500/10 disabled:opacity-50", children: isGeneratingToken ? "Generating..." : "Generate New Token" })
                    ] }),
                    newToken && /* @__PURE__ */ jsxs("div", { className: "bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl mb-6 flex flex-col gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase text-emerald-500", children: "Token Generated Successfully" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest", children: "Please copy this token now. You will not be able to see it again." }),
                      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2", children: [
                        /* @__PURE__ */ jsx("input", { type: "text", readOnly: true, value: newToken, className: "flex-1 bg-[var(--bg-surface)] border border-emerald-500/30 rounded-lg p-3 text-xs font-mono text-[var(--text-main)]" }),
                        /* @__PURE__ */ jsx("button", { onClick: () => copyToClipboard(newToken), className: "px-4 bg-emerald-500 text-black font-black rounded-lg uppercase text-[10px] tracking-widest hover:bg-emerald-400", children: "Copy" })
                      ] })
                    ] }),
                    tokens.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-sm font-black uppercase text-[var(--text-main)] border-b border-[var(--border)] pb-2", children: "Active Tokens" }),
                      tokens.map((t) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)]", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("div", { className: "text-sm font-black text-[var(--text-main)] italic", children: t.name }),
                          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-[var(--text-muted)] font-mono mt-1", children: [
                            "Last Used: ",
                            t.last_used_at ? new Date(t.last_used_at).toLocaleDateString() : "Never"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteToken(t.id), className: "w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(Trash2, { size: 16 }) })
                      ] }, t.id))
                    ] })
                  ] }) })
                },
                "api"
              ),
              activeTab === "security" && /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
                  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: -10, filter: "blur(10px)" },
                  transition: { duration: 0.3 },
                  className: "space-y-8",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 lg:p-12 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                        /* @__PURE__ */ jsx(Key, { size: 24, className: "text-amber-500" }),
                        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter text-[var(--text-main)]", children: "Change Password" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10", children: "Ensure your account uses a long, random password to stay secure." }),
                      /* @__PURE__ */ jsx(UpdatePasswordForm, { className: "w-full" })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-rose-500/5 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" }),
                      /* @__PURE__ */ jsxs("div", { className: "max-w-xl relative z-10", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                          /* @__PURE__ */ jsx(Shield, { size: 24, className: "text-rose-500" }),
                          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black uppercase italic tracking-tighter text-rose-500", children: "Delete Account" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-rose-500/70 uppercase tracking-widest mb-10", children: "Permanently delete your account and all data." }),
                        /* @__PURE__ */ jsx(DeleteUserForm, { className: "w-full" })
                      ] })
                    ] })
                  ]
                },
                "security"
              )
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsx(AnimatePresence, { children: downloadState.active && /* @__PURE__ */ jsxs(
            motion.div,
            {
              drag: true,
              dragMomentum: false,
              initial: { opacity: 0, y: 50, scale: 0.9 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, scale: 0.9, y: 50 },
              className: "fixed bottom-8 right-8 z-[100] w-72 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing",
              style: { touchAction: "none" },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-[var(--border)] flex items-center justify-between pointer-events-none", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Download, { size: 14, className: "text-cyan-500" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-[var(--text-main)] uppercase tracking-widest", children: "Downloading..." })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-cyan-500", children: [
                    downloadState.percent,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4 pointer-events-none", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-[var(--text-muted)] truncate", children: downloadState.title }),
                  /* @__PURE__ */ jsx("div", { className: "w-full bg-[var(--bg-main)] rounded-full h-1.5 overflow-hidden", children: /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      className: "h-full bg-cyan-500",
                      initial: { width: 0 },
                      animate: { width: `${downloadState.percent}%` },
                      transition: { duration: 0.2 }
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      (downloadState.loaded / 1024 / 1024).toFixed(2),
                      " MB"
                    ] }),
                    /* @__PURE__ */ jsx("span", { children: downloadState.total ? (downloadState.total / 1024 / 1024).toFixed(2) + " MB" : "..." })
                  ] })
                ] })
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
export {
  MyAccount as default
};
