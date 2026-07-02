import { NextRequest, NextResponse } from "next/server";
import { lessons } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { searchContentChunks } from "@/server/services/content-indexer";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";

  if (process.env.DATABASE_URL) {
    try {
      const chunks = await searchContentChunks(prisma, q, 8);
      return NextResponse.json({
        query: q,
        mode: "content-chunks-keyword-vector-ready",
        results: chunks.map((chunk) => ({
          id: chunk.id,
          excerpt: chunk.content.slice(0, 260),
          metadata: chunk.metadata,
          score: chunk.score,
        })),
      });
    } catch {}
  }

  const results = lessons
    .filter((lesson) => `${lesson.title} ${lesson.markdown}`.toLowerCase().includes(q))
    .slice(0, 8)
    .map((lesson) => ({
      title: lesson.title,
      courseSlug: lesson.courseSlug,
      lessonSlug: lesson.slug,
      excerpt: lesson.markdown.slice(0, 180),
    }));

  return NextResponse.json({ query: q, mode: "mock-keyword", results });
}
