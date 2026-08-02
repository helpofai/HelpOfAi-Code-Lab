import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import "@inertiajs/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.read_at).length);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3e4);
    return () => clearInterval(interval);
  }, []);
  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map((n) => n.id === id ? { ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
    }
  };
  const markAllRead = async () => {
    try {
      await axios.put("/api/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, read_at: (/* @__PURE__ */ new Date()).toISOString() })));
      setUnreadCount(0);
    } catch (e) {
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "relative p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors",
        children: [
          /* @__PURE__ */ jsx(Bell, { size: 20 }),
          unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[var(--bg-surface)]" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setIsOpen(false) }),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 10, scale: 0.95 },
          className: "absolute right-0 mt-2 w-80 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-elevated)]", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]", children: "Notifications" }),
              unreadCount > 0 && /* @__PURE__ */ jsx("button", { onClick: markAllRead, className: "text-[9px] font-bold text-cyan-500 hover:underline", children: "Mark_All_Read" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-h-80 overflow-y-auto", children: notifications.length > 0 ? notifications.map((notification) => /* @__PURE__ */ jsx("div", { className: `p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors ${!notification.read_at ? "bg-cyan-500/5" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--text-main)]", children: notification.data?.message || "New Notification" }),
                /* @__PURE__ */ jsx("p", { className: "text-[9px] text-[var(--text-muted)]", children: new Date(notification.created_at).toLocaleString() })
              ] }),
              !notification.read_at && /* @__PURE__ */ jsx("button", { onClick: () => markAsRead(notification.id), className: "text-cyan-500 hover:text-cyan-400", children: /* @__PURE__ */ jsx(Check, { size: 14 }) })
            ] }) }, notification.id)) : /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-[var(--text-muted)] text-xs", children: "No_New_Signals" }) })
          ]
        }
      )
    ] }) })
  ] });
}
export {
  NotificationDropdown as N
};
