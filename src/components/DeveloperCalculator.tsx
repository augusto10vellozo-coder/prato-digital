import { useState, type CSSProperties } from 'react'
import { SITE } from '../config'
import { brlRound } from '../lib/format'
import { PLANS, getPlan } from '../lib/plans'
import type { PlanId } from '../lib/types'

function rangeFill(value: number, min: number, max: number): CSSProperties {
  const percent = ((value - min) / (max - min)) * 100
  return { '--fill': `${percent}%` } as CSSProperties
}

export function DeveloperCalculator() {
  const [clients, setClients] = useState(6)
  const [planId, setPlanId] = useState<PlanId>('pro')
  const plan = getPlan(planId)

  const revenue = clients * SITE.price.monthly
  const profit = revenue - plan.price
  const setup = clients * SITE.price.setup
  const firstMonth = setup + profit

  return (
    <div className="partner-calc">
      <div className="partner-calc__grid">
        <div>
          <div className="calc__field">
            <label htmlFor="dev-clients" style={{ color: 'var(--ink-soft)' }}>
              Restaurantes ativos na sua carteira <b style={{ color: 'var(--ink)' }}>{clients}</b>
            </label>
            <input
              id="dev-clients"
              type="range"
              min={1}
              max={30}
              step={1}
              value={clients}
              style={rangeFill(clients, 1, 30)}
              onChange={(event) => setClients(Number(event.target.value))}
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="dev-plan">Sua assinatura</label>
            <select
              id="dev-plan"
              className="select"
              value={planId}
              onChange={(event) => setPlanId(event.target.value as PlanId)}
            >
              {PLANS.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name} — R$ {item.price}/mês
                </option>
              ))}
            </select>
          </div>

          <p className="builder-hint" style={{ marginTop: 10, maxWidth: '48ch' }}>
            Cada cliente paga a você R$ {SITE.price.setup} de criação + R$ {SITE.price.monthly}/mês.
            A plataforma custa R$ {plan.price}/mês. O restaurante paga você; a assinatura é sua.
          </p>
        </div>

        <div className="partner-calc__result" aria-live="polite">
          <div className="partner-calc__label">Sobra no seu caixa</div>
          <div className="partner-calc__number">
            {brlRound(profit)}
            <span style={{ fontSize: 14, fontFamily: 'var(--mono)' }}>/mês</span>
          </div>
          <div className="partner-calc__sub">
            Faturamento dos clientes: <b>{brlRound(revenue)}/mês</b>
            <br />
            Sua assinatura: <b>− {brlRound(plan.price)}/mês</b>
            <br />
            No primeiro mês: <b>{brlRound(firstMonth)}</b> com os setups.
          </div>
        </div>
      </div>
    </div>
  )
}
