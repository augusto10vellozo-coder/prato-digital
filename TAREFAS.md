# Tarefas — Prato Digital

## 0. Antes de mostrar a qualquer desenvolvedor

- [ ] Trocar WhatsApp, e-mail, Instagram, horário e nome do operador em `src/config.ts`.
- [ ] Revisar preços e limites em `src/lib/plans.ts` (R$ 49 / 97 / 197 são propostas).
- [ ] Decidir o nome definitivo (hoje “Prato Digital” é marca de trabalho).
- [ ] Revisar os 6 templates de cardápio e os 6 de site, além do seed (telefones fictícios).
- [ ] Decidir o preço de um site one-page (hoje a oferta de R$ 597 + R$ 97/mês é do cardápio).
- [x] Revisar a busca ilustrativa do wizard e deixar claro que não é Google Places.
- [ ] Publicar em Vercel/Netlify e testar recarregamento direto em `/app`, `/app/crm` e `/c/:slug`.
- [ ] Não publicar o `/app` em link aberto sem auth (o `robots.txt` não protege).
- [ ] Trocar a auth simulada (localStorage) por auth de servidor: e-mail verificado, reset de senha e sessão segura.
- [ ] Ligar cobrança real (Stripe/Asaas) e aplicar o gate de assinatura no servidor.
- [ ] Remover o aviso “site de demonstração” do rodapé quando os dados forem reais.

## 1. Validar a oferta SaaS (curto prazo)

- [ ] Rodar o teste PRO de 7 dias com 5–10 desenvolvedores/agências.
- [ ] Medir: primeiro cardápio em <10 min? primeiro envio no mesmo dia? upgrade?
- [ ] Medir quantos usam Templates, CRM e Contratos de verdade.
- [ ] Entrevistar quem cancelou/não converteu.
- [ ] Ajustar preço/limite: Starter deve ser isca, Pro deve ser o plano natural.
- [ ] Definir se a assinatura inclui suporte humano e por qual canal.
- [ ] Escrever contrato/termos da assinatura e política de cancelamento.

## 2. Backend, auth e cobrança (médio prazo)

- [ ] Auth (Supabase/Clerk) e multi-tenant por desenvolvedor.
- [ ] Migrar leads, cardápios, assinatura e feedback para banco.
- [ ] Publicação server-side dos cardápios em URL estável (subdomínio/domínio).
- [ ] Gateway de pagamento (Stripe/Asaas/Mercado Pago), trial real e webhooks.
- [ ] Emissão de nota fiscal / modelo de repasse.
- [ ] Limites de plano aplicados no servidor.
- [ ] Equipe/assentos (Starter 1, Pro 2, Agência 5).
- [ ] Convite de usuários e permissões.
- [ ] Backup/restauração server-side; export JSON continua.

## 3. Produto

- [ ] Upload de fotos dos pratos com otimização (AVIF/WebP, recorte, lazy loading).
- [ ] Fotos por item e capa do restaurante.
- [ ] Publicação do link na bio com dados no servidor.
- [ ] Analytics do cardápio: visitas, categorias, cliques no WhatsApp.
- [ ] Rastrear abertura de cardápio/link (hoje o dashboard usa o histórico do CRM).
- [ ] Domínio próprio por cliente + QR code para mesa/balcão.
- [ ] Editor de cardápio com desfazer/refazer e duplicar item.
- [ ] Cardápio impresso/PDF.
- [ ] Integração com impressora e sistema de caixa.
- [ ] White-label por parceiro no plano Agência: marca, contato e rodapé.
- [ ] E-mail transacional: trial acabando, follow-up atrasado, pagamento.
- [ ] Site com múltiplas páginas/seções (FAQ, galeria, depoimentos reais, equipe).
- [ ] Fotos do negócio e dos serviços no site.
- [ ] Link de cardápio embutido no payload do site compartilhado.
- [ ] Preço/oferta de site separada do cardápio no wizard e no CRM.
- [ ] App mobile? Só se a validação pedir.

## 4. Aquisição de clientes para o assinante

- [ ] Integração Google Places (busca por cidade/ramo, nota, avaliações, site) com backend e chave.
- [ ] Mapa com tiles reais (Google/OSM) no wizard; hoje a malha urbana é ilustrativa.
- [ ] Importação CSV além da colagem.
- [ ] Deduplicação de leads e lista permanente de descartados.
- [ ] Sugestão de mensagem por nicho e por objeção.
- [ ] Templates por bairro/cidade.
- [ ] Link de indicação/afiliados com atribuição real.

## 5. CRM e operação

- [ ] Follow-up automático por e-mail/WhatsApp (API oficial).
- [ ] Templates aprovados no WhatsApp Cloud API.
- [ ] Campos personalizados por lead.
- [ ] Tarefas/lembretes e calendário.
- [ ] Relatório de conversão por origem, bairro e template.
- [ ] Exportar carteira em CSV para o assinante.
- [ ] Importar backup antigo com validação de esquema.

