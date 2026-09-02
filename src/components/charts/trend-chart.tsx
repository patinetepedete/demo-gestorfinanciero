"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TREND_COLORS } from "@/lib/chart-colors";
import { formatCurrency } from "@/lib/finance";
import { intlLocale, type Locale } from "@/lib/i18n/config";

interface MonthPoint {
  month: string;
  ingresos: number;
  gastos: number;
}

export function TrendChart({
  data,
  locale = "es",
  incomeLabel = "Income",
  expensesLabel = "Expenses",
}: {
  data: MonthPoint[];
  locale?: Locale;
  incomeLabel?: string;
  expensesLabel?: string;
}) {
  const seriesLabel = (key: string) => (key === "ingresos" ? incomeLabel : expensesLabel);
  const axisFormatter = (v: number) =>
    new Intl.NumberFormat(intlLocale(locale), {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#332B1C" strokeOpacity={0.7} />
          <XAxis
            dataKey="month"
            axisLine={{ stroke: "#332B1C" }}
            tickLine={false}
            tick={{ fill: "#EDE7DA", fontSize: 12, opacity: 0.7 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#EDE7DA", fontSize: 12, opacity: 0.5 }}
            tickFormatter={axisFormatter}
            width={72}
          />
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value), locale),
              seriesLabel(String(name)),
            ]}
            contentStyle={{
              background: "#1A150F",
              border: "1px solid #332B1C",
              borderRadius: 12,
              fontSize: 13,
              color: "#EDE7DA",
            }}
          />
          <Legend
            formatter={(value: string) => seriesLabel(value)}
            wrapperStyle={{ fontSize: 13, color: "#EDE7DA" }}
          />
          <Bar
            dataKey="ingresos"
            fill={TREND_COLORS.ingresos}
            radius={[8, 8, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="gastos"
            fill={TREND_COLORS.gastos}
            radius={[8, 8, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
