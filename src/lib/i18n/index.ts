import { es } from "./dictionaries/es";
import { en } from "./dictionaries/en";
import type { Locale } from "./config";

// Nota: `getLocale` (usa next/headers) vive aparte en `./get-locale` y NO se
// reexporta aquí a propósito, para que los componentes cliente puedan
// importar de este barrel (Dictionary, Locale, getDictionary...) sin arrastrar
// una dependencia server-only.
export type { Dictionary } from "./dictionaries/es";
export type { Locale } from "./config";
export { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, intlLocale } from "./config";

const dictionaries = { es, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
