# Spec Driven Development - Plataforma de Cursos

## 1. Decisao de arquitetura

Sim, da para criar o produto inteiro com Next.js como frontend e backend.

O modelo recomendado e um monolito modular com Next.js App Router, usando:

- Frontend: React 19, Server Components, Client Components quando houver interacao rica.
- Backend: Route Handlers para webhooks, APIs publicas e IA; Server Actions para operacoes internas autenticadas.
- Banco: PostgreSQL com Prisma ORM.
- Autenticacao: Auth.js/NextAuth com roles `STUDENT` e `ADMIN`.
- Conteudo: Markdown/MDX salvo no banco, renderizado com sanitizacao.
- IA/RAG: PostgreSQL com pgvector, embeddings, chunks e historico de conversa.
- Deploy: Docker no Easypanel.

Essa abordagem reduz complexidade operacional no MVP, evita manter uma API separada cedo demais e ainda permite extrair servicos depois, por exemplo workers de embeddings, busca ou notificacoes.

## 2. Objetivo do produto

Construir uma plataforma profissional de cursos online para Marketing Digital, sem depender de aulas longas em video. O aluno aprende por texto, imagens, prints, passo a passo, exercicios, quizzes, flashcards, simulados, revisao inteligente, gamificacao, certificados e assistente de IA limitado ao conteudo liberado.

## 3. Escopo do MVP

O MVP deve entregar:

- Landing page institucional.
- Pagina de vendas da oferta `Google Ads + Meta Ads`.
- Login, cadastro e recuperacao de senha.
- Area do aluno.
- Lista de cursos liberados.
- Pagina do curso com modulos e progresso.
- Pagina de aula com Markdown/MDX, imagens, exercicios, quiz, checklist, flashcards e conclusao.
- Progresso por aula, modulo e curso.
- Flashcards com revisao espacada.
- Certificado simples com codigo de validacao e QR Code.
- Painel administrativo inicial.
- Liberacao manual de acesso.
- Webhook da Kiwify para liberacao automatica.
- Base tecnica preparada para IA/RAG, busca semantica, simulados, trilhas, gamificacao e PWA.

## 4. Stack tecnica

- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Shadcn UI
- Lucide Icons
- Framer Motion
- PostgreSQL
- Prisma ORM
- Auth.js/NextAuth
- Zod
- React Hook Form
- Markdown/MDX
- Cloudflare R2 ou Supabase Storage
- Kiwify Webhook
- Docker
- Easypanel

## 5. Estrutura de pastas proposta

```txt
src/
  app/
    (marketing)/
      page.tsx
      vendas/page.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
      forgot-password/page.tsx
    (student)/
      dashboard/page.tsx
      courses/page.tsx
      courses/[slug]/page.tsx
      courses/[slug]/lessons/[lessonSlug]/page.tsx
      learning-paths/page.tsx
      flashcards/page.tsx
      reviews/page.tsx
      simulations/page.tsx
      certificates/page.tsx
    admin/
      page.tsx
      courses/page.tsx
      modules/page.tsx
      lessons/page.tsx
      users/page.tsx
      payments/page.tsx
      certificates/page.tsx
    certificate/[code]/page.tsx
    api/
      auth/[...nextauth]/route.ts
      webhooks/kiwify/route.ts
      ai/chat/route.ts
      search/route.ts
  components/
    ui/
    layout/
    marketing/
    course/
    lesson/
    quiz/
    flashcard/
    admin/
  features/
    auth/
    courses/
    progress/
    payments/
    certificates/
    ai/
    gamification/
  lib/
    auth.ts
    prisma.ts
    env.ts
    permissions.ts
    markdown.ts
    rate-limit.ts
  server/
    actions/
    services/
    repositories/
  styles/
prisma/
  schema.prisma
  seed.ts
docs/
```

## 6. Modelo de dados

### Identidade e seguranca

- `users`: aluno/admin, nome, email, senha hash, role, status.
- `accounts`, `sessions`, `verification_tokens`: compatibilidade Auth.js.
- `admin_logs`: auditoria de acoes administrativas.

### Conteudo

