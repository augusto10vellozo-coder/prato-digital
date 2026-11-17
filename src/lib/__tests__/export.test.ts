import { describe, expect, it } from 'vitest'
import { buildMenuHtml } from '../menuExport'
import { buildSiteHtml } from '../siteExport'
import type { Menu, Site } from '../types'

function menu(overrides: Partial<Menu> = {}): Menu {
  return {
    id: 'menu-1',
    slug: 'cantina-do-ze',
    name: 'Cantina do Zé',
    tagline: 'Massas da nonna',
    category: 'Italiana',
    neighborhood: 'Centro',
    address: 'Rua das Massas, 10',
    hours: '18h às 23h',
    phone: '41999990000',
    note: 'Aceitamos cartão',
    accent: '#b23a2f',
    theme: 'encarte',
    categories: [
      {
        id: 'massas',
        name: 'Massas',
        note: 'Feitas na casa',
        items: [
          {
            id: 'item-1',
            name: 'Nhoque ao sugo',
            description: 'Molho de tomate fresco',
            price: 24,
            tags: ['novo'],
          },
        ],
      },
    ],
    isDemo: false,
    updatedAt: '2026-11-17',
    ...overrides,
  }
}

function site(overrides: Partial<Site> = {}): Site {
  return {
    id: 'site-1',
    slug: 'cantina-do-ze',
    name: 'Cantina do Zé',
    category: 'Italiana',
    neighborhood: 'Centro',
    address: 'Rua das Massas, 10',
    phone: '41999990000',
    whatsapp: '41999990000',
    hours: '18h às 23h',
    tagline: 'Massas da nonna',
    about: 'Uma cantina de bairro.',
    highlights: ['Massa fresca', 'Ambiente familiar'],
    services: [{ id: 's1', title: 'Almoço executivo', description: 'De segunda a sexta', price: 'R$ 39' }],
    accent: '#b23a2f',
    theme: 'claro',
    isDemo: false,
    updatedAt: '2026-11-17',
    ...overrides,
  }
}

describe('exportação em HTML autônomo', () => {
  it('gera o cardápio com preço, categorias e CTA de WhatsApp', async () => {
    const html = await buildMenuHtml(menu())

    expect(html).toContain('Cantina do Zé')
    expect(html).toContain('Nhoque ao sugo')
    expect(html).toContain('24,00')
    expect(html).toContain('Pedir no WhatsApp')
    expect(html).toContain('id="c-massas"')
    expect(html).toContain('Feitas na casa')
  })

  it('usa ligação quando o telefone é fixo', async () => {
    const html = await buildMenuHtml(menu({ phone: '4133334444' }))
    expect(html).toContain('Ligar para pedir')
  })

  it('escapa HTML vindo do cadastro', async () => {
    const html = await buildMenuHtml(menu({ name: '<script>alert(1)</script>' }))
    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('gera o site com contato, mapa e serviços', async () => {
    const html = await buildSiteHtml(site())

    expect(html).toContain('Cantina do Zé')
    expect(html).toContain('wa.me/5541999990000')
    expect(html).toContain('Ver no mapa')
    expect(html).toContain('Almoço executivo')
    expect(html).toContain('Massa fresca')
  })
})
