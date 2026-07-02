import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminUsersPage() {
  await requireAdmin();
  let users: { id: string; name: string; email: string; role: string }[] = [];
  try {
    users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
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
                {user.email} · {user.role}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
