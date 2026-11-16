import { slugify, todayISO, uid } from './format'
import type { ItemTag, Menu, MenuTheme, PlanId } from './types'

export interface TemplateItem {
  name: string
  description: string
  price: number
  tags?: ItemTag[]
}

export interface TemplateCategory {
  name: string
  note?: string
  items: TemplateItem[]
}

export interface MenuTemplate {
  id: string
  name: string
  category: string
  description: string
  theme: MenuTheme
  accent: string
  minPlan: PlanId
  tagline: string
  note: string
  categories: TemplateCategory[]
}

const burger: MenuTemplate = {
  id: 'tpl-burger',
  name: 'Smash de Bairro',
  category: 'Hamburgueria',
  description: 'Cardápio direto, com combos e fritas. Bom para hamburgueria de bairro.',
  theme: 'encarte',
  accent: '#c8372d',
  minPlan: 'starter',
  tagline: 'Smash na chapa, pão brioche e molho da casa.',
  note: 'Peça pelo WhatsApp. Retirada no balcão e entrega em até 4 km.',
  categories: [
    {
      name: 'Burgers',
      items: [
        { name: 'Smash da Casa', description: 'Dois smashs de 90 g, cheddar, picles e molho da casa.', price: 27.9, tags: ['mais-pedido'] },
        { name: 'Cheddar Bacon', description: 'Blend 150 g, cheddar, bacon crocante e cebola crispy.', price: 32.9 },
        { name: 'Veggie', description: 'Hambúrguer de grão-de-bico, queijo minas, rúcula e tomate.', price: 27.9, tags: ['vegetariano'] },
      ],
    },
    {
      name: 'Para dividir',
      items: [
        { name: 'Fritas rústicas', description: 'Batata com casca, cheddar e bacon. Serve 2.', price: 19.9, tags: ['mais-pedido'] },
        { name: 'Onion rings', description: 'Anéis de cebola empanados com barbecue.', price: 21.9 },
      ],
    },
    {
      name: 'Bebidas',
      items: [
        { name: 'Refrigerante lata', description: 'Coca-Cola, Guaraná ou Sprite. 350 ml.', price: 6 },
        { name: 'Milkshake', description: 'Chocolate, morango ou ovomaltine. 400 ml.', price: 16.9 },
      ],
    },
  ],
}

const pizza: MenuTemplate = {
  id: 'tpl-pizza',
  name: 'Forno da Casa',
  category: 'Pizzaria',
  description: 'Massa artesanal, sabores clássicos e vinhos em taça. Visual mais noturno.',
  theme: 'noite',
  accent: '#7a2e3b',
  minPlan: 'starter',
  tagline: 'Massa de fermentação natural, assada no forno a lenha.',
  note: 'Massa de 48h. Disponível também sem glúten.',
  categories: [
    {
      name: 'Pizzas',
      items: [
        { name: 'Margherita', description: 'Molho de tomate, mozzarella, manjericão e parmesão.', price: 52, tags: ['mais-pedido'] },
        { name: 'Calabresa', description: 'Calabresa artesanal, cebola roxa e orégano.', price: 56 },
        { name: 'Quatro Queijos', description: 'Mozzarella, gorgonzola, parmesão e catupiry.', price: 62 },
      ],
    },
    {
      name: 'Entradas',
      items: [
        { name: 'Focaccia da casa', description: 'Alecrim, flor de sal e azeite extravirgem.', price: 22 },
        { name: 'Burrata', description: 'Tomate confit, manjericão e azeite.', price: 38 },
      ],
    },
    {
      name: 'Vinhos em taça',
      items: [
        { name: 'Tinto da casa', description: 'Blend argentino. Taça de 150 ml.', price: 22 },
        { name: 'Prosecco', description: 'Taça de 150 ml.', price: 28 },
      ],
    },
  ],
}

const acai: MenuTemplate = {
  id: 'tpl-acai',
  name: 'Açaí do Bairro',
  category: 'Açaí',
  description: 'Visual leve, combinações e complementos. Bom para açaí, sorvete e sobremesa.',
  theme: 'leve',
  accent: '#5b3a8c',
  minPlan: 'starter',
  tagline: 'Açaí cremoso do jeito que você monta.',
  note: 'Monte o seu ou escolha uma combinação da casa. Delivery em até 4 km.',
  categories: [
    {
      name: 'Açaí',
      items: [
        { name: 'Açaí 300 ml', description: 'Com até 3 complementos.', price: 16.9 },
        { name: 'Açaí 500 ml', description: 'Com até 4 complementos.', price: 22.9, tags: ['mais-pedido'] },
        { name: 'Açaí 700 ml', description: 'Com até 5 complementos.', price: 28.9 },
      ],
    },
    {
      name: 'Combinações',
      items: [
        { name: 'Morango com leite ninho', description: 'Açaí 400 ml, morango e leite ninho.', price: 24.9, tags: ['mais-pedido'] },
        { name: 'Paçoca com banana', description: 'Açaí 400 ml, paçoca, banana e mel.', price: 22.9 },
      ],
    },
    {
      name: 'Complementos',
      items: [
        { name: 'Granola artesanal', description: 'Porção extra.', price: 2.5 },
        { name: 'Leite ninho', description: 'Porção extra.', price: 2.5 },
        { name: 'Morango', description: 'Porção extra.', price: 3.5 },
      ],
    },
  ],
}

