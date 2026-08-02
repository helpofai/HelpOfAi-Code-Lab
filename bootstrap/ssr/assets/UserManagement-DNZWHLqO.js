import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout, U as UserLevelBadge } from "./AuthenticatedLayout-BjuxLsIX.js";
import { usePage, Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronDown, ShieldAlert, ShieldCheck, FileImage, Edit, Zap, Crown, Unlock, Lock, Trash2, UserPlus, X, Users, Search, Plus } from "lucide-react";
import { A as AnimatedGrid } from "./AnimatedGrid-Ck89KbQh.js";
import { T as TextInput } from "./TextInput-DN069oHs.js";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import { u as useToast } from "./ToastProvider-DwHz5v_B.js";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "@headlessui/react";
function UserManagement() {
  const { auth } = usePage().props;
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [identityModalUser, setIdentityModalUser] = useState(null);
  const [levelModalUser, setLevelModalUser] = useState(null);
  const [newLevel, setNewLevel] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map((u) => u.id === id ? { ...u, role: newRole } : u));
    } catch (e) {
      toast.error("Failed to update clearance.");
    } finally {
      setUpdatingId(null);
    }
  };
  const handleToggleBlock = async (id) => {
    setUpdatingId(id);
    try {
      await axios.post(`/api/admin/users/${id}/block`);
      setUsers(users.map((u) => u.id === id ? { ...u, is_blocked: !u.is_blocked } : u));
    } catch (e) {
      toast.error("Blocking protocol failed.");
    } finally {
      setUpdatingId(null);
    }
  };
  const handleTogglePro = async (id) => {
    setUpdatingId(id);
    try {
      const res = await axios.post(`/api/admin/users/${id}/toggle-pro`);
      const user = users.find((u) => u.id === id);
      const isPro = user.role === "paid-user";
      setUsers(users.map((u) => u.id === id ? { ...u, role: isPro ? "user" : "paid-user" } : u));
    } catch (e) {
      toast.error("Pro status toggle failed.");
    } finally {
      setUpdatingId(null);
    }
  };
  const handleDeleteUser = async (id) => {
    if (!confirm("EXTERMINATE NODE: Permanent removal. Continue?")) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (e) {
      toast.error("Deletion protocol failed.");
    }
  };
  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (showModal === "create") {
        const res = await axios.post("/api/admin/users", formData);
        setUsers([res.data, ...users]);
      } else {
        const res = await axios.put(`/api/admin/users/${editingUser.id}`, formData);
        setUsers(users.map((u) => u.id === editingUser.id ? res.data : u));
      }
      setShowModal(null);
      setFormData({ name: "", email: "", password: "", role: "user" });
    } catch (e2) {
      toast.error("Protocol error: Check unique constraints.");
    }
  };
  const handleVerifyIdentity = async (status, reason = "") => {
    try {
      await axios.post(`/api/admin/users/${identityModalUser.id}/verify-identity`, { status, reason });
      setUsers(users.map((u) => u.id === identityModalUser.id ? { ...u, identity_status: status, identity_rejected_reason: status === "rejected" ? reason : null } : u));
      setIdentityModalUser(null);
      toast.success(`Identity marked as ${status}.`);
    } catch (e) {
      toast.error("Failed to update identity status.");
    }
  };
  const handleUpdateLevel = async () => {
    try {
      const res = await axios.post(`/api/admin/users/${levelModalUser.id}/update-level`, { level: newLevel });
      setUsers(users.map((u) => u.id === levelModalUser.id ? { ...u, level: res.data.user.level } : u));
      setLevelModalUser(null);
      toast.success("User level updated successfully.");
    } catch (e) {
      toast.error("Failed to update user level.");
    }
  };
  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );
  const getRoleStyles = (role) => {
    switch (role) {
      case "admin":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      case "paid-user":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "member":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      default:
        return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-rose-500/10 border border-rose-400/30 rounded-lg", children: /* @__PURE__ */ jsx(Users, { className: "text-rose-400", size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-[var(--text-main)] tracking-tighter uppercase leading-tight italic", children: "User_Matrix" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[8px] text-rose-500 uppercase tracking-[0.4em] font-bold", children: [
                "Total Active Nodes: ",
                users.length
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative hidden md:block", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]", size: 14 }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Identify_Node...",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:border-rose-500/50 focus:ring-0 w-64 transition-all text-[var(--text-main)] placeholder-[var(--text-muted)]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setFormData({ name: "", email: "", password: "", role: "user" });
                  setShowModal("create");
                },
                className: "flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-xl",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "mr-2", size: 14, strokeWidth: 3 }),
                  " Create_Node"
                ]
              }
            )
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "User Management" }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: [
            /* @__PURE__ */ jsx(AnimatedGrid, {}),
            /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto relative z-10", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: isLoading && !users.length ? /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex flex-col items-center justify-center py-48 space-y-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] animate-pulse", children: "Syncing_User_Database..." })
            ] }) : /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-[var(--bg-surface)] backdrop-blur-3xl border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto text-left", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-[var(--border)] bg-[var(--bg-elevated)]", children: [
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: "Node_Ident" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: "Clearance" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: "Level" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]", children: "Status" }),
                /* @__PURE__ */ jsx("th", { className: "px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] text-right", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[var(--border)]", children: filteredUsers.map((user) => /* @__PURE__ */ jsxs(motion.tr, { layout: true, className: "group hover:bg-[var(--bg-elevated)] transition-colors", children: [
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxs("span", { className: `text-sm font-black uppercase tracking-tight transition-colors flex items-center gap-2 ${user.is_blocked ? "text-rose-500 line-through opacity-50" : "text-[var(--text-main)] group-hover:text-cyan-500"}`, children: [
                    user.name,
                    user.identity_status === "verified" && /* @__PURE__ */ jsx(BadgeCheck, { className: "text-emerald-500", size: 14, title: "Verified Identity" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-[var(--text-muted)] lowercase", children: user.email })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxs("div", { className: "relative inline-block w-40", children: [
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: user.role,
                      onChange: (e) => handleRoleChange(user.id, e.target.value),
                      disabled: updatingId === user.id,
                      className: `w-full appearance-none px-4 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest focus:ring-0 focus:border-[var(--text-main)] transition-all cursor-pointer ${getRoleStyles(user.role)}`,
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "user", children: "User" }),
                        /* @__PURE__ */ jsx("option", { value: "member", children: "Member" }),
                        /* @__PURE__ */ jsx("option", { value: "paid-user", children: "Paid-User" }),
                        /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(ChevronDown, { size: 12, className: "absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-left", children: /* @__PURE__ */ jsx(UserLevelBadge, { level: user.level, size: "md" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-left", children: /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${user.is_blocked ? "text-rose-500 border-rose-500/20 bg-rose-500/5" : "text-green-400 border-green-500/20 bg-green-500/5"}`, children: [
                  user.is_blocked ? /* @__PURE__ */ jsx(ShieldAlert, { size: 10 }) : /* @__PURE__ */ jsx(ShieldCheck, { size: 10 }),
                  /* @__PURE__ */ jsx("span", { children: user.is_blocked ? "Isolated" : "Optimal" })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-8 py-6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all", children: [
                  user.identity_status === "pending" && /* @__PURE__ */ jsx("button", { onClick: () => setIdentityModalUser(user), className: "p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all", title: "Review Identity Docs", children: /* @__PURE__ */ jsx(FileImage, { size: 16 }) }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        setEditingUser(user);
                        setFormData({ name: user.name, email: user.email, role: user.role });
                        setShowModal("edit");
                      },
                      className: "p-2.5 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-xl hover:bg-cyan-500 hover:text-white transition-all",
                      title: "Edit Node",
                      children: /* @__PURE__ */ jsx(Edit, { size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        setLevelModalUser(user);
                        setNewLevel(user.level || 1);
                      },
                      className: "p-2.5 bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20 rounded-xl hover:bg-fuchsia-500 hover:text-white transition-all",
                      title: "Adjust Level",
                      children: /* @__PURE__ */ jsx(Zap, { size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleTogglePro(user.id),
                      disabled: user.role === "admin" || updatingId === user.id,
                      className: `p-2.5 border rounded-xl transition-all ${user.role === "paid-user" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-black" : "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-amber-500/20 hover:text-amber-500"}`,
                      title: user.role === "paid-user" ? "Revoke Pro" : "Grant Pro",
                      children: /* @__PURE__ */ jsx(Crown, { size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleToggleBlock(user.id),
                      disabled: user.id === auth.user.id,
                      className: `p-2.5 border rounded-xl transition-all ${user.is_blocked ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white" : "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white"}`,
                      title: user.is_blocked ? "Unblock" : "Block",
                      children: user.is_blocked ? /* @__PURE__ */ jsx(Unlock, { size: 16 }) : /* @__PURE__ */ jsx(Lock, { size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleDeleteUser(user.id),
                      disabled: user.id === auth.user.id,
                      className: "p-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all",
                      title: "Delete Node",
                      children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
                    }
                  )
                ] }) })
              ] }, user.id)) })
            ] }) }) }) }) })
          ] }),
          /* @__PURE__ */ jsx(AnimatePresence, { children: showModal && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-6", children: [
            /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setShowModal(null), className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }),
            /* @__PURE__ */ jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, className: "relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-lg rounded-[3rem] p-12 shadow-2xl overflow-hidden text-left text-[var(--text-main)]", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-10 text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30", children: showModal === "create" ? /* @__PURE__ */ jsx(UserPlus, { className: "text-cyan-500", size: 24 }) : /* @__PURE__ */ jsx(Edit, { className: "text-cyan-500", size: 24 }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-black uppercase tracking-widest text-[var(--text-main)]", children: showModal === "create" ? "Init_New_Node" : "Re_Config_Node" })
              ] }),
              /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveUser, className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Node_Alias" }),
                  /* @__PURE__ */ jsx(TextInput, { value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "IDENT_NAME...", required: true })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Neural_Address" }),
                  /* @__PURE__ */ jsx(TextInput, { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "IDENT_EMAIL...", required: true })
                ] }),
                showModal === "create" && /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Access_Cipher" }),
                  /* @__PURE__ */ jsx(TextInput, { type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), placeholder: "SECURE_PASSWORD...", required: true })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Clearance_Level" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: formData.role,
                      onChange: (e) => setFormData({ ...formData, role: e.target.value }),
                      className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] font-mono text-xs rounded-xl px-6 py-4 outline-none focus:border-cyan-500/50 transition-all uppercase tracking-widest",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "user", children: "User" }),
                        /* @__PURE__ */ jsx("option", { value: "member", children: "Member" }),
                        /* @__PURE__ */ jsx("option", { value: "paid-user", children: "Paid-User" }),
                        /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "pt-6 flex space-x-4", children: [
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowModal(null), className: "flex-1 py-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all", children: "Cancel_Abort" }),
                  /* @__PURE__ */ jsx(PrimaryButton, { className: "flex-1 py-4", children: "Execute_Changes" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => setShowModal(null), className: "absolute top-10 right-10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all", children: /* @__PURE__ */ jsx(X, { size: 24 }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(AnimatePresence, { children: identityModalUser && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-6", children: [
            /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIdentityModalUser(null), className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }),
            /* @__PURE__ */ jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, className: "relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl overflow-hidden text-left text-[var(--text-main)] max-h-[90vh] overflow-y-auto", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-8 text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30", children: /* @__PURE__ */ jsx(BadgeCheck, { className: "text-emerald-500", size: 24 }) }),
                /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black uppercase tracking-widest text-[var(--text-main)]", children: [
                  "Review Identity: ",
                  identityModalUser.name
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Selfie Match" }),
                  /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border)] h-64 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: identityModalUser.identity_selfie_path, alt: "Selfie", className: "max-w-full max-h-full object-contain rounded-lg" }) }),
                  /* @__PURE__ */ jsx("a", { href: identityModalUser.identity_selfie_path, target: "_blank", rel: "noreferrer", className: "text-xs text-emerald-500 hover:underline", children: "View Full Size" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]", children: "National ID Document" }),
                  /* @__PURE__ */ jsx("div", { className: "bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border)] h-64 flex items-center justify-center overflow-hidden", children: identityModalUser.identity_document_path?.endsWith(".pdf") ? /* @__PURE__ */ jsxs("a", { href: identityModalUser.identity_document_path, target: "_blank", rel: "noreferrer", className: "text-emerald-500 flex flex-col items-center gap-2", children: [
                    /* @__PURE__ */ jsx(FileImage, { size: 48 }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Open PDF Document" })
                  ] }) : /* @__PURE__ */ jsx("img", { src: identityModalUser.identity_document_path, alt: "Document", className: "max-w-full max-h-full object-contain rounded-lg" }) }),
                  /* @__PURE__ */ jsx("a", { href: identityModalUser.identity_document_path, target: "_blank", rel: "noreferrer", className: "text-xs text-emerald-500 hover:underline", children: "View Full Size" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border)] flex space-x-4", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                  const reason = prompt("Enter reason for rejection:");
                  if (reason !== null) handleVerifyIdentity("rejected", reason);
                }, className: "flex-1 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all", children: "Reject & Notify" }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleVerifyIdentity("verified"), className: "flex-1 py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all", children: "Approve Identity" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => setIdentityModalUser(null), className: "absolute top-10 right-10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all", children: /* @__PURE__ */ jsx(X, { size: 24 }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(AnimatePresence, { children: levelModalUser && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-6", children: [
            /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setLevelModalUser(null), className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }),
            /* @__PURE__ */ jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, className: "relative bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-sm rounded-[3rem] p-12 shadow-2xl overflow-hidden text-left text-[var(--text-main)]", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-8 text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/30", children: /* @__PURE__ */ jsx(Zap, { className: "text-fuchsia-500", size: 24 }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-black uppercase tracking-widest text-[var(--text-main)]", children: "Adjust Level" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4 mb-8", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--text-muted)] font-bold", children: [
                  "Manually override the level for ",
                  /* @__PURE__ */ jsx("span", { className: "text-[var(--text-main)]", children: levelModalUser.name }),
                  ". This will lock their level from automatic adjustments."
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)]", children: "Current" }),
                  /* @__PURE__ */ jsx(UserLevelBadge, { level: levelModalUser.level, size: "md" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "New Level (1-10)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: "1",
                      max: "10",
                      value: newLevel,
                      onChange: (e) => setNewLevel(parseInt(e.target.value) || 1),
                      className: "w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-3 text-lg font-black text-center text-fuchsia-500 focus:border-fuchsia-500 focus:ring-0 transition-all outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setLevelModalUser(null), className: "flex-1 py-4 bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-[var(--text-main)] transition-all", children: "Cancel" }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: handleUpdateLevel, className: "flex-1 py-4 bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all", children: "Update Level" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => setLevelModalUser(null), className: "absolute top-10 right-10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all", children: /* @__PURE__ */ jsx(X, { size: 24 }) })
            ] })
          ] }) })
        ]
      }
    )
  ] });
}
export {
  UserManagement as default
};
