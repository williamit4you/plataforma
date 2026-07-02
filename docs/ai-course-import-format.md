# Formato de Importacao de Cursos com IA

Use JSON estruturado com Markdown dentro de `contentMd`.

Por que esse formato:

- JSON organiza curso, modulos, aulas, quizzes e flashcards.
- Markdown deixa a aula bonita e facil de gerar por ChatGPT/Gemini.
- O painel `/admin/import` importa tudo em uma unica operacao.

## Regras para gerar conteudo

- Responder somente JSON valido.
- Usar Markdown em `contentMd`.
- Criar secoes com `## Objetivos`, `## Conteudo`, `## Passo a passo`, `## Checklist` e `## Resumo`.
- Incluir quiz e flashcards em cada aula.
- Usar `order` para controlar a ordem de modulos e aulas.

## Prompt base

```txt
Crie um curso para minha plataforma no formato JSON abaixo.
Regras:
- responda somente JSON valido
- use Markdown em contentMd
- cada aula deve ter secoes ## Objetivos, ## Conteudo, ## Passo a passo, ## Checklist e ## Resumo
- inclua quiz e flashcards por aula
- nao use comentarios fora do JSON
```

## Campos principais

- `course`: dados do curso.
- `modules`: lista de modulos.
- `modules[].lessons`: aulas do modulo.
- `contentMd`: conteudo da aula em Markdown.
- `quiz.questions`: perguntas da aula.
- `flashcards`: cards de revisao.

## Arquivos de exemplo versionados

- `content/ai-courses/google-ads-do-zero-ao-primeiro-anuncio.json`
- `content/ai-courses/meta-ads-para-afiliados-e-produtos-fisicos.json`

Para importar esses arquivos no banco configurado em `DATABASE_URL`:

```bash
npm run import:ai-courses
```
