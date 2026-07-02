import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminPage() {
  await requireAdmin();
  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Painel administrativo</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Usuarios", "Cursos", "Pagamentos", "Webhooks", "Certificados", "Uploads"].map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>{item}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Modulo administrativo preparado para operacoes de SaaS real.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
