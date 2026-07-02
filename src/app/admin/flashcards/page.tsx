import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCourses } from "@/lib/learning";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { createFlashcardAction, deleteFlashcardAction } from "@/server/actions/admin-actions";

export default async function AdminFlashcardsPage() {
  await requireAdmin();
  const courses = await getCourses();
  const lessons = courses.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        ...lesson,
        label: `${course.title} - ${module.title} - ${lesson.title}`,
      }))
    )
  );

  const flashcards = process.env.DATABASE_URL
    ? await prisma.flashcard.findMany({
        include: { lesson: { include: { module: { include: { course: true } } } } },
        orderBy: { createdAt: "desc" },
      }).catch(() => [])
    : [];

  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Flashcards</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Criar flashcard</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createFlashcardAction} className="grid gap-3 md:grid-cols-2">
            <select
              name="lessonId"
              required
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm md:col-span-2"
            >
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.label}
                </option>
              ))}
            </select>
            <Input name="front" placeholder="Frente/pergunta" required />
            <Input name="difficulty" placeholder="Dificuldade" defaultValue="BASIC" required />
            <textarea
              name="back"
              placeholder="Verso/resposta"
              required
              className="min-h-32 rounded-md border border-slate-200 p-3 text-sm md:col-span-2"
            />
            <Button className="md:col-span-2">Salvar flashcard</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {flashcards.length === 0 && (
          <Card>
            <CardContent className="pt-5 text-sm text-slate-600">Nenhum flashcard cadastrado ainda.</CardContent>
          </Card>
        )}
        {flashcards.map((flashcard) => (
          <Card key={flashcard.id}>
            <CardHeader>
              <CardTitle>{flashcard.front}</CardTitle>
              <p className="text-sm text-slate-500">
                {flashcard.lesson?.module.course.title} - {flashcard.lesson?.title}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">{flashcard.back}</p>
              <p className="mt-2 text-xs text-teal-700">{flashcard.difficulty}</p>
              <form action={deleteFlashcardAction} className="mt-4">
                <input type="hidden" name="flashcardId" value={flashcard.id} />
                <Button variant="danger" size="sm">
                  Excluir flashcard
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
