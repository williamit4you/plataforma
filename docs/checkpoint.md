# Checkpoint do Projeto

Ultima atualizacao: 2026-07-02

## Status geral

O projeto tem um MVP navegavel e compilavel com todas as fases iniciadas. As fases foram implementadas em nivel base/funcional, mas ainda existem pendencias para transformar a plataforma em produto de producao completo.

Validacoes realizadas:

- [x] `npm run prisma:generate`: passou
- [x] `npm run lint`: passou
- [x] `npm run build`: passou
- [x] Servidor local respondeu em `http://localhost:3000`

## Fases

- [x] Fase 0 - Fundacao do repositorio
  - [x] Next.js, TypeScript, Tailwind, Prisma, Docker, env example e docs criados.

- [x] Fase 1 - Layout e paginas base
  - [x] Home criada.
  - [x] Pagina de vendas criada.
  - [x] Componentes base criados.
  - [x] Layout responsivo inicial criado.

- [ ] Fase 2 - Banco, Prisma, autenticacao e roles
  - [x] Schema Prisma criado.
  - [x] Migration inicial criada.
  - [x] Auth.js configurado.
  - [x] Roles `STUDENT` e `ADMIN` configuradas.
  - [x] Aplicar migration no banco real.
  - [x] Rodar seed no banco real.
  - [x] Admin seed configurado com `willianbarata@gmail.com`.
  - [ ] Testar login real no ambiente hospedado apos subir as alteracoes no Git.

- [ ] Fase 3 - Cursos, modulos, aulas e progresso
  - [x] Rotas e telas de cursos criadas.
  - [x] Conteudo mockado/fallback funcionando.
  - [x] Pagina de aula com Markdown criada.
  - [x] Tela de aula melhorada com modo estudo por etapas/secoes.
  - [x] Markdown estilizado para leitura profissional.
  - [x] Acao base para concluir aula criada.
  - [x] Conectar leitura de cursos, modulos, aulas, quizzes e flashcards ao banco real.
  - [x] Conectar conclusao de aula ao banco real.
  - [x] Restringir cursos por assinatura/acesso real para alunos.
  - [x] Calcular progresso real por aula, modulo e curso.

- [ ] Fase 4 - Quizzes, flashcards e revisao inteligente
  - [x] UI base de quiz criada.
  - [x] UI base de flashcards criada.
  - [x] Server action base de revisao criada.
  - [x] Persistir revisoes de flashcards com IDs reais do banco.
  - [x] Exibir historico real de revisoes.
  - [x] Persistir respostas/tentativas de quiz.
  - [x] Gerar XP por quiz respondido.
  - [ ] Implementar algoritmo mais robusto de repeticao espacada.

- [ ] Fase 5 - Certificados
  - [x] Pagina publica de certificado criada.
  - [x] Estrutura de certificado no schema criada.
  - [x] QR Code preparado.
  - [x] Emitir certificado real somente com 100% de conclusao.
  - [x] Buscar certificado real pelo codigo publico.
  - [x] Exibir aluno, curso, codigo, data e QR Code na validacao publica.
  - [x] Criar layout visual final do certificado para impressao/PDF.

- [ ] Fase 6 - Kiwify webhook e acessos
  - [x] Endpoint `/api/webhooks/kiwify` criado.
  - [x] Validacao simples criada.
  - [x] Idempotencia base criada.
  - [x] Criar/localizar usuario via webhook.
  - [x] Registrar pagamento real.
  - [x] Liberar cursos automaticamente apos compra aprovada.
  - [x] Ignorar eventos nao aprovados.
  - [ ] Validar assinatura real da Kiwify com documentacao/payload oficial.
  - [ ] Mapear payload oficial da Kiwify em producao.

- [ ] Fase 7 - Painel administrativo
  - [x] Rotas admin criadas.
  - [x] Middleware de admin criado.
  - [x] Dashboard admin inicial criado.
  - [x] Criacao/atualizacao basica de cursos.
  - [x] Criacao/atualizacao basica de modulos.
  - [x] Criacao/atualizacao basica de aulas em Markdown.
- [x] Importador de curso completo por JSON gerado com IA.
- [x] Formato JSON com Markdown documentado para ChatGPT/Gemini.
- [x] Curso Google Ads do Zero ao Primeiro Anuncio criado em JSON e importado no banco real.
- [x] Curso Meta Ads para Afiliados e Produtos Fisicos criado em JSON e importado no banco real.
  - [x] Liberacao manual de acesso por usuario.
  - [ ] CRUD completo com edicao detalhada, exclusao segura e validacoes visuais.
  - [x] Criacao administrativa basica de perguntas de quiz.
  - [x] Criacao administrativa basica de flashcards.
  - [ ] CRUD completo de quizzes com edicao/exclusao.
  - [ ] CRUD completo de flashcards com edicao/exclusao.
  - [ ] Gestao completa de usuarios, roles e acessos.
  - [ ] Gestao de pagamentos e certificados.

