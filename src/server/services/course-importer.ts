import { type PrismaClient } from "@prisma/client";
import { aiCourseImportSchema, type AiCourseImportPayload } from "@/lib/course-import-schema";
import { slugify } from "@/lib/utils";

export async function importAiCoursePayload(
  prisma: PrismaClient,
  payload: unknown,
  options: { adminUserId?: string | null } = {}
) {
  const parsed = aiCourseImportSchema.parse(payload);
  const courseSlug = parsed.course.slug ?? slugify(parsed.course.title);
  const course = await prisma.course.upsert({
    where: { slug: courseSlug },
    update: {
      title: parsed.course.title,
      description: parsed.course.description,
      level: parsed.course.level,
      workloadHours: parsed.course.workloadHours,
      priceCents: parsed.course.priceCents,
      status: parsed.course.status,
    },
    create: {
      title: parsed.course.title,
      slug: courseSlug,
      description: parsed.course.description,
      level: parsed.course.level,
      workloadHours: parsed.course.workloadHours,
      priceCents: parsed.course.priceCents,
      status: parsed.course.status,
    },
  });

  let importedLessons = 0;

  for (const modulePayload of parsed.modules) {
    const moduleSlug = modulePayload.slug ?? slugify(modulePayload.title);
    const courseModule = await prisma.module.upsert({
      where: { courseId_slug: { courseId: course.id, slug: moduleSlug } },
      update: { title: modulePayload.title, order: modulePayload.order },
      create: {
        courseId: course.id,
        title: modulePayload.title,
        slug: moduleSlug,
        order: modulePayload.order,
      },
    });

    for (const lessonPayload of modulePayload.lessons) {
      const lessonSlug = lessonPayload.slug ?? slugify(lessonPayload.title);
      const lesson = await prisma.lesson.upsert({
        where: { moduleId_slug: { moduleId: courseModule.id, slug: lessonSlug } },
        update: {
          title: lessonPayload.title,
          description: lessonPayload.description,
          objectives: lessonPayload.objectives,
          readingMinutes: lessonPayload.readingMinutes,
          difficulty: lessonPayload.difficulty,
          order: lessonPayload.order,
          contentMd: lessonPayload.contentMd,
        },
        create: {
          moduleId: courseModule.id,
          title: lessonPayload.title,
          slug: lessonSlug,
          description: lessonPayload.description,
          objectives: lessonPayload.objectives,
          readingMinutes: lessonPayload.readingMinutes,
          difficulty: lessonPayload.difficulty,
          order: lessonPayload.order,
          contentMd: lessonPayload.contentMd,
        },
      });

      importedLessons += 1;

      if (lessonPayload.quiz) {
        await prisma.quiz.deleteMany({ where: { lessonId: lesson.id } });
        await prisma.quiz.create({
          data: {
            lessonId: lesson.id,
            title: lessonPayload.quiz.title,
            questions: {
              create: lessonPayload.quiz.questions.map((question) => ({
                prompt: question.prompt,
                explanation: question.explanation,
                answers: { create: question.answers },
              })),
            },
          },
        });
      }

      await prisma.flashcard.deleteMany({ where: { lessonId: lesson.id } });
      if (lessonPayload.flashcards.length) {
        await prisma.flashcard.createMany({
          data: lessonPayload.flashcards.map((flashcard) => ({
            lessonId: lesson.id,
            front: flashcard.front,
            back: flashcard.back,
            difficulty: flashcard.difficulty,
          })),
        });
      }
    }
  }

  await prisma.adminLog.create({
    data: {
      userId: options.adminUserId,
      action: "IMPORT_AI_COURSE_JSON",
      metadata: { courseSlug, modules: parsed.modules.length, lessons: importedLessons },
    },
  });

  return {
    courseId: course.id,
    courseSlug,
    modules: parsed.modules.length,
    lessons: importedLessons,
  };
}

export type { AiCourseImportPayload };
