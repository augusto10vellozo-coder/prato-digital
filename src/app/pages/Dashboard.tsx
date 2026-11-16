import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '../../config'
import { brl, formatDate } from '../../lib/format'
import {
  answeredCount,
  closedLeads,
  contactedCount,
  dueFollowUps,
  funnelCounts,
  greeting,
  mrr,
  recentActivity,
  responseRate,
  sentThisWeek,
  sentToday,
  setupRevenue,
} from '../../lib/appStats'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { Icon, type IconName } from '../../components/Icon'
import { PageHead, ProjectCover, SectionHead, SiteCover, StatStrip } from '../ui'

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function useTrialCountdown(endsAt?: string) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!endsAt) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [endsAt])

  if (!endsAt) return null
  const target = new Date(`${endsAt}T23:59:59`).getTime()
  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

const ACTIVITY_ICON: Record<string, IconName> = {
  mensagem: 'send',
  status: 'check-circle',
  cardapio: 'file-text',
  site: 'globe',
  nota: 'message',
  ligacao: 'phone',
}

export function AppDashboard() {
  const { leads, menus, sites, data, session } = useStore()
  const plan = usePlan()
  const countdown = useTrialCountdown(data.subscription.trialEndsAt)
  const todaySent = sentToday(leads)
  const weekSent = sentThisWeek(leads)
  const due = dueFollowUps(leads)
  const funnel = funnelCounts(leads)
  const activity = recentActivity(leads, 6)
  const projectCount = menus.length + sites.length
  const recentProjects = [
    ...menus.map((menu) => ({ kind: 'menu' as const, updatedAt: menu.updatedAt, menu })),
    ...sites.map((site) => ({ kind: 'site' as const, updatedAt: site.updatedAt, site })),
  ]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3)
  const goal = 5
  const weekGoal = 25
  const sentMenu = leads.some((lead) => lead.history.some((entry) => entry.kind === 'mensagem'))
  const didFollowUp = leads.some((lead) =>
    lead.history.some(
      (entry) => entry.kind === 'nota' && entry.text.toLowerCase().includes('follow-up'),
    ),
  )
  const closed = closedLeads(leads)
  const checklist = [
    {
      done: projectCount > 0,
      title: 'Criar o primeiro projeto',
      note:
        projectCount > 0
          ? `${menus.length} cardápios · ${sites.length} sites`
          : 'Cardápio, site ou os dois — você escolhe',
      to: '/app/novo',
    },
    {
      done: sentMenu,
      title: 'Enviar para um restaurante',
      note: sentMenu ? 'Mensagem registrada' : 'O link do cardápio vai junto com a mensagem',
      to: '/app/crm',
    },
    {
      done: didFollowUp,
      title: 'Fazer o primeiro follow-up',
      note: didFollowUp ? 'Follow-up registrado' : 'D+2 é onde a conversa acontece',
      to: '/app/crm?view=hoje',
    },
    {
      done: closed.length > 0,
      title: 'Fechar o primeiro cliente',
      note: closed.length > 0 ? `${closed.length} fechado(s)` : 'Marque o lead como fechado no CRM',
      to: '/app/vendas',
    },
  ]

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date())

  const goalReached = todaySent >= goal

  return (
    <div className="app-page">
      <PageHead
        title={`${greeting()}, ${session?.name.split(' ')[0] ?? SITE.owner.name}.`}
        subtitle={`${today.charAt(0).toUpperCase() + today.slice(1)} · ${menus.length} cardápios · ${sites.length} sites · ${leads.length} leads na carteira`}
        actions={
          <>
            <Link className="btn btn--ghost btn--sm" to="/app/crm?view=hoje">
              <Icon name="target" size={15} />
              Ver CRM
            </Link>
            <Link className="btn btn--red btn--sm" to="/app/novo">
              <Icon name="plus" size={15} />
              Novo projeto
            </Link>
          </>
        }
      />

      {data.subscription.status === 'trial' && countdown && plan.active ? (
        <div className="app-trial">
          <div className="app-trial__icon">
            <Icon name="sparkles" size={20} />
          </div>
          <div className="app-trial__main">
            <h2>
              {countdown.days > 2 ? 'Seu teste PRO está ativo' : 'Seu teste PRO está acabando'}
            </h2>
            <p>
              {countdown.days > 2
                ? `Você tem ${countdown.days} dias de Pro para criar seus primeiros projetos. Sem cartão.`
                : `Em ${countdown.days} ${
                    countdown.days === 1 ? 'dia' : 'dias'
                  } você escolhe um plano para manter o CRM, os projetos e as ferramentas de venda.`}
            </p>
          </div>
          <div className="app-trial__counts" aria-label="Tempo restante do teste">
            <div className="app-trial__num">
              <b>{pad(countdown.days)}</b>
              <small>dias</small>
            </div>
            <div className="app-trial__num">
              <b>{pad(countdown.hours)}</b>
              <small>horas</small>
            </div>
            <div className="app-trial__num">
              <b>{pad(countdown.minutes)}</b>
              <small>min</small>
            </div>
            <div className="app-trial__num">
              <b>{pad(countdown.seconds)}</b>
              <small>seg</small>
            </div>
          </div>
          <Link className="btn btn--paper btn--sm" to="/app/planos">
            Escolher plano
          </Link>
          <div className="app-trial__bar">
            <i style={{ width: `${Math.min(100, ((countdown.days + 1) / 7) * 100)}%` }} />
          </div>
        </div>
      ) : data.subscription.status === 'active' ? (
        <div className="app-trial app-trial--active">
          <div className="app-trial__icon">
            <Icon name="check-circle" size={20} />
          </div>
          <div className="app-trial__main">
            <h2>Plano {plan.plan.name} ativo</h2>
            <p>
              Renova em {formatDate(data.subscription.renewsAt)} · {plan.used} de{' '}
              {plan.limit ?? '∞'} projetos usados.
            </p>
          </div>
          <Link className="btn btn--ghost btn--sm" to="/app/planos">
            Gerenciar plano
          </Link>
          <div className="app-trial__bar">
            <i
              style={{
                width: `${plan.limit ? Math.min(100, (plan.used / plan.limit) * 100) : 12}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="app-trial app-trial--expired">
          <div className="app-trial__icon">
            <Icon name="alert" size={20} />
          </div>
          <div className="app-trial__main">
            <h2>Seu acesso expirou</h2>
            <p>Assine um plano para voltar a criar projetos e usar o CRM.</p>
          </div>
          <Link className="btn btn--red btn--sm" to="/app/planos">
            Reativar acesso
          </Link>
        </div>
      )}

      <StatStrip
        bare
        items={[
          {
            label: 'Projetos',
            value: projectCount,
            foot: `${menus.length} cardápios · ${sites.length} sites`,
          },
          { label: 'Leads', value: leads.length, foot: `${funnel.novo} novos` },
          {
            label: 'Contatados',
            value: contactedCount(leads),
            foot: `${responseRate(leads)}% de resposta`,
            tone: 'blue',
          },
          { label: 'Respostas', value: answeredCount(leads), foot: 'inclui fechados' },
          {
            label: 'Fechados',
            value: closed.length,
            foot: `${brl(mrr(leads))}/mês`,
            tone: 'red',
          },
        ]}
      />

      <section className="dash-lead" aria-labelledby="dash-lead-title">
        <div className="dash-lead__head">
          <div>
            <h2 className="dash-lead__title" id="dash-lead-title">
              {goalReached
                ? 'Meta batida. Mantém o ritmo amanhã.'
                : `Faltam ${goal - todaySent} envios para fechar o dia.`}
            </h2>
            <p className="dash-lead__note">Meta de hoje · {goal} envios por dia</p>
          </div>
          <span className={`stamp ${goalReached ? 'stamp--fill-red' : ''}`}>
            {goalReached ? 'Batida' : 'Em andamento'}
          </span>
        </div>

        <div className="dash-lead__body">
          <div className="dash-lead__score">
            <div className="dash-lead__number">
              {todaySent}
              <small>/ {goal}</small>
            </div>
            <div className="dash-lead__label">envios hoje</div>
          </div>

          <div className="dash-lead__progress">
            <div className="dash-lead__bar">
              <i style={{ width: `${Math.min(100, (todaySent / goal) * 100)}%` }} />
            </div>
            <div className="dash-lead__stats">
              <div className="dash-lead__stat">
                <span>Semana</span>
                <b>{weekSent}</b>
                <span>de {weekGoal}</span>
              </div>
              <div className="dash-lead__stat">
                <span>Follow-ups</span>
                <b>{due.length}</b>
                <span>pendentes</span>
              </div>
              <div className="dash-lead__stat">
                <span>Fechados</span>
                <b>{closed.length}</b>
                <span>clientes</span>
              </div>
            </div>
          </div>

          <div className="dash-lead__actions">
            <Link className="btn btn--red btn--sm" to="/app/crm?view=hoje">
              <Icon name="send" size={14} />
              Fazer follow-up
            </Link>
            <Link className="btn btn--ghost btn--sm" to="/app/primeiro-cliente">
              Plano de 7 dias
            </Link>
          </div>
        </div>
      </section>

      <div className="dash-row">
        <section className="dash-section">
          <SectionHead
            title="Atividade recente"
            note="O que aconteceu na sua operação"
            action={
              <Link className="app-card__link" to="/app/crm">
                Abrir CRM <Icon name="arrow-right" size={11} />
              </Link>
            }
          />

          {activity.length === 0 ? (
            <div className="app-activity__empty">
              Ainda sem movimento. Crie um cardápio e envie para um lead para começar.
            </div>
          ) : (
            <ul className="app-activity">
              {activity.map((item) => (
                <li key={item.id}>
                  <Link className="app-activity__item" to={`/app/crm?lead=${item.leadId}`}>
                    <span className="app-activity__icon">
                      <Icon name={ACTIVITY_ICON[item.kind] ?? 'message'} size={14} />
                    </span>
                    <span className="app-activity__main">
                      <span className="app-activity__title">
                        {item.leadName} · {item.title}
                      </span>
                      <span className="app-activity__detail">{item.detail}</span>
                    </span>
                    <span className="app-activity__meta">{formatDate(item.at).slice(0, 5)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-section">
          <SectionHead
            title="Funil"
            note={`${brl(mrr(leads))}/mês`}
            action={
              <Link className="app-card__link" to="/app/crm">
                Abrir <Icon name="arrow-right" size={11} />
              </Link>
            }
          />
          <div className="app-funnel">
            {[
              { key: 'novo', label: 'Novo', value: funnel.novo },
              { key: 'contatado', label: 'Contatado', value: funnel.contatado },
              { key: 'negociando', label: 'Negociando', value: funnel.negociando },
              { key: 'fechado', label: 'Fechado', value: funnel.fechado },
            ].map((row) => {
              const total = Math.max(1, leads.length)
              return (
                <div className="app-funnel__row" key={row.key}>
                  <span className="app-funnel__label">{row.label}</span>
                  <span className="app-funnel__track">
                    <span
                      className={`app-funnel__fill app-funnel__fill--${row.key}`}
                      style={{ width: `${(row.value / total) * 100}%`, display: 'block' }}
                    />
                  </span>
                  <span className="app-funnel__value">{row.value}</span>
                </div>
              )
            })}
          </div>
          <div className="app-funnel__foot">
            {funnel.novo} para abordar · {due.length} follow-ups · {brl(setupRevenue(leads))} em
            setups
          </div>

          <div className="dash-section__sub">
            <SectionHead
              title="Primeiro cliente"
              note={`${checklist.filter((item) => item.done).length}/4`}
            />
            {checklist.map((item) => (
              <Link
                className={`app-check ${item.done ? 'is-done' : ''}`}
                to={item.to}
                key={item.title}
              >
                <span className="app-check__icon">
                  <Icon name={item.done ? 'check-circle' : 'target'} size={15} />
                </span>
                <span className="app-check__main">
                  <span className="app-check__title">{item.title}</span>
                  <span className="app-check__note">{item.note}</span>
                </span>
                <Icon name="arrow-right" size={13} className="app-check__go" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="dash-section dash-section--projects">
        <SectionHead
          title="Projetos recentes"
          note="Cardápios e sites prontos para mostrar"
          action={
            <Link className="app-card__link" to="/app/projetos">
              Ver todos <Icon name="arrow-right" size={11} />
            </Link>
          }
        />

        {recentProjects.length === 0 ? (
          <div className="app-activity__empty">
            Nenhum projeto ainda. O primeiro leva menos de 10 minutos.
          </div>
        ) : (
          <div className="app-mini-projects">
            {recentProjects.map((project) => {
              if (project.kind === 'menu') {
                const lead = leads.find((item) => item.menuId === project.menu.id)
                return (
                  <Link
                    className="app-mini"
                    to={lead ? `/app/projetos/${lead.id}` : `/c/${project.menu.slug}`}
                    key={`menu-${project.menu.id}`}
                  >
                    <ProjectCover menu={project.menu} compact />
                    <div className="app-mini__info">
                      <span>{project.menu.name}</span>
                      <span>{formatDate(project.updatedAt).slice(0, 5)}</span>
                    </div>
                  </Link>
                )
              }
              const lead = leads.find((item) => item.siteId === project.site.id)
              return (
                <Link
                  className="app-mini"
                  to={lead ? `/app/sites/${lead.id}` : `/s/${project.site.slug}`}
                  key={`site-${project.site.id}`}
                >
                  <SiteCover site={project.site} compact />
                  <div className="app-mini__info">
                    <span>{project.site.name}</span>
                    <span>{formatDate(project.updatedAt).slice(0, 5)}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
