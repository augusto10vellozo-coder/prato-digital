import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { brl } from '../lib/format'
import { getPlan } from '../lib/plans'
import type { Menu, PlanId, Site } from '../lib/types'
import { usePlan } from '../lib/usePlan'
import { Icon, type IconName } from '../components/Icon'

export function PageHead({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="app-page__head">
      <div>
        <h1 className="app-page__title">{title}</h1>
        {subtitle && <p className="app-page__sub">{subtitle}</p>}
      </div>
      {actions && <div className="app-page__actions">{actions}</div>}
    </header>
  )
}

export function SectionHead({
  title,
  note,
  action,
}: {
  title: ReactNode
  note?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="app-section__head">
      <h2 className="app-section__title">{title}</h2>
      <div className="app-section__aside">
        {note && <span>{note}</span>}
        {action}
      </div>
    </div>
  )
}

export function EmptyState({
  icon = 'folder',
  title,
  body,
  action,
}: {
  icon?: IconName
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="app-empty">
      <Icon name={icon} size={28} />
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </div>
  )
}

export function PlanTag() {
  const { plan, subscription } = usePlan()
  return (
    <span className="app-plan-badge" title={`Plano ${plan.name}`}>
      {plan.name}
      {subscription.status === 'trial' && <em>teste</em>}
    </span>
  )
}

export function StatStrip({
  items,
  bare = false,
}: {
  items: { label: string; value: ReactNode; foot?: ReactNode; tone?: 'red' | 'blue' | 'yellow' }[]
  bare?: boolean
}) {
  return (
    <div className={`app-metrics ${bare ? 'app-metrics--bare' : ''}`}>
      {items.map((item) => (
        <div className={`app-metric ${item.tone ? `app-metric--${item.tone}` : ''}`} key={item.label}>
          <div className="app-metric__label">{item.label}</div>
          <div className="app-metric__value">{item.value}</div>
          {item.foot && <div className="app-metric__foot">{item.foot}</div>}
        </div>
      ))}
    </div>
  )
}

/** Capa tipográfica do cardápio — sem foto, como o encarte. */
export function ProjectCover({
  menu,
  compact = false,
  badge,
}: {
  menu: Menu
  compact?: boolean
  badge?: string
}) {
  const first = menu.categories.find((category) => category.items.length > 0)
  const items = first?.items.slice(0, compact ? 2 : 3) ?? []
  const totalItems = menu.categories.reduce((sum, category) => sum + category.items.length, 0)
  const isLive = !menu.isDemo && !badge

  return (
    <div
      className={`pcover pcover--${menu.theme} ${compact ? 'pcover--compact' : ''}`}
      style={{ '--accent': menu.accent } as CSSProperties}
      aria-hidden="true"
    >
      <div className="pcover__top">
        <span className={`pcover__badge ${isLive ? 'pcover__badge--live' : ''}`}>
          {badge ?? (menu.isDemo ? 'Prévia' : 'No ar')}
        </span>
        <span>{menu.category}</span>
      </div>
      <div className="pcover__name">{menu.name}</div>
      {menu.tagline && <div className="pcover__tag">{menu.tagline}</div>}
      <ul className="pcover__list">
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <i />
            <b>{brl(item.price)}</b>
          </li>
        ))}
      </ul>
      <div className="pcover__foot">
        <span>{menu.neighborhood || 'Curitiba'}</span>
        <span>{totalItems} itens</span>
      </div>
    </div>
  )
}

export function SiteCover({ site, compact = false }: { site: Site; compact?: boolean }) {
  const services = site.services.filter((service) => service.title).slice(0, compact ? 2 : 3)
  const initial = site.name.trim().charAt(0).toUpperCase() || 'P'

  return (
    <div
      className={`sc sc--${site.theme} ${compact ? 'sc--compact' : ''}`}
      style={{ '--sc-accent': site.accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="sc__mark">{initial}</span>
      <div className="sc__top">
        <span className="sc__badge">Site</span>
        <span>{site.category}</span>
      </div>
      <div className="sc__name">{site.name}</div>
      <div className="sc__tag">{site.tagline}</div>
      <ul className="sc__services">
        {services.map((service) => (
          <li key={service.id}>{service.title}</li>
        ))}
      </ul>
      <div className="sc__foot">
        <span>{site.neighborhood || 'Curitiba'}</span>
        <span>one-page</span>
      </div>
    </div>
  )
}

export function UpgradeGate({
  feature,
  required = 'pro',
  description,
}: {
  feature: string
  required?: PlanId
  description?: string
}) {
  const { plan } = usePlan()
  const target = getPlan(required)

  return (
    <div className="app-gate">
      <span className="stamp stamp--red">Plano {target.name}</span>
      <div className="app-gate__icon">
        <Icon name="lock" size={24} />
      </div>
      <h2>{feature}</h2>
      <p>
        {description ??
          `Esta ferramenta está inclusa no plano ${target.name}. Seu plano atual é ${plan.name}.`}
      </p>
      <Link className="btn btn--red" to="/app/planos">
        Ver planos
        <Icon name="arrow-right" size={16} />
      </Link>
      <span className="app-gate__note">Sem cobrança real nesta demonstração.</span>
    </div>
  )
}
