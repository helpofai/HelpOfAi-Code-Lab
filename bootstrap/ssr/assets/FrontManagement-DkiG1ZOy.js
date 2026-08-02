import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Type, ToggleRight, Loader2, CheckCircle, Save, LayoutTemplate, ChevronDown } from "lucide-react";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
const Section = ({ title, icon: Icon, children, defaultOpen = false, color = "indigo" }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colors = {
    indigo: "text-indigo-500 border-indigo-500/30",
    emerald: "text-emerald-500 border-emerald-500/30",
    cyan: "text-cyan-500 border-cyan-500/30",
    rose: "text-rose-500 border-rose-500/30",
    amber: "text-amber-500 border-amber-500/30",
    purple: "text-purple-500 border-purple-500/30",
    blue: "text-blue-500 border-blue-500/30"
  };
  const textColor = colors[color].split(" ")[0];
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setIsOpen(!isOpen),
            className: "w-full flex items-center justify-between p-8 hover:bg-white/5 transition-colors",
            children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-[0.4em] text-white/60 flex items-center", children: [
                /* @__PURE__ */ jsx(Icon, { size: 16, className: `mr-3 ${textColor}` }),
                " ",
                title
              ] }),
              /* @__PURE__ */ jsx(ChevronDown, { className: `text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsx("div", { className: "p-8 pt-0 space-y-6 border-t border-white/5 mt-2", children })
          }
        ) })
      ]
    }
  );
};
function FrontManagement({ settings }) {
  const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
    settings,
    site_logo: null,
    site_favicon: null,
    seo_og_image: null,
    _method: "POST"
    // Ensuring POST for file uploads
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.front-management.update"), {
      forceFormData: true,
      preserveScroll: true
    });
  };
  const handleSettingChange = (key, value) => {
    setData("settings", {
      ...data.settings,
      [key]: value
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-indigo-500/10 border border-indigo-400/30 rounded-lg", children: /* @__PURE__ */ jsx(LayoutTemplate, { className: "text-indigo-400", size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-white tracking-tighter uppercase leading-tight italic", children: "Frontend_Core" }),
          /* @__PURE__ */ jsx("p", { className: "text-[8px] text-indigo-500/60 uppercase tracking-[0.4em] font-bold", children: "Public Interface Control" })
        ] })
      ] }) }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Frontend Management" }),
        /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
          /* @__PURE__ */ jsx(AnimatedGrid, {}),
          /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto relative z-10", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
            /* @__PURE__ */ jsx(Section, { title: "SEO & Metadata", icon: Globe, color: "blue", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-blue-500", children: "Meta Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.settings.seo_meta_title || "",
                    onChange: (e) => handleSettingChange("seo_meta_title", e.target.value),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors font-bold",
                    placeholder: "Page Title | Brand Name"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-blue-500", children: "Meta Description" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: data.settings.seo_meta_description || "",
                    onChange: (e) => handleSettingChange("seo_meta_description", e.target.value),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors font-medium h-24 resize-none",
                    placeholder: "Brief description of the page for search engines..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-blue-500", children: "Keywords (Comma Separated)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.settings.seo_meta_keywords || "",
                    onChange: (e) => handleSettingChange("seo_meta_keywords", e.target.value),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors font-medium",
                    placeholder: "html, css, javascript, online editor"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-blue-500", children: "Social Share Image (OG:Image)" }),
                data.settings.seo_og_image && /* @__PURE__ */ jsx("div", { className: "mb-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: data.settings.seo_og_image, alt: "OG Preview", className: "h-32 w-auto object-contain rounded-lg" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    accept: "image/*",
                    onChange: (e) => setData("seo_og_image", e.target.files[0]),
                    className: "w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20"
                  }
                ),
                errors.seo_og_image && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs mt-1 font-bold", children: errors.seo_og_image })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Section, { title: "Branding & Identity", icon: Globe, color: "emerald", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-emerald-500", children: "Site Logo" }),
                data.settings.site_logo && /* @__PURE__ */ jsx("div", { className: "mb-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: data.settings.site_logo, alt: "Current Logo", className: "h-12 w-auto object-contain" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    accept: "image/*",
                    onChange: (e) => setData("site_logo", e.target.files[0]),
                    className: "w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                  }
                ),
                errors.site_logo && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs mt-1 font-bold", children: errors.site_logo })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-emerald-500", children: "Site Favicon" }),
                data.settings.site_favicon && /* @__PURE__ */ jsx("div", { className: "mb-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: data.settings.site_favicon, alt: "Current Favicon", className: "h-8 w-8 object-contain" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    accept: "image/*",
                    onChange: (e) => setData("site_favicon", e.target.files[0]),
                    className: "w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                  }
                ),
                errors.site_favicon && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs mt-1 font-bold", children: errors.site_favicon })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Section, { title: "Typography_System", icon: Type, color: "indigo", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2", children: "Global Settings" }),
                /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-500", children: "Font Family" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.settings.typography_font_family || "",
                      onChange: (e) => handleSettingChange("typography_font_family", e.target.value),
                      className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-bold",
                      placeholder: "Inter, sans-serif"
                    }
                  )
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2", children: "Body Text Protocol" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-500", children: "Base Size" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.settings.typography_body_size || "",
                        onChange: (e) => handleSettingChange("typography_body_size", e.target.value),
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium",
                        placeholder: "1rem"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-500", children: "Line Height" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.settings.typography_line_height_body || "",
                        onChange: (e) => handleSettingChange("typography_line_height_body", e.target.value),
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium",
                        placeholder: "1.6"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-500", children: "Weight" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.settings.typography_font_weight_body || "",
                        onChange: (e) => handleSettingChange("typography_font_weight_body", e.target.value),
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium",
                        placeholder: "400"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2", children: "Header Matrix" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-500", children: "Line Height" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.settings.typography_line_height_headings || "",
                        onChange: (e) => handleSettingChange("typography_line_height_headings", e.target.value),
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium",
                        placeholder: "1.2"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-500", children: "Letter Spacing" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.settings.typography_letter_spacing_headings || "",
                        onChange: (e) => handleSettingChange("typography_letter_spacing_headings", e.target.value),
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium",
                        placeholder: "-0.02em"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-500", children: "Transform" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        value: data.settings.typography_transform_headings || "none",
                        onChange: (e) => handleSettingChange("typography_transform_headings", e.target.value),
                        className: "w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium appearance-none",
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "none", children: "None" }),
                          /* @__PURE__ */ jsx("option", { value: "uppercase", children: "Uppercase" }),
                          /* @__PURE__ */ jsx("option", { value: "capitalize", children: "Capitalize" }),
                          /* @__PURE__ */ jsx("option", { value: "lowercase", children: "Lowercase" })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5", children: ["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-500", children: [
                    tag.toUpperCase(),
                    " Size"
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.settings[`typography_${tag}_size`] || "",
                      onChange: (e) => handleSettingChange(`typography_${tag}_size`, e.target.value),
                      className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                    }
                  )
                ] }, tag)) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs(Section, { title: "Hero_Configuration", icon: Type, color: "indigo", defaultOpen: true, children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-400", children: "Hero Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.settings.home_hero_title || "",
                    onChange: (e) => handleSettingChange("home_hero_title", e.target.value),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-bold tracking-tight"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-400", children: "Hero Subtitle" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: data.settings.home_hero_subtitle || "",
                    onChange: (e) => handleSettingChange("home_hero_subtitle", e.target.value),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-medium h-32 resize-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-400", children: "CTA Text" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.settings.home_hero_cta_text || "",
                      onChange: (e) => handleSettingChange("home_hero_cta_text", e.target.value),
                      className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-indigo-400", children: "CTA Link" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.settings.home_hero_cta_link || "",
                      onChange: (e) => handleSettingChange("home_hero_cta_link", e.target.value),
                      className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Announcement_System", icon: ToggleRight, color: "emerald", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-white uppercase tracking-tight", children: "Banner Active Status" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSettingChange("announcement_banner_active", data.settings.announcement_banner_active === "1" ? "0" : "1"),
                    className: `relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${data.settings.announcement_banner_active === "1" ? "bg-emerald-500" : "bg-white/20"}`,
                    children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${data.settings.announcement_banner_active === "1" ? "translate-x-6" : "translate-x-0"}`
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-emerald-500", children: "Banner Text" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.settings.announcement_banner_text || "",
                    onChange: (e) => handleSettingChange("announcement_banner_text", e.target.value),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Section, { title: "Featured_Module_Feed", icon: Globe, color: "cyan", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-cyan-500", children: "Section Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.settings.home_featured_title || "",
                    onChange: (e) => handleSettingChange("home_featured_title", e.target.value),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 transition-colors font-bold"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-cyan-500", children: "Section Subtitle" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.settings.home_featured_subtitle || "",
                    onChange: (e) => handleSettingChange("home_featured_subtitle", e.target.value),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 transition-colors font-medium"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-8", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "group flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(79,70,229,0.3)]",
                children: processing ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 animate-spin", size: 18 }) : recentlySuccessful ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2", size: 18 }),
                  "System_Updated"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Save, { className: "mr-2 group-hover:rotate-12 transition-transform", size: 18 }),
                  "Save_Configuration"
                ] })
              }
            ) })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  FrontManagement as default
};
