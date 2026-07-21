import React from "react";
import { cn } from "../../utils/cn";

export type BadgeVariant =
  | "primary"
  | "navy"
  | "gold"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "muted";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  pulse?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary-light text-primary-dark border border-primary/20",
  navy: "bg-navy-light text-navy border border-navy/20",
  gold: "bg-gold-light text-gold-dark border border-gold/30",
  success: "bg-success-bg text-success border border-success/30",
  warning: "bg-warning-bg text-warning border border-warning/30",
  danger: "bg-danger-bg text-danger border border-danger/30",
  outline: "bg-transparent text-text-secondary border border-border",
  muted: "bg-background text-text-muted border border-border",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs font-semibold rounded-md gap-1",
  md: "px-3 py-1 text-xs font-bold rounded-full gap-1.5",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  size = "md",
  icon,
  pulse = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center tracking-tight transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {icon}
      <span>{children}</span>
    </span>
  );
};
