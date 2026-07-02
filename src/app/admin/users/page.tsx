import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses } from "@/lib/learning";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { grantAccessAction } from "@/server/actions/admin-actions";

export default async function AdminUsersPage() {
  await requireAdmin();
  const courses = await getCourses();
  let users: {
    id: string;
    name: string;
    email: string;
    role: string;
    subscriptions: { courseId: string; course: { title: string } }[];
  }[] = [];

  try {
    users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptions: { where: { status: "ACTIVE" }, select: { courseId: true, course: { select: { title: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Usuarios</h1>
      <div className="mt-6 grid gap-4">
        {users.length === 0 && <p className="text-slate-600">Nenhum usuario carregado. Rode migrations e seed.</p>}
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                {user.email} - {user.role}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Acessos:{" "}
                {user.subscriptions.length
                  ? user.subscriptions.map((subscription) => subscription.course.title).join(", ")
                  : "nenhum curso liberado"}
              </p>
              <form action={grantAccessAction} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="userId" value={user.id} />
                <select
                  name="courseId"
                  required
                  className="h-10 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <Button variant="secondary">Liberar acesso</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
