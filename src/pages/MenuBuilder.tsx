import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { usePlan } from '../lib/usePlan'
import { slugify, todayISO, uid } from '../lib/format'
import { downloadMenuHtml } from '../lib/menuExport'
import { menuShareUrl } from '../lib/share'
import { TAG_LABEL, type ItemTag, type Lead, type Menu, type MenuCategory, type MenuTheme } from '../lib/types'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { MenuSheet } from '../components/MenuSheet'
import { Icon } from '../components/Icon'

const ACCENTS = ['#c8372d', '#7a2e3b', '#5b3a8c', '#2f5d3a', '#22458c', '#b06a1f']

const TAGS: ItemTag[] = ['mais-pedido', 'vegetariano', 'picante', 'novo', 'sem-gluten']

const THEMES: { value: MenuTheme; label: string; chip: string; fg: string }[] = [
  { value: 'encarte', label: 'Encarte', chip: '#ece4d2', fg: '#1a1611' },
  { value: 'noite', label: 'Noite', chip: '#17130f', fg: '#f3ead7' },
  { value: 'leve', label: 'Leve', chip: '#fcf7ec', fg: '#201a13' },
]

function makeDraft(lead: Lead, existing?: Menu): Menu {
  if (existing) return JSON.parse(JSON.stringify(existing)) as Menu
  return {
    id: uid('menu'),
    slug: slugify(lead.name) || 'cardapio',
    name: lead.name,
    tagline: '',
    category: lead.category,
    neighborhood: lead.neighborhood,
    address: '',
    hours: '',
    phone: lead.phone,
    instagram: '',
    note: '',
    accent: '#c8372d',
    theme: 'encarte',
    isDemo: true,
    updatedAt: todayISO(),
    categories: [
      {
        id: uid('cat'),
        name: 'Destaques',
        items: [
          {
            id: uid('item'),
            name: 'Item de exemplo',
            description: 'Descreva o prato, os ingredientes e o tamanho da porção.',
            price: 0,
            tags: ['mais-pedido'],
          },
        ],
      },
      {
        id: uid('cat'),
        name: 'Bebidas',
        items: [
          {
            id: uid('item'),
            name: 'Bebida de exemplo',
            description: 'Lata, garrafa ou suco natural.',
            price: 0,
            tags: [],
          },
        ],
      },
    ],
  }
}

