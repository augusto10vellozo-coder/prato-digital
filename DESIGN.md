# Design — Prato Digital

**Mundo:** encarte de ofertas de bairro, impresso em duas tintas sobre papel jornal.
**Superfícies:** landing e parceiros (Persuade); app do desenvolvedor — dashboard, CRM, planos, ferramentas (Operate); editor e cardápio (Experience/Read).
**Processo:** direção sorteada pelo Impeccable (candidato 3 de 7), registro em `PRODUCT.md` e contrato em `.impeccable/surface-briefs/landing.md`.

## 1. Por que esse mundo

O público é dono de restaurante de bairro e programador que vende para comércio local. O repertório compartilhado não é SaaS: é o encarte do mercado, o cupom do jornal, o cardápio plastificado no balcão, o carimbo de “promoção”. O encarte permite três coisas que um template de landing não permite:

1. **Preço e oferta no centro**, com tipografia de manchete e tabela de valores.
2. **Densidade** para o painel (placar, pauta, tabela de leads) sem parecer dashboard genérico.
3. **Artefato**: o cardápio demo é um suplemento impresso, não um mockup de celular.

O risco declarado: se a tipografia não for afiada, o encarte vira barato. A execução usa display condensada grande, réguas de 1px, papel com ruído e duas tintas disciplinadas.

## 2. Tokens

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#ece4d2` | fundo principal |
| `--paper-2` | `#e2d7c1` | faixas, cabeçalhos de tabela |
| `--paper-3` | `#f7f1e3` | cupons, cartões, campos |
| `--ink` | `#1a1611` | texto, réguas, botões |
| `--ink-2` | `#3a3127` | texto secundário forte |
| `--ink-soft` | `#675b4b` | legendas e metadados |
| `--red` | `#c8372d` | urgência, CTA, carimbo |
| `--red-dark` | `#94251e` | texto pequeno em vermelho |
| `--blue` | `#22458c` | classificado, links, estados |
| `--blue-dark` | `#183266` | texto pequeno em azul |
| `--yellow` | `#e9ba43` | destaque de preço/resultado |
| `--line` | `rgba(26,22,17,.22)` | réguas internas |
| `--focus` | `#1f4fa0` | anel de foco |

Tipografia auto-hospedada em `public/fonts/`:

| Família | Pesos | Papel |
|---|---|---|
| **Passion One** | 400, 700, 900 | manchetes, preços grandes, marca |
| **Archivo** | 400–800 (variável) | corpo, UI, botões, formulários |
| **Courier Prime** | 400, 700 | preços de cardápio, metadados, placar, tabelas |

Escala: display `clamp(58px, 8.6vw, 122px)` na landing; títulos de seção `clamp(36px, 5vw, 62px)`; corpo 15–19px; metadados 8–10px em mono com `letter-spacing` de 0.08–0.13em. Corpo de texto limitado a ~50–58ch.

Grade: 12 colunas implícitas; largura máxima 1280px (1440px no painel); gutter `clamp(18px, 4vw, 48px)`. Seções separadas por régua de 1px; cabeçalhos de seção por régua dupla de 3px.

## 3. Componentes-assinatura

- **Masthead de jornal**: linha de edição (cidade, data, ano/nº), marca em display gigante com ponto vermelho, carimbo redondo “Pronto em 48h” e CTA. No mobile, a linha vira edição curta, o carimbo some e o CTA ocupa a largura.
- **Suplemento**: o `MenuSheet` é uma folha de cardápio com borda, topo “Prévia · 48h”, marca, metadados, duas ou três categorias, líderes pontilhados e preço em mono. Aparece inclinado com fita adesiva na landing e como prévia ao vivo no editor.
- **Ticker**: faixa preta com itens separados por asterisco amarelo; pausa no hover/focus e para com `prefers-reduced-motion`.
- **Cupom**: borda tracejada, linha “recorte aqui” com tesoura, CTA. Usado no fechamento da landing/parceiros e no rodapé do cardápio.
- **Carimbos**: `.stamp` com borda de 1.5px, mono, levemente rotacionado. Status do lead: contorno (a contatar), azul cheio (enviado), amarelo (respondeu), vermelho (fechado), hachura (descartado). A hachura é estado, não decoração.
- **Placar do painel**: KPIs em colunas com régua vertical; números em display; sem cards arredondados.
- **Mesa de redação**: pauta de follow-ups à esquerda, placar por status à direita; tabela de leads com linhas de 1px e seleção de status em forma de carimbo.
- **Editor**: formulário em painéis com cabeçalho cinza-papel; prévia sticky; itens com tags, mover/remover e “adicionar”.
- **Cardápio público**: cabeçalho editorial, navegação de categorias sticky com busca, itens em duas colunas com líderes pontilhados, preço em mono, tags, botão fixo de WhatsApp no mobile. Temas `encarte`, `noite`, `leve`.

