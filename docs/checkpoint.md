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
  - [ ] Aplicar migration no banco real.
  - [ ] Rodar seed no banco real.
  - [ ] Testar fluxo completo com banco remoto.

- [ ] Fase 3 - Cursos, modulos, aulas e progresso
  - [x] Rotas e telas de cursos criadas.
  - [x] Conteudo mockado/fallback funcionando.
  - [x] Pagina de aula com Markdown criada.
  - [x] Acao base para concluir aula criada.
  - [ ] Conectar toda leitura/escrita ao banco.
  - [ ] Restringir cursos por assinatura/acesso real.
  - [ ] Calcular progresso real por aula, modulo e curso.

- [ ] Fase 4 - Quizzes, flashcards e revisao inteligente
  - [x] UI base de quiz criada.
  - [x] UI base de flashcards criada.
  - [x] Server action base de revisao criada.
  - [ ] Persistir respostas de quiz.
  - [ ] Persistir revisoes de flashcards com IDs reais do banco.
  - [ ] Implementar algoritmo mais robusto de repeticao espacada.

- [ ] Fase 5 - Certificados
  - [x] Pagina publica de certificado criada.
  - [x] Estrutura de certificado no schema criada.
  - [x] QR Code preparado.
  - [ ] Emitir certificado real somente com 100% de conclusao.
  - [ ] Criar layout final do certificado.
  - [ ] Buscar certificado real pelo codigo publico.

- [ ] Fase 6 - Kiwify webhook e acessos
  - [x] Endpoint `/api/webhooks/kiwify` criado.
  - [x] Validacao simples criada.
  - [x] Idempotencia base criada.
  - [ ] Validar assinatura real da Kiwify.
  - [ ] Mapear payload oficial da Kiwify.
  - [ ] Criar/localizar usuario via webhook.
  - [ ] Registrar pagamento real.
  - [ ] Liberar cursos automaticamente apos compra aprovada.

- [ ] Fase 7 - Painel administrativo
  - [x] Rotas admin criadas.
  - [x] Middleware de admin criado.
  - [x] Dashboard admin inicial criado.
  - [ ] CRUD completo de cursos.
  - [ ] CRUD completo de modulos.
  - [ ] CRUD completo de aulas.
  - [ ] CRUD completo de quizzes.
  - [ ] CRUD completo de flashcards.
  - [ ] Gestao completa de usuarios e acessos.
  - [ ] Gestao de pagamentos e certificados.

- [ ] Fase 8 - IA/RAG e busca semantica
  - [x] Schema com pgvector preparado.
  - [x] Endpoint de IA criado.
  - [x] Endpoint de busca base criado.
  - [ ] Gerar embeddings reais.
  - [ ] Implementar chunking de conteudo.
  - [ ] Implementar busca vetorial.
  - [ ] Chamar modelo de IA real.
  - [ ] Retornar fontes reais consultadas.

- [ ] Fase 9 - Gamificacao
  - [x] Schema de XP/conquistas/streak criado.
  - [x] Cards de XP/streak no dashboard criados.
  - [ ] Persistir XP real por evento.
  - [ ] Implementar niveis.
  - [ ] Implementar conquistas.
  - [ ] Implementar streak persistente.

- [ ] Fase 10 - PWA e acabamento
  - [x] Manifest criado.
  - [ ] Criar icones finais.
  - [ ] Fazer auditoria Lighthouse.
  - [ ] Completar estados de loading, erro e vazio.
  - [ ] Refinar experiencia mobile.

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
- [x] Paginas de trilhas, flashcards, revisoes, simulados e certificados.
- [x] Pagina publica de validacao de certificado.
- [x] Painel admin inicial.
- [x] API de busca.
- [x] API de IA com contrato preparado para RAG.
- [x] API de webhook Kiwify.
- [x] Prisma schema amplo.
- [x] Migration inicial com pgvector.
- [x] Seed inicial com admin, cursos, modulos, aulas, quizzes e flashcards.
- [x] Dockerfile, docker-compose, `.gitignore`, `.dockerignore` e `.env.example`.
- [x] Documentacao de arquitetura e deploy Easypanel.

## Pendencias criticas antes de producao

- [ ] Configurar `.env` real fora do Git.
- [ ] Aplicar migration no PostgreSQL real.
- [ ] Rodar seed no banco real.
- [ ] Confirmar se o banco tem permissao para `CREATE EXTENSION vector`.
- [ ] Trocar a senha inicial do admin.
- [ ] Validar fluxo de cadastro/login usando banco real.
- [ ] Conectar progresso, quizzes, flashcards e certificados 100% ao banco.
- [ ] Implementar CRUD real no painel admin.
- [ ] Validar payload e assinatura reais da Kiwify.
- [ ] Implementar liberacao automatica de cursos apos compra aprovada.
- [ ] Configurar provedor de email transacional.
- [ ] Configurar storage de imagens: Cloudflare R2 ou Supabase Storage.
- [ ] Implementar RAG real com embeddings, chunking, busca vetorial e fontes.
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
