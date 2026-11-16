import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchDemoBusinesses, type DemoBusiness } from '../../lib/demoBusinesses'
import { CITY_COUNT, DEFAULT_CITY, STATE_COUNT, type City } from '../../lib/brazilCities'
import { getMenuTemplate, templateToMenu } from '../../lib/templates'
import { getSiteTemplate, siteTemplateToSite } from '../../lib/siteTemplates'
import { getNiche, nicheSearchLink, nichesForType, NICHES, type Niche } from '../../lib/niches'
import { planLimitLabel } from '../../lib/plans'
import { formatPhone, onlyDigits, phoneType } from '../../lib/format'
import { parseLeadLines } from '../../lib/importLeads'
import { useStore, type NewLeadInput, type NewProjectInput } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import type { Menu, Site } from '../../lib/types'
import { Icon } from '../../components/Icon'
import { CityMap } from '../../components/CityMap'
import { CityPicker } from '../../components/CityPicker'
import { PageHead } from '../ui'

type ProjectType = 'menu' | 'site' | 'both'
type Step = 1 | 2 | 3
type FinderMode = 'auto' | 'manual'
type GroupFilter = 'todos' | Niche['group']
type ResultFilter = 'todos' | 'sem-site' | 'nota'

const GROUP_LABEL: Record<GroupFilter, string> = {
  todos: 'Todos',
  food: 'Restaurantes',
  servicos: 'Serviços',
  saude: 'Saúde',
  beleza: 'Beleza',
  local: 'Outros',
}

const TYPE_LABEL: Record<ProjectType, string> = {
  menu: 'cardápio',
  site: 'site',
  both: 'cardápio + site',
}

function projectCost(type: ProjectType, count: number): number {
  return count * (type === 'both' ? 2 : 1)
}

