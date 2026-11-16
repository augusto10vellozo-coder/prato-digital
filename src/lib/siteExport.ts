import { formatPhone, todayISO } from './format'
import { menuShareUrl } from './share'
import type { Menu, Site } from './types'
import { contactFor, telLink } from './whatsapp'

const FONT_FILES = {
  body: '/fonts/archivo-latin.woff2',
  mono: '/fonts/courierprime-700.woff2',
}

const fontCache: { value?: Record<string, string | null> } = {}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunk = 0x8000
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk))
  }
  return btoa(binary)
}

async function loadFonts(): Promise<Record<string, string | null>> {
  if (fontCache.value) return fontCache.value
  const entries = await Promise.all(
    Object.entries(FONT_FILES).map(async ([key, path]) => {
      try {
        const response = await fetch(path)
        if (!response.ok) return [key, null] as const
        return [key, toBase64(await response.arrayBuffer())] as const
      } catch {
        return [key, null] as const
      }
    }),
  )
  fontCache.value = Object.fromEntries(entries)
  return fontCache.value
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const THEMES = {
  claro: { bg: '#fbf6ea', fg: '#201a13', muted: '#6f6252', surface: '#f3ebdb', line: 'rgba(32,26,19,.16)' },
  escuro: { bg: '#12100c', fg: '#f3ead7', muted: '#b7a98f', surface: '#1d1812', line: 'rgba(243,234,215,.2)' },
  areia: { bg: '#ece4d2', fg: '#1a1611', muted: '#675b4b', surface: '#e2d7c1', line: 'rgba(26,22,17,.2)' },
}

function fontFace(name: string, data: string | null, weight: string): string {
  if (!data) return ''
  return `@font-face{font-family:'${name}';src:url(data:font/woff2;base64,${data}) format('woff2');font-weight:${weight};font-style:normal;font-display:swap}`
}

export async function buildSiteHtml(site: Site, menu?: Menu): Promise<string> {
  const fonts = await loadFonts()
  const theme = THEMES[site.theme] ?? THEMES.claro
  const accentText =
    site.theme === 'escuro'
      ? `color-mix(in srgb, ${site.accent} 55%, #f3ead7)`
      : `color-mix(in srgb, ${site.accent} 72%, ${theme.fg})`
  const phone = site.whatsapp || site.phone
  const contact = phone
    ? contactFor(phone, `Oi! Vi o site do ${site.name} e quero saber mais.`)
    : null
  const isWhatsApp = contact?.kind === 'whatsapp'
  const contactAttrs = isWhatsApp ? ' target="_blank" rel="noreferrer"' : ''
  const menuUrl = menu ? menuShareUrl(menu) : ''
  const highlights = site.highlights.filter(Boolean)
  const services = site.services.filter((service) => service.title.trim())
  const gallery = site.gallery ?? []
  const initial = site.name.charAt(0).toUpperCase()
  const heroVisual = site.heroImage
    ? `<div class="hero-photo"><img src="${site.heroImage}" alt="${escapeHtml(site.name)}"><div class="hero-photo-meta"><span>${escapeHtml(site.category)}</span><span>${escapeHtml(site.neighborhood)}</span></div></div>`
    : `<div class="mark">
      <div class="mark-in"><span class="mark-letter">${escapeHtml(initial)}</span><span class="mark-meta">${escapeHtml(site.category)}<br>${escapeHtml(site.neighborhood)}</span></div>
      <div class="mark-foot"><span>Atendimento local</span><span>${todayISO().slice(0, 4)}</span></div>
    </div>`
  const galleryLink = gallery.length ? '<a href="#galeria">Galeria</a>' : ''
  const galleryHtml = gallery.length
    ? `<section class="section" id="galeria">
    <div class="section-head"><div><h2>Por dentro</h2></div><span class="label">${gallery.length} fotos</span></div>
    <div class="gallery">${gallery
      .map(
        (photo) =>
          `<figure><img src="${photo.src}" alt="${escapeHtml(photo.caption || site.name)}" loading="lazy">${
            photo.caption ? `<figcaption>${escapeHtml(photo.caption)}</figcaption>` : ''
          }</figure>`,
      )
      .join('')}</div>
  </section>`
    : ''
  const mapLink = site.address
    ? `<a class="text-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}" target="_blank" rel="noreferrer">Ver no mapa →</a>`
    : ''

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(site.name)} — ${escapeHtml(site.category)}</title>
<meta name="description" content="${escapeHtml(site.tagline)}">
<style>
${fontFace('Archivo', fonts.body, '400 800')}
${fontFace('Courier Prime', fonts.mono, '700')}
:root{--bg:${theme.bg};--fg:${theme.fg};--muted:${theme.muted};--surface:${theme.surface};--line:${theme.line};--accent:${site.accent};--accent-text:${accentText};--on:#fff8ec}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:70px}
body{margin:0;background:var(--bg);color:var(--fg);font-family:'Archivo','Segoe UI',sans-serif;font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}
::selection{background:var(--accent);color:var(--on)}
h1,h2,h3,p{margin:0}
h1,h2,h3{font-weight:800;letter-spacing:-.04em;line-height:.98}
a{color:inherit}
.wrap{max-width:1200px;margin:0 auto;padding-left:28px;padding-right:28px}
.nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:22px;padding:16px 28px;background:var(--bg);border-bottom:1px solid var(--line);max-width:1200px;margin:0 auto}
.brand{font-size:14px;font-weight:800;text-decoration:none;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nav nav{display:flex;gap:18px}
.nav nav a{font-family:'Courier Prime',monospace;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;color:var(--muted)}
.nav a:hover{color:var(--fg)}
.navcta{display:inline-flex;align-items:center;padding:9px 13px;background:var(--accent);color:var(--on)!important;font-family:'Courier Prime',monospace;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;white-space:nowrap}
.hero{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;align-items:center;padding-top:76px;padding-bottom:50px}
.eyebrow{display:flex;align-items:center;gap:8px;font-family:'Courier Prime',monospace;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.dot{width:7px;height:7px;background:var(--accent);border-radius:50%}
.hero h1{margin-top:0;font-size:clamp(48px,7vw,92px);line-height:.88;max-width:12ch}
.tagline{max-width:46ch;margin-top:16px;font-size:17px;line-height:1.5;color:var(--muted)}
.highlights{list-style:none;margin:22px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px 16px}
.highlights li{font-family:'Courier Prime',monospace;font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:12px 18px;border:1px solid var(--fg);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;line-height:1.1}
.btn--solid{background:var(--accent);border-color:var(--accent);color:var(--on)!important}
.btn--ghost{background:transparent}
.mark{position:relative;background:var(--accent);color:var(--on);min-height:360px;padding:22px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden}
.mark::before{content:'';position:absolute;width:280px;height:280px;border:1px solid rgba(255,248,236,.35);border-radius:50%;right:-90px;top:-90px}
.mark::after{content:'';position:absolute;width:190px;height:190px;border:1px solid rgba(255,248,236,.22);border-radius:50%;left:-90px;bottom:-80px}
.mark-in{position:relative;z-index:1;display:flex;justify-content:space-between;gap:16px}
.mark-letter{font-size:clamp(82px,12vw,150px);font-weight:800;line-height:.7;letter-spacing:-.08em}
.mark-meta{font-family:'Courier Prime',monospace;font-size:8px;font-weight:700;letter-spacing:.09em;line-height:1.6;text-transform:uppercase;text-align:right}
.mark-foot{position:relative;z-index:1;display:flex;justify-content:space-between;gap:8px;padding-top:9px;border-top:1px solid rgba(255,248,236,.4);font-family:'Courier Prime',monospace;font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.strip{display:flex;flex-wrap:wrap;gap:10px 24px;padding-top:12px;padding-bottom:12px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-family:'Courier Prime',monospace;font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
.strip a{text-decoration:none}
.section{padding-top:70px;padding-bottom:70px;border-top:1px solid var(--line)}
.about{display:grid;grid-template-columns:.9fr 1.1fr;gap:70px}
.label{font-family:'Courier Prime',monospace;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-text)}
.section h2{margin-top:0;font-size:clamp(30px,4vw,48px);line-height:.95}
.about p{font-size:16px;line-height:1.65;color:var(--muted);max-width:52ch}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:26px;padding-top:20px;border-top:1px solid var(--line)}
.facts b{display:block;font-family:'Courier Prime',monospace;font-size:9px;color:var(--accent-text)}
.facts span{display:block;margin-top:3px;font-size:11px;font-weight:600;line-height:1.4}
.section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:24px}
.text-link{font-family:'Courier Prime',monospace;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px;white-space:nowrap}
.services{display:grid;grid-template-columns:repeat(3,1fr);gap:0 28px}
.service{border-top:2px solid var(--fg);padding:16px 0 20px;display:flex;flex-direction:column}
.service-no{font-family:'Courier Prime',monospace;font-size:9px;font-weight:700;color:var(--accent-text)}
.service h3{margin-top:8px;font-size:20px;line-height:1.1;letter-spacing:-.02em}
.service p{margin-top:7px;font-size:12.5px;line-height:1.5;color:var(--muted);flex:1}
.price{margin-top:12px;font-family:'Courier Prime',monospace;font-size:10px;font-weight:700}
.menu-cta{display:flex;align-items:center;justify-content:space-between;gap:22px;padding-top:38px;padding-bottom:38px;background:var(--accent);color:var(--on);max-width:1200px;margin:0 auto}
.menu-cta .label{color:var(--on)}
.menu-cta h2{margin-top:6px;font-size:clamp(28px,4vw,44px)}
.menu-cta p{margin-top:5px;font-size:13px}
.menu-cta .btn{border-color:var(--on);color:var(--on)!important;flex:none}
.contact{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.contact p{margin-top:9px;font-size:13px;line-height:1.5;color:var(--muted);max-width:44ch}
.contact-actions{display:flex;flex-wrap:wrap;gap:8px;flex:none}
.foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;padding-top:18px;padding-bottom:24px;border-top:1px solid var(--line);font-family:'Courier Prime',monospace;font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.hero-photo{position:relative;border:1px solid var(--line);min-height:360px;overflow:hidden;background:var(--surface)}
.hero-photo img{width:100%;height:100%;object-fit:cover;display:block}
.hero-photo-meta{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(0,0,0,.45);color:#fff8ec;font-family:'Courier Prime',monospace;font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.gallery figure{margin:0;position:relative;overflow:hidden;border:1px solid var(--line);aspect-ratio:4/3}
.gallery figure:first-child{grid-column:span 2;grid-row:span 2;aspect-ratio:auto}
.gallery img{width:100%;height:100%;object-fit:cover;display:block}
.gallery figcaption{position:absolute;left:0;right:0;bottom:0;padding:6px 8px;background:rgba(0,0,0,.45);color:#fff8ec;font-family:'Courier Prime',monospace;font-size:7px;font-weight:700;text-transform:uppercase}
@media(max-width:900px){.hero{grid-template-columns:1fr;gap:24px}.hero .mark{max-width:420px}.about{grid-template-columns:1fr;gap:20px}.services{grid-template-columns:1fr 1fr}.nav nav{display:none}.contact{flex-direction:column;align-items:flex-start}.gallery{grid-template-columns:1fr 1fr}.gallery figure:first-child{grid-column:span 2;grid-row:auto;aspect-ratio:16/9}}
@media(max-width:600px){.nav{padding:12px 16px}.brand{font-size:12px}.navcta{font-size:8px;padding:7px 9px}.wrap,.nav,.strip,.foot{padding-left:16px;padding-right:16px}.hero{padding-top:30px;padding-bottom:26px}.services{grid-template-columns:1fr}.section{padding-top:42px;padding-bottom:42px}.menu-cta{flex-direction:column;align-items:flex-start;margin:0 12px;padding:24px 16px}.contact-actions{width:100%}.contact-actions .btn{flex:1}.gallery{grid-template-columns:1fr}.gallery figure:first-child{grid-column:span 1;grid-row:auto;aspect-ratio:4/3}}
</style>
</head>
<body>
<header class="nav">
  <a class="brand" href="#topo">${escapeHtml(site.name)}</a>
  <nav><a href="#sobre">Sobre</a><a href="#servicos">Serviços</a>${galleryLink}<a href="#contato">Contato</a></nav>
  ${contact ? `<a class="navcta" href="${escapeHtml(contact.href)}"${contactAttrs}>${isWhatsApp ? 'WhatsApp' : 'Ligar'}</a>` : '<a class="navcta" href="#contato">Falar</a>'}
</header>
<main id="topo" class="wrap">
  <section class="hero">
    <div>
      <h1>${escapeHtml(site.name)}</h1>
      <p class="tagline">${escapeHtml(site.tagline)}</p>
      ${highlights.length ? `<ul class="highlights">${highlights.slice(0, 3).map((item) => `<li>✓ ${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
      <div class="actions">
        ${contact ? `<a class="btn btn--solid" href="${escapeHtml(contact.href)}"${contactAttrs}>${isWhatsApp ? 'Falar no WhatsApp' : 'Ligar agora'}</a>` : ''}
        <a class="btn btn--ghost" href="#servicos">Ver serviços</a>
      </div>
    </div>
    ${heroVisual}
  </section>
  <div class="strip">
    <span>${escapeHtml(site.address || site.neighborhood)}</span>
    ${site.hours ? `<span>${escapeHtml(site.hours)}</span>` : ''}
    ${site.phone ? `<a href="${escapeHtml(telLink(site.phone))}">${escapeHtml(formatPhone(site.phone))}</a>` : ''}
  </div>
  <section class="section about" id="sobre">
    <div><h2>Perto de você,<br>feito para você.</h2></div>
    <div>
      <p>${escapeHtml(site.about)}</p>
      ${highlights.length ? `<div class="facts">${highlights.map((item, index) => `<div><b>0${index + 1}</b><span>${escapeHtml(item)}</span></div>`).join('')}</div>` : ''}
    </div>
  </section>
  ${galleryHtml}
  <section class="section" id="servicos">
    <div class="section-head"><div><h2>O que a gente faz</h2></div>${contact ? `<a class="text-link" href="${escapeHtml(contact.href)}"${contactAttrs}>Pedir orçamento →</a>` : ''}</div>
    <div class="services">
      ${services.map((service, index) => `<article class="service"><span class="service-no">0${index + 1}</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p>${service.price ? `<span class="price">${escapeHtml(service.price)}</span>` : ''}</article>`).join('')}
    </div>
  </section>
  ${menuUrl ? `<section class="menu-cta"><div><h2>Bateu a fome?</h2><p>Veja o cardápio completo e peça direto no WhatsApp.</p></div><a class="btn" href="${escapeHtml(menuUrl)}" target="_blank" rel="noreferrer">Abrir cardápio →</a></section>` : ''}
  <section class="section contact" id="contato">
    <div><h2>Vamos conversar?</h2><p>${escapeHtml(site.address || site.neighborhood)}${site.hours ? ` · ${escapeHtml(site.hours)}` : ''}</p>${mapLink}</div>
    <div class="contact-actions">
      ${contact ? `<a class="btn btn--solid" href="${escapeHtml(contact.href)}"${contactAttrs}>${escapeHtml(formatPhone(phone))}</a>` : ''}
      ${site.phone && isWhatsApp ? `<a class="btn btn--ghost" href="${escapeHtml(telLink(site.phone))}">Ligar</a>` : ''}
    </div>
  </section>
  <footer class="foot"><span>${escapeHtml(site.name)} · ${escapeHtml(site.category)}</span><span>Feito com Prato Digital${site.isDemo ? ' · prévia demonstrativa' : ''}</span></footer>
</main>
</body>
</html>`
}

export async function downloadSiteHtml(site: Site, menu?: Menu): Promise<void> {
  const html = await buildSiteHtml(site, menu)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${site.slug || 'site'}.html`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
