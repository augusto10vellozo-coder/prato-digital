import { isoDaysFromNow, uid } from './format'
import { SITE } from '../config'
import type {
  AppData,
  HistoryEntry,
  HistoryKind,
  ItemTag,
  Lead,
  LeadDeal,
  LeadStatus,
  Menu,
  MenuCategory,
  MenuItem,
  Priority,
  Site,
} from './types'

function item(name: string, description: string, price: number, tags: ItemTag[] = []): MenuItem {
  return { id: uid('item'), name, description, price, tags }
}

function cat(name: string, items: MenuItem[], note?: string): MenuCategory {
  return { id: uid('cat'), name, note, items }
}

function hist(kind: HistoryKind, daysAgo: number, text: string): HistoryEntry {
  return { id: uid('h'), kind, at: isoDaysFromNow(-daysAgo), text }
}

const FX: Menu = {
  id: 'menu_fx',
  slug: 'fx-burgers',
  name: 'Fx Burgers Grill',
  tagline: 'Smash burgers na chapa, sem frescura.',
  category: 'Hamburgueria',
  neighborhood: 'Hauer',
  address: 'R. Prof. Brandão, 1.240 — Hauer, Curitiba',
  hours: 'Ter a dom, 18h às 23h30',
  phone: '41900000002',
  instagram: '@fxburgers',
  note: 'Peça pelo WhatsApp. Retirada no balcão e entrega em até 5 km.',
  accent: '#c8372d',
  theme: 'encarte',
  isDemo: true,
  updatedAt: isoDaysFromNow(-1),
  categories: [
    cat('Para dividir', [
      item('Fritas rústicas', 'Batata com casca, cheddar cremoso e bacon crocante.', 18.9, ['mais-pedido']),
      item('Onion rings', 'Anéis de cebola empanados, molho barbecue da casa.', 21.9),
      item('Pão de alho', 'Pão brioche tostado com manteiga de alho e parmesão.', 12.9),
    ]),
    cat('Burgers', [
      item('X-Fx Duplo', 'Dois smashs de 100 g, cheddar, picles e molho da casa no brioche.', 32.9, ['mais-pedido']),
      item('Smash da Casa', 'Smash de 150 g, queijo prato, cebola caramelizada e maionese verde.', 26.9),
      item('Fx Cheddar', 'Blend 160 g, cheddar inglês, bacon e cebola crispy.', 29.9),
      item('Fx Picante', 'Blend 160 g, queijo pepper jack, jalapeño e molho de pimenta.', 31.9, ['picante']),
      item('Veggie Fx', 'Hambúrguer de grão-de-bico, queijo minas, rúcula e tomate.', 27.9, ['vegetariano']),
    ]),
    cat('Combos', [
      item('Combo Fx Duplo', 'X-Fx Duplo + fritas rústicas + refrigerante lata.', 42.9, ['mais-pedido']),
      item('Combo Smash', 'Smash da Casa + fritas + refrigerante lata.', 36.9),
    ]),
    cat('Bebidas', [
      item('Refrigerante lata', 'Coca-Cola, Guaraná ou Sprite. 350 ml.', 6.0),
      item('Suco de laranja', '300 ml, feito na hora.', 9.9),
      item('Milkshake', 'Ovomaltine, chocolate ou morango. 400 ml.', 16.9),
    ]),
    cat('Sobremesa', [
      item('Brownie com sorvete', 'Brownie quente, sorvete de creme e calda de chocolate.', 14.9),
    ]),
  ],
}

