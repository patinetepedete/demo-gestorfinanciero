import type { Metadata } from "next";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { CompoundInterestCalculator } from "@/components/estrategias/compound-interest-calculator";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
import { categoryLabel, groupLabel } from "@/lib/i18n/categories";
import { EXPENSE_CATEGORIES } from "@/lib/finance";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = { title: "Estrategias" };

const RULE_GROUPS: {
  group: "Necesidades" | "Deseos" | "Ahorro";
  pct: number;
  color: string;
}[] = [
  { group: "Necesidades", pct: 50, color: "#8FB06B" },
  { group: "Deseos", pct: 30, color: "#D96B4E" },
  { group: "Ahorro", pct: 20, color: "#D6A94A" },
];

function joinCategories(categories: string[], locale: Locale) {
  const labels = categories.map((c) => categoryLabel(c, locale));
  if (labels.length <= 1) return `${labels.join("")}.`;
  const last = labels[labels.length - 1];
  const connector = locale === "en" ? "and" : "y";
  return `${labels.slice(0, -1).join(", ")} ${connector} ${last}.`;
}

export default async function EstrategiasPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).estrategias;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-ink">{t.title}</h1>
        <p className="mt-1 text-sm text-ink/60">{t.subtitle}</p>
      </div>

      <Panel>
        <PanelHeading>{t.ruleTitle}</PanelHeading>
        <p className="mb-4 text-sm text-ink/70">{t.ruleIntro}</p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {RULE_GROUPS.map((item) => (
            <li
              key={item.group}
              className="rounded-xl border border-line bg-paper/50 p-4 backdrop-blur-xl"
            >
              <span
                className="mb-2 inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: item.color }}
              />
              <p className="text-sm font-medium text-ink">
                {item.pct}% {groupLabel(item.group, locale)}
              </p>
              <p className="mt-1 text-xs text-ink/60">
                {joinCategories(EXPENSE_CATEGORIES[item.group], locale)}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <PanelHeading>{t.calcTitle}</PanelHeading>
        <p className="mb-6 text-sm text-ink/70">{t.calcIntro}</p>
        <CompoundInterestCalculator t={t.calc} locale={locale} />
      </Panel>
    </div>
  );
}
