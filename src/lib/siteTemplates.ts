import { slugify, todayISO, uid } from './format'
import type { Site, SiteTheme } from './types'

export interface SiteTemplate {
  id: string
  name: string
  category: string
  description: string
  theme: SiteTheme
  accent: string
  tagline: string
  about: string
  highlights: string[]
  services: { title: string; description: string; price?: string }[]
}

export const SITE_TEMPLATES: SiteTemplate[] = [
  {
    id: 'site-servicos',
    name: 'Serviços locais',
    category: 'Serviços',
    description: 'Uma página direta para prestador de serviço: o que faz, onde atende e como chamar.',
    theme: 'areia',
    accent: '#b06a1f',
    tagline: 'Serviço de confiança, atendimento no bairro.',
    about:
      'Atendimento próximo, orçamento sem compromisso e serviço feito por quem conhece a região. Fale com a gente pelo WhatsApp e receba uma resposta rápida.',
    highlights: ['Atendimento local', 'Orçamento rápido', 'Garantia de serviço'],
    services: [
      { title: 'Atendimento no local', description: 'Vamos até você para avaliar e resolver.', price: 'a partir de R$ 120' },
      { title: 'Orçamento sem compromisso', description: 'Você explica o problema e recebe uma proposta clara.', price: 'grátis' },
      { title: 'Manutenção e acompanhamento', description: 'Depois do serviço, a gente continua por perto.', price: 'sob consulta' },
    ],
  },
  {
    id: 'site-saude',
    name: 'Saúde e bem-estar',
    category: 'Saúde',
    description: 'Para clínica, consultório e profissional da saúde: credibilidade e agendamento.',
    theme: 'claro',
    accent: '#22458c',
    tagline: 'Cuidado próximo, no seu tempo.',
    about:
      'Atendimento humanizado, escuta de verdade e um plano construído com você. Agende sua avaliação e conheça o espaço.',
    highlights: ['Profissionais qualificados', 'Atendimento humanizado', 'Agenda pelo WhatsApp'],
    services: [
      { title: 'Avaliação inicial', description: 'Conversa e avaliação para entender o seu caso.', price: 'R$ 150' },
      { title: 'Atendimento individual', description: 'Sessão de 50 minutos, presencial ou online.', price: 'R$ 180' },
      { title: 'Acompanhamento', description: 'Retornos e ajustes ao longo do tratamento.', price: 'sob consulta' },
    ],
  },
  {
    id: 'site-beleza',
    name: 'Beleza e estética',
    category: 'Beleza',
    description: 'Para salão, barbearia e estética: serviços, preços e agenda no WhatsApp.',
    theme: 'claro',
    accent: '#7a2e3b',
    tagline: 'Seu momento de cuidado, no bairro.',
    about:
      'Um espaço para cuidar de você sem pressa. Profissionais experientes, produtos de qualidade e horário que respeita a sua rotina.',
    highlights: ['Agenda fácil', 'Profissionais experientes', 'Ambiente acolhedor'],
    services: [
      { title: 'Corte e finalização', description: 'Corte personalizado e finalização.', price: 'R$ 80' },
      { title: 'Coloração', description: 'Avaliação de cor e aplicação.', price: 'a partir de R$ 180' },
      { title: 'Tratamento', description: 'Hidratação e reconstrução.', price: 'R$ 120' },
    ],
  },
  {
    id: 'site-academia',
    name: 'Academia e personal',
    category: 'Academia e personal',
    description: 'Para academia, estúdio e personal: planos, modalidades e aula experimental.',
    theme: 'escuro',
    accent: '#2f5d3a',
    tagline: 'Treino que cabe na sua rotina.',
    about:
      'Treinos individualizados, acompanhamento de perto e uma comunidade que puxa você para cima. Comece com uma aula experimental.',
    highlights: ['Aula experimental', 'Treino individualizado', 'Horários flexíveis'],
    services: [
      { title: 'Personal trainer', description: 'Treino individual com acompanhamento.', price: 'a partir de R$ 120/sessão' },
      { title: 'Treino funcional', description: 'Turmas pequenas, foco em movimento.', price: 'R$ 220/mês' },
      { title: 'Avaliação física', description: 'Medidas, composição corporal e metas.', price: 'R$ 90' },
    ],
  },
  {
    id: 'site-restaurante',
    name: 'Restaurante',
    category: 'Restaurante',
    description: 'Página do restaurante com cardápio, horário, endereço e pedido no WhatsApp.',
    theme: 'escuro',
    accent: '#c8372d',
    tagline: 'Comida feita na hora, do jeito da casa.',
    about:
      'Ingredientes frescos, receitas da casa e atendimento de bairro. Peça pelo WhatsApp, retire no balcão ou receba em casa.',
    highlights: ['Pedido no WhatsApp', 'Feito na hora', 'Delivery no bairro'],
    services: [
      { title: 'Salão', description: 'Ambiente para comer no local.', price: 'sem taxa' },
      { title: 'Retirada', description: 'Peça e retire no balcão.', price: 'sem taxa' },
      { title: 'Delivery', description: 'Entrega em até 5 km.', price: 'a combinar' },
    ],
  },
  {
    id: 'site-pet',
    name: 'Pet shop e veterinária',
    category: 'Pet',
    description: 'Para pet shop, banho e tosa e veterinária: serviços, horários e contato.',
    theme: 'claro',
    accent: '#2f5d3a',
    tagline: 'Cuidado de verdade para o seu pet.',
    about:
      'Banho, tosa, consultas e produtos com atendimento próximo. Seu pet é tratado como parte da família.',
    highlights: ['Banho e tosa', 'Atendimento veterinário', 'Retirada e entrega'],
    services: [
      { title: 'Banho', description: 'Banho com produtos adequados ao pelo.', price: 'a partir de R$ 60' },
      { title: 'Tosa', description: 'Tosa higiênica ou na tesoura.', price: 'a partir de R$ 80' },
      { title: 'Consulta veterinária', description: 'Avaliação clínica com profissional.', price: 'R$ 150' },
    ],
  },
]

export function getSiteTemplate(id: string): SiteTemplate {
  return SITE_TEMPLATES.find((template) => template.id === id) ?? SITE_TEMPLATES[0]
}

export function uniqueSiteSlug(base: string, sites: Site[]): string {
  const seed = slugify(base) || 'site'
  const taken = new Set(sites.map((site) => site.slug))
  if (!taken.has(seed)) return seed
  let index = 2
  while (taken.has(`${seed}-${index}`)) index += 1
  return `${seed}-${index}`
}

export function siteTemplateToSite(
  template: SiteTemplate,
  data: {
    name: string
    category?: string
    neighborhood?: string
    address?: string
    phone?: string
    whatsapp?: string
    city?: string
    sites: Site[]
    menuId?: string
  },
): Site {
  return {
    id: uid('site'),
    slug: uniqueSiteSlug(data.name, data.sites),
    name: data.name,
    category: data.category || template.category,
    neighborhood: data.neighborhood || 'Curitiba',
    address: data.address || (data.neighborhood ? `${data.neighborhood}, ${data.city || 'Curitiba'}` : ''),
    phone: data.phone || '',
    whatsapp: data.whatsapp || data.phone || '',
    hours: 'Seg a sáb, horário comercial',
    tagline: template.tagline,
    about: template.about,
    highlights: [...template.highlights],
    services: template.services.map((service) => ({
      id: uid('svc'),
      title: service.title,
      description: service.description,
      price: service.price,
    })),
    accent: template.accent,
    theme: template.theme,
    menuId: data.menuId,
    isDemo: true,
    updatedAt: todayISO(),
  }
}