export function MenuBuilder() {
  const { leadId = '' } = useParams()
  const navigate = useNavigate()
  const { leads, menus, saveMenu, notify } = useStore()
  const plan = usePlan()
  const lead = leads.find((item) => item.id === leadId)
  const existing = lead ? menus.find((menu) => menu.id === lead.menuId) : undefined
  const wasNew = Boolean(lead) && !existing
  const [menu, setMenu] = useState<Menu | null>(() => (lead ? makeDraft(lead, existing) : null))

  useDocumentTitle(lead ? `Cardápio — ${lead.name}` : 'Lead não encontrado')

  if (!lead || !menu) {
    return (
      <div className="panel">
        <div className="wrap" style={{ padding: '70px 0', textAlign: 'center' }}>
          <span className="stamp stamp--red">Lead não encontrado</span>
          <h1 className="panel-title" style={{ marginTop: 14 }}>
            Essa mesa não existe.
          </h1>
          <p className="panel-sub" style={{ marginBottom: 20 }}>
            O lead pode ter sido removido ou o link está errado.
          </p>
          <Link className="btn" to="/app/projetos">
            <Icon name="arrow-left" size={16} />
            Voltar aos projetos
          </Link>
        </div>
      </div>
    )
  }

  function patch<K extends keyof Menu>(key: K, value: Menu[K]) {
    setMenu((previous) => (previous ? { ...previous, [key]: value } : previous))
  }

  function updateCategory(categoryId: string, updater: (category: MenuCategory) => MenuCategory) {
    setMenu((previous) =>
      previous
        ? {
            ...previous,
            categories: previous.categories.map((category) =>
              category.id === categoryId ? updater(category) : category,
            ),
          }
        : previous,
    )
  }

  function addCategory() {
    setMenu((previous) =>
      previous
        ? {
            ...previous,
            categories: [
              ...previous.categories,
              { id: uid('cat'), name: 'Nova categoria', items: [] },
            ],
          }
        : previous,
    )
  }

  function removeCategory(categoryId: string) {
    setMenu((previous) =>
      previous
        ? {
            ...previous,
            categories: previous.categories.filter((category) => category.id !== categoryId),
          }
        : previous,
    )
  }

  function moveCategory(index: number, direction: -1 | 1) {
    setMenu((previous) => {
      if (!previous) return previous
      const target = index + direction
      if (target < 0 || target >= previous.categories.length) return previous
      const categories = [...previous.categories]
      const [item] = categories.splice(index, 1)
      categories.splice(target, 0, item)
      return { ...previous, categories }
    })
  }

  function addItem(categoryId: string) {
    updateCategory(categoryId, (category) => ({
      ...category,
      items: [
        ...category.items,
        { id: uid('item'), name: '', description: '', price: 0, tags: [] },
      ],
    }))
  }

  function updateItem(
    categoryId: string,
    itemId: string,
    patchItem: Partial<MenuCategory['items'][number]>,
  ) {
    updateCategory(categoryId, (category) => ({
      ...category,
      items: category.items.map((item) =>
        item.id === itemId ? { ...item, ...patchItem } : item,
      ),
    }))
  }

  function removeItem(categoryId: string, itemId: string) {
    updateCategory(categoryId, (category) => ({
      ...category,
      items: category.items.filter((item) => item.id !== itemId),
    }))
  }

  function moveItem(categoryId: string, index: number, direction: -1 | 1) {
    updateCategory(categoryId, (category) => {
      const target = index + direction
      if (target < 0 || target >= category.items.length) return category
      const items = [...category.items]
      const [item] = items.splice(index, 1)
      items.splice(target, 0, item)
      return { ...category, items }
    })
  }

  function toggleTag(categoryId: string, itemId: string, tag: ItemTag) {
    updateCategory(categoryId, (category) => ({
      ...category,
      items: category.items.map((item) => {
        if (item.id !== itemId) return item
        const has = item.tags.includes(tag)
        return { ...item, tags: has ? item.tags.filter((value) => value !== tag) : [...item.tags, tag] }
      }),
    }))
  }

  function uniqueSlug(current: Menu): string {
    const base = current.slug || slugify(current.name) || 'cardapio'
    const taken = new Set(menus.filter((item) => item.id !== current.id).map((item) => item.slug))
    if (!taken.has(base)) return base
    let index = 2
    while (taken.has(`${base}-${index}`)) index += 1
    return `${base}-${index}`
  }

  function save(openAfter: boolean): Menu | null {
    if (!menu || !lead) return null
    if (!existing && (!plan.active || plan.atLimit)) {
      notify(
        plan.active
          ? 'Limite de cardápios do plano atingido. Faça upgrade para criar mais.'
          : 'Seu acesso expirou. Assine um plano para criar novos cardápios.',
      )
      navigate('/app/planos')
      return null
    }
    if (!menu.name.trim()) {
      notify('Dê um nome ao cardápio antes de salvar.')
      return null
    }
    const cleaned: Menu = {
      ...menu,
      name: menu.name.trim(),
      slug: uniqueSlug(menu),
      categories: menu.categories.map((category) => ({
        ...category,
        name: category.name.trim() || 'Sem nome',
        items: category.items
          .filter((item) => item.name.trim())
          .map((item) => ({ ...item, name: item.name.trim() })),
      })),
    }
    saveMenu(cleaned, lead.id)
    setMenu(cleaned)
    if (openAfter) navigate(`/c/${cleaned.slug}`)
    return cleaned
  }

  async function exportHtml() {
    const saved = save(false)
    if (!saved) return
    try {
      await downloadMenuHtml(saved)
      notify('HTML autônomo exportado. Envie o arquivo ao restaurante.')
    } catch {
      notify('Não foi possível gerar o HTML. Tente novamente.')
    }
  }

  async function copyLink() {
    const saved = save(false)
    if (!saved) return
    const link = menuShareUrl(saved)
    try {
      await navigator.clipboard.writeText(link)
      notify('Link copiado. Ele abre o cardápio em qualquer navegador.')
    } catch {
      notify(link)
    }
  }

  return (
    <div className="panel">
      <div className="builder-top">
        <div className="wrap builder-top__inner">
          <Link className="icon-btn" to="/app/projetos" aria-label="Voltar aos projetos">
            <Icon name="arrow-left" size={15} />
          </Link>
          <div className="builder-top__title">
            <b>{menu.name || 'Novo cardápio'}</b>
            <span>Editor de cardápio · /c/{menu.slug}</span>
          </div>
          <div className="builder-top__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={copyLink}>
              <Icon name="copy" size={14} />
              <span>Copiar link</span>
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={exportHtml}>
              <Icon name="download" size={14} />
              <span>HTML</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                const saved = save(false)
                if (saved) navigate(`/c/${saved.slug}`)
              }}
            >
              <Icon name="eye" size={14} />
              <span>Ver</span>
            </button>
            <button type="button" className="btn btn--red btn--sm" onClick={() => save(false)}>
              <Icon name="check" size={14} />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </div>

      <main className="wrap" id="conteudo">
        <div className="builder-grid">
          <div>
            <div className="builder-panel">
              <div className="builder-panel__head">
                <h2>Identidade da casa</h2>
                <span>{lead.name}</span>
              </div>
              <div className="builder-panel__body">
                <div className="form-grid">
                  <div className="field span-2">
                    <label htmlFor="menu-name">Nome do restaurante</label>
                    <input
                      id="menu-name"
                      className="input"
                      value={menu.name}
                      onChange={(event) => patch('name', event.target.value)}
                    />
                  </div>
                  <div className="field span-2">
                    <label htmlFor="menu-tagline">Frase da casa</label>
                    <input
                      id="menu-tagline"
                      className="input"
                      value={menu.tagline}
                      onChange={(event) => patch('tagline', event.target.value)}
                      placeholder="Ex.: Smash burgers na chapa, sem frescura."
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="menu-category">Categoria</label>
                    <input
                      id="menu-category"
                      className="input"
                      value={menu.category}
                      onChange={(event) => patch('category', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="menu-neighborhood">Bairro</label>
                    <input
                      id="menu-neighborhood"
                      className="input"
                      value={menu.neighborhood}
                      onChange={(event) => patch('neighborhood', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="menu-phone">WhatsApp de pedidos</label>
                    <input
                      id="menu-phone"
                      className="input"
                      inputMode="tel"
                      value={menu.phone}
                      onChange={(event) => patch('phone', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="menu-hours">Horário</label>
                    <input
                      id="menu-hours"
                      className="input"
                      value={menu.hours}
                      onChange={(event) => patch('hours', event.target.value)}
                      placeholder="Ter a dom, 18h às 23h"
                    />
                  </div>
                  <div className="field span-2">
                    <label htmlFor="menu-address">Endereço</label>
                    <input
                      id="menu-address"
                      className="input"
                      value={menu.address}
                      onChange={(event) => patch('address', event.target.value)}
                      placeholder="R. Exemplo, 123 — Bairro, Curitiba"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="menu-instagram">Instagram</label>
                    <input
                      id="menu-instagram"
                      className="input"
                      value={menu.instagram ?? ''}
                      onChange={(event) => patch('instagram', event.target.value)}
                      placeholder="@restaurante"
                    />
                  </div>
                  <div className="field span-2">
                    <label htmlFor="menu-note-long">Nota da casa (opcional)</label>
                    <textarea
                      id="menu-note-long"
                      className="textarea"
                      value={menu.note ?? ''}
                      onChange={(event) => patch('note', event.target.value)}
                      placeholder="Pedidos pelo WhatsApp. Retirada no balcão e entrega em até 5 km."
                    />
                  </div>
                </div>

                <div className="field">
                  <span className="field-label">Cor da casa</span>
                  <div className="color-row">
                    <input
                      type="color"
                      className="color-input"
                      value={menu.accent}
                      onChange={(event) => patch('accent', event.target.value)}
                      aria-label="Cor de destaque do cardápio"
                    />
                    <div className="swatches">
                      {ACCENTS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className="swatch"
                          style={{ background: color }}
                          onClick={() => patch('accent', color)}
                          aria-label={`Usar a cor ${color}`}
                          aria-pressed={menu.accent === color}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="field">
                  <span className="field-label">Tema do cardápio</span>
                  <div className="theme-options">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        className="theme-option"
                        aria-pressed={menu.theme === theme.value}
                        onClick={() => patch('theme', theme.value)}
                      >
                        <span
                          className="theme-option__chip"
                          style={{ background: theme.chip, color: theme.fg }}
                        />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="builder-panel">
              <div className="builder-panel__head">
                <h2>Categorias e itens</h2>
                <button type="button" className="btn btn--ghost btn--sm" onClick={addCategory}>
                  <Icon name="plus" size={13} />
                  Categoria
                </button>
              </div>
              <div className="builder-panel__body">
                {wasNew && (
                  <p className="builder-hint">
                    Os dois itens de exemplo são só para mostrar a estrutura. Troque pelos itens
                    reais do restaurante antes de enviar.
                  </p>
                )}

                {menu.categories.map((category, categoryIndex) => (
                  <div className="cat-block" key={category.id}>
                    <div className="cat-block__head">
                      <input
                        className="input"
                        value={category.name}
                        onChange={(event) =>
                          updateCategory(category.id, (current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        aria-label="Nome da categoria"
                      />
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Mover categoria para cima"
                        onClick={() => moveCategory(categoryIndex, -1)}
                        disabled={categoryIndex === 0}
                      >
                        <Icon name="chevron-up" size={12} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Mover categoria para baixo"
                        onClick={() => moveCategory(categoryIndex, 1)}
                        disabled={categoryIndex === menu.categories.length - 1}
                      >
                        <Icon name="chevron-down" size={12} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--danger"
                        aria-label={`Remover categoria ${category.name}`}
                        onClick={() => removeCategory(category.id)}
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>

                    <div className="cat-block__body">
                      <input
                        className="input"
                        value={category.note ?? ''}
                        onChange={(event) =>
                          updateCategory(category.id, (current) => ({
                            ...current,
                            note: event.target.value,
                          }))
                        }
                        placeholder="Nota da categoria (opcional)"
                        aria-label={`Nota da categoria ${category.name}`}
                      />

                      {category.items.map((item, itemIndex) => (
                        <div className="item-row" key={item.id}>
                          <div className="item-row__grid">
                            <input
                              className="input"
                              value={item.name}
                              onChange={(event) =>
                                updateItem(category.id, item.id, { name: event.target.value })
                              }
                              placeholder="Nome do item"
                              aria-label="Nome do item"
                            />
                            <input
                              className="input"
                              type="number"
                              min={0}
                              step={0.01}
                              value={item.price === 0 ? '' : item.price}
                              onChange={(event) =>
                                updateItem(category.id, item.id, {
                                  price: Number(event.target.value) || 0,
                                })
                              }
                              placeholder="0,00"
                              aria-label="Preço do item"
                            />
                          </div>
                          <textarea
                            className="textarea"
                            value={item.description}
                            onChange={(event) =>
                              updateItem(category.id, item.id, { description: event.target.value })
                            }
                            placeholder="Descrição curta: o que vai no prato, tamanho da porção..."
                            aria-label="Descrição do item"
                          />
                          <div className="item-row__foot">
                            <div className="item-row__tags">
                              {TAGS.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  className="tag-toggle"
                                  aria-pressed={item.tags.includes(tag)}
                                  onClick={() => toggleTag(category.id, item.id, tag)}
                                >
                                  {TAG_LABEL[tag]}
                                </button>
                              ))}
                            </div>
                            <div className="item-row__ops">
                              <button
                                type="button"
                                className="icon-btn"
                                aria-label="Mover item para cima"
                                onClick={() => moveItem(category.id, itemIndex, -1)}
                                disabled={itemIndex === 0}
                              >
                                <Icon name="chevron-up" size={11} />
                              </button>
                              <button
                                type="button"
                                className="icon-btn"
                                aria-label="Mover item para baixo"
                                onClick={() => moveItem(category.id, itemIndex, 1)}
                                disabled={itemIndex === category.items.length - 1}
                              >
                                <Icon name="chevron-down" size={11} />
                              </button>
                              <button
                                type="button"
                                className="icon-btn icon-btn--danger"
                                aria-label="Remover item"
                                onClick={() => removeItem(category.id, item.id)}
                              >
                                <Icon name="trash" size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="add-row"
                        onClick={() => addItem(category.id)}
                      >
                        <Icon name="plus" size={11} /> Adicionar item em {category.name}
                      </button>
                    </div>
                  </div>
                ))}

                <button type="button" className="add-row" onClick={addCategory}>
                  <Icon name="plus" size={12} /> Adicionar categoria
                </button>
                <p className="builder-hint">
                  Itens sem nome são ignorados ao salvar. Para mudar só o preço depois, edite e
                  salve — o link continua o mesmo.
                </p>
              </div>
            </div>
          </div>

          <aside className="builder-preview">
            <div className="builder-preview__head">
              <span>Prévia ao vivo</span>
              <span>{menu.theme} · {menu.accent}</span>
            </div>
            <MenuSheet menu={menu} categories={3} itemsPerCategory={4} />
            <p className="builder-hint" style={{ marginTop: 10 }}>
              Prévia reduzida. O cardápio completo mostra todas as categorias, busca e botão de
              pedido no WhatsApp. “Copiar link” gera uma prévia que abre em qualquer navegador,
              com os dados deste cardápio na URL.
            </p>
            <div className="builder-preview__head" style={{ marginTop: 16 }}>
              <span>Publicar</span>
              <span>{menu.isDemo ? 'prévia demonstrativa' : 'cardápio do cliente'}</span>
            </div>
            <div className="drawer__actions">
              <button type="button" className="btn btn--red btn--sm" onClick={() => save(true)}>
                <Icon name="eye" size={14} />
                Salvar e abrir
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={copyLink}>
                <Icon name="copy" size={14} />
                Copiar link
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={exportHtml}>
                <Icon name="download" size={14} />
                Exportar HTML
              </button>
            </div>
            <label className="check" style={{ marginTop: 12 }}>
              <input
                type="checkbox"
                checked={menu.isDemo}
                onChange={(event) => patch('isDemo', event.target.checked)}
              />
              Marcar como prévia demonstrativa
            </label>
            <p className="builder-hint">
              Enquanto estiver marcada, o cardápio exibe o aviso de que os dados são ilustrativos.
              Desmarque antes de entregar ao cliente final.
            </p>
          </aside>
        </div>
      </main>
    </div>
  )
}
