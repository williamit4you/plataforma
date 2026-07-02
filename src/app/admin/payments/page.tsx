import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminPaymentsPage() {
  await requireAdmin();
  const [payments, webhooks] = process.env.DATABASE_URL
    ? await Promise.all([
        prisma.payment.findMany({
          include: { user: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.webhookEvent.findMany({
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
      ]).catch(() => [[], []] as const)
    : [[], []] as const;

  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Pagamentos</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.length === 0 && <p className="text-sm text-slate-600">Nenhum pagamento registrado ainda.</p>}
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-md border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-950">{payment.user?.email ?? "Sem usuario"}</p>
                <p className="text-slate-600">
                  {payment.provider} - {payment.status} - R$ {(payment.amountCents / 100).toFixed(2)}
                </p>
                <p className="text-xs text-slate-500">{payment.externalId}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Webhooks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {webhooks.length === 0 && <p className="text-sm text-slate-600">Nenhum webhook registrado ainda.</p>}
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="rounded-md border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-950">{webhook.eventType}</p>
                <p className="text-slate-600">
                  {webhook.provider} - {webhook.status}
                </p>
                <p className="text-xs text-slate-500">{webhook.externalId}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
