import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  brl,
  daysBetween,
  followUpLabel,
  formatPhone,
  isMobilePhone,
  ratingText,
  todayISO,
} from '../../lib/format'
import { dueFollowUps, funnelCounts, mrr, sentToday } from '../../lib/appStats'
import { useStore } from '../../lib/store'
import { messageFor, telLink, waLink } from '../../lib/whatsapp'
import { PRIORITY_LABEL, STATUS_LABEL, type Lead, type LeadStatus, type Menu, type Site } from '../../lib/types'
import { Icon, WhatsAppIcon } from '../../components/Icon'
import { LeadDrawer } from '../../components/LeadDrawer'
import { NewLeadDrawer } from '../../components/NewLeadDrawer'
import { EmptyState, PageHead } from '../ui'

type CrmView = 'quadro' | 'hoje' | 'lista'
type CrmFilter = 'todos' | 'sem-cardapio' | 'sem-site' | 'parados' | 'fixo'

const COLUMNS: { status: LeadStatus; label: string; tone: string }[] = [
  { status: 'a-contatar', label: 'Novo', tone: 'novo' },
  { status: 'enviado', label: 'Contatado', tone: 'contatado' },
  { status: 'respondeu', label: 'Negociando', tone: 'negociando' },
  { status: 'fechado', label: 'Fechado', tone: 'fechado' },
]

const STATUSES: LeadStatus[] = ['a-contatar', 'enviado', 'respondeu', 'fechado', 'descartado']

const PRIORITY_ORDER: Record<Lead['priority'], number> = { alta: 0, media: 1, baixa: 2 }

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

interface CrmCardProps {
  lead: Lead
  menu?: Menu
  site?: Site
  onOpen: () => void
  onMove: (status: LeadStatus) => void
  onWhats: () => void
  onDragStart: () => void
  onDragEnd: () => void
  dragging: boolean
}

