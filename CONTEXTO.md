# Prato Digital — Contexto

> Documento autocontido para retomar o projeto sem depender da conversa que o criou.
>
> **Última atualização:** 10/11/2026
> **Estado:** v2.4 - plataforma SaaS para desenvolvedores, com cardápios, sites e auth simulada (demonstração local)
> **Referência de produto:** Valy (valyos.com.br/app) — a **ideia** de painel/CRM/planos/templates, não uma cópia visual. A identidade e o mundo gráfico continuam sendo o encarte da Prato Digital.
> **Projeto anterior:** `../prospeccao-curitiba/` (painel pessoal de prospecção)

---

## 1. O produto agora

O desenvolvedor paga uma **assinatura mensal** para operar a venda de cardápios:

1. Cria a conta em `/criar-conta` (nome, e-mail, senha) e completa a operação (negócio, cidade, WhatsApp). O trial Pro de 7 dias começa sem cartão.
2. Entra na plataforma com a conta vazia e o checklist do primeiro cliente.
3. Abre **Novo projeto** e escolhe o tipo: cardápio, site one-page ou os dois.
4. Escolhe o nicho e encontra clientes (busca ilustrativa ou lista manual do Maps).
5. Gera os projetos em lote e organiza os leads no CRM.
6. Envia a prévia pelo WhatsApp, acompanha o funil e fecha com precificação/contrato.
7. O restaurante/negócio paga **ele**; a Prato Digital cobra a assinatura.

No fim do trial, o app pede um plano em `/app/planos`. Se não assinar, o acesso vira modo leitura — os dados não são apagados. Quem só quer ver usa `/demo` (conta de demonstração com a carteira ilustrativa).

O site público tem duas entradas: o restaurante (landing `/`) e o desenvolvedor (`/parceiros` → `/criar-conta` ou `/entrar`). O restaurante **não cria conta**: ele abre o cardápio ou o site por link.

## 2. Modelo de negócio

| Plano | Preço/mês | Cardápios | Usuários | Extras |
|---|---|---|---|---|
| Starter | R$ 49 | 10 projetos | 1 | CRM, templates, link/export |
| Pro | R$ 97 | 40 projetos | 2 | prospecção em massa, precificação, contratos, link na bio |
| Agência | R$ 197 | ilimitado | 5 | afiliados, white-label (em breve) |

- **Trial PRO de 7 dias** por padrão.
- Checkout **simulado** nesta versão (sem gateway, sem cobrança).
- Oferta ao restaurante: **R$ 597 de criação + R$ 97/mês**, 48h, domínio no nome do cliente, sem comissão por pedido.
- Preços/limites em `src/lib/plans.ts`; oferta do restaurante em `src/config.ts`.

## 3. Usuários

1. **Desenvolvedor/agência assinante** — primário do app. Prospecta pelo Maps, vende por WhatsApp, quer operação pronta e margem.
2. **Dono de restaurante** — visitante da landing pública. Quer ver o cardápio pronto e falar no WhatsApp.
3. **Operador interno da Prato Digital** — mantém marca, templates e produção de apoio.

## 4. Arquitetura de informação do app

Inspirada no Valy, adaptada para cardápios:

- **Início:** Dashboard, Área de membros, Primeiro cliente.
- **Criar e vender:** Novo projeto (wizard), Meus projetos, Templates, Prospecção em massa (Pro), CRM, Link na bio (Pro).
- **Fechar negócio:** Minhas vendas, Precificação (Pro), Contratos (Pro).
- **Sua conta:** Plano e créditos, Afiliados (Agência), Feedback, Conta.

### Rotas

