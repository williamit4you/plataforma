import { type PrismaClient } from "@prisma/client";
import { splitMarkdownSections } from "@/lib/lesson-content";

export async function rebuildContentChunks(prisma: PrismaClient) {
  const lessons = await prisma.lesson.findMany({
    include: { module: { include: { course: true } } },
  });

  await prisma.contentChunk.deleteMany({});

  let chunks = 0;

  for (const lesson of lessons) {
    const sections = splitMarkdownSections(lesson.contentMd);
    for (const section of sections) {
      await prisma.contentChunk.create({
        data: {
          courseId: lesson.module.courseId,
          lessonId: lesson.id,
          content: `${lesson.title}\n${section.title}\n${section.content}`,
          metadata: {
            courseTitle: lesson.module.course.title,
            courseSlug: lesson.module.course.slug,
            moduleTitle: lesson.module.title,
            lessonTitle: lesson.title,
            lessonSlug: lesson.slug,
            sectionTitle: section.title,
          },
        },
      });
      chunks += 1;
    }
  }

  return { lessons: lessons.length, chunks };
}

export async function searchContentChunks(prisma: PrismaClient, query: string, take = 8) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3)
    .slice(0, 8);

  if (!terms.length) return [];

  const chunks = await prisma.contentChunk.findMany({
    where: {
      OR: terms.map((term) => ({
        content: { contains: term, mode: "insensitive" },
      })),
    },
    take: take * 3,
    orderBy: { createdAt: "desc" },
  });

  return chunks
    .map((chunk) => {
      const content = chunk.content.toLowerCase();
      const score = terms.reduce((sum, term) => sum + (content.includes(term) ? 1 : 0), 0);
      return { ...chunk, score };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, take);
}
