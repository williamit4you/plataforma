import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { Award } from "lucide-react";
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
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-8">
      <div className="no-print mb-4">
        <button
          type="button"
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white"
        >
          Use Ctrl+P para imprimir ou salvar em PDF
        </button>
      </div>
      <section className="certificate-sheet w-full max-w-5xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="border-4 border-double border-teal-600 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <Award size={34} />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">Ads Academy</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Certificado de Conclusao</h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600">
            Certificamos que <strong className="text-slate-950">{certificate.user.name}</strong> concluiu o curso
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-3xl font-semibold text-slate-950">{certificate.course.title}</p>
          <p className="mt-8 text-sm text-slate-500">
            Emitido em {certificate.issuedAt.toLocaleDateString("pt-BR")} - Codigo de validacao
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-slate-950">{certificate.code}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR Code do certificado" className="mx-auto mt-8 h-32 w-32" />
          <p className="mt-4 text-xs text-slate-500">{publicUrl}</p>
        </div>
      </section>
    </main>
  );
}
