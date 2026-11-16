import type { PlanId } from './types'

export interface Plan {
  id: PlanId
  name: string
  tagline: string
  price: number
  menus: number | null
  seats: number
  features: string[]
  highlight?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Para começar a vender',
    price: 49,
    menus: 10,
    seats: 1,
    features: [
      'Até 10 projetos (cardápios e sites)',
      '1 usuário',
      'CRM com funil e follow-up',
      'Templates de cardápio e site',
      'Link compartilhável e export HTML',
      'Atualizações de preço e item',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Recomendado',
    price: 97,
    menus: 40,
    seats: 2,
    highlight: true,
    features: [
      'Até 40 projetos (cardápios e sites)',
      '2 usuários',
      'Tudo do Starter',
      'Prospecção em massa',
      'Precificação e contratos',
      'Link na bio',
      'Suporte prioritário',
    ],
  },
  {
    id: 'agency',
    name: 'Agência',
    tagline: 'Para escalar a operação',
    price: 197,
    menus: null,
    seats: 5,
    features: [
      'Projetos ilimitados',
      '5 usuários',
      'Tudo do Pro',
      'Afiliados',
      'White-label (em breve)',
      'Atendimento dedicado',
    ],
  },
]

const PLAN_ORDER: Record<PlanId, number> = { starter: 1, pro: 2, agency: 3 }

export function getPlan(id: PlanId): Plan {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[0]
}

export function planRank(id: PlanId): number {
  return PLAN_ORDER[id] ?? 0
}

export function planAllows(current: PlanId, required: PlanId): boolean {
  return planRank(current) >= planRank(required)
}

export function planLimitLabel(plan: Plan): string {
  return plan.menus === null ? 'projetos ilimitados' : `${plan.menus} projetos`
}
