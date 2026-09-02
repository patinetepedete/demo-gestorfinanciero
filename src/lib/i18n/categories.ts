import type { Locale } from "./config";
import type { TransactionGroup } from "@/lib/supabase/types";

// Los valores canónicos (claves) se guardan siempre en español en la base de
// datos — solo la etiqueta que ve el usuario cambia con el idioma. Así el
// cambio de idioma no reescribe datos ya guardados ni rompe el agrupado
// 50/30/20 (que compara por el valor canónico).
const CATEGORY_LABELS: Record<string, Record<Locale, string>> = {
  Vivienda: { es: "Vivienda", en: "Housing" },
  Alimentación: { es: "Alimentación", en: "Groceries" },
  Transporte: { es: "Transporte", en: "Transport" },
  Servicios: { es: "Servicios", en: "Utilities" },
  Salud: { es: "Salud", en: "Health" },
  Ocio: { es: "Ocio", en: "Leisure" },
  Restaurantes: { es: "Restaurantes", en: "Dining out" },
  Compras: { es: "Compras", en: "Shopping" },
  Viajes: { es: "Viajes", en: "Travel" },
  Suscripciones: { es: "Suscripciones", en: "Subscriptions" },
  Ahorro: { es: "Ahorro", en: "Savings" },
  Inversión: { es: "Inversión", en: "Investing" },
  "Pago de deuda": { es: "Pago de deuda", en: "Debt payment" },
  Salario: { es: "Salario", en: "Salary" },
  Freelance: { es: "Freelance", en: "Freelance" },
  Inversiones: { es: "Inversiones", en: "Investments" },
  Otro: { es: "Otro", en: "Other" },
  Otros: { es: "Otros", en: "Other" },
};

const GROUP_LABELS: Record<TransactionGroup, Record<Locale, string>> = {
  Necesidades: { es: "Necesidades", en: "Needs" },
  Deseos: { es: "Deseos", en: "Wants" },
  Ahorro: { es: "Ahorro", en: "Savings" },
  Ingreso: { es: "Ingreso", en: "Income" },
};

export function categoryLabel(category: string, locale: Locale): string {
  return CATEGORY_LABELS[category]?.[locale] ?? category;
}

export function groupLabel(group: TransactionGroup, locale: Locale): string {
  return GROUP_LABELS[group][locale];
}
