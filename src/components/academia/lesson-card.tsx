"use client";

import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { completeLesson } from "@/app/(app)/academia/actions";
import type { Lesson } from "@/lib/lessons";

interface LessonCardText {
  completedBadge: string;
  check: string;
  correct: string;
  incorrect: string;
}

export function LessonCard({
  lesson,
  completed,
  t,
}: {
  lesson: Lesson;
  completed: boolean;
  t: LessonCardText;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [pending, startTransition] = useTransition();

  function submitAnswer() {
    if (selected === null) return;
    const correct = selected === lesson.question.correctIndex;
    setResult(correct ? "correct" : "incorrect");
    startTransition(() => {
      completeLesson(lesson.id, correct ? 100 : 0);
    });
  }

  return (
    <li className="rounded-2xl border border-line bg-surface/55 p-5 backdrop-blur-xl transition-shadow hover:shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <p className="flex items-center gap-2 font-heading text-lg text-ink">
            {lesson.title}
            {completed && (
              <span className="text-xs not-italic tracking-wide text-olive">
                {t.completedBadge}
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-ink/60">{lesson.summary}</p>
        </div>
        <span className="shrink-0 text-xl text-ink/40">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <p className="text-sm text-ink/80">{lesson.content}</p>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">{lesson.question.prompt}</p>
            <div className="space-y-2">
              {lesson.question.options.map((option, i) => (
                <label key={option} className="flex items-center gap-2 text-sm text-ink/80">
                  <input
                    type="radio"
                    name={`quiz-${lesson.id}`}
                    checked={selected === i}
                    onChange={() => setSelected(i)}
                    className="h-4 w-4"
                  />
                  {option}
                </label>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              disabled={selected === null || pending}
              onClick={submitAnswer}
            >
              {t.check}
            </Button>
            {result && (
              <p
                className={clsx(
                  "mt-2 text-sm",
                  result === "correct" ? "text-olive" : "text-brick",
                )}
              >
                {result === "correct" ? t.correct : t.incorrect}
              </p>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