| Rota | Tela |
|---|---|
| `/` | Landing do restaurante |
| `/parceiros` | Landing do desenvolvedor + planos |
| `/app` | Dashboard |
| `/app/novo` | Wizard: tipo → nicho → clientes → criação |
| `/app/projetos` | Projetos (cardápios e sites) |
| `/app/projetos/:leadId` | Editor do cardápio (fora do shell) |
| `/app/sites/:leadId` | Editor do site (fora do shell) |
| `/app/crm` | CRM (quadro/hoje/lista) |
| `/app/templates` | Templates |
| `/app/prospeccao` | Importação em massa |
| `/app/planos` | Plano e créditos |
| `/app/vendas` | Vendas fechadas/MRR |
| `/app/precificacao` | Calculadora de preço |
| `/app/contratos` | Gerador de contrato |
| `/app/area-de-membros` | Kit de scripts e proposta |
| `/app/primeiro-cliente` | Plano de 7 dias |
| `/app/link-na-bio` | Editor/preview da bio |
| `/app/afiliados` | Indicação/comissão (gate Agência) |
| `/app/feedback` | Feedback |
| `/app/conta` | Perfil, tema, backup, limpeza |
| `/c/:slug` | Cardápio público (+ `?m=` com dados) |
| `/s/:slug` | Site público one-page (+ `?d=` com dados) |
| `/bio` | Página pública de links (local) |

`/painel` e `/painel/cardapio/:leadId` foram substituídos por redirects para `/app` e `/app/projetos/:leadId`.

## 5. Fluxos

- **Novo projeto:** `/app/novo` é um wizard. Tipo (cardápio, site ou os dois) → nicho → cidade → busca ilustrativa (10/20 negócios) ou lista manual → seleção → criação em lote de leads + cardápios/sites. Também cria só leads ("Adicionar ao CRM").
- **Cobertura:** 89 cidades em 27 estados (capitais + principais cidades de cada região), com DDD, coordenadas e bairros. O seletor `CityPicker` busca por nome/UF e filtra por região.
- **Mapa:** `CityMap` desenha uma malha urbana própria por cidade (ruas, quadras, parques, rio, rótulos, escala, coordenadas e bússola) com zoom, arrastar e pinos numerados ligados à lista. É ilustrativo, não usa tiles externos.
- **Busca demo:** `src/lib/demoBusinesses.ts` gera resultados determinísticos por nicho/cidade, usando os bairros e o DDD da cidade escolhida. O botão "Google Maps" abre a busca real; não há Google Places/API nesta versão. O wizard deixa isso explícito.
- **Template:** `/app/templates` → “Usar template” → nome/bairro/WhatsApp → cria lead + cardápio; a seção de sites leva ao wizard.
- **CRM:** arrastar card entre colunas muda o status; select no card faz o mesmo no mobile. WhatsApp registra a mensagem no histórico; se o lead era “A contatar”, vira “Enviado” e agenda D+2. “Feito” reagenda o follow-up.
- **Fechado:** define `deal` com R$ 597 + R$ 97 por padrão e alimenta Vendas/MRR.
- **Cardápio:** link compartilhável com payload na URL (`?m=`) + export HTML com fontes embutidas.
- **Site:** editor one-page (identidade, destaques, serviços, tema) + link compartilhável (`/s/:slug?d=`) + export HTML com fontes.
- **Assinatura:** trial → `/app/planos` → selecionar plano → confirmar (demo) → status ativo e gate de recursos atualizado.

## 6. Decisões

