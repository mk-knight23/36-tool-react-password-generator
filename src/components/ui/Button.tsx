"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent-fill text-on-accent hover:bg-accent-hover disabled:hover:bg-accent-fill",
  secondary:
    "bg-surface text-fg border border-border-strong hover:bg-surface-sunken",
  ghost: "bg-transparent text-fg hover:bg-surface-sunken",
  danger: "bg-danger-fill text-on-danger hover:brightness-95",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading = false, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-md font-medium",
        "cursor-pointer transition-[background-color,transform,filter] duration-fast ease-enter",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
});
