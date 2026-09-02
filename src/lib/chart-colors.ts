/**
 * Chart data-ink palette. Distinct from the ledger UI palette (ink/paper/oro/
 * ladrillo/oliva) because those brand hues are too close in hue/chroma to
 * pass CVD-safe categorical separation (validated with dataviz's
 * validate_palette.js against the dark surface #1A150F). Fixed order, one
 * color per entity — never reassigned based on which other categories are
 * present.
 */
export const CATEGORY_COLORS: Record<string, string> = {
  Vivienda: "#c34e54",
  Alimentación: "#00929d",
  Transporte: "#b56300",
  Servicios: "#0080cc",
  Salud: "#818000",
  Ocio: "#7b67cc",
  Restaurantes: "#009351",
  Compras: "#ae539d",
};

// Long-tail categories always fold into a single neutral "Otros" slice so
// the featured 8 stay CVD-distinct — see CATEGORY_COLORS comment.
export const OTHERS_COLOR = "#948C7C";
export const OTHERS_LABEL = "Otros";

export function colorForCategory(category: string): string {
  return CATEGORY_COLORS[category] ?? OTHERS_COLOR;
}

export const TREND_COLORS = {
  ingresos: "#00929d",
  gastos: "#c34e54",
};
