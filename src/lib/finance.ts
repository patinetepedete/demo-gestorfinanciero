export const EXPENSE_CATEGORIES: Record<
  "Necesidades" | "Deseos" | "Ahorro",
  string[]
> = {
  Necesidades: ["Vivienda", "Alimentación", "Transporte", "Servicios", "Salud"],
  Deseos: ["Ocio", "Restaurantes", "Compras", "Viajes", "Suscripciones"],
  Ahorro: ["Ahorro", "Inversión", "Pago de deuda"],
};

export const INCOME_CATEGORIES = ["Salario", "Freelance", "Inversiones", "Otro"];

export function categoryToGroup(
  type: "income" | "expense",
  category: string,
): "Necesidades" | "Deseos" | "Ahorro" | "Ingreso" {
  if (type === "income") return "Ingreso";
  for (const [group, categories] of Object.entries(EXPENSE_CATEGORIES)) {
    if (categories.includes(category)) {
      return group as "Necesidades" | "Deseos" | "Ahorro";
    }
  }
  return "Necesidades";
}

export function formatCurrency(amount: number, locale: "es" | "en" = "es"): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, locale: "es" | "en" = "es"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export interface BudgetSplit {
  necesidades: number;
  deseos: number;
  ahorro: number;
  totalGasto: number;
  totalIngreso: number;
}

/** Reparto real del gasto entre los tres grupos de la regla 50/30/20. */
export function computeBudgetSplit(
  transactions: { type: "income" | "expense"; group: string; amount: number }[],
): BudgetSplit {
  let necesidades = 0;
  let deseos = 0;
  let ahorro = 0;
  let totalIngreso = 0;

  for (const t of transactions) {
    if (t.type === "income") {
      totalIngreso += t.amount;
      continue;
    }
    if (t.group === "Necesidades") necesidades += t.amount;
    else if (t.group === "Deseos") deseos += t.amount;
    else if (t.group === "Ahorro") ahorro += t.amount;
  }

  return {
    necesidades,
    deseos,
    ahorro,
    totalGasto: necesidades + deseos + ahorro,
    totalIngreso,
  };
}

export interface CompoundInterestInput {
  initial: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
}

export interface CompoundInterestPoint {
  year: number;
  balance: number;
  contributed: number;
  interest: number;
}

/** Interés compuesto con aportaciones mensuales, capitalización mensual. */
export function computeCompoundInterest({
  initial,
  monthlyContribution,
  annualRate,
  years,
}: CompoundInterestInput): CompoundInterestPoint[] {
  const monthlyRate = annualRate / 100 / 12;
  const points: CompoundInterestPoint[] = [];

  let balance = initial;
  let contributed = initial;

  points.push({ year: 0, balance, contributed, interest: 0 });

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributed += monthlyContribution;
    }
    points.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contributed: Math.round(contributed * 100) / 100,
      interest: Math.round((balance - contributed) * 100) / 100,
    });
  }

  return points;
}
