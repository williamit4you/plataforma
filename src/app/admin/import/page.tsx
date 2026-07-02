import { Clipboard, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiCourseImportExample } from "@/lib/course-import-schema";
import { requireAdmin } from "@/lib/permissions";
import { importAiCourseAction } from "@/server/actions/admin-actions";

const exampleJson = JSON.stringify(aiCourseImportExample, null, 2);

export default async function AdminImportPage() {
  await requireAdmin();

  return (
    <AppShell admin>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-950">Importar curso com IA</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Cole um JSON gerado pelo ChatGPT, Gemini ou outra IA. O importador cria ou atualiza curso, modulos, aulas,
          quizzes e flashcards em uma unica operacao.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-teal-600" />
              JSON do curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={importAiCourseAction} className="space-y-4">
              <textarea
                name="payload"
                defaultValue={exampleJson}
                className="min-h-[620px] w-full rounded-md border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100"
                required
              />
              <Button>Importar curso completo</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="self-start">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="text-teal-600" />
              Prompt para IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm leading-6 text-slate-600">
              <p>Use este pedido no ChatGPT/Gemini:</p>
              <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100">
{`Crie um curso para minha plataforma no formato JSON abaixo.
Regras:
- responda somente JSON valido
- use Markdown em contentMd
- cada aula deve ter secoes ## Objetivos, ## Conteudo, ## Passo a passo, ## Checklist e ## Resumo
- inclua quiz e flashcards por aula
- nao use comentarios fora do JSON

Formato:
${exampleJson}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