- `courses`: curso, slug, preco, nivel, carga horaria, status.
- `modules`: agrupamento ordenado de aulas.
- `lessons`: conteudo MDX, objetivos, dificuldade, tempo estimado, resumo, checklist.
- `lesson_images`: imagens e prints associados a aulas.

### Avaliacao

- `quizzes`: quiz por aula, modulo ou curso.
- `questions`: perguntas.
- `answers`: alternativas e resposta correta.
- `simulations`: simulados por curso.
- `simulation_questions`: relacao simulado/pergunta.
- `simulation_attempts`: tentativas, nota, tempo e recomendacoes.

### Aprendizado

- `progress`: progresso por usuario, curso, modulo e aula.
- `flashcards`: pergunta, resposta, dificuldade e origem.
- `flashcard_reviews`: revisoes do usuario, acertos, erros e proxima revisao.
- `learning_paths`: trilhas.
- `learning_path_courses`: cursos ordenados dentro da trilha.

### Pagamento e acesso

- `subscriptions`: acesso vitalicio ou futuro plano.
- `payments`: pagamento aprovado, cancelado, reembolsado.
- `webhook_events`: eventos recebidos, payload bruto e status de processamento.

### Certificados

- `certificates`: usuario, curso ou trilha, codigo publico, data, QR Code.

### Gamificacao

- `achievements`: conquistas disponiveis.
- `user_achievements`: conquistas desbloqueadas.
- `xp_events`: eventos de XP.
- `study_streaks`: sequencia diaria.

### IA/RAG

- `content_chunks`: trechos indexaveis de aulas, cursos, FAQs e exercicios.
- `embeddings`: vetor, modelo, chunk e metadados.
- `ai_threads`: conversas por usuario e escopo.
- `ai_messages`: mensagens, fontes consultadas e resposta.

### Futuro comercial

- `future_affiliates`
- `future_coupons`
- `future_orders`

## 7. Fluxo de autenticacao

1. Usuario cria conta por email e senha.
2. Senha e armazenada com hash forte.
3. Auth.js cria sessao.
4. Middleware protege rotas privadas.
5. `role` controla acesso administrativo.
6. Server Actions validam usuario no servidor antes de mutar dados.
7. Endpoints sensiveis usam Zod, rate limit e logs.

## 8. Fluxo de pagamento Kiwify

1. Kiwify envia webhook para `/api/webhooks/kiwify`.
2. Plataforma valida assinatura/token do evento.
3. Registra payload em `webhook_events`.
4. Verifica idempotencia pelo identificador externo.
5. Localiza ou cria usuario pelo email do comprador.
6. Registra `payment`.
7. Cria `subscription` com acesso vitalicio.
8. Libera os cursos da oferta.
9. Envia email de boas-vindas quando o provedor estiver configurado.
10. Marca webhook como processado ou falho.

## 9. Fluxo de progresso

1. Aluno abre uma aula liberada.
2. Sistema registra ultimo acesso.
3. Ao clicar em concluir, cria/atualiza `progress`.
4. Recalcula progresso do modulo e curso.
5. Gera XP.
6. Atualiza sequencia diaria.
7. Ao completar 100% do curso, habilita certificado.

## 10. Fluxo de flashcards

As respostas seguem quatro botoes:

- `errei`: revisao em minutos ou no mesmo dia.
- `dificil`: revisao em curto prazo.
- `bom`: aumenta intervalo de revisao.
- `facil`: aumenta intervalo com multiplicador maior.

Cada revisao atualiza acertos, erros, dificuldade percebida, status de memorizacao e `nextReviewAt`.

## 11. Fluxo de IA/RAG

1. Conteudos publicados sao quebrados em chunks.
2. Cada chunk recebe embedding.
3. Pergunta do aluno gera embedding de consulta.
4. Busca semantica filtra por escopo permitido: aula, modulo, curso ou cursos liberados.
5. O modelo recebe apenas chunks autorizados.
6. Resposta inclui fontes consultadas.
7. Caso nao haja fonte suficiente, a IA informa que nao encontrou base no conteudo da plataforma.

Regra central: a IA nao deve responder com conhecimento externo quando o modo for assistente da plataforma.

