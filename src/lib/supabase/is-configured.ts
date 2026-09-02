/**
 * Mientras no haya un proyecto de Supabase real, NEXT_PUBLIC_SUPABASE_URL
 * apunta a un dominio placeholder que nunca responde: cualquier llamada se
 * queda esperando hasta el timeout. Comprobar esto antes de llamar evita esa
 * espera por completo en vez de limitarla.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder"));
}
