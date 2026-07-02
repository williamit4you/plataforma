import Link from "next/link";
import { Check, Clock, ShieldCheck, Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bullets = [
  "Google Ads do Zero ao Primeiro Anuncio",
  "Meta Ads para Afiliados e Produtos Fisicos",
  "Acesso vitalicio e pagamento unico",
  "Aulas em texto, exemplos, quizzes e flashcards",
  "Base preparada para assistente de IA por aula",
];

export default function SalesPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Oferta inicial</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-slate-950 sm:text-6xl">
              Aprenda Google Ads e Meta Ads de forma pratica, sem depender de aulas longas em video.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Uma plataforma para afiliados iniciantes, pequenos empreendedores e pessoas que querem estudar no estilo
              passo a passo, consultando as aulas como documentacao de execucao.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 text-teal-600" size={18} />
                  {bullet}
                </div>
              ))}
            </div>
          </div>
          <Card className="self-start">
            <CardHeader>
              <CardTitle>Oferta completa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-slate-950">R$ 69,90</p>
              <p className="mt-1 text-sm text-slate-500">Pagamento unico. Acesso vitalicio.</p>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link href="/checkout">Garantir acesso</Link>
              </Button>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-teal-600" /> Garantia etica de 7 dias
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={17} className="text-teal-600" /> Estude no seu ritmo
                </p>
                <p className="flex items-center gap-2">
                  <Zap size={17} className="text-teal-600" /> Conteudo direto ao ponto
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
            {["Para quem quer praticar", "Para quem nao gosta de video longo", "Para consultar durante campanhas"].map(
              (title) => (
                <Card key={title}>
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-slate-600">
                      Estrutura pensada para transformar estudo em execucao, com aulas curtas, checklist e revisao.
                    </p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>
      </main>
    </>
  );
}