const MADE: Menu = {
  id: 'menu_made',
  slug: 'made-pizza',
  name: 'Madê Pizza e Vinho',
  tagline: 'Massa de fermentação natural e vinho em taça.',
  category: 'Pizzaria',
  neighborhood: 'Água Verde',
  address: 'Av. República Argentina, 820 — Água Verde, Curitiba',
  hours: 'Qua a dom, 18h às 23h',
  phone: '41900000003',
  instagram: '@madepizzaeinho',
  note: 'Massa de fermentação natural de 48h. Disponível também sem glúten.',
  accent: '#7a2e3b',
  theme: 'noite',
  isDemo: true,
  updatedAt: isoDaysFromNow(-3),
  categories: [
    cat('Para começar', [
      item('Burrata com tomate confit', 'Burrata fresca, tomates confitados, manjericão e azeite.', 38.0),
      item('Focaccia da casa', 'Focaccia de alecrim, flor de sal e azeite extravirgem.', 22.0),
      item('Tábua de frios', 'Seleção de queijos, presunto cru e geleia de figo.', 54.0),
    ]),
    cat('Pizzas', [
      item('Margherita', 'Molho de tomate San Marzano, mozzarella, manjericão e parmesão.', 52.0, ['mais-pedido']),
      item('Calabresa', 'Calabresa artesanal, cebola roxa, mozzarella e orégano.', 56.0),
      item('Portuguesa', 'Presunto, ovos, cebola, azeitona, ervilha e mozzarella.', 59.0),
      item('Quatro Queijos', 'Mozzarella, gorgonzola, parmesão e catupiry.', 62.0),
      item('Pepperoni', 'Pepperoni levemente picante, mozzarella e mel.', 64.0, ['picante']),
      item('Vegetariana', 'Abobrinha, berinjela, tomate seco, rúcula e mozzarella.', 58.0, ['vegetariano']),
    ]),
    cat('Massas', [
      item('Fettuccine ao funghi', 'Massa fresca, funghi secchi, creme de leite e parmesão.', 46.0),
      item('Nhoque ao ragu', 'Nhoque de batata, ragu de costela e parmesão.', 44.0),
    ]),
    cat('Vinhos em taça', [
      item('Tinto da casa', 'Blend argentino, taça de 150 ml.', 22.0),
      item('Branco da casa', 'Sauvignon blanc chileno, taça de 150 ml.', 22.0),
      item('Prosecco', 'Taça de 150 ml.', 28.0),
    ]),
    cat('Sobremesas', [
      item('Tiramisù', 'Receita da casa com café espresso e mascarpone.', 24.0),
      item('Petit gateau', 'Bolo quente de chocolate com sorvete de baunilha.', 26.0),
    ]),
  ],
}

const ACAI: Menu = {
  id: 'menu_acai',
  slug: 'acai-saboroso',
  name: 'Açaí Saboroso',
  tagline: 'Açaí cremoso do jeito que você monta.',
  category: 'Açaí',
  neighborhood: 'Portão',
  address: 'R. João Bettega, 2.150 — Portão, Curitiba',
  hours: 'Todos os dias, 11h às 22h',
  phone: '41900000006',
  instagram: '@acaisaborosocuritiba',
  note: 'Monte o seu ou escolha uma das combinações da casa. Delivery em até 4 km.',
  accent: '#5b3a8c',
  theme: 'leve',
  isDemo: false,
  updatedAt: isoDaysFromNow(-2),
  categories: [
    cat('Açaí', [
      item('Açaí 300 ml', 'Açaí cremoso com até 3 complementos à sua escolha.', 16.9),
      item('Açaí 500 ml', 'Açaí cremoso com até 4 complementos à sua escolha.', 22.9),
      item('Açaí 700 ml', 'Açaí cremoso com até 5 complementos à sua escolha.', 28.9, ['mais-pedido']),
      item('Açaí zero 500 ml', 'Sem açúcar, com até 4 complementos.', 24.9),
    ]),
    cat('Combinações da casa', [
      item('Morango com leite ninho', 'Açaí 400 ml, morango fresco e leite ninho.', 24.9, ['mais-pedido']),
      item('Paçoca com banana', 'Açaí 400 ml, paçoca, banana e mel.', 22.9),
      item('Frutas vermelhas', 'Açaí 400 ml, morango, amora e granola.', 26.9),
    ]),
    cat('Complementos', [
      item('Granola artesanal', 'Porção extra.', 2.5),
      item('Leite ninho', 'Porção extra.', 2.5),
      item('Paçoca', 'Porção extra.', 2.5),
      item('Morango', 'Porção extra.', 3.5),
      item('Chocolate em barra', 'Porção extra.', 3.0),
    ]),
    cat('Bebidas', [
      item('Água mineral', '500 ml, com ou sem gás.', 4.0),
      item('Suco natural', 'Laranja, abacaxi ou maracujá. 300 ml.', 9.9),
    ]),
  ],
}

