import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/supabase/with-timeout";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { LessonCard } from "@/components/academia/lesson-card";
import { getLessons } from "@/lib/lessons";

export const metadata: Metadata = { title: "Academia" };

export default async function AcademiaPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).academia;
  const lessons = getLessons(locale);

  let progress: { lesson_id: string; completed_at: string | null }[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await withTimeout(
        supabase.from("lesson_progress").select("lesson_id, completed_at"),
      );
      progress = data ?? [];
    } catch {
      progress = [];
    }
  }

  const completedIds = new Set(
    progress.filter((p) => p.completed_at).map((p) => p.lesson_id),
  );

  // Solo strings planos: LessonCard es un Client Component y no puede recibir
  // `t` completo (t.progress es una función y no es serializable como prop).
  const lessonCardText = {
    completedBadge: t.completedBadge,
    check: t.check,
    correct: t.correct,
    incorrect: t.incorrect,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-ink">{t.title}</h1>
        <p className="mt-1 text-sm text-ink/60">
          {t.progress(completedIds.size, lessons.length)}
        </p>
      </div>

      <Panel>
        <PanelHeading>{t.lessonsTitle}</PanelHeading>
        <ul className="space-y-3">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={completedIds.has(lesson.id)}
              t={lessonCardText}
            />
          ))}
        </ul>
      </Panel>
    </div>
  );
}
