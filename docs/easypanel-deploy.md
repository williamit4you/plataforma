# Deploy no Easypanel com Docker

## Estrategia

O projeto deve ser publicado no GitHub por voce e conectado ao Easypanel como uma aplicacao Docker.

O banco informado deve ficar apenas nas variaveis de ambiente do Easypanel:

```txt
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=disable
```

Nao coloque a URL real do banco em arquivos versionados.

## Passo a passo

1. Suba o repositorio no GitHub.
2. No Easypanel, crie um novo app.
3. Escolha GitHub como origem.
4. Selecione o repositorio.
5. Escolha Dockerfile como build.
6. Configure a porta publica como `3000`.
7. Adicione as variaveis de ambiente.
8. Execute o primeiro deploy.
9. O Dockerfile roda `npm run prisma:deploy` automaticamente antes de iniciar o Next.js.
10. Se `ADMIN_SEED_PASSWORD` estiver configurado, o Dockerfile tambem roda `npm run db:seed` no startup.
11. Configure dominio e HTTPS.

## Variaveis obrigatorias

```txt
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
KIWIFY_WEBHOOK_SECRET=
ADMIN_SEED_EMAIL=
ADMIN_SEED_PASSWORD=
```

## Variaveis opcionais por fase

```txt
OPENAI_API_KEY=
STORAGE_PROVIDER=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
```

## Observacoes

- O `NEXTAUTH_URL` deve usar o dominio final em producao.
- Gere `NEXTAUTH_SECRET` com valor forte.
- Use `ADMIN_SEED_EMAIL` e `ADMIN_SEED_PASSWORD` apenas como variaveis de ambiente, nunca hardcoded no Git.
- Antes de usar RAG, confirme se o PostgreSQL tem `pgvector` habilitado.
- Se aparecer erro `The table public.Course does not exist`, o app esta apontando para um banco sem migrations ou o `DATABASE_URL` esta incorreto. Confirme que `DATABASE_URL` e uma URL PostgreSQL, nao a URL do site.
- O formato correto e `postgres://usuario:senha@host:porta/banco?sslmode=disable`.
- Para criar o admin automaticamente no startup, configure `ADMIN_SEED_EMAIL` e `ADMIN_SEED_PASSWORD` no Easypanel.
- Para webhooks, cadastre no painel da Kiwify a URL final:

```txt
https://seudominio.com/api/webhooks/kiwify
```