## 4. Cor

Estratégia **duas tintas**: papel quente como campo dominante, tinta quase preta para todo texto e réguas, vermelho como tinta de urgência/CTA e azul como tinta de classificado/estado. Amarelo é reservado a resultado e selo. Nada de gradiente, vidro ou sombra colorida. Profundidade só em sombras difusas de papel (ex.: suplemento) e no contraste de campos.

O tema `noite` do cardápio troca o papel por `#17130f` e usa `color-mix` para clarear a cor da casa; o tema `leve` remove a textura e usa branco quente. A cor da casa é aplicada inline via `--accent` e não deve ser usada em texto pequeno sem mistura.

## 5. Movimento

- **Uma entrada orquestrada** por seção: `Reveal` com `IntersectionObserver`, fade + 16px, 0.7s, delays escalonados. Conteúdo nasce visível; sem JS, permanece visível.
- **Ticker** contínuo de 34s; pausa no hover/focus.
- **Troca de exemplo** com fade/translate de 150ms.
- **Drawer** entra em 260ms; overlay em 200ms.
- **Hover** de botões troca para vermelho; `active` desloca 1px.
- Tudo respeita `prefers-reduced-motion` (animações reduzidas a 0.01ms, scroll automático).

## 6. Estados e acessibilidade

- Foco visível em azul (`--focus`) com offset; em superfícies escuras, o foco do cardápio usa a cor de destaque.
- Skip link para `#conteudo` em todas as rotas.
- Contraste AA: texto pequeno em vermelho usa `--red-dark`; legendas em `--ink-soft`; no cardápio `noite`, textos de acento são misturados com o papel.
- Alvos de toque ≥44px (botões) e 30–40px apenas em ações densas de tabela, com `aria-label`.
- Tabela de leads: seleção de status com rótulo; ações com `aria-label`; linha clicável para mouse, botão “olho” para teclado.
- Drawer: `role="dialog"`, `aria-modal`, foco inicial no fechar, armadilha de Tab, Escape e restauração do foco.
- Cardápio: busca com label sr-only, `aria-current="location"` na categoria ativa, link de pedido com texto explícito, botão de impressão.
- Formulários com labels visíveis, mensagens de erro em texto e `aria-pressed` em chips/tags.
- `prefers-reduced-motion`, foco, seleção e scrollbar tematizados.

## 7. Voz

Direta, brasileira, sem jargão de agência e sem hype. Frases curtas. “Você” e “a gente”. Números quando existem; nada de “revolucionário”, “escalável” ou “solução 360”. Metáforas do mundo impresso são bem-vindas (“edição”, “suplemento”, “pauta”, “mesa”, “carimbo”), mas a interface continua dizendo o que faz: “Copiar link”, “Exportar HTML”, “Salvar e abrir”.

## 8. Proveniência de assets

- Fontes: Google Fonts (SIL Open Font License), baixadas para `public/fonts/`; o export HTML as embute em base64.
- Ícones: SVG autorais em `src/components/Icon.tsx`, traço 1.7, 24px; WhatsApp como marca preenchida.
- Texturas: ruído SVG inline em `body::before`.
- Nenhuma fotografia, depoimento ou cliente real. Cardápios e números do seed são ilustrativos e marcados na interface.
- Sem geração de imagem no processo; a direção é code-first.

## 9. Mapa de implementação

| Superfície | Arquivo | CSS |
|---|---|---|
| Landing | `src/pages/Landing.tsx` | `src/styles/site.css` |
| Parceiros | `src/pages/Partners.tsx` | `site.css` |
| Painel | `src/pages/Panel.tsx`, `components/LeadDrawer.tsx`, `NewLeadDrawer.tsx` | `panel.css` |
| Editor | `src/pages/MenuBuilder.tsx` | `panel.css` |
| Cardápio | `src/pages/MenuPage.tsx`, `components/MenuSheet.tsx` | `menu.css` + `site.css` (suplemento) |
| Base | — | `base.css` |