const lanche: MenuTemplate = {
  id: 'tpl-lanche',
  name: 'Boteco do Lenhador',
  category: 'Lanches',
  description: 'Porções, lanches e chopp. Para boteco, lanchonete e bar de bairro.',
  theme: 'encarte',
  accent: '#2f5d3a',
  minPlan: 'pro',
  tagline: 'Lanches, porções e chopp gelado.',
  note: 'Pedidos pelo WhatsApp. Mesa na calçada e retirada no balcão.',
  categories: [
    {
      name: 'Lanches',
      items: [
        { name: 'X-Tudo', description: 'Blend 180 g, dois queijos, bacon, ovo e salada.', price: 38.9, tags: ['mais-pedido'] },
        { name: 'X-Bacon', description: 'Blend 150 g, cheddar, bacon e cebola crispy.', price: 32.9 },
        { name: 'X-Salada', description: 'Blend 150 g, queijo, alface, tomate e maionese.', price: 24.9 },
      ],
    },
    {
      name: 'Porções',
      items: [
        { name: 'Batata rústica', description: 'Com alecrim e maionese da casa. Serve 2.', price: 24.9 },
        { name: 'Frango a passarinho', description: '500 g com alho e limão.', price: 39.9 },
      ],
    },
    {
      name: 'Bebidas',
      items: [
        { name: 'Chopp', description: '300 ml, claro ou escuro.', price: 8.9 },
        { name: 'Refrigerante', description: 'Lata 350 ml.', price: 6 },
      ],
    },
  ],
}

const brasileira: MenuTemplate = {
  id: 'tpl-brasileira',
  name: 'Prato do Dia',
  category: 'Comida brasileira',
  description: 'Almoço executivo, marmitas e pratos do dia. Para restaurante de almoço.',
  theme: 'leve',
  accent: '#b06a1f',
  minPlan: 'pro',
  tagline: 'Comida caseira, feita no dia.',
  note: 'Almoço de segunda a sábado. Marmita para retirada e entrega.',
  categories: [
    {
      name: 'Pratos do dia',
      items: [
        { name: 'Bife à cavalo', description: 'Bife, ovo, arroz, feijão, salada e batata.', price: 32.9, tags: ['mais-pedido'] },
        { name: 'Frango grelhado', description: 'Filé de frango, arroz integral, legumes e salada.', price: 28.9 },
        { name: 'Feijoada', description: 'Feijoada completa com arroz, couve e laranja.', price: 36.9 },
      ],
    },
    {
      name: 'Marmitas',
      items: [
        { name: 'Marmita P', description: 'Arroz, feijão, uma proteína e salada.', price: 18.9 },
        { name: 'Marmita G', description: 'Arroz, feijão, duas proteínas e salada.', price: 24.9 },
      ],
    },
    {
      name: 'Bebidas',
      items: [
        { name: 'Suco natural', description: 'Laranja, abacaxi ou maracujá. 300 ml.', price: 8.9 },
        { name: 'Água', description: '500 ml, com ou sem gás.', price: 4 },
      ],
    },
  ],
}

const cafe: MenuTemplate = {
  id: 'tpl-cafe',
  name: 'Café da Esquina',
  category: 'Cafeteria',
  description: 'Cafés, doces e salgados. Visual noturno para cafeteria e padaria.',
  theme: 'noite',
  accent: '#22458c',
  minPlan: 'agency',
  tagline: 'Café coado, espresso e doces da casa.',
  note: 'Salão e retirada. Café da manhã até 11h.',
  categories: [
    {
      name: 'Cafés',
      items: [
        { name: 'Espresso', description: 'Blend da casa. 40 ml.', price: 7 },
        { name: 'Cappuccino', description: 'Espresso, leite vaporizado e cacau.', price: 14, tags: ['mais-pedido'] },
        { name: 'Coado', description: 'Filtro de pano, 300 ml.', price: 10 },
      ],
    },
    {
      name: 'Doces',
      items: [
        { name: 'Pão de mel', description: 'Recheio de doce de leite.', price: 9.5 },
        { name: 'Bolo do dia', description: 'Fatia generosa, sabor do dia.', price: 12 },
      ],
    },
    {
      name: 'Salgados',
      items: [
        { name: 'Pão de queijo', description: 'Porção com 4 unidades.', price: 10 },
        { name: 'Croissant', description: 'Manteiga, presunto e queijo.', price: 16 },
      ],
    },
  ],
}

export const MENU_TEMPLATES: MenuTemplate[] = [burger, pizza, acai, lanche, brasileira, cafe]

export function getMenuTemplate(id?: string): MenuTemplate {
  return MENU_TEMPLATES.find((template) => template.id === id) ?? MENU_TEMPLATES[0]
}

export function uniqueMenuSlug(base: string, menus: Menu[]): string {
  const seed = slugify(base) || 'cardapio'
  const taken = new Set(menus.map((menu) => menu.slug))
  if (!taken.has(seed)) return seed
  let index = 2
  while (taken.has(`${seed}-${index}`)) index += 1
  return `${seed}-${index}`
}

export function templateToMenu(
  template: MenuTemplate,
  data: { name: string; neighborhood: string; phone: string; menus: Menu[] },
): Menu {
  return {
    id: uid('menu'),
    slug: uniqueMenuSlug(data.name, data.menus),
    name: data.name,
    tagline: template.tagline,
    category: template.category,
    neighborhood: data.neighborhood,
    address: '',
    hours: '',
    phone: data.phone,
    instagram: '',
    note: template.note,
    accent: template.accent,
    theme: template.theme,
    isDemo: true,
    updatedAt: todayISO(),
    categories: template.categories.map((category) => ({
      id: uid('cat'),
      name: category.name,
      note: category.note,
      items: category.items.map((item) => ({
        id: uid('item'),
        name: item.name,
        description: item.description,
        price: item.price,
        tags: item.tags ?? [],
      })),
    })),
  }
}
