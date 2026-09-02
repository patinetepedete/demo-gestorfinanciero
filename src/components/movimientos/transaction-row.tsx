"use client";

import { useState, useTransition } from "react";
import { Money } from "@/components/ui/money";
import { formatDate } from "@/lib/finance";
import { categoryLabel } from "@/lib/i18n/categories";
import { TransactionForm } from "./transaction-form";
import { updateTransaction, deleteTransaction } from "@/app/(app)/movimientos/actions";
import type { Database } from "@/lib/supabase/types";
import type { Dictionary, Locale } from "@/lib/i18n";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export function TransactionRow({
  transaction,
  t,
  locale = "es",
}: {
  transaction: Transaction;
  t: Dictionary["movimientos"];
  locale?: Locale;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="rounded-xl border border-line bg-paper/50 p-4 backdrop-blur-xl">
        <TransactionForm
          action={updateTransaction.bind(null, transaction.id)}
          initial={{
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            date: transaction.date,
            is_recurring: transaction.is_recurring,
          }}
          submitLabel={t.form.submitEdit}
          onCancel={() => setEditing(false)}
          onSuccess={() => setEditing(false)}
          t={t.form}
          locale={locale}
        />
      </li>
    );
  }

  function handleDelete() {
    if (!confirm(t.confirmDelete)) return;
    startTransition(() => {
      deleteTransaction(transaction.id);
    });
  }

  return (
    <li className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm text-ink">
          {categoryLabel(transaction.category, locale)}
          {transaction.description && (
            <span className="text-ink/50"> · {transaction.description}</span>
          )}
        </p>
        <p className="text-xs text-ink/50">
          {formatDate(transaction.date, locale)}
          {transaction.is_recurring && ` · ${t.recurringTag}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <Money
          amount={transaction.type === "income" ? transaction.amount : -transaction.amount}
          signed
          locale={locale}
          className={transaction.type === "income" ? "text-olive" : "text-brick"}
        />
        <div className="flex gap-3 text-xs uppercase tracking-wide">
          <button onClick={() => setEditing(true)} className="text-ink/50 hover:text-ink">
            {t.editAction}
          </button>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="text-ink/50 hover:text-brick disabled:opacity-50"
          >
            {pending ? "…" : t.deleteAction}
          </button>
        </div>
      </div>
    </li>
  );
}
