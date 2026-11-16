import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPlan } from '../../lib/plans'
import { MENU_TEMPLATES, templateToMenu, type MenuTemplate } from '../../lib/templates'
import { SITE_TEMPLATES, siteTemplateToSite } from '../../lib/siteTemplates'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { onlyDigits } from '../../lib/format'
import { Drawer } from '../../components/Drawer'
import { Icon } from '../../components/Icon'
import { MenuSheet } from '../../components/MenuSheet'
import { PageHead, ProjectCover, SiteCover } from '../ui'

function previewMenu(template: MenuTemplate) {
  return templateToMenu(template, {
    name: template.name,
    neighborhood: 'Sua cidade',
    phone: '41999999999',
    menus: [],
  })
}

function UseTemplateDrawer({
  template,
  onClose,
}: {
  template: MenuTemplate
  onClose: () => void
}) {
  const { addLead, saveMenu, menus, notify } = useStore()
  const plan = usePlan()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  const preview = useMemo(
    () =>
      templateToMenu(template, {
        name: name.trim() || template.name,
        neighborhood: neighborhood.trim() || 'Sua cidade',
        phone: onlyDigits(phone) || '41999999999',
        menus,
      }),
    [template, name, neighborhood, phone, menus],
  )

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!plan.active) {
      setError('Seu acesso expirou. Assine um plano para criar novos projetos.')
      return
    }
    if (plan.atLimit) {
      setError('Limite de projetos do plano atingido. Faça upgrade para criar mais.')
      return
    }
    if (!name.trim()) {
      setError('Informe o nome do restaurante.')
      return
    }
    if (onlyDigits(phone).length < 10) {
      setError('Informe DDD + telefone para o WhatsApp.')
      return
    }
    const lead = addLead({
      name,
      category: template.category,
      neighborhood,
      phone: onlyDigits(phone),
      rating: 0,
      reviews: 0,
      priority: 'media',
      notes: `Criado a partir do template "${template.name}".`,
      hasSite: false,
      hasMenu: false,
    })
    const menu = templateToMenu(template, {
      name,
      neighborhood,
      phone: onlyDigits(phone),
      menus,
    })
    saveMenu(menu, lead.id)
    notify('Cardápio criado a partir do template.')
    onClose()
    navigate(`/app/projetos/${lead.id}`)
  }

  return (
    <Drawer kicker={`Template · ${template.category}`} title={template.name} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="app-tpl-preview">
          <div>
            <div className="form-grid">
              <div className="field span-2">
                <label htmlFor="tpl-name">Restaurante *</label>
                <input
                  id="tpl-name"
                  className="input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: Fx Burgers Grill"
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="tpl-neighborhood">Bairro</label>
                <input
                  id="tpl-neighborhood"
                  className="input"
                  value={neighborhood}
                  onChange={(event) => setNeighborhood(event.target.value)}
                  placeholder="Hauer"
                />
              </div>
              <div className="field">
                <label htmlFor="tpl-phone">WhatsApp *</label>
                <input
                  id="tpl-phone"
                  className="input"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="(41) 99999-9999"
                />
              </div>
            </div>
            {error && (
              <p className="app-note" style={{ color: 'var(--red-dark)', marginTop: 8 }}>
                {error}
              </p>
            )}
            <p className="app-note" style={{ marginTop: 10 }}>
              O lead entra em “A contatar” no CRM e o cardápio abre no editor com os itens do
              template. Troque preços e descrições antes de enviar.
            </p>
            <div className="app-actions-row" style={{ marginTop: 12 }}>
              <button type="submit" className="btn btn--red btn--sm">
                <Icon name="check" size={14} />
                Criar lead e abrir cardápio
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>

          <div className="app-tpl-preview__form">
            <div className="app-section__head">
              <span className="app-section__title">Prévia</span>
              <span className="app-section__aside">Dados ilustrativos</span>
            </div>
            <MenuSheet menu={preview} categories={3} itemsPerCategory={3} />
          </div>
        </div>
      </form>
    </Drawer>
  )
}

