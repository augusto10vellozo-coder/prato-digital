import { Link } from 'react-router-dom'
import { brl } from '../../lib/format'
import { closedLeads, dueFollowUps, sentToday } from '../../lib/appStats'
import { FIRST_CONTACT } from '../../lib/playbook'
import { useStore } from '../../lib/store'
import { Icon } from '../../components/Icon'
import { PageHead } from '../ui'

export function AppFirstClient() {
  const { leads, menus, notify } = useStore()
  const sent = sentToday(leads)
  const due = dueFollowUps(leads)
  const closed = closedLeads(leads)
  const goal = 5
  const hasMenu = menus.length > 0
  const hasLeads = leads.length >= 10
  const sentAny = leads.some((lead) => lead.history.some((entry) => entry.kind === 'mensagem'))
  const didFollowUp = leads.some((lead) =>
    lead.history.some((entry) => entry.kind === 'nota' && entry.text.toLowerCase().includes('follow-up')),
  )

  const steps = [
    {
      done: hasMenu,
      title: 'Criar o primeiro cardápio',
      text: 'Escolha um template, troque o nome e os itens. O cardápio precisa existir antes da abordagem.',
      to: '/app/templates',
      cta: 'Ver templates',
    },
    {
      done: hasLeads,
      title: 'Colocar 10 restaurantes na mesa',
      text: 'Use a prospecção em massa ou cadastre manualmente. O alvo é restaurante de bairro com WhatsApp.',
      to: '/app/prospeccao',
      cta: 'Importar lista',
    },
    {
      done: sentAny,
      title: 'Enviar a primeira mensagem',
      text: 'Mande o link do cardápio junto com o primeiro contato. Não peça reunião antes de mostrar.',
      to: '/app/crm?view=hoje',
      cta: 'Abrir CRM',
    },
    {
      done: didFollowUp,
      title: 'Fazer o follow-up D+2',
      text: 'Quem não respondeu no primeiro dia raramente responde sem um segundo toque.',
      to: '/app/crm?view=hoje',
      cta: 'Ver follow-ups',
    },
    {
      done: closed.length > 0,
      title: 'Fechar o primeiro cliente',
      text: 'Marque como Fechado no CRM e gere o contrato. O primeiro case vale mais do que a margem.',
      to: '/app/contratos',
      cta: 'Gerar contrato',
    },
  ]

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(FIRST_CONTACT)
      notify('Script copiado.')
    } catch {
      notify('Não foi possível copiar.')
    }
  }

  return (
    <div className="app-page">
      <PageHead
        title="Primeiro cliente"
        subtitle="Um plano de 7 dias: 10 leads, 5 envios por dia, follow-up em D+2 e um cliente fechado."
        actions={
          <Link className="btn btn--red btn--sm" to="/app/novo?type=menu">
            <Icon name="plus" size={15} />
            Criar cardápio
          </Link>
        }
      />

      <div className="app-first">
        <section className="app-card">
          <div className="app-card__head">
            <div>
              <div className="app-card__title">O caminho até o primeiro contrato</div>
              <div className="app-note">
                {steps.filter((step) => step.done).length} de {steps.length} etapas concluídas
              </div>
            </div>
            <span className="stamp stamp--red">
              {closed.length > 0 ? 'Cliente fechado' : 'Em andamento'}
            </span>
          </div>

          <ul className="app-first__list">
            {steps.map((step, index) => (
              <li className={`app-first__step ${step.done ? 'is-done' : ''}`} key={step.title}>
                <span className="app-first__no" aria-hidden="true">
                  {step.done ? <Icon name="check" size={15} /> : index + 1}
                </span>
                <div className="app-first__main">
                  <div className="app-first__title">{step.title}</div>
                  <p className="app-first__text">{step.text}</p>
                  <Link className="app-card__link app-first__cta" to={step.to}>
                    {step.cta} <Icon name="arrow-right" size={11} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="app-stack">
          <div className="app-day">
            <div className="app-day__label">Meta de hoje</div>
            <div className="app-day__value">
              {sent}
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-soft)' }}>
                {' '}
                / {goal}
              </span>
            </div>
            <div className="app-goal__bar">
              <i style={{ width: `${Math.min(100, (sent / goal) * 100)}%` }} />
            </div>
            <p className="app-note" style={{ marginTop: 6 }}>
              {sent >= goal
                ? 'Meta batida. Amanhã mantém o ritmo.'
                : `Faltam ${goal - sent} envios para bater a meta.`}
            </p>
            <div className="app-goal__stats">
              <div className="app-goal__stat">
                <span>Follow-ups</span>
                <b>{due.length}</b>
                <span>pendentes</span>
              </div>
              <div className="app-goal__stat">
                <span>Leads</span>
                <b>{leads.length}</b>
                <span>na base</span>
              </div>
              <div className="app-goal__stat">
                <span>MRR</span>
                <b>{brl(closed.reduce((sum, lead) => sum + (lead.deal?.monthly ?? 0), 0))}</b>
                <span>fechado</span>
              </div>
            </div>
            <Link className="btn btn--red btn--sm btn--block" to="/app/crm?view=hoje" style={{ marginTop: 10 }}>
              <Icon name="send" size={14} />
              Fazer os envios de hoje
            </Link>
          </div>

          <div className="app-card">
            <div className="app-card__head">
              <div className="app-card__title">Script de primeiro contato</div>
              <button type="button" className="icon-btn" onClick={copyScript} aria-label="Copiar script">
                <Icon name="copy" size={14} />
              </button>
            </div>
            <p className="app-resource__script">{FIRST_CONTACT}</p>
            <p className="app-note" style={{ marginTop: 8 }}>
              Troque o link pelo cardápio do lead. O CRM monta a mensagem com o link certo.
            </p>
          </div>
        </aside>
      </div>

      <section className="app-card" style={{ marginTop: 16 }}>
        <div className="app-card__head">
          <div>
            <div className="app-card__title">Plano de 7 dias</div>
            <div className="app-note">Uma tarefa por dia. Sem complicar.</div>
          </div>
          <Icon name="calendar" size={17} />
        </div>
        <div className="app-columns">
          {[
            ['Dia 1', '10 restaurantes na base, 1 cardápio pronto'],
            ['Dia 2', '5 primeiros contatos com link'],
            ['Dia 3', 'Mais 5 contatos e follow-up de quem abriu'],
            ['Dia 4', 'Follow-up D+2 dos envios do dia 2'],
            ['Dia 5', 'Responder objeções e mandar proposta'],
            ['Dia 6', 'Fechar contrato e publicar o cardápio'],
            ['Dia 7', 'Pedir indicação e repetir o ciclo'],
          ].map(([day, task]) => (
            <div key={day} className="app-first__step" style={{ padding: '9px 0' }}>
              <span className="app-first__no" style={{ width: 38, fontSize: 11 }}>
                {day}
              </span>
              <div className="app-first__main">
                <div className="app-first__text" style={{ margin: 0 }}>
                  {task}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
