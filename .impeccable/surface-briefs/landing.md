# Landing — surface brief

**Mode:** Persuade
**Primary target:** `/` (landing do restaurante)
**Related:** `/parceiros`, `/painel`, `/painel/cardapio/:leadId`, `/c/:slug`

## Audience and job

Dono de restaurante de bairro em Curitiba, 15–100 avaliações no Google, sem site ou com Instagram desatualizado. Chega pelo WhatsApp ou por indicação, no celular, com pressa. Precisa entender em segundos que o cardápio fica pronto em 48h, sem app e sem comissão, e que pode ver uma prévia antes de decidir.

**Ação:** abrir o WhatsApp com a mensagem “Quero meu cardápio” ou clicar em um exemplo e abrir o cardápio.

**Prova disponível:** cardápios de demonstração autorais (`fx-burgers`, `made-pizza`, `acai-saboroso`), oferta de R$ 597 + R$ 97/mês, prazo de 48h e o fato de o operador montar o cardápio antes do primeiro contato. Não há depoimento, cliente ou métrica real — nada disso é exibido.

## Constraints

- Mobile-first; 390px é o caso principal.
- Sem fotografia de produto; a tipografia e o artefato impresso carregam a página.
- Sem backend: links precisam funcionar como demonstração estática.
- Dados ilustrativos precisam ser marcados.
- Tom brasileiro, direto, sem hype.
- Acessibilidade AA, foco visível, `prefers-reduced-motion`.

## Chosen direction

Encarte de ofertas de bairro, duas tintas, papel jornal. O cardápio demo é o suplemento impresso; a oferta é a manchete; o CTA é um cupom. O painel herda o mundo como mesa de redação, sem virar dashboard genérico.

## Direction contract

**THESIS:** A landing é a edição de hoje de um encarte de bairro: a oferta é manchete, o cardápio é suplemento e o WhatsApp é o cupom recortável. Recusa o hero split com mockup de celular e a sequência headline → três cards → preços.

**OWN-WORLD:** Papel jornal com ruído, tinta quase preta, vermelho de urgência e azul de classificado. Passion One condensada para manchetes e preços; Archivo para leitura; Courier Prime para metadados, preços de cardápio e placar. Réguas de 1px, carimbos rotacionados, bordas tracejadas de cupom, sem gradientes ou cantos arredondados.

**STORY:** O visitante reconhece o problema (cardápio perdido no story/PDF, comissão do app), vê um cardápio real navegável, calcula quanto deixa no app e entende que o preço é fechado. Sai sabendo o próximo passo: mandar uma foto no WhatsApp.

**FIRST VIEWPORT:** Masthead de jornal com edição, marca gigante, carimbo “Pronto em 48h” e CTA. Abaixo, manchete em três linhas (“Seu cardápio na mão do cliente”), deck, dois CTAs e três taxas (48h, R$ 97/mês, 0%). À direita, o suplemento com o cardápio do Fx Burgers, inclinado, com fita adesiva e legenda de dados ilustrativos.

**FORM:** Direção 3 de 7 na lista de ressonância (encarte de ofertas de bairro), após fachada de boteco e comanda de balcão; `seed:5a6905e5310a9c11`.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Nome e contatos definitivos.
- Preço do plano de parceiro.
- Fotos reais dos pratos (hoje o cardápio é tipográfico).
- Se o cardápio demo deve levar marca d’água mais forte.