## 6. Qualidade e compliance

- [ ] Testes E2E (Playwright) do fluxo: assinar → template → cardápio → envio → CRM → contrato → export.
- [ ] Testes de unidade para `share.ts`, `menuExport.ts` e cálculo de preço.
- [ ] Lighthouse CI no build de produção.
- [ ] Testar cardápio em Android/iOS reais, luz forte, tela pequena.
- [ ] Testar link `?m=` em WhatsApp Web/mobile e Instagram (limite de URL).
- [ ] LGPD: consentimento, retenção, exclusão, opt-out de prospecção.
- [ ] Revisar contrato modelo com advogado.
- [ ] Política de privacidade e termos de uso do SaaS.
- [ ] Acessibilidade contínua (AA, teclado, leitor de tela).

## 7. Dívidas conhecidas

- [ ] Link de cardápio longo (2–8 KB) em `?m=`; em produção, URL curta no servidor.
- [ ] Sem backend, o link não atualiza sozinho após edição.
- [ ] Mudar para um plano menor com mais cardápios que o limite não apaga/bloqueia os existentes; só impede novos.
- [ ] Checkout, trial e faturas são simulados.
- [ ] `localStorage` por navegador; trocar de máquina exige export/import.
- [ ] A bio é uma prévia local, não uma página publicada.
- [ ] O dashboard não rastreia abertura real de cardápio.
- [ ] Sem login: qualquer pessoa com o link acessa o app neste navegador.
- [ ] O HTML exportado assina Prato Digital (white-label no roadmap).
- [ ] O seed é ilustrativo e não distingue lead real de fictício depois de editado.
- [ ] Sem upload de fotos.
- [ ] A busca automática do wizard é demonstrativa; o mapa é uma ilustração interativa; o Google Maps real abre em outra aba.
- [ ] O site compartilhado não carrega o cardápio junto; os links vão separados na mensagem/HTML.
- [ ] Não há preço de site separado da oferta de cardápio.
- [ ] O wizard cria cardápios/sites com dados genéricos do template; fotos e textos do cliente precisam ser editados.

## 8. Concluído na v2

- [x] App shell com sidebar, topbar, perfil, plano, notificações de follow-up e tema claro/escuro.
- [x] Dashboard com trial/plano, metas de envio, atividade, métricas, funil, projetos recentes e checklist.
- [x] Projetos com capas tipográficas, filtros, busca, copiar link, exportar e editar.
- [x] CRM em quadro (drag and drop), Hoje, Lista, filtros e drawer do lead.
- [x] Templates que criam lead + cardápio de verdade.
- [x] Prospecção em massa por colagem.
- [x] Assinatura simulada com 3 planos, trial, upgrade e gates Pro/Agência.
- [x] Vendas/MRR, precificação, contratos, área de membros, primeiro cliente, bio, afiliados, feedback e conta.
- [x] Novo fluxo de projeto com builder path correto.
- [x] Links `/painel` redirecionando para o app.
- [x] Lighthouse 100/100/100 em landing, parceiros, dashboard, CRM, planos, templates e bio.

## 9. Concluído na v2.1 (cardápios + sites)

- [x] Wizard de novo projeto: tipo (cardápio, site, ambos) → nicho → clientes.
- [x] Nichos de food e de negócios locais (academia, saúde, beleza, serviços, pet).
- [x] Busca ilustrativa por nicho/cidade (10/20), seleção e criação em lote.
- [x] Busca manual com link real do Google Maps e colagem de lista.
- [x] Criação em lote de leads + cardápios + sites, respeitando o limite do plano.
- [x] Criador de sites one-page: 6 templates, temas claro/escuro/areia, destaques, serviços e preview.
- [x] Site público `/s/:slug` com link `?d=` e export HTML com fontes embutidas.
- [x] Sites no dashboard, projetos, CRM, drawer do lead e contagem de plano.
- [x] Mensagens de WhatsApp específicas para cardápio, site e pacote completo.
- [x] Templates page com seção de sites.
- [x] Lighthouse 100 nas novas superfícies e detector visual limpo.

## 9.1 Concluído na v2.2 (cobertura nacional e mapa)

- [x] Base de 89 cidades em 27 estados, com DDD, coordenadas e bairros por cidade.
- [x] Seletor de cidade com busca por nome/UF e filtro por região.
- [x] Resultados ilustrativos usam os bairros e o DDD da cidade escolhida.
- [x] Link "Google Maps" com cidade + UF corretos.
- [x] Mapa redesenhado: malha de ruas, quadras, parques, rio, rótulos, escala, coordenadas e bússola.
- [x] Zoom, arrastar (pan) e pinos numerados ligados à seleção da lista.
- [x] Mapa adaptado ao tema claro/escuro.
- [x] Lighthouse 100/100/100 no wizard com o novo mapa.

