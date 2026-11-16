import { Link, NavLink } from 'react-router-dom'
import { SITE } from '../config'
import { useStore } from '../lib/store'
import { siteMessage, siteWhatsApp, telLink } from '../lib/whatsapp'
import { Icon, WhatsAppIcon } from './Icon'

interface SiteHeaderProps {
  active?: 'home' | 'parceiros'
}

function editionDate(): string {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function shortEditionDate(): string {
  const today = new Date()
  return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
}

export function SiteHeader({ active = 'home' }: SiteHeaderProps) {
  const isPartner = active === 'parceiros'
  const cta = siteMessage('restaurante')
  const { session } = useStore()
  const appPath = session ? '/app' : '/entrar'
  const startPath = session ? '/app' : '/criar-conta'

  return (
    <header className="masthead">
      <div className="wrap">
        <div className="masthead__meta">
          <div className="masthead__meta-group">
            <span>Edição {SITE.city}</span>
            <span className="masthead__meta-hide" aria-hidden="true">
              ·
            </span>
            <span className="meta-long">{editionDate()}</span>
            <span className="meta-short">{shortEditionDate()}</span>
            <span className="masthead__meta-hide" aria-hidden="true">
              ·
            </span>
            <span className="masthead__meta-hide">Ano 1 · Nº 01</span>
          </div>
          <div className="masthead__meta-group">
            <a className="masthead__phone" href={telLink(SITE.whatsapp)}>
              {SITE.whatsappDisplay}
            </a>
            <span className="masthead__meta-hide masthead__dot-sm" aria-hidden="true">
              ·
            </span>
            <NavLink to={appPath}>Plataforma</NavLink>
          </div>
        </div>

        <div className="masthead__main">
          <Link className="brand" to="/">
            <span className="brand__name">
              Prato Digital<span>.</span>
            </span>
            <span className="brand__tag" aria-hidden="true">
              Cardápios online para restaurantes de bairro. Feito em {SITE.city}.
            </span>
          </Link>
          <div className="masthead__aside">
            <div className="round-stamp" aria-hidden="true">
              Pronto em
              <b>48h</b>
            </div>
            {isPartner ? (
              <Link className="btn" to={startPath}>
                <Icon name="rocket" size={17} />
                Testar 7 dias
              </Link>
            ) : (
              <a className="btn" href={siteWhatsApp(cta)} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={17} />
                Quero meu cardápio
              </a>
            )}
          </div>
        </div>

        <nav className="nav" aria-label={isPartner ? 'Seções do site para parceiros' : 'Seções do site'}>
          {isPartner ? (
            <>
              <a href="#modelo">O modelo</a>
              <a href="#margem">Sua margem</a>
              <a href="#planos">Planos</a>
              <a href="#perguntas">Perguntas</a>
              <Link to="/">Para restaurantes</Link>
            </>
          ) : (
            <>
              <a href="#oferta">A oferta</a>
              <a href="#cardapios">Cardápios</a>
              <a href="#precos">Preços</a>
              <a href="#perguntas">Perguntas</a>
              <NavLink to="/parceiros">Para programadores</NavLink>
            </>
          )}
          <span className="nav__spacer" aria-hidden="true" />
          <NavLink to={appPath}>
            <Icon name="list" size={13} /> Plataforma
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
