import React from "react";
import { cn } from "../../utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "background" | "glass" | "gradient";
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "surface",
  hoverable = false,
  className,
  children,
  ...props
}) => {
  const variantStyle =
    variant === "background"
      ? "bg-background border-border"
      : variant === "glass"
      ? "bg-surface/80 backdrop-blur-md border-border/80"
      : variant === "gradient"
      ? "bg-gradient-to-br from-navy via-navy to-primary-dark text-white border-transparent"
      : "bg-surface border-border";

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 transition-all duration-200 shadow-xs",
        variantStyle,
        hoverable ? "hover:border-primary/50 hover:shadow-md cursor-pointer" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("space-y-1.5 border-b border-border/60 pb-4 mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn("text-lg sm:text-xl font-extrabold text-navy tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn("text-xs sm:text-sm text-text-secondary leading-relaxed", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => <div className={cn("space-y-4", className)} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("pt-4 mt-6 border-t border-border/60 flex items-center justify-between gap-4", className)}
    {...props}
  >
    {children}
  </div>
);
