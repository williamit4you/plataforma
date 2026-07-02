import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses } from "@/lib/learning";

export default async function HomePage() {
  const courses = await getCourses();
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
                <Sparkles size={16} />
                Cursos sem aulas longas em video
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Aprenda Google Ads e Meta Ads como documentacao pratica.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Aulas em texto, prints, checklists, quizzes, flashcards e assistente de IA por aula para voce estudar,
                consultar e executar campanhas com mais clareza.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/vendas">
                    Ver oferta
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/register">Criar conta</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                { icon: FileText, title: "Aulas consultaveis", text: "Conteudo em Markdown com passo a passo e exemplos." },
                { icon: CheckCircle2, title: "Pratica guiada", text: "Quizzes, checklists e desafios curtos por aula." },
                { icon: Bot, title: "IA preparada para RAG", text: "Arquitetura para responder com base no conteudo liberado." },
              ].map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                        <item.icon size={20} />
                      </span>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-slate-950">Cursos iniciais</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.slug}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">{course.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
