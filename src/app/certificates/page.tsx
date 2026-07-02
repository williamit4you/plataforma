import { Award } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CertificatesPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Certificados</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-teal-600" />
            Certificados de cursos e trilhas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm leading-6 text-slate-600">
            Ao concluir 100% do curso, o sistema emite certificado com codigo publico, QR Code e pagina de validacao.
          </p>
          <Button variant="secondary">Nenhum certificado disponivel ainda</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
