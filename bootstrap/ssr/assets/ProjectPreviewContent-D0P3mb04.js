import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
const ProjectPreviewContent = ({ project }) => {
  const [compiled, setCompiled] = useState({ css: "", js: "" });
  const [isCompiling, setIsCompiling] = useState(true);
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
  const libs = (project.settings?.externalLibraries || []).map((lib) => lib.endsWith(".css") ? `<link rel="stylesheet" href="${lib}">` : `<script src="${lib}"><\/script>`).join("\n");
  const srcDoc = `<!DOCTYPE html><html><head><style>body { margin: 0; overflow: hidden; background: white; font-family: sans-serif; } ${compiled.css}</style>${libs}</head><body>${project.code?.html || ""}<script>${compiled.js}<\/script></body></html>`;
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full relative group", children: [
    !isCompiling ? /* @__PURE__ */ jsx("iframe", { srcDoc, className: "w-full h-full border-none pointer-events-none scale-75 origin-top-left", style: { width: "133.33%", height: "133.33%" }, sandbox: "allow-scripts", title: `preview-${project.id}` }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-[10px] font-black uppercase text-slate-300", children: "Syncing_Node..." }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]", children: /* @__PURE__ */ jsx("div", { className: "p-3 bg-cyan-500 text-black rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform", children: /* @__PURE__ */ jsx(Zap, { size: 20, fill: "currentColor" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-emerald-500 animate-pulse" }),
      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-white uppercase tracking-widest", children: "Live Preview" })
    ] }) })
  ] });
};
export {
  ProjectPreviewContent as P
};
