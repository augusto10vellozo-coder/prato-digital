import { useState } from 'react'
import { Link } from 'react-router-dom'
import { brl, formatDate, todayISO } from '../../lib/format'
import { PLANS, getPlan } from '../../lib/plans'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import type { PlanId } from '../../lib/types'
import { Icon } from '../../components/Icon'
import { PageHead } from '../ui'

export function AppPlans() {
  const { data, changePlan } = useStore()
  const plan = usePlan()
  const [pending, setPending] = useState<PlanId | null>(null)
  const pendingPlan = pending ? getPlan(pending) : null
  const status = data.subscription.status
  const current = data.subscription.plan

  function confirm() {
    if (!pending) return
    changePlan(pending)
    setPending(null)
  }

  return (
    <div className="app-page">
      <PageHead
        title="Plano e créditos"
        subtitle="Assinatura mensal para acessar a plataforma, o CRM, os templates e as ferramentas de venda."
        actions={
          <span className="stamp stamp--red">Pagamento simulado</span>
        }
      />

      <section className="app-plan-current">
        <div>
          <div className="app-plan-current__name">Plano {plan.plan.name}</div>
          <div className="app-plan-current__status">
            <span
              className={`stamp ${
                status === 'active' ? 'stamp--fill-blue' : status === 'trial' ? 'stamp--fill-yellow' : 'stamp--fill-red'
              }`}
            >
              {status === 'active' ? 'Ativo' : status === 'trial' ? 'Teste' : 'Expirado'}
            </span>
            <span className="app-note">
              {status === 'trial'
                ? `Teste termina em ${plan.trialDaysLeft ?? 0} dia(s)`
                : status === 'active'
                  ? `Renova em ${formatDate(data.subscription.renewsAt)}`
                  : 'Assine para voltar a criar projetos'}
            </span>
          </div>
          <p className="app-plan-current__meta">
            {plan.plan.menus === null ? 'Projetos ilimitados' : `Até ${plan.plan.menus} projetos ativos`} ·{' '}
            {plan.plan.seats} usuário(s) · suporte por WhatsApp
            <br />
            Preço de lançamento: {brl(plan.plan.price)}/mês. Cancele quando quiser.
          </p>
          <div className="app-actions-row" style={{ marginTop: 12 }}>
            <a className="btn btn--red btn--sm" href="#planos">
              <Icon name="credit-card" size={14} />
              Alterar plano
            </a>
            <Link className="btn btn--ghost btn--sm" to="/app/conta">
              Dados da conta
            </Link>
          </div>
        </div>

        <div className="app-usage">
          <div className="app-usage__label">
            <span>Projetos ativos</span>
            <b>
              {plan.used} / {plan.limit ?? '∞'}
            </b>
          </div>
          <div className="app-usage__bar">
            <i
              style={{
                width: `${plan.limit ? Math.min(100, (plan.used / plan.limit) * 100) : 14}%`,
              }}
            />
          </div>
          <div className="app-plan-current__meta">
            {plan.remaining === Number.POSITIVE_INFINITY
              ? 'Sem limite de projetos neste plano.'
              : `${plan.remaining} projeto(s) ainda disponíveis.`}
            <br />
            Ajustes de preço, item e horário não gastam crédito.
          </div>
        </div>
      </section>

      <div className="app-section__head" id="planos">
        <h2 className="app-section__title">Escolha o plano</h2>
        <span className="app-section__aside">Cobrança mensal · cancele quando quiser</span>
      </div>

      <div className="app-plans">
        {PLANS.map((item) => {
          const isCurrent = item.id === current
          return (
            <article
              className={`app-plan ${item.highlight ? 'app-plan--highlight' : ''} ${isCurrent ? 'app-plan--current' : ''}`}
              key={item.id}
            >
              {isCurrent ? (
                <span className="app-plan__flag">Seu plano</span>
              ) : item.highlight ? (
                <span className="app-plan__flag">Recomendado</span>
              ) : null}
              <div className="app-plan__name">{item.name}</div>
              <div className="app-plan__tag">{item.tagline}</div>
              <div className="app-plan__price">
                <b>{brl(item.price)}</b>
                <span>/mês</span>
              </div>
              <div className="app-plan__once">
                {item.menus === null ? 'Projetos ilimitados' : `Até ${item.menus} projetos ativos`} ·{' '}
                {item.seats} usuário(s)
              </div>
              <ul className="app-plan__list">
                {item.features.map((feature) => (
                  <li key={feature}>
                    <Icon name="check" size={12} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`btn ${isCurrent ? 'btn--ghost' : item.highlight ? 'btn--red' : 'btn'} btn--sm btn--block`}
                onClick={() => setPending(item.id)}
              >
                {isCurrent ? 'Reativar / confirmar' : `Assinar ${item.name}`}
              </button>
            </article>
          )
        })}
      </div>

      <p className="app-note" style={{ marginTop: 10 }}>
        Multiusuário, white-label e busca automática no Google Maps entram com o backend e o
        login real. Nesta demonstração, o app é de um usuário e os pagamentos são simulados.
      </p>

      {pendingPlan && (
        <div className="app-checkout">
          <div className="app-checkout__main">
            <b>Confirmar assinatura do {pendingPlan.name}</b>
            {brl(pendingPlan.price)}/mês · {pendingPlan.menus === null ? 'projetos ilimitados' : `${pendingPlan.menus} projetos ativos`} ·{' '}
            {pendingPlan.seats} usuário(s)
            <br />
            <span>
              Pagamento simulado nesta demonstração. Nenhum cartão é cobrado e nenhum dado
              financeiro é coletado.
            </span>
          </div>
          <div className="app-checkout__actions">
            <button type="button" className="btn btn--red btn--sm" onClick={confirm}>
              <Icon name="check" size={14} />
              Confirmar assinatura
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setPending(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="app-columns" style={{ marginTop: 18 }}>
        <section className="app-card">
          <div className="app-card__head">
            <div>
              <div className="app-card__title">Créditos e limites</div>
              <div className="app-note">O que cada plano libera</div>
            </div>
            <Icon name="chart" size={17} />
          </div>
          <div className="app-result__rows">
            <div>
              <span>Projetos ativos</span>
              <b>
                {plan.used} / {plan.limit ?? '∞'}
              </b>
            </div>
            <div>
              <span>Leads no CRM</span>
              <b>Ilimitados</b>
            </div>
            <div>
              <span>Prospecção em massa</span>
              <b>{plan.allows('pro') ? 'Inclusa' : 'Plano Pro'}</b>
            </div>
            <div>
              <span>Contratos e precificação</span>
              <b>{plan.allows('pro') ? 'Inclusos' : 'Plano Pro'}</b>
            </div>
            <div>
              <span>Afiliados</span>
              <b>{plan.allows('agency') ? 'Incluso' : 'Plano Agência'}</b>
            </div>
            <div>
              <span>Busca automática no Google Maps</span>
              <b>Em breve</b>
            </div>
          </div>
          <p className="app-note" style={{ marginTop: 12 }}>
            A prospecção hoje é manual e em massa por colagem de lista. A busca automática
            depende de uma integração paga com o Google Places.
          </p>
        </section>

        <section className="app-card">
          <div className="app-card__head">
            <div>
              <div className="app-card__title">Faturas</div>
              <div className="app-note">Histórico desta conta</div>
            </div>
            <span className="stamp stamp--ink">Demo</span>
          </div>
          {status === 'trial' ? (
            <p className="crm-today__empty">
              Você está no teste. Nenhuma fatura foi emitida.
            </p>
          ) : (
            <table className="wholesale" style={{ minWidth: 0 }}>
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Plano</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{todayISO().slice(0, 7)}</td>
                  <td>{plan.plan.name}</td>
                  <td>{brl(plan.plan.price)}</td>
                  <td>Demonstração</td>
                </tr>
              </tbody>
            </table>
          )}
          <p className="app-note" style={{ marginTop: 12 }}>
            Em produção, esta área recebe o histórico do gateway de pagamento e o link do
            comprovante. Nada é cobrado na versão atual.
          </p>
        </section>
      </div>
    </div>
  )
}
