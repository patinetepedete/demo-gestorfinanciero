import { clsx } from "clsx";
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium tracking-wide transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink/90 shadow-[0_2px_16px_rgba(237,231,218,0.12)] hover:shadow-[0_4px_22px_rgba(237,231,218,0.2)]",
  secondary: "border border-line text-ink hover:bg-surface/60 hover:border-ink/30",
  ghost: "text-ink/70 hover:text-ink hover:bg-surface/60",
  accent:
    "text-white bg-gradient-to-b from-accent to-accent-2 hover:brightness-105 shadow-[0_2px_12px_rgba(232,84,42,0.35)]",
  danger: "border border-brick text-brick hover:bg-brick hover:text-paper",
};

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant };

export function LinkButton({
  className,
  variant = "primary",
  ...props
}: LinkButtonProps) {
  return (
    <Link className={clsx(base, variants[variant], className)} {...props} />
  );
}
