import { describe, expect, it } from 'vitest'
import {
  dueFollowUps,
  funnelCounts,
  mrr,
  responseRate,
  sentBetween,
  sentOn,
} from '../appStats'
import { todayISO } from '../format'
import type { Lead, LeadStatus } from '../types'

function lead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: Math.random().toString(36).slice(2),
    name: 'Restaurante Teste',
    category: 'Italiana',
    neighborhood: 'Centro',
    phone: '41999990000',
    rating: 4.5,
    reviews: 10,
    hasSite: false,
    hasMenu: false,
    status: 'a-contatar',
    priority: 'media',
    notes: '',
    createdAt: '2026-11-01',
    history: [],
    ...overrides,
  }
}

function statusLead(status: LeadStatus): Lead {
  return lead({ status })
}

describe('appStats', () => {
  it('conta o funil por status', () => {
    const leads = [
      statusLead('a-contatar'),
      statusLead('enviado'),
      statusLead('enviado'),
      statusLead('respondeu'),
      statusLead('fechado'),
      statusLead('descartado'),
    ]

    expect(funnelCounts(leads)).toEqual({
      novo: 1,
      contatado: 2,
      negociando: 1,
      fechado: 1,
      descartado: 1,
    })
  })

  it('calcula taxa de resposta sobre os contatados', () => {
    const leads = [
      statusLead('a-contatar'),
      statusLead('enviado'),
      statusLead('respondeu'),
      statusLead('fechado'),
    ]

    expect(responseRate(leads)).toBe(67)
    expect(responseRate([statusLead('a-contatar')])).toBe(0)
  })

  it('conta mensagens enviadas por data', () => {
    const leads = [
      lead({
        history: [
          { id: 'a', kind: 'mensagem', at: '2026-11-17', text: 'Primeiro contato' },
          { id: 'b', kind: 'nota', at: '2026-11-17', text: 'Anotação' },
          { id: 'c', kind: 'mensagem', at: '2026-11-16', text: 'Follow-up' },
        ],
      }),
    ]

    expect(sentOn(leads, '2026-11-17')).toBe(1)
    expect(sentBetween(leads, '2026-11-16', '2026-11-17')).toBe(2)
    expect(sentBetween(leads, '2026-11-17', '2026-11-17')).toBe(1)
  })

  it('soma o MRR dos fechados e usa o preço padrão quando não há acordo', () => {
    const leads = [
      lead({ status: 'fechado', deal: { setup: 597, monthly: 150 } }),
      lead({ status: 'fechado' }),
      lead({ status: 'enviado', deal: { setup: 0, monthly: 500 } }),
    ]

    expect(mrr(leads)).toBe(247)
  })

  it('lista follow-ups vencidos ou de hoje', () => {
    const hoje = todayISO()
    const leads = [
      lead({ status: 'enviado', name: 'Atrasado', followUpAt: '2000-01-01' }),
      lead({ status: 'enviado', name: 'Hoje', followUpAt: hoje }),
      lead({ status: 'enviado', name: 'Futuro', followUpAt: '2999-01-01' }),
      lead({ status: 'a-contatar', name: 'Novo', followUpAt: hoje }),
    ]

    expect(dueFollowUps(leads).map((item) => item.name)).toEqual(['Atrasado', 'Hoje'])
  })
})
