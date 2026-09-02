/**
 * Evita que una llamada a Supabase cuelgue la navegación cuando el backend
 * no responde (proyecto de prueba, red caída, etc.). Se usa junto a un
 * try/catch: al expirar el timeout se rechaza la promesa y el catch cae al
 * estado vacío en vez de bloquear el render.
 */
export function withTimeout<T>(promise: PromiseLike<T>, ms = 1200): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Supabase request timed out")), ms);
    }),
  ]);
}
