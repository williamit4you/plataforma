import { prisma } from "@/lib/prisma";
import { courses, flashcards, lessons, quizzes } from "@/lib/mock-data";

export type LessonListItem = {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  readingMinutes: number;
  completed?: boolean;
};

export type CourseWithModules = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  workloadHours: number;
  priceCents: number;
  modules: {
    id: string;
    title: string;
    slug: string;
    order: number;
    lessons: LessonListItem[];
  }[];
};

export type LessonDetail = {
  course: CourseWithModules;
  lesson: LessonListItem & {
    description: string;
    contentMd: string;
    objectives: string[];
    completed?: boolean;
  };
  quizzes: {
    id: string;
    title: string;
    questions: {
      id: string;
      prompt: string;
      explanation: string;
      answers: { id: string; text: string; isCorrect?: boolean }[];
    }[];
  }[];
  flashcards: { id: string; front: string; back: string; difficulty: string }[];
};

export async function getCourses(userId?: string, includeAll = true): Promise<CourseWithModules[]> {
  if (!process.env.DATABASE_URL) {
    return getMockCourses();
  }

  try {
    const entitledCourseIds =
      userId && !includeAll
        ? new Set(
            (
              await prisma.subscription.findMany({
                where: { userId, status: "ACTIVE" },
                select: { courseId: true },
              })
            ).map((item) => item.courseId)
          )
        : null;

    const dbCourses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        ...(entitledCourseIds ? { id: { in: [...entitledCourseIds] } } : {}),
      },
      include: {
        modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      },
      orderBy: { createdAt: "asc" },
    });
    const completedLessonIds = userId
      ? new Set(
          (
            await prisma.progress.findMany({
              where: { userId, completedAt: { not: null } },
              select: { lessonId: true },
            })
          ).map((item) => item.lessonId)
        )
      : new Set<string>();

    if (dbCourses.length) {
      return dbCourses.map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        level: course.level,
        workloadHours: course.workloadHours,
        priceCents: course.priceCents,
        modules: course.modules.map((module) => ({
          id: module.id,
          title: module.title,
          slug: module.slug,
          order: module.order,
          lessons: module.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            difficulty: lesson.difficulty,
            readingMinutes: lesson.readingMinutes,
            completed: completedLessonIds.has(lesson.id),
          })),
        })),
      }));
    }
  } catch {}
  return getMockCourses();
}

function getMockCourses(): CourseWithModules[] {
  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    level: course.level,
    workloadHours: course.hours,
    priceCents: Math.round(course.price * 100),
    modules: course.modules.map((title, index) => ({
      id: `${course.id}-${index}`,
      title,
      slug: title.toLowerCase().replaceAll(" ", "-"),
      order: index + 1,
      lessons: lessons
        .filter((lesson) => lesson.courseSlug === course.slug && lesson.moduleTitle === title)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          difficulty: lesson.difficulty,
          readingMinutes: lesson.readingTime,
          completed: false,
        })),
    })),
  }));
}

export async function getCourse(slug: string, userId?: string, includeAll = true) {
  const allCourses = await getCourses(userId, includeAll);
  return allCourses.find((course) => course.slug === slug) ?? null;
}

export async function getLesson(
  courseSlug: string,
  lessonSlug: string,
  userId?: string,
  includeAll = true
): Promise<LessonDetail | null> {
  if (process.env.DATABASE_URL) {
    try {
      const lesson = await prisma.lesson.findFirst({
        where: { slug: lessonSlug, module: { course: { slug: courseSlug, status: "PUBLISHED" } } },
        include: {
          module: { include: { course: true } },
          quizzes: { include: { questions: { include: { answers: true } } } },
          flashcards: true,
        },
      });

      if (lesson) {
        const course = await getCourse(courseSlug, userId, includeAll);
        if (!course) return null;

        const progress = userId
          ? await prisma.progress.findUnique({
              where: { userId_lessonId: { userId, lessonId: lesson.id } },
            })
          : null;

        return {
          course,
          lesson: {
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            description: lesson.description,
            objectives: lesson.objectives,
            difficulty: lesson.difficulty,
            readingMinutes: lesson.readingMinutes,
            contentMd: lesson.contentMd,
            completed: Boolean(progress?.completedAt),
          },
          quizzes: lesson.quizzes.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            questions: quiz.questions.map((question) => ({
              id: question.id,
              prompt: question.prompt,
              explanation: question.explanation,
              answers: question.answers.map((answer) => ({
                id: answer.id,
                text: answer.text,
                isCorrect: answer.isCorrect,
              })),
            })),
          })),
          flashcards: lesson.flashcards.map((card) => ({
            id: card.id,
            front: card.front,
            back: card.back,
            difficulty: card.difficulty,
          })),
        };
      }
    } catch {}
  }

  const course = await getCourse(courseSlug, userId, includeAll);
  const lesson = lessons.find((item) => item.courseSlug === courseSlug && item.slug === lessonSlug);
  return course && lesson
    ? {
        course,
        lesson: {
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.moduleTitle,
          objectives: ["Entender o conceito", "Aplicar na pratica"],
          difficulty: lesson.difficulty,
          readingMinutes: lesson.readingTime,
          contentMd: lesson.markdown,
        },
        quizzes: [
          {
            id: "mock-quiz",
            title: "Quiz rapido",
            questions: quizzes.map((quiz, index) => ({
              id: `mock-question-${index}`,
              prompt: quiz.question,
              explanation: "Revise a aula para fixar este conceito.",
              answers: quiz.answers.map((answer, answerIndex) => ({
                id: `mock-answer-${index}-${answerIndex}`,
                text: answer,
                isCorrect: answerIndex === quiz.correct,
              })),
            })),
          },
        ],
        flashcards: flashcards.map((card, index) => ({
          id: `mock-flashcard-${index}`,
          front: card.front,
          back: card.back,
          difficulty: "BASIC",
        })),
      }
    : null;
}

export function calculateCourseProgress(course: CourseWithModules) {
  const allLessons = course.modules.flatMap((module) => module.lessons);
  if (!allLessons.length) return 0;
  const completed = allLessons.filter((lesson) => lesson.completed).length;
  return Math.round((completed / allLessons.length) * 100);
}

export function calculateNextReview(rating: "again" | "hard" | "good" | "easy") {
  const now = new Date();
  const days = rating === "again" ? 0 : rating === "hard" ? 1 : rating === "good" ? 3 : 7;
  now.setDate(now.getDate() + days);
  return now;
}