## 10. Não fazer

- Não trocar a display por fonte de sistema ou por serifa editorial.
- Não adicionar gradientes, glass, sombras duras coloridas ou cantos arredondados.
- Não transformar o painel em cards de ícone + título + texto.
- Não usar emoji como ícone.
- Não inventar depoimento, cliente, métrica ou “+ de X restaurantes”.
- Não remover o aviso de dados ilustrativos do seed sem substituir os dados.
- Não tratar “Recomendado” como prova social; é uma recomendação do produto.

## 11. App do desenvolvedor (v2)

**Modo:** Operate. A ambição aparece como precisão, densidade e consistência, não como espetáculo. O encarte continua no fundo, mas a interface de trabalho é mais silenciosa que a landing.

**Layout**
- Sidebar de 264px, escura (`#17130f`), fixa no desktop; vira off-canvas com overlay em ≤1024px.
- Topbar de 58px com menu mobile, marca compacta, “Bem-vindo”, badge de plano, tema, notificações e avatar.
- Conteúdo com largura máxima de 1440px e padding de 26–30px; 15px no mobile.
- Cabeçalho de página em display (clamp 40–64px) com régua dupla; títulos de seção em Archivo 800 (18px) para separar do tom de jornal.

**Tokens de app**
- `--app-side` `#17130f`, `--app-side-ink` `#f3ead6`, `--app-side-muted` `rgba(243,234,214,.7)`.
- `--app-surface` (`--paper-3`), `--app-line` (`--line`), `--app-bg` (`--paper`).
- Tema escuro: sobrescreve `--paper`, `--ink`, `--line`, `--focus` e os tokens de app no escopo `.app-shell[data-theme='dark']`; a sidebar fica ainda mais escura.
- Acentos no escuro usam `color-mix` com o papel para manter contraste (links, carimbos, métricas, resultado de preço).

**Componentes-assinatura**
- **Faixa de métricas**: 5 colunas com régua de 1px, régua superior de 3px e números em display 34–46px; sem cards soltos.
- **Meta de hoje**: card com régua superior vermelha, número 64–80px, barra de 10px e estatísticas em display 28px. O carimbo “Em andamento/Batida” fecha o bloco.
- **Funil**: barras de 12px com contorno de tinta e contagem em display, como gráfico impresso; o rodapé resume abordagens, follow-ups e setups.
- **Banner de trial/plano**: ícone, texto, contagem regressiva (dias/horas/min/seg), CTA e barra de progresso. Vira banner de plano ativo ou expirado.
- **Atividade recente**: feed de histórico real do CRM (mensagem, status, cardápio, nota), com ícone, título, detalhe e data.
- **Capa de projeto (`pcover`)**: folha tipográfica com tema `encarte`/`noite`/`leve`, cor da casa, 3 itens e preços. Sem foto. Badge “No ar”, “Prévia” ou “Template”.
- **CRM kanban**: 4 colunas (Novo, Contatado, Negociando, Fechado), cabeçalho em display 20px com contagem, régua superior de 3px na cor do status; cards compactos com nota, contato, follow-up e cardápio; arrastar para mudar status; select como alternativa acessível.
- **Templates**: 6 cards com capa, ramo, plano mínimo, “Usar template” e “Prévia”.
- **Planos**: 3 cards, plano atual destacado, flag “Recomendado”, checkout inline simulado.
- **Ferramentas**: layout de duas colunas (form + resultado/preview) para precificação e contratos; cards de recurso para a área de membros; bio card com avatar, links e WhatsApp.

**Cores de estado**
- Contatado: azul; Negociando: amarelo; Fechado: vermelho; Descartado: hachura.
- Trial: amarelo; ativo: vermelho; expirado: vermelho com borda.
- Plano atual: borda de 2px e fundo `--app-surface-2`; “Recomendado” em amarelo.

**Movimento**
- Sidebar off-canvas com slide de 240ms; overlay de 200ms.
- Drawers com slide de 260ms; tema com troca instantânea; contagem regressiva atualiza a cada segundo (respeita leitura, não é essencial).
- Nenhuma animação de entrada em cascata nas telas de trabalho; conteúdo visível por padrão.

