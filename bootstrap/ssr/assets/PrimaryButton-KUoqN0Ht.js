import { jsxs, jsx } from "react/jsx-runtime";
function PrimaryButton({
  className = "",
  disabled,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ...props,
      className: `relative inline-flex items-center justify-center px-10 py-4 bg-cyan-500 text-black dark:text-black border border-transparent rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] active:scale-95 disabled:opacity-50 overflow-hidden group ${disabled && "opacity-25"} ` + className,
      disabled,
      children: [
        /* @__PURE__ */ jsx("span", { className: "relative z-10 flex items-center", children }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" })
      ]
    }
  );
}
export {
  PrimaryButton as P
};