## 9.2 Concluído na v2.3 (front mais ousado)

- [x] Cabeçalho de página em display 40–64px, régua dupla e títulos de seção/cartão maiores.
- [x] Faixa de métricas como placar: régua superior de 3px e números em 34–46px.
- [x] Meta de hoje com régua vermelha, número 64–80px, barra de 10px e estatísticas em 28px.
- [x] Funil com barras de 12px e contagem em display, como gráfico impresso.
- [x] Kanban com cabeçalho em display e régua superior na cor do status.
- [x] Capas compactas passam a mostrar itens do cardápio e serviços do site.
- [x] Preço dos planos em display 50px.
- [x] Copy de limite/uso trocada de “cardápios” para “projetos” na conta e nos templates.
- [x] Lighthouse 100/100/100 no dashboard, CRM, projetos e templates; detector limpo.

## 9.3 Concluído no polish (v2.3)

- [x] Seletor de cidade com navegação por teclado (↑↓/Home/End/Enter/Escape), `aria-activedescendant`, retorno de foco ao gatilho e abertura para cima quando falta espaço.
- [x] Placeholder de formulário com contraste AA (token `--ink-soft` em vez de cinza fixo).
- [x] Chevron do `select` legível no tema escuro.
- [x] Foco visível nos pinos do mapa usando o token de foco (azul no claro, amarelo no escuro).
- [x] Números de meta, funil e preço com algarismos tabulares.
- [x] Textos de importação e conta trocados de “restaurantes/cardápios” para “negócios/projetos”.
- [x] Lighthouse 100/100/100 no wizard e sem erros de console.

## 9.4 Concluído nas landing/parceiros (v2.3)

- [x] Exemplo ativo da landing em bloco de tinta (nome em papel, categoria em amarelo).
- [x] Sliders dos calculadores com trilha preenchida, polegar maior e foco visível (landing, parceiros e precificação).
- [x] FAQ com hover e estado aberto em vermelho.
- [x] Preço dos 3 planos de parceiros em uma linha (não quebra mais o “R$”).
- [x] WhatsApp do rodapé sem quebra no número.
- [x] Lighthouse 100/100/100 em landing e parceiros; detector limpo.

## 9.5 Concluído na v2.4 (conta e trial)

- [x] Contas com e-mail + senha (hash SHA-256 local), sessão e dados separados por conta.
- [x] Criar conta em 2 passos + onboarding (negócio, cidade, WhatsApp).
- [x] Login com retorno à rota pedida, logout e perfil editável.
- [x] Guarda de rota em `/app` e editores; CTAs públicos levam a `/criar-conta` e `/entrar`.
- [x] Trial Pro de 7 dias sem cartão; conta nova começa vazia.
- [x] Demo separada em `/demo`, com a carteira ilustrativa e selo “Demonstração”.
- [x] Migração da carteira antiga para a demo.
- [x] Lighthouse 100/100/100 em `/criar-conta`, `/entrar`, `/app` e `/demo`; detector limpo.

## 9.6 Concluído no dashboard (v2.5)

- [x] Dashboard sem pilha de cartões: faixa de trial, placar e seções soltas no papel.
- [x] “Meta de hoje” como bloco de tinta full-width com manchete, número grande, barra e estatísticas.
- [x] Placar de métricas sem caixa (régua superior + fios).
- [x] Projetos recentes em 3 colunas no desktop (sem esconder o terceiro).
- [x] Blocos de tinta adaptados ao tema escuro.
- [x] Lighthouse 100/100/100 no dashboard nos dois temas; detector limpo.

## 9.7 Concluído na v2.6 (containers + teste externo)

- [x] Projetos: capa como artefato + legenda no papel, sem cartão em volta.
- [x] CRM: resumo como placar e colunas com régua superior, sem caixa.
- [x] Planos: plano atual como faixa no papel; card Pro em tinta.
- [x] Wizard: formulário e resultados como seções no papel; mapa continua artefato.
- [x] Feedback com envio por WhatsApp (além do registro local).
- [x] `public/_redirects` e `public/_headers` para deploy estático + noindex de teste.
- [x] `DEPLOY.md`, `TESTE.md` e `dist-teste.zip` prontos para Netlify Drop/Vercel.
- [x] Lighthouse 100/100/100 em projetos, CRM, planos e wizard; detector limpo.

## 10. Concluído na v1 (base reaproveitada)

- [x] Landing do restaurante e calculadora de comissão.
- [x] Gerador de cardápio, cardápio público, link `?m=` e export HTML com fontes embutidas.
- [x] CRM local com histórico, notas, status e follow-up.
- [x] Backup JSON.
