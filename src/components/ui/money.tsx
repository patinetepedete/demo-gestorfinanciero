import { clsx } from "clsx";
import { formatCurrency } from "@/lib/finance";
import type { Locale } from "@/lib/i18n/config";

export function Money({
  amount,
  className,
  signed = false,
  locale = "es",
}: {
  amount: number;
  className?: string;
  signed?: boolean;
  locale?: Locale;
}) {
  const sign = signed && amount > 0 ? "+" : "";
  return (
    <span className={clsx("num", className)}>
      {sign}
      {formatCurrency(amount, locale)}
    </span>
  );
}
