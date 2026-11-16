import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { brl } from '../../lib/format'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { Icon } from '../../components/Icon'
import { PageHead, UpgradeGate } from '../ui'

export function AppPricing() {
  const plan = usePlan()
  const { notify } = useStore()
  const [items, setItems] = useState(35)
  const [photos, setPhotos] = useState(true)
  const [units, setUnits] = useState(1)
  const [urgency, setUrgency] = useState<'24h' | '48h' | '7d'>('48h')

  const suggestion = useMemo(() => {
    const base = 397
    const itemCost = items * 4
    const photoCost = photos ? 150 : 0
    const unitCost = Math.max(0, units - 1) * 120
    const urgencyCost = urgency === '24h' ? 180 : urgency === '7d' ? -50 : 0
    const setup = Math.max(297, base + itemCost + photoCost + unitCost + urgencyCost)
    const monthly = 97 + (photos ? 20 : 0) + Math.max(0, units - 1) * 30
    return { base, itemCost, photoCost, unitCost, urgencyCost, setup, monthly }
  }, [items, photos, units, urgency])

  if (!plan.allows('pro')) {
    return (
      <div className="app-page">
        <PageHead title="Precificação" subtitle="Calcule quanto cobrar pelo cardápio." />
        <UpgradeGate
          feature="Precificação de cardápios"
          required="pro"
          description="Use a calculadora para montar o preço de criação e manutenção, com margem para a sua operação. Inclusa no plano Pro."
        />
      </div>
    )
  }

  async function copyProposal() {
    const text = `Proposta — Cardápio online

Criação: ${brl(suggestion.setup)} (uma vez)
Manutenção: ${brl(suggestion.monthly)}/mês
Prazo: ${urgency === '24h' ? '24 horas' : urgency === '48h' ? '48 horas' : 'até 7 dias'}
Itens: ${items}
${photos ? 'Inclui organização de fotos enviadas pelo restaurante.' : 'Cardápio tipográfico, sem fotos.'}
${units > 1 ? `Inclui ${units} unidades com o mesmo padrão.` : 'Uma unidade.'}

O domínio fica no nome do restaurante. Sem comissão por pedido.`
    try {
      await navigator.clipboard.writeText(text)
      notify('Proposta copiada.')
    } catch {
      notify('Não foi possível copiar a proposta.')
    }
  }

  return (
    <div className="app-page">
      <PageHead
        title="Precificação"
        subtitle="Uma sugestão para não vender barato. Você define o preço final e negocia o escopo."
        actions={
          <Link className="btn btn--ghost btn--sm" to="/app/contratos">
            <Icon name="file-text" size={15} />
            Gerar contrato
          </Link>
        }
      />

      <div className="app-tool-grid">
        <section className="app-tool">
          <h2>Monte o seu preço</h2>
          <p>Ajuste os pontos que mais mudam o trabalho. O valor final é seu.</p>

          <div className="calc__field" style={{ marginTop: 14 }}>
            <label htmlFor="pricing-items" style={{ color: 'var(--ink-soft)' }}>
              Itens no cardápio <b style={{ color: 'var(--ink)' }}>{items}</b>
            </label>
            <input
              id="pricing-items"
              type="range"
              min={10}
              max={150}
              step={5}
              value={items}
              style={
                { '--fill': `${((items - 10) / 140) * 100}%` } as CSSProperties
              }
              onChange={(event) => setItems(Number(event.target.value))}
            />
          </div>

          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="field">
              <label htmlFor="pricing-units">Unidades</label>
              <input
                id="pricing-units"
                className="input"
                type="number"
                min={1}
                max={10}
                value={units}
                onChange={(event) => setUnits(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}
              />
            </div>
            <div className="field">
              <label htmlFor="pricing-urgency">Prazo</label>
              <select
                id="pricing-urgency"
                className="select"
                value={urgency}
                onChange={(event) => setUrgency(event.target.value as '24h' | '48h' | '7d')}
              >
                <option value="24h">24 horas (urgência)</option>
                <option value="48h">48 horas (padrão)</option>
                <option value="7d">Até 7 dias</option>
              </select>
            </div>
          </div>

          <label className="check" style={{ marginTop: 10 }}>
            <input
              type="checkbox"
              checked={photos}
              onChange={(event) => setPhotos(event.target.checked)}
            />
            Organizar fotos enviadas pelo restaurante
          </label>

          <div className="app-note" style={{ marginTop: 12 }}>
            A calculadora é uma referência, não uma tabela fixa. Para cardápios com integração,
            impressão ou identidade visual, faça orçamento separado.
          </div>
        </section>

        <aside className="app-result">
          <div className="app-result__label">Preço sugerido de criação</div>
          <div className="app-result__value">{brl(suggestion.setup)}</div>
          <div className="app-result__sub">
            Manutenção sugerida: <b>{brl(suggestion.monthly)}/mês</b>
            <br />
            Total no primeiro ano: <b>{brl(suggestion.setup + suggestion.monthly * 12)}</b>
          </div>
          <div className="app-result__rows">
            <div>
              <span>Base</span>
              <b>{brl(suggestion.base)}</b>
            </div>
            <div>
              <span>Itens ({items})</span>
              <b>{brl(suggestion.itemCost)}</b>
            </div>
            <div>
              <span>Fotos</span>
              <b>{suggestion.photoCost ? brl(suggestion.photoCost) : '—'}</b>
            </div>
            <div>
              <span>Unidades extras</span>
              <b>{suggestion.unitCost ? brl(suggestion.unitCost) : '—'}</b>
            </div>
            <div>
              <span>Prazo</span>
              <b>{suggestion.urgencyCost ? brl(suggestion.urgencyCost) : '—'}</b>
            </div>
          </div>
          <div className="app-actions-row" style={{ marginTop: 14 }}>
            <button type="button" className="btn btn--red btn--sm" onClick={copyProposal}>
              <Icon name="copy" size={14} />
              Copiar proposta
            </button>
            <Link className="btn btn--ghost btn--sm" to="/app/contratos">
              Contrato
            </Link>
          </div>
        </aside>
      </div>

      <div className="app-card" style={{ marginTop: 16 }}>
        <div className="app-card__head">
          <div className="app-card__title">O que está incluso na oferta</div>
          <Link className="app-card__link" to="/app/area-de-membros">
            Kit de vendas <Icon name="arrow-right" size={11} />
          </Link>
        </div>
        <div className="app-columns">
          <ul className="app-plan__list" style={{ borderTop: 0, paddingTop: 0, margin: 0 }}>
            {[
              'Cardápio online com link próprio',
              'Categorias, descrições e preços',
              'Botão de pedido no WhatsApp',
              'Atualização de item e preço',
              'Hospedagem e manutenção',
            ].map((item) => (
              <li key={item}>
                <Icon name="check" size={12} /> {item}
              </li>
            ))}
          </ul>
          <ul className="app-plan__list" style={{ borderTop: 0, paddingTop: 0, margin: 0 }}>
            {[
              'Domínio no nome do restaurante',
              'Sem comissão por pedido',
              'Entrega em 48h após o material',
              'Ajustes pequenos por WhatsApp',
              'Export HTML para o cliente',
            ].map((item) => (
              <li key={item}>
                <Icon name="check" size={12} /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