- [ ] Fase 8 - IA/RAG e busca semantica
  - [x] Schema com pgvector preparado.
  - [x] Endpoint de IA criado.
  - [x] Endpoint de busca base criado.
  - [x] Implementar chunking de conteudo em `content_chunks`.
  - [x] Script `npm run rag:index` criado.
  - [x] Busca consulta chunks reais do banco e retorna fontes.
  - [x] Endpoint de IA consulta chunks reais e retorna fontes consultadas.
  - [x] Reindexacao automatica apos importacao de curso por IA.
  - [ ] Gerar embeddings reais com modelo externo.
  - [ ] Implementar busca vetorial com embeddings.
  - [ ] Chamar modelo de IA real.

- [ ] Fase 9 - Gamificacao
  - [x] Schema de XP/conquistas/streak criado.
  - [x] Cards de XP/streak no dashboard criados.
  - [x] Persistir XP real por conclusao de aula, revisao de flashcard e certificado.
  - [x] Implementar conquista inicial de primeira aula.
  - [x] Implementar streak persistente.
  - [x] Implementar niveis por XP.
  - [ ] Implementar conjunto completo de conquistas.

- [ ] Fase 10 - PWA e acabamento
  - [x] Manifest criado.
  - [x] Criar icone PWA inicial.
  - [x] Criar navegacao mobile para aluno/admin.
  - [ ] Fazer auditoria Lighthouse.
  - [ ] Completar estados de loading, erro e vazio.
  - [x] Refinar experiencia mobile base.

## Entregue

- [x] App Next.js 16 com React 19.
- [x] TypeScript, TailwindCSS e componentes reutilizaveis.
- [x] Landing page e pagina de vendas.
- [x] Login, cadastro e recuperacao de senha preparada.
- [x] Auth.js com provider de credenciais.
- [x] Middleware para rotas privadas e admin.
- [x] Dashboard do aluno.
- [x] Listagem de cursos.
- [x] Pagina de curso com modulos e aulas.
- [x] Pagina de aula com Markdown, quiz, flashcards, conclusao e bloco de IA.
- [x] Experiencia de aula em formato de etapas de estudo.
- [x] Paginas de trilhas, flashcards, revisoes, simulados e certificados.
- [x] Pagina publica de validacao de certificado.
- [x] Painel admin inicial.
- [x] Importacao administrativa de cursos completos via JSON + Markdown.
- [x] Arquivos versionados de conteudo em `content/ai-courses/`.
- [x] Script `npm run import:ai-courses` para importar cursos gerados por IA.
- [x] API de busca.
- [x] API de IA com contrato preparado para RAG.
- [x] Indexacao de chunks reais para busca/IA.
- [x] API de webhook Kiwify.
- [x] Prisma schema amplo.
- [x] Migration inicial com pgvector.
- [x] Seed inicial com admin, cursos, modulos, aulas, quizzes e flashcards.
- [x] Dockerfile, docker-compose, `.gitignore`, `.dockerignore` e `.env.example`.
- [x] Dockerfile configurado para aplicar migrations automaticamente no startup do container.
- [x] Dockerfile configurado para rodar seed automaticamente quando `ADMIN_SEED_PASSWORD` existir.
- [x] Documentacao de arquitetura e deploy Easypanel.
- [x] Documentacao do formato de importacao em `docs/ai-course-import-format.md`.

## Pendencias criticas antes de producao

- [ ] Configurar `.env` real fora do Git.
- [ ] Confirmar no Easypanel se `DATABASE_URL` aponta para PostgreSQL, nao para a URL do site.
- [x] Aplicar migration no PostgreSQL real.
- [x] Rodar seed no banco real.
- [x] Confirmar se o banco tem permissao para `CREATE EXTENSION vector`.
- [x] Remover senha fixa `admin123` do seed.
- [x] Criar/atualizar admin real com email `willianbarata@gmail.com`.
- [ ] Validar login real no Easypanel apos novo deploy.
- [ ] Validar fluxo de cadastro/login usando banco real no ambiente hospedado.
- [x] Conectar progresso, flashcards e certificados ao banco.
- [x] Conectar tentativas/respostas de quiz ao banco.
- [x] Implementar CRUD basico real de cursos, modulos e aulas no painel admin.
- [x] Implementar importador de cursos completos gerados por IA.
- [x] Preencher Google Ads com 3 modulos e 6 aulas praticas.
- [x] Preencher Meta/Facebook Ads com 3 modulos e 6 aulas praticas.
- [ ] Implementar CRUD completo no painel admin.
- [ ] Validar payload e assinatura reais da Kiwify.
- [x] Implementar liberacao automatica de cursos apos compra aprovada.
- [ ] Configurar provedor de email transacional.
- [ ] Configurar storage de imagens: Cloudflare R2 ou Supabase Storage.
- [ ] Implementar RAG real com embeddings, chunking, busca vetorial e fontes.
- [x] Implementar RAG inicial com chunking e fontes reais sem embeddings externos.
- [ ] Criar testes automatizados para auth, webhook, progresso e certificados.
- [ ] Fazer auditoria mobile/PWA.

## Comandos uteis

```bash
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:deploy
npm run db:seed
```

## Observacoes de seguranca

- A URL real do banco nao deve ser versionada.
- A senha do banco compartilhada em conversa deve ser rotacionada antes de producao.
- `NEXTAUTH_SECRET` deve ser forte e diferente em producao.
- `KIWIFY_WEBHOOK_SECRET` deve ser configurado no Easypanel e no painel da Kiwify.
