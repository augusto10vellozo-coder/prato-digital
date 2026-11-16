import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '../config'
import { useStore } from '../lib/store'
import type { Menu } from '../lib/types'
import { siteMessage, siteWhatsApp } from '../lib/whatsapp'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Ticker } from '../components/Ticker'
import { MenuSheet } from '../components/MenuSheet'
import { Reveal } from '../components/Reveal'
import { CommissionCalculator } from '../components/CommissionCalculator'
import { Icon, WhatsAppIcon } from '../components/Icon'

const DEMO_SLUGS = ['fx-burgers', 'made-pizza', 'acai-saboroso']

const FAQ = [
  {
    q: 'Preciso ter fotos boas?',
    a: 'Não. Dá para começar com o cardápio que você já tem no balcão, uma foto do celular ou até uma lista no WhatsApp. Se tiver fotos dos pratos, melhor ainda — a gente organiza o resto.',
  },
  {
    q: 'Em quanto tempo fica pronto?',
    a: '48 horas depois que você mandar o cardápio e o número que vai receber os pedidos. Você aprova a prévia antes de publicar.',
  },
  {
    q: 'O link é meu?',
    a: 'Sim. O domínio fica registrado no seu nome. Se um dia quiser trocar de fornecedor, o endereço continua com você.',
  },
  {
    q: 'Como os pedidos chegam?',
    a: 'No WhatsApp que você já usa. O cliente escolhe os itens, toca no botão de pedido e a mensagem chega pronta. Sem carrinho, sem taxa e sem intermediário.',
  },
  {
    q: 'Tem comissão por pedido?',
    a: 'Não. Você paga a criação e a manutenção mensal. O pedido é seu, a conversa é sua e o cliente é seu.',
  },
  {
    q: 'Consigo atualizar preço depois?',
    a: 'Sim. Mudou o preço, acabou um item ou mudou o horário? Manda uma mensagem. Atualizações pequenas estão inclusas na manutenção.',
  },
  {
    q: 'Já tenho site. Faz sentido?',
    a: 'Faz. O cardápio pode ser uma página separada, com link próprio para colocar no Instagram, no Google e na bio. Quem já tem site costuma usar os dois.',
  },
  {
    q: 'Atendem fora de Curitiba?',
    a: 'Sim. O cardápio é online e a conversa é por WhatsApp. A entrega e o suporte são remotos.',
  },
]

