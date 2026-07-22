import React from "react";
import { toast as sonnerToast, Toaster as SonnerToaster, type ToasterProps } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Award,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";

export type ToastVariant =
  | "success"
  | "error"
  | "danger"
  | "warning"
  | "info"
  | "navy"
  | "primary"
  | "gold";

export interface ToastProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  icon?: React.ReactNode;
}

export interface CustomToastOptions {
  description?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: ToastVariant;
  icon?: React.ReactNode;
  duration?: number;
  id?: string | number;
  className?: string;
  progressClassName?: string;
}

const variantConfigs: Record<
  ToastVariant,
  {
    containerClass: string;
    iconBg: string;
    iconColor: string;
    defaultIcon: React.ReactNode;
    actionClass: string;
  }
> = {
  success: {
    containerClass: "bg-white/95 text-emerald-950 border-emerald-200/80 shadow-xl shadow-emerald-900/10",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    iconColor: "text-emerald-600",
    defaultIcon: <CheckCircle2 className="w-5 h-5" />,
    actionClass: "bg-emerald-100/70 text-emerald-800 hover:bg-emerald-200/80 border-emerald-300/60",
  },
  error: {
    containerClass: "bg-white/95 text-rose-950 border-rose-200/80 shadow-xl shadow-rose-900/10",
    iconBg: "bg-rose-50 text-rose-600 border-rose-200/60",
    iconColor: "text-rose-600",
    defaultIcon: <AlertCircle className="w-5 h-5" />,
    actionClass: "bg-rose-100/70 text-rose-800 hover:bg-rose-200/80 border-rose-300/60",
  },
  danger: {
    containerClass: "bg-white/95 text-rose-950 border-rose-200/80 shadow-xl shadow-rose-900/10",
    iconBg: "bg-rose-50 text-rose-600 border-rose-200/60",
    iconColor: "text-rose-600",
    defaultIcon: <AlertCircle className="w-5 h-5" />,
    actionClass: "bg-rose-100/70 text-rose-800 hover:bg-rose-200/80 border-rose-300/60",
  },
  warning: {
    containerClass: "bg-white/95 text-amber-950 border-amber-200/80 shadow-xl shadow-amber-900/10",
    iconBg: "bg-amber-50 text-amber-600 border-amber-200/60",
    iconColor: "text-amber-600",
    defaultIcon: <AlertTriangle className="w-5 h-5" />,
    actionClass: "bg-amber-100/70 text-amber-900 hover:bg-amber-200/80 border-amber-300/60",
  },
  info: {
    containerClass: "bg-white/95 text-sky-950 border-sky-200/80 shadow-xl shadow-sky-900/10",
    iconBg: "bg-sky-50 text-sky-600 border-sky-200/60",
    iconColor: "text-sky-600",
    defaultIcon: <Info className="w-5 h-5" />,
    actionClass: "bg-sky-100/70 text-sky-900 hover:bg-sky-200/80 border-sky-300/60",
  },
  navy: {
    containerClass: "bg-navy text-white border-navy-light/30 shadow-2xl shadow-navy/30",
    iconBg: "bg-white/10 text-gold-light border-white/15",
    iconColor: "text-gold-light",
    defaultIcon: <Info className="w-5 h-5" />,
    actionClass: "bg-white/15 text-white hover:bg-white/25 border-white/20",
  },
  primary: {
    containerClass: "bg-white/95 text-navy border-primary/30 shadow-xl shadow-primary/10",
    iconBg: "bg-primary-light text-primary border-primary/20",
    iconColor: "text-primary",
    defaultIcon: <Sparkles className="w-5 h-5" />,
    actionClass: "bg-primary-light text-primary-dark hover:bg-primary-light/80 border-primary/20",
  },
  gold: {
    containerClass: "bg-white/95 text-navy border-gold/40 shadow-xl shadow-gold/15",
    iconBg: "bg-gold-light text-gold-dark border-gold/30",
    iconColor: "text-gold",
    defaultIcon: <Award className="w-5 h-5" />,
    actionClass: "bg-gold-light text-gold-dark hover:bg-gold-light/80 border-gold/30",
  },
};

export const ToastContent: React.FC<ToastProps> = ({
  title,
  description,
  variant = "primary",
  action,
  onClose,
  icon,
}) => {
  const config = variantConfigs[variant] || variantConfigs.primary;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 w-full p-4 rounded-2xl border backdrop-blur-xl transition-all duration-200 select-none",
        config.containerClass
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center shrink-0 w-9 h-9 rounded-xl p-2 border shadow-xs",
          config.iconBg,
          config.iconColor
        )}
      >
        {icon || config.defaultIcon}
      </div>

      <div className="flex-1 min-w-0 pt-0.5 space-y-0.5">
        <h4 className="text-xs sm:text-sm font-extrabold leading-snug tracking-tight">
          {title}
        </h4>
        {description && (
          <p className="text-[11px] sm:text-xs opacity-85 leading-relaxed break-words">
            {description}
          </p>
        )}

        {action && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
              if (onClose) onClose();
            }}
            className={cn(
              "mt-2 inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer",
              config.actionClass
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="shrink-0 p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 transition-all cursor-pointer -mr-1 -mt-1 text-current"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const showToast = (
  title: React.ReactNode,
  options?: CustomToastOptions
): string | number => {
  const {
    variant = "primary",
    description,
    action,
    icon,
    duration = 4000,
    id,
  } = options || {};

  return sonnerToast.custom(
    (t) => (
      <ToastContent
        title={title}
        description={description}
        variant={variant}
        action={action}
        icon={icon}
        onClose={() => sonnerToast.dismiss(t)}
      />
    ),
    {
      id,
      duration,
    }
  );
};

showToast.success = (
  title: React.ReactNode,
  options?: Omit<CustomToastOptions, "variant">
) => showToast(title, { ...options, variant: "success" });

showToast.error = (
  title: React.ReactNode,
  options?: Omit<CustomToastOptions, "variant">
) => showToast(title, { ...options, variant: "error" });

showToast.danger = showToast.error;

showToast.warning = (
  title: React.ReactNode,
  options?: Omit<CustomToastOptions, "variant">
) => showToast(title, { ...options, variant: "warning" });

showToast.info = (
  title: React.ReactNode,
  options?: Omit<CustomToastOptions, "variant">
) => showToast(title, { ...options, variant: "info" });

showToast.navy = (
  title: React.ReactNode,
  options?: Omit<CustomToastOptions, "variant">
) => showToast(title, { ...options, variant: "navy" });

showToast.primary = (
  title: React.ReactNode,
  options?: Omit<CustomToastOptions, "variant">
) => showToast(title, { ...options, variant: "primary" });

showToast.gold = (
  title: React.ReactNode,
  options?: Omit<CustomToastOptions, "variant">
) => showToast(title, { ...options, variant: "gold" });

showToast.dismiss = (id?: string | number) => sonnerToast.dismiss(id);
showToast.promise = sonnerToast.promise;
showToast.isActive = (id: string | number) => sonnerToast.dismiss(id);
showToast.update = (id: string | number, options?: any) => showToast(options?.title || "", { ...options, id });

export const toast = showToast;

export const ToastContainer: React.FC<ToasterProps> = (props) => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0,
          width: "380px",
          maxWidth: "90vw",
        },
      }}
      {...props}
    />
  );
};
