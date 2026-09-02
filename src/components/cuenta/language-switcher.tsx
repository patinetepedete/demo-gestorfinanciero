"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { setLocale } from "@/app/(app)/cuenta/actions";
import type { Locale } from "@/lib/i18n/config";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "es", label: "Español" },
  { locale: "en", label: "English" },
];

export function LanguageSwitcher({ current }: { current: Locale }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function choose(locale: Locale) {
    if (locale === current || pending) return;
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.locale}
          type="button"
          disabled={pending}
          onClick={() => choose(option.locale)}
          className={clsx(
            "rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-50",
            current === option.locale
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink/70 hover:bg-surface/60",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
