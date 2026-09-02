import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { PanelHeading } from "@/components/ui/panel";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = { title: "Crear cuenta" };

export default async function SignupPage() {
  const t = getDictionary(await getLocale()).auth;

  return (
    <>
      <PanelHeading className="mb-6 text-center">{t.signupTitle}</PanelHeading>
      <SignupForm t={t} />
    </>
  );
}
