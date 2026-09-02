import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { PanelHeading } from "@/components/ui/panel";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const t = getDictionary(await getLocale()).auth;

  return (
    <>
      <PanelHeading className="mb-6 text-center">{t.loginTitle}</PanelHeading>
      <LoginForm next={next ?? "/"} t={t} />
    </>
  );
}
