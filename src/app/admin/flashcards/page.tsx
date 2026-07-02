import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCourses } from "@/lib/learning";
import { requireAdmin } from "@/lib/permissions";
import { createFlashcardAction } from "@/server/actions/admin-actions";

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
    </AppShell>
  );
}
