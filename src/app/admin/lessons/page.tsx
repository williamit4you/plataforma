import { AppShell } from "@/components/layout/app-shell";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminLessonsPage() {
  await requireAdmin();
  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Aulas</h1>
      <p className="mt-2 text-slate-600">Editor Markdown/MDX sera conectado ao schema de aulas.</p>
    </AppShell>
  );
}
