import { AppShell } from "@/components/layout/app-shell";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminPaymentsPage() {
  await requireAdmin();
  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Pagamentos</h1>
      <p className="mt-2 text-slate-600">Pagamentos da Kiwify serao listados apos processamento dos webhooks.</p>
    </AppShell>
  );
}
