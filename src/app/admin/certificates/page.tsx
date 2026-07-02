import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminCertificatesPage() {
  await requireAdmin();
  const certificates = process.env.DATABASE_URL
    ? await prisma.certificate.findMany({
        include: { user: true, course: true },
        orderBy: { issuedAt: "desc" },
        take: 50,
      }).catch(() => [])
    : [];

  return (
    <AppShell admin>
      <h1 className="text-3xl font-semibold text-slate-950">Certificados</h1>
      <div className="mt-6 grid gap-4">
        {certificates.length === 0 && (
          <Card>
            <CardContent className="pt-5 text-sm text-slate-600">Nenhum certificado emitido ainda.</CardContent>
          </Card>
        )}
        {certificates.map((certificate) => (
          <Card key={certificate.id}>
            <CardHeader>
              <CardTitle>{certificate.user.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                <p>{certificate.course.title}</p>
                <p>{certificate.code}</p>
                <p>Emitido em {certificate.issuedAt.toLocaleDateString("pt-BR")}</p>
              </div>
              <Button asChild variant="secondary">
                <Link href={`/certificate/${certificate.code}`}>Abrir validacao</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
