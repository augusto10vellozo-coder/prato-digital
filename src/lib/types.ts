export type LeadStatus = 'a-contatar' | 'enviado' | 'respondeu' | 'fechado' | 'descartado'
export type MessageKind = 'primeiro' | 'follow2' | 'follow5' | 'preco' | 'fechamento'
export type Priority = 'alta' | 'media' | 'baixa'
export type MenuTheme = 'encarte' | 'noite' | 'leve'
export type ItemTag = 'mais-pedido' | 'vegetariano' | 'picante' | 'novo' | 'sem-gluten'

export type PlanId = 'starter' | 'pro' | 'agency'
export type AppTheme = 'light' | 'dark'
export type SiteTheme = 'claro' | 'escuro' | 'areia'

export interface SiteService {
  id: string
  title: string
  description: string
  price?: string
}

export interface SitePhoto {
  id: string
  src: string
  caption?: string
}

export interface Site {
  id: string
  slug: string
  name: string
  category: string
  neighborhood: string
  address: string
  phone: string
  whatsapp: string
  hours: string
  tagline: string
  about: string
  highlights: string[]
  services: SiteService[]
  heroImage?: string
  gallery?: SitePhoto[]
  accent: string
  theme: SiteTheme
  menuId?: string
  isDemo: boolean
  updatedAt: string
}

export interface Subscription {
  plan: PlanId
  status: 'trial' | 'active' | 'expired'
  startedAt: string
  renewsAt: string
  trialEndsAt?: string
}

export interface BioProfile {
  name: string
  headline: string
  whatsapp: string
}

export interface AppSettings {
  theme: AppTheme
  bio: BioProfile
}

export interface FeedbackEntry {
  id: string
  rating: number
  message: string
  at: string
}

export interface LeadDeal {
  setup: number
  monthly: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  tags: ItemTag[]
}

export interface MenuCategory {
  id: string
  name: string
  note?: string
  items: MenuItem[]
}

export interface Menu {
  id: string
  slug: string
  name: string
  tagline: string
  category: string
  neighborhood: string
  address: string
  hours: string
  phone: string
  instagram?: string
  note?: string
  accent: string
  theme: MenuTheme
  categories: MenuCategory[]
  isDemo: boolean
  updatedAt: string
}

export type HistoryKind = 'nota' | 'status' | 'mensagem' | 'cardapio' | 'site' | 'ligacao'

export interface HistoryEntry {
  id: string
  kind: HistoryKind
  at: string
  text: string
}

export interface Lead {
  id: string
  name: string
  category: string
  neighborhood: string
  phone: string
  rating: number
  reviews: number
  hasSite: boolean
  hasMenu: boolean
  isDemo?: boolean
  /** O número parece WhatsApp? Só o formato não prova nada: o usuário confirma. */
  whatsappStatus?: 'unknown' | 'confirmed' | 'none'
  status: LeadStatus
  priority: Priority
  notes: string
  menuId?: string
  siteId?: string
  deal?: LeadDeal
  createdAt: string
  lastContactAt?: string
  followUpAt?: string
  history: HistoryEntry[]
}

export interface AppData {
  version: 1
  leads: Lead[]
  menus: Menu[]
  sites: Site[]
  subscription: Subscription
  settings: AppSettings
  feedback: FeedbackEntry[]
  seeded: boolean
  updatedAt: string
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  'a-contatar': 'A contatar',
  enviado: 'Enviado',
  respondeu: 'Respondeu',
  fechado: 'Fechado',
  descartado: 'Descartado',
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

export const TAG_LABEL: Record<ItemTag, string> = {
  'mais-pedido': 'Mais pedido',
  vegetariano: 'Vegetariano',
  picante: 'Picante',
  novo: 'Novo',
  'sem-gluten': 'Sem glúten',
}
