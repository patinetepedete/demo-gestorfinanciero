"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { signup, type AuthActionState } from "@/app/(auth)/actions";
import type { Dictionary } from "@/lib/i18n";

const initialState: AuthActionState = { error: null };

export function SignupForm({ t }: { t: Dictionary["auth"] }) {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label={t.email} htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>

      <Field label={t.password} htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>

      {state.error && <p className="text-sm text-brick">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? t.signingUp : t.signup}
      </Button>

      <p className="text-center text-sm text-ink/60">
        {t.hasAccount}{" "}
        <Link href="/login" className="text-ink underline">
          {t.loginLink}
        </Link>
      </p>
    </form>
  );
}