export function AppNewProject() {
  useDocumentTitle('Novo projeto — Prato Digital')
  const { menus, sites, addLeads, addProjects, notify } = useStore()
  const plan = usePlan()
  const [searchParams] = useSearchParams()

  const initialType = searchParams.get('type') as ProjectType | null
  const initialNiche = searchParams.get('niche')
  const [step, setStep] = useState<Step>(
    initialType && initialNiche ? 3 : initialType ? 2 : 1,
  )
  const [type, setType] = useState<ProjectType | null>(
    initialType === 'menu' || initialType === 'site' || initialType === 'both' ? initialType : null,
  )
  const [nicheId, setNicheId] = useState<string | null>(initialNiche)
  const [nicheQuery, setNicheQuery] = useState('')
  const [group, setGroup] = useState<GroupFilter>('todos')
  const [mode, setMode] = useState<FinderMode>('auto')
  const [city, setCity] = useState<City>(DEFAULT_CITY)
  const [quantity, setQuantity] = useState(10)
  const [results, setResults] = useState<DemoBusiness[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [hasSearched, setHasSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const [resultFilter, setResultFilter] = useState<ResultFilter>('todos')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const searchToken = useRef(0)
  const [manualText, setManualText] = useState('')
  const [created, setCreated] = useState<{ leads: number; menus: number; sites: number } | null>(null)

  const niche = nicheId ? getNiche(nicheId) : null
  const availableNiches = useMemo(
    () =>
      (type ? nichesForType(type) : NICHES).filter((item) => {
        if (group !== 'todos' && item.group !== group) return false
        if (!nicheQuery.trim()) return true
        return `${item.label} ${item.keywords.join(' ')}`
          .toLowerCase()
          .includes(nicheQuery.trim().toLowerCase())
      }),
    [type, group, nicheQuery],
  )

  const selectedBusinesses = results.filter((business) => selected.has(business.id))
  const visibleResults = results.filter((business) => {
    if (resultFilter === 'sem-site') return !business.hasSite
    if (resultFilter === 'nota') return business.rating >= 4.5
    return true
  })
  const requiredProjects = projectCost(type ?? 'menu', selectedBusinesses.length)
  const remaining = Number.isFinite(plan.remaining) ? plan.remaining : 9999
  const overLimit = requiredProjects > remaining
  const parsedManual = parseLeadLines(manualText)
  const manualCost = projectCost(type ?? 'menu', parsedManual.length)
  const manualOverLimit = manualCost > remaining

  function chooseType(next: ProjectType) {
    setType(next)
    setNicheId(null)
    setGroup('todos')
    setStep(2)
    setResults([])
    setSelected(new Set())
    setHasSearched(false)
  }

  function resetResults() {
    searchToken.current += 1
    setSearching(false)
    setResults([])
    setSelected(new Set())
    setHasSearched(false)
    setResultFilter('todos')
    setHoveredId(null)
  }

  function chooseNiche(next: Niche) {
    setNicheId(next.id)
    setStep(3)
    setResults([])
    setSelected(new Set())
    setHasSearched(false)
  }

  function runSearch() {
    if (!niche) return
    const token = searchToken.current + 1
    searchToken.current = token
    setSearching(true)
    setHasSearched(false)
    setResultFilter('todos')
    setHoveredId(null)
    window.setTimeout(() => {
      if (searchToken.current !== token) return
      const found = searchDemoBusinesses(niche.id, city, quantity)
      setResults(found)
      setSelected(new Set())
      setHasSearched(true)
      setSearching(false)
    }, 450)
  }

  function toggleBusiness(id: string) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    const allVisibleSelected =
      visibleResults.length > 0 && visibleResults.every((business) => selected.has(business.id))
    if (allVisibleSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(visibleResults.map((business) => business.id)))
    }
  }

  function changeFilter(next: ResultFilter) {
    setResultFilter(next)
    setSelected(new Set())
  }

  function leadFromBusiness(business: DemoBusiness): NewLeadInput {
    return {
      name: business.name,
      category: business.category,
      neighborhood: business.neighborhood,
      phone: onlyDigits(business.phone),
      rating: business.rating,
      reviews: business.reviews,
      priority: 'media',
      notes: `Encontrado na busca demonstrativa por ${business.category.toLowerCase()} em ${city.name} - ${city.state}.`,
      hasSite: business.hasSite,
      hasMenu: business.hasMenu,
      isDemo: true,
    }
  }

  function buildProjectsFromBusinesses(
    businesses: { name: string; category: string; neighborhood: string; phone: string; address: string; rating: number; reviews: number; hasSite: boolean; hasMenu: boolean }[],
    currentType: ProjectType,
    currentNiche: Niche,
  ): NewProjectInput[] {
    const generatedMenus: Menu[] = []
    const generatedSites: Site[] = []
    const inputs: NewProjectInput[] = []

    for (const business of businesses) {
      const lead: NewLeadInput = {
        name: business.name,
        category: currentNiche.label,
        neighborhood: business.neighborhood,
        phone: onlyDigits(business.phone),
        rating: business.rating,
        reviews: business.reviews,
        priority: 'media',
        notes: `Encontrado na busca demonstrativa por ${currentNiche.label.toLowerCase()} em ${city.name} - ${city.state}.`,
        hasSite: business.hasSite,
        hasMenu: business.hasMenu,
        isDemo: true,
      }

      let menu: Menu | undefined
      let site: Site | undefined

      if (currentType === 'menu' || currentType === 'both') {
        const template = getMenuTemplate(currentNiche.menuTemplateId)
        menu = templateToMenu(template, {
          name: business.name,
          neighborhood: business.neighborhood,
          phone: onlyDigits(business.phone),
          menus: [...menus, ...generatedMenus],
        })
        generatedMenus.push(menu)
      }

      if (currentType === 'site' || currentType === 'both') {
        const template = getSiteTemplate(currentNiche.siteTemplateId)
        site = siteTemplateToSite(template, {
          name: business.name,
          category: currentNiche.label,
          neighborhood: business.neighborhood,
          address: business.address,
          phone: onlyDigits(business.phone),
          whatsapp: onlyDigits(business.phone),
          sites: [...sites, ...generatedSites],
          menuId: menu?.id,
        })
        generatedSites.push(site)
      }

      inputs.push({ lead, menu, site })
    }

    return inputs
  }

  function guardPlan(cost: number): boolean {
    if (!plan.active) {
      notify('Seu acesso expirou. Assine um plano para criar novos projetos.')
      return false
    }
    if (cost > remaining) {
      notify(
        `Seu plano permite mais ${remaining} projeto(s). Faça upgrade para criar ${cost}.`,
      )
      return false
    }
    return true
  }

  function createFromSelection() {
    if (!niche || selectedBusinesses.length === 0) return
    if (!guardPlan(requiredProjects)) return
    const inputs = buildProjectsFromBusinesses(selectedBusinesses, type ?? 'menu', niche)
    addProjects(inputs)
    const menuCount = inputs.filter((input) => input.menu).length
    const siteCount = inputs.filter((input) => input.site).length
    setCreated({ leads: inputs.length, menus: menuCount, sites: siteCount })
  }

  function addSelectionToCrm() {
    if (!niche || selectedBusinesses.length === 0) return
    const leads = selectedBusinesses.map(leadFromBusiness)
    addLeads(leads)
    setCreated({ leads: leads.length, menus: 0, sites: 0 })
  }

  function createFromManual() {
    if (!niche || parsedManual.length === 0) return
    if (!guardPlan(manualCost)) return
    const businesses = parsedManual.map((line) => ({
      name: line.name,
      category: niche.label,
      neighborhood: line.neighborhood,
      phone: line.phone,
      address: line.neighborhood,
      rating: 0,
      reviews: 0,
      hasSite: false,
      hasMenu: false,
    }))
    const inputs = buildProjectsFromBusinesses(businesses, type ?? 'menu', niche)
    addProjects(inputs)
    const menuCount = inputs.filter((input) => input.menu).length
    const siteCount = inputs.filter((input) => input.site).length
    setCreated({ leads: inputs.length, menus: menuCount, sites: siteCount })
  }

  function resetFlow() {
    setCreated(null)
    setSelected(new Set())
    setResults([])
    setHasSearched(false)
    setManualText('')
    setStep(1)
    setType(null)
    setNicheId(null)
  }

  if (created) {
    return (
      <div className="app-page">
        <PageHead title="Novo projeto" subtitle="Projetos criados a partir da busca por nicho." />
        <div className="nw-success">
          <div className="nw-success__icon">
            <Icon name="check-circle" size={30} />
          </div>
          <h2>Projetos criados.</h2>
          <p>
            {created.leads} lead(s) entraram no CRM
            {created.menus > 0 ? ` · ${created.menus} cardápio(s)` : ''}
            {created.sites > 0 ? ` · ${created.sites} site(s)` : ''}.
          </p>
          <div className="app-actions-row" style={{ justifyContent: 'center' }}>
            <Link className="btn btn--red" to="/app/projetos">
              Ver projetos
              <Icon name="arrow-right" size={15} />
            </Link>
            <Link className="btn btn--ghost" to="/app/crm">
              Abrir CRM
            </Link>
            <button type="button" className="btn btn--ghost" onClick={resetFlow}>
              Criar outro
            </button>
          </div>
          <p className="app-note" style={{ marginTop: 12 }}>
            Os dados da busca são ilustrativos. Edite os itens, preços e contatos antes de enviar
            ao cliente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page">
      <PageHead
        title="Novo projeto"
        subtitle="Escolha o tipo, o nicho e encontre clientes antes de gerar o cardápio ou o site."
        actions={
          <Link className="btn btn--ghost btn--sm" to="/app/projetos">
            <Icon name="arrow-left" size={15} />
            Meus projetos
          </Link>
        }
      />

      <div className="nw-steps" aria-label="Etapas do novo projeto">
        {[
          ['Tipo', 1],
          ['Nicho', 2],
          ['Clientes', 3],
        ].map(([label, value]) => {
          const number = Number(value)
          const state = step === number ? 'current' : step > number ? 'done' : 'todo'
          return (
            <div className={`nw-step nw-step--${state}`} key={label}>
              <span className="nw-step__no">{state === 'done' ? <Icon name="check" size={12} /> : number}</span>
              <span>{label}</span>
            </div>
          )
        })}
      </div>

      {step === 1 && (
        <section>
          <div className="nw-hero">
            <h2>O que vamos criar hoje?</h2>
            <p>
              O caminho seguinte é o mesmo: nicho, clientes, geração. A diferença é o que você
              entrega no fim.
            </p>
          </div>

          <div className="nw-types">
            {[
              {
                id: 'menu' as ProjectType,
                icon: 'file-text' as const,
                title: 'Cardápio',
                badge: 'Para food',
                desc: 'A página de cardápio do restaurante, com itens, preços e pedido no WhatsApp.',
                features: ['Prévia navegável', 'Link compartilhável', 'Export HTML'],
              },
              {
                id: 'both' as ProjectType,
                icon: 'layers' as const,
                title: 'Cardápio + Site',
                badge: 'Recomendado',
                desc: 'O pacote completo: site one-page com a marca da casa e cardápio no mesmo lugar.',
                features: ['Site + cardápio', 'Duas páginas', 'Mais valor por cliente'],
              },
              {
                id: 'site' as ProjectType,
                icon: 'globe' as const,
                title: 'Site',
                badge: 'Qualquer negócio',
                desc: 'Uma página profissional para serviços, saúde, beleza e comércio local.',
                features: ['6 templates', 'WhatsApp e mapa', 'Export HTML'],
              },
            ].map((item) => (
              <article
                className={`nw-type ${item.id === 'both' ? 'nw-type--featured' : ''}`}
                key={item.id}
              >
                <div className="nw-type__top">
                  <span className="nw-type__icon">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <span className="nw-type__badge">{item.badge}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>
                      <Icon name="check" size={12} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`btn ${item.id === 'both' ? 'btn--paper' : 'btn--red'} btn--block`}
                  onClick={() => chooseType(item.id)}
                >
                  Continuar
                  <Icon name="arrow-right" size={15} />
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {step === 2 && type && (
        <section>
          <div className="nw-hero">
            <button type="button" className="nw-back" onClick={() => setStep(1)}>
              <Icon name="arrow-left" size={13} /> Trocar o tipo
            </button>
            <h2>Qual o ramo do negócio?</h2>
            <p>
              O nicho define o vocabulário, o template e a busca. {type === 'site'
                ? 'Todos os ramos têm site.'
                : 'Cardápios são para food; escolha um ramo de restaurante.'}
            </p>
          </div>

          <div className="nw-niche-toolbar">
            <div className="app-search">
              <Icon name="search" size={15} />
              <label className="sr-only" htmlFor="niche-search">
                Buscar nicho
              </label>
              <input
                id="niche-search"
                className="input"
                type="search"
                value={nicheQuery}
                onChange={(event) => setNicheQuery(event.target.value)}
                placeholder="Buscar ramo (pizzaria, academia, pet...)"
              />
            </div>
            <span className="app-note">{availableNiches.length} nichos</span>
          </div>

          <div className="tools__chips" role="group" aria-label="Filtrar nichos">
            {(['todos', ...new Set((type ? nichesForType(type) : NICHES).map((item) => item.group))] as GroupFilter[]).map(
              (id) => (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  aria-pressed={group === id}
                  onClick={() => setGroup(id)}
                >
                  {GROUP_LABEL[id]}
                </button>
              ),
            )}
          </div>

          <div className="nw-niches">
            {availableNiches.map((item) => (
              <button
                type="button"
                className="nw-niche"
                key={item.id}
                onClick={() => chooseNiche(item)}
              >
                <span className="nw-niche__icon">
                  <Icon name={item.icon} size={18} />
                </span>
                <span className="nw-niche__label">{item.label}</span>
                {item.recommended && <span className="nw-niche__rec">Recomendado</span>}
              </button>
            ))}
          </div>

          {availableNiches.length === 0 && (
            <div className="app-empty" style={{ marginTop: 14 }}>
              <Icon name="search" size={24} />
              <h2>Nenhum nicho com esse filtro</h2>
              <p>Tente outro termo ou volte para todos os ramos.</p>
            </div>
          )}
        </section>
      )}

      {step === 3 && type && niche && (
        <section>
          <div className="nw-hero">
            <button type="button" className="nw-back" onClick={() => setStep(2)}>
              <Icon name="arrow-left" size={13} /> Trocar o nicho
            </button>
            <div className="nw-context">
              <span className="stamp stamp--red">{TYPE_LABEL[type]}</span>
              <span className="stamp stamp--ink">{niche.label}</span>
            </div>
            <h2>Encontre clientes.</h2>
            <p>
              Cobertura nacional: escolha a cidade entre as principais de todas as regiões e veja
              negócios do nicho. A busca é uma demonstração; o botão do Google Maps abre a busca
              real.
            </p>
          </div>

          <div className="nw-tabs" role="tablist" aria-label="Modo de busca">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'auto'}
              className="nw-tab"
              onClick={() => setMode('auto')}
            >
              <Icon name="sparkles" size={14} /> Busca automática
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'manual'}
              className="nw-tab"
              onClick={() => setMode('manual')}
            >
              <Icon name="search" size={14} /> Busca manual
            </button>
          </div>

          {mode === 'auto' ? (
            <div className="nw-finder">
              <div className="nw-side">
                <CityMap
                  key={`${city.state}-${city.name}`}
                  city={city}
                  businesses={results}
                  selected={selected}
                  hasSearched={hasSearched}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  onToggle={toggleBusiness}
                />

                <div className="nw-form">
                  <div className="form-grid">
                    <div className="field span-2">
                      <span className="field-label">Cidade</span>
                      <CityPicker
                        value={city}
                        onChange={(next) => {
                          setCity(next)
                          resetResults()
                        }}
                      />
                      <p className="nw-city__hint">
                        {CITY_COUNT} cidades em {STATE_COUNT} estados · busca ilustrativa
                        <button
                          type="button"
                          className="nw-city__link"
                          onClick={() => setMode('manual')}
                        >
                          Não achou? Use a busca manual
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="field" style={{ marginTop: 10 }}>
                    <span className="field-label">Quantos negócios</span>
                    <div className="tools__chips">
                      {[10, 20].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="chip"
                          aria-pressed={quantity === value}
                          onClick={() => {
                            setQuantity(value)
                            resetResults()
                          }}
                        >
                          {value} negócios
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn--red btn--block"
                    style={{ marginTop: 12 }}
                    onClick={runSearch}
                    disabled={searching}
                  >
                    <Icon name={searching ? 'clock' : 'search'} size={15} />
                    {searching ? 'Buscando…' : 'Buscar negócios'}
                  </button>
                  <a
                    className="app-card__link"
                    href={nicheSearchLink(niche, city.name, city.state)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', marginTop: 10 }}
                  >
                    Abrir busca real no Google Maps
                    <Icon name="external" size={11} />
                  </a>
                  <p className="app-note" style={{ marginTop: 8 }}>
                    Resultados ilustrativos. Em produção, esta busca usa Google Places com
                    backend. Nenhum crédito é consumido aqui.
                  </p>
                </div>
              </div>

              <div className="nw-results">
                <div className="nw-results__head">
                  <div>
                    <span className="nw-results__label">Resultados</span>
                    <b>
                      {searching
                        ? 'Buscando negócios na região…'
                        : hasSearched
                          ? `${visibleResults.length}${
                              visibleResults.length !== results.length
                                ? ` de ${results.length}`
                                : ''
                            } opções de ${niche.label.toLowerCase()} em ${city.name} - ${city.state}`
                          : 'Faça uma busca para ver os negócios'}
                    </b>
                  </div>
                  {hasSearched && visibleResults.length > 0 && (
                    <button type="button" className="app-card__link" onClick={toggleAll}>
                      {visibleResults.every((business) => selected.has(business.id))
                        ? 'Limpar seleção'
                        : `Selecionar todos (${visibleResults.length})`}
                    </button>
                  )}
                </div>

                {searching ? (
                  <div className="nw-results__empty nw-results__loading" role="status">
                    <span className="nw-spinner" aria-hidden="true" />
                    <p>Lendo o mapa de {city.name} e separando quem ainda não tem site…</p>
                  </div>
                ) : !hasSearched ? (
                  <div className="nw-results__empty">
                    <Icon name="map-pin" size={22} />
                    <p>Escolha a cidade e clique em buscar para simular a prospecção.</p>
                  </div>
                ) : (
                  <>
                    {results.length > 0 && (
                      <div className="chip-row nw-result-filters" role="group" aria-label="Filtrar resultados">
                        {(
                          [
                            { value: 'todos', label: `Todos (${results.length})` },
                            {
                              value: 'sem-site',
                              label: `Sem site (${
                                results.filter((business) => !business.hasSite).length
                              })`,
                            },
                            {
                              value: 'nota',
                              label: `Nota 4.5+ (${
                                results.filter((business) => business.rating >= 4.5).length
                              })`,
                            },
                          ] as { value: ResultFilter; label: string }[]
                        ).map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className="chip"
                            aria-pressed={resultFilter === option.value}
                            onClick={() => changeFilter(option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {visibleResults.length === 0 ? (
                      <div className="nw-results__empty">
                        <Icon name="search" size={22} />
                        <p>
                          {results.length === 0
                            ? 'Nenhum negócio encontrado nessa cidade. Tente outro bairro ou a busca manual.'
                            : 'Nenhum resultado com esse filtro. Volte para “Todos”.'}
                        </p>
                        {results.length > 0 && (
                          <button
                            type="button"
                            className="app-card__link"
                            onClick={() => changeFilter('todos')}
                          >
                            Limpar filtro
                          </button>
                        )}
                      </div>
                    ) : (
                    <ul className="nw-result-list">
                      {visibleResults.map((business) => {
                        const isSelected = selected.has(business.id)
                        const isHovered = hoveredId === business.id
                        return (
                          <li key={business.id}>
                            <button
                              type="button"
                              className={`nw-result ${isSelected ? 'is-selected' : ''} ${
                                isHovered ? 'is-hovered' : ''
                              }`}
                              onClick={() => toggleBusiness(business.id)}
                              onMouseEnter={() => setHoveredId(business.id)}
                              onMouseLeave={() => setHoveredId(null)}
                              onFocus={() => setHoveredId(business.id)}
                              onBlur={() => setHoveredId(null)}
                              aria-pressed={isSelected}
                            >
                              <span className={`nw-result__check ${isSelected ? 'is-on' : ''}`}>
                                {isSelected && <Icon name="check" size={11} />}
                              </span>
                              <span className="nw-result__avatar" aria-hidden="true">
                                {business.name.trim().charAt(0).toUpperCase()}
                              </span>
                              <span className="nw-result__main">
                                <span className="nw-result__name">{business.name}</span>
                                <span className="nw-result__meta">
                                  {business.category} · {business.neighborhood}
                                </span>
                                <span className="nw-result__meta">
                                  <Icon name="star" size={9} /> {business.rating} ·{' '}
                                  {business.reviews} avaliações
                                </span>
                                <span className="nw-result__phone">
                                  {formatPhone(business.phone)} ·{' '}
                                  {phoneType(business.phone) === 'mobile' ? 'celular' : 'fixo'} ·
                                  ilustrativo
                                </span>
                              </span>
                              <span className="nw-result__badges">
                                <span className={`nw-badge ${business.hasSite ? 'nw-badge--ok' : 'nw-badge--warn'}`}>
                                  {business.hasSite ? 'Com site' : 'Sem site'}
                                </span>
                                {niche.kind === 'food' && (
                                  <span className={`nw-badge ${business.hasMenu ? 'nw-badge--ok' : 'nw-badge--warn'}`}>
                                    {business.hasMenu ? 'Com cardápio' : 'Sem cardápio'}
                                  </span>
                                )}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                    )}

                    {results.length > 0 && (
                    <div className="nw-actions">
                      <div className="nw-actions__summary">
                        <b>{selectedBusinesses.length} selecionado(s)</b>
                        <span>
                          {requiredProjects} projeto(s) · {planLimitLabel(plan.plan)} no seu plano
                        </span>
                        {overLimit && (
                          <span className="nw-limit">
                            Faltam {requiredProjects - remaining} projeto(s).{' '}
                            <Link to="/app/planos">Fazer upgrade</Link>
                          </span>
                        )}
                      </div>
                      <div className="nw-actions__buttons">
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={addSelectionToCrm}
                          disabled={selectedBusinesses.length === 0}
                        >
                          Adicionar ao CRM
                        </button>
                        <button
                          type="button"
                          className="btn btn--red btn--sm"
                          onClick={createFromSelection}
                          disabled={selectedBusinesses.length === 0 || overLimit || !plan.active}
                        >
                          Criar {TYPE_LABEL[type]} ({selectedBusinesses.length})
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                    </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="app-columns">
              <div className="app-tool">
                <div className="app-card__head">
                  <div>
                    <h2>Busca manual</h2>
                    <p>Abra o Maps, copie os negócios e cole a lista aqui.</p>
                  </div>
                  <a
                    className="btn btn--ghost btn--sm"
                    href={nicheSearchLink(niche, city.name, city.state)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="external" size={14} />
                    Google Maps
                  </a>
                </div>
                <div className="field" style={{ marginTop: 10 }}>
                  <label htmlFor="nw-manual">Nome; bairro; telefone; categoria</label>
                  <textarea
                    id="nw-manual"
                    className="textarea"
                    style={{ minHeight: 210, fontFamily: 'var(--mono)', fontSize: 12 }}
                    value={manualText}
                    onChange={(event) => setManualText(event.target.value)}
                    placeholder={`Ex.:\nSmash do Zé; Centro; (41) 99999-1111; Hamburgueria\nPizza da Praça; Jardim América; (41) 99999-2222; Pizzaria`}
                  />
                </div>
                <p className="app-note" style={{ marginTop: 8 }}>
                  O telefone é opcional; você completa depois no CRM. Cada linha vira um lead,
                  e o projeto é gerado com o template do nicho.
                </p>
                <div className="nw-actions" style={{ marginTop: 12 }}>
                  <div className="nw-actions__summary">
                    <b>{parsedManual.length} linha(s)</b>
                    <span>{manualCost} projeto(s)</span>
                    {manualOverLimit && (
                      <span className="nw-limit">
                        Faltam {manualCost - remaining} projeto(s).{' '}
                        <Link to="/app/planos">Fazer upgrade</Link>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn--red btn--sm"
                    onClick={createFromManual}
                    disabled={parsedManual.length === 0 || manualOverLimit || !plan.active}
                  >
                    Criar {TYPE_LABEL[type]}
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              </div>

              <div className="app-card">
                <div className="app-card__head">
                  <div>
                    <div className="app-card__title">Prévia da lista</div>
                    <div className="app-note">{parsedManual.length} negócio(s)</div>
                  </div>
                  <Icon name="list" size={17} />
                </div>
                {parsedManual.length === 0 ? (
                  <p className="crm-today__empty">
                    Cole pelo menos um nome. O template do nicho será aplicado a todos.
                  </p>
                ) : (
                  <ul className="nw-result-list">
                    {parsedManual.slice(0, 8).map((line, index) => (
                      <li className="nw-manual-item" key={`${line.name}-${index}`}>
                        <b>{line.name}</b>
                        <span>
                          {line.neighborhood || 'sem bairro'} · {formatPhone(line.phone) || 'sem telefone'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {parsedManual.length > 8 && (
                  <p className="app-note">+ {parsedManual.length - 8} linha(s)</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <p className="app-note" style={{ marginTop: 18 }}>
        Projetos gerados usam dados ilustrativos até você editar. A busca automática do Google
        Places depende de backend e chave de API; a busca manual abre o Maps de verdade.
      </p>
    </div>
  )
}
