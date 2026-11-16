import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '../../config'
import { brl, slugify } from '../../lib/format'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { Icon } from '../../components/Icon'
import { PageHead, UpgradeGate } from '../ui'

const DEFAULT_SCOPE =
  'Cardápio online com link próprio, organização de categorias, descrições e preços, botão de pedido no WhatsApp, hospedagem e manutenção mensal. Atualizações pequenas de item, preço e horário inclusas.'

export function AppContracts() {
  const plan = usePlan()
  const { leads, notify, session } = useStore()
  const ownerName = session?.name ?? SITE.owner.name
  const ownerEmail = session?.email ?? SITE.email
  const ownerCity = session?.city ?? SITE.city
  const [leadId, setLeadId] = useState('')
  const [client, setClient] = useState('Restaurante Exemplo')
  const [documentNumber, setDocumentNumber] = useState('')
  const [city, setCity] = useState<string>(ownerCity)
  const [setup, setSetup] = useState<number>(SITE.price.setup)
  const [monthly, setMonthly] = useState<number>(SITE.price.monthly)
  const [deadline, setDeadline] = useState('48 horas')
  const [scope, setScope] = useState(DEFAULT_SCOPE)

  const contract = useMemo(
    () => `CONTRATO DE PRESTAÇÃO DE SERVIÇOS — CARDÁPIO DIGITAL

Prestador: ${ownerName} — ${ownerEmail} — ${ownerCity}
Contratante: ${client || '[NOME DO RESTAURANTE]'}${documentNumber ? ` — ${documentNumber}` : ''} — ${city}

1. OBJETO
O prestador criará e manterá um cardápio digital para o contratante, acessível por link próprio, com as categorias, itens, descrições e preços informados pelo contratante.

Escopo: ${scope}

2. PRAZO DE ENTREGA
A primeira versão será entregue em até ${deadline} após o recebimento do material completo (cardápio atual, preços e número de WhatsApp para pedidos).

3. INVESTIMENTO
Criação: ${brl(setup)}, paga uma única vez na aprovação.
Manutenção: ${brl(monthly)} por mês, incluindo hospedagem, suporte e pequenas atualizações.
Não há comissão por pedido nem taxa por transação.

4. OBRIGAÇÕES DO CONTRATANTE
Fornecer as informações do cardápio e manter o número de WhatsApp apto a receber pedidos. Solicitar alterações por escrito no canal combinado.

5. OBRIGAÇÕES DO PRESTADOR
Manter o cardápio no ar durante a vigência, aplicar atualizações solicitadas e comunicar manutenções programadas com antecedência.

6. DOMÍNIO E DADOS
O domínio será registrado no nome do contratante. O contratante é responsável pelos dados e imagens enviados. O prestador tratará os dados conforme a LGPD e não os utilizará para finalidade diversa da execução deste contrato.

7. CANCELAMENTO
Qualquer parte pode encerrar a manutenção com 30 dias de aviso. O valor de criação não é reembolsável após a publicação. O link e o domínio permanecem com o contratante enquanto a manutenção estiver ativa.

8. FORO
Fica eleito o foro da comarca de ${city} para dirimir eventuais conflitos.

${city}, ${new Date().toLocaleDateString('pt-BR')}.

_____________________________
${ownerName} — prestador

_____________________________
${client || '[NOME DO RESTAURANTE]'} — contratante

Modelo simples de contrato. Revise com um advogado antes de usar em produção.`,
    [client, documentNumber, city, setup, monthly, deadline, scope, ownerName, ownerEmail, ownerCity],
  )

  if (!plan.allows('pro')) {
    return (
      <div className="app-page">
        <PageHead title="Contratos" subtitle="Gere um contrato simples para o cliente." />
        <UpgradeGate
          feature="Contratos prontos"
          required="pro"
          description="Gere um contrato de prestação de serviços com escopo, prazo e valores. Incluso no plano Pro."
        />
      </div>
    )
  }

  async function copyContract() {
    try {
      await navigator.clipboard.writeText(contract)
      notify('Contrato copiado.')
    } catch {
      notify('Não foi possível copiar. Selecione o texto manualmente.')
    }
  }

  function downloadContract() {
    const blob = new Blob([contract], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `contrato-${slugify(client) || 'cliente'}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
    notify('Contrato baixado em .txt.')
  }

  function pullLead(id: string) {
    setLeadId(id)
    const lead = leads.find((item) => item.id === id)
    if (!lead) return
    setClient(lead.name)
    setCity(lead.neighborhood || SITE.city)
  }

  return (
    <div className="app-page">
      <PageHead
        title="Contratos"
        subtitle="Um modelo simples para fechar o cliente sem improvisar. Revise com um advogado."
        actions={
          <>
            <button type="button" className="btn btn--ghost btn--sm" onClick={downloadContract}>
              <Icon name="download" size={15} />
              Baixar .txt
            </button>
            <button type="button" className="btn btn--red btn--sm" onClick={copyContract}>
              <Icon name="copy" size={15} />
              Copiar contrato
            </button>
          </>
        }
      />

      <div className="app-contract-grid">
        <section className="app-tool">
          <h2>Dados do contrato</h2>
          <p>Puxe de um lead do CRM ou preencha manualmente.</p>

          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="field span-2">
              <label htmlFor="contract-lead">Puxar de um lead</label>
              <select
                id="contract-lead"
                className="select"
                value={leadId}
                onChange={(event) => pullLead(event.target.value)}
              >
                <option value="">Preencher manualmente</option>
                {leads.map((lead) => (
                  <option value={lead.id} key={lead.id}>
                    {lead.name} — {lead.status}
                  </option>
                ))}
              </select>
            </div>
            <div className="field span-2">
              <label htmlFor="contract-client">Restaurante</label>
              <input
                id="contract-client"
                className="input"
                value={client}
                onChange={(event) => setClient(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="contract-document">CNPJ / CPF</label>
              <input
                id="contract-document"
                className="input"
                value={documentNumber}
                onChange={(event) => setDocumentNumber(event.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="field">
              <label htmlFor="contract-city">Cidade</label>
              <input
                id="contract-city"
                className="input"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="contract-setup">Criação (R$)</label>
              <input
                id="contract-setup"
                className="input"
                type="number"
                min={0}
                step={1}
                value={setup}
                onChange={(event) => setSetup(Number(event.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="contract-monthly">Mensal (R$)</label>
              <input
                id="contract-monthly"
                className="input"
                type="number"
                min={0}
                step={1}
                value={monthly}
                onChange={(event) => setMonthly(Number(event.target.value) || 0)}
              />
            </div>
            <div className="field span-2">
              <label htmlFor="contract-deadline">Prazo de entrega</label>
              <input
                id="contract-deadline"
                className="input"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </div>
            <div className="field span-2">
              <label htmlFor="contract-scope">Escopo</label>
              <textarea
                id="contract-scope"
                className="textarea"
                value={scope}
                onChange={(event) => setScope(event.target.value)}
              />
            </div>
          </div>
          <p className="app-note" style={{ marginTop: 10 }}>
            O contrato é gerado no navegador. Nenhum dado é enviado para fora.
          </p>
        </section>

        <section className="app-contract">
          <div className="app-section__head" style={{ marginBottom: 0 }}>
            <h2 className="app-section__title">Prévia do contrato</h2>
            <span className="app-section__aside">Modelo simples</span>
          </div>
          <pre className="app-contract__preview">{contract}</pre>
        </section>
      </div>

      <p className="app-note" style={{ marginTop: 12 }}>
        Precisa de outro modelo? Veja o kit de vendas em{' '}
        <Link to="/app/area-de-membros">Área de membros</Link>.
      </p>
    </div>
  )
}