## 12. Painel administrativo

O painel deve permitir:

- Gerenciar usuarios e roles.
- Liberar e remover acessos.
- Criar cursos, modulos e aulas.
- Editar aulas em Markdown/MDX.
- Fazer upload de imagens.
- Criar quizzes, perguntas e alternativas.
- Criar flashcards.
- Criar simulados.
- Ver pagamentos e webhooks.
- Emitir e consultar certificados.
- Visualizar progresso do aluno.
- Consultar logs administrativos.

## 13. Rotas

- `/`
- `/vendas`
- `/login`
- `/register`
- `/forgot-password`
- `/dashboard`
- `/courses`
- `/courses/[slug]`
- `/courses/[slug]/lessons/[lessonSlug]`
- `/learning-paths`
- `/learning-paths/[slug]`
- `/flashcards`
- `/reviews`
- `/simulations`
- `/certificates`
- `/certificate/[code]`
- `/checkout`
- `/admin`
- `/admin/courses`
- `/admin/modules`
- `/admin/lessons`
- `/admin/users`
- `/admin/payments`
- `/admin/certificates`
- `/api/webhooks/kiwify`
- `/api/ai/chat`
- `/api/search`

## 14. SDD por fases

### Fase 0 - Fundacao do repositorio

Entregaveis:

- Projeto Next.js criado.
- TypeScript estrito.
- TailwindCSS configurado.
- Shadcn UI instalado.
- Prisma configurado.
- `.env.example`, `.gitignore`, `.dockerignore`, `Dockerfile`.
- Documentacao de arquitetura.

Criterios de aceite:

- `npm run lint` passa.
- `npm run build` passa.
- App sobe localmente.
- Nenhum segredo real fica versionado.

### Fase 1 - Layout, design system e paginas base

Entregaveis:

- Shell visual com header, sidebar, breadcrumbs e tema claro/escuro.
- Landing page inicial.
- Pagina de vendas responsiva.
- Componentes base: cards, progress bars, badges, empty states, skeletons.

Criterios de aceite:

- Mobile e desktop utilizaveis.
- Pagina de vendas exibe oferta de R$ 69,90.
- CTAs apontam para checkout/configuracao futura.

### Fase 2 - Banco, Prisma, autenticacao e roles

Entregaveis:

- Schema Prisma inicial.
- Migrations.
- Seed com admin e cursos iniciais.
- Auth.js configurado.
- Middleware de protecao.
- Roles `STUDENT` e `ADMIN`.

Criterios de aceite:

- Usuario consegue registrar, logar e sair.
- Admin acessa `/admin`.
- Aluno sem permissao nao acessa `/admin`.

### Fase 3 - Cursos, modulos, aulas e progresso

Entregaveis:

- Lista de cursos.
- Pagina do curso.
- Pagina da aula.
- Renderizacao segura de Markdown/MDX.
- Conclusao de aula.
- Progresso por curso.

Criterios de aceite:

- Aluno ve apenas cursos liberados.
- Aula concluida permanece concluida apos reload.
- Progresso reflete aulas completadas.

### Fase 4 - Quizzes, flashcards e revisao inteligente

Entregaveis:

- Quiz simples por aula.
- Flashcards por aula.
- Tela de revisoes do dia.
- Algoritmo inicial de repeticao espacada.

Criterios de aceite:

- Resposta do quiz gera feedback.
- Revisao de flashcard recalcula proxima data.
- Dashboard mostra flashcards pendentes.

### Fase 5 - Certificados

Entregaveis:

- Geracao de certificado ao concluir curso.
- Codigo publico de validacao.
- QR Code.
- Pagina `/certificate/[code]`.

Criterios de aceite:

- Certificado so e emitido para curso completo.
- Link publico valida autenticidade sem expor dados sensiveis.

### Fase 6 - Kiwify webhook e acessos

Entregaveis:

- Endpoint `/api/webhooks/kiwify`.
- Validacao do evento.
- Registro idempotente.
- Criacao/localizacao de usuario.
- Liberacao automatica de cursos.

Criterios de aceite:

