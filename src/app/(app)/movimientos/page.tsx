import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/supabase/with-timeout";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { TransactionForm } from "@/components/movimientos/transaction-form";
import { TransactionRow } from "@/components/movimientos/transaction-row";
import { createTransaction } from "./actions";
import type { Database } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Movimientos" };

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export default async function MovimientosPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).movimientos;
  let rows: Transaction[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: transactions } = await withTimeout(
        supabase
          .from("transactions")
          .select("*")
          .order("date", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(200),
      );
      rows = transactions ?? [];
    } catch {
      rows = [];
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-ink">{t.title}</h1>
        <p className="mt-1 text-sm text-ink/60">{t.subtitle}</p>
      </div>

      <Panel>
        <PanelHeading>{t.newTitle}</PanelHeading>
        <TransactionForm action={createTransaction} t={t.form} locale={locale} />
      </Panel>

      <Panel>
        <PanelHeading>{t.historyTitle}</PanelHeading>
        {rows.length === 0 ? (
          <p className="text-sm text-ink/60">{t.empty}</p>
        ) : (
          <ul>
            {rows.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                t={t}
                locale={locale}
              />
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