const LENHADOR: Menu = {
  id: 'menu_lenhador',
  slug: 'o-lenhador',
  name: 'O Lenhador',
  tagline: 'Lanches, porções e chopp gelado.',
  category: 'Lanches',
  neighborhood: 'Vila Izabel',
  address: 'R. Reinaldo Issler, 310 — Vila Izabel, Curitiba',
  hours: 'Ter a dom, 18h às 0h',
  phone: '41900000001',
  instagram: '@olenhadorcuritiba',
  note: 'Pedidos pelo WhatsApp. Mesa na calçada e retirada no balcão.',
  accent: '#2f5d3a',
  theme: 'encarte',
  isDemo: true,
  updatedAt: isoDaysFromNow(-4),
  categories: [
    cat('Porções', [
      item('Batata rústica', 'Com alecrim e maionese da casa. Serve 2.', 24.9),
      item('Frango a passarinho', '500 g com alho e limão. Serve 2 a 3.', 39.9),
      item('Calabresa acebolada', 'Com pão e molho de alho. Serve 2.', 34.9),
    ]),
    cat('Lanches', [
      item('X-Lenhador', 'Blend 150 g, queijo, presunto, ovo e salada.', 28.9),
      item('X-Bacon', 'Blend 150 g, cheddar, bacon e cebola crispy.', 32.9),
      item('X-Tudo', 'Blend 180 g, dois queijos, bacon, ovo, presunto e salada.', 38.9, ['mais-pedido']),
      item('X-Salada', 'Blend 150 g, queijo, alface, tomate e maionese.', 24.9),
    ]),
    cat('Bebidas', [
      item('Chopp', '300 ml, claro ou escuro.', 8.9),
      item('Refrigerante', 'Lata 350 ml.', 6.0),
    ]),
    cat('Sobremesa', [
      item('Petit gateau', 'Com sorvete de creme.', 18.9),
    ]),
  ],
}

const SITE_FX: Site = {
  id: 'site_fx',
  slug: 'fx-burgers-site',
  name: 'Fx Burgers Grill',
  category: 'Hamburgueria',
  neighborhood: 'Hauer',
  address: 'R. Prof. Brandão, 1.240 — Hauer, Curitiba',
  phone: '41900000002',
  whatsapp: '41900000002',
  hours: 'Ter a dom, 18h às 23h30',
  tagline: 'Smash burgers na chapa, sem frescura.',
  about:
    'Carne na chapa, pão brioche e molho da casa. Peça pelo WhatsApp, retire no balcão ou receba em casa em até 5 km.',
  highlights: ['Smash na chapa', 'Delivery em até 5 km', 'Pedido no WhatsApp'],
  services: [
    { id: uid('svc'), title: 'Salão', description: 'Mesa no balcão e na calçada.', price: 'sem taxa' },
    { id: uid('svc'), title: 'Retirada', description: 'Peça e retire no balcão.', price: 'sem taxa' },
    { id: uid('svc'), title: 'Delivery', description: 'Entrega em até 5 km.', price: 'a combinar' },
  ],
  accent: '#c8372d',
  theme: 'escuro',
  menuId: 'menu_fx',
  isDemo: true,
  updatedAt: isoDaysFromNow(-1),
}

const SITE_STUDIO: Site = {
  id: 'site_studio',
  slug: 'studio-essential',
  name: 'Studio Essential',
  category: 'Academia e personal',
  neighborhood: 'Batel',
  address: 'R. Comendador Araújo, 500 — Batel, Curitiba',
  phone: '41900000013',
  whatsapp: '41900000013',
  hours: 'Seg a sex, 6h às 21h · Sáb, 8h às 12h',
  tagline: 'Treino que cabe na sua rotina.',
  about:
    'Treinos individualizados, acompanhamento de perto e uma comunidade que puxa você para cima. Comece com uma aula experimental.',
  highlights: ['Aula experimental', 'Treino individualizado', 'Horários flexíveis'],
  services: [
    { id: uid('svc'), title: 'Personal trainer', description: 'Treino individual com acompanhamento.', price: 'a partir de R$ 120/sessão' },
    { id: uid('svc'), title: 'Treino funcional', description: 'Turmas pequenas, foco em movimento.', price: 'R$ 220/mês' },
    { id: uid('svc'), title: 'Avaliação física', description: 'Medidas, composição corporal e metas.', price: 'R$ 90' },
  ],
  accent: '#2f5d3a',
  theme: 'areia',
  isDemo: true,
  updatedAt: isoDaysFromNow(-2),
}

