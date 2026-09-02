import { clsx } from "clsx";
import type { ComponentProps } from "react";

export function Panel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-line bg-surface/55 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeading({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={clsx(
        "font-heading text-xl text-ink mb-4",
        className,
      )}
      {...props}
    />
  );
}
