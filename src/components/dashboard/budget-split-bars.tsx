import { clsx } from "clsx";
import { formatCurrency } from "@/lib/finance";
import type { Locale } from "@/lib/i18n/config";

interface Row {
  label: string;
  amount: number;
  targetPct: number;
  color: string;
}

export function BudgetSplitBars({
  rows,
  totalIngreso,
  targetLabel = "target",
  locale = "es",
}: {
  rows: Row[];
  totalIngreso: number;
  targetLabel?: string;
  locale?: Locale;
}) {
  return (
    <div className="space-y-5">
      {rows.map((row) => {
        const actualPct = totalIngreso > 0 ? (row.amount / totalIngreso) * 100 : 0;
        const overTarget = actualPct > row.targetPct;

        return (
          <div key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: row.color }}
                />
                {row.label}
                <span className="text-ink/40">
                  {targetLabel} {row.targetPct}%
                </span>
              </span>
              <span className="num text-ink/70">
                {formatCurrency(row.amount, locale)}{" "}
                <span
                  className={clsx(
                    overTarget ? "text-brick" : "text-ink/50",
                  )}
                >
                  ({actualPct.toFixed(0)}%)
                </span>
              </span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full border border-line bg-paper">
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${Math.min(actualPct, 100)}%`,
                  background: row.color,
                }}
              />
              <div
                className="absolute top-0 h-full w-px bg-ink/60"
                style={{ left: `${Math.min(row.targetPct, 100)}%` }}
                title={`${targetLabel}: ${row.targetPct}%`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
