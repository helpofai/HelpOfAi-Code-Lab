import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
const TextInput = forwardRef(function TextInput2({ type = "text", className = "", isFocused = false, ...props }, ref) {
  const localRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus()
  }));
  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full group", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ...props,
        type,
        className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] font-mono text-sm rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 focus:ring-0 focus:bg-[var(--bg-main)] transition-all duration-500 placeholder-slate-500/50 " + className,
        ref: localRef
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 group-focus-within:w-[80%] transition-all duration-700 blur-[1px] shadow-[0_0_10px_#22d3ee]" })
  ] });
});
export {
  TextInput as T
};