**Acessibilidade**
- `<main id="conteudo">` no app, no editor, no cardápio e na bio; skip link funcional.
- Avatar com nome acessível (“CA — minha conta”), ícones com `aria-label`, selects de status rotulados.
- Kanban: arrastar é conveniência; o select de status é o caminho por teclado.
- Contraste validado no claro e no escuro; foco azul no claro e amarelo no escuro.
- Alvos de toque ≥40px nas ações do CRM mobile.

**Voz no app**
- “Plano”, “créditos”, “assinatura”, “projeto”, “cardápio”, “lead”, “follow-up”.
- Ações nomeiam o resultado: “Copiar link”, “Exportar HTML”, “Confirmar assinatura”, “Criar lead e abrir cardápio”.
- Nada de “growth”, “escala 10x” ou “revolucionário”. Demonstração é demonstração; pagamento simulado é dito na tela.

**Mapa do app**
| Superfície | Arquivo |
|---|---|
| Shell/sidebar/topbar | `src/app/AppLayout.tsx` |
| UI compartilhada | `src/app/ui.tsx` |
| Dashboard | `src/app/pages/Dashboard.tsx` |
| Projetos | `src/app/pages/Projects.tsx` |
| CRM | `src/app/pages/Crm.tsx` |
| Templates | `src/app/pages/Templates.tsx` |
| Planos | `src/app/pages/Plans.tsx` |
| Vendas | `src/app/pages/Sales.tsx` |
| Precificação/Contratos | `src/app/pages/Pricing.tsx`, `Contracts.tsx` |
| Membros/Primeiro cliente | `src/app/pages/Members.tsx`, `FirstClient.tsx` |
| Bio/Bulk/Afiliados/Feedback/Conta | `src/app/pages/Bio.tsx`, `Bulk.tsx`, `Affiliates.tsx`, `Feedback.tsx`, `Account.tsx` |
| Wizard | `src/app/pages/NewProject.tsx` |
| Editor de site | `src/pages/SiteBuilder.tsx` |
| Site público / view | `src/pages/PublicSite.tsx`, `src/components/SiteView.tsx` |
| CSS | `src/styles/app.css`, `wizard.css`, `site-view.css` |

## 12. Wizard e sites (v2.1)

**Wizard.** O “Novo projeto” virou um fluxo de três etapas: tipo → nicho → clientes. A composição é a de um balcão de escolhas, não um formulário longo:

- Etapa 1: três cartões (Cardápio, Cardápio + Site, Site); o pacote completo é o cartão escuro em destaque.
- Etapa 2: grade de nichos com ícone, busca e chips de grupo; “Recomendado” marca os ramos de food. O número de grupos muda conforme o tipo (cardápio = só food).
- Etapa 3: mapa + seletor de cidade/quantidade à esquerda, resultados selecionáveis à direita, com badges “Sem site”/“Sem cardápio”, nota, avaliações e telefone. Ações: adicionar ao CRM ou criar cardápios/sites em lote.
- O seletor de cidade cobre 89 cidades em 27 estados, com busca por nome/UF e filtro por região; o painel é uma lista densa com UF e região à direita. Abre para cima quando falta espaço, navega com ↑↓/Home/End, Enter escolhe e Escape devolve o foco ao gatilho.
- O mapa é uma peça cartográfica própria: malha de ruas com avenidas e uma diagonal, quadras, parques, rio, rótulos de bairro e de via, raio de busca, escala, coordenadas e bússola. Tem zoom (1×–2×), arrastar e pinos numerados que selecionam o negócio na lista; o pino com site é azul, o sem site é vermelho, e o selecionado fica escuro com anel amarelo. A legenda “mapa ilustrativo” e o botão para a busca real mantêm a honestidade.
- O mapa usa as variáveis do app e funciona no tema claro e no escuro; nada de tiles externos.
- Estados: sem busca, resultados vazios, seleção, limite de plano, criação concluída.

**Sites.** Uma superfície nova dentro do mundo, mas deliberadamente mais “site de negócio” do que jornal:

