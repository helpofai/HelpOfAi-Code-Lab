import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Loader2, Paperclip, X, Send, MessageSquare, LifeBuoy, Plus } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { T as TextInput } from "./TextInput-DN069oHs.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import axios from "axios";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function Support({ auth, tickets: initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const scrollRef = useRef(null);
  const { data, setData, post, processing, reset, errors } = useForm({
    subject: "",
    message: "",
    priority: "medium",
    attachment: null
  });
  const openTicket = async (ticket) => {
    setActiveTicket(ticket);
    setIsLoadingMessages(true);
    try {
      const res = await axios.get(route("support.show", ticket.id));
      setMessages(res.data.messages);
    } catch (e) {
      console.error("Link failure");
    } finally {
      setIsLoadingMessages(false);
    }
  };
  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() && !attachment) return;
    const formData = new FormData();
    formData.append("message", replyText);
    if (attachment) {
      formData.append("attachment", attachment);
    }
    try {
      const res = await axios.post(route("support.reply", activeTicket.id), formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessages([...messages, res.data]);
      setReplyText("");
      setAttachment(null);
    } catch (e2) {
      console.error("Transmission failed");
    }
  };
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, activeTicket]);
  const submitCreate = (e) => {
    e.preventDefault();
    post(route("support.store"), {
      onSuccess: () => {
        setShowCreateModal(false);
        reset();
        window.location.reload();
      }
    });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-rose-500 border-rose-500/30 bg-rose-500/10";
      case "in_progress":
        return "text-amber-500 border-amber-500/30 bg-amber-500/10";
      case "closed":
        return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
      default:
        return "text-slate-500 border-slate-500/30 bg-slate-500/10";
    }
  };
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "text-rose-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-emerald-500";
      default:
        return "text-cyan-500";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-500", children: /* @__PURE__ */ jsx(LifeBuoy, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "Support_Uplink" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Direct Line to Core" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setShowCreateModal(true), className: "flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-xl", children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2", size: 14, strokeWidth: 3 }),
            " New_Ticket"
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Support" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full flex overflow-hidden h-[calc(100vh-80px)]", children: [
            /* @__PURE__ */ jsx("div", { className: `w-full lg:w-1/3 border-r border-[var(--border)] overflow-y-auto p-6 ${activeTicket ? "hidden lg:block" : "block"}`, children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: tickets.map((ticket) => /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => openTicket(ticket),
                className: `p-5 rounded-2xl border cursor-pointer transition-all ${activeTicket?.id === ticket.id ? "bg-[var(--bg-elevated)] border-cyan-500/50 shadow-lg" : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-cyan-500/30"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                    /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-widest ${getStatusColor(ticket.status)}`, children: ticket.status.replace("_", " ") }),
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-mono text-[var(--text-muted)]", children: new Date(ticket.created_at).toLocaleDateString() })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold uppercase truncate", children: ticket.subject }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end mt-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--text-muted)] truncate max-w-[70%]", children: ticket.messages[0]?.message || "No messages" }),
                    /* @__PURE__ */ jsx("span", { className: `text-[8px] font-black uppercase tracking-widest ${getPriorityStyles(ticket.priority)}`, children: ticket.priority })
                  ] })
                ]
              },
              ticket.id
            )) }) }),
            /* @__PURE__ */ jsx("div", { className: `w-full lg:w-2/3 bg-[var(--bg-main)] flex flex-col ${!activeTicket ? "hidden lg:flex" : "flex"}`, children: activeTicket ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--bg-surface)] shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setActiveTicket(null), className: "lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-main)]", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 20 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-wide", children: activeTicket.subject }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-[var(--text-muted)]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "uppercase tracking-widest", children: [
                      "ID: #",
                      activeTicket.id
                    ] }),
                    /* @__PURE__ */ jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsxs("span", { className: `uppercase tracking-widest font-bold ${getPriorityStyles(activeTicket.priority)}`, children: [
                      activeTicket.priority,
                      " Priority"
                    ] })
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", ref: scrollRef, children: isLoadingMessages ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-cyan-500" }) }) : messages.map((msg) => {
                const isMe = msg.user_id === auth.user.id;
                return /* @__PURE__ */ jsx("div", { className: `flex ${isMe ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxs("div", { className: `flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`, children: [
                  /* @__PURE__ */ jsxs("div", { className: `px-5 py-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm relative ${isMe ? "bg-cyan-600 text-white rounded-tr-none" : "bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] rounded-tl-none"}`, children: [
                    msg.attachment_path && /* @__PURE__ */ jsx("div", { className: "mb-3 rounded-lg overflow-hidden border border-white/10", children: /* @__PURE__ */ jsx("a", { href: `/storage/${msg.attachment_path}`, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx("img", { src: `/storage/${msg.attachment_path}`, alt: "Attachment", className: "max-w-full h-auto max-h-60 object-cover hover:scale-105 transition-transform duration-300" }) }) }),
                    msg.message
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[9px] mt-1.5 font-mono uppercase tracking-widest opacity-40 text-[var(--text-muted)]", children: [
                    isMe ? "You" : "Admin",
                    " • ",
                    new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  ] })
                ] }) }, msg.id);
              }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-[var(--border)] bg-[var(--bg-surface)]", children: [
                attachment && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2 p-2 bg-[var(--bg-elevated)] rounded-lg text-xs w-fit", children: [
                  /* @__PURE__ */ jsx(Paperclip, { size: 12 }),
                  /* @__PURE__ */ jsx("span", { className: "truncate max-w-[200px]", children: attachment.name }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setAttachment(null), className: "text-rose-500 hover:text-rose-400", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
                ] }),
                /* @__PURE__ */ jsxs("form", { onSubmit: sendReply, className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxs("label", { className: "p-3 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-xl hover:text-cyan-500 cursor-pointer transition-all", children: [
                    /* @__PURE__ */ jsx(Paperclip, { size: 18 }),
                    /* @__PURE__ */ jsx("input", { type: "file", className: "hidden", onChange: (e) => setAttachment(e.target.files[0]), accept: "image/*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: replyText,
                      onChange: (e) => setReplyText(e.target.value),
                      placeholder: "Type your response...",
                      className: "flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-0 transition-all outline-none",
                      disabled: activeTicket.status === "closed"
                    }
                  ),
                  /* @__PURE__ */ jsx("button", { disabled: activeTicket.status === "closed", className: "p-3 bg-cyan-500 text-white rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all", children: /* @__PURE__ */ jsx(Send, { size: 18 }) })
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] opacity-30", children: [
              /* @__PURE__ */ jsx(MessageSquare, { size: 64, className: "mb-4" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-[0.5em]", children: "Select_Frequency" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx(AnimatePresence, { children: showCreateModal && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-6", children: [
            /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setShowCreateModal(false), className: "absolute inset-0 bg-black/80 backdrop-blur-sm" }),
            /* @__PURE__ */ jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden text-left", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-widest text-[var(--text-main)]", children: "Transmit_Issue" }),
                /* @__PURE__ */ jsx("button", { onClick: () => setShowCreateModal(false), className: "text-[var(--text-muted)] hover:text-[var(--text-main)]", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
              ] }),
              /* @__PURE__ */ jsxs("form", { onSubmit: submitCreate, className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Subject" }),
                  /* @__PURE__ */ jsx(TextInput, { value: data.subject, onChange: (e) => setData("subject", e.target.value), className: "bg-[var(--bg-elevated)]" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Priority" }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: ["low", "medium", "high"].map((p) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setData("priority", p), className: `py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest ${data.priority === p ? "bg-cyan-500 text-white border-cyan-500" : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)]"}`, children: p }, p)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Message" }),
                  /* @__PURE__ */ jsx("textarea", { value: data.message, onChange: (e) => setData("message", e.target.value), className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] rounded-xl p-4 min-h-[120px] focus:border-cyan-500 focus:ring-0 outline-none" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Attachment (Optional)" }),
                  /* @__PURE__ */ jsx("input", { type: "file", onChange: (e) => setData("attachment", e.target.files[0]), className: "w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[var(--bg-elevated)] file:text-[var(--text-main)] hover:file:bg-cyan-500 hover:file:text-white transition-all" })
                ] }),
                /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, className: "w-full justify-center py-4", children: "Transmit" })
              ] })
            ] })
          ] }) })
        ]
      }
    )
  ] });
}
export {
  Support as default
};
