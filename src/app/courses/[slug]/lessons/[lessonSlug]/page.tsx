import Link from "next/link";
import { notFound } from "next/navigation";
import { Bot, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { LessonStudyView } from "@/components/lesson/lesson-study-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { splitMarkdownSections } from "@/lib/lesson-content";
import { getLesson } from "@/lib/learning";
import { requireUser } from "@/lib/permissions";
import { completeLessonAction, reviewFlashcardAction } from "@/server/actions/learning-actions";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonSlug: string }> }) {
  const { slug, lessonSlug } = await params;
  const user = await requireUser();
  const data = await getLesson(slug, lessonSlug, user.id, user.role === "ADMIN");
  if (!data) notFound();
  const { course, lesson } = data;
  const flatLessons = course.modules.flatMap((module) => module.lessons);
  const currentIndex = flatLessons.findIndex((item) => item.slug === lesson.slug);
  const previousLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex + 1 < flatLessons.length ? flatLessons[currentIndex + 1] : null;
  const lessonSections = splitMarkdownSections(lesson.contentMd);

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{lesson.difficulty}</Badge>
            {lesson.completed && <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">Concluida</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">{lesson.title}</h1>
          <p className="mt-2 text-slate-600">
            {course.title} - leitura estimada de {lesson.readingMinutes} minutos
          </p>
          <div className="mt-6">
            <LessonStudyView content={lesson.contentMd} />
          </div>
          <div className="mt-6 flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href={previousLesson ? `/courses/${course.slug}/lessons/${previousLesson.slug}` : `/courses/${course.slug}`}>
                <ChevronLeft size={16} />
                {previousLesson ? "Aula anterior" : "Voltar ao curso"}
              </Link>
            </Button>
            {nextLesson ? (
              <Button asChild>
                <Link href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                  Proxima aula
                  <ChevronRight size={16} />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/certificates">
                  Ver certificados
                  <ChevronRight size={16} />
                </Link>
              </Button>
            )}
          </div>
        </section>
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Etapas da aula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lessonSections.map((section, index) => (
                  <div key={section.title} className="flex items-center gap-3 rounded-md bg-slate-50 p-2 text-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-teal-700">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-700">{section.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                <Button className="w-full">{lesson.completed ? "Aula concluida" : "Marcar como concluida"}</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quiz rapido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.quizzes.flatMap((quiz) => quiz.questions).map((question) => (
                <div key={question.id} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-950">{question.prompt}</p>
                  <div className="mt-2 space-y-1">
                    {question.answers.map((answer) => (
                      <p key={answer.id} className="text-xs text-slate-500">
                        {answer.isCorrect ? "Correta: " : ""}
                        {answer.text}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{question.explanation}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Flashcards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.flashcards.map((card) => (
                <form key={card.id} action={reviewFlashcardAction} className="rounded-md border border-slate-200 p-3">
                  <input type="hidden" name="flashcardId" value={card.id} />
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
