"use client";

import { useState } from "react";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/i18n";

export function ChangePasswordForm({ t }: { t: Dictionary["cuenta"] }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({});

    if (password.length < 8) {
      setStatus({ error: t.errors.passwordTooShort });
      return;
    }
    if (password !== confirm) {
      setStatus({ error: t.errors.passwordMismatch });
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) {
      setStatus({ error: error.message });
      return;
    }

    setPassword("");
    setConfirm("");
    setStatus({ success: t.passwordUpdated });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label={t.newPassword} htmlFor="new-password">
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>
      <Field label={t.confirmPassword} htmlFor="confirm-password">
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </Field>

      {status.error && <p className="text-sm text-brick">{status.error}</p>}
      {status.success && <p className="text-sm text-olive">{status.success}</p>}

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? t.updating : t.updatePassword}
      </Button>
    </form>
  );
}
