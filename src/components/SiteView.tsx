import type { CSSProperties } from 'react'
import type { Menu, Site } from '../lib/types'
import { contactFor, telLink } from '../lib/whatsapp'
import { formatPhone } from '../lib/format'
import { Icon, WhatsAppIcon } from './Icon'

export function SiteView({
  site,
  menu,
  preview = false,
}: {
  site: Site
  menu?: Menu
  preview?: boolean
}) {
  const phone = site.whatsapp || site.phone
  const contact = phone
    ? contactFor(phone, `Oi! Vi o site do ${site.name} e quero saber mais.`)
    : null
  const isWhatsApp = contact?.kind === 'whatsapp'
  const initial = site.name.trim().charAt(0).toUpperCase() || 'P'
  const services = site.services.filter((service) => service.title.trim())
  const highlights = site.highlights.filter(Boolean)
  const gallery = site.gallery ?? []

  return (
    <div
      className={`sitev sitev--${site.theme} ${preview ? 'sitev--preview' : ''}`}
      style={{ '--sv-accent': site.accent } as CSSProperties}
    >
      <header className="sitev__nav">
        <a href="#topo" className="sitev__brand" aria-label={`${site.name} — início`}>
          {site.name}
        </a>
        <nav aria-label="Seções do site">
          <a href="#sobre">Sobre</a>
          <a href="#servicos">Serviços</a>
          {gallery.length > 0 && <a href="#galeria">Galeria</a>}
          <a href="#contato">Contato</a>
        </nav>
        {contact ? (
          <a
            className="sitev__nav-cta"
            href={contact.href}
            target={isWhatsApp ? '_blank' : undefined}
            rel={isWhatsApp ? 'noreferrer' : undefined}
          >
            {isWhatsApp ? <WhatsAppIcon size={13} /> : <Icon name="phone" size={13} />}
            {isWhatsApp ? 'WhatsApp' : 'Ligar'}
          </a>
        ) : (
          <a className="sitev__nav-cta" href="#contato">
            Falar
          </a>
        )}
      </header>

      <div id="topo">
        <section className="sitev__hero">
          <div className="sitev__hero-copy">
            <h1>{site.name}</h1>
            <p className="sitev__tagline">{site.tagline}</p>
            {highlights.length > 0 && (
              <ul className="sitev__highlights">
                {highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight}>
                    <Icon name="check" size={15} />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
            <div className="sitev__actions">
              {contact && (
                <a
                  className="sitev__btn sitev__btn--solid"
                  href={contact.href}
                  target={isWhatsApp ? '_blank' : undefined}
                  rel={isWhatsApp ? 'noreferrer' : undefined}
                >
                  {isWhatsApp ? <WhatsAppIcon size={16} /> : <Icon name="phone" size={16} />}
                  {isWhatsApp ? 'Falar no WhatsApp' : 'Ligar agora'}
                </a>
              )}
              <a className="sitev__btn sitev__btn--ghost" href="#servicos">
                Ver serviços
              </a>
            </div>
          </div>

          {site.heroImage ? (
            <figure className="sitev__hero-photo">
              <img src={site.heroImage} alt={`${site.name} — ${site.category}`} />
              <figcaption className="sitev__hero-photo__meta">
                <span>{site.category}</span>
                <span>{site.neighborhood}</span>
              </figcaption>
            </figure>
          ) : (
            <div className="sitev__hero-mark" aria-hidden="true">
              <div className="sitev__mark-inner">
                <span className="sitev__mark-letter">{initial}</span>
                <span className="sitev__mark-meta">
                  {site.category}
                  <br />
                  {site.neighborhood}
                </span>
              </div>
              <div className="sitev__mark-foot">
                <span>Atendimento local</span>
                <span>2026</span>
              </div>
            </div>
          )}
        </section>

        <div className="sitev__strip">
          <span>
            <Icon name="map-pin" size={13} /> {site.address || site.neighborhood}
          </span>
          {site.hours && (
            <span>
              <Icon name="clock" size={13} /> {site.hours}
            </span>
          )}
          {site.phone && (
            <a href={telLink(site.phone)}>
              <Icon name="phone" size={13} /> {formatPhone(site.phone)}
            </a>
          )}
        </div>

        <section className="sitev__section sitev__about" id="sobre">
          <div>
            <h2>
              Perto de você,
              <br />
              feito para você.
            </h2>
          </div>
          <div>
            <p>{site.about}</p>
            {highlights.length > 0 && (
              <div className="sitev__facts">
                {highlights.map((highlight, index) => (
                  <div key={highlight}>
                    <b>0{index + 1}</b>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="sitev__section sitev__gallery" id="galeria">
            <div className="sitev__section-head">
              <div>
                <h2>Por dentro</h2>
              </div>
              <span className="sitev__section-label">{gallery.length} fotos</span>
            </div>
            <div className="sitev__gallery-grid">
              {gallery.map((photo) => (
                <figure className="sitev__photo" key={photo.id}>
                  <img
                    src={photo.src}
                    alt={photo.caption || `${site.name} — ${site.category}`}
                    loading="lazy"
                  />
                  {photo.caption && <figcaption>{photo.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="sitev__section" id="servicos">
          <div className="sitev__section-head">
            <div>
              <h2>O que a gente faz</h2>
            </div>
            {contact && (
              <a
                className="sitev__text-link"
                href={contact.href}
                target={isWhatsApp ? '_blank' : undefined}
                rel={isWhatsApp ? 'noreferrer' : undefined}
              >
                Pedir orçamento <Icon name="arrow-right" size={13} />
              </a>
            )}
          </div>

          <div className="sitev__services">
            {services.map((service, index) => (
              <article className="sitev__service" key={service.id}>
                <span className="sitev__service-no">0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                {service.price && <span className="sitev__price">{service.price}</span>}
              </article>
            ))}
          </div>
        </section>

        {menu && (
          <section className="sitev__menu-cta">
            <div>
              <h2>Bateu a fome?</h2>
              <p>Veja o cardápio completo e peça direto no WhatsApp.</p>
            </div>
            <a className="sitev__btn sitev__btn--solid" href={`/c/${menu.slug}`}>
              Abrir cardápio
              <Icon name="arrow-up-right" size={15} />
            </a>
          </section>
        )}

        <section className="sitev__section sitev__contact" id="contato">
          <div>
            <h2>Vamos conversar?</h2>
            <p>
              {site.address || site.neighborhood}
              {site.hours ? ` · ${site.hours}` : ''}
            </p>
            {site.address && (
              <a
                className="sitev__text-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver no mapa <Icon name="external" size={12} />
              </a>
            )}
          </div>
          <div className="sitev__contact-actions">
            {contact && (
              <a
                className="sitev__btn sitev__btn--solid"
                href={contact.href}
                target={isWhatsApp ? '_blank' : undefined}
                rel={isWhatsApp ? 'noreferrer' : undefined}
              >
                {isWhatsApp ? <WhatsAppIcon size={16} /> : <Icon name="phone" size={15} />}
                {formatPhone(phone)}
              </a>
            )}
            {site.phone && isWhatsApp && (
              <a className="sitev__btn sitev__btn--ghost" href={telLink(site.phone)}>
                <Icon name="phone" size={15} />
                Ligar
              </a>
            )}
          </div>
        </section>
      </div>

      <footer className="sitev__foot">
        <span>{site.name} · {site.category}</span>
        <span>
          Feito com Prato Digital
          {site.isDemo ? ' · prévia demonstrativa' : ''}
        </span>
      </footer>
    </div>
  )
}
