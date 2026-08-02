import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { useEffect } from "react";
import { Globe, Zap, Save, ArrowLeft } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { T as TextInput } from "./TextInput-DN069oHs.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import { T as TiptapEditor } from "./TiptapEditor-BoWy0e8_.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
import "@tiptap/react";
import "@tiptap/starter-kit";
import "@tiptap/extension-link";
import "@tiptap/extension-image";
function CreateEdit({ page = null }) {
  const { data, setData, post, put, processing, errors } = useForm({
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
    meta_title: page?.meta_title || "",
    meta_description: page?.meta_description || "",
    meta_keywords: page?.meta_keywords || "",
    is_published: page ? page.is_published : true
  });
  const isEdit = !!page;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(route("admin.pages.update", page.id));
    } else {
      post(route("admin.pages.store"));
    }
  };
  useEffect(() => {
    if (!isEdit && data.title) {
      setData("slug", data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
    }
  }, [data.title]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsx(Link, { href: route("admin.pages.index"), className: "p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-white transition-all", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: isEdit ? "Update Page" : "Create Page" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1", children: isEdit ? page.title : "New Substrate Module" })
          ] })
        ] }) }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Page" : "New Page" }),
          /* @__PURE__ */ jsx("div", { className: "relative min-h-full p-6 md:p-12 overflow-y-auto text-left", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Page Title" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: data.title,
                    onChange: (e) => setData("title", e.target.value),
                    className: "w-full bg-[var(--bg-elevated)] font-bold text-lg",
                    placeholder: "e.g. Privacy Protocol"
                  }
                ),
                errors.title && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] font-black uppercase", children: errors.title })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Signal_Path (Slug)" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[var(--text-muted)] font-mono text-xs", children: "/" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: data.slug,
                      onChange: (e) => setData("slug", e.target.value),
                      className: "bg-transparent border-none p-2 text-cyan-500 font-mono text-xs focus:ring-0 w-full",
                      placeholder: "privacy-protocol"
                    }
                  )
                ] }),
                errors.slug && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] font-black uppercase", children: errors.slug })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Data_Buffer (Content)" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-cyan-500/50 uppercase tracking-widest italic", children: "WYSIWYG Rich Text" })
                ] }),
                /* @__PURE__ */ jsx(
                  TiptapEditor,
                  {
                    content: data.content,
                    onChange: (content) => setData("content", content)
                  }
                ),
                errors.content && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] font-black uppercase", children: errors.content })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-6", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 flex items-center gap-2 italic", children: [
                  /* @__PURE__ */ jsx(Globe, { size: 14 }),
                  " Search_Discovery"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Meta_Title" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.meta_title, onChange: (e) => setData("meta_title", e.target.value), className: "w-full bg-[var(--bg-elevated)] text-[10px]" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Meta_Description" }),
                    /* @__PURE__ */ jsx("textarea", { value: data.meta_description, onChange: (e) => setData("meta_description", e.target.value), className: "w-full h-24 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-[10px] focus:ring-0 resize-none" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Keywords" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.meta_keywords, onChange: (e) => setData("meta_keywords", e.target.value), className: "w-full bg-[var(--bg-elevated)] text-[10px]" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl space-y-6", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] flex items-center gap-2 italic", children: [
                  /* @__PURE__ */ jsx(Zap, { size: 14 }),
                  " Protocol_Status"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: "Public Link" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setData("is_published", !data.is_published),
                      className: `relative w-10 h-5 rounded-full transition-colors ${data.is_published ? "bg-emerald-500" : "bg-slate-700"}`,
                      children: /* @__PURE__ */ jsx("div", { className: `absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${data.is_published ? "translate-x-6" : "translate-x-1"}` })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(PrimaryButton, { disabled: processing, className: "w-full py-4 bg-cyan-500 text-black border-cyan-500 hover:bg-white transition-all shadow-xl shadow-cyan-500/10", children: [
                  /* @__PURE__ */ jsx(Save, { size: 16, className: "mr-2" }),
                  " Commit_Protocol"
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
  CreateEdit as default
};
