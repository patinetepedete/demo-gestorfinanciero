import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-paper px-4 py-16">
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
