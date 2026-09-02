"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { login, type AuthActionState } from "@/app/(auth)/actions";
import type { Dictionary } from "@/lib/i18n";

const initialState: AuthActionState = { error: null };

export function LoginForm({ next, t }: { next: string; t: Dictionary["auth"] }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <Field label={t.email} htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>

      <Field label={t.password} htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      {state.error && <p className="text-sm text-brick">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? t.loggingIn : t.login}
      </Button>

      <p className="text-center text-sm text-ink/60">
        {t.noAccount}{" "}
        <Link href="/registro" className="text-ink underline">
          {t.signUpLink}
        </Link>
      </p>
    </form>
  );
}
