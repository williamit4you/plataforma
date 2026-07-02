import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PublicCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const qr = await QRCode.toDataURL(`https://seudominio.com/certificate/${code}`);
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Validacao de certificado</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-slate-500">Codigo</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">{code}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR Code do certificado" className="mx-auto mt-6 h-36 w-36" />
          <p className="mt-6 text-sm text-slate-600">Estrutura publica preparada para buscar o certificado real no banco.</p>
        </CardContent>
      </Card>
    </main>
  );
}
