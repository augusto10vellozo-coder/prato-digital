import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { onlyDigits } from '../../lib/format'
import { useStore, type NewLeadInput } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { Icon } from '../../components/Icon'
import { PageHead, UpgradeGate } from '../ui'

const SAMPLE = `Smash do Zé; Hauer; (41) 99999-1111; Hamburgueria
Pizza da Praça; Centro; (41) 99999-2222; Pizzaria
Açaí da Vila; Portão; (41) 99999-3333; Açaí
Boteco do Leme; Vila Izabel; (41) 99999-4444; Lanches`

interface ParsedLead {
  name: string
  neighborhood: string
  phone: string
  category: string
}

export function AppBulk() {
  const plan = usePlan()
  const { addLeads } = useStore()
  const [text, setText] = useState('')
  const [created, setCreated] = useState(0)

  const parsed = useMemo<ParsedLead[]>(() => {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const parts = line.split(/[;\t,]/).map((part) => part.trim())
        return {
          name: parts[0] ?? '',
          neighborhood: parts[1] ?? '',
          phone: onlyDigits(parts[2] ?? ''),
          category: parts[3] || 'Restaurante',
        }
      })
      .filter((item) => item.name.length > 1)
  }, [text])

  if (!plan.allows('pro')) {
    return (
      <div className="app-page">
        <PageHead title="Prospecção em massa" subtitle="Cole uma lista e crie vários leads de uma vez." />
        <UpgradeGate
          feature="Prospecção em massa"
          required="pro"
          description="Importe uma lista de negócios por colagem e coloque dezenas de leads no CRM em segundos. Inclusa no plano Pro."
        />
      </div>
    )
  }

  function importLeads() {
    if (parsed.length === 0) return
    const inputs: NewLeadInput[] = parsed.map((item) => ({
      name: item.name,
      category: item.category,
      neighborhood: item.neighborhood,
      phone: item.phone,
      rating: 0,
      reviews: 0,
      priority: 'media',
      notes: 'Importado em massa. Completar nota, avaliações e observações.',
      hasSite: false,
      hasMenu: false,
    }))
    addLeads(inputs)
    setCreated(parsed.length)
    setText('')
  }

  return (
    <div className="app-page">
      <PageHead
        title="Prospecção em massa"
        subtitle="Cole a lista do Maps ou da sua planilha. Cada linha vira um lead no CRM."
        actions={
          <Link className="btn btn--ghost btn--sm" to="/app/crm">
            <Icon name="columns" size={15} />
            Abrir CRM
          </Link>
        }
      />

      {created > 0 && (
        <div className="app-trial app-trial--active">
          <div className="app-trial__icon">
            <Icon name="check-circle" size={20} />
          </div>
          <div className="app-trial__main">
            <h2>{created} leads criados</h2>
            <p>Eles estão na coluna “Novo” do CRM, prontos para receber o primeiro contato.</p>
          </div>
          <Link className="btn btn--red btn--sm" to="/app/crm">
            Ver no CRM
          </Link>
        </div>
      )}

      <div className="app-columns">
        <section className="app-tool">
          <div className="app-card__head">
            <div>
              <h2>Cole a lista</h2>
              <p>Uma linha por negócio, separando com ponto e vírgula.</p>
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setText(SAMPLE)}
            >
              Colar exemplo
            </button>
          </div>

          <div className="field" style={{ marginTop: 10 }}>
            <label htmlFor="bulk-list">Formato: nome; bairro; telefone; categoria</label>
            <textarea
              id="bulk-list"
              className="textarea"
              style={{ minHeight: 230, fontFamily: 'var(--mono)', fontSize: 12 }}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={SAMPLE}
            />
          </div>

          <p className="app-note" style={{ marginTop: 8 }}>
            O telefone é opcional, mas sem WhatsApp o lead não avança. Nota, avaliações e site
            podem ser completados depois na ficha do lead.
          </p>

          <div className="app-actions-row" style={{ marginTop: 10 }}>
            <button
              type="button"
              className="btn btn--red btn--sm"
              onClick={importLeads}
              disabled={parsed.length === 0}
            >
              <Icon name="plus" size={14} />
              Criar {parsed.length || 0} lead(s)
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setText('')}>
              Limpar
            </button>
          </div>
        </section>

        <section className="app-card">
          <div className="app-card__head">
            <div>
              <div className="app-card__title">Prévia da importação</div>
              <div className="app-note">{parsed.length} linha(s) válida(s)</div>
            </div>
            <Icon name="list" size={17} />
          </div>

          {parsed.length === 0 ? (
            <p className="crm-today__empty">
              Cole pelo menos uma linha com nome do negócio. O resto a gente completa no CRM.
            </p>
          ) : (
            <div className="app-table-scroll">
              <table className="crm-table" style={{ minWidth: 0 }}>
                <thead>
                  <tr>
                    <th>Negócio</th>
                    <th>Bairro</th>
                    <th>Telefone</th>
                    <th>Ramo</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.slice(0, 8).map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td>{item.name}</td>
                      <td>{item.neighborhood || '—'}</td>
                      <td className="crm-date">{item.phone || 'sem telefone'}</td>
                      <td>{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsed.length > 8 && (
                <p className="app-note">+ {parsed.length - 8} linha(s) não exibidas.</p>
              )}
            </div>
          )}
        </section>
      </div>

      <p className="app-note" style={{ marginTop: 12 }}>
        Esta importação é manual. A busca automática no Google Maps depende de uma integração
        paga com o Google Places e está no roadmap.
      </p>
    </div>
  )
}
