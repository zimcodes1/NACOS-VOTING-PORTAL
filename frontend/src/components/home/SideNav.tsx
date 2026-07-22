import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  Trophy,
  PlusCircle,
  FileText,
  Sparkles,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "../../utils/cn";

export interface SideNavProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
}) => {
  const [localIsCollapsed, setLocalIsCollapsed] = useState(false);
  const isCollapsed =
    controlledIsCollapsed !== undefined ? controlledIsCollapsed : localIsCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setLocalIsCollapsed((prev) => !prev);
    }
  };

  const navLinks = [
    {
      href: "/home",
      label: "Project Discovery",
      icon: LayoutGrid,
      active: true,
    },
    {
      href: "/dashboard",
      label: "Live Leaderboard",
      icon: Trophy,
      iconColor: "text-gold",
      badge: "TV",
    },
    {
      href: "/register",
      label: "Register Entry",
      icon: PlusCircle,
      iconColor: "text-primary",
    },
    {
      href: "/rules",
      label: "Exhibition Rules",
      icon: FileText,
    },
  ];

  const renderContent = (collapsed: boolean, isMobile: boolean = false) => (
    <div className="flex flex-col h-full py-6 px-3 space-y-6 overflow-y-auto overflow-x-hidden">
      {/* Brand Header */}
      <div className={cn("flex items-center px-1", collapsed ? "justify-center" : "justify-between")}>
        <div className="flex sm:hidden items-center gap-3 min-w-0">
          <div className="sm:hidden w-10 h-10 rounded-2xl bg-white border border-border p-1 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
            <img src="/images/nacos-logo.png" alt="NACOS" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="sm:hidden truncate">
              <h2 className="font-extrabold text-lg text-navy tracking-tight leading-none">
                NACOS
              </h2>
              <p className="text-xs font-semibold text-primary mt-1">Exhibition 2026</p>
            </div>
          )}
        </div>

        {/* Action button: Close on mobile OR toggle collapse on desktop */}
        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 rounded-xl text-text-secondary hover:text-navy hover:bg-background transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          !collapsed && (
            <button
              type="button"
              onClick={handleToggle}
              className="p-2 rounded-xl text-text-secondary hover:text-navy hover:bg-background transition-colors cursor-pointer shrink-0"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-5 h-5 text-text-muted hover:text-navy" />
            </button>
          )
        )}
      </div>

      {/* Expand button when collapsed in desktop view */}
      {!isMobile && collapsed && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleToggle}
            className="p-2 rounded-xl text-text-secondary hover:text-navy hover:bg-background transition-colors cursor-pointer"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="w-5 h-5 text-primary" />
          </button>
        </div>
      )}

      {/* Main Navigation Links */}
      <div className="space-y-1.5 flex-1">
        {!collapsed && (
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Navigation
          </p>
        )}
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={isMobile ? onCloseMobile : undefined}
              title={collapsed ? link.label : undefined}
              className={cn(
                "flex items-center rounded-xl text-sm font-semibold transition-all group cursor-pointer",
                collapsed ? "justify-center p-3" : "justify-between px-3 py-2.5",
                link.active
                  ? "text-primary bg-primary-light/50 border border-primary/20"
                  : "text-text-secondary hover:text-navy hover:bg-background"
              )}
            >
              <span className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    link.iconColor,
                    link.active && "text-primary"
                  )}
                />
                {!collapsed && <span className="truncate">{link.label}</span>}
              </span>
              {!collapsed && (
                <div className="flex items-center gap-1.5">
                  {link.badge && (
                    <span className="text-[10px] font-bold bg-gold-light text-gold-dark px-1.5 py-0.5 rounded-md">
                      {link.badge}
                    </span>
                  )}
                  {link.active && <ChevronRight className="w-4 h-4 text-primary/70" />}
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* Footer Support Card */}
      {!collapsed ? (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-light/80 to-gold-light/40 border border-primary/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-dark">
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <span>Have a Code?</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Codes (e.g. <code className="font-mono text-navy font-bold">NSE26-XXXX</code>) allow fast project verification & support.
          </p>
        </div>
      ) : (
        <div
          title="Registration code support"
          className="p-3 rounded-2xl bg-gradient-to-br from-primary-light/80 to-gold-light/40 border border-primary/20 flex justify-center items-center text-gold cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Collapsible Sidebar */}
      <aside
        className={cn(
          "hidden md:block shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-surface border-r border-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {renderContent(isCollapsed, false)}
      </aside>

      {/* Mobile Animated Drawer Overlay (Framer Motion) */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-navy/50 backdrop-blur-xs"
              onClick={onCloseMobile}
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-[85vw] bg-surface h-full shadow-2xl z-10 flex flex-col"
            >
              {renderContent(false, true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
