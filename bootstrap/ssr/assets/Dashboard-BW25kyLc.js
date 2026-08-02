import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Database, Globe, ShieldCheck, Zap, Terminal, Code2, Clock, Briefcase, ExternalLink, Trash2, ArrowRight, UserCheck, Activity, Plus } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function Dashboard() {
  const { auth } = usePage().props;
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);
  const handleDelete = async (id) => {
    if (!confirm("Destroy this neural module?")) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
    }
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
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 border border-cyan-500/20 rounded shadow-sm", children: /* @__PURE__ */ jsx(Activity, { className: "text-cyan-500", size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-[var(--text-main)] uppercase italic leading-none", children: "Dashboard" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-cyan-500 font-bold uppercase tracking-[0.4em] mt-1", children: "System Active" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full md:w-auto justify-between md:justify-end", children: [
            /* @__PURE__ */ jsxs("div", { className: `px-3 py-1 rounded border text-[9px] font-bold uppercase tracking-widest ${getRoleColor(auth.user.role)}`, children: [
              auth.user.role,
              "_ACCESS"
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("editor"), className: "btn-primary flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Plus, { size: 14, strokeWidth: 3 }),
              " New Project"
            ] })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
          /* @__PURE__ */ jsx("div", { className: "relative flex-1 p-6 md:p-12 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-12 relative z-10 text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 border-l-2 border-[var(--border)] pl-8", children: [
              /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-6xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-none", children: [
                "Welcome, ",
                /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: auth.user.name.split(" ")[0] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-[var(--text-muted)] text-xs uppercase tracking-widest font-bold", children: [
                "System Operational. Monitoring ",
                projects.length,
                " Active Projects."
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: [
              { label: "Total Projects", val: projects.length, icon: Database, color: "text-cyan-500" },
              { label: "Sync Status", val: "OK", icon: Globe, color: "text-emerald-500" },
              { label: "Security", val: "Secure", icon: ShieldCheck, color: "text-rose-500" },
              { label: "Performance", val: "0.02ms", icon: Zap, color: "text-amber-500" }
            ].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded hover:border-cyan-500/30 transition-colors shadow-xl text-left", children: [
              /* @__PURE__ */ jsx(s.icon, { className: `${s.color} mb-4 opacity-60`, size: 20 }),
              /* @__PURE__ */ jsx("div", { className: "text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1", children: s.label }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-[var(--text-main)] tracking-tight italic", children: s.val })
            ] }, i)) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-2", children: [
                  /* @__PURE__ */ jsx(Terminal, { size: 16, className: "text-cyan-500" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)]", children: "Recent Activity" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-2", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "h-32 flex items-center justify-center bg-[var(--bg-surface)] rounded border border-dashed border-[var(--border)]", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" }) }) : projects.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center bg-[var(--bg-surface)] rounded border border-dashed border-[var(--border)] space-y-6", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "No projects found." }),
                  /* @__PURE__ */ jsx(Link, { href: route("editor"), className: "btn-secondary inline-block", children: "Create First Project" })
                ] }) : projects.slice(0, 5).map((project, idx) => /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: idx * 0.05 },
                    className: "group bg-[var(--bg-surface)] border border-[var(--border)] p-4 flex items-center justify-between hover:border-cyan-500/30 transition-all",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 min-w-0", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[var(--bg-main)] border border-[var(--border)] rounded flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:text-black transition-all", children: /* @__PURE__ */ jsx(Code2, { size: 18 }) }),
                        /* @__PURE__ */ jsxs("div", { className: "min-w-0 text-left", children: [
                          /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-[var(--text-main)] truncate uppercase italic tracking-tight group-hover:text-cyan-500 transition-colors", children: project.title }),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-1 gap-4 opacity-40 text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: [
                            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsx(Clock, { size: 10 }),
                              " ",
                              new Date(project.updated_at).toLocaleDateString()
                            ] }),
                            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsx(Briefcase, { size: 10 }),
                              " ",
                              project.category || "General"
                            ] })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                        /* @__PURE__ */ jsx(Link, { href: route("editor", { slug: project.slug }), className: "p-2 hover:bg-cyan-500 hover:text-white dark:hover:text-black text-[var(--text-muted)] rounded transition-all border border-transparent hover:border-cyan-500/50", children: /* @__PURE__ */ jsx(ExternalLink, { size: 14 }) }),
                        /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(project.id), className: "p-2 hover:bg-rose-500 hover:text-white text-[var(--text-muted)] rounded transition-all", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
                      ] })
                    ]
                  },
                  project.id
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-left", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-2", children: [
                    /* @__PURE__ */ jsx(Zap, { size: 16, className: "text-amber-500" }),
                    /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)]", children: "Quick Access" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
                    /* @__PURE__ */ jsxs(Link, { href: route("editor"), className: "flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: "New Project" }),
                      /* @__PURE__ */ jsx(ArrowRight, { size: 12, className: "opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" })
                    ] }),
                    /* @__PURE__ */ jsxs(Link, { href: route("cloud-sync"), className: "flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: "Cloud Sync" }),
                      /* @__PURE__ */ jsx(ArrowRight, { size: 12, className: "opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" })
                    ] }),
                    /* @__PURE__ */ jsxs(Link, { href: route("profile.edit"), className: "flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: "Profile Settings" }),
                      /* @__PURE__ */ jsx(ArrowRight, { size: 12, className: "opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded shadow-2xl relative overflow-hidden", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-2 text-[6px] text-[var(--text-muted)] font-mono opacity-20 uppercase", children: "Status_Ok" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
                    /* @__PURE__ */ jsx(UserCheck, { className: "text-cyan-500", size: 16 }),
                    /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]", children: "System Status" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [
                    { l: "Auth Status", v: "Verified", c: "text-emerald-500" },
                    { l: "Network", v: "Stable", c: "text-cyan-500" },
                    { l: "Uptime", v: "99.9%", c: "text-amber-500" }
                  ].map((stat, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[10px] font-bold uppercase", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[var(--text-muted)]", children: stat.l }),
                    /* @__PURE__ */ jsx("span", { className: stat.c, children: stat.v })
                  ] }, i)) })
                ] })
              ] })
            ] })
          ] }) })
        ]
      }
    )
  ] });
}
export {
  Dashboard as default
};
