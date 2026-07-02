import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCourses } from "@/lib/learning";
import { requireAdmin } from "@/lib/permissions";
import { createModuleAction } from "@/server/actions/admin-actions";

export default async function AdminModulesPage() {
  await requireAdmin();
  const courses = await getCourses();

  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Modulos</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Criar ou atualizar modulo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createModuleAction} className="grid gap-3 md:grid-cols-[1fr_1fr_160px_auto]">
            <select name="courseId" required className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <Input name="title" placeholder="Titulo do modulo" required />
            <Input name="order" type="number" placeholder="Ordem" defaultValue={1} required />
            <Button>Salvar</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                {course.modules.map((module) => (
                  <li key={module.id}>
                    {module.order}. {module.title}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
