import { Link } from 'react-router-dom'
import { SITE } from '../config'
import { siteMessage, siteWhatsApp } from '../lib/whatsapp'
import { WhatsAppIcon } from './Icon'

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <div className="footer__brand">
              Prato Digital<span>.</span>
            </div>
            <p className="footer__tag">
              Cardápio online, link próprio e pedido no WhatsApp. Sem app, sem comissão
              por pedido e sem PDF perdido no grupo da família.
            </p>
          </div>

          <div className="footer__col">
            <h3>Cardápios</h3>
            <Link to="/#cardapios">Exemplos</Link>
            <Link to="/#precos">Preços</Link>
            <Link to="/#perguntas">Perguntas</Link>
            <Link to="/c/fx-burgers">Ver um cardápio</Link>
          </div>

          <div className="footer__col">
            <h3>Para parceiros</h3>
            <Link to="/parceiros">Plataforma para devs</Link>
            <Link to="/parceiros#planos">Planos</Link>
            <Link to="/app/planos">Assinatura</Link>
            <Link to="/criar-conta">Criar conta</Link>
            <Link to="/entrar">Entrar</Link>
          </div>

          <div className="footer__col">
            <h3>Falar com a gente</h3>
            <a
              href={siteWhatsApp(siteMessage('restaurante'))}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp {SITE.whatsappDisplay}
            </a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={`https://instagram.com/${SITE.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">
              Instagram {SITE.instagram}
            </a>
            <span className="mono" style={{ display: 'block', paddingTop: 4, fontSize: 12 }}>
              {SITE.hours}
            </span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 {SITE.name} · {SITE.city}</span>
          <span>
            Site de demonstração: cardápios, números e telefones são ilustrativos.
          </span>
          <a href={siteWhatsApp(siteMessage('duvida'))} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /> Chamar no WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}
