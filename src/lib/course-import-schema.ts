import { z } from "zod";

export const aiCourseImportSchema = z.object({
  course: z.object({
    title: z.string().min(3),
    slug: z.string().optional(),
    description: z.string().min(10),
    level: z.string().default("Iniciante"),
    workloadHours: z.number().int().min(1).default(10),
    priceCents: z.number().int().min(0).default(6990),
    status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  }),
  modules: z
    .array(
      z.object({
        title: z.string().min(3),
        slug: z.string().optional(),
        order: z.number().int().min(1),
        lessons: z
          .array(
            z.object({
              title: z.string().min(3),
              slug: z.string().optional(),
              description: z.string().min(3),
              objectives: z.array(z.string()).default([]),
              readingMinutes: z.number().int().min(1).default(8),
              difficulty: z.string().default("Basico"),
              order: z.number().int().min(1),
              contentMd: z.string().min(20),
              quiz: z
                .object({
                  title: z.string().default("Quiz rapido"),
                  questions: z
                    .array(
                      z.object({
                        prompt: z.string().min(5),
                        explanation: z.string().default("Revise a aula para reforcar este conceito."),
                        answers: z
                          .array(
                            z.object({
                              text: z.string().min(1),
                              isCorrect: z.boolean().default(false),
                            })
                          )
                          .min(2),
                      })
                    )
                    .default([]),
                })
                .optional(),
              flashcards: z
                .array(
                  z.object({
                    front: z.string().min(3),
                    back: z.string().min(3),
                    difficulty: z.string().default("BASIC"),
                  })
                )
                .default([]),
            })
          )
          .default([]),
      })
    )
    .min(1),
});

export type AiCourseImportPayload = z.infer<typeof aiCourseImportSchema>;

export const aiCourseImportExample: AiCourseImportPayload = {
  course: {
    title: "Google Ads para Pesquisa Local",
    description: "Curso pratico para criar campanhas de pesquisa local com medicao simples e otimizacao semanal.",
    level: "Iniciante",
    workloadHours: 6,
    priceCents: 6990,
    status: "PUBLISHED",
  },
  modules: [
    {
      title: "Fundamentos",
      order: 1,
      lessons: [
        {
          title: "Como pensar uma campanha local",
          description: "Aprenda a estruturar objetivo, oferta e medicao antes de criar anuncios.",
          objectives: ["Definir objetivo", "Escolher oferta", "Preparar checklist"],
          readingMinutes: 8,
          difficulty: "Basico",
          order: 1,
          contentMd:
            "# Como pensar uma campanha local\n\n## Objetivos\n\n- Definir a meta principal.\n- Escolher uma oferta simples.\n\n## Passo a passo\n\n1. Defina a cidade.\n2. Escolha o servico principal.\n3. Configure uma conversao.\n\n## Checklist\n\n- Objetivo definido.\n- Oferta revisada.\n- Medicao pronta.\n\n## Resumo\n\nCampanhas locais funcionam melhor quando medem uma acao clara.",
          quiz: {
            title: "Quiz rapido",
            questions: [
              {
                prompt: "O que deve ser definido antes da campanha?",
                explanation: "Sem objetivo claro, fica dificil avaliar performance.",
                answers: [
                  { text: "Objetivo e medicao", isCorrect: true },
                  { text: "Apenas o valor da verba", isCorrect: false },
                ],
              },
            ],
          },
          flashcards: [
            {
              front: "Qual e o primeiro passo de uma campanha local?",
              back: "Definir objetivo, cidade, oferta e forma de medir resultado.",
              difficulty: "BASIC",
            },
          ],
        },
      ],
    },
  ],
};
