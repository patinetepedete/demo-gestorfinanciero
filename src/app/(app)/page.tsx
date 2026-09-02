import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/supabase/with-timeout";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary, intlLocale } from "@/lib/i18n";
import { groupLabel } from "@/lib/i18n/categories";
import { computeBudgetSplit, formatCurrency } from "@/lib/finance";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { Money } from "@/components/ui/money";
import { BudgetSplitBars } from "@/components/dashboard/budget-split-bars";
import { ExpenseCategoryChart } from "@/components/charts/expense-category-chart";
import { CATEGORY_COLORS, OTHERS_LABEL } from "@/lib/chart-colors";
import { LinkButton } from "@/components/ui/button";

function monthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { start: iso(start), end: iso(end) };
}

export default async function DashboardPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).dashboard;
  const { start, end } = monthRange(new Date());

  let rows: { type: "income" | "expense"; amount: number; category: string; group: string; date: string }[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: transactions } = await withTimeout(
        supabase
          .from("transactions")
          .select("type, amount, category, group, date")
          .gte("date", start)
          .lte("date", end),
      );
      rows = transactions ?? [];
    } catch {
      rows = [];
    }
  }
  const split = computeBudgetSplit(rows);
  const balance = split.totalIngreso - split.totalGasto;

  const byCategory = new Map<string, number>();
  for (const t of rows) {
    if (t.type !== "expense") continue;
    byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
  }

  let otros = 0;
  const pieData: { category: string; amount: number }[] = [];
  for (const [category, amount] of byCategory) {
    if (CATEGORY_COLORS[category]) {
      pieData.push({ category, amount });
    } else {
      otros += amount;
    }
  }
  if (otros > 0) pieData.push({ category: OTHERS_LABEL, amount: otros });

  const monthLabel = new Intl.DateTimeFormat(intlLocale(locale), {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-ink/50">
          {monthLabel}
        </p>
        <h1 className="font-heading text-3xl text-ink">{t.title}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Panel>
          <p className="text-xs uppercase tracking-wide text-ink/50">{t.balance}</p>
          <p className="num mt-2 text-2xl">
            <Money amount={balance} locale={locale} />
          </p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-ink/50">{t.income}</p>
          <p className="num mt-2 text-2xl text-olive">
            {formatCurrency(split.totalIngreso, locale)}
          </p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-ink/50">{t.expenses}</p>
          <p className="num mt-2 text-2xl text-brick">
            {formatCurrency(split.totalGasto, locale)}
          </p>
        </Panel>
      </div>

      <Panel>
        <PanelHeading>{t.splitTitle}</PanelHeading>
        {split.totalIngreso === 0 ? (
          <p className="text-sm text-ink/60">
            {t.splitEmpty}{" "}
            <LinkButton href="/movimientos" variant="ghost" className="px-0 underline">
              {t.addMovement}
            </LinkButton>
          </p>
        ) : (
          <BudgetSplitBars
            totalIngreso={split.totalIngreso}
            targetLabel={t.target}
            locale={locale}
            rows={[
              {
                label: groupLabel("Necesidades", locale),
                amount: split.necesidades,
                targetPct: 50,
                color: "#8FB06B",
              },
              {
                label: groupLabel("Deseos", locale),
                amount: split.deseos,
                targetPct: 30,
                color: "#D96B4E",
              },
              {
                label: groupLabel("Ahorro", locale),
                amount: split.ahorro,
                targetPct: 20,
                color: "#D6A94A",
              },
            ]}
          />
        )}
      </Panel>

      <Panel>
        <PanelHeading>{t.categoryTitle}</PanelHeading>
        <ExpenseCategoryChart data={pieData} emptyText={t.noExpenses} locale={locale} />
      </Panel>
    </div>
  );
}
