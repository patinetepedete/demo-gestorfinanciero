import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { LanguageSwitcher } from "@/components/cuenta/language-switcher";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-paper px-4 py-16">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageSwitcher current={locale} />
      </div>

      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center font-heading text-2xl text-ink">
          Gestor de Finanzas
        </Link>
        <div className="rounded-2xl border border-line bg-surface/55 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
