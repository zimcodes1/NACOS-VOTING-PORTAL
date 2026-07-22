import React from "react";
import {
  toast as reactToastify,
  ToastContainer as ReactToastifyContainer,
  type ToastOptions,
  type Id,
  type ToastContainerProps,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export interface CustomToastOptions extends Omit<ToastOptions, "type" | "icon"> {
  description?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: ToastVariant;
  icon?: React.ReactNode;
}

const variantConfigs: Record<
  ToastVariant,
  {
    containerClass: string;
    iconBg: string;
    iconColor: string;
    defaultIcon: React.ReactNode;
    progressClass: string;
    actionClass: string;
  }
> = {
  success: {
    containerClass: "bg-white border-emerald-200 shadow-lg shadow-emerald-900/5 text-emerald-950",
    iconBg: "bg-emerald-100/80 border border-emerald-200",
    iconColor: "text-emerald-600",
    defaultIcon: <CheckCircle2 className="w-5 h-5" />,
    progressClass: "!bg-emerald-500",
    actionClass: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
  },
  error: {
    containerClass: "bg-white border-rose-200 shadow-lg shadow-rose-900/5 text-rose-950",
    iconBg: "bg-rose-100/80 border border-rose-200",
    iconColor: "text-rose-600",
    defaultIcon: <AlertCircle className="w-5 h-5" />,
    progressClass: "!bg-rose-500",
    actionClass: "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200",
  },
  danger: {
    containerClass: "bg-white border-rose-200 shadow-lg shadow-rose-900/5 text-rose-950",
    iconBg: "bg-rose-100/80 border border-rose-200",
    iconColor: "text-rose-600",
    defaultIcon: <AlertCircle className="w-5 h-5" />,
    progressClass: "!bg-rose-500",
    actionClass: "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200",
  },
  warning: {
    containerClass: "bg-white border-amber-200 shadow-lg shadow-amber-900/5 text-amber-950",
    iconBg: "bg-amber-100/80 border border-amber-200",
    iconColor: "text-amber-600",
    defaultIcon: <AlertTriangle className="w-5 h-5" />,
    progressClass: "!bg-amber-500",
    actionClass: "bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200",
  },
  info: {
    containerClass: "bg-white border-sky-200 shadow-lg shadow-sky-900/5 text-sky-950",
    iconBg: "bg-sky-100/80 border border-sky-200",
    iconColor: "text-sky-600",
    defaultIcon: <Info className="w-5 h-5" />,
    progressClass: "!bg-sky-500",
    actionClass: "bg-sky-50 text-sky-800 hover:bg-sky-100 border-sky-200",
  },
  navy: {
    containerClass: "bg-navy text-white border-navy-light/20 shadow-xl shadow-navy/20",
    iconBg: "bg-white/10 border border-white/15",
    iconColor: "text-blue-300",
    defaultIcon: <Info className="w-5 h-5" />,
    progressClass: "!bg-blue-400",
    actionClass: "bg-white/15 text-white hover:bg-white/25 border-white/20",
  },
  primary: {
    containerClass: "bg-white border-primary/30 shadow-lg shadow-primary/10 text-primary-dark",
    iconBg: "bg-primary-light border border-primary/20",
    iconColor: "text-primary",
    defaultIcon: <Sparkles className="w-5 h-5" />,
    progressClass: "!bg-primary",
    actionClass: "bg-primary-light text-primary-dark hover:bg-primary-light/80 border-primary/20",
  },
  gold: {
    containerClass: "bg-white border-gold/30 shadow-lg shadow-gold/10 text-navy",
    iconBg: "bg-gold-light border border-gold/30",
    iconColor: "text-gold",
    defaultIcon: <Award className="w-5 h-5" />,
    progressClass: "!bg-gold",
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
        "relative flex items-start gap-3 w-full p-4 rounded-xl border backdrop-blur-md transition-all duration-200",
        config.containerClass
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center shrink-0 w-9 h-9 rounded-lg p-2",
          config.iconBg,
          config.iconColor
        )}
      >
        {icon || config.defaultIcon}
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-sm font-semibold leading-tight tracking-tight">
          {title}
        </h4>
        {description && (
          <p className="mt-1 text-xs opacity-80 leading-relaxed break-words">
            {description}
          </p>
        )}

        {action && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            className={cn(
              "mt-2.5 inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer",
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
          className="shrink-0 p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 transition-all cursor-pointer -mr-1 -mt-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const showToast = (
  title: React.ReactNode,
  options?: CustomToastOptions
): Id => {
  const {
    variant = "primary",
    description,
    action,
    icon,
    className,
    progressClassName,
    ...toastifyOptions
  } = options || {};

  const config = variantConfigs[variant] || variantConfigs.primary;

  const resolveClassName = (
    baseClass: string,
    extraClass?: ToastOptions["className"]
  ) => {
    if (!extraClass) return baseClass;
    if (typeof extraClass === "function") {
      return (context: any) =>
        cn(baseClass, extraClass(context));
    }
    return cn(baseClass, extraClass);
  };

  return reactToastify(
    ({ closeToast }) => (
      <ToastContent
        title={title}
        description={description}
        variant={variant}
        action={action}
        icon={icon}
        onClose={closeToast}
      />
    ),
    {
      className: resolveClassName(
        "!bg-transparent !p-0 !shadow-none !mb-3",
        className
      ),
      progressClassName: resolveClassName(
        config.progressClass,
        progressClassName
      ),
      icon: false,
      closeButton: false,
      ...toastifyOptions,
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

showToast.dismiss = reactToastify.dismiss;
showToast.promise = reactToastify.promise;
showToast.isActive = reactToastify.isActive;
showToast.update = reactToastify.update;

export const toast = showToast;

export const ToastContainer: React.FC<ToastContainerProps> = (props) => {
  return (
    <ReactToastifyContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton={false}
      style={{ width: "380px", maxWidth: "90vw" }}
      {...props}
    />
  );
};
