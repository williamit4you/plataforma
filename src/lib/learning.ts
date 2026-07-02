import { prisma } from "@/lib/prisma";
import { courses, flashcards, lessons, quizzes } from "@/lib/mock-data";

export async function getCourses() {
  if (!process.env.DATABASE_URL) {
    return getMockCourses();
  }

  try {
    const dbCourses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: { modules: { orderBy: { order: "asc" }, include: { lessons: true } } },
      orderBy: { createdAt: "asc" },
    });
    if (dbCourses.length) return dbCourses;
  } catch {}
  return getMockCourses();
}

function getMockCourses() {
  return courses.map((course) => ({
    ...course,
    modules: course.modules.map((title, index) => ({
      id: `${course.id}-${index}`,
      title,
      order: index + 1,
      lessons: lessons.filter((lesson) => lesson.courseSlug === course.slug && lesson.moduleTitle === title),
    })),
  }));
}

export async function getCourse(slug: string) {
  const allCourses = await getCourses();
  return allCourses.find((course) => course.slug === slug) ?? null;
}

export async function getLesson(courseSlug: string, lessonSlug: string) {
  const course = await getCourse(courseSlug);
  const lesson = lessons.find((item) => item.courseSlug === courseSlug && item.slug === lessonSlug);
  return course && lesson ? { course, lesson, quizzes, flashcards } : null;
}

export function calculateNextReview(rating: "again" | "hard" | "good" | "easy") {
  const now = new Date();
  const days = rating === "again" ? 0 : rating === "hard" ? 1 : rating === "good" ? 3 : 7;
  now.setDate(now.getDate() + days);
  return now;
}