function lead(data: {
  id: string
  name: string
  category: string
  neighborhood: string
  phone: string
  rating: number
  reviews: number
  hasSite: boolean
  hasMenu: boolean
  status: LeadStatus
  priority: Priority
  notes: string
  menuId?: string
  siteId?: string
  deal?: LeadDeal
  createdDaysAgo: number
  contactDaysAgo?: number
  followUpInDays?: number
  history: HistoryEntry[]
}): Lead {
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    neighborhood: data.neighborhood,
    phone: data.phone,
    rating: data.rating,
    reviews: data.reviews,
    hasSite: data.hasSite,
    hasMenu: data.hasMenu,
    isDemo: true,
    status: data.status,
    priority: data.priority,
    notes: data.notes,
    menuId: data.menuId,
    siteId: data.siteId,
    deal: data.deal,
    createdAt: isoDaysFromNow(-data.createdDaysAgo),
    lastContactAt:
      data.contactDaysAgo !== undefined ? isoDaysFromNow(-data.contactDaysAgo) : undefined,
    followUpAt:
      data.followUpInDays !== undefined ? isoDaysFromNow(data.followUpInDays) : undefined,
    history: data.history,
  }
}

export function buildSeed(): AppData {
  const menus = [FX, MADE, ACAI, LENHADOR]

  const leads: Lead[] = [
    lead({
      id: 'lead_lenhador',
      name: 'O Lenhador',
      category: 'Lanches',
      neighborhood: 'Vila Izabel',
      phone: '41900000001',
      rating: 4.7,
      reviews: 86,
      hasSite: false,
      hasMenu: false,
      status: 'enviado',
      priority: 'alta',
      notes: 'Dono respondeu "vou ver" no primeiro contato. Cardápio demonstrativo já montado.',
      menuId: 'menu_lenhador',
      createdDaysAgo: 4,
      contactDaysAgo: 2,
      followUpInDays: 0,
      history: [
        hist('cardapio', 4, 'Cardápio demonstrativo gerado com 4 categorias e 11 itens.'),
        hist('mensagem', 2, 'Primeiro contato enviado com o link do cardápio.'),
        hist('nota', 2, 'Respondeu "vou ver". Follow-up D+2 agendado.'),
      ],
    }),
    lead({
      id: 'lead_fx',
      name: 'Fx Burgers Grill',
      category: 'Hamburgueria',
      neighborhood: 'Hauer',
      phone: '41900000002',
      rating: 4.8,
      reviews: 64,
      hasSite: false,
      hasMenu: false,
      status: 'respondeu',
      priority: 'alta',
      notes: 'Pediu para ver como fica no celular. Interesse em trocar o PDF do Instagram.',
      menuId: 'menu_fx',
      siteId: 'site_fx',
      createdDaysAgo: 3,
      contactDaysAgo: 1,
      history: [
        hist('cardapio', 3, 'Cardápio demonstrativo gerado a partir do cardápio do Instagram.'),
        hist('mensagem', 1, 'Primeiro contato enviado com o link do cardápio.'),
        hist('nota', 1, 'Respondeu: "gostei, como faço pra atualizar os preços depois?"'),
      ],
    }),
    lead({
      id: 'lead_made',
      name: 'Madê Pizza e Vinho',
      category: 'Pizzaria',
      neighborhood: 'Água Verde',
      phone: '41900000003',
      rating: 4.8,
      reviews: 52,
      hasSite: false,
      hasMenu: false,
      status: 'enviado',
      priority: 'alta',
      notes: 'Carta de vinhos é o diferencial. Vale um cardápio com seção de taças.',
      menuId: 'menu_made',
      createdDaysAgo: 8,
      contactDaysAgo: 5,
      followUpInDays: -3,
      history: [
        hist('cardapio', 8, 'Prévia criada com seção de vinhos em taça.'),
        hist('mensagem', 5, 'Primeiro contato enviado.'),
        hist('nota', 4, 'Sem resposta. Follow-up D+2 atrasado.'),
      ],
    }),
    lead({
      id: 'lead_catchup',
      name: 'Catchup Burger',
      category: 'Hamburgueria',
      neighborhood: 'Portão',
      phone: '41900000004',
      rating: 4.6,
      reviews: 38,
      hasSite: false,
      hasMenu: false,
      status: 'a-contatar',
      priority: 'alta',
      notes: 'Só tem cardápio em foto no story. Boa oportunidade para a primeira abordagem.',
      createdDaysAgo: 1,
      history: [hist('nota', 1, 'Lead qualificado pelo Maps: sem site e sem cardápio navegável.')],
    }),
    lead({
      id: 'lead_smoked',
      name: 'Smoked Burger',
      category: 'Hamburgueria',
      neighborhood: 'Água Verde',
      phone: '41900000005',
      rating: 4.9,
      reviews: 97,
      hasSite: true,
      hasMenu: false,
      status: 'a-contatar',
      priority: 'media',
      notes: 'Tem site institucional, mas o cardápio está em imagem. Oferta de cardápio separado.',
      createdDaysAgo: 2,
      history: [hist('nota', 2, 'Site fraco: cardápio em JPG, sem preço atualizado.')],
    }),
    lead({
      id: 'lead_acai',
      name: 'Açaí Saboroso',
      category: 'Açaí',
      neighborhood: 'Portão',
      phone: '41900000006',
      rating: 4.7,
      reviews: 41,
      hasSite: false,
      hasMenu: false,
      status: 'fechado',
      priority: 'alta',
      notes: 'Fechou o plano Essencial. Ajustes de preço são feitos por WhatsApp.',
      menuId: 'menu_acai',
      deal: { setup: SITE.price.setup, monthly: SITE.price.monthly },
      createdDaysAgo: 12,
      contactDaysAgo: 9,
      history: [
        hist('mensagem', 9, 'Primeiro contato enviado.'),
        hist('nota', 7, 'Respondeu pedindo o valor.'),
        hist('mensagem', 7, 'Enviada a resposta de preço.'),
        hist('status', 6, 'Fechado: R$ 597 de criação + R$ 97/mês.'),
        hist('cardapio', 6, 'Cardápio publicado e link entregue no WhatsApp.'),
      ],
    }),
    lead({
      id: 'lead_ki',
      name: 'Ki Lanches',
      category: 'Lanches',
      neighborhood: 'Cajuru',
      phone: '41900000007',
      rating: 4.6,
      reviews: 19,
      hasSite: false,
      hasMenu: false,
      status: 'a-contatar',
      priority: 'media',
      notes: 'Ponto de bairro, movimento no almoço. Confirmar se o número tem WhatsApp.',
      createdDaysAgo: 1,
      history: [hist('nota', 1, 'Adicionado à carteira.')],
    }),
    lead({
      id: 'lead_whatafuck',
      name: 'Whatafuck',
      category: 'Lanches',
      neighborhood: 'Centro',
      phone: '41900000008',
      rating: 4.4,
      reviews: 28,
      hasSite: false,
      hasMenu: false,
      status: 'enviado',
      priority: 'media',
      notes: 'Nome chama atenção, cardápio não existe online. Abordagem sem mencionar o nome.',
      createdDaysAgo: 5,
      contactDaysAgo: 3,
      followUpInDays: 0,
      history: [
        hist('mensagem', 3, 'Primeiro contato enviado.'),
        hist('nota', 3, 'Sem resposta até agora. Follow-up D+2 para hoje.'),
      ],
    }),
    lead({
      id: 'lead_alex_hauer',
      name: 'Alexandria Burger Hauer',
      category: 'Hamburgueria',
      neighborhood: 'Hauer',
      phone: '41900000009',
      rating: 4.5,
      reviews: 320,
      hasSite: true,
      hasMenu: true,
      status: 'descartado',
      priority: 'baixa',
      notes: 'Rede com cardápio próprio e equipe de marketing. Fora do perfil.',
      createdDaysAgo: 10,
      history: [hist('nota', 10, 'Descartado: já tem cardápio online e estrutura.')],
    }),
    lead({
      id: 'lead_alex_boqueirao',
      name: 'Alexandria Alto Boqueirão',
      category: 'Hamburgueria',
      neighborhood: 'Alto Boqueirão',
      phone: '41900000010',
      rating: 4.5,
      reviews: 289,
      hasSite: true,
      hasMenu: true,
      status: 'descartado',
      priority: 'baixa',
      notes: 'Mesma rede do Hauer. Não abordar.',
      createdDaysAgo: 10,
      history: [hist('nota', 10, 'Descartado: mesma rede do Alexandria Hauer.')],
    }),
    lead({
      id: 'lead_villa',
      name: 'Villa Bistrô',
      category: 'Bistrô',
      neighborhood: 'Batel',
      phone: '41900000011',
      rating: 4.8,
      reviews: 9703,
      hasSite: true,
      hasMenu: true,
      status: 'descartado',
      priority: 'baixa',
      notes: 'Volume alto, já tem site e cardápio. Não é o perfil do teste.',
      createdDaysAgo: 10,
      history: [hist('nota', 10, 'Descartado pelo critério de qualificação.')],
    }),
    lead({
      id: 'lead_pizzaria_bairro',
      name: 'Pizzaria do Bairro',
      category: 'Pizzaria',
      neighborhood: 'Novo Mundo',
      phone: '41900000012',
      rating: 4.5,
      reviews: 23,
      hasSite: false,
      hasMenu: false,
      status: 'a-contatar',
      priority: 'alta',
      notes: 'Achada na varredura do Maps. Cardápio só no balcão.',
      createdDaysAgo: 0,
      history: [hist('nota', 0, 'Adicionada hoje na varredura do Maps.')],
    }),
    lead({
      id: 'lead_studio',
      name: 'Studio Essential',
      category: 'Academia e personal',
      neighborhood: 'Batel',
      phone: '41900000013',
      rating: 4.9,
      reviews: 48,
      hasSite: false,
      hasMenu: false,
      status: 'a-contatar',
      priority: 'alta',
      notes: 'Nicho fora de restaurante: oportunidade de site, não de cardápio.',
      siteId: 'site_studio',
      createdDaysAgo: 0,
      history: [
        hist('nota', 0, 'Adicionado pela busca por nicho (academia e personal).'),
        hist('site', 0, 'Site demonstrativo gerado a partir do template de academia.'),
      ],
    }),
  ]

  const sites = [SITE_FX, SITE_STUDIO]

  return {
    version: 1,
    leads,
    menus,
    sites,
    subscription: {
      plan: 'pro',
      status: 'trial',
      startedAt: isoDaysFromNow(-1),
      renewsAt: isoDaysFromNow(6),
      trialEndsAt: isoDaysFromNow(6),
    },
    settings: {
      theme: 'light',
      bio: {
        name: SITE.owner.name,
        headline: 'Cardápios online para restaurantes de bairro',
        whatsapp: SITE.whatsapp,
      },
    },
    feedback: [],
    seeded: true,
    updatedAt: new Date().toISOString(),
  }
}

export function emptyData(): AppData {
  return {
    version: 1,
    leads: [],
    menus: [],
    sites: [],
    subscription: {
      plan: 'pro',
      status: 'trial',
      startedAt: isoDaysFromNow(0),
      renewsAt: isoDaysFromNow(7),
      trialEndsAt: isoDaysFromNow(7),
    },
    settings: {
      theme: 'light',
      bio: {
        name: SITE.owner.name,
        headline: 'Cardápios online para restaurantes de bairro',
        whatsapp: SITE.whatsapp,
      },
    },
    feedback: [],
    seeded: false,
    updatedAt: new Date().toISOString(),
  }
}
