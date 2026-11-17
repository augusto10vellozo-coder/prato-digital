import { describe, expect, it } from 'vitest'
import { decodeMenu, decodePayload, encodePayload, menuShareUrl } from '../share'
import type { Menu } from '../types'

const menu: Menu = {
  id: 'menu-1',
  slug: 'cantina-do-ze',
  name: 'Cantina do Zé',
  tagline: 'Massas da nonna',
  category: 'Italiana',
  neighborhood: 'Centro',
  address: 'Rua das Massas, 10',
  hours: '18h às 23h',
  phone: '41999990000',
  accent: '#b23a2f',
  theme: 'encarte',
  categories: [{ id: 'massas', name: 'Massas', items: [] }],
  isDemo: true,
  updatedAt: '2026-11-17',
}

describe('share', () => {
  it('codifica e decodifica payload com acentos', () => {
    const original = { nome: 'Café do Zé', itens: ['Pão', 'Queijo'] }
    const codificado = encodePayload(original)

    expect(codificado).not.toContain('+')
    expect(codificado).not.toContain('/')
    expect(decodePayload<typeof original>(codificado)).toEqual(original)
  })

  it('devolve null para payload inválido', () => {
    expect(decodePayload('nao-e-base64')).toBeNull()
  })

  it('valida o formato mínimo de cardápio', () => {
    expect(decodeMenu(encodePayload(menu))).toEqual(menu)
    expect(decodeMenu(encodePayload({ name: 'Sem categorias' }))).toBeNull()
    expect(decodeMenu('lixo')).toBeNull()
  })

  it('monta a URL de compartilhamento', () => {
    expect(menuShareUrl(menu)).toMatch(/^\/c\/cantina-do-ze\?m=/)
  })
})