- Temas `claro`, `escuro`, `areia`; acento por negócio; `--sv-*` isolado do app.
- Tipografia Archivo 800 para manchetes (não a display do encarte) e Courier Prime para labels. O site é uma página de negócio, não um encarte.
- Hero com monograma em bloco de cor, sem fotos; destaques; seção Sobre; serviços em grade editorial; CTA de cardápio quando o pacote inclui os dois; contato e WhatsApp.
- Nav sticky, tema escuro com acento clareado via `color-mix`; footer “Feito com Prato Digital”.
- O editor usa o mesmo layout de dois painéis do editor de cardápio (form + preview sticky), com preview não interativo (`pointer-events: none`).
- Export HTML autônomo com as mesmas fontes embutidas; link `?d=` com os dados do site.

**Cores/estado.** O wizard usa o vermelho de ação, azul de “ok” e vermelho escuro de “sem site”; o site usa a cor do negócio como campo, não como detalhe.

**Não fazer.** Não simular o Google Maps como se fosse real; não usar fotos genéricas de banco; não transformar o site em uma segunda landing do Prato Digital; não prometer busca automática sem backend.

## 13. Landing e parceiros (v2.3)

- O exemplo ativo da landing vira **bloco de tinta**: nome em papel, descrição em papel translúcido e categoria em amarelo. Não é mais um realce de 5% no papel.
- **Sliders** da landing, dos parceiros e da precificação têm trilha preenchida na cor de ação (vermelho ou azul), polegar de 18px e foco visível. O preenchimento acompanha o valor.
- **FAQ**: a pergunta fica em vermelho escuro no hover e quando aberta; o sinal troca de `+` para `−`.
- **Planos de parceiros**: o preço cabe em uma linha (40–54px) para não quebrar “R$ 49” em duas linhas.
- O WhatsApp do rodapé não quebra o número.

## 14. Conta (v2.4)

**Modo:** Operate. Criar conta é uma tarefa, não uma landing.

- `/criar-conta` e `/entrar` usam um shell de duas colunas: à esquerda o argumento (manchete display, deck e bullets com check vermelho); à direita o painel de papel com o formulário.
- O painel usa os mesmos campos, réguas e botões do app; o título é display (34–44px), os rótulos são mono e o erro é uma faixa vermelha com `role="alert"`.
- Cadastro em dois passos (Conta → Operação) com indicador 1/2; o segundo passo captura negócio, cidade e WhatsApp.
- A senha tem botão “Mostrar/Ocultar” (alvo ≥24px) e o envio mostra estado “Criando conta…”.
- `/demo` abre a conta de demonstração e marca “Demonstração” no topo do app.
- No mobile (≤860px), o shell empilha, o painel centraliza em 560px e os bullets/nota somem para não empurrar o formulário.

## 15. Dashboard (v2.5) — menos caixas, mais manchete

O dashboard deixou de ser uma pilha de cartões. A composição agora tem hierarquia de jornal:

- **Faixa de trial** em tinta fixa (`--app-side`), com régua inferior amarela; no escuro, sobe para `--app-surface-2` com borda interna para não sumir no fundo.
- **Placar de métricas** sem caixa: régua superior de 3px, colunas separadas por fios e números em display.
- **Meta de hoje** como bloco de tinta full-width: manchete display, número 72–118px, barra de 12px e estatísticas em 30px. É o pico da página.
- **Atividade e funil** em seções soltas no papel, com régua superior de 3px em vez de cartão; o checklist fica sob o funil.
- **Projetos recentes** em seção full-width com 3 capas no desktop, 2 no intermediário e 1 no mobile.
- A proporção mudou: mais tinta (faixa + manchete), menos bege; o vermelho continua sendo ação e o amarelo, resultado.

## 16. Containers no restante do app (v2.6)

A mesma lógica do dashboard foi aplicada sem refazer as telas:

- **Projetos:** a capa é o artefato; nome, meta e ações ficam no papel, separados por régua. O cartão em volta sumiu.
- **CRM:** o resumo virou placar (régua superior + fios) e as colunas do kanban perderam a caixa, mantendo a régua superior na cor do status. Os cards continuam com borda.
- **Planos:** o plano atual virou faixa no papel; o card Pro (recomendado) usa tinta, como a manchete do dashboard.
- **Wizard:** formulário e resultados viraram seções no papel, com régua superior; o mapa continua sendo o artefato com borda.
- **Deploy de teste:** `_redirects`/`_headers` no build, noindex, `DEPLOY.md`, `TESTE.md` e `dist-teste.zip`.
