import { NextRequest, NextResponse } from "next/server";
import { lessons } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";
  const results = lessons
    .filter((lesson) => `${lesson.title} ${lesson.markdown}`.toLowerCase().includes(q))
    .slice(0, 8)
    .map((lesson) => ({
      title: lesson.title,
      courseSlug: lesson.courseSlug,
      lessonSlug: lesson.slug,
      excerpt: lesson.markdown.slice(0, 180),
    }));

  return NextResponse.json({ query: q, mode: "keyword-now-vector-ready", results });
}
