import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flashcards } from "@/lib/mock-data";

export default function FlashcardsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Flashcards</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {flashcards.map((card) => (
          <Card key={card.front}>
            <CardHeader>
              <CardTitle>{card.front}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">{card.back}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
