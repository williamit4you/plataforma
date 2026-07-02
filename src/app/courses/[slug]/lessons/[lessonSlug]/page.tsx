import Link from "next/link";
import { notFound } from "next/navigation";
import { Bot, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MarkdownView } from "@/components/lesson/markdown-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLesson } from "@/lib/learning";
import { completeLessonAction, reviewFlashcardAction } from "@/server/actions/learning-actions";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonSlug: string }> }) {
  const { slug, lessonSlug } = await params;
  const data = await getLesson(slug, lessonSlug);
  if (!data) notFound();
  const { course, lesson } = data;

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <Badge>{lesson.difficulty}</Badge>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">{lesson.title}</h1>
          <p className="mt-2 text-slate-600">
            {course.title} · leitura estimada de {lesson.readingTime} minutos
          </p>
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
            <MarkdownView content={lesson.markdown} />
          </div>
        </section>
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-teal-600" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={completeLessonAction}>
                <input type="hidden" name="lessonId" value={lesson.id} />
                <input type="hidden" name="courseSlug" value={slug} />
                <Button className="w-full">Marcar como concluida</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quiz rapido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.quizzes.map((quiz) => (
                <div key={quiz.question} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-950">{quiz.question}</p>
                  <p className="mt-2 text-xs text-slate-500">Resposta correta: {quiz.answers[quiz.correct]}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Flashcards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.flashcards.map((card, index) => (
                <form key={card.front} action={reviewFlashcardAction} className="rounded-md border border-slate-200 p-3">
                  <input type="hidden" name="flashcardId" value={`${lesson.id}-${index}`} />
                  <p className="text-sm font-medium">{card.front}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.back}</p>
                  <div className="mt-3 grid grid-cols-4 gap-1">
                    {[
                      ["again", "Errei"],
                      ["hard", "Dificil"],
                      ["good", "Bom"],
                      ["easy", "Facil"],
                    ].map(([value, label]) => (
                      <Button key={value} name="rating" value={value} variant="secondary" size="sm">
                        {label}
                      </Button>
                    ))}
                  </div>
                </form>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot size={20} className="text-teal-600" />
                IA da aula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">
                Endpoint RAG preparado em `/api/ai/chat`. A resposta deve usar apenas chunks autorizados.
              </p>
              <Button asChild variant="secondary" className="mt-4 w-full">
                <Link href="/api/search?q=campanha">Testar busca</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
