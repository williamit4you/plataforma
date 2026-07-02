import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function PublicCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const certificate = process.env.DATABASE_URL
    ? await prisma.certificate.findUnique({
        where: { code },
        include: { user: true, course: true },
      })
    : null;

  if (!certificate) notFound();

  const publicUrl = `${process.env.NEXTAUTH_URL ?? "https://seudominio.com"}/certificate/${code}`;
  const qr = await QRCode.toDataURL(publicUrl);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Certificado valido</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-slate-500">Aluno</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">{certificate.user.name}</p>
          <p className="mt-6 text-sm text-slate-500">Curso</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">{certificate.course.title}</p>
          <p className="mt-6 text-sm text-slate-500">Codigo</p>
          <p className="mt-1 font-mono text-lg font-semibold text-slate-950">{certificate.code}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR Code do certificado" className="mx-auto mt-6 h-36 w-36" />
          <p className="mt-6 text-sm text-slate-600">
            Emitido em {certificate.issuedAt.toLocaleDateString("pt-BR")}.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
