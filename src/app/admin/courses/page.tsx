import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses } from "@/lib/learning";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminCoursesPage() {
  await requireAdmin();
  const courses = await getCourses();
  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Cursos</h1>
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
