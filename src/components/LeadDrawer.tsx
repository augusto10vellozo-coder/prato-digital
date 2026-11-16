import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { formatDate, formatPhone, followUpLabel, isMobilePhone, ratingText } from '../lib/format'
import { messageFor, telLink, waLink } from '../lib/whatsapp'
import { PRIORITY_LABEL, STATUS_LABEL, type Lead, type LeadStatus, type MessageKind } from '../lib/types'
import { Icon, WhatsAppIcon } from './Icon'
import { Drawer } from './Drawer'
import { StatusStamp } from './StatusStamp'

const KIND_OPTIONS: { value: MessageKind; label: string }[] = [
  { value: 'primeiro', label: 'Primeiro contato' },
  { value: 'follow2', label: 'Follow-up D+2' },
  { value: 'follow5', label: 'Follow-up D+5' },
  { value: 'preco', label: 'Resposta de preço' },
  { value: 'fechamento', label: 'Fechamento' },
]

const HISTORY_LABEL: Record<string, string> = {
  nota: 'nota',
  status: 'status',
  mensagem: 'msg',
  cardapio: 'cardápio',
  site: 'site',
  ligacao: 'ligação',
}

const STATUSES: LeadStatus[] = ['a-contatar', 'enviado', 'respondeu', 'fechado', 'descartado']

function defaultKind(status: LeadStatus): MessageKind {
  switch (status) {
    case 'enviado':
      return 'follow2'
    case 'respondeu':
      return 'preco'
    case 'fechado':
      return 'fechamento'
    default:
      return 'primeiro'
  }
}

interface LeadDrawerProps {
  lead: Lead
  onClose: () => void
}

