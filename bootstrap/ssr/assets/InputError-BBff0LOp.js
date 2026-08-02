import { jsx } from "react/jsx-runtime";
function InputError({ message, className = "", ...props }) {
  return message ? /* @__PURE__ */ jsx(
    "p",
    {
      ...props,
      className: "text-[9px] font-black uppercase tracking-widest text-rose-400 " + className,
      children: message
    }
  ) : null;
}
export {
  InputError as I
};