export function AppTemplates() {
  const plan = usePlan()
  const { notify } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [planFilter, setPlanFilter] = useState<'todos' | 'starter' | 'pro' | 'agency'>('todos')
  const [preview, setPreview] = useState<MenuTemplate | null>(null)
  const [using, setUsing] = useState<MenuTemplate | null>(null)

  const filtered = MENU_TEMPLATES.filter((template) => {
    if (planFilter !== 'todos' && template.minPlan !== planFilter) return false
    if (!query.trim()) return true
    return `${template.name} ${template.category} ${template.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  })

  function useTemplate(template: MenuTemplate) {
    if (!plan.allows(template.minPlan)) {
      navigate('/app/planos')
      return
    }
    if (!plan.active) {
      notify('Seu acesso expirou. Assine um plano para criar novos projetos.')
      navigate('/app/planos')
      return
    }
    if (plan.atLimit) {
      notify('Limite de projetos do plano atingido. Faça upgrade para criar mais.')
      navigate('/app/planos')
      return
    }
    setPreview(null)
    setUsing(template)
  }

  return (
    <div className="app-page">
      <PageHead
        title="Templates"
        subtitle="Escolha um desenho, troque o nome e os itens. O restaurante entra no CRM e o cardápio abre no editor."
        actions={
          <span className="stamp stamp--ink">6 cardápios + 6 sites</span>
        }
      />

      <div className="app-section__head" style={{ marginTop: 8 }}>
        <h2 className="app-section__title">Templates de cardápio</h2>
        <span className="app-section__aside">{MENU_TEMPLATES.length} modelos</span>
      </div>

      <div className="app-toolbar">
        <div className="app-search">
          <Icon name="search" size={15} />
          <label className="sr-only" htmlFor="template-search">
            Buscar template
          </label>
          <input
            id="template-search"
            className="input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por ramo (hamburgueria, pizzaria...)"
          />
        </div>
        <div className="tools__chips" role="group" aria-label="Filtrar por plano">
          {(['todos', 'starter', 'pro', 'agency'] as const).map((id) => (
            <button
              key={id}
              type="button"
              className="chip"
              aria-pressed={planFilter === id}
              onClick={() => setPlanFilter(id)}
            >
              {id === 'todos' ? 'Todos' : getPlan(id).name}
            </button>
          ))}
        </div>
      </div>

      <div className="app-templates">
        {filtered.map((template) => {
          const allowed = plan.allows(template.minPlan)
          const previewCard = previewMenu(template)
          const required = getPlan(template.minPlan)
          return (
            <article className="app-template" key={template.id}>
              <div className="app-template__cover">
                <ProjectCover menu={previewCard} badge="Template" />
                {!allowed && (
                  <div className="app-template__lock">
                    <Icon name="lock" size={18} />
                    Disponível no {required.name}
                  </div>
                )}
              </div>
              <div className="app-template__info">
                <div className="app-template__cat">
                  {template.category} · {required.name}
                </div>
                <div className="app-template__name">{template.name}</div>
                <p className="app-template__desc">{template.description}</p>
                <div className="app-template__actions">
                  <button
                    type="button"
                    className={`btn ${allowed ? 'btn--red' : 'btn--ghost'} btn--sm`}
                    onClick={() => useTemplate(template)}
                  >
                    {allowed ? (
                      <>
                        <Icon name="plus" size={13} />
                        Usar template
                      </>
                    ) : (
                      <>
                        <Icon name="lock" size={13} />
                        Ver planos
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm app-template__preview"
                    onClick={() => setPreview(template)}
                  >
                    Prévia
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="app-empty">
          <Icon name="search" size={26} />
          <h2>Nenhum template de cardápio com esse filtro</h2>
          <p>Tente outro ramo ou limpe a busca. Os templates de site continuam abaixo.</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setQuery('')
              setPlanFilter('todos')
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}

      <div className="app-section__head" style={{ marginTop: 24 }}>
        <h2 className="app-section__title">Templates de site</h2>
        <Link className="app-card__link" to="/app/novo?type=site">
          Criar site no wizard <Icon name="arrow-right" size={11} />
        </Link>
      </div>
      <p className="app-note" style={{ marginBottom: 12 }}>
        Os sites usam um template por ramo. O wizard escolhe o modelo e cria o lead junto.
      </p>
      <div className="app-templates">
        {SITE_TEMPLATES.map((template) => {
          const previewSite = siteTemplateToSite(template, {
            name: template.name,
            category: template.category,
            neighborhood: 'Sua cidade',
            sites: [],
          })
          return (
            <article className="app-template" key={template.id}>
              <div className="app-template__cover">
                <SiteCover site={previewSite} />
              </div>
              <div className="app-template__info">
                <div className="app-template__cat">{template.category} · one-page</div>
                <div className="app-template__name">{template.name}</div>
                <p className="app-template__desc">{template.description}</p>
                <div className="app-template__actions">
                  <Link className="btn btn--red btn--sm" to="/app/novo?type=site">
                    <Icon name="globe" size={13} />
                    Criar site
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {preview && (
        <Drawer
          kicker={`Template · ${preview.category}`}
          title={preview.name}
          onClose={() => setPreview(null)}
        >
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <MenuSheet menu={previewMenu(preview)} categories={4} itemsPerCategory={4} />
          </div>
          <p className="app-note" style={{ marginTop: 12 }}>
            {preview.description} · {preview.categories.length} categorias · dados ilustrativos.
          </p>
          <div className="app-actions-row" style={{ marginTop: 14 }}>
            <button type="button" className="btn btn--red btn--sm" onClick={() => useTemplate(preview)}>
              <Icon name="plus" size={14} />
              Usar este template
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setPreview(null)}>
              Fechar
            </button>
          </div>
        </Drawer>
      )}

      {using && <UseTemplateDrawer template={using} onClose={() => setUsing(null)} />}
    </div>
  )
}
