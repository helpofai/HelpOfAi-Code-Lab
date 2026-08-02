import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BjuxLsIX.js";
import { useForm, Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Shield, Trash2, Mail, Activity, X, Users, Edit2, UserPlus } from "lucide-react";
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
function TeamShow({ team, isOwner }) {
  const [showInviteModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { data: inviteData, setData: setInviteData, post: postInvite, processing: inviteProcessing, reset: inviteReset, errors: inviteErrors } = useForm({
    email: "",
    role: "member"
  });
  const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing, errors: editErrors } = useForm({
    name: team.name
  });
  const sendInvite = (e) => {
    e.preventDefault();
    postInvite(route("teams.members.store", team.id), {
      onSuccess: () => {
        setShowCreateModal(false);
        inviteReset();
      }
    });
  };
  const updateTeam = (e) => {
    e.preventDefault();
    putEdit(route("teams.update", team.id), {
      onSuccess: () => setShowEditModal(false)
    });
  };
  const deleteTeam = () => {
    if (confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      router.delete(route("teams.destroy", team.id));
    }
  };
  const removeMember = (userId) => {
    if (confirm("Remove this user from the team?")) {
      router.delete(route("teams.members.destroy", { team: team.id, user: userId }));
    }
  };
  const cancelInvitation = (invitationId) => {
    if (confirm("Cancel this invitation?")) {
      router.delete(route("teams.invitations.destroy", { team: team.id, invitation: invitationId }));
    }
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
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-black tracking-tighter uppercase italic leading-none", children: team.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1", children: "Unit Command" })
            ] })
          ] }),
          isOwner && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowEditModal(true),
                className: "p-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded hover:text-purple-500 transition-colors",
                children: /* @__PURE__ */ jsx(Edit2, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowCreateModal(true),
                className: "flex items-center px-6 py-2 bg-[var(--text-main)] text-[var(--bg-main)] rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl",
                children: [
                  /* @__PURE__ */ jsx(UserPlus, { className: "mr-2", size: 14, strokeWidth: 3 }),
                  " Add_Member"
                ]
              }
            )
          ] })
        ] }),
        children: [
          /* @__PURE__ */ jsx(Head, { title: `Team: ${team.name}` }),
          /* @__PURE__ */ jsx("div", { className: "relative min-h-full p-8 lg:p-12 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-12 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex justify-between items-center", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Shield, { size: 14 }),
                  " Active_Personnel"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold bg-[var(--bg-main)] px-3 py-1 rounded border border-[var(--border)]", children: [
                  team.users.length + 1,
                  " Users"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "divide-y divide-[var(--border)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-6 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-black", children: team.owner.name.charAt(0) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm", children: team.owner.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)]", children: team.owner.email })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-purple-500/10 text-purple-500 rounded text-[9px] font-black uppercase tracking-widest border border-purple-500/20", children: "Commander" })
                ] }),
                team.users.map((user) => /* @__PURE__ */ jsxs("div", { className: "p-6 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors group", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--text-muted)]", children: user.name.charAt(0) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm", children: user.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-muted)]", children: user.email })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-[var(--bg-main)] text-[var(--text-muted)] rounded text-[9px] font-black uppercase tracking-widest border border-[var(--border)]", children: user.pivot.role }),
                    isOwner && /* @__PURE__ */ jsx("button", { onClick: () => removeMember(user.id), className: "p-2 text-rose-500 hover:bg-rose-500/10 rounded transition-colors opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsx(Trash2, { size: 16 }) })
                  ] })
                ] }, user.id))
              ] })
            ] }),
            isOwner && team.invitations.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl", children: [
              /* @__PURE__ */ jsx("div", { className: "p-8 border-b border-[var(--border)] bg-[var(--bg-elevated)]", children: /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Mail, { size: 14 }),
                " Pending_Invites"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-[var(--border)]", children: team.invitations.map((invitation) => /* @__PURE__ */ jsxs("div", { className: "p-6 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors group", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20", children: /* @__PURE__ */ jsx(Activity, { size: 16 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm", children: invitation.email }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--text-muted)]", children: [
                      "Role: ",
                      invitation.role
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("button", { onClick: () => cancelInvitation(invitation.id), className: "p-2 text-rose-500 hover:bg-rose-500/10 rounded transition-colors opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
              ] }, invitation.id)) })
            ] }),
            isOwner && !team.personal_team && /* @__PURE__ */ jsx("div", { className: "border border-rose-500/20 rounded-[2rem] p-8 mt-12 bg-rose-500/5", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-rose-500 uppercase tracking-widest", children: "Decommission Unit" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-500/60 mt-1", children: "Permanently delete this team and all data." })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: deleteTeam, className: "px-6 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20", children: "Delete Team" })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsx(Modal, { show: showInviteModal, onClose: () => setShowCreateModal(false), children: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-[var(--text-main)] mb-4", children: "Invite New Personnel" }),
            /* @__PURE__ */ jsxs("form", { onSubmit: sendInvite, children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Email Address" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "email",
                    value: inviteData.email,
                    onChange: (e) => setInviteData("email", e.target.value),
                    className: "w-full bg-[var(--bg-elevated)]",
                    placeholder: "agent@example.com"
                  }
                ),
                inviteErrors.email && /* @__PURE__ */ jsx("div", { className: "text-rose-500 text-xs mt-1", children: inviteErrors.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Role" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: inviteData.role,
                    onChange: (e) => setInviteData("role", e.target.value),
                    className: "w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm py-2 px-3 text-[var(--text-main)]",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "member", children: "Member" }),
                      /* @__PURE__ */ jsx("option", { value: "editor", children: "Editor" }),
                      /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowCreateModal(false), className: "px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)]", children: "Cancel" }),
                /* @__PURE__ */ jsx(PrimaryButton, { disabled: inviteProcessing, className: "bg-purple-500 hover:bg-purple-600 border-purple-500", children: "Send Invite" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Modal, { show: showEditModal, onClose: () => setShowEditModal(false), children: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-[var(--text-main)] mb-4", children: "Edit Unit Details" }),
            /* @__PURE__ */ jsxs("form", { onSubmit: updateTeam, children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Unit Name" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    value: editData.name,
                    onChange: (e) => setEditData("name", e.target.value),
                    className: "w-full bg-[var(--bg-elevated)]"
                  }
                ),
                editErrors.name && /* @__PURE__ */ jsx("div", { className: "text-rose-500 text-xs mt-1", children: editErrors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowEditModal(false), className: "px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)]", children: "Cancel" }),
                /* @__PURE__ */ jsx(PrimaryButton, { disabled: editProcessing, className: "bg-purple-500 hover:bg-purple-600 border-purple-500", children: "Save Changes" })
              ] })
            ] })
          ] }) })
        ]
      }
    )
  ] });
}
export {
  TeamShow as default
};
