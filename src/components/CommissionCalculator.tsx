import { useState, type CSSProperties } from 'react'
import { brlRound } from '../lib/format'
import { siteMessage, siteWhatsApp } from '../lib/whatsapp'
import { WhatsAppIcon } from './Icon'

function rangeFill(value: number, min: number, max: number): CSSProperties {
  const percent = ((value - min) / (max - min)) * 100
  return { '--fill': `${percent}%` } as CSSProperties
}

export function CommissionCalculator() {
  const [commission, setCommission] = useState(27)
  const [orders, setOrders] = useState(120)
  const [ticket, setTicket] = useState(45)

  const monthly = orders * ticket * (commission / 100)

  return (
    <div className="calc">
      <div className="calc__head">
        <h2 className="calc__title">
          Faça a conta <em>do app.</em>
        </h2>
        <span className="stamp stamp--red" style={{ color: 'var(--yellow)' }}>
          Estimativa
        </span>
      </div>

      <div className="calc__grid">
        <div className="calc__controls">
          <div className="calc__field">
            <label htmlFor="calc-commission">
              Comissão média do app <b>{commission}%</b>
            </label>
            <input
              id="calc-commission"
              type="range"
              min={0}
              max={40}
              step={1}
              value={commission}
              style={rangeFill(commission, 0, 40)}
              onChange={(event) => setCommission(Number(event.target.value))}
            />
          </div>
          <div className="calc__field">
            <label htmlFor="calc-orders">
              Pedidos por mês <b>{orders}</b>
            </label>
            <input
              id="calc-orders"
              type="range"
              min={10}
              max={600}
              step={10}
              value={orders}
              style={rangeFill(orders, 10, 600)}
              onChange={(event) => setOrders(Number(event.target.value))}
            />
          </div>
          <div className="calc__field">
            <label htmlFor="calc-ticket">
              Ticket médio <b>{brlRound(ticket)}</b>
            </label>
            <input
              id="calc-ticket"
              type="range"
              min={15}
              max={200}
              step={5}
              value={ticket}
              style={rangeFill(ticket, 15, 200)}
              onChange={(event) => setTicket(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="calc__result" aria-live="polite">
          <div className="calc__result-label">Você deixa no app, por mês</div>
          <div className="calc__number">
            {brlRound(monthly)}
            <small>/mês</small>
          </div>
          <div className="calc__year">
            Em um ano: <b>{brlRound(monthly * 12)}</b>
            <br />
            Com cardápio próprio, esse dinheiro fica no seu caixa.
          </div>
        </div>
      </div>

      <div className="calc__foot">
        <p className="calc__note">
          Estimativa com os números que você escolheu. Ajuste a comissão do app que você usa
          hoje — cada plataforma cobra um percentual diferente.
        </p>
        <a
          className="btn btn--paper"
          href={siteWhatsApp(siteMessage('restaurante'))}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon size={17} />
          Quero parar de pagar comissão
        </a>
      </div>
    </div>
  )
}
