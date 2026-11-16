import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { todayISO } from '../../lib/format'
import { downloadMenuHtml } from '../../lib/menuExport'
import { downloadSiteHtml } from '../../lib/siteExport'
import { menuShareUrl, siteShareUrl } from '../../lib/share'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import type { Lead, Menu, Site } from '../../lib/types'
import { Icon } from '../../components/Icon'
import { EmptyState, PageHead, ProjectCover, SiteCover } from '../ui'

type ProjectFilter = 'todos' | 'menu' | 'site' | 'no-ar' | 'previa' | 'mes'

type ProjectItem =
  | {
      kind: 'menu'
      id: string
      name: string
      category: string
      updatedAt: string
      isDemo: boolean
      menu: Menu
      lead?: Lead
    }
  | {
      kind: 'site'
      id: string
      name: string
      category: string
      updatedAt: string
      isDemo: boolean
      site: Site
      lead?: Lead
    }

export function AppProjects() {
  const { menus, sites, leads, notify } = useStore()
  const plan = usePlan()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ProjectFilter>('todos')

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      navigate('/app/novo', { replace: true })
    }
  }, [navigate, searchParams])

  const menuProjects: ProjectItem[] = menus.map((menu) => ({
    kind: 'menu',
    id: menu.id,
    name: menu.name,
    category: menu.category,
    updatedAt: menu.updatedAt,
    isDemo: menu.isDemo,
    menu,
    lead: leads.find((lead) => lead.menuId === menu.id),
  }))

  const siteProjects: ProjectItem[] = sites.map((site) => ({
    kind: 'site',
    id: site.id,
    name: site.name,
    category: site.category,
    updatedAt: site.updatedAt,
    isDemo: site.isDemo,
    site,
    lead: leads.find((lead) => lead.siteId === site.id),
  }))

  const projects = [...menuProjects, ...siteProjects].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )

  const month = todayISO().slice(0, 7)
  const live = projects.filter((project) => !project.isDemo).length
  const preview = projects.filter((project) => project.isDemo).length

  const filtered = projects.filter((project) => {
    if (filter === 'menu' && project.kind !== 'menu') return false
    if (filter === 'site' && project.kind !== 'site') return false
    if (filter === 'no-ar' && project.isDemo) return false
    if (filter === 'previa' && !project.isDemo) return false
    if (filter === 'mes' && project.updatedAt.slice(0, 7) !== month) return false
    if (!query.trim()) return true
    return `${project.name} ${project.category}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  })

  function projectMenu(project: Extract<ProjectItem, { kind: 'site' }>) {
    return project.site.menuId
      ? menus.find((menu) => menu.id === project.site.menuId)
      : undefined
  }

  async function copyLink(project: ProjectItem) {
    try {
      const link =
        project.kind === 'menu' ? menuShareUrl(project.menu) : siteShareUrl(project.site)
      await navigator.clipboard.writeText(link)
      notify(`Link do ${project.kind === 'menu' ? 'cardápio' : 'site'} copiado.`)
    } catch {
      notify('Não foi possível copiar o link.')
    }
  }

  async function exportProject(project: ProjectItem) {
    try {
      if (project.kind === 'menu') {
        await downloadMenuHtml(project.menu)
      } else {
        await downloadSiteHtml(project.site, projectMenu(project))
      }
      notify(`HTML do ${project.kind === 'menu' ? 'cardápio' : 'site'} exportado.`)
    } catch {
      notify('Não foi possível exportar o HTML.')
    }
  }

  return (
    <div className="app-page">
      <PageHead
        title="Meus projetos"
        subtitle={`${projects.length} projetos · ${menuProjects.length} cardápios · ${siteProjects.length} sites · plano ${plan.plan.name} (${plan.used} de ${plan.limit ?? '∞'})`}
        actions={
          <>
            <Link className="btn btn--ghost btn--sm" to="/app/templates">
              <Icon name="grid" size={15} />
              Templates
            </Link>
            <Link className="btn btn--red btn--sm" to="/app/novo">
              <Icon name="plus" size={15} />
              Novo projeto
            </Link>
          </>
        }
      />

      <div className="app-plan-strip">
        <div className="app-plan-strip__main">
          <div className="app-plan-strip__label">
            <span>Plano {plan.plan.name}</span>
            <b>
              {plan.used} de {plan.limit ?? '∞'} projetos
            </b>
          </div>
          <div className="app-usage__bar">
            <i
              style={{
                width: `${plan.limit ? Math.min(100, (plan.used / plan.limit) * 100) : 14}%`,
              }}
            />
          </div>
        </div>
        <Link className="app-card__link" to="/app/planos">
          Aumentar limite <Icon name="arrow-right" size={11} />
        </Link>
      </div>

      <div className="app-toolbar">
        <div className="app-search">
          <Icon name="search" size={15} />
          <label className="sr-only" htmlFor="project-search">
            Buscar projeto
          </label>
          <input
            id="project-search"
            className="input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, categoria ou bairro"
          />
        </div>
        <div className="tools__chips" role="group" aria-label="Filtrar projetos">
          <button type="button" className="chip" aria-pressed={filter === 'todos'} onClick={() => setFilter('todos')}>
            Todos ({projects.length})
          </button>
          <button type="button" className="chip" aria-pressed={filter === 'menu'} onClick={() => setFilter('menu')}>
            Cardápios ({menuProjects.length})
          </button>
          <button type="button" className="chip" aria-pressed={filter === 'site'} onClick={() => setFilter('site')}>
            Sites ({siteProjects.length})
          </button>
          <button type="button" className="chip" aria-pressed={filter === 'no-ar'} onClick={() => setFilter('no-ar')}>
            No ar ({live})
          </button>
          <button type="button" className="chip" aria-pressed={filter === 'previa'} onClick={() => setFilter('previa')}>
            Prévia ({preview})
          </button>
          <button type="button" className="chip" aria-pressed={filter === 'mes'} onClick={() => setFilter('mes')}>
            Este mês
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon="folder"
          title="Nenhum projeto ainda"
          body="Escolha um nicho, encontre clientes e crie o primeiro cardápio ou site em poucos minutos."
          action={
            <Link className="btn btn--red" to="/app/novo">
              <Icon name="plus" size={15} />
              Criar projeto
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title="Nenhum projeto com esse filtro"
          body="Limpe a busca ou troque o filtro para ver a carteira inteira."
          action={
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setQuery('')
                setFilter('todos')
              }}
            >
              Limpar filtros
            </button>
          }
        />
      ) : (
        <div className="app-projects">
          {filtered.map((project) => {
            const editorHref =
              project.kind === 'menu'
                ? project.lead
                  ? `/app/projetos/${project.lead.id}`
                  : `/c/${project.menu.slug}`
                : project.lead
                  ? `/app/sites/${project.lead.id}`
                  : `/s/${project.site.slug}`
            const publicHref =
              project.kind === 'menu' ? `/c/${project.menu.slug}` : `/s/${project.site.slug}`
            const total =
              project.kind === 'menu'
                ? project.menu.categories.reduce((sum, category) => sum + category.items.length, 0)
                : project.site.services.length

            return (
              <article className="app-project" key={`${project.kind}-${project.id}`}>
                <div className="app-project__cover">
                  {project.kind === 'menu' ? (
                    <ProjectCover menu={project.menu} />
                  ) : (
                    <SiteCover site={project.site} />
                  )}
                </div>
                <div className="app-project__info">
                  <div style={{ minWidth: 0 }}>
                    <Link className="app-project__name" to={editorHref}>
                      {project.name}
                    </Link>
                    <div className="app-project__meta">
                      <span className="app-project__kind">
                        {project.kind === 'menu' ? 'Cardápio' : 'Site'}
                      </span>
                      {project.category} · {total} {project.kind === 'menu' ? 'itens' : 'serviços'} ·{' '}
                      {project.updatedAt.split('-').reverse().slice(0, 2).join('/')}
                    </div>
                  </div>
                  <div className="app-project__actions">
                    <a
                      className="icon-btn"
                      href={publicHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Abrir ${project.kind === 'menu' ? 'cardápio' : 'site'} de ${project.name}`}
                      title={project.kind === 'menu' ? 'Abrir cardápio' : 'Abrir site'}
                    >
                      <Icon name="external" size={13} />
                    </a>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => copyLink(project)}
                      aria-label={`Copiar link de ${project.name}`}
                      title="Copiar link"
                    >
                      <Icon name="copy" size={13} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => exportProject(project)}
                      aria-label={`Exportar ${project.name}`}
                      title="Exportar HTML"
                    >
                      <Icon name="download" size={13} />
                    </button>
                    {project.lead && (
                      <Link
                        className="icon-btn"
                        to={editorHref}
                        aria-label={`Editar ${project.name}`}
                        title={project.kind === 'menu' ? 'Editar cardápio' : 'Editar site'}
                      >
                        <Icon name="edit" size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
