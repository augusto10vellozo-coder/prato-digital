import type { IconName } from '../components/Icon'
import type { Menu, Site, SiteService } from './types'

export interface Niche {
  id: string
  label: string
  group: 'food' | 'servicos' | 'saude' | 'beleza' | 'local'
  kind: 'food' | 'local'
  icon: IconName
  menuTemplateId?: string
  siteTemplateId: string
  recommended?: boolean
  keywords: string[]
}

/**
 * Nichos que o wizard oferece. `kind: food` pode gerar cardápio; todos podem
 * gerar site. Os IDs de template apontam para `templates.ts` e `siteTemplates.ts`.
 */
export const NICHES: Niche[] = [
  { id: 'hamburgueria', label: 'Hamburgueria', group: 'food', kind: 'food', icon: 'tag', menuTemplateId: 'tpl-burger', siteTemplateId: 'site-restaurante', recommended: true, keywords: ['hamburgueria', 'burger', 'lanches'] },
  { id: 'pizzaria', label: 'Pizzaria', group: 'food', kind: 'food', icon: 'star', menuTemplateId: 'tpl-pizza', siteTemplateId: 'site-restaurante', recommended: true, keywords: ['pizzaria', 'pizza'] },
  { id: 'acai', label: 'Açaí', group: 'food', kind: 'food', icon: 'sparkles', menuTemplateId: 'tpl-acai', siteTemplateId: 'site-restaurante', recommended: true, keywords: ['açaí', 'açai', 'sorvete'] },
  { id: 'lanches', label: 'Lanches e boteco', group: 'food', kind: 'food', icon: 'zap', menuTemplateId: 'tpl-lanche', siteTemplateId: 'site-restaurante', recommended: true, keywords: ['lanches', 'boteco', 'bar'] },
  { id: 'brasileira', label: 'Comida brasileira', group: 'food', kind: 'food', icon: 'home', menuTemplateId: 'tpl-brasileira', siteTemplateId: 'site-restaurante', keywords: ['comida brasileira', 'marmita', 'almoço'] },
  { id: 'cafeteria', label: 'Cafeteria', group: 'food', kind: 'food', icon: 'sun', menuTemplateId: 'tpl-cafe', siteTemplateId: 'site-restaurante', keywords: ['cafeteria', 'café', 'padaria'] },
  { id: 'bistro', label: 'Bistrô', group: 'food', kind: 'food', icon: 'award', siteTemplateId: 'site-restaurante', keywords: ['bistrô', 'restaurante'] },

  { id: 'academia', label: 'Academia e personal', group: 'saude', kind: 'local', icon: 'zap', siteTemplateId: 'site-academia', keywords: ['academia', 'personal trainer', 'crossfit', 'pilates'] },
  { id: 'odontologia', label: 'Clínica odontológica', group: 'saude', kind: 'local', icon: 'check-circle', siteTemplateId: 'site-saude', keywords: ['dentista', 'odontologia', 'clínica odontológica'] },
  { id: 'estetica', label: 'Clínica de estética', group: 'beleza', kind: 'local', icon: 'sparkles', siteTemplateId: 'site-beleza', keywords: ['estética', 'clínica de estética'] },
  { id: 'pet', label: 'Pet shop e veterinária', group: 'local', kind: 'local', icon: 'heart', siteTemplateId: 'site-pet', keywords: ['pet shop', 'veterinária', 'banho e tosa'] },
  { id: 'salao', label: 'Salão de beleza', group: 'beleza', kind: 'local', icon: 'scissors', siteTemplateId: 'site-beleza', keywords: ['salão de beleza', 'cabelo'] },
  { id: 'barbearia', label: 'Barbearia', group: 'beleza', kind: 'local', icon: 'scissors', siteTemplateId: 'site-beleza', keywords: ['barbearia', 'barbeiro'] },
  { id: 'mecanica', label: 'Mecânica e auto center', group: 'servicos', kind: 'local', icon: 'settings', siteTemplateId: 'site-servicos', keywords: ['mecânica', 'auto center', 'oficina'] },
  { id: 'imobiliaria', label: 'Imobiliária', group: 'servicos', kind: 'local', icon: 'home', siteTemplateId: 'site-servicos', keywords: ['imobiliária', 'corretor de imóveis'] },
  { id: 'advocacia', label: 'Escritório de advocacia', group: 'servicos', kind: 'local', icon: 'briefcase', siteTemplateId: 'site-servicos', keywords: ['advogado', 'advocacia'] },
  { id: 'contabilidade', label: 'Contabilidade', group: 'servicos', kind: 'local', icon: 'file-text', siteTemplateId: 'site-servicos', keywords: ['contabilidade', 'contador'] },
  { id: 'assistencia', label: 'Assistência técnica', group: 'servicos', kind: 'local', icon: 'settings', siteTemplateId: 'site-servicos', keywords: ['assistência técnica', 'conserto de celular'] },
  { id: 'buffet', label: 'Buffet e eventos', group: 'servicos', kind: 'local', icon: 'rocket', siteTemplateId: 'site-servicos', keywords: ['buffet', 'eventos', 'festa'] },
  { id: 'construcao', label: 'Construção e reforma', group: 'servicos', kind: 'local', icon: 'layers', siteTemplateId: 'site-servicos', keywords: ['construção', 'reforma', 'pedreiro'] },
  { id: 'seguros', label: 'Corretor de seguros', group: 'servicos', kind: 'local', icon: 'shield', siteTemplateId: 'site-servicos', keywords: ['seguros', 'corretor'] },
  { id: 'restaurante', label: 'Restaurante', group: 'food', kind: 'food', icon: 'home', menuTemplateId: 'tpl-brasileira', siteTemplateId: 'site-restaurante', keywords: ['restaurante', 'comida'] },
]

export function getNiche(id: string): Niche {
  return NICHES.find((niche) => niche.id === id) ?? NICHES[0]
}

export function nichesForType(type: 'menu' | 'site' | 'both'): Niche[] {
  if (type === 'site') return NICHES
  return NICHES.filter((niche) => niche.kind === 'food')
}

export function nicheSearchLink(niche: Niche, city = 'Curitiba', state = 'PR'): string {
  const query = encodeURIComponent(`${niche.keywords[0]} em ${city} ${state}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export function siteServicePrice(service: SiteService): string {
  return service.price ? service.price : 'sob consulta'
}

export function menuLinkLabel(menu?: Menu): string {
  if (!menu) return 'sem cardápio'
  return menu.isDemo ? 'cardápio em prévia' : 'cardápio no ar'
}

export function siteLinkLabel(site?: Site): string {
  if (!site) return 'sem site'
  return site.isDemo ? 'site em prévia' : 'site no ar'
}
