import { AppShell } from "@/components/layout/app-shell";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminCertificatesPage() {
  await requireAdmin();
  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Certificados</h1>
      <p className="mt-2 text-slate-600">Emissao, validacao publica e auditoria de certificados.</p>
    </AppShell>
  );
}
