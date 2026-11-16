import { SITE } from '../config'
import { isoDaysFromNow, todayISO } from './format'
import type { HistoryEntry, Lead, LeadStatus, Menu } from './types'

export interface ActivityItem {
  id: string
  at: string
  leadId: string
  leadName: string
  kind: HistoryEntry['kind']
  title: string
  detail: string
}

const TITLES: Record<HistoryEntry['kind'], string> = {
  mensagem: 'Mensagem enviada',
  status: 'Status atualizado',
  cardapio: 'Cardápio atualizado',
  site: 'Site atualizado',
  nota: 'Anotação',
  ligacao: 'Ligação',
}

export function sentOn(leads: Lead[], date: string): number {
  return leads.reduce(
    (sum, lead) => sum + lead.history.filter((entry) => entry.kind === 'mensagem' && entry.at === date).length,
    0,
  )
}

export function sentBetween(leads: Lead[], from: string, to = todayISO()): number {
  return leads.reduce(
    (sum, lead) =>
      sum +
      lead.history.filter(
        (entry) => entry.kind === 'mensagem' && entry.at >= from && entry.at <= to,
      ).length,
    0,
  )
}

export function sentToday(leads: Lead[]): number {
  return sentOn(leads, todayISO())
}

export function sentThisWeek(leads: Lead[]): number {
  return sentBetween(leads, isoDaysFromNow(-6))
}

export function dueFollowUps(leads: Lead[]): Lead[] {
  const today = todayISO()
  return leads
    .filter(
      (lead) =>
        lead.status === 'enviado' && lead.followUpAt !== undefined && lead.followUpAt <= today,
    )
    .sort((a, b) => (a.followUpAt ?? '').localeCompare(b.followUpAt ?? ''))
}

export function countStatus(leads: Lead[], status: LeadStatus): number {
  return leads.filter((lead) => lead.status === status).length
}

export function funnelCounts(leads: Lead[]) {
  return {
    novo: countStatus(leads, 'a-contatar'),
    contatado: countStatus(leads, 'enviado'),
    negociando: countStatus(leads, 'respondeu'),
    fechado: countStatus(leads, 'fechado'),
    descartado: countStatus(leads, 'descartado'),
  }
}

export function contactedCount(leads: Lead[]): number {
  return leads.filter((lead) => ['enviado', 'respondeu', 'fechado'].includes(lead.status)).length
}

export function answeredCount(leads: Lead[]): number {
  return leads.filter((lead) => ['respondeu', 'fechado'].includes(lead.status)).length
}

export function responseRate(leads: Lead[]): number {
  const contacted = contactedCount(leads)
  if (!contacted) return 0
  return Math.round((answeredCount(leads) / contacted) * 100)
}

export function recentActivity(leads: Lead[], limit = 7): ActivityItem[] {
  const items: (ActivityItem & { order: number })[] = []
  leads.forEach((lead) => {
    lead.history.forEach((entry, index) => {
      items.push({
        id: entry.id,
        at: entry.at,
        leadId: lead.id,
        leadName: lead.name,
        kind: entry.kind,
        title: TITLES[entry.kind] ?? 'Movimento',
        detail: entry.text,
        order: index,
      })
    })
  })
  return items
    .sort((a, b) => b.at.localeCompare(a.at) || b.order - a.order)
    .slice(0, limit)
}

export function closedLeads(leads: Lead[]): Lead[] {
  return leads.filter((lead) => lead.status === 'fechado')
}

export function mrr(leads: Lead[]): number {
  return closedLeads(leads).reduce(
    (sum, lead) => sum + (lead.deal?.monthly ?? SITE.price.monthly),
    0,
  )
}

export function setupRevenue(leads: Lead[]): number {
  return closedLeads(leads).reduce(
    (sum, lead) => sum + (lead.deal?.setup ?? SITE.price.setup),
    0,
  )
}

export function menusThisMonth(menus: Menu[]): number {
  const month = todayISO().slice(0, 7)
  return menus.filter((menu) => menu.updatedAt.slice(0, 7) === month).length
}

export function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}
