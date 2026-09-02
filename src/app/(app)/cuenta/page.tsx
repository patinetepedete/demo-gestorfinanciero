import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/supabase/with-timeout";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { ChangePasswordForm } from "@/components/cuenta/change-password-form";
import { SignOutButton } from "@/components/cuenta/sign-out-button";
import { LanguageSwitcher } from "@/components/cuenta/language-switcher";
import { formatDate } from "@/lib/finance";

export const metadata: Metadata = { title: "Cuenta" };

export default async function CuentaPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).cuenta;

  let user: { email?: string | null; created_at?: string } | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user: fetchedUser },
      } = await withTimeout(supabase.auth.getUser());
      user = fetchedUser;
    } catch {
      user = null;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-ink">{t.title}</h1>
      </div>

      <Panel>
        <PanelHeading>{t.detailsTitle}</PanelHeading>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-line py-2">
            <dt className="text-ink/60">{t.email}</dt>
            <dd className="text-ink">{user?.email}</dd>
          </div>
          {user?.created_at && (
            <div className="flex justify-between py-2">
              <dt className="text-ink/60">{t.createdAt}</dt>
              <dd className="text-ink">{formatDate(user.created_at, locale)}</dd>
            </div>
          )}
        </dl>
      </Panel>

      <Panel>
        <PanelHeading>{t.languageTitle}</PanelHeading>
        <p className="mb-4 text-sm text-ink/70">{t.languageIntro}</p>
        <LanguageSwitcher current={locale} />
      </Panel>

      <Panel>
        <PanelHeading>{t.changePasswordTitle}</PanelHeading>
        <ChangePasswordForm t={t} />
      </Panel>

      <Panel>
        <PanelHeading>{t.sessionTitle}</PanelHeading>
        <SignOutButton label={t.signOut} />
      </Panel>
    </div>
  );
}
