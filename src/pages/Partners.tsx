import { Link } from 'react-router-dom'
import { SITE } from '../config'
import { brlRound } from '../lib/format'
import { PLANS } from '../lib/plans'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Ticker } from '../components/Ticker'
import { DeveloperCalculator } from '../components/DeveloperCalculator'
import { Reveal } from '../components/Reveal'
import { Icon } from '../components/Icon'

const PARTNER_TICKER = [
  'CRM com funil e follow-up',
  'Templates de cardápio e site',
  'Prospecção em massa',
  'Sites one-page',
  'Contratos e precificação',
  'Teste PRO de 7 dias',
]

const PARTNER_FAQ = [
  {
    q: 'Preciso saber programar?',
    a: 'Para operar, não. O editor gera o cardápio, publica e exporta o HTML. Se você programa, melhor ainda: o arquivo é seu e pode hospedar onde quiser.',
  },
  {
    q: 'A plataforma encontra os clientes?',
    a: 'Hoje a busca é manual: você importa uma lista do Google Maps em massa e o CRM organiza a abordagem. A busca automática no Google Places está no roadmap.',
  },
  {
    q: 'Quem paga a plataforma?',
    a: 'Você. O restaurante paga pelo cardápio; a assinatura é sua. A Prato Digital não intermedeia o pagamento do restaurante.',
  },
  {
    q: 'Posso usar a minha marca?',
    a: 'O white-label por parceiro está previsto para o plano Agência e entra em uma próxima versão. Hoje o cardápio e o HTML levam a assinatura Prato Digital.',
  },
  {
    q: 'Tem fidelidade?',
    a: 'A cobrança é mensal e você pode cancelar quando quiser. O acesso continua até o fim do período pago.',
  },
  {
    q: 'A plataforma só cria cardápios?',
    a: 'Não. Você pode gerar cardápio, site one-page ou os dois. O site serve para qualquer negócio local; o cardápio é para food.',
  },
  {
    q: 'Os projetos são ilimitados?',
    a: 'Starter tem 10 projetos (cardápios e sites), Pro tem 40 e Agência é ilimitado. Ajustes de preço, item e horário não gastam limite.',
  },
  {
    q: 'Como recebo do restaurante?',
    a: 'Direto, por Pix, cartão ou o meio que você combinar. A plataforma serve para encontrar, montar e organizar; o dinheiro do cliente é seu.',
  },
  {
    q: 'O pagamento da assinatura é real?',
    a: 'Nesta demonstração, não. O checkout é simulado e nenhum cartão é cobrado. Em produção, entra um gateway de pagamento.',
  },
]

