import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { searchContentChunks } from "@/server/services/content-indexer";

const chatSchema = z.object({
  message: z.string().min(1),
  scope: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const parsed = chatSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Mensagem invalida." }, { status: 400 });

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      answer: "A base RAG esta preparada. Configure DATABASE_URL para consultar fontes reais.",
      sources: [],
    });
  }

  const chunks = await searchContentChunks(prisma, parsed.data.message, 5).catch(() => []);
  if (!chunks.length) {
    return NextResponse.json({
      answer: "Nao encontrei base suficiente no conteudo cadastrado para responder com seguranca.",
      sources: [],
    });
  }

  const answer = [
    "Com base nas aulas cadastradas, estes sao os pontos mais relevantes:",
    ...chunks.slice(0, 3).map((chunk, index) => `${index + 1}. ${chunk.content.split("\n").slice(0, 3).join(" - ")}`),
  ].join("\n");

  return NextResponse.json({
    answer,
    sources: chunks.map((chunk) => ({ id: chunk.id, metadata: chunk.metadata, excerpt: chunk.content.slice(0, 180) })),
  });
}
