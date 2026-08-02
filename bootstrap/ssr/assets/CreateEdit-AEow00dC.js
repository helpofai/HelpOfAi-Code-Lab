import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head } from "@inertiajs/react";
import "react";
import { Save, Mail } from "lucide-react";
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
function EmailCreateEdit({ template }) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: template?.name || "",
    subject: template?.subject || "",
    content: template?.content || ""
  });
  const submit = (e) => {
    e.preventDefault();
    if (template) {
      put(route("admin.email.update", template.id));
    } else {
      post(route("admin.email.store"));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500", children: /* @__PURE__ */ jsx(Mail, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: template ? "Edit_Template" : "New_Template" }),
            /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Email Protocol" })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: template ? "Edit Template" : "New Template" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto relative z-10", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Template Name (Internal)" }),
                  /* @__PURE__ */ jsx(TextInput, { value: data.name, onChange: (e) => setData("name", e.target.value), className: "bg-[var(--bg-elevated)]", placeholder: "e.g. Welcome Email" }),
                  errors.name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Email Subject" }),
                  /* @__PURE__ */ jsx(TextInput, { value: data.subject, onChange: (e) => setData("subject", e.target.value), className: "bg-[var(--bg-elevated)]", placeholder: "e.g. Welcome to HOACodeLab" }),
                  errors.subject && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.subject })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Content" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-mono text-[var(--text-muted)]", children: [
                    "Variables: ",
                    "{{name}}",
                    ", ",
                    "{{email}}"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(TiptapEditor, { value: data.content, onChange: (val) => setData("content", val) }),
                errors.content && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs", children: errors.content })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-4 border-t border-[var(--border)]", children: /* @__PURE__ */ jsxs(PrimaryButton, { className: "bg-purple-500 hover:bg-purple-600 border-purple-500 px-8 py-3", disabled: processing, children: [
                /* @__PURE__ */ jsx(Save, { size: 16, className: "mr-2" }),
                " Save_Template"
              ] }) })
            ] }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  EmailCreateEdit as default
};
