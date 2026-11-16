import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { brl, formatDate, formatPhone, isMobilePhone } from '../lib/format'
import { decodeMenuFromLocation } from '../lib/share'
import { telLink, waLink } from '../lib/whatsapp'
import { TAG_LABEL } from '../lib/types'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { Icon, WhatsAppIcon } from '../components/Icon'

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function MenuPage() {
  const { slug = '' } = useParams()
  const { menuBySlug } = useStore()
  const sharedMenu = useMemo(() => decodeMenuFromLocation(), [])
  const menu = sharedMenu ?? menuBySlug(slug)
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('')

  useDocumentTitle(menu ? `${menu.name} — Cardápio` : 'Cardápio não encontrado')

  useEffect(() => {
    if (!menu) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.menu-section'))
    if (!sections.length || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCat(entry.target.id.replace('cat-', ''))
          }
        }
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [menu, query])

  const visibleCategories = useMemo(() => {
    if (!menu) return []
    const term = normalize(query.trim())
    return menu.categories
      .map((category) => {
        if (!term) return category
        const catMatches = normalize(category.name).includes(term)
        const items = category.items.filter((item) =>
          normalize(`${item.name} ${item.description} ${item.tags.map((tag) => TAG_LABEL[tag]).join(' ')}`).includes(
            term,
          ),
        )
        return catMatches ? category : { ...category, items }
      })
      .filter((category) => category.items.length > 0)
  }, [menu, query])

  if (!menu) {
    return (
      <div className="menu-page">
        <main className="wrap" id="conteudo" style={{ padding: '70px 0', textAlign: 'center' }}>
          <h1 className="menu-head__name" style={{ fontSize: 52 }}>
            Cardápio não encontrado.
          </h1>
          <p style={{ margin: '14px auto 22px', maxWidth: '42ch', color: 'var(--ink-soft)' }}>
            O link pode ter mudado ou a prévia foi removida. Fale com a gente para receber o
            endereço certo.
          </p>
          <Link className="btn" to="/">
            Voltar ao site
            <Icon name="arrow-left" size={16} />
          </Link>
        </main>
      </div>
    )
  }

  const mobile = isMobilePhone(menu.phone)
  const orderHref = mobile
    ? waLink(menu.phone, `Oi! Vim pelo cardápio online do ${menu.name} e quero fazer um pedido:`)
    : telLink(menu.phone)
  const orderLabel = mobile ? 'Pedir no WhatsApp' : 'Ligar para pedir'
  const orderIcon = mobile ? <WhatsAppIcon size={17} /> : <Icon name="phone" size={17} />

  const totalItems = menu.categories.reduce((sum, category) => sum + category.items.length, 0)

  return (
    <div
      className={`menu-page theme-${menu.theme}`}
      style={{ '--accent': menu.accent } as CSSProperties}
    >
      <div className="menu-topbar">
        <div className="wrap menu-topbar__inner">
          <span>
            Cardápio digital · {totalItems} itens
            {menu.isDemo && <span className="menu-topbar__demo">Prévia demonstrativa</span>}
          </span>
          <span>Atualizado em {formatDate(menu.updatedAt)}</span>
        </div>
      </div>

      <header className="wrap menu-head">
        <div>
          <h1 className="menu-head__name">{menu.name}</h1>
          <p className="menu-head__tag">{menu.tagline}</p>
          <div className="menu-head__meta">
            <span>
              <Icon name="map-pin" size={12} /> {menu.neighborhood}
              {menu.address ? ` · ${menu.address}` : ''}
            </span>
            {menu.hours && (
              <span>
                <Icon name="clock" size={12} /> {menu.hours}
              </span>
            )}
            <span>
              <Icon name="phone" size={12} /> {formatPhone(menu.phone)}
            </span>
            {menu.instagram && (
              <span>
                <Icon name="instagram" size={12} /> {menu.instagram}
              </span>
            )}
          </div>
        </div>

        <aside className="menu-head__aside">
          {menu.note && (
            <div className="menu-head__note">
              <b>Da casa</b>
              {menu.note}
            </div>
          )}
          <div className="menu-head__cta">
            <a className="btn btn--red" href={orderHref} target="_blank" rel="noreferrer">
              {orderIcon}
              {orderLabel}
            </a>
            <button className="btn btn--ghost btn--sm" type="button" onClick={() => window.print()}>
              <Icon name="print" size={15} />
              Imprimir
            </button>
            <small>Pedido direto com o restaurante. Sem taxa.</small>
          </div>
        </aside>
      </header>

      <nav className="menu-nav" aria-label="Categorias do cardápio">
        <div className="wrap menu-nav__inner">
          <div className="menu-nav__cats">
            {visibleCategories.map((category) => (
              <a
                key={category.id}
                href={`#cat-${category.id}`}
                className={activeCat === category.id ? 'is-active' : ''}
                aria-current={activeCat === category.id ? 'location' : undefined}
              >
                {category.name}
              </a>
            ))}
          </div>
          <div className="menu-nav__search">
            <Icon name="search" size={14} />
            <label className="sr-only" htmlFor="menu-search">
              Buscar no cardápio
            </label>
            <input
              id="menu-search"
              type="search"
              placeholder="Buscar no cardápio"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="wrap menu-body" id="conteudo">
        {visibleCategories.length === 0 ? (
          <div className="menu-empty">
            <h2>{query ? `Nada encontrado por “${query}”.` : 'Este cardápio ainda está sendo montado.'}</h2>
            <p>
              {query
                ? 'Tente outro nome de prato ou veja o cardápio inteiro.'
                : 'Volte em instantes ou fale com o restaurante pelo WhatsApp.'}
            </p>
            {query ? (
              <button type="button" onClick={() => setQuery('')}>
                Limpar busca
              </button>
            ) : (
              <a href={orderHref} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>
                Falar com o restaurante
              </a>
            )}
          </div>
        ) : (
          visibleCategories.map((category) => (
            <section className="menu-section" id={`cat-${category.id}`} key={category.id}>
              <div className="menu-section__head">
                <h2 className="menu-section__title">{category.name}</h2>
                <span className="menu-section__count">
                  {category.items.length} {category.items.length === 1 ? 'item' : 'itens'}
                </span>
              </div>
              {category.note && <p className="menu-section__note">{category.note}</p>}
              <ul className="menu-items">
                {category.items.map((item) => (
                  <li className="menu-item" key={item.id}>
                    <div className="menu-item__head">
                      <span className="menu-item__name">{item.name}</span>
                      <i className="menu-item__leader" aria-hidden="true" />
                      <span className="menu-item__price">{brl(item.price)}</span>
                    </div>
                    {item.description && <p className="menu-item__desc">{item.description}</p>}
                    {item.tags.length > 0 && (
                      <div className="menu-item__tags">
                        {item.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            {TAG_LABEL[tag]}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <footer className="menu-foot">
        <div className="wrap menu-foot__inner">
          <div>
            <div className="menu-foot__brand">
              Prato Digital<span>.</span>
            </div>
            <div className="menu-foot__credit">
              {menu.isDemo
                ? 'Prévia de demonstração · itens e preços ilustrativos'
                : 'Cardápio feito com a Prato Digital'}
            </div>
          </div>
          <Link className="menu-foot__cta" to="/?ref=cardapio">
            Quero um cardápio assim
            <Icon name="arrow-up-right" size={13} />
          </Link>
        </div>
      </footer>

      <a className="menu-fab" href={orderHref} target="_blank" rel="noreferrer">
        <span className="menu-fab__info">
          Pedido direto no WhatsApp
          <br />
          {formatPhone(menu.phone)}
        </span>
        <span className="btn btn--red">
          {orderIcon}
          {orderLabel}
        </span>
      </a>
    </div>
  )
}
