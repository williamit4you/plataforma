import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningPathDetailPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Gestor de Trafego do Zero</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {["Fundamentos de Marketing Digital", "Google Ads", "Meta Ads", "Copywriting", "Landing Pages", "Metricas"].map(
          (item, index) => (
            <Card key={item}>
              <CardHeader>
                <CardTitle>
                  {index + 1}. {item}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Etapa planejada para evolucao progressiva do aluno.</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </AppShell>
  );
}