- Mesmo webhook enviado duas vezes nao duplica pagamento/acesso.
- Evento invalido e recusado.
- Falhas ficam registradas para reprocessamento.

### Fase 7 - Painel administrativo

Entregaveis:

- Dashboard admin.
- CRUD de cursos, modulos e aulas.
- CRUD de quizzes e flashcards.
- Gestao de usuarios e acessos.
- Visualizacao de pagamentos, webhooks e certificados.

Criterios de aceite:

- Admin cria uma aula e ela aparece para alunos com acesso.
- Toda acao sensivel registra `admin_logs`.

### Fase 8 - IA/RAG e busca semantica

Entregaveis:

- Extensao pgvector.
- Tabela de chunks e embeddings.
- Job ou action para indexar conteudo.
- Busca semantica.
- Chat por aula com fontes.

Criterios de aceite:

- Busca retorna trechos relevantes.
- IA respeita escopo de acesso do aluno.
- Resposta mostra fontes consultadas.

### Fase 9 - Gamificacao

Entregaveis:

- XP por acoes.
- Niveis.
- Conquistas iniciais.
- Sequencia diaria.
- Metas semanais.

Criterios de aceite:

- Concluir aula gera XP uma unica vez.
- Dashboard mostra XP, nivel e streak.

### Fase 10 - PWA e acabamento

Entregaveis:

- Manifest.
- Icones.
- Tema mobile.
- Instalacao no celular.
- Estados de carregamento, erro e vazio.

Criterios de aceite:

- Lighthouse PWA sem problemas criticos.
- App utilizavel em telas pequenas.

## 15. Conteudo inicial

### Curso 1

Nome: Google Ads do Zero ao Primeiro Anuncio

Modulos:

1. Introducao ao Google Ads
2. Estrutura da Conta
3. Palavras-chave
4. Tipos de Campanha
5. Criando a Primeira Campanha
6. Anuncios
7. Conversoes
8. Otimizacao
9. Erros Comuns
10. Checklist Final

### Curso 2

Nome: Meta Ads para Afiliados e Produtos Fisicos

Modulos:

1. Introducao ao Meta Ads
2. Business Manager
3. Pixel e Eventos
4. Publicos
5. Criativos
6. Campanhas para Afiliados
7. Testes A/B
8. Metricas
9. Otimizacao
10. Checklist Final

## 16. Regras de seguranca

- Nunca versionar `.env`.
- Rotacionar a senha do banco caso tenha sido compartilhada fora de canal seguro.
- Validar entrada com Zod.
- Sanitizar Markdown/MDX.
- Proteger rotas por sessao e role.
- Aplicar rate limit em login, recuperacao de senha, IA, busca e webhooks.
- Registrar webhooks brutos para auditoria.
- Usar idempotencia em pagamentos.
- Evitar expor detalhes internos em mensagens de erro.

## 17. Configuracao de ambiente

Variaveis principais:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `KIWIFY_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `STORAGE_PROVIDER`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_URL`

## 18. Deploy no Easypanel

Modelo recomendado:

1. Criar app no Easypanel a partir do repositorio GitHub.
2. Selecionar deploy via Dockerfile.
3. Configurar variaveis de ambiente no painel, nunca no Git.
4. Usar o PostgreSQL externo informado em `DATABASE_URL`.
5. Rodar migrations no processo de release ou manualmente antes do primeiro deploy.
6. Expor porta `3000`.
7. Configurar dominio e HTTPS pelo Easypanel.

## 19. Comandos esperados

```bash
npm install
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

## 20. Riscos e decisoes pendentes

- Next.js 16 e React 19 devem ser confirmados no momento da implementacao, pois versoes e APIs podem mudar.
- Kiwify exige confirmacao do formato real do webhook e mecanismo de assinatura.
- pgvector precisa estar habilitado no PostgreSQL informado.
- Email transacional ainda precisa de provedor: Resend, Postmark, Sendgrid ou outro.
- Storage deve ser escolhido entre Cloudflare R2 e Supabase Storage antes do upload real.
- IA/RAG deve entrar depois do conteudo e permissao estarem maduros, para evitar vazamento de conteudo entre alunos.
