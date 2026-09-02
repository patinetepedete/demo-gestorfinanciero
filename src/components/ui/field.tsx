import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

const controlClass =
  "focus-glow w-full rounded-xl border border-line bg-paper/50 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 backdrop-blur-sm transition-colors";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={clsx(controlClass, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={clsx(controlClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={clsx(controlClass, className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs uppercase tracking-wide text-ink/60">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-brick">{error}</p>}
    </div>
  );
}
