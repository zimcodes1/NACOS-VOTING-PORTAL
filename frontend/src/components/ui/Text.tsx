import React from "react";
import { cn } from "../../utils/cn";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "subtitle"
  | "body"
  | "body-sm"
  | "caption"
  | "mono"
  | "label";

export type TextColor =
  | "default"
  | "primary"
  | "primary-dark"
  | "navy"
  | "gold"
  | "secondary"
  | "muted"
  | "success"
  | "warning"
  | "danger"
  | "white";

export type TextWeight = "normal" | "medium" | "semibold" | "bold" | "extrabold";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  align?: "left" | "center" | "right";
  as?: React.ElementType;
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, string> = {
  h1: "text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight",
  h2: "text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug",
  h3: "text-xl sm:text-2xl font-bold tracking-tight",
  h4: "text-lg sm:text-xl font-bold",
  h5: "text-base sm:text-lg font-semibold",
  subtitle: "text-base sm:text-lg text-text-secondary leading-relaxed",
  body: "text-sm sm:text-base leading-relaxed",
  "body-sm": "text-xs sm:text-sm leading-relaxed",
  caption: "text-xs text-text-muted",
  mono: "font-mono text-xs sm:text-sm tracking-tight",
  label: "text-xs font-bold uppercase tracking-wider block",
};

const defaultElementMap: Record<TextVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  subtitle: "p",
  body: "p",
  "body-sm": "p",
  caption: "span",
  mono: "code",
  label: "label",
};

const colorStyles: Record<TextColor, string> = {
  default: "text-text-primary",
  primary: "text-primary",
  "primary-dark": "text-primary-dark",
  navy: "text-navy",
  gold: "text-gold",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  white: "text-white",
};

const weightStyles: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

export const Text: React.FC<TextProps> = ({
  variant = "body",
  color = "default",
  weight,
  align = "left",
  as,
  className,
  children,
  ...props
}) => {
  const Component = as || defaultElementMap[variant] || "p";

  const alignStyle =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <Component
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        weight ? weightStyles[weight] : "",
        alignStyle,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
