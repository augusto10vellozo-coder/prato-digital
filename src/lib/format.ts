const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function brl(value: number): string {
  return brlFormatter.format(value)
}

const brlRoundFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export function brlRound(value: number): string {
  return brlRoundFormatter.format(Math.round(value))
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return value
}

export function isMobilePhone(value: string): boolean {
  const digits = onlyDigits(value)
  const local = digits.length > 11 ? digits.slice(-11) : digits
  return local.length === 11 && local[2] === '9'
}

export type PhoneType = 'mobile' | 'landline' | 'unknown'

/** Classificação pelo formato brasileiro: 11 dígitos com 9 após o DDD = celular. */
export function phoneType(value: string): PhoneType {
  const digits = onlyDigits(value)
  if (!digits) return 'unknown'
  const local = digits.length > 11 ? digits.slice(-11) : digits
  if (local.length === 11 && local[2] === '9') return 'mobile'
  if (local.length === 10 || local.length === 11) return 'landline'
  return 'unknown'
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export function todayISO(): string {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export function isoDaysFromNow(days: number): string {
  const now = new Date()
  const target = new Date(now.getTime() + days * 86400000)
  return new Date(target.getTime() - target.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

export function formatDate(iso?: string): string {
  if (!iso) return '—'
  const [year, month, day] = iso.slice(0, 10).split('-')
  if (!year || !month || !day) return '—'
  return `${day}/${month}/${year}`
}

export function shortDate(iso?: string): string {
  if (!iso) return '—'
  const [, month, day] = iso.slice(0, 10).split('-')
  return `${day}/${month}`
}

export function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(`${fromISO.slice(0, 10)}T12:00:00`).getTime()
  const to = new Date(`${toISO.slice(0, 10)}T12:00:00`).getTime()
  return Math.round((to - from) / 86400000)
}

export function followUpLabel(iso?: string): { text: string; tone: 'late' | 'today' | 'soon' | 'none' } {
  if (!iso) return { text: 'sem follow-up', tone: 'none' }
  const diff = daysBetween(todayISO(), iso)
  if (diff < 0) return { text: `atrasado ${Math.abs(diff)}d`, tone: 'late' }
  if (diff === 0) return { text: 'hoje', tone: 'today' }
  if (diff === 1) return { text: 'amanhã', tone: 'soon' }
  if (diff <= 3) return { text: `em ${diff} dias`, tone: 'soon' }
  return { text: formatDate(iso), tone: 'none' }
}

export function ratingText(value: number): string {
  return value.toFixed(1).replace('.', ',')
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}
