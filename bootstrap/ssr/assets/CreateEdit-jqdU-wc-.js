import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Image, Save, FileText } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
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
function BlogCreateEdit({ post }) {
  const { data, setData, post: store, put, processing, errors } = useForm({
    title: post?.title || "",
    content: post?.content || "",
    category: post?.category || "General",
    image: null,
    is_published: post?.is_published || false,
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
    meta_keywords: post?.meta_keywords || "",
    og_image: null,
    canonical_url: post?.canonical_url || ""
  });
  const [preview, setPreview] = useState(post?.image_path ? `/storage/${post.image_path}` : null);
  const [ogPreview, setOgPreview] = useState(post?.og_image ? `/storage/${post.og_image}` : null);
  const submit = (e) => {
    e.preventDefault();
    if (post) {
      router.post(route("admin.blog.update", post.id), { ...data, _method: "put" });
    } else {
      store(route("admin.blog.store"));
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setData("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleOgImageChange = (e) => {
    const file = e.target.files[0];
    setData("og_image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOgPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500", children: /* @__PURE__ */ jsx(FileText, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: post ? "Edit_Blog" : "New_Blog" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Content Editor" })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: post ? "Edit Post" : "New Post" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto relative z-10", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Title" }),
                  /* @__PURE__ */ jsx(TextInput, { value: data.title, onChange: (e) => setData("title", e.target.value), className: "bg-[var(--bg-surface)]", placeholder: "Enter title..." }),
                  errors.title && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.title })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Content" }),
                  /* @__PURE__ */ jsx(
                    TiptapEditor,
                    {
                      content: data.content,
                      onChange: (value) => setData("content", value)
                    }
                  ),
                  errors.content && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.content })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Status" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                      /* @__PURE__ */ jsx("input", { type: "radio", name: "status", checked: !data.is_published, onChange: () => setData("is_published", false), className: "text-purple-500 focus:ring-purple-500 bg-[var(--bg-elevated)]" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase", children: "Draft" })
                    ] }),
                    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                      /* @__PURE__ */ jsx("input", { type: "radio", name: "status", checked: data.is_published, onChange: () => setData("is_published", true), className: "text-purple-500 focus:ring-purple-500 bg-[var(--bg-elevated)]" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase", children: "Published" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Category" }),
                  /* @__PURE__ */ jsxs("select", { value: data.category, onChange: (e) => setData("category", e.target.value), className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-bold uppercase focus:border-purple-500 outline-none text-[var(--text-main)]", children: [
                    /* @__PURE__ */ jsx("option", { value: "General", children: "General" }),
                    /* @__PURE__ */ jsx("option", { value: "Tutorial", children: "Tutorial" }),
                    /* @__PURE__ */ jsx("option", { value: "Update", children: "Update" }),
                    /* @__PURE__ */ jsx("option", { value: "News", children: "News" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Cover Image" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative aspect-video bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--border)] rounded-xl flex items-center justify-center overflow-hidden hover:border-purple-500/50 transition-colors group cursor-pointer", children: [
                    /* @__PURE__ */ jsx("input", { type: "file", onChange: handleImageChange, className: "absolute inset-0 opacity-0 cursor-pointer z-10" }),
                    preview ? /* @__PURE__ */ jsx("img", { src: preview, alt: "Preview", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-[var(--text-muted)] group-hover:text-purple-500", children: [
                      /* @__PURE__ */ jsx(Image, { size: 24 }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase mt-2", children: "Upload" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)] space-y-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Advanced_SEO" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Meta Title" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.meta_title, onChange: (e) => setData("meta_title", e.target.value), className: "bg-[var(--bg-elevated)]", placeholder: "SEO Title..." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Meta Description" }),
                    /* @__PURE__ */ jsx("textarea", { value: data.meta_description, onChange: (e) => setData("meta_description", e.target.value), className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-3 text-xs focus:border-purple-500 outline-none text-[var(--text-main)] h-20 resize-none", placeholder: "SEO Description..." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Keywords" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.meta_keywords, onChange: (e) => setData("meta_keywords", e.target.value), className: "bg-[var(--bg-elevated)]", placeholder: "comma, separated, tags" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "Canonical URL" }),
                    /* @__PURE__ */ jsx(TextInput, { value: data.canonical_url, onChange: (e) => setData("canonical_url", e.target.value), className: "bg-[var(--bg-elevated)]", placeholder: "https://..." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(InputLabel, { value: "OG Image (Social)" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative aspect-[1.91/1] bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--border)] rounded-xl flex items-center justify-center overflow-hidden hover:border-purple-500/50 transition-colors group cursor-pointer", children: [
                      /* @__PURE__ */ jsx("input", { type: "file", onChange: handleOgImageChange, className: "absolute inset-0 opacity-0 cursor-pointer z-10" }),
                      ogPreview ? /* @__PURE__ */ jsx("img", { src: ogPreview, alt: "OG Preview", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-[var(--text-muted)] group-hover:text-purple-500", children: [
                        /* @__PURE__ */ jsx(Image, { size: 24 }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase mt-2", children: "Upload Social Card" })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(PrimaryButton, { className: "w-full justify-center py-3 bg-purple-500 hover:bg-purple-600 border-purple-500", disabled: processing, children: [
                  /* @__PURE__ */ jsx(Save, { size: 16, className: "mr-2" }),
                  " Save_Blog"
                ] })
              ] }) })
            ] }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  BlogCreateEdit as default
};
