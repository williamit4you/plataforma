import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lessons } from "@/lib/mock-data";

const chatSchema = z.object({
  message: z.string().min(1),
  scope: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const parsed = chatSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Mensagem invalida." }, { status: 400 });

  const source = lessons.find((lesson) => lesson.markdown.toLowerCase().includes("campanha")) ?? lessons[0];
  return NextResponse.json({
    answer:
      "A base RAG esta preparada. Nesta versao, a resposta demonstra o contrato: responder somente com fontes autorizadas do conteudo da plataforma.",
    sources: [{ title: source.title, lessonSlug: source.slug, courseSlug: source.courseSlug }],
  });
}