- **Sem backend na v2.4.** Tudo em `localStorage`; export/import JSON. Prioriza validar oferta e fluxo antes de investir em infra.
- **Auth simulada, mas com fluxo real:** criar conta (e-mail + senha), entrar, sair, onboarding e guarda de rota. A senha é hash SHA-256 local; não há verificação de e-mail, reset nem sessão de servidor.
- **Trial Pro de 7 dias sem cartão.** A conta nasce vazia; no fim do trial, `/app/planos` pede um plano e o acesso vira leitura se não assinar.
- **Demo separada:** `/demo` abre a conta de demonstração com a carteira ilustrativa; as contas reais começam em zero.
- **Gates por plano** na criação de projetos (cardápios + sites) e em Prospecção/Precificação/Contratos (Pro), Link na bio (Pro) e Afiliados (Agência).
- **Wizard antes do editor:** o novo projeto começa pelo tipo/nicho/clientes, como no Valy; a criação em lote gera lead + cardápio/site.
- **Mapa próprio, não mapa falso:** a malha urbana é gerada por cidade (determinística) e rotulada como ilustrativa; zoom e arrastar dão a sensação de mapa real sem prometer Google Maps.
- **Busca demo, não scraping.** Resultados ilustrativos por nicho/cidade; a busca real do Maps abre em nova aba e a lista pode ser colada. Google Places exige backend/chave.
- **CRM kanban** como visão principal, com “Hoje” para ação e “Lista” para varredura; o card mostra cardápio e site.
- **Templates como atalho de produção**, não como galeria decorativa: criam lead + cardápio/site de verdade.
- **Sites one-page** com 6 templates por ramo, temas claro/escuro/areia, sem fotos; capas tipográficas.
- **Capas tipográficas** em vez de fotos: o produto não depende de imagem e mantém o mundo do encarte.
- **App com tema claro/escuro**, sidebar escura e conteúdo em papel; o site público permanece claro.
- **Sem prova social inventada.** “Mais escolhido” virou “Recomendado”; não há depoimentos/números de clientes.

## 7. Dados

`AppData`:

```ts
{
  leads, menus, sites,
  subscription: { plan, status, startedAt, renewsAt, trialEndsAt? },
  settings: { theme, bio: { name, headline, whatsapp } },
  feedback,
  seeded, updatedAt
}
```

`Lead`: status, prioridade, notas, menuId, siteId, `deal` (setup/mensal), followUpAt, histórico.
`Menu`: slug, tema, accent, categorias/itens, `isDemo`, updatedAt.
`Site`: slug, tema (`claro|escuro|areia`), accent, tagline, about, highlights, services, menuId?, `isDemo`, updatedAt.
Chaves:
- `prato-digital:accounts` — contas (nome, e-mail, hash da senha, empresa, cidade, WhatsApp).
- `prato-digital:session` — sessão atual (sem senha).
- `prato-digital:v1:data:<userId>` — carteira de cada conta.
- `prato-digital:v1:data:demo` — carteira ilustrativa da demonstração.
- `prato-digital:v1` — chave antiga, migrada uma vez para a demo.

O limite do plano conta `menus.length + sites.length` (projetos).

## 8. Suposições e pendências de validação

- Marca, WhatsApp, e-mail, Instagram e domínio continuam placeholders.
- Preços dos planos são propostas de lançamento.
- “Cancele quando quiser” é uma promessa comercial; definir contrato.
- White-label está no roadmap; a assinatura do cardápio/HTML ainda é Prato Digital.
- A busca automática no Google Maps não existe; o wizard usa resultados ilustrativos + link real do Maps + colagem manual.
- O mapa é uma ilustração interativa (sem tiles externos) e a base cobre as principais cidades de cada estado, não todos os municípios.
- O site compartilhado não embute o cardápio junto; os links vão separados na mensagem ou no HTML exportado.
- A bio é uma prévia local; publicar exige backend.
- Auth simulada no navegador: não há verificação de e-mail, reset de senha nem sessão de servidor. Em produção, trocar por auth real.

## 9. O que já foi validado

- Build de produção sem erros de TypeScript.
- Lighthouse 100/100/100 em landing, parceiros, dashboard, CRM, projetos, planos, templates, wizard, editor de site, `/bio`, `/s/studio-essential` e `/s/fx-burgers-site`.
- Testes manuais: tema, trial/upgrade simulado, gates, wizard automático e manual (tipo → nicho → busca → seleção → criação em lote), template → lead + cardápio/site, CRM (quadro/hoje/lista), drawer com site, links `?m=`/`?d=`, export HTML de cardápio e site, bio, contrato, precificação.
- Detector visual do Impeccable sem apontamentos.

## 10. Próximo passo recomendado

Validar a oferta com 5–10 desenvolvedores reais usando o trial e o wizard completo (cardápio e site). Se houver tração, investir em **auth + banco + cobrança real + publicação server-side + Google Places** (ver `TAREFAS.md`). Antes disso, não construir white-label nem prometer busca automática no Maps.
