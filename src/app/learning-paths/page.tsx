import { GraduationCap } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function LearningPathsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Trilhas de aprendizagem</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="text-teal-600" />
            Gestor de Trafego do Zero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm leading-6 text-slate-600">
            Trilha preparada para combinar fundamentos, Google Ads, Meta Ads, copywriting, landing pages e metricas.
          </p>
          <Progress value={18} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
