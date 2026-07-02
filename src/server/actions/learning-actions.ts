"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { calculateNextReview } from "@/lib/learning";

export async function completeLessonAction(formData: FormData) {
  const user = await requireUser();
  const lessonId = String(formData.get("lessonId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");

  try {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: { completedAt: new Date() },
      create: { userId: user.id, lessonId, completedAt: new Date() },
    });
    await prisma.xpEvent.create({ data: { userId: user.id, amount: 25, reason: "LESSON_COMPLETED" } });
  } catch {}

  revalidatePath(`/courses/${courseSlug}`);
}

const reviewSchema = z.object({
  rating: z.enum(["again", "hard", "good", "easy"]),
  flashcardId: z.string(),
});

export async function reviewFlashcardAction(formData: FormData) {
  const user = await requireUser();
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  try {
    await prisma.flashcardReview.create({
      data: {
        userId: user.id,
        flashcardId: parsed.data.flashcardId,
        rating: parsed.data.rating,
        correctCount: parsed.data.rating === "again" ? 0 : 1,
        wrongCount: parsed.data.rating === "again" ? 1 : 0,
        nextReviewAt: calculateNextReview(parsed.data.rating),
      },
    });
    await prisma.xpEvent.create({ data: { userId: user.id, amount: 5, reason: "FLASHCARD_REVIEWED" } });
  } catch {}

  revalidatePath("/reviews");
}

export async function issueCertificateAction(formData: FormData) {
  const user = await requireUser();
  const courseId = String(formData.get("courseId") ?? "");
  const code = `CERT-${Date.now().toString(36).toUpperCase()}-${user.id.slice(0, 5).toUpperCase()}`;

  try {
    await prisma.certificate.create({ data: { userId: user.id, courseId, code } });
  } catch {}

  revalidatePath("/certificates");
}
