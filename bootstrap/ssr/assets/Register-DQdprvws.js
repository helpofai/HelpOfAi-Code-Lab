import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-BBff0LOp.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import { T as TextInput } from "./TextInput-DN069oHs.js";
import { G as GuestLayout } from "./GuestLayout-kM2zbqWZ.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import "react";
import "./ProBackground-D5SseK5s.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Register" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: "Name" }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx(User, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors", size: 16 }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "name",
              name: "name",
              value: data.name,
              className: "w-full pl-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm",
              autoComplete: "name",
              isFocused: true,
              onChange: (e) => setData("name", e.target.value),
              required: true,
              placeholder: "Full Name"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(InputError, { message: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: "Email Address" }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors", size: 16 }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "email",
              type: "email",
              name: "email",
              value: data.email,
              className: "w-full pl-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm",
              autoComplete: "username",
              onChange: (e) => setData("email", e.target.value),
              required: true,
              placeholder: "name@example.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(InputError, { message: errors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: "Password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors", size: 16 }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "password",
              type: "password",
              name: "password",
              value: data.password,
              className: "w-full pl-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm",
              autoComplete: "new-password",
              onChange: (e) => setData("password", e.target.value),
              required: true,
              placeholder: "••••••••••••"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(InputError, { message: errors.password })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password_confirmation", value: "Confirm Password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors", size: 16 }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "password_confirmation",
              type: "password",
              name: "password_confirmation",
              value: data.password_confirmation,
              className: "w-full pl-12 bg-[var(--bg-main)] border-[var(--border)] focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl py-3 font-mono text-sm",
              autoComplete: "new-password",
              onChange: (e) => setData("password_confirmation", e.target.value),
              required: true,
              placeholder: "••••••••••••"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(PrimaryButton, { className: "w-full justify-center py-4 text-[10px] tracking-[0.2em] relative overflow-hidden group", disabled: processing, children: /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-3", children: [
        processing && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin", size: 14 }),
        "Register ",
        /* @__PURE__ */ jsx(ArrowRight, { size: 14, className: "group-hover:translate-x-1 transition-transform" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "text-center pt-4 border-t border-[var(--border)]", children: /* @__PURE__ */ jsxs(Link, { href: route("login"), className: "text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors", children: [
        "Already have an account? ",
        /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: "Log In" })
      ] }) })
    ] })
  ] });
}
export {
  Register as default
};
