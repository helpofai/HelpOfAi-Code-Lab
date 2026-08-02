import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { UserPlus, Shield, Settings, Users, LogOut, Plus } from "lucide-react";
import { P as ProBackground } from "./ProBackground-D5SseK5s.js";
import { T as TextInput } from "./TextInput-DN069oHs.js";
import { P as PrimaryButton } from "./PrimaryButton-KUoqN0Ht.js";
import { I as InputLabel } from "./InputLabel-CmSwOA3P.js";
import { M as Modal } from "./Modal-DoHBVxpV.js";
import "framer-motion";
import "./ThemeSwitcher-Bh1r3iWC.js";
import "./useThemeStore-alQMI_Ky.js";
import "zustand";
import "zustand/middleware";
import "./NotificationDropdown-DwAPkSZZ.js";
import "axios";
import "@headlessui/react";
function TeamIndex({ ownedTeams, memberTeams, invitations }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data, setData, post, processing, reset, errors } = useForm({
    name: ""
  });
  const createTeam = (e) => {
    e.preventDefault();
    post(route("teams.store"), {
      onSuccess: () => {
        setShowCreateModal(false);
        reset();
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans selection:bg-purple-500/30", children: [
    /* @__PURE__ */ jsx(ProBackground, {}),
    /* @__PURE__ */ jsxs(
      AuthenticatedLayout,
      {
        header: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500", children: /* @__PURE__ */ jsx(Users, { size: 20 }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: "Team_Command" }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Collaborative Units" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowCreateModal(true),
              className: "flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "mr-2", size: 14, strokeWidth: 3 }),
                " Create_Unit"
              ]
            }
          )
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: "Teams" }),
          /* @__PURE__ */ jsx("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-12 relative z-10", children: [
            invitations.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-purple-500 mb-6 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(UserPlus, { size: 14 }),
                " Pending_Handshakes"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: invitations.map((invitation) => /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-purple-500/50" }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg", children: invitation.team.name }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--text-muted)]", children: [
                      "Invited by: ",
                      invitation.team.owner.name
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-[9px] font-black uppercase tracking-widest border border-purple-500/20", children: invitation.role })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-4", children: [
                  /* @__PURE__ */ jsx(Link, { as: "button", method: "post", href: route("invitations.accept", invitation.id), className: "flex-1 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors", children: "Accept" }),
                  /* @__PURE__ */ jsx(Link, { as: "button", method: "delete", href: route("invitations.destroy", invitation.id), className: "flex-1 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-colors", children: "Reject" })
                ] })
              ] }, invitation.id)) })
            ] }),
            /* @__PURE__ */ jsxs("section", { children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-6 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Shield, { size: 14 }),
                " Command_Units (Owned)"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: ownedTeams.map((team) => /* @__PURE__ */ jsxs(Link, { href: route("teams.show", team.id), className: "group block bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg group-hover:text-purple-500 transition-colors", children: team.name }),
                  /* @__PURE__ */ jsx(Settings, { size: 16, className: "text-[var(--text-muted)] group-hover:text-purple-500 transition-colors" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-[var(--text-muted)]", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Users, { size: 12 }),
                    " ",
                    team.users_count,
                    " Members"
                  ] }),
                  team.personal_team && /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest bg-[var(--bg-elevated)] px-2 py-0.5 rounded border border-[var(--border)]", children: "Personal" })
                ] })
              ] }, team.id)) })
            ] }),
            memberTeams.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-6 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(LogOut, { size: 14 }),
                " Assigned_Units (Member)"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: memberTeams.map((team) => /* @__PURE__ */ jsxs(Link, { href: route("teams.show", team.id), className: "group block bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-2xl transition-all duration-300", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg group-hover:text-cyan-500 transition-colors", children: team.name }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-500 px-2 py-1 rounded border border-cyan-500/20", children: team.pivot.role })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 text-xs text-[var(--text-muted)]", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Shield, { size: 12 }),
                  " Owner: ",
                  team.owner.name
                ] }) })
              ] }, team.id)) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Modal, { show: showCreateModal, onClose: () => setShowCreateModal(false), children: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-[var(--text-main)] mb-4", children: "Initialize New Unit" }),
            /* @__PURE__ */ jsxs("form", { onSubmit: createTeam, children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Unit Name" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    className: "w-full bg-[var(--bg-elevated)]",
                    placeholder: "e.g. Design Ops"
                  }
                ),
                errors.name && /* @__PURE__ */ jsx("div", { className: "text-rose-500 text-xs mt-1", children: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowCreateModal(false), className: "px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)]", children: "Cancel" }),
                /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, className: "bg-purple-500 hover:bg-purple-600 border-purple-500", children: "Initialize" })
              ] })
            ] })
          ] }) })
        ]
      }
    )
  ] });
}
export {
  TeamIndex as default
};
