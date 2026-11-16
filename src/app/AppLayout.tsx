import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SITE } from '../config'
import { initials } from '../lib/auth'
import { dueFollowUps } from '../lib/appStats'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { usePlan } from '../lib/usePlan'
import { Icon, type IconName } from '../components/Icon'
import { PlanTag } from './ui'

interface NavItem {
  to: string
  label: string
  icon: IconName
  tag?: string
  end?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const TITLES: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/novo': 'Novo projeto',
  '/app/projetos': 'Meus projetos',
  '/app/crm': 'CRM',
  '/app/templates': 'Templates',
  '/app/planos': 'Plano e créditos',
  '/app/vendas': 'Minhas vendas',
  '/app/precificacao': 'Precificação',
  '/app/contratos': 'Contratos',
  '/app/area-de-membros': 'Área de membros',
  '/app/primeiro-cliente': 'Primeiro cliente',
  '/app/link-na-bio': 'Link na bio',
  '/app/prospeccao': 'Prospecção em massa',
  '/app/afiliados': 'Afiliados',
  '/app/feedback': 'Feedback',
  '/app/conta': 'Conta',
}

const NAV: NavGroup[] = [
  {
    label: 'Início',
    items: [
      { to: '/app', label: 'Dashboard', icon: 'home', end: true },
      { to: '/app/area-de-membros', label: 'Área de membros', icon: 'award' },
      { to: '/app/primeiro-cliente', label: 'Primeiro cliente', icon: 'target' },
    ],
  },
  {
    label: 'Criar e vender',
    items: [
      { to: '/app/projetos', label: 'Meus projetos', icon: 'folder' },
      { to: '/app/templates', label: 'Templates', icon: 'grid' },
      { to: '/app/prospeccao', label: 'Prospecção em massa', icon: 'zap', tag: 'PRO' },
      { to: '/app/crm', label: 'CRM', icon: 'columns' },
      { to: '/app/link-na-bio', label: 'Link na bio', icon: 'link', tag: 'NOVO' },
    ],
  },
  {
    label: 'Fechar negócio',
    items: [
      { to: '/app/vendas', label: 'Minhas vendas', icon: 'wallet' },
      { to: '/app/precificacao', label: 'Precificação', icon: 'tag', tag: 'PRO' },
      { to: '/app/contratos', label: 'Contratos', icon: 'file-text', tag: 'PRO' },
    ],
  },
  {
    label: 'Sua conta',
    items: [
      { to: '/app/planos', label: 'Plano e créditos', icon: 'credit-card' },
      { to: '/app/afiliados', label: 'Afiliados', icon: 'users', tag: 'AG' },
      { to: '/app/feedback', label: 'Feedback', icon: 'message' },
      { to: '/app/conta', label: 'Conta', icon: 'settings' },
    ],
  },
]

export function AppLayout() {
  const { data, leads, session, signOut, setTheme } = useStore()
  const { plan, subscription } = usePlan()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const due = dueFollowUps(leads).length
  const dark = data.settings.theme === 'dark'
  const name = session?.name ?? SITE.owner.name
  const firstName = name.split(' ')[0]
  const userInitials = initials(name)
  const role = session?.company || SITE.owner.role

  useDocumentTitle(`${TITLES[location.pathname] ?? 'Plataforma'} — ${SITE.name}`)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <div className={`app-shell ${open ? 'is-open' : ''}`} data-theme={data.settings.theme}>
      <aside className="app-side">
        <div className="app-side__head">
          <Link className="app-side__brand" to="/app">
            Prato Digital<span>.</span>
          </Link>
          <button
            type="button"
            className="app-side__close"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <Link className="app-side__new" to="/app/novo">
          <Icon name="plus" size={16} />
          Novo projeto
        </Link>

        <nav className="app-side__nav" aria-label="Navegação do aplicativo">
          {NAV.map((group) => (
            <div className="app-side__group" key={group.label}>
              <div className="app-side__label">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `app-side__link ${isActive ? 'is-active' : ''}`
                  }
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                  {item.tag && <em className="app-side__tag">{item.tag}</em>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="app-side__user">
          <Link className="app-side__profile" to="/app/conta">
            <span className="app-avatar app-avatar--sm">{userInitials}</span>
            <span className="app-side__user-main">
              <b>{name}</b>
              <small>{role}</small>
            </span>
            <span className="app-side__user-plan">{plan.name}</span>
          </Link>
          <Link className="app-side__logout" to="/" onClick={signOut}>
            <Icon name="logout" size={15} />
            Sair
          </Link>
        </div>
      </aside>

      <button
        type="button"
        className="app-side__overlay"
        onClick={() => setOpen(false)}
        aria-label="Fechar menu"
        tabIndex={-1}
      />

      <div className="app-main">
        <header className="app-top">
          <div className="app-top__left">
            <button
              type="button"
              className="app-icon-btn app-menu-btn"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Icon name="menu" size={18} />
            </button>
            <Link className="app-top__brand" to="/app">
              Prato Digital<span>.</span>
            </Link>
            <div className="app-top__welcome">
              <span>Bem-vindo, {firstName}</span>
              <PlanTag />
              {session?.isDemo && <span className="app-demo-tag">Demonstração</span>}
            </div>
          </div>
          <div className="app-top__actions">
            <Link
              className="app-icon-btn app-icon-btn--new"
              to="/app/novo"
              aria-label="Novo projeto"
              title="Novo projeto"
            >
              <Icon name="plus" size={17} />
            </Link>
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => setTheme(dark ? 'light' : 'dark')}
              aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title={dark ? 'Tema claro' : 'Tema escuro'}
            >
              <Icon name={dark ? 'sun' : 'moon'} size={17} />
            </button>
            <Link
              className="app-icon-btn app-bell"
              to="/app/crm?view=hoje"
              aria-label={`Follow-ups pendentes: ${due}`}
              title={`${due} follow-ups pendentes`}
            >
              <Icon name="bell" size={17} />
              {due > 0 && <i aria-hidden="true" />}
            </Link>
            <Link className="app-avatar" to="/app/conta" aria-label={`${userInitials} — minha conta`}>
              {userInitials}
            </Link>
          </div>
        </header>

        <main className="app-content" id="conteudo">
          <Outlet />
          <footer className="app-foot">
            <span>
              {SITE.name} · {subscription.status === 'trial' ? 'demonstração PRO' : `plano ${plan.name}`}
            </span>
            <span>Dados salvos neste navegador · pagamentos simulados</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
