import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCourses } from "@/lib/learning";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { createQuizQuestionAction, deleteQuizQuestionAction } from "@/server/actions/admin-actions";

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

  const quizzes = process.env.DATABASE_URL
    ? await prisma.quiz.findMany({
        include: {
          lesson: { include: { module: { include: { course: true } } } },
          questions: { include: { answers: true } },
        },
        orderBy: { createdAt: "desc" },
      }).catch(() => [])
    : [];

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
      <div className="mt-6 grid gap-4">
        {quizzes.length === 0 && (
          <Card>
            <CardContent className="pt-5 text-sm text-slate-600">Nenhum quiz cadastrado ainda.</CardContent>
          </Card>
        )}
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <p className="text-sm text-slate-500">
                {quiz.lesson?.module.course.title} - {quiz.lesson?.title}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {quiz.questions.map((question) => (
                <div key={question.id} className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-950">{question.prompt}</p>
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    {question.answers.map((answer) => (
                      <p key={answer.id}>
                        {answer.isCorrect ? "Correta: " : ""}
                        {answer.text}
                      </p>
                    ))}
                  </div>
                  <form action={deleteQuizQuestionAction} className="mt-3">
                    <input type="hidden" name="questionId" value={question.id} />
                    <Button variant="danger" size="sm">
                      Excluir pergunta
                    </Button>
                  </form>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
