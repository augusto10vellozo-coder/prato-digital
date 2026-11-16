# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript + React Router; SPA estática para Vercel/Netlify. Sem backend na v2: assinatura, leads, cardápios e feedback no `localStorage`, com export/import JSON, link de cardápio com dados na URL e export HTML autônomo.

## Users

1. **Desenvolvedor/agência assinante (primário do app).** Vende sites e cardápios para comércios locais, trabalha sozinho ou em agência pequena, prospecta pelo Google Maps e WhatsApp. Paga uma mensalidade para ter CRM, templates, gerador de cardápio/site e ferramentas de fechamento — e fica com o cliente.
2. **Dono de negócio local (visitante do site público).** Restaurante de bairro ou negócio de serviço (academia, clínica, pet, beleza, oficina). Quer ver como fica e falar no WhatsApp.
3. **Operador da Prato Digital (interno).** Mantém a marca, os templates, os planos e a produção quando o parceiro precisa de apoio.

## Product Purpose

Dar ao desenvolvedor uma operação pronta para vender **cardápios e sites**: escolher o tipo e o nicho, encontrar/importar negócios, gerar uma prévia navegável com a identidade da casa, enviar pelo WhatsApp e acompanhar o funil até o contrato. O negócio local compra do desenvolvedor; o desenvolvedor assina a plataforma.

Sucesso: o assinante cria o primeiro projeto em menos de 10 minutos e faz o primeiro envio no mesmo dia.

## Positioning

Não é só um gerador de cardápio nem só um CRM: é uma **operação de venda de cardápios e sites** com wizard de tipo/nicho/clientes, demonstração pronta antes do primeiro contato, links compartilháveis sem backend e ferramentas de fechamento (precificação, contrato, vendas). O negócio local vê o produto, não uma proposta.

## Operating Context

- Assinatura mensal com três planos: Starter (10 projetos), Pro (40) e Agência (ilimitado). Projeto = cardápio ou site.
- Teste PRO de 7 dias; cobrança simulada nesta versão.
- Prospecção pelo Google Maps + importação em massa por colagem de lista. O wizard também oferece uma busca **ilustrativa** por nicho/cidade; a busca real no Places exige backend e chave.
- Abordagem e follow-up no WhatsApp; CRM com funil Novo → Contatado → Negociando → Fechado.
- Oferta ao restaurante: R$ 597 de criação + R$ 97/mês, entrega em 48h, domínio no nome do cliente, sem comissão por pedido.
- Templates por ramo (hamburgueria, pizzaria, açaí, lanches, comida brasileira, cafeteria).
- Cardápio público mobile-first e export HTML com fontes embutidas.

## Capabilities and Constraints

- Landing pública de restaurante, página pública para desenvolvedores, app com sidebar/topbar, tema claro/escuro.
- App: wizard de projeto (tipo → nicho → clientes → criação em lote); dashboard com metas e atividade; projetos de cardápio e site; CRM (quadro, hoje e lista); templates; plano e créditos; vendas; precificação; contratos; área de membros; primeiro cliente; link na bio; prospecção em massa; afiliados; feedback; conta.
- Busca ilustrativa por nicho/cidade (10/20 negócios), seleção e criação em lote; busca manual com link real do Google Maps.
- Cardápio e site one-page com 6 templates cada; temas; link com payload na URL (`?m=`/`?d=`) e export HTML autônomo com fontes embutidas.
- Limites por plano (projetos = cardápios + sites), gates de recurso (Pro/Agência), trial e upgrade simulados.
- Conta: criar conta em 2 passos, entrar, sair, perfil e trial Pro de 7 dias sem cartão; demo separada em `/demo`.
- Sem backend, pagamento real, upload de fotos, Google Places, publicação server-side ou múltiplos usuários. A auth é simulada no navegador (sem verificação de e-mail, reset de senha ou sessão de servidor). A busca automática do wizard é demonstrativa.
- Dados por navegador; export/import JSON. O painel não deve ser exposto publicamente sem auth.
- Os dados de exemplo são ilustrativos; telefones fictícios. Nenhum cliente/depoimento/métrica real.

## Brand Commitments

- Nome de trabalho **Prato Digital** (não confirmado).
- Mundo visual: encarte de ofertas de bairro, duas tintas, papel jornal; o app usa o mesmo mundo com uma moldura de “mesa de redação” e tema escuro opcional.
- Tom: direto, brasileiro, caloroso, sem hype de growth.
- Oferta ao restaurante confirmada: R$ 597 + R$ 97/mês. Preços de assinatura são propostas de lançamento.
- “Mais escolhido” foi substituído por “Recomendado” para não inventar prova social.

## Evidence on Hand

- `../prospeccao-curitiba/CONTEXTO.md` — oferta e critérios de qualificação.
- Seed com 13 leads, 4 cardápios e 2 sites ilustrativos; 1 cliente fechado (Açaí) para demonstrar vendas.
- Nenhum depoimento, case, número de clientes ou benchmark real. Não fabricar.

## Product Principles

1. **Demonstrar antes de vender.** O lead vê o cardápio ou site pronto.
2. **Uma operação, não um monte de ferramentas.** Wizard, CRM, templates, editores e fechamento no mesmo fluxo.
3. **O assinante é dono do cliente.** O negócio local paga o desenvolvedor; a plataforma cobra a assinatura.
4. **O celular é o balcão.** Cardápio, site, WhatsApp e CRM desenhados para uma mão.
5. **Dados exportáveis.** Nada preso a servidor na v2.1; backup em JSON.

## Accessibility & Inclusion

- WCAG AA, foco visível, navegação por teclado, landmarks e skip link em todas as rotas.
- Tema claro/escuro com contraste verificado.
- Alvos de toque ≥40px nas ações principais; cardápio legível sob luz forte.
- `prefers-reduced-motion` respeitado.
