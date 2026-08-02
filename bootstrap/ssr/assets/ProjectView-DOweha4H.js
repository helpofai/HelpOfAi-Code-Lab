import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Head, Link } from "@inertiajs/react";
import { P as PublicLayout } from "./PublicLayout-Bk6Js6hx.js";
import { Zap, User, Clock, Code2, Download, Bookmark, Copy, Lock, Loader2, ShoppingCart, CheckCircle2, Shield } from "lucide-react";
import { A as AdUnit } from "./AdUnit-CJudqw2U.js";
import axios from "axios";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./ProBackground-D5SseK5s.js";
import "./NotificationDropdown-DwAPkSZZ.js";
function ProjectView({ project, canEdit }) {
  const { globalAds } = usePage().props;
  const { auth } = usePage().props;
  const [compiled, setCompiled] = useState({ css: "", js: "" });
  const [isCompiling, setIsCompiling] = useState(true);
  const [activeTab, setActiveTab] = useState("html");
  const [isRequesting, setIsRequesting] = useState(false);
  const [accessRequestStatus, setAccessRequestStatus] = useState(project.access_request_status || null);
  const [rewardAdsCompleted, setRewardAdsCompleted] = useState(0);
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(0);
  const toast = useToast();
  const lockAd = globalAds?.adsLock?.[0] || globalAds?.video_reward?.[0] || globalAds?.in_feed?.[0] || Object.values(globalAds || {})[0]?.[0];
  useEffect(() => {
    const compile = async () => {
      let cCss = project.code?.css || "";
      let cJs = project.code?.js || "";
      const preps = project.settings?.preprocessors || { css: "css", js: "js" };
      try {
        if ((preps.css === "scss" || preps.css === "sass") && window.Sass) {
          window.Sass.compile(cCss, (result) => {
            setCompiled((prev) => ({ ...prev, css: result.text || cCss }));
          });
        } else {
          setCompiled((prev) => ({ ...prev, css: cCss }));
        }
        if ((preps.js === "babel" || preps.js === "typescript") && window.Babel) {
          const result = window.Babel.transform(cJs, { presets: ["env", "react", "typescript"] }).code;
          setCompiled((prev) => ({ ...prev, js: result }));
        } else {
          setCompiled((prev) => ({ ...prev, js: cJs }));
        }
      } catch (e) {
        console.error("Preview_Sync_Error");
      } finally {
        setIsCompiling(false);
      }
    };
    compile();
  }, [project]);
  useEffect(() => {
    let timer;
    if (isPlayingAd && adTimeLeft > 0) {
      timer = setTimeout(() => {
        setAdTimeLeft((prev) => prev - 1);
      }, 1e3);
    } else if (isPlayingAd && adTimeLeft === 0) {
      setIsPlayingAd(false);
      setRewardAdsCompleted((prev) => prev + 1);
    }
    return () => clearTimeout(timer);
  }, [isPlayingAd, adTimeLeft]);
  const playRewardAd = () => {
    setIsPlayingAd(true);
    setAdTimeLeft(5);
  };
  const libs = (project.settings?.externalLibraries || []).map((lib) => lib.endsWith(".css") ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"><\/script>`).join("\n");
  const srcDoc = `<!DOCTYPE html><html><head><style>body { margin: 0; overflow: hidden; background: white; font-family: sans-serif; } ${compiled.css}</style>${libs}</head><body>${project.code?.html || ""}<script>${compiled.js}<\/script></body></html>`;
  const handleDownload = () => {
    const content = `
<!-- HOACodeLab Export: ${project.title} -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    ${libs}
    <style>
        ${compiled.css}
    </style>
</head>
<body>
    ${project.code?.html || ""}
    
    <script>
        ${compiled.js}
    <\/script>
</body>
</html>`;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleCopyCode = () => {
    if (!isLocked && displayCode[activeTab]) {
      navigator.clipboard.writeText(displayCode[activeTab]);
      toast.success("Code copied to clipboard!");
    }
  };
  const handleRequestAccess = async () => {
    setIsRequesting(true);
    try {
      const res = await axios.post(`/api/projects/${project.id}/request-access`);
      setAccessRequestStatus(res.data.status);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to request access.");
    } finally {
      setIsRequesting(false);
    }
  };
  project ? project.user_id === auth.user?.id : true;
  const isHighLevelUser = auth?.user && (auth.user.identity_status === "verified" || auth.user.level > 4);
  const isPublicAdLocked = !canEdit && project.is_public && !project.is_for_sale && !isHighLevelUser && rewardAdsCompleted < 1;
  const isLocked = !canEdit && (project.is_for_sale || project.is_restricted || isPublicAdLocked);
  const lockType = project.is_restricted ? "private" : project.is_for_sale ? "paid" : isPublicAdLocked ? "public_ad" : "none";
  const displayCode = {
    html: isLocked ? project.code?.html?.substring(0, 50) + "\n\n... [CODE LOCKED] ...\n" : project.code?.html,
    css: isLocked ? project.code?.css?.substring(0, 50) + "\n\n... [CODE LOCKED] ...\n" : project.code?.css,
    js: isLocked ? project.code?.js?.substring(0, 50) + "\n\n... [CODE LOCKED] ...\n" : project.code?.js
  };
  return /* @__PURE__ */ jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: `${project.title} - View Project` }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: project.description || `Buy ${project.title} on our marketplace.` }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: project.title }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: project.description || `Premium source code for ${project.title}.` }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: project.og_image_url || "" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": project.title,
        "description": project.description,
        "applicationCategory": "DeveloperApplication",
        "offers": {
          "@type": "Offer",
          "price": project.price,
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Person",
          "name": project.user?.name || "Vendor"
        }
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-24 pb-20 px-6 max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-cyan-500 font-bold tracking-widest uppercase text-xs", children: [
            /* @__PURE__ */ jsx(Zap, { size: 14, className: "fill-current" }),
            /* @__PURE__ */ jsx("span", { children: project.is_restricted ? "Private Module" : project.is_for_sale ? "Premium Module" : "Open Source Component" })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-black text-[var(--text-main)] uppercase tracking-tighter italic", children: project.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--text-muted)] font-medium leading-relaxed max-w-2xl", children: project.description || "No description provided for this module." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest mt-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(User, { size: 12, className: "text-cyan-500" }),
              "By @",
              project.user?.name || "Unknown"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Clock, { size: 12, className: "text-cyan-500" }),
              new Date(project.created_at).toLocaleDateString()
            ] }),
            project.version && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 px-2 py-0.5 bg-cyan-500/10 text-cyan-500 rounded font-bold", children: [
              "v",
              project.version
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-video rounded-3xl overflow-hidden border-2 border-[var(--border)] shadow-2xl bg-white group", children: [
          !isCompiling ? /* @__PURE__ */ jsx(
            "iframe",
            {
              srcDoc,
              className: "w-full h-full border-none",
              sandbox: "allow-scripts",
              title: `preview-${project.id}`
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-slate-100 animate-pulse flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-black uppercase text-slate-400 tracking-widest", children: "Building_Preview..." }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-white", children: [
            /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "Live Demo" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[var(--border)] pb-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-black uppercase text-[var(--text-main)] tracking-widest flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Code2, { size: 16, className: "text-cyan-500" }),
              " Source Code"
            ] }),
            canEdit && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs("button", { onClick: handleDownload, className: "btn-secondary text-[10px] py-1.5 px-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Download, { size: 12 }),
                " Export HTML"
              ] }),
              /* @__PURE__ */ jsxs(Link, { href: route("editor", project.slug), className: "btn-primary text-[10px] py-1.5 px-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Bookmark, { size: 12 }),
                " Edit / Fork"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/10 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-white/10 bg-black/40", children: [
              /* @__PURE__ */ jsx("div", { className: "flex", children: ["html", "css", "js"].map((tab) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setActiveTab(tab),
                  className: `px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === tab ? "text-cyan-500 border-b-2 border-cyan-500 bg-white/5" : "text-white/50 hover:text-white/80"}`,
                  children: tab
                },
                tab
              )) }),
              !isLocked && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleCopyCode,
                  className: "mr-4 text-white/50 hover:text-white transition-colors p-2 rounded-lg bg-white/5 hover:bg-white/10",
                  title: "Copy Code",
                  children: /* @__PURE__ */ jsx(Copy, { size: 14 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative min-h-[300px] max-h-[500px] overflow-auto p-4", children: [
              /* @__PURE__ */ jsx("pre", { className: `font-mono text-xs leading-relaxed text-gray-300 ${isLocked ? "blur-sm select-none" : ""}`, children: /* @__PURE__ */ jsx("code", { children: displayCode[activeTab] }) }),
              isLocked && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-6", children: lockType === "private" && rewardAdsCompleted < 2 || lockType === "public_ad" ? /* @__PURE__ */ jsxs("div", { className: "bg-black border border-[var(--border)] p-6 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl relative overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none" }),
                /* @__PURE__ */ jsxs("h4", { className: "text-lg font-black uppercase text-white tracking-widest flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsx(Zap, { size: 18, className: "text-cyan-500" }),
                  " Unlock Protocol"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 font-medium", children: lockType === "private" ? `This module is restricted. Complete ${2 - rewardAdsCompleted} more sponsor ad${2 - rewardAdsCompleted > 1 ? "s" : ""} to reveal the request access protocol.` : "This is a public module. Complete 1 sponsor ad to view the code." }),
                isPlayingAd ? /* @__PURE__ */ jsxs("div", { className: "w-full relative bg-[#1a1a1a] rounded-xl border border-white/10 flex flex-col items-center justify-center overflow-hidden min-h-[150px]", children: [
                  lockAd ? /* @__PURE__ */ jsx("div", { className: "w-full max-h-[250px] overflow-hidden flex items-center justify-center", children: /* @__PURE__ */ jsx(AdUnit, { ad: lockAd }) }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-cyan-500/10 animate-pulse" }),
                  /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-white text-xs font-bold z-20 border border-white/10 shadow-lg", children: [
                    adTimeLeft,
                    "s"
                  ] }),
                  !lockAd && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest text-white/50 mb-2", children: "Sponsor Advertisement" }),
                    /* @__PURE__ */ jsxs("div", { className: "text-4xl font-black text-white z-10", children: [
                      adTimeLeft,
                      "s"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-1000 z-20", style: { width: `${(5 - adTimeLeft) / 5 * 100}%` } })
                ] }) : /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: playRewardAd,
                    className: "w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]",
                    children: lockType === "private" ? `Initialize Ad Sequence (${rewardAdsCompleted}/2)` : "Watch Ad to Unlock Code"
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(Lock, { size: 24, className: "text-rose-500" }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-lg font-black uppercase text-[var(--text-main)] italic tracking-tighter", children: lockType === "private" ? "Access Restricted" : "Code Locked" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)] font-medium leading-relaxed", children: lockType === "private" ? "This is a private module. The creator has restricted code access." : "Purchase this premium module to unlock the full source code, export options, and commercial usage rights." }),
                  lockType === "private" && /* @__PURE__ */ jsx("div", { className: "pt-2", children: !auth?.user ? /* @__PURE__ */ jsx(Link, { href: route("login"), className: "w-full py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase inline-block text-center hover:bg-rose-600 transition-colors", children: "Login to Request Access" }) : !accessRequestStatus ? /* @__PURE__ */ jsxs("button", { onClick: handleRequestAccess, disabled: isRequesting, className: "w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50", children: [
                    isRequesting ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : null,
                    isRequesting ? "Requesting..." : "Request Code Access"
                  ] }) : accessRequestStatus === "pending" ? /* @__PURE__ */ jsx("div", { className: "w-full py-2 border border-rose-500/30 text-rose-500 rounded-lg text-[10px] font-black uppercase bg-rose-500/10", children: "Access Request Pending" }) : accessRequestStatus === "rejected" ? /* @__PURE__ */ jsx("div", { className: "w-full py-2 bg-black text-rose-500 border border-rose-500/30 rounded-lg text-[10px] font-black uppercase", children: "Access Rejected by Author" }) : null })
                ] }),
                lockType === "paid" && /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("checkout.project", project.slug),
                    className: "w-full flex items-center justify-center gap-3 py-3 bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]",
                    children: [
                      /* @__PURE__ */ jsx(ShoppingCart, { size: 16 }),
                      " Unlock Now for $",
                      project.price
                    ]
                  }
                ),
                lockAd && /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-[var(--border)] mt-4 opacity-80 scale-90 origin-top", children: /* @__PURE__ */ jsx(AdUnit, { ad: lockAd }) })
              ] }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-8 shadow-xl sticky top-32", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center border-b border-[var(--border)] pb-8", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]", children: project.is_restricted ? "Access_Level" : "Acquisition_Cost" }),
            /* @__PURE__ */ jsx("div", { className: "text-5xl font-black text-cyan-500 font-mono tracking-tighter", children: project.is_restricted ? "PRIVATE" : project.is_for_sale ? `$${project.price}` : "FREE" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: canEdit ? /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("editor", project.slug),
              className: "w-full flex items-center justify-center gap-3 py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]",
              children: [
                /* @__PURE__ */ jsx(Code2, { size: 18 }),
                " Open in Editor"
              ]
            }
          ) : project.is_restricted ? /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-center gap-3 py-5 bg-[var(--bg-main)] text-rose-500 border border-rose-500/20 font-black uppercase text-xs tracking-widest rounded-xl opacity-80 cursor-not-allowed", children: [
            /* @__PURE__ */ jsx(Lock, { size: 18 }),
            " Code Restricted"
          ] }) : project.is_for_sale ? /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("checkout.project", project.slug),
              className: "w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]",
              children: [
                /* @__PURE__ */ jsx(ShoppingCart, { size: 18 }),
                " Purchase Module"
              ]
            }
          ) : /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("editor", project.slug),
              className: "w-full flex items-center justify-center gap-3 py-5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border)] font-black uppercase text-xs tracking-widest rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all",
              children: [
                /* @__PURE__ */ jsx(Code2, { size: 18 }),
                " View Source"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 pt-4", children: [
            "Instant access to source code",
            project.is_for_sale ? "Commercial usage rights" : "Personal usage rights",
            "Cloud sync enabled"
          ].map((perk, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[10px] uppercase font-bold text-[var(--text-muted)]", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: "text-emerald-500" }),
            perk
          ] }, i)) }),
          project.is_for_sale && !canEdit && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3 mt-4", children: [
            /* @__PURE__ */ jsx(Shield, { size: 16, className: "text-emerald-500 mt-1 shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-emerald-500/80 leading-relaxed uppercase tracking-wider", children: "Secure Neural Gateway processing. Payments are protected and encrypted." })
          ] })
        ] }),
        project.settings?.github_commits?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 space-y-6 shadow-xl", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Code2, { size: 14 }),
            " Version History"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: project.settings.github_commits.map((commit, idx) => /* @__PURE__ */ jsxs("div", { className: "border-l-2 border-emerald-500/30 pl-4 py-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-[var(--text-main)] font-bold mb-1", children: commit.message.split("\n")[0] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-emerald-500", children: [
                "#",
                commit.sha
              ] }),
              /* @__PURE__ */ jsx("span", { children: "•" }),
              /* @__PURE__ */ jsx("span", { children: new Date(commit.date).toLocaleDateString() })
            ] })
          ] }, idx)) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ProjectView as default
};
