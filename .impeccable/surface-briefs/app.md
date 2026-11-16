# App — surface brief

**Mode:** Operate
**Primary target:** `/app` (dashboard do desenvolvedor)
**Related:** `/app/novo`, `/app/projetos`, `/app/crm`, `/app/templates`, `/app/planos`, `/app/vendas`, `/app/precificacao`, `/app/contratos`, `/app/area-de-membros`, `/app/primeiro-cliente`, `/app/link-na-bio`, `/app/prospeccao`, `/app/afiliados`, `/app/feedback`, `/app/conta`; editores `/app/projetos/:leadId` e `/app/sites/:leadId`; públicos `/c/:slug`, `/s/:slug`

## Audience and job

Desenvolvedor ou agência que vende cardápios para restaurantes de bairro. Assina a plataforma para não montar operação própria. Trabalha em sessões curtas, entre uma conversa de WhatsApp e outra, no notebook e no celular. Precisa saber, ao abrir: **quem abordar agora, qual cardápio mostrar e quanto já fechou**.

**Ação principal:** abrir o wizard, escolher cardápio/site, encontrar clientes e gerar o projeto; enviar o link no WhatsApp.

**Tarefas secundárias:** importar leads, fazer follow-up, atualizar status, gerar contrato, precificar, gerenciar plano.

## Constraints

- Sem backend, login real ou cobrança real nesta versão; o app precisa ser honesto sobre isso.
- A busca de clientes do wizard é ilustrativa; não simular o Google Maps como real.
- Dados no `localStorage`; export/import JSON.
- Limites e gates por plano (Starter, Pro, Agência) contam projetos (cardápios + sites) e precisam ser visíveis.
- O restaurante paga o desenvolvedor; a plataforma cobra a assinatura.
- Não inventar abertura de cardápio, clientes, depoimentos ou benchmarks.
- Mobile 390px e desktop 1280–1440 são os alvos; o CRM precisa funcionar nos dois.
- Tema claro/escuro; AA.

## Chosen direction

Extensão do mundo do encarte de ofertas para uma **mesa de redação de operação**: sidebar escura como capa de jornal, conteúdo em papel, números em display, metadados em mono, carimbos de status. O app é mais silencioso que a landing, mas ainda reconhecível como Prato Digital. Referência de **ideia** (não de estética): Valy — dashboard, CRM, templates, planos, ferramentas de venda.

## Direction contract

**THESIS:** O app é a mesa de redação do desenvolvedor: cada tela responde “o que faço agora?” com números, fila e carimbos. Recusa o dashboard de cards iguais e o CRM decorativo; o funil é a estrutura, não um widget.

**OWN-WORLD:** Sidebar tinta `#17130f` com texto papel; conteúdo em papel jornal; acento vermelho e azul; amarelo para plano/resultado. Passion One nas manchetes, Archivo no trabalho, Courier Prime em números e metadados. Capas de cardápio tipográficas, sem foto. Tema escuro opcional inverte papel/tinta.

**STORY:** O assinante entende seu plano, vê a meta do dia, abre o wizard, escolhe o tipo e o nicho, encontra clientes, gera cardápios/sites e fecha. O CRM mostra o funil inteiro; as ferramentas (preço, contrato, vendas) completam a operação.

**FIRST VIEWPORT:** Sidebar fixa com marca, “Novo projeto” e grupos de navegação. Topbar com “Bem-vindo”, badge de plano, tema, notificações e avatar. Título “Bom dia/Boa tarde/Boa noite, Cezar.”, banner de trial com contagem, cinco métricas, atividade recente e meta de hoje.

**FORM:** Extensão do mundo do encarte (mesmo seed `seed:5a6905e5310a9c11`), sem novo sorteio de direção; a superfície Operate usa o sistema existente com mais contenção.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Auth, banco e cobrança reais.
- Preço final dos planos e política de cancelamento.
- White-label por parceiro.
- Integração Google Places.
- Publicação server-side do cardápio e da bio.
