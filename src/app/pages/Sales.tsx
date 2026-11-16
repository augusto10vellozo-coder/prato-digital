import { Link } from 'react-router-dom'
import { brl, formatDate } from '../../lib/format'
import { closedLeads, mrr, setupRevenue } from '../../lib/appStats'
import { useStore } from '../../lib/store'
import { Icon } from '../../components/Icon'
import { EmptyState, PageHead, StatStrip } from '../ui'

export function AppSales() {
  const { leads } = useStore()
  const closed = closedLeads(leads)
  const recurring = mrr(leads)
  const setup = setupRevenue(leads)
  const annual = recurring * 12 + setup
  const average = closed.length
    ? closed.reduce((sum, lead) => sum + (lead.deal?.monthly ?? 0), 0) / closed.length
    : 0

  return (
    <div className="app-page">
      <PageHead
        title="Minhas vendas"
        subtitle="Clientes fechados no CRM e a receita que eles representam. Valores sugeridos da oferta."
        actions={
          <Link className="btn btn--ghost btn--sm" to="/app/crm">
            <Icon name="columns" size={15} />
            Abrir CRM
          </Link>
        }
      />

      <StatStrip
        items={[
          { label: 'Clientes', value: closed.length, foot: 'fechados no CRM' },
          { label: 'Receita recorrente', value: brl(recurring), foot: 'por mês', tone: 'red' },
          { label: 'Setup acumulado', value: brl(setup), foot: 'criação dos cardápios' },
          { label: 'Projeção 12 meses', value: brl(annual), foot: 'recorrente + setup' },
          { label: 'Ticket médio', value: brl(average), foot: 'mensal por cliente' },
        ]}
      />

      {closed.length === 0 ? (
        <EmptyState
          icon="wallet"
          title="Nenhuma venda fechada ainda"
          body="Quando um lead fechar, marque o status como Fechado no CRM. Ele aparece aqui com os valores da oferta."
          action={
            <Link className="btn btn--red" to="/app/crm">
              Abrir CRM
            </Link>
          }
        />
      ) : (
        <div className="app-card" style={{ padding: 0 }}>
          <div style={{ padding: '12px 16px' }}>
            <div className="app-section__head" style={{ margin: 0 }}>
              <h2 className="app-section__title">Clientes fechados</h2>
              <span className="app-section__aside">{closed.length} contrato(s)</span>
            </div>
          </div>
          <div className="app-table-scroll">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Restaurante</th>
                  <th>Fechamento</th>
                  <th>Setup</th>
                  <th>Mensal</th>
                  <th>Total 12m</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {closed.map((lead) => {
                  const monthly = lead.deal?.monthly ?? 0
                  const leadSetup = lead.deal?.setup ?? 0
                  const closedEntry = [...lead.history]
                    .reverse()
                    .find((entry) => entry.kind === 'status' && entry.text.includes('fechado'))
                  return (
                    <tr key={lead.id} onClick={() => undefined}>
                      <td>
                        <div className="lead-name-cell">
                          <span className="lead-name">{lead.name}</span>
                          <span className="lead-meta">
                            {lead.category} · {lead.neighborhood}
                          </span>
                        </div>
                      </td>
                      <td className="crm-date">
                        {formatDate(closedEntry?.at ?? lead.lastContactAt)}
                      </td>
                      <td className="crm-date">{brl(leadSetup)}</td>
                      <td className="crm-date">{brl(monthly)}</td>
                      <td className="crm-date">{brl(leadSetup + monthly * 12)}</td>
                      <td>
                        <Link className="app-card__link" to={`/app/crm?lead=${lead.id}`}>
                          Abrir lead
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="app-note" style={{ marginTop: 12 }}>
        Os valores vêm da oferta padrão (R$ 597 de criação + R$ 97/mês) no momento em que o lead
        é marcado como fechado. Ajuste negociações específicas no histórico do lead.
      </p>
    </div>
  )
}
