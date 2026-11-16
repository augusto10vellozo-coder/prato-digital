import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  FIRST_CONTACT,
  FOLLOW_UP,
  PRICE_ANSWER,
  PRICING_TIPS,
  PROPOSAL,
  QUALIFICATION,
} from '../../lib/playbook'
import { useStore } from '../../lib/store'
import { Icon } from '../../components/Icon'
import { PageHead } from '../ui'

function ResourceCard({
  title,
  description,
  text,
  children,
  action,
}: {
  title: string
  description: string
  text: string
  children?: ReactNode
  action?: ReactNode
}) {
  const { notify } = useStore()

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      notify('Copiado para a área de transferência.')
    } catch {
      notify('Não foi possível copiar.')
    }
  }

  return (
    <article className="app-resource">
      <div className="app-resource__title">{title}</div>
      <p className="app-resource__text">{description}</p>
      {children ?? <pre className="app-resource__script">{text}</pre>}
      <div className="app-actions-row">
        <button type="button" className="btn btn--ghost btn--sm" onClick={copy}>
          <Icon name="copy" size={13} />
          Copiar
        </button>
        {action}
      </div>
    </article>
  )
}

export function AppMembers() {
  return (
    <div className="app-page">
      <PageHead
        title="Área de membros"
        subtitle="O kit operacional: scripts, checklist, proposta e precificação para vender cardápios sem começar do zero."
        actions={
          <Link className="btn btn--ghost btn--sm" to="/app/primeiro-cliente">
            <Icon name="target" size={15} />
            Plano de 7 dias
          </Link>
        }
      />

      <div className="app-card" style={{ marginBottom: 14 }}>
        <div className="app-card__head">
          <div>
            <div className="app-card__title">Como usar este kit</div>
            <div className="app-note">Copie, ajuste o nome do restaurante e mande.</div>
          </div>
          <Icon name="award" size={18} />
        </div>
        <div className="app-columns">
          <div>
            <div className="app-first__title">Antes de abordar</div>
            <p className="app-first__text">
              Qualifique o restaurante no Google: nota, volume de avaliações, site e cardápio.
              O alvo é um negócio de bairro que depende de WhatsApp.
            </p>
          </div>
          <div>
            <div className="app-first__title">Depois do “sim”</div>
            <p className="app-first__text">
              Gere o cardápio no editor, mande o link e conduza o fechamento com o contrato e a
              proposta. O restaurante paga você; a plataforma é sua assinatura.
            </p>
          </div>
        </div>
      </div>

      <div className="app-resources">
        <ResourceCard
          title="Primeiro contato"
          description="Mensagem curta para abrir a conversa com o cardápio já pronto. Troque o link pelo cardápio do lead."
          text={FIRST_CONTACT}
          action={
            <Link className="btn btn--ghost btn--sm" to="/app/crm">
              Abrir CRM
            </Link>
          }
        />
        <ResourceCard
          title="Follow-up D+2"
          description="O follow-up é onde a maior parte das respostas acontece. Não venda de novo: pergunte se abriu."
          text={FOLLOW_UP}
        />
        <ResourceCard
          title="Resposta de preço"
          description="Quando o dono pergunta “quanto custa?”. Preço fechado, sem comissão e com o domínio no nome dele."
          text={PRICE_ANSWER}
          action={
            <Link className="btn btn--ghost btn--sm" to="/app/precificacao">
              Calcular preço
            </Link>
          }
        />
        <ResourceCard
          title="Proposta comercial"
          description="Um resumo para enviar depois da conversa. Ajuste valores e escopo no contrato."
          text={PROPOSAL}
          action={
            <Link className="btn btn--ghost btn--sm" to="/app/contratos">
              Gerar contrato
            </Link>
          }
        />
        <ResourceCard
          title="Checklist de qualificação"
          description="O filtro que evita perder tempo com rede grande ou restaurante sem operação."
          text={QUALIFICATION.map((item) => `• ${item}`).join('\n')}
          action={
            <Link className="btn btn--ghost btn--sm" to="/app/prospeccao">
              Importar lista
            </Link>
          }
        />
        <ResourceCard
          title="Precificação sem medo"
          description="Cinco regras para não vender barato e manter a recorrência saudável."
          text={PRICING_TIPS.map((item) => `• ${item}`).join('\n')}
          action={
            <Link className="btn btn--ghost btn--sm" to="/app/precificacao">
              Usar calculadora
            </Link>
          }
        />
      </div>
    </div>
  )
}
