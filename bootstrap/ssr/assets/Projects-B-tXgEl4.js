import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Database, Plus, ArrowUpRight, Settings, Trash2, Store, Search, X, ShoppingBag, Activity, Save } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function ProjectThumbnail({ project }) {
  const [fullProject, setFullProject] = useState(null);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/projects/${project.slug}`);
        setFullProject(res.data);
      } catch (e) {
      }
    };
    fetchDetails();
  }, [project.slug]);
  const srcDoc = useMemo(() => {
    if (!fullProject) return "";
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    html, body { background: #1d1e22; margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                    ${fullProject.code?.css || ""}
                </style>
            </head>
            <body>${fullProject.code?.html || ""}</body>
            </html>
        `;
  }, [fullProject]);
  if (project.settings?.thumbnail_url) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full relative overflow-hidden", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: project.settings.thumbnail_url,
        alt: project.title,
        className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
      }
    ) });
  }
  return /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-[#1d1e22] relative overflow-hidden", children: fullProject ? /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-[2s]", children: /* @__PURE__ */ jsx("iframe", { srcDoc, title: "t", className: "border-none pointer-events-none absolute", style: { width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "0 0" }, sandbox: "allow-scripts" }) }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-white/5", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" }) }) });
}
function ProjectSettingsModal({ project, teams, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: project.title || "",
    is_public: project.is_public ? 1 : 0,
    category: project.category || "",
    tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
    meta_title: project.meta_title || "",
    meta_description: project.meta_description || "",
    meta_keywords: project.meta_keywords || "",
    team_id: project.team_id || "",
    is_for_sale: project.is_for_sale ? 1 : 0,
    price: project.price || 0,
    github_repo_url: project.github_repo_url || "",
    support_duration: project.support_duration || "6_months"
  });
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await axios.put(`/api/projects/${project.id}`, {
        ...formData,
        tags: tagsArray,
        is_public: !!Number(formData.is_public),
        is_for_sale: !!Number(formData.is_for_sale)
      });
      onUpdate(res.data);
      toast.success("Project updated successfully.");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project.");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col max-h-[90vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-[var(--border)] flex justify-between items-center bg-gradient-to-r from-[var(--bg-elevated)] to-purple-500/5", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-black text-[var(--text-main)] uppercase tracking-widest italic flex items-center", children: [
        /* @__PURE__ */ jsx(Settings, { className: "mr-3 text-purple-500", size: 16 }),
        " Manage Product"
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-[var(--text-muted)] hover:text-[var(--text-main)]", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-8 space-y-6 overflow-y-auto custom-scrollbar text-left", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Product Title" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[12px] font-black", required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-elevated)] p-4 rounded border border-[var(--border)] flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest mb-1", children: "Access Protocol" }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold", children: formData.is_public ? "Global Network" : "Secure local" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex bg-[var(--bg-main)] rounded p-1 border border-[var(--border)]", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, is_public: 1 }), className: `px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${formData.is_public ? "bg-purple-500 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`, children: "Public" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, is_public: 0 }), className: `px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!formData.is_public ? "bg-rose-500 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`, children: "Private" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] border-b border-[var(--border)] pb-2", children: "Categorization" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Category" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Assign to Unit (Team)" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: formData.team_id,
                onChange: (e) => setFormData({ ...formData, team_id: e.target.value }),
                className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest appearance-none",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Personal Memory (No Team)" }),
                  teams.map((team) => /* @__PURE__ */ jsx("option", { value: team.id, children: team.name }, team.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Tags" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: formData.tags, onChange: (e) => setFormData({ ...formData, tags: e.target.value }), className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[10px] font-bold" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Meta Description" }),
            /* @__PURE__ */ jsx("textarea", { rows: "2", value: formData.meta_description, onChange: (e) => setFormData({ ...formData, meta_description: e.target.value }), className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-purple-500/50 focus:ring-0 text-[12px]" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] border-b border-[var(--border)] pb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ShoppingBag, { size: 14 }),
          " Marketplace Listing"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-elevated)] p-4 rounded border border-[var(--border)] flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest mb-1", children: "Sell Product" }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold", children: "List this on the Premium Marketplace" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex bg-[var(--bg-main)] rounded p-1 border border-[var(--border)]", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, is_for_sale: 1 }), className: `px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${formData.is_for_sale ? "bg-emerald-500 text-black shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`, children: "Yes" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData({ ...formData, is_for_sale: 0 }), className: `px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!formData.is_for_sale ? "bg-[var(--bg-surface)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`, children: "No" })
          ] })
        ] }),
        formData.is_for_sale ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Price (USD)" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold", children: "$" }),
              /* @__PURE__ */ jsx("input", { type: "number", min: "0", step: "0.01", value: formData.price, onChange: (e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 }), className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded pl-8 pr-3 py-3 text-[var(--text-main)] focus:border-emerald-500/50 focus:ring-0 text-[12px] font-black" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "GitHub Private Repo URL" }),
            /* @__PURE__ */ jsx("input", { type: "url", placeholder: "https://github.com/vendor/repo", value: formData.github_repo_url, onChange: (e) => setFormData({ ...formData, github_repo_url: e.target.value }), className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-emerald-500/50 focus:ring-0 text-[10px] font-bold" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "Support & Updates Duration" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: formData.support_duration,
                onChange: (e) => setFormData({ ...formData, support_duration: e.target.value }),
                className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-emerald-500/50 focus:ring-0 text-[10px] font-bold uppercase tracking-widest appearance-none",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "6_months", children: "6 Months (Industry Standard)" }),
                  /* @__PURE__ */ jsx("option", { value: "lifetime", children: "Lifetime Updates" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2 md:col-span-2", children: /* @__PURE__ */ jsx("p", { className: "text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest italic", children: "Note: Buyers will automatically receive an RSA signed license key and a direct download of your GitHub repo zipball upon successful payment." }) })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end sticky bottom-0 bg-[var(--bg-surface)] py-4 border-t border-[var(--border)]", children: /* @__PURE__ */ jsxs("button", { type: "submit", disabled: isSaving, className: "btn-primary bg-purple-500 hover:bg-purple-600 text-white w-full md:w-auto shadow-lg shadow-purple-500/20", children: [
        isSaving ? /* @__PURE__ */ jsx(Activity, { className: "animate-spin mr-2 inline", size: 14 }) : /* @__PURE__ */ jsx(Save, { className: "mr-2 inline", size: 14 }),
        " Save_Changes"
      ] }) })
    ] })
  ] }) });
}
function VendorsProjects() {
  const { auth } = usePage().props;
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");
  const [editingProject, setEditingProject] = useState(null);
  const toast = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, teamsRes] = await Promise.all([
          axios.get("/api/projects"),
          axios.get("/api/teams-list")
        ]);
        const gitProjects = projRes.data.filter((p) => !!p.github_repo_url);
        setProjects(gitProjects);
        setTeams(teamsRes.data);
      } catch (e) {
        console.error("Failed to fetch products.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Product deleted successfully.");
    } catch (e) {
      toast.error("Failed to delete product.");
    }
  };
  const handleSync = async (slug) => {
    try {
      toast.success("Initiating GitHub Sync...");
      const res = await axios.post(`/api/projects/${slug}/sync-github`);
      toast.success(res.data.message || "Sync successful!");
      setProjects(projects.map((p) => p.slug === slug ? { ...p, version: res.data.version } : p));
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to sync from GitHub.");
    }
  };
  const categories = useMemo(() => ["ALL", ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
  const filteredProjects = projects.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) && (activeCategory === "ALL" || p.category === activeCategory)
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-purple-500/30 relative transition-colors duration-300 text-left", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20", children: /* @__PURE__ */ jsx(Store, { className: "text-white", size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-[var(--text-main)] tracking-tight leading-none", children: "Vendors / All Projects" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-purple-500 font-bold uppercase tracking-widest mt-1", children: "Manage all products and modules" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-64", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 14 }),
              /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search products...", value: search, onChange: (e) => setSearch(e.target.value), className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-purple-500/50 w-full" })
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("vendors.sell"), className: "px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all whitespace-nowrap border border-white/10", children: [
              /* @__PURE__ */ jsx(Plus, { className: "mr-2 inline", size: 14 }),
              " New_Product"
            ] })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Vendor Projects" }),
          /* @__PURE__ */ jsx("div", { className: "relative min-h-screen p-6 md:p-12 overflow-y-auto pb-32", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto relative z-10 space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-2xl shadow-xl shadow-purple-500/5", children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 w-full md:w-auto", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: categories.map((cat) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveCategory(cat), className: `px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? "bg-purple-500 text-white border-purple-500" : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-main)]"}`, children: cat }, cat)) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border)]", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setViewMode("grid"), className: `p-2 rounded-md ${viewMode === "grid" ? "bg-[var(--bg-main)] text-purple-500 shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`, children: /* @__PURE__ */ jsx(LayoutGrid, { size: 16 }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => setViewMode("list"), className: `p-2 rounded-md ${viewMode === "list" ? "bg-[var(--bg-main)] text-purple-500 shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`, children: /* @__PURE__ */ jsx(List, { size: 16 }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "py-32 flex flex-col items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-purple-500 uppercase tracking-widest", children: "Loading Catalog..." })
            ] }) : filteredProjects.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-32 flex flex-col items-center justify-center border border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg-surface)]/50", children: [
              /* @__PURE__ */ jsx(Database, { className: "text-[var(--text-muted)] mb-4", size: 48, strokeWidth: 1 }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-[var(--text-main)] mb-2", children: "No Projects Found" }),
              /* @__PURE__ */ jsx("p", { className: "text-[var(--text-muted)] mb-6 text-sm", children: "Create your first product to start monetizing on the marketplace." }),
              /* @__PURE__ */ jsxs(Link, { href: route("vendors.sell"), className: "btn-primary bg-purple-500 text-white hover:bg-purple-600", children: [
                /* @__PURE__ */ jsx(Plus, { className: "mr-2 inline", size: 14 }),
                " List New Product"
              ] })
            ] }) : viewMode === "grid" ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredProjects.map((project, idx) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: idx * 0.05 }, className: "group bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all shadow-xl shadow-purple-500/5 text-left flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "aspect-video bg-black relative border-b border-[var(--border)] overflow-hidden", children: [
                /* @__PURE__ */ jsx(ProjectThumbnail, { project }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 flex flex-wrap gap-2 z-20", children: project.category && /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-bold uppercase text-white tracking-widest", children: project.category }) }),
                /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 flex gap-2 z-20", children: [
                  project.is_for_sale && /* @__PURE__ */ jsx("span", { className: "px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-black border-emerald-400", children: "Marketplace" }),
                  /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded-lg border text-[8px] font-bold uppercase tracking-widest ${project.is_public ? "bg-purple-500/20 border-purple-500/30 text-purple-400 backdrop-blur-md" : "bg-rose-500/20 border-rose-500/30 text-rose-400 backdrop-blur-md"}`, children: project.is_public ? "Global" : "Secure" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] tracking-tight group-hover:text-purple-500 transition-colors mb-2 line-clamp-1", children: project.title }),
                project.is_for_sale && /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-emerald-400 mb-4", children: [
                  "$",
                  parseFloat(project.price).toFixed(2)
                ] }),
                !project.is_for_sale && /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-[var(--text-muted)] mb-4 italic", children: "Not For Sale" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-4 flex gap-2 border-t border-[var(--border)]", children: [
                  /* @__PURE__ */ jsxs("a", { href: route("project.show", { slug: project.slug }), target: "_blank", className: "flex-1 px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-purple-500/50 hover:bg-purple-500/10 text-center rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-[var(--text-main)] flex items-center justify-center", children: [
                    "View ",
                    /* @__PURE__ */ jsx(ArrowUpRight, { className: "ml-1", size: 12 })
                  ] }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleSync(project.slug), title: "Pull latest from GitHub", className: "p-2.5 bg-[var(--bg-elevated)] text-[var(--text-main)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg border border-[var(--border)] transition-all", children: /* @__PURE__ */ jsx(Database, { size: 16 }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingProject(project), className: "p-2.5 bg-[var(--bg-elevated)] text-[var(--text-main)] hover:text-purple-500 hover:bg-purple-500/10 rounded-lg border border-[var(--border)] transition-all", children: /* @__PURE__ */ jsx(Settings, { size: 16 }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(project.id), className: "p-2.5 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/10 transition-all", children: /* @__PURE__ */ jsx(Trash2, { size: 16 }) })
                ] })
              ] })
            ] }, project.id)) }) : /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/5", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-[var(--bg-elevated)] text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] border-b border-[var(--border)]", children: [
                /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Product Name" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Category" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Price" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-5 text-right", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[var(--border)]", children: filteredProjects.map((project) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-[var(--bg-elevated)]/50 transition-colors group", children: [
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-sm text-[var(--text-main)]", children: project.title }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest", children: project.category || "General" }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${project.is_for_sale ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`, children: project.is_for_sale ? "For Sale" : "Private" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-emerald-400", children: project.is_for_sale ? `$${parseFloat(project.price).toFixed(2)}` : "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity", children: [
                  /* @__PURE__ */ jsx("a", { href: route("project.show", { slug: project.slug }), target: "_blank", className: "p-2 text-[var(--text-muted)] hover:text-purple-500 hover:bg-purple-500/10 rounded transition-all", children: /* @__PURE__ */ jsx(ArrowUpRight, { size: 16 }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleSync(project.slug), title: "Pull latest from GitHub", className: "p-2 text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded transition-all", children: /* @__PURE__ */ jsx(Database, { size: 16 }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingProject(project), className: "p-2 text-[var(--text-muted)] hover:text-purple-500 hover:bg-purple-500/10 rounded transition-all", children: /* @__PURE__ */ jsx(Settings, { size: 16 }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(project.id), className: "p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded transition-all", children: /* @__PURE__ */ jsx(Trash2, { size: 16 }) })
                ] }) })
              ] }, project.id)) })
            ] }) }) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: editingProject && /* @__PURE__ */ jsx(
      ProjectSettingsModal,
      {
        project: editingProject,
        teams,
        onClose: () => setEditingProject(null),
        onUpdate: (upd) => setProjects(projects.map((p) => p.id === upd.id ? upd : p))
      }
    ) })
  ] });
}
export {
  VendorsProjects as default
};
