import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCourses } from "@/lib/learning";
import { requireAdmin } from "@/lib/permissions";
import { createQuizQuestionAction } from "@/server/actions/admin-actions";

export default async function AdminQuizzesPage() {
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
      <h1 className="text-3xl font-semibold text-slate-950">Quizzes</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Criar pergunta de quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createQuizQuestionAction} className="grid gap-3">
            <select name="lessonId" required className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.label}
                </option>
              ))}
            </select>
            <Input name="title" placeholder="Titulo do quiz" defaultValue="Quiz rapido" required />
            <Input name="prompt" placeholder="Pergunta" required />
            <Input name="explanation" placeholder="Explicacao da resposta" required />
            <textarea
              name="answers"
              placeholder={"Uma alternativa por linha. Use * no inicio da correta.\n* Resposta correta\nResposta errada"}
              required
              className="min-h-32 rounded-md border border-slate-200 p-3 text-sm"
            />
            <Button>Salvar pergunta</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
