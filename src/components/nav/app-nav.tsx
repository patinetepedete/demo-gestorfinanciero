"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/i18n";

export function AppNav({
  email,
  t,
}: {
  email: string | null;
  t: Dictionary["nav"];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const LINKS = [
    { href: "/", label: t.panel },
    { href: "/movimientos", label: t.movimientos },
    { href: "/tendencia", label: t.tendencia },
    { href: "/academia", label: t.academia },
    { href: "/estrategias", label: t.estrategias },
    { href: "/cuenta", label: t.cuenta },
  ];

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-line bg-surface/55 px-4 py-3 backdrop-blur-xl md:hidden">
        <Link href="/" className="font-heading text-lg">
          {t.brandInline}
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-line px-3 py-1.5 text-sm"
          aria-label={t.menuOpen}
        >
          {open ? t.menuClose : t.menuOpen}
        </button>
      </div>

      <nav
        className={clsx(
          "border-line bg-surface/55 backdrop-blur-xl md:flex md:h-full md:w-56 md:flex-col md:overflow-y-auto md:border-r",
          open ? "block" : "hidden md:flex",
        )}
      >
        <div className="hidden border-b border-line px-6 py-6 md:block">
          <Link href="/" className="font-heading text-xl leading-tight">
            {t.brand1}
            <br />
            {t.brand2}
          </Link>
        </div>

        <ul className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block rounded-xl px-3 py-2 text-sm tracking-wide transition-colors",
                  isActive(link.href)
                    ? "bg-ink text-paper shadow-[0_2px_14px_rgba(237,231,218,0.15)]"
                    : "text-ink/70 hover:bg-line/40 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-line px-6 py-4">
          {email && (
            <p className="mb-3 truncate text-xs text-ink/50" title={email}>
              {email}
            </p>
          )}
          <button
            onClick={signOut}
            className="text-xs uppercase tracking-wide text-ink/60 hover:text-brick"
          >
            {t.signOut}
          </button>
        </div>
      </nav>
    </>
  );
}
