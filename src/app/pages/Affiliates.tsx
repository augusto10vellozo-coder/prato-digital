import { SITE } from '../../config'
import { brl } from '../../lib/format'
import { PLANS } from '../../lib/plans'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { Icon } from '../../components/Icon'
import { PageHead, UpgradeGate } from '../ui'

export function AppAffiliates() {
  const plan = usePlan()
  const { notify, session } = useStore()
  const ownerName = session?.name ?? SITE.owner.name
  const code = ownerName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/\s+/g, '') + '10'
  const link =
    typeof window !== 'undefined'
      ? `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}/?ref=${code}`
      : ''

  if (!plan.allows('agency')) {
    return (
      <div className="app-page">
        <PageHead title="Afiliados" subtitle="Indique a plataforma e receba por indicação." />
        <UpgradeGate
          feature="Programa de afiliados"
          required="agency"
          description="Indique desenvolvedores para a Prato Digital e receba uma comissão sobre o primeiro mês de cada assinatura. Disponível no plano Agência."
        />
      </div>
    )
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      notify('Link de indicação copiado.')
    } catch {
      notify('Não foi possível copiar.')
    }
  }

  return (
    <div className="app-page">
      <PageHead
        title="Afiliados"
        subtitle="Indique um desenvolvedor. Ele assina. Você recebe uma comissão sobre o primeiro mês."
        actions={<span className="stamp stamp--red">Em demonstração</span>}
      />

      <div className="app-columns">
        <section className="app-card">
          <div className="app-card__head">
            <div>
              <div className="app-card__title">Seu link de indicação</div>
              <div className="app-note">Código {code}</div>
            </div>
            <Icon name="link" size={17} />
          </div>
          <div className="app-resource__script" style={{ maxHeight: 'none' }}>
            {link}
          </div>
          <div className="app-actions-row" style={{ marginTop: 10 }}>
            <button type="button" className="btn btn--red btn--sm" onClick={copy}>
              <Icon name="copy" size={14} />
              Copiar link
            </button>
          </div>
          <p className="app-note" style={{ marginTop: 10 }}>
            A comissão é calculada sobre o primeiro pagamento do plano indicado. Indicações
            recorrentes e pagamentos reais entram quando o gateway estiver conectado.
          </p>
        </section>

        <section className="app-card">
          <div className="app-card__head">
            <div>
              <div className="app-card__title">Sua comissão</div>
              <div className="app-note">20% do primeiro mês</div>
            </div>
            <span className="stamp stamp--ink">0 indicações</span>
          </div>
          <table className="wholesale" style={{ minWidth: 0 }}>
            <thead>
              <tr>
                <th>Plano</th>
                <th>Primeiro mês</th>
                <th>Sua comissão</th>
              </tr>
            </thead>
            <tbody>
              {PLANS.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{brl(item.price)}</td>
                  <td>{brl(item.price * 0.2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="app-note" style={{ marginTop: 10 }}>
            Ganhos atuais: <b>R$ 0,00</b>. Nenhum pagamento é processado nesta demonstração.
          </p>
        </section>
      </div>
    </div>
  )
}
