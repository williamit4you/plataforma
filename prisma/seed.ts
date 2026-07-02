import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { courses, flashcards, lessons, quizzes, slugify } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "willianbarata@gmail.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_SEED_PASSWORD is required to seed the admin user.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Willian Barata",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      name: "Willian Barata",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        workloadHours: courseData.hours,
        priceCents: 6990,
        status: "PUBLISHED",
      },
      create: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        level: courseData.level,
        workloadHours: courseData.hours,
        priceCents: 6990,
        status: "PUBLISHED",
      },
    });

    for (const [moduleIndex, moduleTitle] of courseData.modules.entries()) {
      const courseModule = await prisma.module.upsert({
        where: { courseId_slug: { courseId: course.id, slug: slugify(moduleTitle) } },
        update: { title: moduleTitle, order: moduleIndex + 1 },
        create: {
          courseId: course.id,
          title: moduleTitle,
          slug: slugify(moduleTitle),
          order: moduleIndex + 1,
        },
      });

      const moduleLessons = lessons.filter(
        (lesson) => lesson.courseSlug === course.slug && lesson.moduleTitle === moduleTitle
      );

      for (const [lessonIndex, lessonData] of moduleLessons.entries()) {
        const lesson = await prisma.lesson.upsert({
          where: { moduleId_slug: { moduleId: courseModule.id, slug: lessonData.slug } },
          update: {
            title: lessonData.title,
            description: `Aula pratica sobre ${moduleTitle}.`,
            contentMd: lessonData.markdown,
          },
          create: {
            moduleId: courseModule.id,
            title: lessonData.title,
            slug: lessonData.slug,
            description: `Aula pratica sobre ${moduleTitle}.`,
            objectives: ["Entender o conceito", "Aplicar na pratica", "Evitar erros comuns"],
            readingMinutes: lessonData.readingTime,
            difficulty: lessonData.difficulty,
            contentMd: lessonData.markdown,
            order: lessonIndex + 1,
          },
        });

        const existingQuiz = await prisma.quiz.findFirst({
          where: { lessonId: lesson.id, title: `Quiz - ${lessonData.title}` },
        });

        if (!existingQuiz) {
          await prisma.quiz.create({
            data: {
              lessonId: lesson.id,
              title: `Quiz - ${lessonData.title}`,
              questions: {
                create: quizzes.map((quizItem) => ({
                  prompt: quizItem.question,
                  explanation: "A resposta correta reforca a tomada de decisao baseada em dados.",
                  answers: {
                    create: quizItem.answers.map((answer, index) => ({
                      text: answer,
                      isCorrect: index === quizItem.correct,
                    })),
                  },
                })),
              },
            },
          });
        }

        for (const card of flashcards) {
          const existingCard = await prisma.flashcard.findFirst({
            where: { lessonId: lesson.id, front: card.front },
          });

          if (!existingCard) {
            await prisma.flashcard.create({
              data: {
                lessonId: lesson.id,
                front: card.front,
                back: card.back,
              },
            });
          }
        }
      }
    }
  }

  await prisma.achievement.upsert({
    where: { key: "first_lesson" },
    update: {},
    create: {
      key: "first_lesson",
      title: "Primeira aula concluida",
      description: "Concluiu a primeira aula da plataforma.",
      xp: 50,
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
