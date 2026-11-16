import { Link } from 'react-router-dom'
import type { BioProfile, Menu } from '../lib/types'
import { waLink } from '../lib/whatsapp'
import { Icon, WhatsAppIcon } from './Icon'

export function BioCard({ profile, menus }: { profile: BioProfile; menus: Menu[] }) {
  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
  const latest = menus.slice(0, 3)

  return (
    <div className="bio-card">
      <div className="bio-card__avatar">{initials || 'PD'}</div>
      <div className="bio-card__name">{profile.name || 'Seu nome'}</div>
      <p className="bio-card__headline">{profile.headline}</p>

      <div className="bio-card__links">
        {latest.map((menu) => (
          <Link className="bio-card__link" to={`/c/${menu.slug}`} key={menu.id}>
            <span>
              {menu.name}
              <small>{menu.category} · {menu.neighborhood}</small>
            </span>
            <Icon name="arrow-up-right" size={13} />
          </Link>
        ))}
        {latest.length === 0 && <span className="app-note">Nenhum cardápio publicado ainda.</span>}
        <a
          className="bio-card__link"
          href={waLink(profile.whatsapp, 'Oi! Vi seu link e quero um cardápio online para o meu restaurante.')}
          target="_blank"
          rel="noreferrer"
        >
          <span>
            Falar no WhatsApp
            <small>Resposta em horário comercial</small>
          </span>
          <WhatsAppIcon size={13} />
        </a>
      </div>
    </div>
  )
}
