# Deploy e teste com terceiros

O app é uma SPA estática (Vite). Não tem backend: contas, sessão e dados ficam no navegador de cada tester.

## 1. Antes de publicar

- Atualize `src/config.ts`: WhatsApp, e-mail, Instagram, cidade e nome do operador.
- Rode `npm run build` e confirme que `dist/` foi gerado.
- Teste localmente: `/`, `/parceiros`, `/criar-conta`, `/entrar`, `/demo` e `/app` (deve pedir login).
- O deploy já sai com `X-Robots-Tag: noindex` (ambiente de teste). Remova quando for lançar.

## 2. Publicar

### Opção A — Netlify Drop (mais rápida, sem CLI)

1. Rode `npm run build`.
2. Abra https://app.netlify.com/drop
3. Arraste a pasta `dist` (ou o `dist-teste.zip` gerado).
4. Copie a URL `*.netlify.app`.

`public/_redirects` e `public/_headers` já vão no build, então o SPA e o noindex funcionam no drop.

### Opção B — Vercel

1. `npx vercel login` (uma vez).
2. `npx vercel --prod`.
3. O `vercel.json` já tem rewrites e headers.

### Opção C — Netlify CLI

1. `npx netlify login`
2. `npx netlify deploy --prod --dir=dist`

## 3. Depois de publicar

- Abra a URL em uma janela anônima e teste o fluxo completo.
- Envie a URL + `TESTE.md` para os testers.
- Cada tester tem os próprios dados no navegador; nada é compartilhado.
- O feedback em `/app/feedback` pode ser enviado pelo WhatsApp (ajuste o número em `src/config.ts`).
- Para limpar os dados: `/app/conta` → Limpar tudo.

## 4. O que não está pronto

- Auth simulada no navegador (sem verificação de e-mail, reset de senha ou sessão de servidor).
- Sem cobrança real.
- Fotos ficam no navegador e no HTML exportado; não há armazenamento de arquivos nem publicação no domínio do cliente.
- A busca do Google Maps é ilustrativa e os telefones são fictícios.
- O app não confirma conta no WhatsApp (exigiria API oficial); ele classifica pelo formato, avisa e deixa o operador marcar o canal.
