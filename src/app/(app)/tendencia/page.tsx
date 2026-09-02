import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/supabase/with-timeout";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary, intlLocale } from "@/lib/i18n";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { TrendChart } from "@/components/charts/trend-chart";
import { Money } from "@/components/ui/money";
import { formatCurrency } from "@/lib/finance";

export const metadata: Metadata = { title: "Tendencia" };

const MONTHS_BACK = 6;

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string, intl: string) {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(intl, { month: "short", year: "2-digit" })
    .format(new Date(year, month - 1, 1))
    .replace(".", "");
}

export default async function TendenciaPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).tendencia;
  const intl = intlLocale(locale);

  const now = new Date();
  const rangeStart = new Date(now.getFullYear(), now.getMonth() - (MONTHS_BACK - 1), 1);
  const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  let transactions: { type: "income" | "expense"; amount: number; date: string }[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await withTimeout(
        supabase
          .from("transactions")
          .select("type, amount, date")
          .gte("date", iso(rangeStart))
          .lte("date", iso(rangeEnd)),
      );
      transactions = data ?? [];
    } catch {
      transactions = [];
    }
  }

  const months: { key: string; ingresos: number; gastos: number }[] = [];
  for (let i = 0; i < MONTHS_BACK; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS_BACK - 1) + i, 1);
    months.push({ key: monthKey(d), ingresos: 0, gastos: 0 });
  }
  const byKey = new Map(months.map((m) => [m.key, m]));

  for (const tx of transactions ?? []) {
    const bucket = byKey.get(tx.date.slice(0, 7));
    if (!bucket) continue;
    if (tx.type === "income") bucket.ingresos += tx.amount;
    else bucket.gastos += tx.amount;
  }

  const chartData = months.map((m) => ({
    month: monthLabel(m.key, intl),
    ingresos: m.ingresos,
    gastos: m.gastos,
  }));

  const hasData = months.some((m) => m.ingresos > 0 || m.gastos > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-ink">{t.title}</h1>
        <p className="mt-1 text-sm text-ink/60">{t.subtitle(MONTHS_BACK)}</p>
      </div>

      <Panel>
        <PanelHeading>{t.monthlyTitle}</PanelHeading>
        {hasData ? (
          <TrendChart
            data={chartData}
            locale={locale}
            incomeLabel={t.income}
            expensesLabel={t.expenses}
          />
        ) : (
          <p className="text-sm text-ink/60">{t.empty}</p>
        )}
      </Panel>

      <Panel>
        <PanelHeading>{t.detailTitle}</PanelHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink/50">
                <th className="py-2 font-normal">{t.month}</th>
                <th className="py-2 font-normal text-right">{t.income}</th>
                <th className="py-2 font-normal text-right">{t.expenses}</th>
                <th className="py-2 font-normal text-right">{t.balance}</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.key} className="border-b border-line last:border-0">
                  <td className="py-2 text-ink/80">{monthLabel(m.key, intl)}</td>
                  <td className="num py-2 text-right text-olive">
                    {formatCurrency(m.ingresos, locale)}
                  </td>
                  <td className="num py-2 text-right text-brick">
                    {formatCurrency(m.gastos, locale)}
                  </td>
                  <td className="num py-2 text-right">
                    <Money amount={m.ingresos - m.gastos} locale={locale} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
