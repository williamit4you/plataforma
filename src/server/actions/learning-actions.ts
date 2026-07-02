"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { calculateNextReview } from "@/lib/learning";

async function touchStudyStreak(userId: string) {
  const now = new Date();
  const current = await prisma.studyStreak.findUnique({ where: { userId } });
  const last = current?.lastStudyAt;
  const today = now.toDateString();
  const lastDay = last?.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const nextCurrentDays =
    !last || lastDay === today ? current?.currentDays ?? 1 : lastDay === yesterday.toDateString() ? current.currentDays + 1 : 1;
  const nextBestDays = Math.max(current?.bestDays ?? 0, nextCurrentDays);

  await prisma.studyStreak.upsert({
    where: { userId },
    update: { currentDays: nextCurrentDays, bestDays: nextBestDays, lastStudyAt: now },
    create: { userId, currentDays: 1, bestDays: 1, lastStudyAt: now },
  });
}

export async function completeLessonAction(formData: FormData) {
  const user = await requireUser();
  const lessonId = String(formData.get("lessonId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");
  if (!process.env.DATABASE_URL || lessonId.startsWith("mock-")) return;

  try {
    const existingProgress = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId } },
    });

    await prisma.progress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: { completedAt: new Date() },
      create: { userId: user.id, lessonId, completedAt: new Date() },
    });

    if (!existingProgress?.completedAt) {
      await prisma.xpEvent.create({ data: { userId: user.id, amount: 25, reason: "LESSON_COMPLETED" } });
      await touchStudyStreak(user.id);

      const completedLessons = await prisma.progress.count({
        where: { userId: user.id, completedAt: { not: null } },
      });
      if (completedLessons === 1) {
        const achievement = await prisma.achievement.findUnique({ where: { key: "first_lesson" } });
        if (achievement) {
          await prisma.userAchievement.upsert({
            where: { userId_achievementId: { userId: user.id, achievementId: achievement.id } },
            update: {},
            create: { userId: user.id, achievementId: achievement.id },
          });
        }
      }
    }
  } catch {}

  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath("/dashboard");
}

const reviewSchema = z.object({
  rating: z.enum(["again", "hard", "good", "easy"]),
  flashcardId: z.string(),
});

export async function reviewFlashcardAction(formData: FormData) {
  const user = await requireUser();
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  if (!process.env.DATABASE_URL || parsed.data.flashcardId.startsWith("mock-")) return;

  try {
    const flashcard = await prisma.flashcard.findUnique({ where: { id: parsed.data.flashcardId } });
    if (!flashcard) return;

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
    await touchStudyStreak(user.id);
  } catch {}

  revalidatePath("/reviews");
}

export async function issueCertificateAction(formData: FormData) {
  const user = await requireUser();
  const courseId = String(formData.get("courseId") ?? "");
  const code = `CERT-${Date.now().toString(36).toUpperCase()}-${user.id.slice(0, 5).toUpperCase()}`;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { lessons: true } } },
    });

    if (!course) return;

    const lessonIds = course.modules.flatMap((module) => module.lessons).map((lesson) => lesson.id);
    const completedCount = await prisma.progress.count({
      where: { userId: user.id, lessonId: { in: lessonIds }, completedAt: { not: null } },
    });

    if (lessonIds.length === 0 || completedCount < lessonIds.length) return;

    const existingCertificate = await prisma.certificate.findFirst({ where: { userId: user.id, courseId } });
    if (!existingCertificate) {
      await prisma.certificate.create({ data: { userId: user.id, courseId, code } });
      await prisma.xpEvent.create({ data: { userId: user.id, amount: 100, reason: "COURSE_CERTIFICATE_ISSUED" } });
    }
  } catch {}

  revalidatePath("/certificates");
}
