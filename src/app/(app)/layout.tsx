import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/supabase/with-timeout";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
import { AppNav } from "@/components/nav/app-nav";

// TODO: volver a exigir sesión (redirect a /login si no hay user) cuando
// conectemos un proyecto de Supabase real.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await withTimeout(supabase.auth.getUser());
      email = user?.email ?? null;
    } catch {
      email = null;
    }
  }

  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <AppNav email={email} t={t.nav} />
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
