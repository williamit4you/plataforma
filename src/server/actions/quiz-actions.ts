"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function submitQuizAction(formData: FormData) {
  const user = await requireUser();
  const quizId = String(formData.get("quizId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const lessonSlug = String(formData.get("lessonSlug") ?? "");

  if (!quizId || quizId.startsWith("mock-")) return;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { include: { answers: true } } },
  });

  if (!quiz) return;

  const selectedAnswers = quiz.questions.map((question) => {
    const selectedAnswerId = String(formData.get(`question-${question.id}`) ?? "");
    const selectedAnswer = question.answers.find((answer) => answer.id === selectedAnswerId);
    const correctAnswer = question.answers.find((answer) => answer.isCorrect);
    return {
      questionId: question.id,
      selectedAnswerId,
      correctAnswerId: correctAnswer?.id ?? null,
      isCorrect: Boolean(selectedAnswer?.isCorrect),
    };
  });

  const score = selectedAnswers.filter((answer) => answer.isCorrect).length;
  const total = quiz.questions.length;

  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId,
      score,
      total,
      answers: selectedAnswers,
    },
  });

  if (total > 0) {
    await prisma.xpEvent.create({
      data: {
        userId: user.id,
        amount: score === total ? 20 : Math.max(5, score * 5),
        reason: "QUIZ_ANSWERED",
      },
    });
  }

  revalidatePath(`/courses/${courseSlug}/lessons/${lessonSlug}`);
  revalidatePath("/dashboard");
}
