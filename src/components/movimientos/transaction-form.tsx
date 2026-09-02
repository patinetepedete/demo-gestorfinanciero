"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/finance";
import { categoryLabel, groupLabel } from "@/lib/i18n/categories";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { TransactionActionState } from "@/app/(app)/movimientos/actions";
import type { TransactionGroup, TransactionType } from "@/lib/supabase/types";

interface TransactionFormProps {
  action: (
    state: TransactionActionState,
    formData: FormData,
  ) => Promise<TransactionActionState>;
  initial?: {
    type: TransactionType;
    amount: number;
    category: string;
    description: string | null;
    date: string;
    is_recurring: boolean;
  };
  submitLabel?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  t: Dictionary["movimientos"]["form"];
  cancelLabel?: string;
  locale?: Locale;
}

const initialState: TransactionActionState = { error: null };

export function TransactionForm({
  action,
  initial,
  submitLabel,
  onSuccess,
  onCancel,
  t,
  cancelLabel,
  locale = "es",
}: TransactionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmitted = useRef(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (pending) hasSubmitted.current = true;
  }, [pending]);

  useEffect(() => {
    if (!pending && hasSubmitted.current && !state.error) {
      hasSubmitted.current = false;
      formRef.current?.reset();
      setType("expense");
      onSuccess?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.type} htmlFor="type">
          <Select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
          >
            <option value="expense">{t.expense}</option>
            <option value="income">{t.income}</option>
          </Select>
        </Field>

        <Field label={t.amount} htmlFor="amount">
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            inputMode="decimal"
            required
            defaultValue={initial?.amount}
            className="num"
          />
        </Field>

        <Field label={t.category} htmlFor="category">
          <Select id="category" name="category" defaultValue={initial?.category} required>
            {type === "expense"
              ? Object.entries(EXPENSE_CATEGORIES).map(([group, categories]) => (
                  <optgroup key={group} label={groupLabel(group as TransactionGroup, locale)}>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {categoryLabel(category, locale)}
                      </option>
                    ))}
                  </optgroup>
                ))
              : INCOME_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel(category, locale)}
                  </option>
                ))}
          </Select>
        </Field>

        <Field label={t.date} htmlFor="date">
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={initial?.date ?? today}
          />
        </Field>
      </div>

      <Field label={t.description} htmlFor="description">
        <Textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={initial?.description ?? ""}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          name="is_recurring"
          defaultChecked={initial?.is_recurring}
          className="h-4 w-4 rounded border-line accent-ink"
        />
        {t.recurringLabel}
      </label>

      {state.error && <p className="text-sm text-brick">{state.error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t.saving : (submitLabel ?? t.submitNew)}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {cancelLabel ?? t.cancel}
          </Button>
        )}
      </div>
    </form>
  );
}
