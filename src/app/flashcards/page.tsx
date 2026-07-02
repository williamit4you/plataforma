import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flashcards as mockFlashcards } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";

export default async function FlashcardsPage() {
  await requireUser();
  let flashcards = mockFlashcards.map((card, index) => ({ id: String(index), front: card.front, back: card.back }));

  if (process.env.DATABASE_URL) {
    try {
      const dbFlashcards = await prisma.flashcard.findMany({
        select: { id: true, front: true, back: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      if (dbFlashcards.length) flashcards = dbFlashcards;
    } catch {}
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Flashcards</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {flashcards.map((card) => (
          <Card key={card.id}>
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
