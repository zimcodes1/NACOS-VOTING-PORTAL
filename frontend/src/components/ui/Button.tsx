import React from "react";
import { cn } from "../../utils/cn";

export type ButtonVariant =
  | "primary"
  | "navy"
  | "gold"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "light";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:scale-[0.98] shadow-xs hover:shadow-md focus:ring-primary/30",
  navy:
    "bg-navy text-white hover:bg-navy/90 active:scale-[0.98] shadow-xs hover:shadow-md focus:ring-navy/30",
  gold:
    "bg-gold text-white hover:bg-gold/90 active:scale-[0.98] shadow-xs hover:shadow-md focus:ring-gold/30",
  outline:
    "bg-transparent text-navy border border-border hover:border-primary hover:bg-primary-light/30 active:scale-[0.98] focus:ring-primary/20",
  ghost:
    "bg-transparent text-text-secondary hover:text-navy hover:bg-background active:scale-[0.98]",
  danger:
    "bg-danger text-white hover:bg-danger/90 active:scale-[0.98] shadow-xs hover:shadow-md focus:ring-danger/30",
  success:
    "bg-success text-white hover:bg-success/90 active:scale-[0.98] shadow-xs hover:shadow-md focus:ring-success/30",
  light:
    "bg-primary-light text-primary-dark hover:bg-primary-light/80 border border-primary/20 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm font-bold rounded-xl gap-2",
  lg: "px-6 py-3 text-base font-bold rounded-xl gap-2.5",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center font-sans transition-all duration-150 select-none focus:outline-none focus:ring-2",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        isDisabled ? "opacity-60 cursor-not-allowed pointer-events-none shadow-none" : "cursor-pointer",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin w-4 h-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}

      {children && <span>{children}</span>}

      {!isLoading && rightIcon}
    </button>
  );
};
