import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, usePage } from "@inertiajs/react";
import { useState, createContext, useContext } from "react";
import { Shield, ShieldAlert, ShieldCheck, Sword, Swords, Zap, Star, Crown, Flame, Sparkles, LayoutDashboard, Compass, User, Cloud, Users, FileText, Code2, Database, LifeBuoy, Briefcase, FileCode, DollarSign, Store, ShoppingBag, Tag, Wallet, Mail, Settings, Megaphone, Terminal, Info, ChevronLeft, ChevronRight, LogOut, BadgeCheck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { T as ThemeSwitcher } from "./ThemeSwitcher-Bh1r3iWC.js";
import { N as NotificationDropdown } from "./NotificationDropdown-DwAPkSZZ.js";
import { Transition } from "@headlessui/react";
function UserLevelBadge({ level = 1, className = "", size = "md", showText = true }) {
  const getLevelConfig = (lvl) => {
    switch (true) {
      case lvl >= 10:
        return {
          name: "Cosmic",
          style: "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 text-white border-transparent shadow-[0_0_20px_rgba(217,70,239,0.6)] animate-pulse",
          icon: Sparkles
        };
      case lvl === 9:
        return {
          name: "Mythic",
          style: "bg-gradient-to-br from-rose-600 to-orange-500 text-white border-transparent shadow-[0_0_15px_rgba(225,29,72,0.5)]",
          icon: Flame
        };
      case lvl === 8:
        return {
          name: "Legend",
          style: "bg-gradient-to-br from-yellow-400 to-amber-600 text-yellow-950 border-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
          icon: Crown
        };
      case lvl === 7:
        return {
          name: "Grandmaster",
          style: "bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white border-fuchsia-400 shadow-[0_0_15px_rgba(192,38,211,0.5)]",
          icon: Star
        };
      case lvl === 6:
        return {
          name: "Master",
          style: "bg-gradient-to-br from-indigo-500 to-blue-700 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]",
          icon: Zap
        };
      case lvl === 5:
        return {
          name: "Elite",
          style: "bg-gradient-to-br from-cyan-400 to-teal-600 text-white border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]",
          icon: Swords
        };
      case lvl === 4:
        return {
          name: "Veteran",
          style: "bg-gradient-to-br from-emerald-500 to-green-700 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
          icon: Sword
        };
      case lvl === 3:
        return {
          name: "Adept",
          style: "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.4)]",
          icon: ShieldCheck
        };
      case lvl === 2:
        return {
          name: "Apprentice",
          style: "bg-gradient-to-br from-amber-700 to-orange-900 text-amber-100 border-amber-600 shadow-[0_0_8px_rgba(180,83,9,0.4)]",
          icon: ShieldAlert
        };
      default:
        return {
          name: "Novice",
          style: "bg-gradient-to-br from-slate-700 to-slate-900 text-slate-300 border-slate-600 shadow-[0_0_5px_rgba(71,85,105,0.3)]",
          icon: Shield
        };
    }
  };
  const config = getLevelConfig(level);
  const Icon = config.icon;
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[8px] gap-1",
    md: "px-2 py-1 text-[10px] gap-1.5",
    lg: "px-3 py-1.5 text-xs gap-2"
  };
  const iconSizes = { sm: 10, md: 12, lg: 16 };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `inline-flex items-center font-black uppercase tracking-widest rounded-full border ${config.style} ${sizeClasses[size]} ${className}`,
      title: `Level ${level} - ${config.name}`,
      children: [
        /* @__PURE__ */ jsx(Icon, { size: iconSizes[size], strokeWidth: 2.5 }),
        showText && /* @__PURE__ */ jsxs("span", { children: [
          "Lvl ",
          level
        ] })
      ]
    }
  );
}
const DropDownContext = createContext();
const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };
  return /* @__PURE__ */ jsx(DropDownContext.Provider, { value: { open, setOpen, toggleOpen }, children: /* @__PURE__ */ jsx("div", { className: "relative", children }) });
};
const Trigger = ({ children }) => {
  const { open, setOpen, toggleOpen } = useContext(DropDownContext);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { onClick: toggleOpen, children }),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40",
        onClick: () => setOpen(false)
      }
    )
  ] });
};
const Content = ({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-main)]",
  children
}) => {
  const { open, setOpen } = useContext(DropDownContext);
  let alignmentClasses = "origin-top";
  if (align === "left") {
    alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
  } else if (align === "right") {
    alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
  }
  let widthClasses = "";
  if (width === "48") {
    widthClasses = "w-48";
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Transition,
    {
      show: open,
      enter: "transition ease-out duration-200",
      enterFrom: "opacity-0 scale-95",
      enterTo: "opacity-100 scale-100",
      leave: "transition ease-in duration-75",
      leaveFrom: "opacity-100 scale-100",
      leaveTo: "opacity-0 scale-95",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`,
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses,
              children
            }
          )
        }
      )
    }
  ) });
};
const DropdownLink = ({ className = "", children, ...props }) => {
  return /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      className: "block w-full px-4 py-2 text-start text-sm leading-5 text-[var(--text-main)] transition duration-150 ease-in-out hover:bg-[var(--bg-elevated)] focus:bg-[var(--bg-elevated)] focus:outline-none " + className,
      children
    }
  );
};
Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
function AuthenticatedLayout({ header, children }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: route("dashboard"), active: route().current("dashboard") },
    { name: "Explore", icon: Compass, href: route("explore"), active: route().current("explore") },
    { name: "My Account", icon: User, href: route("my-account"), active: route().current("my-account") },
    { name: "Cloud Sync", icon: Cloud, href: route("cloud-sync"), active: route().current("cloud-sync") },
    { name: "Teams", icon: Users, href: route("teams.index"), active: route().current("teams.*") },
    { name: "Blog", icon: FileText, href: route("blog.index"), active: route().current("blog.index") },
    { name: "Editor", icon: Code2, href: route("editor"), active: route().current("editor") },
    { name: "My Projects", icon: Database, href: route("my-projects"), active: route().current("my-projects") },
    { name: "Support", icon: LifeBuoy, href: route("support.index"), active: route().current("support.index") }
  ];
  const vendorItems = [
    { name: "Vendors Hub", icon: Shield, href: route("vendors.dashboard"), active: route().current("vendors.dashboard") },
    { name: "Manage Projects", icon: Briefcase, href: route("vendors.projects"), active: route().current("vendors.projects") },
    { name: "SDK & APIs", icon: FileCode, href: route("vendors.sdk-integration"), active: route().current("vendors.sdk-integration") },
    { name: "Payments", icon: DollarSign, href: route("vendors.payments"), active: route().current("vendors.payments") },
    { name: "Sell Product", icon: Store, href: route("vendors.sell"), active: route().current("vendors.sell") },
    { name: "Marketplace", icon: ShoppingBag, href: route("marketplace"), active: route().current("marketplace") }
  ];
  const adminItems = [
    { name: "Admin Command", icon: Shield, href: route("admin.dashboard"), active: route().current("admin.dashboard") },
    { name: "User Matrix", icon: Users, href: route("admin.users"), active: route().current("admin.users") },
    { name: "Subscription Control", icon: Crown, href: route("admin.subscriptions"), active: route().current("admin.subscriptions") },
    { name: "Blog system", icon: FileText, href: route("admin.blog.index"), active: route().current("admin.blog.index") },
    { name: "Sales Matrix", icon: ShoppingBag, href: route("admin.sales.index"), active: route().current("admin.sales.index") },
    { name: "Paid Projects", icon: Tag, href: route("admin.sales.paid-projects"), active: route().current("admin.sales.paid-projects") },
    { name: "Vendor Payouts", icon: Wallet, href: route("admin.payouts.index"), active: route().current("admin.payouts.*") },
    { name: "Mail System", icon: Mail, href: route("admin.email.index"), active: route().current("admin.email.index") },
    { name: "SMTP Config", icon: Settings, href: route("admin.email.settings"), active: route().current("admin.email.settings") },
    { name: "Support Queue", icon: LifeBuoy, href: route("admin.support"), active: route().current("admin.support") },
    { name: "Front Management", icon: LayoutDashboard, href: route("admin.front-management"), active: route().current("admin.front-management") },
    { name: "Feature Management", icon: Shield, href: route("admin.features"), active: route().current("admin.features") },
    { name: "Ad Management", icon: Megaphone, href: route("admin.ads"), active: route().current("admin.ads") },
    { name: "Page Manager", icon: FileText, href: route("admin.pages.index"), active: route().current("admin.pages.*") },
    { name: "System Update", icon: Terminal, href: route("admin.update"), active: route().current("admin.update") },
    { name: "System Info", icon: Info, href: route("admin.info"), active: route().current("admin.info") }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex overflow-hidden transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs(
      motion.aside,
      {
        initial: false,
        animate: { width: isSidebarOpen ? "260px" : "80px" },
        className: "hidden lg:flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border)] sticky top-0 h-screen z-50 shrink-0",
        children: [
          /* @__PURE__ */ jsx("div", { className: "h-20 flex items-center px-6 border-b border-[var(--border)] shrink-0", children: /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-cyan-500 text-white dark:bg-white dark:black rounded", children: /* @__PURE__ */ jsx(Code2, { size: 20 }) }),
            isSidebarOpen && /* @__PURE__ */ jsx("span", { className: "font-bold tracking-tight text-[var(--text-main)] uppercase italic", children: "HOACodeLab" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 py-6 overflow-y-auto", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-4 mb-8", children: [
              isSidebarOpen && /* @__PURE__ */ jsx("div", { className: "px-4 mb-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em]", children: "Personal" }),
              /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: userItems.map((item) => /* @__PURE__ */ jsxs(
                Link,
                {
                  href: item.href,
                  className: `flex items-center gap-4 p-3 rounded transition-all ${item.active ? "bg-cyan-500 text-white dark:text-black font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"}`,
                  children: [
                    /* @__PURE__ */ jsx(item.icon, { size: 18 }),
                    isSidebarOpen && /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-widest", children: item.name })
                  ]
                },
                item.name
              )) })
            ] }),
            user?.is_vendor || user?.role === "admin" ? /* @__PURE__ */ jsxs("div", { className: "px-4 mb-8", children: [
              /* @__PURE__ */ jsx("div", { className: "h-px bg-[var(--border)] mx-4 mb-6" }),
              isSidebarOpen && /* @__PURE__ */ jsx("div", { className: "px-4 mb-4 text-[9px] font-bold text-purple-500/80 uppercase tracking-[0.3em]", children: "Vendors Portal" }),
              /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: vendorItems.map((item) => /* @__PURE__ */ jsxs(
                Link,
                {
                  href: item.href,
                  className: `flex items-center gap-4 p-3 rounded transition-all ${item.active ? "bg-purple-500 text-white font-bold" : "text-[var(--text-muted)] hover:text-purple-500 hover:bg-purple-500/5"}`,
                  children: [
                    /* @__PURE__ */ jsx(item.icon, { size: 18 }),
                    isSidebarOpen && /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-widest", children: item.name })
                  ]
                },
                item.name
              )) })
            ] }) : null,
            user?.role === "admin" && /* @__PURE__ */ jsxs("div", { className: "px-4 mb-8", children: [
              /* @__PURE__ */ jsx("div", { className: "h-px bg-[var(--border)] mx-4 mb-6" }),
              isSidebarOpen && /* @__PURE__ */ jsx("div", { className: "px-4 mb-4 text-[9px] font-bold text-rose-500/60 uppercase tracking-[0.3em]", children: "Command" }),
              /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: adminItems.map((item) => /* @__PURE__ */ jsxs(
                Link,
                {
                  href: item.href,
                  className: `flex items-center gap-4 p-3 rounded transition-all ${item.active ? "bg-rose-500 text-white font-bold" : "text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/5"}`,
                  children: [
                    /* @__PURE__ */ jsx(item.icon, { size: 18 }),
                    isSidebarOpen && /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-widest", children: item.name })
                  ]
                },
                item.name
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-[var(--border)] shrink-0 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setIsSidebarOpen(!isSidebarOpen), className: "flex-1 flex justify-center p-2 hover:bg-[var(--bg-elevated)] rounded transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)]", children: isSidebarOpen ? /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }) : /* @__PURE__ */ jsx(ChevronRight, { size: 16 }) }),
            user && /* @__PURE__ */ jsx(Link, { href: route("logout"), method: "post", as: "button", className: "p-2 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 rounded border border-[var(--border)] transition-all", children: /* @__PURE__ */ jsx(LogOut, { size: 16 }) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0 relative h-screen", children: [
      /* @__PURE__ */ jsxs("header", { className: "hidden lg:flex h-20 border-b border-[var(--border)] bg-[var(--bg-main)] sticky top-0 z-30 px-10 shrink-0 items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { children: header }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pr-6 border-r border-[var(--border)]", children: [
            /* @__PURE__ */ jsx(ThemeSwitcher, {}),
            /* @__PURE__ */ jsx(NotificationDropdown, {})
          ] }),
          /* @__PURE__ */ jsxs(Dropdown, { children: [
            /* @__PURE__ */ jsx(Dropdown.Trigger, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-3 group focus:outline-none", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-right hidden xl:block", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-black uppercase text-[var(--text-main)] leading-none flex items-center justify-end gap-1", children: [
                    user.name,
                    user.identity_status === "verified" && /* @__PURE__ */ jsx(BadgeCheck, { className: "text-emerald-500", size: 12, title: "Verified" })
                  ] }),
                  /* @__PURE__ */ jsx(UserLevelBadge, { level: user.level, size: "sm", showText: false })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[8px] font-bold text-[var(--text-muted)] uppercase mt-1", children: "Online" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-lg overflow-hidden", children: /* @__PURE__ */ jsx(Users, { size: 18 }) })
            ] }) }),
            /* @__PURE__ */ jsxs(Dropdown.Content, { align: "right", width: "48", children: [
              /* @__PURE__ */ jsx(Dropdown.Link, { href: route("dashboard"), children: "Dashboard" }),
              /* @__PURE__ */ jsx(Dropdown.Link, { href: route("my-account"), children: "My Account" }),
              /* @__PURE__ */ jsx(Dropdown.Link, { href: route("my-projects"), children: "My Projects" }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--border)] my-1" }),
              /* @__PURE__ */ jsx(Dropdown.Link, { href: route("profile.edit"), children: "Profile Settings" }),
              /* @__PURE__ */ jsx(Dropdown.Link, { href: route("support.index"), children: "Support" }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--border)] my-1" }),
              /* @__PURE__ */ jsx(Dropdown.Link, { href: route("logout"), method: "post", as: "button", className: "text-rose-500 hover:bg-rose-500/10", children: "Log Out" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("header", { className: "lg:hidden h-16 bg-[var(--bg-surface)] border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-40 shrink-0", children: [
        /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Code2, { className: "text-cyan-500 dark:text-cyan-400", size: 20 }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-[var(--text-main)] text-sm uppercase italic", children: "HOACodeLab" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsMobileMenuOpen(true), className: "p-2 text-[var(--text-muted)]", children: /* @__PURE__ */ jsx(Menu, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto relative", children })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isMobileMenuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIsMobileMenuOpen(false), className: "fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm" }),
      /* @__PURE__ */ jsxs(motion.div, { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, className: "fixed right-0 top-0 bottom-0 w-72 bg-[var(--bg-surface)] border-l border-[var(--border)] z-[70] p-8 flex flex-col lg:hidden shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Code2, { className: "text-cyan-500", size: 24 }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-[var(--text-main)]", children: "System" })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsMobileMenuOpen(false), className: "text-[var(--text-muted)] hover:text-[var(--text-main)]", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
        ] }),
        /* @__PURE__ */ jsxs("nav", { className: "flex-1 space-y-2 overflow-y-auto pb-6", children: [
          userItems.map((item) => /* @__PURE__ */ jsxs(Link, { href: item.href, className: `flex items-center gap-4 p-4 rounded ${item.active ? "bg-cyan-500 text-white dark:text-black font-bold" : "text-[var(--text-muted)]"}`, children: [
            /* @__PURE__ */ jsx(item.icon, { size: 18 }),
            /* @__PURE__ */ jsx("span", { className: "uppercase tracking-widest text-[10px]", children: item.name })
          ] }, item.name)),
          user?.is_vendor || user?.role === "admin" ? /* @__PURE__ */ jsxs("div", { className: "mt-6 mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-px bg-[var(--border)] mx-4 mb-4" }),
            /* @__PURE__ */ jsx("div", { className: "px-4 mb-2 text-[9px] font-bold text-purple-500/80 uppercase tracking-[0.3em]", children: "Vendors Portal" }),
            vendorItems.map((item) => /* @__PURE__ */ jsxs(Link, { href: item.href, className: `flex items-center gap-4 p-4 rounded ${item.active ? "bg-purple-500 text-white font-bold" : "text-[var(--text-muted)]"}`, children: [
              /* @__PURE__ */ jsx(item.icon, { size: 18 }),
              /* @__PURE__ */ jsx("span", { className: "uppercase tracking-widest text-[10px]", children: item.name })
            ] }, item.name))
          ] }) : null,
          user?.role === "admin" && /* @__PURE__ */ jsxs("div", { className: "mt-6 mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-px bg-[var(--border)] mx-4 mb-4" }),
            /* @__PURE__ */ jsx("div", { className: "px-4 mb-2 text-[9px] font-bold text-rose-500/60 uppercase tracking-[0.3em]", children: "Command" }),
            adminItems.map((item) => /* @__PURE__ */ jsxs(Link, { href: item.href, className: `flex items-center gap-4 p-4 rounded ${item.active ? "bg-rose-500 text-white font-bold" : "text-[var(--text-muted)]"}`, children: [
              /* @__PURE__ */ jsx(item.icon, { size: 18 }),
              /* @__PURE__ */ jsx("span", { className: "uppercase tracking-widest text-[10px]", children: item.name })
            ] }, item.name))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsx(ThemeSwitcher, {}),
          /* @__PURE__ */ jsx(NotificationDropdown, {})
        ] }),
        /* @__PURE__ */ jsxs(Link, { href: route("logout"), method: "post", as: "button", className: "flex items-center gap-4 p-4 text-rose-500 font-bold uppercase tracking-widest mt-auto border border-rose-500/20 rounded", children: [
          /* @__PURE__ */ jsx(LogOut, { size: 18 }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[10px]", children: "Logout" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AuthenticatedLayout as A,
  UserLevelBadge as U
};
