"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Field, Input } from "@/components/ui/field";
import { Money } from "@/components/ui/money";
import { computeCompoundInterest, formatCurrency } from "@/lib/finance";
import { intlLocale, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

const CONTRIBUTED_COLOR = "#8FB06B";
const INTEREST_COLOR = "#D6A94A";

export function CompoundInterestCalculator({
  t,
  locale = "es",
}: {
  t: Dictionary["estrategias"]["calc"];
  locale?: Locale;
}) {
  const [initial, setInitial] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(150);
  const [annualRate, setAnnualRate] = useState(6);
  const [years, setYears] = useState(20);

  const points = useMemo(
    () =>
      computeCompoundInterest({
        initial,
        monthlyContribution,
        annualRate,
        years: Math.max(1, Math.min(years, 60)),
      }),
    [initial, monthlyContribution, annualRate, years],
  );

  const final = points[points.length - 1];
  const yearAbbr = locale === "en" ? "y" : "a";
  const axisFormatter = (v: number) =>
    new Intl.NumberFormat(intlLocale(locale), {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={t.initial} htmlFor="initial">
          <Input
            id="initial"
            type="number"
            min="0"
            step="50"
            value={initial}
            onChange={(e) => setInitial(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label={t.monthly} htmlFor="monthly">
          <Input
            id="monthly"
            type="number"
            min="0"
            step="10"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label={t.rate} htmlFor="rate">
          <Input
            id="rate"
            type="number"
            min="0"
            max="30"
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label={t.years} htmlFor="years">
          <Input
            id="years"
            type="number"
            min="1"
            max="60"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 1)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="min-w-0 rounded-xl border border-line bg-paper/50 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wide text-ink/50">{t.finalCapital}</p>
          <p className="num mt-1 break-words text-lg sm:text-xl">
            <Money amount={final.balance} locale={locale} />
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-line bg-paper/50 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wide text-ink/50">{t.contributed}</p>
          <p className="num mt-1 break-words text-lg sm:text-xl" style={{ color: CONTRIBUTED_COLOR }}>
            {formatCurrency(final.contributed, locale)}
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-line bg-paper/50 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wide text-ink/50">{t.interest}</p>
          <p className="num mt-1 break-words text-lg sm:text-xl" style={{ color: INTEREST_COLOR }}>
            {formatCurrency(final.interest, locale)}
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#332B1C" strokeOpacity={0.7} />
            <XAxis
              dataKey="year"
              tickFormatter={(v: number) => `${v}${yearAbbr}`}
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
                name === "contributed" ? t.contributed : t.interest,
              ]}
              labelFormatter={(label) => `${t.yearWord} ${label}`}
              contentStyle={{
                background: "#1A150F",
                border: "1px solid #332B1C",
                borderRadius: 12,
                fontSize: 13,
                color: "#EDE7DA",
              }}
            />
            <Area
              type="monotone"
              dataKey="contributed"
              stackId="1"
              stroke={CONTRIBUTED_COLOR}
              fill={CONTRIBUTED_COLOR}
              fillOpacity={0.35}
            />
            <Area
              type="monotone"
              dataKey="interest"
              stackId="1"
              stroke={INTEREST_COLOR}
              fill={INTEREST_COLOR}
              fillOpacity={0.35}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
