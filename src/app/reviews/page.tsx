import { Flame } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/permissions";

export default async function ReviewsPage() {
  const user = await requireUser();
  let reviews: {
    id: string;
    nextReviewAt: Date;
    rating: string;
    flashcard: { front: string; back: string };
  }[] = [];

  if (process.env.DATABASE_URL) {
    try {
      reviews = await prisma.flashcardReview.findMany({
        where: { userId: user.id },
        include: { flashcard: { select: { front: true, back: true } } },
        orderBy: { nextReviewAt: "asc" },
        take: 30,
      });
    } catch {}
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold text-slate-950">Revisoes</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="text-teal-600" />
            Historico de revisao inteligente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">
              Revise flashcards dentro das aulas para alimentar sua fila de repeticao espacada.
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-950">{review.flashcard.front}</p>
                  <p className="mt-1 text-xs text-slate-500">{review.flashcard.back}</p>
                  <p className="mt-2 text-xs text-teal-700">
                    Ultima resposta: {review.rating} - proxima revisao:{" "}
                    {review.nextReviewAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