export function Partners() {
  useDocumentTitle('Prato Digital — plataforma para desenvolvedores')

  return (
    <div className="site">
      <SiteHeader active="parceiros" />

      <main id="conteudo">
        <div className="wrap">
          <section className="partner-hero">
            <div>
              <h1 className="partner-hero__title">
                Sua operação de cardápios e sites. <em>Com clientes na mesa.</em>
              </h1>
              <p className="partner-hero__deck">
                Assine a plataforma, encontre restaurantes e negócios locais, gere cardápios e
                sites e feche vendas sem montar estrutura. Você fica com o cliente; a gente cuida
                do operacional.
              </p>
              <div className="hero__actions">
                <Link className="btn btn--red" to="/criar-conta">
                  <Icon name="rocket" size={16} />
                  Testar 7 dias
                </Link>
                <a className="btn btn--ghost" href="#planos">
                  Ver planos
                  <Icon name="arrow-down" size={16} />
                </a>
              </div>
              <div className="hero__rates">
                <div className="hero__rate">
                  <b>R$ 49</b>
                  <span>por mês, para começar</span>
                </div>
                <div className="hero__rate">
                  <b>40</b>
                  <span>projetos no Pro</span>
                </div>
                <div className="hero__rate">
                  <b>48h</b>
                  <span>por cardápio</span>
                </div>
              </div>
            </div>

            <aside className="partner-ticket" aria-label="Simulação com seis clientes">
              <div className="partner-ticket__head">
                <span>Simulação · 6 clientes</span>
                <span className="stamp stamp--blue stamp--flat">Assinatura</span>
              </div>
              <div className="partner-ticket__row">
                <span>Restaurantes pagam você (6 × {brlRound(SITE.price.monthly)})</span>
                <b>{brlRound(SITE.price.monthly * 6)}</b>
              </div>
              <div className="partner-ticket__row">
                <span>Sua assinatura Pro</span>
                <b>− {brlRound(97)}</b>
              </div>
              <div className="partner-ticket__row partner-ticket__row--total">
                <span>Sobra no seu caixa</span>
                <b>{brlRound(SITE.price.monthly * 6 - 97)}</b>
              </div>
              <div className="partner-ticket__foot">
                Mais {brlRound(SITE.price.setup * 6)} em setups no primeiro mês. O preço do
                cardápio é você quem define.
              </div>
            </aside>
          </section>
        </div>

        <Ticker items={PARTNER_TICKER} />

        <section className="section" id="modelo">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                Você vende. <span className="red">A plataforma entrega.</span>
              </h2>
              <div className="section__note">Uma assinatura, várias frentes</div>
            </div>

            <div className="perks">
              <article className="perk">
                <Icon name="columns" size={26} />
                <h3>Clientes na mesa</h3>
                <p>
                  CRM com funil, follow-up e importação de lista. O lead entra, o cardápio é
                  gerado e a conversa fica organizada.
                </p>
              </article>
              <article className="perk">
                <Icon name="file-text" size={26} />
                <h3>Cardápio e site em 48h</h3>
                <p>
                  Editor com prévia, templates por ramo e export HTML com fontes embutidas.
                  Você entrega um link e um site, não uma promessa.
                </p>
              </article>
              <article className="perk">
                <Icon name="wallet" size={26} />
                <h3>Ferramentas de fechamento</h3>
                <p>
                  Precificação, proposta e contrato no mesmo lugar. Chega de improvisar o preço
                  na conversa do WhatsApp.
                </p>
              </article>
              <article className="perk">
                <Icon name="users" size={26} />
                <h3>Sua operação</h3>
                <p>
                  O restaurante paga você. A plataforma é a sua assinatura. O white-label por
                  parceiro está no roadmap do plano Agência.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section--tight">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                Três passos <span className="red">para o primeiro cliente.</span>
              </h2>
              <div className="section__note">O teste PRO dura 7 dias</div>
            </div>
            <div className="partner-steps">
              <div className="step">
                <div className="step__no" aria-hidden="true">
                  1
                </div>
                <h3 className="step__title">Assine e entre</h3>
                <p>
                  Escolha um plano e abra a plataforma. O CRM, os templates e o editor já estão
                  prontos — sem instalar nada.
                </p>
              </div>
              <div className="step">
                <div className="step__no" aria-hidden="true">
                  2
                </div>
                <h3 className="step__title">Importe e monte</h3>
                <p>
                  Cole uma lista de negócios, escolha o nicho e gere o cardápio ou site com o
                  nome, o bairro e o WhatsApp do cliente.
                </p>
              </div>
              <div className="step">
                <div className="step__no" aria-hidden="true">
                  3
                </div>
                <h3 className="step__title">Envie e feche</h3>
                <p>
                  O CRM monta a mensagem com o link. Acompanhe status, follow-up e contrato até
                  marcar o lead como fechado.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="margem">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                A margem <span className="red">fica com você.</span>
              </h2>
              <div className="section__note">Arraste para simular</div>
            </div>
            <Reveal>
              <DeveloperCalculator />
            </Reveal>
            <p className="builder-hint" style={{ marginTop: 12, maxWidth: '70ch' }}>
              Valores de lançamento. A assinatura é sua; o restaurante paga pelo cardápio. A
              conta usa a oferta sugerida de R$ 597 + R$ 97/mês.
            </p>
          </div>
        </section>

        <section className="section" id="planos">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                Um plano para <span className="red">cada fase.</span>
              </h2>
              <div className="section__note">Cobrança mensal · sem fidelidade</div>
            </div>

            <div className="plans3">
              {PLANS.map((plan) => (
                <div className={`plan ${plan.highlight ? 'plan--dark' : ''}`} key={plan.id}>
                  <div className="plan__name">
                    <span>{plan.name}</span>
                    {plan.highlight && (
                      <span className="stamp stamp--red" style={{ color: 'var(--yellow)' }}>
                        Recomendado
                      </span>
                    )}
                  </div>
                  <div className="plan__price">
                    <b>R$ {plan.price}</b>
                    <span>
                      por mês
                      <br />
                      cancele quando quiser
                    </span>
                  </div>
                  <div className="plan__once">
                    {plan.menus === null ? 'Projetos ilimitados' : `Até ${plan.menus} projetos ativos`}{' '}
                    · {plan.seats} usuário(s)
                  </div>
                  <ul className="plan__list">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Icon name="check" size={15} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="plan__cta">
                    <Link
                      className={`btn ${plan.highlight ? 'btn--paper' : 'btn--red'} btn--block`}
                      to="/app/planos"
                    >
                      Assinar {plan.name}
                      <Icon name="arrow-right" size={15} />
                    </Link>
                    <p className="plan__note">Pagamento simulado nesta demonstração.</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="builder-hint" style={{ marginTop: 12 }}>
              Teste PRO de 7 dias. Em produção, o checkout é conectado a um gateway e a nota
              fiscal é emitida para o desenvolvedor. Multiusuário, white-label e busca automática
              no Maps entram com o backend.
            </p>
          </div>
        </section>

        <section className="section" id="perguntas">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                Antes de <span className="red">assinar.</span>
              </h2>
              <div className="section__note">O que todo dev pergunta</div>
            </div>
            <div className="faq">
              {PARTNER_FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final">
          <div className="wrap">
            <div className="coupon final__coupon">
              <div>
                <div className="coupon__cut">
                  <Icon name="scissors" size={13} /> Ficha do desenvolvedor
                </div>
                <h2 className="final__title">
                  Sua próxima operação <em>começa com um teste.</em>
                </h2>
                <p className="final__body">
                  Entre na plataforma, importe uma lista e gere o primeiro cardápio ou site. O
                  teste PRO dura 7 dias. Se não fizer sentido, você não assina.
                </p>
              </div>
              <div className="final__aside">
                <Link className="btn btn--red" to="/criar-conta">
                  <Icon name="rocket" size={17} />
                  Testar 7 dias
                </Link>
                <Link className="btn btn--ghost" to="/app/planos">
                  Comparar planos
                </Link>
                <span className="final__meta">
                  Plataforma para desenvolvedores · {SITE.city}
                  <br />
                  Pagamento simulado nesta demonstração.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
