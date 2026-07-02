import { Timer } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SimulationsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Simulados</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {["Simulado Google Ads", "Simulado Meta Ads"].map((title) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="text-teal-600" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-slate-600">20 perguntas, tempo limite e recomendacao de revisao.</p>
              <Button variant="secondary">Iniciar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
