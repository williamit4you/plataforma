import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCourses } from "@/lib/learning";
import { requireAdmin } from "@/lib/permissions";
import { createCourseAction } from "@/server/actions/admin-actions";

export default async function AdminCoursesPage() {
  await requireAdmin();
  const courses = await getCourses();

  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Cursos</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Criar ou atualizar curso</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCourseAction} className="grid gap-3 md:grid-cols-2">
            <Input name="title" placeholder="Titulo" required />
            <Input name="level" placeholder="Nivel" defaultValue="Iniciante" required />
            <Input name="workloadHours" type="number" placeholder="Carga horaria" defaultValue={10} required />
            <Input name="priceCents" type="number" placeholder="Preco em centavos" defaultValue={6990} required />
            <textarea
              name="description"
              placeholder="Descricao"
              required
              className="min-h-24 rounded-md border border-slate-200 p-3 text-sm md:col-span-2"
            />
            <Button className="md:col-span-2">Salvar curso</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-4">
        {courses.map((course) => (
          <Card key={course.slug}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{course.modules.length} modulos cadastrados.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
