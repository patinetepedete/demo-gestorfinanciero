"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categoryToGroup } from "@/lib/finance";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import type { TransactionType } from "@/lib/supabase/types";

export interface TransactionActionState {
  error: string | null;
}

function parseTransactionForm(formData: FormData, t: Dictionary["movimientos"]["form"]) {
  const type = formData.get("type") as TransactionType;
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const isRecurring = formData.get("is_recurring") === "on";

  if (!["income", "expense"].includes(type))
    return { error: t.errors.invalidType, values: undefined };
  if (!Number.isFinite(amount) || amount <= 0)
    return { error: t.errors.invalidAmount, values: undefined };
  if (!category) return { error: t.errors.chooseCategory, values: undefined };
  if (!date) return { error: t.errors.chooseDate, values: undefined };

  return {
    error: null,
    values: {
      type,
      amount,
      category,
      group: categoryToGroup(type, category),
      description: description || null,
      date,
      is_recurring: isRecurring,
    },
  };
}

export async function createTransaction(
  _prevState: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const t = getDictionary(await getLocale()).movimientos.form;
  const parsed = parseTransactionForm(formData, t);
  if (!parsed.values) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.errors.notAuthenticated };

  const { error } = await supabase
    .from("transactions")
    .insert({ ...parsed.values, user_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/movimientos");
  revalidatePath("/");
  revalidatePath("/tendencia");
  return { error: null };
}

export async function updateTransaction(
  id: string,
  _prevState: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const t = getDictionary(await getLocale()).movimientos.form;
  const parsed = parseTransactionForm(formData, t);
  if (!parsed.values) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update(parsed.values)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/movimientos");
  revalidatePath("/");
  revalidatePath("/tendencia");
  return { error: null };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/movimientos");
  revalidatePath("/");
  revalidatePath("/tendencia");
}
