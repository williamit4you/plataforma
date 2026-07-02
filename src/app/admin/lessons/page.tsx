import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCourses } from "@/lib/learning";
import { requireAdmin } from "@/lib/permissions";
import { createLessonAction } from "@/server/actions/admin-actions";

export default async function AdminLessonsPage() {
  await requireAdmin();
  const courses = await getCourses();
  const modules = courses.flatMap((course) =>
    course.modules.map((module) => ({ ...module, courseTitle: course.title }))
  );

  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Aulas</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Criar ou atualizar aula</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createLessonAction} className="grid gap-3 md:grid-cols-2">
            <select name="moduleId" required className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.courseTitle} - {module.title}
                </option>
              ))}
            </select>
            <Input name="title" placeholder="Titulo da aula" required />
            <Input name="description" placeholder="Descricao curta" required />
            <Input name="difficulty" placeholder="Dificuldade" defaultValue="Basico" required />
            <Input name="readingMinutes" type="number" placeholder="Minutos de leitura" defaultValue={8} required />
            <Input name="order" type="number" placeholder="Ordem" defaultValue={1} required />
            <textarea
              name="contentMd"
              placeholder="# Conteudo da aula"
              required
              className="min-h-64 rounded-md border border-slate-200 p-3 font-mono text-sm md:col-span-2"
            />
            <Button className="md:col-span-2">Salvar aula</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
