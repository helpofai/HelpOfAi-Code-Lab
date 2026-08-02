import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { Head } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { User, ChevronLeft, Trash2, Loader2, Paperclip, X, Send, MessageSquare, LifeBuoy } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import axios from "axios";
import "framer-motion";
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const scrollRef = useRef(null);
  const openTicket = async (ticket) => {
    setActiveTicket(ticket);
    setIsLoadingMessages(true);
    try {
      const res = await axios.get(route("admin.support.show", ticket.id));
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
      const res = await axios.post(route("admin.support.reply", activeTicket.id), formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessages([...messages, res.data]);
      setReplyText("");
      setAttachment(null);
    } catch (e2) {
      console.error("Transmission failed");
    }
  };
  const updateStatus = async (newStatus) => {
    try {
      await axios.put(route("admin.support.status", activeTicket.id), { status: newStatus });
      setActiveTicket({ ...activeTicket, status: newStatus });
      setTickets(tickets.map((t) => t.id === activeTicket.id ? { ...t, status: newStatus } : t));
    } catch (e) {
    }
  };
  const deleteTicket = async () => {
    if (!confirm("Delete ticket?")) return;
    try {
      await axios.delete(route("admin.support.destroy", activeTicket.id));
      setTickets(tickets.filter((t) => t.id !== activeTicket.id));
      setActiveTicket(null);
    } catch (e) {
    }
  };
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, activeTicket]);
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = t.id.toString().includes(search) || t.user?.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
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
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-500", children: /* @__PURE__ */ jsx(LifeBuoy, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "Support_Center" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-cyan-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Admin Command" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest focus:border-cyan-500/50 outline-none w-48" }),
            /* @__PURE__ */ jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest focus:border-cyan-500/50 outline-none cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All" }),
              /* @__PURE__ */ jsx("option", { value: "open", children: "Open" }),
              /* @__PURE__ */ jsx("option", { value: "in_progress", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "closed", children: "Closed" })
            ] })
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Support Center" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full flex overflow-hidden h-[calc(100vh-80px)]", children: [
            /* @__PURE__ */ jsx("div", { className: `w-full lg:w-1/3 border-r border-[var(--border)] overflow-y-auto p-6 ${activeTicket ? "hidden lg:block" : "block"}`, children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredTickets.map((ticket) => /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => openTicket(ticket),
                className: `p-5 rounded-2xl border cursor-pointer transition-all ${activeTicket?.id === ticket.id ? "bg-[var(--bg-elevated)] border-cyan-500/50 shadow-lg" : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-cyan-500/30"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-widest ${getStatusColor(ticket.status)}`, children: ticket.status.replace("_", " ") }),
                      ticket.status === "open" && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-rose-500 rounded-full animate-pulse" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-mono text-[var(--text-muted)]", children: new Date(ticket.updated_at).toLocaleDateString() })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsx(User, { size: 10, className: "text-[var(--text-muted)]" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[var(--text-muted)] uppercase", children: ticket.user?.name })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold uppercase truncate", children: ticket.subject })
                ]
              },
              ticket.id
            )) }) }),
            /* @__PURE__ */ jsx("div", { className: `w-full lg:w-2/3 bg-[var(--bg-main)] flex flex-col ${!activeTicket ? "hidden lg:flex" : "flex"}`, children: activeTicket ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--bg-surface)] shrink-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setActiveTicket(null), className: "lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-main)]", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 20 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-wide", children: activeTicket.subject }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-[var(--text-muted)]", children: [
                      /* @__PURE__ */ jsxs("span", { className: "uppercase tracking-widest", children: [
                        "USER: ",
                        activeTicket.user?.name
                      ] }),
                      /* @__PURE__ */ jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsxs("span", { className: `uppercase tracking-widest ${activeTicket.priority === "high" ? "text-rose-500" : "text-cyan-500"}`, children: [
                        activeTicket.priority,
                        " Priority"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("select", { value: activeTicket.status, onChange: (e) => updateStatus(e.target.value), className: "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer", children: [
                    /* @__PURE__ */ jsx("option", { value: "open", children: "Open" }),
                    /* @__PURE__ */ jsx("option", { value: "in_progress", children: "Active" }),
                    /* @__PURE__ */ jsx("option", { value: "closed", children: "Closed" })
                  ] }),
                  /* @__PURE__ */ jsx("button", { onClick: deleteTicket, className: "p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", ref: scrollRef, children: isLoadingMessages ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-cyan-500" }) }) : messages.map((msg) => {
                const isMe = msg.user_id === auth.user.id;
                return /* @__PURE__ */ jsx("div", { className: `flex ${isMe ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxs("div", { className: `flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`, children: [
                  /* @__PURE__ */ jsxs("div", { className: `px-5 py-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm relative ${isMe ? "bg-cyan-600 text-white rounded-tr-none" : "bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] rounded-tl-none"}`, children: [
                    msg.attachment_path && /* @__PURE__ */ jsx("div", { className: "mb-3 rounded-lg overflow-hidden border border-white/10", children: /* @__PURE__ */ jsx("a", { href: `/storage/${msg.attachment_path}`, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx("img", { src: `/storage/${msg.attachment_path}`, alt: "Attachment", className: "max-w-full h-auto max-h-60 object-cover hover:scale-105 transition-transform duration-300" }) }) }),
                    msg.message
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[9px] mt-1.5 font-mono uppercase tracking-widest opacity-40 text-[var(--text-muted)]", children: [
                    isMe ? "Admin" : activeTicket.user?.name,
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
                  /* @__PURE__ */ jsx("input", { value: replyText, onChange: (e) => setReplyText(e.target.value), placeholder: "Type your response...", className: "flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-0 transition-all outline-none" }),
                  /* @__PURE__ */ jsx("button", { className: "p-3 bg-cyan-500 text-white rounded-xl hover:brightness-110 transition-all", children: /* @__PURE__ */ jsx(Send, { size: 18 }) })
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] opacity-30", children: [
              /* @__PURE__ */ jsx(MessageSquare, { size: 64, className: "mb-4" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-[0.5em]", children: "Select_Frequency" })
            ] }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  Support as default
};
