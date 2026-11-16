import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NICHES } from '../lib/niches'
import { getSiteTemplate, siteTemplateToSite, uniqueSiteSlug } from '../lib/siteTemplates'
import { phoneType, uid } from '../lib/format'
import { compressImage, imageSizeKb } from '../lib/images'
import { downloadSiteHtml } from '../lib/siteExport'
import { siteShareUrl } from '../lib/share'
import { useStore } from '../lib/store'
import { usePlan } from '../lib/usePlan'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import type { Lead, Site, SiteTheme } from '../lib/types'
import { SiteView } from '../components/SiteView'
import { Icon } from '../components/Icon'

const THEMES: { value: SiteTheme; label: string; chip: string; fg: string }[] = [
  { value: 'claro', label: 'Claro', chip: '#fbf6ea', fg: '#201a13' },
  { value: 'escuro', label: 'Escuro', chip: '#12100c', fg: '#f3ead7' },
  { value: 'areia', label: 'Areia', chip: '#ece4d2', fg: '#1a1611' },
]

const ACCENTS = ['#22458c', '#2f5d3a', '#7a2e3b', '#b06a1f', '#c8372d', '#5b3a8c']

function makeDraft(lead: Lead, existing: Site | undefined, sites: Site[]): Site {
  if (existing) return JSON.parse(JSON.stringify(existing)) as Site
  const category = lead.category.toLowerCase()
  const niche =
    NICHES.find((item) => item.label.toLowerCase() === category) ??
    NICHES.find((item) => item.keywords.some((keyword) => category.includes(keyword))) ??
    NICHES[0]
  const template = getSiteTemplate(niche.siteTemplateId)
  return siteTemplateToSite(template, {
    name: lead.name,
    category: lead.category,
    neighborhood: lead.neighborhood,
    phone: lead.phone,
    whatsapp: lead.phone,
    sites,
    menuId: lead.menuId,
  })
}