export function Landing() {
  useDocumentTitle('Prato Digital — cardápio online em 48h')
  const { menus, session } = useStore()
  const demoMenus = DEMO_SLUGS.map((slug) => menus.find((menu) => menu.slug === slug)).filter(
    (menu): menu is Menu => Boolean(menu),
  )
  const [active, setActive] = useState(0)
  const [swapping, setSwapping] = useState(false)

  const menu = demoMenus[active] ?? demoMenus[0]

  function selectDemo(index: number) {
    if (index === active) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setActive(index)
      return
    }
    setSwapping(true)
    window.setTimeout(() => {
      setActive(index)
      setSwapping(false)
    }, 150)
  }

  const heroMenu = menus.find((item) => item.slug === 'fx-burgers') ?? menus[0]

  return (
    <div className="site">
      <SiteHeader active="home" />

      <main id="conteudo">
        <div className="wrap">
          <div className="hero">
            <div>
              <h1 className="hero__headline">
                Seu cardápio <span className="red">na mão</span> do cliente.
              </h1>
              <p className="hero__deck">
                Sem app, sem comissão por pedido e sem PDF borrado no Instagram. A gente monta
                o cardápio do seu restaurante e coloca no ar em 48 horas — com link próprio e
                pedido direto no WhatsApp.
              </p>
              <div className="hero__actions">
                <a
                  className="btn btn--red"
                  href={siteWhatsApp(siteMessage('restaurante'))}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon size={17} />
                  Quero meu cardápio
                </a>
                <a className="btn btn--ghost" href="#cardapios">
                  Ver um exemplo
                  <Icon name="arrow-down" size={16} />
                </a>
              </div>
              <div className="hero__rates" aria-label="Resumo da oferta">
                <div className="hero__rate">
                  <b>48h</b>
                  <span>para publicar</span>
                </div>
                <div className="hero__rate">
                  <b>R$ 97</b>
                  <span>por mês, sem comissão</span>
                </div>
                <div className="hero__rate">
                  <b>0%</b>
                  <span>de taxa por pedido</span>
                </div>
              </div>
            </div>

            <aside className="hero__aside">
              <div className="hero__insert-label">Suplemento de hoje</div>
              <div className="hero__insert-frame">
                <span className="hero__tape" aria-hidden="true" />
                {heroMenu ? (
                  <MenuSheet menu={heroMenu} categories={2} itemsPerCategory={4} />
                ) : (
                  <div className="ticket" style={{ padding: 20, fontSize: 14 }}>
                    Gere um cardápio no painel para ver a prévia aqui.
                  </div>
                )}
              </div>
              <div className="hero__open">
                <span>Dados ilustrativos. O seu leva o seu nome.</span>
                <Link className="link-arrow" to={heroMenu ? `/c/${heroMenu.slug}` : '/app'}>
                  Abrir <Icon name="arrow-up-right" size={13} />
                </Link>
              </div>
            </aside>
          </div>
        </div>

        <Ticker />

        <section className="section" id="oferta">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                O cliente procura. <span className="red">Não encontra.</span>
              </h2>
              <div className="section__note">A cena se repete todo dia</div>
            </div>

            <div className="pains">
              <article className="pain">
                <h3 className="pain__title">O cardápio mora no story</h3>
                <p>
                  Foto tremida, preço de três meses atrás, sem horário e sem endereço. O cliente
                  desiste antes de mandar a primeira mensagem.
                </p>
                <div className="pain__foot">Solução: um link fixo, atualizado e legível.</div>
              </article>
              <article className="pain">
                <h3 className="pain__title">O PDF não abre no celular</h3>
                <p>
                  Aquele arquivo de 12 MB que ninguém consegue ler em pé na fila. O cliente quer
                  saber o preço, não baixar um arquivo.
                </p>
                <div className="pain__foot">Solução: uma página que abre em um toque.</div>
              </article>
              <article className="pain">
                <h3 className="pain__title">O app come a margem</h3>
                <p>
                  Cada pedido passa por uma plataforma que cobra comissão. No fim do mês, o
                  cliente é do app — e o lucro também.
                </p>
                <div className="pain__foot">Solução: pedido direto no seu WhatsApp.</div>
              </article>
            </div>

            <p className="section__deck" style={{ marginTop: 26, marginBottom: 0 }}>
              O cardápio online responde antes da pergunta: o que tem, quanto custa, abre hoje e
              como pede. É a vitrine que o seu restaurante já merece — só que no bolso do cliente.
            </p>
          </div>
        </section>

        <section className="section" id="cardapios">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                Três casas. <span className="red">Um padrão.</span>
              </h2>
              <div className="section__note">Troque a edição</div>
            </div>

            {menu ? (
              <div className="demo">
                <div className="demo__tabs" role="group" aria-label="Escolha um exemplo de cardápio">
                  {demoMenus.map((item, index) => (
                    <button
                      type="button"
                      className="demo__tab"
                      aria-pressed={index === active}
                      key={item.id}
                      onClick={() => selectDemo(index)}
                    >
                      <span className="demo__tab-main">
                        <span className="demo__tab-name">{item.name}</span>
                        <span className="demo__tab-desc">{item.tagline}</span>
                      </span>
                      <span className="demo__tab-cat">{item.category}</span>
                    </button>
                  ))}
                </div>

                <div className="demo__stage">
                  <div className="demo__stage-head">
                    <span>
                      <span className="dot" aria-hidden="true" /> {menu.name} · {menu.neighborhood}
                    </span>
                    <span>Dados ilustrativos</span>
                  </div>
                  <div className={`demo__sheet ${swapping ? 'is-swapping' : ''}`}>
                    <MenuSheet menu={menu} categories={3} itemsPerCategory={4} />
                  </div>
                  <div className="demo__links">
                    <Link className="btn btn--sm" to={`/c/${menu.slug}`}>
                      Abrir o cardápio completo
                      <Icon name="arrow-up-right" size={15} />
                    </Link>
                    <a className="link-arrow" href="#precos">
                      Quero um assim
                      <Icon name="arrow-right" size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty">
                <h2>Nenhum cardápio de exemplo na mesa.</h2>
                <p>Os dados de demonstração foram limpos. Recarregue no painel ou crie o primeiro.</p>
                <Link className="btn" to={session ? '/app' : '/entrar'}>
                  Ir para a plataforma
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                Da foto do WhatsApp <span className="red">ao link no ar.</span>
              </h2>
              <div className="section__note">Sem reunião, sem briefing longo</div>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step__no" aria-hidden="true">
                  1
                </div>
                <h3 className="step__title">Você manda o que tem</h3>
                <p>
                  Foto do cardápio do balcão, PDF, print do Instagram ou até uma lista digitada
                  no WhatsApp. Se está no seu jeito de trabalhar, serve.
                </p>
                <span className="step__time">5 minutos seus</span>
              </div>
              <div className="step">
                <div className="step__no" aria-hidden="true">
                  2
                </div>
                <h3 className="step__title">A gente monta e revisa</h3>
                <p>
                  Organizamos categorias, descrições e preços. Você recebe uma prévia no celular
                  e aprova o que estiver certo — ou pede para ajustar.
                </p>
                <span className="step__time">No mesmo dia</span>
              </div>
              <div className="step">
                <div className="step__no" aria-hidden="true">
                  3
                </div>
                <h3 className="step__title">Publica e manda o link</h3>
                <p>
                  O cardápio entra no ar com botão de pedido no WhatsApp. Mudou o preço depois?
                  Manda uma mensagem que a gente atualiza.
                </p>
                <span className="step__time">Até 48 horas</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="comissao">
          <div className="wrap">
            <Reveal>
              <CommissionCalculator />
            </Reveal>
          </div>
        </section>

        <section className="section" id="precos">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                Preço fechado. <span className="red">Sem taxa por pedido.</span>
              </h2>
              <div className="section__note">O cardápio é seu</div>
            </div>

            <div className="pricing">
              <div className="plan">
                <div className="plan__name">
                  <span>Cardápio Essencial</span>
                  <span className="stamp stamp--red">Sem comissão</span>
                </div>
                <div className="plan__price">
                  <b>R$ {SITE.price.setup}</b>
                  <span>
                    criação
                    <br />
                    uma vez
                  </span>
                </div>
                <div className="plan__once">
                  + R$ {SITE.price.monthly}/mês de hospedagem, manutenção e atualizações
                </div>
                <ul className="plan__list">
                  <li>
                    <Icon name="check" size={15} /> Cardápio online com link próprio
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Pedido direto no seu WhatsApp, sem intermediário
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Categorias, descrições, preços e horário
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Atualizações de item e preço por WhatsApp
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Domínio registrado no nome do restaurante
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Entrega em 48h depois do material
                  </li>
                </ul>
                <div className="plan__cta">
                  <a
                    className="btn btn--red btn--block"
                    href={siteWhatsApp(siteMessage('restaurante'))}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon size={17} />
                    Quero meu cardápio
                  </a>
                  <p className="plan__note">
                    Sem fidelidade de plataforma. O domínio e o cardápio ficam no seu nome.
                  </p>
                </div>
              </div>

              <div className="plan plan--dark">
                <div className="plan__name">
                  <span>Sob medida</span>
                  <span className="stamp stamp--red" style={{ color: 'var(--yellow)' }}>
                    Redes e franquias
                  </span>
                </div>
                <h3 className="plan__title">Seu cardápio é do tamanho da sua operação.</h3>
                <ul className="plan__list">
                  <li>
                    <Icon name="check" size={15} /> Várias unidades com o mesmo padrão
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Fotos de produto e identidade própria
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Site one-page com a marca da casa
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Cardápio impresso e QR code na mesa
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Integração com impressora e sistema de caixa
                  </li>
                </ul>
                <div className="plan__cta">
                  <a
                    className="btn btn--paper btn--block"
                    href={siteWhatsApp(
                      'Oi! Quero um orçamento para um cardápio sob medida. Meu restaurante é:',
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pedir orçamento
                    <Icon name="arrow-right" size={16} />
                  </a>
                  <p className="plan__note">
                    Sem compromisso. A gente entende a operação antes de falar de preço.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="perguntas">
          <div className="wrap">
            <div className="section__head">
              <h2 className="section__title">
                Perguntas que <span className="red">todo dono faz.</span>
              </h2>
              <div className="section__note">Resposta curta, sem letra miúda</div>
            </div>

            <div className="faq">
              {FAQ.map((item) => (
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
            <Reveal>
              <div className="coupon final__coupon">
                <div>
                  <div className="coupon__cut">
                    <Icon name="scissors" size={13} /> Recorte aqui e mande no WhatsApp
                  </div>
                  <h2 className="final__title">
                    Seu cardápio no ar <em>em 48 horas.</em>
                  </h2>
                  <p className="final__body">
                    Manda uma foto do cardápio atual e o número que recebe os pedidos. A gente
                    devolve uma prévia no celular — você decide depois de ver, não depois de
                    acreditar.
                  </p>
                </div>
                <div className="final__aside">
                  <a
                    className="btn btn--red"
                    href={siteWhatsApp(siteMessage('restaurante'))}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon size={18} />
                    Chamar no WhatsApp
                  </a>
                  <span className="final__meta">
                    {SITE.whatsappDisplay} · {SITE.hours}
                    <br />
                    Sem robô do outro lado. Sem compromisso.
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
