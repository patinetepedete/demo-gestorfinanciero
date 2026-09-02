"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function completeLesson(lessonId: string, score: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No has iniciado sesión.");

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
      quiz_score: score,
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (error) throw new Error(error.message);

  revalidatePath("/academia");
}