export function SiteBuilder() {
  const { leadId = '' } = useParams()
  const navigate = useNavigate()
  const { leads, sites, menus, saveSite, notify } = useStore()
  const plan = usePlan()
  const lead = leads.find((item) => item.id === leadId)
  const existing = lead ? sites.find((item) => item.id === lead.siteId) : undefined
  const [site, setSite] = useState<Site | null>(() => (lead ? makeDraft(lead, existing, sites) : null))
  const [photoError, setPhotoError] = useState<string | null>(null)

  useDocumentTitle(site ? `Site — ${site.name}` : 'Site não encontrado')

  if (!lead || !site) {
    return (
      <div className="panel">
        <div className="wrap" style={{ padding: '70px 0', textAlign: 'center' }}>
          <span className="stamp stamp--red">Lead não encontrado</span>
          <h1 className="panel-title" style={{ marginTop: 14 }}>
            Essa mesa não existe.
          </h1>
          <p className="panel-sub" style={{ marginBottom: 20 }}>
            O lead pode ter sido removido ou o link está errado.
          </p>
          <Link className="btn" to="/app/projetos">
            <Icon name="arrow-left" size={16} />
            Voltar aos projetos
          </Link>
        </div>
      </div>
    )
  }

  const menu = menus.find((item) => item.id === (site.menuId ?? lead.menuId))

  function patch<K extends keyof Site>(key: K, value: Site[K]) {
    setSite((previous) => (previous ? { ...previous, [key]: value } : previous))
  }

  async function addHero(file?: File) {
    if (!file) return
    setPhotoError(null)
    try {
      const src = await compressImage(file, 1600, 0.8)
      patch('heroImage', src)
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Não foi possível processar a foto.')
    }
  }

  async function addGallery(files?: FileList | null) {
    if (!files || files.length === 0) return
    setPhotoError(null)
    const current = site?.gallery ?? []
    const slots = Math.max(0, 6 - current.length)
    if (slots === 0) return
    try {
      const selected = Array.from(files).slice(0, slots)
      const photos = await Promise.all(
        selected.map(async (file) => ({
          id: uid('photo'),
          src: await compressImage(file, 1200, 0.75),
        })),
      )
      setSite((previous) =>
        previous ? { ...previous, gallery: [...(previous.gallery ?? []), ...photos] } : previous,
      )
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Não foi possível processar a foto.')
    }
  }

  function removePhoto(id: string) {
    setSite((previous) =>
      previous
        ? { ...previous, gallery: (previous.gallery ?? []).filter((photo) => photo.id !== id) }
        : previous,
    )
  }

  const gallery = site.gallery ?? []
  const qualityChecks = [
    { ok: Boolean(site.heroImage), label: 'Foto de capa' },
    { ok: gallery.length >= 3, label: '3 fotos na galeria' },
    { ok: site.services.filter((service) => service.title.trim()).length >= 3, label: '3 serviços' },
    { ok: site.about.trim().length > 80, label: 'Sobre com contexto' },
    { ok: Boolean(site.hours.trim()), label: 'Horário de atendimento' },
    { ok: Boolean(site.address.trim()), label: 'Endereço' },
    { ok: phoneType(site.whatsapp) === 'mobile', label: 'WhatsApp celular' },
  ]
  const qualityScore = qualityChecks.filter((check) => check.ok).length

  function setHighlight(index: number, value: string) {
    setSite((previous) => {
      if (!previous) return previous
      const highlights = [...previous.highlights]
      highlights[index] = value
      return { ...previous, highlights }
    })
  }

  function addService() {
    setSite((previous) =>
      previous
        ? {
            ...previous,
            services: [
              ...previous.services,
              { id: `svc_${Date.now()}`, title: '', description: '', price: '' },
            ],
          }
        : previous,
    )
  }

  function updateService(id: string, patchService: Partial<Site['services'][number]>) {
    setSite((previous) =>
      previous
        ? {
            ...previous,
            services: previous.services.map((service) =>
              service.id === id ? { ...service, ...patchService } : service,
            ),
          }
        : previous,
    )
  }

  function removeService(id: string) {
    setSite((previous) =>
      previous
        ? { ...previous, services: previous.services.filter((service) => service.id !== id) }
        : previous,
    )
  }

  function save(openAfter: boolean): Site | null {
    if (!site || !lead) return null
    if (!existing && (!plan.active || plan.atLimit)) {
      notify(
        plan.active
          ? 'Limite de projetos do plano atingido. Faça upgrade para criar mais.'
          : 'Seu acesso expirou. Assine um plano para criar novos sites.',
      )
      navigate('/app/planos')
      return null
    }
    if (!site.name.trim()) {
      notify('Dê um nome ao site antes de salvar.')
      return null
    }
    const cleaned: Site = {
      ...site,
      name: site.name.trim(),
      slug: uniqueSiteSlug(site.slug || site.name, sites.filter((item) => item.id !== site.id)),
      tagline: site.tagline.trim(),
      about: site.about.trim(),
      highlights: site.highlights.filter(Boolean),
      services: site.services
        .filter((service) => service.title.trim())
        .map((service) => ({ ...service, title: service.title.trim() })),
      menuId: site.menuId ?? lead.menuId,
    }
    saveSite(cleaned, lead.id)
    setSite(cleaned)
    if (openAfter) navigate(`/s/${cleaned.slug}`)
    return cleaned
  }

  async function copyLink() {
    const saved = save(false)
    if (!saved) return
    try {
      await navigator.clipboard.writeText(siteShareUrl(saved))
      notify('Link do site copiado. Abre em qualquer navegador.')
    } catch {
      notify('Não foi possível copiar o link.')
    }
  }

  async function exportHtml() {
    const saved = save(false)
    if (!saved) return
    try {
      await downloadSiteHtml(saved, menu)
      notify('HTML do site exportado com as fontes embutidas.')
    } catch {
      notify('Não foi possível gerar o HTML.')
    }
  }

  return (
    <div className="panel">
      <div className="builder-top">
        <div className="wrap builder-top__inner">
          <Link className="icon-btn" to="/app/projetos" aria-label="Voltar aos projetos">
            <Icon name="arrow-left" size={15} />
          </Link>
          <div className="builder-top__title">
            <b>{site.name || 'Novo site'}</b>
            <span>Editor de site · /s/{site.slug}</span>
          </div>
          <div className="builder-top__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={copyLink}>
              <Icon name="copy" size={14} />
              <span>Copiar link</span>
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={exportHtml}>
              <Icon name="download" size={14} />
              <span>HTML</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                const saved = save(false)
                if (saved) navigate(`/s/${saved.slug}`)
              }}
            >
              <Icon name="eye" size={14} />
              <span>Ver</span>
            </button>
            <button type="button" className="btn btn--red btn--sm" onClick={() => save(false)}>
              <Icon name="check" size={14} />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </div>

      <main className="wrap" id="conteudo">
        <div className="builder-grid">
          <div>
            <div className="builder-panel">
              <div className="builder-panel__head">
                <h2>Identidade do negócio</h2>
                <span>{lead.name}</span>
              </div>
              <div className="builder-panel__body">
                <div className="form-grid">
                  <div className="field span-2">
                    <label htmlFor="site-name">Nome do negócio</label>
                    <input
                      id="site-name"
                      className="input"
                      value={site.name}
                      onChange={(event) => patch('name', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="site-category">Ramo</label>
                    <input
                      id="site-category"
                      className="input"
                      value={site.category}
                      onChange={(event) => patch('category', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="site-neighborhood">Bairro</label>
                    <input
                      id="site-neighborhood"
                      className="input"
                      value={site.neighborhood}
                      onChange={(event) => patch('neighborhood', event.target.value)}
                    />
                  </div>
                  <div className="field span-2">
                    <label htmlFor="site-address">Endereço</label>
                    <input
                      id="site-address"
                      className="input"
                      value={site.address}
                      onChange={(event) => patch('address', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="site-phone">Telefone</label>
                    <input
                      id="site-phone"
                      className="input"
                      value={site.phone}
                      onChange={(event) => patch('phone', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="site-whatsapp">WhatsApp</label>
                    <input
                      id="site-whatsapp"
                      className="input"
                      value={site.whatsapp}
                      onChange={(event) => patch('whatsapp', event.target.value)}
                    />
                    {phoneType(site.whatsapp) === 'landline' && (
                      <p className="app-note">
                        Número fixo: o site vai abrir “Ligar” em vez do WhatsApp.
                      </p>
                    )}
                  </div>
                  <div className="field span-2">
                    <label htmlFor="site-hours">Horário</label>
                    <input
                      id="site-hours"
                      className="input"
                      value={site.hours}
                      onChange={(event) => patch('hours', event.target.value)}
                    />
                  </div>
                  <div className="field span-2">
                    <label htmlFor="site-tagline">Frase de abertura</label>
                    <input
                      id="site-tagline"
                      className="input"
                      value={site.tagline}
                      onChange={(event) => patch('tagline', event.target.value)}
                    />
                  </div>
                  <div className="field span-2">
                    <label htmlFor="site-about">Sobre o negócio</label>
                    <textarea
                      id="site-about"
                      className="textarea"
                      value={site.about}
                      onChange={(event) => patch('about', event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="builder-panel">
              <div className="builder-panel__head">
                <h2>Fotos</h2>
                <span>{site.heroImage ? 'capa + galeria' : 'capa e galeria'}</span>
              </div>
              <div className="builder-panel__body">
                <div className="field">
                  <span className="field-label">Foto de capa</span>
                  {site.heroImage ? (
                    <div className="photo-hero">
                      <img src={site.heroImage} alt="" />
                      <div className="photo-hero__actions">
                        <label className="btn btn--ghost btn--sm">
                          Trocar
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(event) => {
                              void addHero(event.target.files?.[0])
                              event.target.value = ''
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => patch('heroImage', undefined)}
                        >
                          <Icon name="trash" size={13} />
                          Remover
                        </button>
                      </div>
                      <span className="photo-meta">{imageSizeKb(site.heroImage)} KB</span>
                    </div>
                  ) : (
                    <label className="photo-drop">
                      <Icon name="upload" size={20} />
                      <b>Enviar foto de capa</b>
                      <small>JPG, PNG ou WebP · comprimida automaticamente</small>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(event) => {
                          void addHero(event.target.files?.[0])
                          event.target.value = ''
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="field" style={{ marginTop: 14 }}>
                  <span className="field-label">Galeria ({gallery.length}/6)</span>
                  <div className="photo-grid">
                    {gallery.map((photo) => (
                      <div className="photo-thumb" key={photo.id}>
                        <img src={photo.src} alt="" />
                        <button
                          type="button"
                          className="photo-thumb__remove"
                          aria-label="Remover foto"
                          onClick={() => removePhoto(photo.id)}
                        >
                          <Icon name="x" size={11} />
                        </button>
                      </div>
                    ))}
                    {gallery.length < 6 && (
                      <label className="photo-add">
                        <Icon name="plus" size={18} />
                        <span>Adicionar</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(event) => {
                            void addGallery(event.target.files)
                            event.target.value = ''
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <p className="app-note">
                    Até 6 fotos. Elas ficam neste navegador e vão embutidas no HTML exportado.
                  </p>
                </div>

                {photoError && (
                  <p className="auth__error" role="alert">
                    <Icon name="alert" size={14} />
                    {photoError}
                  </p>
                )}

                <div className="site-quality">
                  <div className="site-quality__head">
                    <span className="field-label">Qualidade do site</span>
                    <b>
                      {qualityScore}/{qualityChecks.length}
                    </b>
                  </div>
                  <ul>
                    {qualityChecks.map((check) => (
                      <li key={check.label} className={check.ok ? 'is-done' : ''}>
                        <Icon name={check.ok ? 'check-circle' : 'alert'} size={12} />
                        {check.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="builder-panel">
              <div className="builder-panel__head">
                <h2>Destaques</h2>
                <span>até 3</span>
              </div>
              <div className="builder-panel__body">
                <div className="form-grid">
                  {[0, 1, 2].map((index) => (
                    <div className="field span-2" key={index}>
                      <label htmlFor={`site-highlight-${index}`}>Destaque {index + 1}</label>
                      <input
                        id={`site-highlight-${index}`}
                        className="input"
                        value={site.highlights[index] ?? ''}
                        onChange={(event) => setHighlight(index, event.target.value)}
                        placeholder={index === 0 ? 'Ex.: atendimento no bairro' : 'Opcional'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="builder-panel">
              <div className="builder-panel__head">
                <h2>Serviços</h2>
                <button type="button" className="btn btn--ghost btn--sm" onClick={addService}>
                  <Icon name="plus" size={13} />
                  Serviço
                </button>
              </div>
              <div className="builder-panel__body">
                {site.services.map((service) => (
                  <div className="item-row" key={service.id}>
                    <div className="item-row__grid">
                      <input
                        className="input"
                        value={service.title}
                        onChange={(event) => updateService(service.id, { title: event.target.value })}
                        placeholder="Nome do serviço"
                        aria-label="Nome do serviço"
                      />
                      <input
                        className="input"
                        value={service.price ?? ''}
                        onChange={(event) => updateService(service.id, { price: event.target.value })}
                        placeholder="R$ ou 'a combinar'"
                        aria-label="Preço ou condição"
                      />
                    </div>
                    <textarea
                      className="textarea"
                      value={service.description}
                      onChange={(event) =>
                        updateService(service.id, { description: event.target.value })
                      }
                      placeholder="Descrição curta do serviço"
                      aria-label="Descrição do serviço"
                    />
                    <div className="item-row__foot">
                      <span className="app-note">Aparece na seção Serviços</span>
                      <div className="item-row__ops">
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          aria-label="Remover serviço"
                          onClick={() => removeService(service.id)}
                        >
                          <Icon name="trash" size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="add-row" onClick={addService}>
                  <Icon name="plus" size={12} /> Adicionar serviço
                </button>
              </div>
            </div>

            <div className="builder-panel">
              <div className="builder-panel__head">
                <h2>Aparência</h2>
                <span>site one-page</span>
              </div>
              <div className="builder-panel__body">
                <div className="field">
                  <span className="field-label">Cor de destaque</span>
                  <div className="color-row">
                    <input
                      type="color"
                      className="color-input"
                      value={site.accent}
                      onChange={(event) => patch('accent', event.target.value)}
                      aria-label="Cor de destaque do site"
                    />
                    <div className="swatches">
                      {ACCENTS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className="swatch"
                          style={{ background: color }}
                          onClick={() => patch('accent', color)}
                          aria-label={`Usar a cor ${color}`}
                          aria-pressed={site.accent === color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="field">
                  <span className="field-label">Tema</span>
                  <div className="theme-options">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        className="theme-option"
                        aria-pressed={site.theme === theme.value}
                        onClick={() => patch('theme', theme.value)}
                      >
                        <span
                          className="theme-option__chip"
                          style={{ background: theme.chip, color: theme.fg }}
                        />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="builder-preview">
            <div className="builder-preview__head">
              <span>Prévia ao vivo</span>
              <span>{site.theme} · {site.accent}</span>
            </div>
            <div className="site-preview">
              <SiteView site={site} menu={menu} preview />
            </div>
            <p className="builder-hint" style={{ marginTop: 10 }}>
              “Copiar link” gera uma prévia que abre em qualquer navegador, com os dados do site
              na URL. O link não inclui fotos (a URL ficaria gigante); o HTML exportado inclui e
              é o arquivo para hospedar no domínio do cliente.
            </p>
            <div className="drawer__actions">
              <button type="button" className="btn btn--red btn--sm" onClick={() => save(true)}>
                <Icon name="eye" size={14} />
                Salvar e abrir
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={copyLink}>
                <Icon name="copy" size={14} />
                Copiar link
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={exportHtml}>
                <Icon name="download" size={14} />
                Exportar HTML
              </button>
            </div>
            {menu && (
              <p className="app-note" style={{ marginTop: 10 }}>
                Este site aponta para o cardápio <strong>{menu.name}</strong> na seção “Bateu a
                fome?”.
              </p>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
