import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Head, Link } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-Bk6Js6hx.js";
import { SlidersHorizontal, Search, Loader2, LayoutGrid, Lock, User, Eye, ShoppingBag, Code2 } from "lucide-react";
import axios from "axios";
import { P as ProjectPreviewContent } from "./ProjectPreviewContent-D0P3mb04.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./ProBackground-D5SseK5s.js";
import "./NotificationDropdown-DwAPkSZZ.js";
import "./AdUnit-CJudqw2U.js";
function Explore({ auth, siteSettings }) {
  const { globalAds } = usePage().props;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "ALL",
    type: "all",
    // all, public, paid, private
    sort: "latest",
    // latest, oldest, price_low, price_high
    min_price: 0,
    max_price: 500
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    axios.get("/api/explore/categories").then((res) => {
      setCategories(res.data || []);
    });
  }, []);
  useEffect(() => {
    fetchProjects(true);
  }, [filters]);
  const fetchProjects = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
    }
    try {
      const currentPage = reset ? 1 : page;
      const params = {
        ...filters,
        page: currentPage
      };
      const res = await axios.get("/api/explore", { params });
      const data = res.data.data;
      if (reset) {
        setProjects(data);
      } else {
        setProjects((prev) => [...prev, ...data]);
      }
      setHasMore(res.data.current_page < res.data.last_page);
      if (!reset) setPage(currentPage + 1);
    } catch (error) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Explore Modules" }),
    /* @__PURE__ */ jsxs("div", { className: "pt-24 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen flex flex-col md:flex-row gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full md:w-80 flex-shrink-0 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl sticky top-24", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-6", children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { size: 20, className: "text-cyan-500" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-black uppercase text-[var(--text-main)] tracking-widest italic", children: "Filters" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Search" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: filters.search,
                  onChange: (e) => handleFilterChange("search", e.target.value),
                  placeholder: "Search modules...",
                  className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-[var(--text-main)]"
                }
              ),
              /* @__PURE__ */ jsx(Search, { size: 16, className: "absolute left-4 top-3.5 text-[var(--text-muted)]" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Access Type" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: ["all", "public", "paid", "private"].map((type) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleFilterChange("type", type),
                className: `py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${filters.type === type ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-500" : "bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-muted)] hover:border-cyan-500/30 hover:text-[var(--text-main)]"}`,
                children: type
              },
              type
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "Price Range" }),
              /* @__PURE__ */ jsxs("span", { className: "text-cyan-500", children: [
                "$",
                filters.min_price,
                " - $",
                filters.max_price
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: "0",
                max: "1000",
                step: "5",
                value: filters.max_price,
                onChange: (e) => handleFilterChange("max_price", parseInt(e.target.value)),
                className: "w-full h-2 bg-[var(--bg-main)] rounded-lg appearance-none cursor-pointer accent-cyan-500"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Category" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.category,
                onChange: (e) => handleFilterChange("category", e.target.value),
                className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-[var(--text-main)] uppercase tracking-wider font-bold",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "ALL", children: "All Categories" }),
                  categories.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Sort By" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.sort,
                onChange: (e) => handleFilterChange("sort", e.target.value),
                className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-[var(--text-main)] uppercase tracking-wider font-bold",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "latest", children: "Newest First" }),
                  /* @__PURE__ */ jsx("option", { value: "oldest", children: "Oldest First" }),
                  /* @__PURE__ */ jsx("option", { value: "price_low", children: "Price: Low to High" }),
                  /* @__PURE__ */ jsx("option", { value: "price_high", children: "Price: High to Low" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setFilters({ search: "", category: "ALL", type: "all", sort: "latest", min_price: 0, max_price: 500 }),
              className: "w-full py-3 bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500/50 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
              children: "Reset Filters"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8 border-b border-[var(--border)] pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: "All Modules" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: [
            projects.length,
            " Results"
          ] })
        ] }),
        loading && projects.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center py-32", children: /* @__PURE__ */ jsx(Loader2, { size: 32, className: "text-cyan-500 animate-spin" }) }) : projects.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-32 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl", children: [
          /* @__PURE__ */ jsx(LayoutGrid, { size: 48, className: "mx-auto text-[var(--text-muted)] mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black uppercase text-[var(--text-main)] tracking-widest", children: "No Modules Found" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--text-muted)] mt-2", children: "Try adjusting your filters or search query." })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6", children: projects.map((project) => /* @__PURE__ */ jsxs(Link, { href: route("project.show", project.slug), className: `group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all hover:-translate-y-1 shadow-xl flex flex-col ${project.is_restricted ? "hover:border-rose-500/30" : "hover:border-cyan-500/30"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: `aspect-video relative overflow-hidden flex items-center justify-center ${project.is_restricted ? "bg-white" : "bg-white"}`, children: [
              /* @__PURE__ */ jsx(ProjectPreviewContent, { project }),
              project.is_restricted ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] z-20 pointer-events-none flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { className: "text-rose-500/50 w-16 h-16" }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30", children: "Restricted" })
              ] }) : /* @__PURE__ */ jsx(Fragment, { children: project.is_for_sale && /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30", children: [
                "$",
                project.price
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4 text-left flex-1 flex flex-col", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-[var(--text-main)] uppercase italic tracking-tighter truncate", children: project.title }) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-mono", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 uppercase font-bold", children: [
                /* @__PURE__ */ jsx(User, { size: 10, className: project.is_restricted ? "text-rose-500/40" : "text-cyan-500/40" }),
                project.user?.name || "Unknown"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "pt-4 mt-auto", children: /* @__PURE__ */ jsx("div", { className: `w-full py-3 bg-[var(--bg-elevated)] border border-[var(--border)] text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 ${project.is_restricted ? "text-[var(--text-muted)] group-hover:text-rose-500 group-hover:border-rose-500/50" : project.is_for_sale ? "text-white bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border-none" : "text-[var(--text-muted)] group-hover:text-cyan-500 group-hover:border-cyan-500/50"}`, children: project.is_restricted ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Eye, { size: 14 }),
                " View Restricted"
              ] }) : project.is_for_sale ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(ShoppingBag, { size: 14 }),
                " Buy Now"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Code2, { size: 14 }),
                " Open Source"
              ] }) }) })
            ] })
          ] }, project.id)) }),
          hasMore && /* @__PURE__ */ jsx("div", { className: "pt-8 flex justify-center", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => fetchProjects(false),
              disabled: loading,
              className: "py-3 px-8 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-main)] hover:border-cyan-500/50 hover:text-cyan-500 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2",
              children: loading ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : "Load More Modules"
            }
          ) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Explore as default
};
