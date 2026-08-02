import "react/jsx-runtime";
import { useContext, createContext } from "react";
const ToastContext = createContext(null);
function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
export {
  useToast as u
};
