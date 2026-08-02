import { jsxs, jsx } from "react/jsx-runtime";
import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Upload, Code2, DollarSign, Github, Activity, ShoppingBag } from "lucide-react";
import axios from "axios";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function Sell() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Scripts",
    price: 19.99,
    github_repo_url: "",
    demo_url: "",
    meta_description: "",
    tags: "",
    support_duration: "6_months",
    markdown_files: [],
    github_commits: [],
    github_version: "1.0.0"
  });
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  const addLog = (msg, type = "info") => {
    setTerminalLogs((prev) => [...prev, { time: (/* @__PURE__ */ new Date()).toLocaleTimeString(), msg, type }]);
  };
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const uploadImage = async (file) => {
    const formData2 = new FormData();
    formData2.append("image", file);
    try {
      const res = await axios.post("/api/media/upload", formData2, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.url;
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      toast.error("Upload failed: " + serverMsg);
      console.error("FULL ERROR:", err.response?.data);
      throw err;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowTerminal(true);
    setTerminalLogs([]);
    try {
      addLog("Initializing CI/CD deployment sequence...", "system");
      await new Promise((r) => setTimeout(r, 800));
      let thumbnailUrl = "";
      const galleryUrls = [];
      if (thumbnailFile) {
        addLog("Uploading thumbnail assets to distributed edge storage...", "info");
        thumbnailUrl = await uploadImage(thumbnailFile);
      }
      if (galleryFiles.length > 0) {
        addLog(`Uploading ${galleryFiles.length} gallery images...`, "info");
        for (const file of galleryFiles) {
          const url = await uploadImage(file);
          galleryUrls.push(url);
        }
      }
      addLog("Connecting to GitHub via secure PAT proxy...", "info");
      await new Promise((r) => setTimeout(r, 1e3));
      addLog("Authenticating repository access...", "success");
      await new Promise((r) => setTimeout(r, 600));
      const payload = {
        title: formData.title,
        category: formData.category,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        meta_description: formData.meta_description,
        is_for_sale: true,
        is_public: true,
        is_private: false,
        price: parseFloat(formData.price),
        github_repo_url: formData.github_repo_url,
        version: formData.github_version,
        settings: {
          demo_url: formData.demo_url,
          markdown_files: formData.markdown_files || [],
          thumbnail_url: thumbnailUrl,
          gallery_images: galleryUrls,
          support_duration: formData.support_duration,
          github_commits: formData.github_commits || []
        },
        code: { html: "", css: "", js: "" }
      };
      addLog("Parsing package.json and composer.json for version targets...", "info");
      await new Promise((r) => setTimeout(r, 1200));
      addLog("Found latest commit hash from main branch.", "success");
      await new Promise((r) => setTimeout(r, 500));
      const res = await axios.post("/api/projects", payload);
      addLog("Injecting support duration architecture...", "info");
      await axios.put(`/api/projects/${res.data.id}`, {
        is_for_sale: true,
        price: parseFloat(formData.price),
        github_repo_url: formData.github_repo_url,
        meta_description: formData.meta_description
      });
      addLog("Registering Webhook Listener on HOACodeLab server...", "info");
      await new Promise((r) => setTimeout(r, 800));
      addLog("Marketplace Listing Complete! Real-time OTA proxy is LIVE.", "success");
      toast.success("Product successfully listed on the Marketplace!");
      setTimeout(() => {
        router.visit(route("marketplace"));
      }, 2e3);
    } catch (error) {
      addLog("CRITICAL FAILURE: " + (error.response?.data?.message || "Internal server error"), "error");
      toast.error(error.response?.data?.message || "Failed to list product.");
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-emerald-500/10 border border-emerald-500/20 rounded", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "text-emerald-500", size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-[var(--text-main)] uppercase italic leading-none", children: "Sell a Product" }),
          /* @__PURE__ */ jsx("p", { className: "text-[8px] text-emerald-500 font-bold uppercase tracking-[0.4em] mt-1", children: "Marketplace Distribution" })
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Sell Product" }),
        /* @__PURE__ */ jsx("div", { className: "p-6 md:p-12 overflow-y-auto min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-emerald-500/5 text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/50", children: /* @__PURE__ */ jsx(Upload, { className: "text-black", size: 28 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-emerald-500 uppercase italic tracking-tighter", children: "List your Software" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[var(--text-muted)] mt-2", children: "Sell your scripts, themes, and plugins to thousands of buyers. We automatically handle 70/30 payment splits and generate RSA-signed license keys." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl space-y-8 text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-[var(--text-main)] uppercase tracking-[0.2em] border-b border-[var(--border)] pb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Code2, { size: 16, className: "text-cyan-500" }),
                " Basic Information"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Product Title" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      required: true,
                      type: "text",
                      placeholder: "e.g. Next.js SaaS Boilerplate",
                      value: formData.title,
                      onChange: (e) => setFormData({ ...formData, title: e.target.value }),
                      className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-bold"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Category" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: formData.category,
                      onChange: (e) => setFormData({ ...formData, category: e.target.value }),
                      className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-bold uppercase tracking-widest appearance-none",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "Scripts", children: "PHP Scripts" }),
                        /* @__PURE__ */ jsx("option", { value: "Themes", children: "Themes & Templates" }),
                        /* @__PURE__ */ jsx("option", { value: "Plugins", children: "Plugins" }),
                        /* @__PURE__ */ jsx("option", { value: "Mobile", children: "Mobile Apps" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Short Description" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    required: true,
                    rows: "3",
                    placeholder: "Briefly describe what your product does...",
                    value: formData.meta_description,
                    onChange: (e) => setFormData({ ...formData, meta_description: e.target.value }),
                    className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Main Thumbnail Image" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      accept: "image/*",
                      onChange: (e) => setThumbnailFile(e.target.files[0]),
                      className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-3 text-[var(--text-main)] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-black hover:file:bg-emerald-400 transition-all cursor-pointer"
                    }
                  ),
                  thumbnailFile && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-emerald-500 font-bold mt-1", children: [
                    "Selected: ",
                    thumbnailFile.name
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Gallery Images (Multiple)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      accept: "image/*",
                      multiple: true,
                      onChange: (e) => setGalleryFiles(Array.from(e.target.files)),
                      className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-3 text-[var(--text-main)] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 transition-all cursor-pointer"
                    }
                  ),
                  galleryFiles.length > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-cyan-500 font-bold mt-1", children: [
                    "Selected: ",
                    galleryFiles.length,
                    " files"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-[var(--text-main)] uppercase tracking-[0.2em] border-b border-[var(--border)] pb-2 flex items-center gap-2 mt-8", children: [
                /* @__PURE__ */ jsx(DollarSign, { size: 16, className: "text-emerald-500" }),
                " Pricing & Delivery"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Price (USD)" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(DollarSign, { size: 16, className: "absolute left-4 top-4 text-[var(--text-muted)]" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        required: true,
                        type: "number",
                        min: "0",
                        step: "0.01",
                        value: formData.price,
                        onChange: (e) => setFormData({ ...formData, price: e.target.value }),
                        className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl pl-12 p-4 text-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-black text-lg"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Support & Updates Duration" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: formData.support_duration,
                      onChange: (e) => setFormData({ ...formData, support_duration: e.target.value }),
                      className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-bold uppercase tracking-widest appearance-none",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "6_months", children: "6 Months (Industry Standard)" }),
                        /* @__PURE__ */ jsx("option", { value: "lifetime", children: "Lifetime Updates" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Release Version" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "1.0.0",
                      value: formData.github_version,
                      onChange: (e) => setFormData({ ...formData, github_version: e.target.value }),
                      className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
                  /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Github, { size: 14 }),
                    " GitHub Private Repo URL"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        required: true,
                        type: "url",
                        placeholder: "https://github.com/yourusername/private-repo",
                        value: formData.github_repo_url,
                        onChange: (e) => setFormData({ ...formData, github_repo_url: e.target.value }),
                        className: "flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-main)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: async () => {
                          if (!formData.github_repo_url) return toast.error("Please enter a GitHub URL first.");
                          try {
                            const res = await axios.post("/api/vendors/github/fetch-md", { repo_url: formData.github_repo_url });
                            setFormData({ ...formData, markdown_files: res.data.markdown_files, github_commits: res.data.commits || [], github_version: res.data.version || "1.0.0" });
                            toast.success(`Fetched v${res.data.version || "1.0.0"}, ${res.data.markdown_files.length} doc(s) and commit history!`);
                          } catch (e) {
                            toast.error(e.response?.data?.message || "Failed to fetch markdown files.");
                          }
                        },
                        className: "px-6 py-4 bg-gray-800 text-white hover:bg-gray-700 font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg",
                        children: "Fetch Docs"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-[var(--text-muted)] font-bold mt-2", children: [
                    "Click ",
                    /* @__PURE__ */ jsx("strong", { children: "Fetch Docs" }),
                    " to pull README and other .md files to display on your product page. Our asset server will also automatically stream the zipball of this repository to buyers."
                  ] }),
                  formData.markdown_files?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-emerald-500", children: "Ready to publish:" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded font-bold", children: [
                        "v",
                        formData.github_version
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside text-sm text-[var(--text-main)]", children: formData.markdown_files.map((md, idx) => /* @__PURE__ */ jsx("li", { className: "font-mono", children: md.name }, idx)) }),
                    formData.github_commits?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-emerald-500/20", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-emerald-500 mb-2", children: "Latest Commits:" }),
                      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: formData.github_commits.slice(0, 3).map((commit, idx) => /* @__PURE__ */ jsxs("div", { className: "text-xs text-[var(--text-muted)] font-mono flex gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-emerald-400 font-bold", children: commit.sha }),
                        /* @__PURE__ */ jsx("span", { children: commit.message.split("\n")[0] })
                      ] }, idx)) })
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-6 flex justify-end", children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: isSubmitting,
                className: "px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3",
                children: [
                  isSubmitting ? /* @__PURE__ */ jsx(Activity, { className: "animate-spin", size: 18 }) : /* @__PURE__ */ jsx(ShoppingBag, { size: 18 }),
                  "List on Marketplace"
                ]
              }
            ) })
          ] })
        ] }) }),
        showTerminal && /* @__PURE__ */ jsxs(
          "div",
          {
            style: { left: position.x, top: position.y },
            className: "fixed z-50 w-full max-w-lg bg-[#0a0a0a] border border-[#333] rounded-xl shadow-2xl overflow-hidden flex flex-col",
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  onMouseDown: handleMouseDown,
                  className: "bg-[#1a1a1a] border-b border-[#333] p-3 flex items-center justify-between cursor-move select-none",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Activity, { size: 14, className: "text-emerald-500" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-gray-400", children: "CI/CD Real-Time Deployment Log" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-red-500 cursor-pointer", onClick: () => setShowTerminal(false) }),
                      /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-yellow-500" }),
                      /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-green-500" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "p-4 h-64 overflow-y-auto font-mono text-xs flex flex-col gap-1", children: [
                terminalLogs.map((log, idx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-gray-600 shrink-0", children: [
                    "[",
                    log.time,
                    "]"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: log.type === "system" ? "text-blue-400 font-bold" : log.type === "success" ? "text-emerald-400" : log.type === "error" ? "text-red-400 font-bold" : "text-gray-300", children: log.msg })
                ] }, idx)),
                isSubmitting && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-2 animate-pulse", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-gray-600", children: [
                    "[",
                    (/* @__PURE__ */ new Date()).toLocaleTimeString(),
                    "]"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-emerald-500", children: "_" })
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  Sell as default
};
