import { Flame } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Revisoes do dia</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="text-teal-600" />
            Revisao inteligente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-slate-600">
            Flashcards revisados com os botoes errei, dificil, bom e facil recalculam a proxima data de revisao.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
