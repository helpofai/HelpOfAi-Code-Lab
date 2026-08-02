import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { ShieldCheck, Loader2, Info, ShieldAlert, FileImage, FileText, Upload } from "lucide-react";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import axios from "axios";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
function IdentityVerificationForm({ className = "" }) {
  const user = usePage().props.auth.user;
  const toast = useToast();
  const [status, setStatus] = useState(user.identity_status || "unverified");
  const [rejectedReason, setRejectedReason] = useState(user.identity_rejected_reason);
  const [selfieFile, setSelfieFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const selfieInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "selfie") {
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    } else {
      setDocumentFile(file);
      if (file.type.startsWith("image/")) {
        setDocumentPreview(URL.createObjectURL(file));
      } else {
        setDocumentPreview(null);
      }
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!selfieFile || !documentFile) {
      toast.error("Both selfie and national ID document are required.");
      return;
    }
    const formData = new FormData();
    formData.append("selfie", selfieFile);
    formData.append("document", documentFile);
    setIsUploading(true);
    try {
      const res = await axios.post("/api/profile/identity", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStatus("pending");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload documents.");
    } finally {
      setIsUploading(false);
    }
  };
  if (status === "verified") {
    return /* @__PURE__ */ jsxs("section", { className, children: [
      /* @__PURE__ */ jsxs("header", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "text-emerald-500" }),
          " Identity Verified"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--text-muted)]", children: "Your identity has been securely verified by the administration." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4 text-emerald-500", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { size: 24, className: "shrink-0 mt-1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold uppercase tracking-widest", children: "Verification Complete" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs mt-1 text-emerald-500/80", children: "Your profile now displays a verified badge. You have access to all high-clearance sectors of the platform." })
        ] })
      ] })
    ] });
  }
  if (status === "pending") {
    return /* @__PURE__ */ jsxs("section", { className, children: [
      /* @__PURE__ */ jsxs("header", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "text-amber-500 animate-spin" }),
          " Verification Pending"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--text-muted)]", children: "Your documents have been submitted and are currently being reviewed." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4 text-amber-500", children: [
        /* @__PURE__ */ jsx(Info, { size: 24, className: "shrink-0 mt-1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold uppercase tracking-widest", children: "Review in Progress" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs mt-1 text-amber-500/80", children: "Administration is analyzing your identity documents. This process usually takes up to 24-48 hours. You will be notified upon completion." })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className, children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "text-cyan-500" }),
        " Advance Identity Verification"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--text-muted)]", children: "Verify your identity to get the verified badge and secure your account." })
    ] }),
    status === "rejected" && /* @__PURE__ */ jsxs("div", { className: "mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-500 mb-6", children: [
      /* @__PURE__ */ jsx(ShieldAlert, { size: 20, className: "shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-widest", children: "Verification Rejected" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs mt-1 text-rose-500/80", children: [
          "Reason: ",
          rejectedReason || "Documents were invalid or unclear."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs mt-1 text-rose-500/80", children: "Please upload new, clear documents." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-6 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "1. Selfie / Live Photo" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => selfieInputRef.current?.click(),
              className: "relative group cursor-pointer h-48 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-cyan-500/50 bg-[var(--bg-elevated)] flex flex-col items-center justify-center overflow-hidden transition-all",
              children: selfiePreview ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("img", { src: selfiePreview, alt: "Selfie preview", className: "w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-md", children: "Change Photo" }) })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(FileImage, { size: 24 }) }),
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]", children: "Upload Selfie" }),
                /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-[var(--text-muted)] mt-1", children: "Clear face, good lighting. JPG/PNG" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", ref: selfieInputRef, className: "hidden", onChange: (e) => handleFileChange(e, "selfie") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "2. National ID Document" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => documentInputRef.current?.click(),
              className: "relative group cursor-pointer h-48 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-cyan-500/50 bg-[var(--bg-elevated)] flex flex-col items-center justify-center overflow-hidden transition-all",
              children: documentPreview ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("img", { src: documentPreview, alt: "Document preview", className: "w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-md", children: "Change Document" }) })
              ] }) : documentFile ? /* @__PURE__ */ jsxs("div", { className: "text-center p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FileText, { size: 24 }) }),
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold uppercase tracking-widest text-cyan-500", children: documentFile.name })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Upload, { size: 24 }) }),
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]", children: "Upload ID Card" }),
                /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-[var(--text-muted)] mt-1", children: "Front and back (if applicable). JPG/PNG/PDF" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*,.pdf", ref: documentInputRef, className: "hidden", onChange: (e) => handleFileChange(e, "document") })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsxs(PrimaryButton, { disabled: isUploading || !selfieFile || !documentFile, className: "py-4 px-8 group relative overflow-hidden", children: [
        isUploading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mr-2", size: 16 }),
          " Transmitting_Data..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "Submit_For_Verification ",
          /* @__PURE__ */ jsx(ShieldAlert, { className: "ml-2 group-hover:rotate-12 transition-transform", size: 16 })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" })
      ] }) })
    ] })
  ] });
}
export {
  IdentityVerificationForm as default
};
