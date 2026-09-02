"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { colorForCategory, OTHERS_COLOR, OTHERS_LABEL } from "@/lib/chart-colors";
import { formatCurrency } from "@/lib/finance";
import { categoryLabel } from "@/lib/i18n/categories";
import type { Locale } from "@/lib/i18n/config";

interface Slice {
  category: string;
  amount: number;
}

export function ExpenseCategoryChart({
  data,
  emptyText = "No expenses logged yet this month.",
  locale = "es",
}: {
  data: Slice[];
  emptyText?: string;
  locale?: Locale;
}) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const label = (category: string) => categoryLabel(category, locale);

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink/50">
        {emptyText}
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="mx-auto h-56 w-56 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sorted}
              dataKey="amount"
              nameKey="category"
              innerRadius={58}
              outerRadius={96}
              paddingAngle={3}
              cornerRadius={8}
              stroke="#1A150F"
              strokeWidth={2}
            >
              {sorted.map((slice) => (
                <Cell
                  key={slice.category}
                  fill={
                    slice.category === OTHERS_LABEL
                      ? OTHERS_COLOR
                      : colorForCategory(slice.category)
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(Number(value), locale),
                label(String(name)),
              ]}
              contentStyle={{
                background: "#1A150F",
                border: "1px solid #332B1C",
                borderRadius: 12,
                fontSize: 13,
                color: "#EDE7DA",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="flex-1 space-y-2">
        {sorted.map((slice) => (
          <li
            key={slice.category}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 text-ink/80">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  background:
                    slice.category === OTHERS_LABEL
                      ? OTHERS_COLOR
                      : colorForCategory(slice.category),
                }}
              />
              {label(slice.category)}
            </span>
            <span className="num shrink-0 text-ink/70">
              {formatCurrency(slice.amount, locale)}
              <span className="ml-2 text-ink/40">
                {Math.round((slice.amount / total) * 100)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