export function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
  const { menus, sites, setStatus, addNote, logMessage, deleteLead, notify, updateLead } = useStore()
  const menu = menus.find((item) => item.id === lead.menuId)
  const site = sites.find((item) => item.id === lead.siteId)
  const mobile = isMobilePhone(lead.phone)
  const whatsappStatus = lead.whatsappStatus ?? 'unknown'
  const canWhatsApp = mobile && whatsappStatus !== 'none'
  const [kind, setKind] = useState<MessageKind>(defaultKind(lead.status))
  const [message, setMessage] = useState(() =>
    messageFor(defaultKind(lead.status), lead, menu, site),
  )
  const [note, setNote] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const follow = followUpLabel(lead.followUpAt)
  const channel = lead.isDemo
    ? 'Telefone ilustrativo'
    : whatsappStatus === 'none'
      ? 'Sem WhatsApp'
      : whatsappStatus === 'confirmed'
        ? 'WhatsApp confirmado'
        : mobile
          ? 'WhatsApp não verificado'
          : 'Só fixo'
  const history = useMemo(
    () => [...lead.history].sort((a, b) => b.at.localeCompare(a.at)),
    [lead.history],
  )

  function changeKind(next: MessageKind) {
    setKind(next)
    setMessage(messageFor(next, lead, menu, site))
  }

  function setWhatsAppStatus(next: 'confirmed' | 'none') {
    updateLead(lead.id, { whatsappStatus: next })
    notify(
      next === 'confirmed'
        ? 'Número marcado como WhatsApp confirmado.'
        : 'Número marcado sem WhatsApp — o contato passa a ser por ligação.',
    )
  }

  function openWhatsApp() {
    if (!canWhatsApp) return
    const needsCheck = lead.isDemo || whatsappStatus !== 'confirmed'
    if (
      needsCheck &&
      !window.confirm(
        lead.isDemo
          ? 'Este telefone é ilustrativo da demonstração e não existe no WhatsApp. Abrir mesmo assim?'
          : `Não verificamos se ${formatPhone(lead.phone)} tem WhatsApp. Abrir o WhatsApp mesmo assim?`,
      )
    ) {
      return
    }
    window.open(waLink(lead.phone, message), '_blank', 'noopener,noreferrer')
    logMessage(lead.id, `Mensagem aberta no WhatsApp (${KIND_OPTIONS.find((item) => item.value === kind)?.label.toLowerCase()}).`)
    notify('Mensagem aberta e registrada no histórico.')
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message)
      notify('Mensagem copiada.')
    } catch {
      notify('Não foi possível copiar. Selecione o texto manualmente.')
    }
  }

  function saveNote() {
    if (!note.trim()) return
    addNote(lead.id, note)
    setNote('')
  }

  return (
    <Drawer kicker={`${lead.category} · ${lead.neighborhood}`} title={lead.name} onClose={onClose}>
      <section className="drawer__section">
        <h3>
          Situação <span>follow-up {follow.text}</span>
        </h3>
        <div className="drawer__actions" style={{ marginBottom: 10 }}>
          <StatusStamp status={lead.status} />
          <span className={`priority priority--${lead.priority}`}>
            prioridade {PRIORITY_LABEL[lead.priority]}
          </span>
        </div>
        <div className="status-picker" role="group" aria-label="Mudar status do lead">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              className="status-choice"
              data-status={status}
              aria-pressed={lead.status === status}
              onClick={() => {
                setStatus(lead.id, status)
                notify(`Status: ${STATUS_LABEL[status]}.`)
              }}
            >
              {STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      </section>

      <section className="drawer__section">
        <h3>
          Contato <span>{channel}</span>
        </h3>
        <div className="menu-card" style={{ marginBottom: 10 }}>
          <div className="menu-card__main">
            <div className="menu-card__name">{formatPhone(lead.phone)}</div>
            <div className="menu-card__meta">
              {ratingText(lead.rating)} no Google · {lead.reviews} avaliações ·{' '}
              {lead.hasSite ? 'tem site' : 'sem site'} · {lead.hasMenu ? 'tem cardápio' : 'sem cardápio'}
            </div>
          </div>
          <div className="menu-card__actions">
            {canWhatsApp ? (
              <button
                type="button"
                className="icon-btn icon-btn--wa"
                onClick={openWhatsApp}
                aria-label={lead.isDemo ? 'Telefone ilustrativo da demonstração' : 'Abrir WhatsApp'}
                title={lead.isDemo ? 'Telefone ilustrativo' : 'Abrir WhatsApp'}
              >
                <WhatsAppIcon size={15} />
              </button>
            ) : (
              <a className="icon-btn" href={telLink(lead.phone)} aria-label="Ligar">
                <Icon name="phone" size={15} />
              </a>
            )}
          </div>
        </div>

        {!lead.isDemo && mobile && (
          <div className="wa-check">
            <span className="field-label">Esse número tem WhatsApp?</span>
            <div className="wa-check__options">
              <button
                type="button"
                className="chip"
                aria-pressed={whatsappStatus === 'confirmed'}
                onClick={() => setWhatsAppStatus('confirmed')}
              >
                Tem WhatsApp
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={whatsappStatus === 'none'}
                onClick={() => setWhatsAppStatus('none')}
              >
                Não tem
              </button>
            </div>
            <p className="app-note">
              O formato do número não confirma a conta. Abra uma vez no celular, marque aqui e o
              CRM passa a mostrar o canal certo.
            </p>
          </div>
        )}

        {lead.isDemo && (
          <p className="app-note">
            Telefone ilustrativo da demonstração — não é um WhatsApp real.
          </p>
        )}
        {!mobile && (
          <p className="builder-hint">
            Número fixo: o WhatsApp não abre. Ligue ou copie a mensagem para enviar por outro
            canal.
          </p>
        )}
        {whatsappStatus === 'none' && (
          <p className="builder-hint">
            Marcado sem WhatsApp: os botões abrem a ligação e a mensagem pronta fica para copiar.
          </p>
        )}
      </section>

      <section className="drawer__section">
        <h3>
          Mensagem pronta{' '}
          <span>
            {menu && site
              ? 'com link do site e do cardápio'
              : site
                ? 'com link do site'
                : menu
                  ? 'com link do cardápio'
                  : 'sem prévia ainda'}
          </span>
        </h3>
        <div className="message-box">
          <div className="field">
            <label htmlFor="lead-message-kind">Etapa da conversa</label>
            <select
              id="lead-message-kind"
              className="select"
              value={kind}
              onChange={(event) => changeKind(event.target.value as MessageKind)}
            >
              {KIND_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="lead-message">Texto para enviar</label>
            <textarea
              id="lead-message"
              className="textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
          <div className="message-actions">
            {canWhatsApp ? (
              <button type="button" className="btn btn--red btn--sm" onClick={openWhatsApp}>
                <WhatsAppIcon size={15} />
                Abrir no WhatsApp
              </button>
            ) : (
              <a className="btn btn--red btn--sm" href={telLink(lead.phone)}>
                <Icon name="phone" size={15} />
                Ligar agora
              </a>
            )}
            <button type="button" className="btn btn--ghost btn--sm" onClick={copyMessage}>
              <Icon name="copy" size={15} />
              Copiar texto
            </button>
          </div>
          {!menu && !site && (
            <p className="builder-hint">
              Este lead ainda não tem cardápio nem site. Gere uma prévia abaixo para incluir o
              link na mensagem.
            </p>
          )}
        </div>
      </section>

      <section className="drawer__section">
        <h3>Cardápio</h3>
        {menu ? (
          <div className="menu-card">
            <div className="menu-card__main">
              <div className="menu-card__name">{menu.name}</div>
              <div className="menu-card__meta">
                {menu.categories.length} categorias · /c/{menu.slug}
              </div>
            </div>
            <div className="menu-card__actions">
              <Link
                className="icon-btn"
                to={`/app/projetos/${lead.id}`}
                aria-label="Editar cardápio"
              >
                <Icon name="edit" size={15} />
              </Link>
              <Link
                className="icon-btn"
                to={`/c/${menu.slug}`}
                target="_blank"
                aria-label="Abrir cardápio"
              >
                <Icon name="external" size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="menu-card">
            <div className="menu-card__main">
              <div className="menu-card__name">Nenhum cardápio montado</div>
              <div className="menu-card__meta">Crie uma prévia para enviar ao restaurante</div>
            </div>
            <div className="menu-card__actions">
              <Link className="btn btn--sm" to={`/app/projetos/${lead.id}`}>
                <Icon name="plus" size={14} />
                Gerar
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="drawer__section">
        <h3>Site</h3>
        {site ? (
          <div className="menu-card">
            <div className="menu-card__main">
              <div className="menu-card__name">{site.name}</div>
              <div className="menu-card__meta">
                {site.isDemo ? 'prévia' : 'no ar'} · /s/{site.slug}
              </div>
            </div>
            <div className="menu-card__actions">
              <Link
                className="icon-btn"
                to={`/app/sites/${lead.id}`}
                aria-label="Editar site"
              >
                <Icon name="edit" size={15} />
              </Link>
              <Link
                className="icon-btn"
                to={`/s/${site.slug}`}
                target="_blank"
                aria-label="Abrir site"
              >
                <Icon name="external" size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="menu-card">
            <div className="menu-card__main">
              <div className="menu-card__name">Nenhum site montado</div>
              <div className="menu-card__meta">Crie uma página para este negócio</div>
            </div>
            <div className="menu-card__actions">
              <Link className="btn btn--sm" to={`/app/sites/${lead.id}`}>
                <Icon name="plus" size={14} />
                Gerar
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="drawer__section">
        <h3>
          Anotação <span>só sua</span>
        </h3>
        {lead.notes && (
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--ink-2)',
              borderLeft: '1px solid var(--line)',
              paddingLeft: 9,
              marginBottom: 9,
            }}
          >
            {lead.notes}
          </p>
        )}
        <div className="field">
          <label htmlFor="lead-note">Nova anotação</label>
          <textarea
            id="lead-note"
            className="textarea"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ex.: pediu para chamar depois das 15h."
          />
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={saveNote}
          style={{ marginTop: 8 }}
          disabled={!note.trim()}
        >
          <Icon name="plus" size={14} />
          Salvar anotação
        </button>
      </section>

      <section className="drawer__section">
        <h3>
          Histórico <span>{history.length} registros</span>
        </h3>
        <ul className="history">
          {history.map((entry) => (
            <li key={entry.id}>
              <span className="history__date">{formatDate(entry.at).slice(0, 5)}</span>
              <span className="history__tag">{HISTORY_LABEL[entry.kind] ?? entry.kind}</span>
              <span className="history__text">{entry.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="drawer__section">
        <h3>Remover da mesa</h3>
        {confirmDelete ? (
          <div className="drawer__actions">
            <button
              type="button"
              className="btn btn--sm"
              style={{ background: 'var(--red)', borderColor: 'var(--red)' }}
              onClick={() => {
                deleteLead(lead.id)
                onClose()
              }}
            >
              Confirmar remoção
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setConfirmDelete(false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="drawer__actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setConfirmDelete(true)}
            >
              <Icon name="trash" size={14} />
              Remover lead
            </button>
            <span className="builder-hint" style={{ margin: 0 }}>
              Apaga também o cardápio vinculado.
            </span>
          </div>
        )}
      </section>
    </Drawer>
  )
}
