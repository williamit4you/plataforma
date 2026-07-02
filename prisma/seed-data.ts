export const courses = [
  {
    id: "google-ads",
    title: "Google Ads do Zero ao Primeiro Anuncio",
    slug: "google-ads-do-zero-ao-primeiro-anuncio",
    description:
      "Aprenda a estruturar conta, escolher palavras-chave e publicar sua primeira campanha com seguranca.",
    level: "Iniciante",
    hours: 18,
    modules: [
      "Introducao ao Google Ads",
      "Estrutura da Conta",
      "Palavras-chave",
      "Tipos de Campanha",
      "Criando a Primeira Campanha",
      "Anuncios",
      "Conversoes",
      "Otimizacao",
      "Erros Comuns",
      "Checklist Final",
    ],
  },
  {
    id: "meta-ads",
    title: "Meta Ads para Afiliados e Produtos Fisicos",
    slug: "meta-ads-para-afiliados-e-produtos-fisicos",
    description:
      "Domine campanhas no Instagram e Facebook com criativos, publicos, pixel e metricas praticas.",
    level: "Iniciante",
    hours: 16,
    modules: [
      "Introducao ao Meta Ads",
      "Business Manager",
      "Pixel e Eventos",
      "Publicos",
      "Criativos",
      "Campanhas para Afiliados",
      "Testes A/B",
      "Metricas",
      "Otimizacao",
      "Checklist Final",
    ],
  },
];

export const lessons = courses.flatMap((course) =>
  course.modules.flatMap((moduleTitle, moduleIndex) =>
    [1, 2].map((lessonIndex) => ({
      id: `${course.id}-${moduleIndex + 1}-${lessonIndex}`,
      courseSlug: course.slug,
      moduleTitle,
      moduleOrder: moduleIndex + 1,
      title: lessonIndex === 1 ? `Fundamentos: ${moduleTitle}` : `Aplicacao pratica: ${moduleTitle}`,
      slug: lessonIndex === 1 ? `fundamentos-${moduleIndex + 1}` : `aplicacao-pratica-${moduleIndex + 1}`,
      readingTime: 8 + moduleIndex,
      difficulty: moduleIndex < 3 ? "Basico" : moduleIndex < 7 ? "Intermediario" : "Pratico",
      markdown: `# ${moduleTitle}

Nesta aula voce aprende o essencial de ${moduleTitle.toLowerCase()} com foco em execucao.

## Objetivos

- Entender o papel deste tema na estrategia.
- Aplicar um passo a passo simples.
- Evitar erros comuns antes de investir dinheiro.

## Passo a passo

1. Revise o conceito principal.
2. Abra a conta de anuncios.
3. Configure apenas o necessario para testar.
4. Valide metricas antes de escalar.

> Dica: documente cada decisao. Campanhas boas nascem de hipoteses claras.

## Checklist

- Objetivo definido.
- Publico ou palavra-chave escolhida.
- Criativo ou anuncio revisado.
- Medicao configurada.

## Resumo

O melhor primeiro anuncio e aquele que voce consegue medir, pausar e melhorar.`,
    }))
  )
);

export const quizzes = [
  {
    question: "Qual e a melhor postura antes de escalar uma campanha?",
    answers: ["Aumentar verba sem medir", "Validar metricas e hipoteses", "Trocar tudo diariamente"],
    correct: 1,
  },
  {
    question: "Por que aulas em texto ajudam na execucao?",
    answers: ["Servem como documentacao consultavel", "Impedem pratica", "Substituem metricas"],
    correct: 0,
  },
];

export const flashcards = [
  {
    front: "O que deve existir antes de investir mais verba?",
    back: "Uma hipotese clara, medicao configurada e sinais iniciais de performance.",
  },
  {
    front: "Qual e a funcao de um checklist de campanha?",
    back: "Reduzir erros operacionais antes da publicacao.",
  },
];

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