function CrmCard({
  lead,
  menu,
  site,
  onOpen,
  onMove,
  onWhats,
  onDragStart,
  onDragEnd,
  dragging,
}: CrmCardProps) {
  const follow = followUpLabel(lead.followUpAt)
  const mobile = isMobilePhone(lead.phone)
  const whatsappStatus = lead.whatsappStatus ?? 'unknown'
  const canWhatsApp = mobile && whatsappStatus !== 'none'
  const channelLabel = lead.isDemo
    ? 'ilustrativo'
    : whatsappStatus === 'none'
      ? 'sem WhatsApp'
      : whatsappStatus === 'confirmed'
        ? 'WhatsApp'
        : mobile
          ? 'não verificado'
          : 'só fixo'

  return (
    <article
      className={`crm-lead ${dragging ? 'is-dragging' : ''}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', lead.id)
        event.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
    >
      <div className="crm-lead__head">
        <div style={{ minWidth: 0 }}>
          <div className="crm-lead__name">{lead.name}</div>
          <div className="crm-lead__meta">
            {lead.category} · {lead.neighborhood}
          </div>
        </div>
        <span className="crm-lead__rating">
          <Icon name="star" size={9} />
          {ratingText(lead.rating)}
        </span>
      </div>

      <div className="crm-lead__rows">
        <div className="crm-lead__row">
          <span>{formatPhone(lead.phone)}</span>
          <b>{channelLabel}</b>
        </div>
        {lead.status === 'enviado' && (
          <div className="crm-lead__row">
            <span>Follow-up</span>
            <b className={`tone-${follow.tone}`}>{follow.text}</b>
          </div>
        )}
        <div className="crm-lead__row">
          <span>Cardápio</span>
          <b>{menu ? (menu.isDemo ? 'prévia' : 'no ar') : 'sem'}</b>
        </div>
        <div className="crm-lead__row">
          <span>Site</span>
          <b>{site ? (site.isDemo ? 'prévia' : 'no ar') : 'sem'}</b>
        </div>
      </div>

      <div className="crm-lead__foot">
        <select
          className="status-select"
          data-status={lead.status}
          value={lead.status}
          aria-label={`Status de ${lead.name}`}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onChange={(event) => onMove(event.target.value as LeadStatus)}
        >
          {STATUSES.map((status) => (
            <option value={status} key={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="icon-btn icon-btn--wa"
          onClick={(event) => {
            event.stopPropagation()
            onWhats()
          }}
          aria-label={
            lead.isDemo
              ? `Telefone ilustrativo de ${lead.name}`
              : canWhatsApp
                ? `WhatsApp para ${lead.name}`
                : `Ligar para ${lead.name}`
          }
          title={
            lead.isDemo
              ? 'Telefone ilustrativo da demonstração'
              : canWhatsApp
                ? whatsappStatus === 'confirmed'
                  ? 'Abrir WhatsApp (confirmado)'
                  : 'Abrir WhatsApp — número não verificado'
                : 'Ligar'
          }
        >
          {canWhatsApp ? <WhatsAppIcon size={12} /> : <Icon name="phone" size={12} />}
        </button>
        <Link
          className="icon-btn"
          to={`/app/projetos/${lead.id}`}
          onClick={(event) => event.stopPropagation()}
          aria-label={`${menu ? 'Editar' : 'Criar'} cardápio de ${lead.name}`}
          title={menu ? 'Editar cardápio' : 'Criar cardápio'}
        >
          <Icon name={menu ? 'edit' : 'file-text'} size={12} />
        </Link>
        <Link
          className="icon-btn"
          to={`/app/sites/${lead.id}`}
          onClick={(event) => event.stopPropagation()}
          aria-label={`${site ? 'Editar' : 'Criar'} site de ${lead.name}`}
          title={site ? 'Editar site' : 'Criar site'}
        >
          <Icon name={site ? 'globe' : 'globe'} size={12} />
        </Link>
      </div>
    </article>
  )
}

export function AppCrm() {
  const { leads, menus, sites, setStatus, logMessage, completeFollowUp, notify } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [view, setView] = useState<CrmView>(() =>
    searchParams.get('view') === 'hoje' ? 'hoje' : 'quadro',
  )
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<CrmFilter>('todos')
  const [priority, setPriority] = useState<'todas' | Lead['priority']>('todas')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null)

  useEffect(() => {
    const leadParam = searchParams.get('lead')
    if (leadParam && leads.some((lead) => lead.id === leadParam)) setSelectedId(leadParam)
    if (searchParams.get('view') === 'hoje') setView('hoje')
    if (searchParams.get('new') === '1') setNewOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const selected = leads.find((lead) => lead.id === selectedId) ?? null
  const funnel = funnelCounts(leads)
  const total = funnel.novo + funnel.contatado + funnel.negociando + funnel.fechado
  const due = dueFollowUps(leads)

  const filtered = useMemo(() => {
    const term = normalize(query.trim())
    return leads
      .filter((lead) => {
        if (filter === 'sem-cardapio' && lead.menuId) return false
        if (filter === 'sem-site' && lead.siteId) return false
        if (
          filter === 'fixo' &&
          isMobilePhone(lead.phone) &&
          lead.whatsappStatus !== 'none'
        ) {
          return false
        }
        if (
          filter === 'parados' &&
          (lead.status !== 'enviado' ||
            !lead.lastContactAt ||
            daysBetween(lead.lastContactAt, todayISO()) < 3)
        ) {
          return false
        }
        if (priority !== 'todas' && lead.priority !== priority) return false
        if (!term) return true
        return normalize(
          `${lead.name} ${lead.category} ${lead.neighborhood} ${lead.phone}`,
        ).includes(term)
      })
      .sort((a, b) => {
        const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        if (byPriority !== 0) return byPriority
        return (a.followUpAt ?? '9999').localeCompare(b.followUpAt ?? '9999')
      })
  }, [leads, query, filter, priority])

  const boardLeads = filtered.filter((lead) => lead.status !== 'descartado')
  const newLeads = filtered.filter((lead) => lead.status === 'a-contatar')
  const menuFor = (lead: Lead) => menus.find((menu) => menu.id === lead.menuId)
  const siteFor = (lead: Lead) => sites.find((site) => site.id === lead.siteId)

  function move(lead: Lead, status: LeadStatus) {
    if (lead.status === status) return
    setStatus(lead.id, status)
    notify(`${lead.name}: ${STATUS_LABEL[status]}.`)
  }

  function sendWhatsApp(lead: Lead) {
    const status = lead.whatsappStatus ?? 'unknown'
    if (!isMobilePhone(lead.phone) || status === 'none') {
      window.location.href = telLink(lead.phone)
      return
    }
    if (
      (lead.isDemo || status !== 'confirmed') &&
      !window.confirm(
        lead.isDemo
          ? 'Este telefone é ilustrativo da demonstração e não existe no WhatsApp. Abrir mesmo assim?'
          : `Não verificamos se ${formatPhone(lead.phone)} tem WhatsApp. Abrir o WhatsApp mesmo assim?`,
      )
    ) {
      return
    }
    const kind =
      lead.status === 'enviado' ? 'follow2' : lead.status === 'respondeu' ? 'preco' : 'primeiro'
    window.open(
      waLink(lead.phone, messageFor(kind, lead, menuFor(lead), siteFor(lead))),
      '_blank',
      'noopener,noreferrer',
    )
    logMessage(lead.id, 'Mensagem aberta no WhatsApp a partir do CRM.')
  }

  function closeLead() {
    setSelectedId(null)
    if (searchParams.has('lead')) {
      const next = new URLSearchParams(searchParams)
      next.delete('lead')
      setSearchParams(next, { replace: true })
    }
  }

  function closeNew() {
    setNewOpen(false)
    if (searchParams.has('new')) {
      const next = new URLSearchParams(searchParams)
      next.delete('new')
      setSearchParams(next, { replace: true })
    }
  }

  return (
    <div className="app-page">
      <PageHead
        title="CRM"
        subtitle="Quem precisa de mensagem agora. Arraste para a coluna certa conforme a conversa."
        actions={
          <>
            <Link className="btn btn--ghost btn--sm" to="/app/novo?type=menu">
              <Icon name="file-text" size={15} />
              Novo cardápio
            </Link>
            <button type="button" className="btn btn--red btn--sm" onClick={() => setNewOpen(true)}>
              <Icon name="plus" size={15} />
              Criar lead
            </button>
          </>
        }
      />

      <div className="crm-summary">
        <div className="crm-summary__row">
          <div className="crm-summary__item">
            <span>No funil</span>
            <b>{total}</b>
            <small>{leads.length} leads na base</small>
          </div>
          <div className="crm-summary__item">
            <span>Sem cardápio</span>
            <b>{leads.filter((lead) => !lead.menuId).length}</b>
            <small>é aqui que está a venda</small>
          </div>
          <div className="crm-summary__item">
            <span>Sem site</span>
            <b>{leads.filter((lead) => !lead.siteId).length}</b>
            <small>para vender site</small>
          </div>
          <div className="crm-summary__item">
            <span>Fechados</span>
            <b>{funnel.fechado}</b>
            <small>{mrr(leads) > 0 ? `${brl(mrr(leads))}/mês` : '0% de fechamento'}</small>
          </div>
        </div>
        <div className="crm-segbar" aria-hidden="true">
          <i className="crm-segbar__novo" style={{ width: `${total ? (funnel.novo / total) * 100 : 0}%` }} />
          <i className="crm-segbar__contatado" style={{ width: `${total ? (funnel.contatado / total) * 100 : 0}%` }} />
          <i className="crm-segbar__negociando" style={{ width: `${total ? (funnel.negociando / total) * 100 : 0}%` }} />
          <i className="crm-segbar__fechado" style={{ width: `${total ? (funnel.fechado / total) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="crm-tabs" role="tablist" aria-label="Visão do CRM">
        {([
          ['hoje', `Hoje (${due.length})`],
          ['quadro', 'Quadro'],
          ['lista', 'Lista'],
        ] as [CrmView, string][]).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={view === id}
            className="crm-tab"
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="app-toolbar">
        <div className="app-search">
          <Icon name="search" size={15} />
          <label className="sr-only" htmlFor="crm-search">
            Buscar lead
          </label>
          <input
            id="crm-search"
            className="input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nome, bairro, categoria ou telefone"
          />
        </div>
        <div className="tools__chips" role="group" aria-label="Filtrar leads">
          <button type="button" className="chip" aria-pressed={filter === 'todos'} onClick={() => setFilter('todos')}>
            Todos ({filtered.length})
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={filter === 'sem-cardapio'}
            onClick={() => setFilter('sem-cardapio')}
          >
            Sem cardápio
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={filter === 'sem-site'}
            onClick={() => setFilter('sem-site')}
          >
            Sem site
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={filter === 'parados'}
            onClick={() => setFilter('parados')}
          >
            Parado 3+ dias
          </button>
          <button type="button" className="chip" aria-pressed={filter === 'fixo'} onClick={() => setFilter('fixo')}>
            Só fixo
          </button>
        </div>
        <select
          className="select app-select"
          aria-label="Filtrar prioridade"
          value={priority}
          onChange={(event) => setPriority(event.target.value as 'todas' | Lead['priority'])}
        >
          <option value="todas">Toda prioridade</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      {view === 'hoje' && (
        <div className="crm-today">
          <section className="app-card">
            <div className="app-card__head">
              <div>
                <div className="app-card__title">Follow-ups de hoje</div>
                <div className="app-note">{due.length} na fila · {sentToday(leads)} envios hoje</div>
              </div>
              <span className="stamp stamp--red">{due.length}</span>
            </div>
            {due.length === 0 ? (
              <p className="crm-today__empty">
                Nenhum follow-up vencido. Aproveite para abordar um lead novo.
              </p>
            ) : (
              <ul className="crm-today__list">
                {due.map((lead) => {
                  const follow = followUpLabel(lead.followUpAt)
                  const mobile = isMobilePhone(lead.phone)
                  return (
                    <li className="crm-today__item" key={lead.id}>
                      <div className="crm-today__main">
                        <div className="crm-today__name">{lead.name}</div>
                        <div className="crm-today__meta">
                          <span className={`tone-${follow.tone}`}>{follow.text}</span>
                          <span>{lead.neighborhood}</span>
                          <span>{formatPhone(lead.phone)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="icon-btn icon-btn--wa"
                        onClick={() => sendWhatsApp(lead)}
                        aria-label={`Enviar follow-up para ${lead.name}`}
                      >
                        {mobile ? <WhatsAppIcon size={14} /> : <Icon name="phone" size={14} />}
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => completeFollowUp(lead.id)}
                      >
                        <Icon name="check" size={13} />
                        Feito
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="app-card">
            <div className="app-card__head">
              <div>
                <div className="app-card__title">Novos para abordar</div>
                <div className="app-note">Sem contato ainda</div>
              </div>
              <span className="stamp stamp--ink">{newLeads.length}</span>
            </div>
            {newLeads.length === 0 ? (
              <p className="crm-today__empty">
                Nenhum lead novo. Importe uma lista em Prospecção em massa ou cadastre manualmente.
              </p>
            ) : (
              <ul className="crm-today__list">
                {newLeads.map((lead) => (
                  <li className="crm-today__item" key={lead.id}>
                    <div className="crm-today__main">
                      <div className="crm-today__name">{lead.name}</div>
                      <div className="crm-today__meta">
                        <span>{lead.category}</span>
                        <span>{lead.neighborhood}</span>
                        <span>{formatPhone(lead.phone)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => sendWhatsApp(lead)}
                    >
                      <WhatsAppIcon size={13} />
                      Abordar
                    </button>
                    <Link className="btn btn--red btn--sm" to={`/app/projetos/${lead.id}`}>
                      <Icon name="file-text" size={13} />
                      Cardápio
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {view === 'quadro' && (
        <div className="crm-board">
          {COLUMNS.map((column) => {
            const columnLeads = boardLeads.filter((lead) => lead.status === column.status)
            return (
              <section
                className={`crm-col ${dragOver === column.status ? 'is-dragover' : ''}`}
                data-tone={column.tone}
                key={column.status}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragOver(column.status)
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(event) => {
                  event.preventDefault()
                  const id = event.dataTransfer.getData('text/plain')
                  const lead = leads.find((item) => item.id === id)
                  if (lead) move(lead, column.status)
                  setDragOver(null)
                  setDraggingId(null)
                }}
              >
                <div className="crm-col__head">
                  <span className={`crm-col__dot crm-col__dot--${column.tone}`} />
                  <span className="crm-col__label">{column.label}</span>
                  <span className="crm-col__count">{columnLeads.length}</span>
                </div>

                {columnLeads.length === 0 ? (
                  <div className="crm-drop">
                    {column.status === 'a-contatar' ? 'Sem leads novos' : 'Arraste um lead para cá'}
                  </div>
                ) : (
                  columnLeads.map((lead) => (
                    <CrmCard
                      key={lead.id}
                      lead={lead}
                      menu={menuFor(lead)}
                      site={siteFor(lead)}
                      onOpen={() => setSelectedId(lead.id)}
                      onMove={(status) => move(lead, status)}
                      onWhats={() => sendWhatsApp(lead)}
                      onDragStart={() => setDraggingId(lead.id)}
                      onDragEnd={() => setDraggingId(null)}
                      dragging={draggingId === lead.id}
                    />
                  ))
                )}
              </section>
            )
          })}
        </div>
      )}

      {view === 'lista' && (
        <div className="app-table-scroll">
          <table className="crm-table">
            <colgroup>
              <col style={{ width: '27%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Restaurante</th>
                <th scope="col">Nota</th>
                <th scope="col">Contato</th>
                <th scope="col">Status</th>
                <th scope="col">Follow-up</th>
                <th scope="col">Prior.</th>
                <th scope="col">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const follow = followUpLabel(lead.followUpAt)
                const mobile = isMobilePhone(lead.phone)
                const menu = menuFor(lead)
                const site = siteFor(lead)
                return (
                  <tr key={lead.id} onClick={() => setSelectedId(lead.id)}>
                    <td>
                      <div className="lead-name-cell">
                        <span className="lead-name">{lead.name}</span>
                        <span className="lead-meta">
                          {lead.category} · {lead.neighborhood}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="rating">
                        <Icon name="star" size={10} />
                        {ratingText(lead.rating)}
                        <small>({lead.reviews})</small>
                      </span>
                    </td>
                    <td>
                      <div className="contact">
                        <span className="contact__phone">{formatPhone(lead.phone)}</span>
                        <span
                          className={`contact__channel ${
                            isMobilePhone(lead.phone) && lead.whatsappStatus !== 'none'
                              ? ''
                              : 'is-fixed'
                          }`}
                        >
                          {lead.isDemo
                            ? 'ilustrativo'
                            : lead.whatsappStatus === 'none'
                              ? 'sem WhatsApp'
                              : lead.whatsappStatus === 'confirmed'
                                ? 'WhatsApp'
                                : isMobilePhone(lead.phone)
                                  ? 'não verificado'
                                  : 'Só fixo'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        data-status={lead.status}
                        value={lead.status}
                        aria-label={`Status de ${lead.name}`}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                        onChange={(event) => move(lead, event.target.value as LeadStatus)}
                      >
                        {STATUSES.map((status) => (
                          <option value={status} key={status}>
                            {STATUS_LABEL[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`followup-cell ${lead.status === 'enviado' ? `tone-${follow.tone}` : 'muted'}`}>
                        {lead.status === 'enviado' ? follow.text : '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`priority priority--${lead.priority}`}>
                        {PRIORITY_LABEL[lead.priority]}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn icon-btn--wa"
                          aria-label={mobile ? `WhatsApp para ${lead.name}` : `Ligar para ${lead.name}`}
                          onClick={(event) => {
                            event.stopPropagation()
                            sendWhatsApp(lead)
                          }}
                        >
                          {mobile ? <WhatsAppIcon size={13} /> : <Icon name="phone" size={13} />}
                        </button>
                        <Link
                          className="icon-btn"
                          to={`/app/projetos/${lead.id}`}
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`${menu ? 'Editar' : 'Criar'} cardápio de ${lead.name}`}
                        >
                          <Icon name={menu ? 'edit' : 'file-text'} size={13} />
                        </Link>
                        <Link
                          className="icon-btn"
                          to={`/app/sites/${lead.id}`}
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`${site ? 'Editar' : 'Criar'} site de ${lead.name}`}
                        >
                          <Icon name="globe" size={13} />
                        </Link>
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Abrir ${lead.name}`}
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedId(lead.id)
                          }}
                        >
                          <Icon name="eye" size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && leads.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <EmptyState
            icon="search"
            title="Nenhum lead com esse filtro"
            body="Zere a busca e os filtros para ver a carteira inteira."
            action={
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setQuery('')
                  setFilter('todos')
                  setPriority('todas')
                }}
              >
                Limpar filtros
              </button>
            }
          />
        </div>
      )}

      {funnel.descartado > 0 && (
        <p className="app-note" style={{ marginTop: 10 }}>
          {funnel.descartado} descartado(s) fora do quadro. Eles aparecem na visão Lista e podem
          ser reativados pelo status.
        </p>
      )}

      {selected && <LeadDrawer key={selected.id} lead={selected} onClose={closeLead} />}
      {newOpen && <NewLeadDrawer onClose={closeNew} />}
    </div>
  )
}
