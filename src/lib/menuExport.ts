import { brl, isMobilePhone, todayISO } from './format'
import { TAG_LABEL, type Menu, type MenuTheme } from './types'
import { telLink, waLink } from './whatsapp'

const FONT_FILES = {
  display: '/fonts/passionone-900.woff2',
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

interface ThemeTokens {
  bg: string
  fg: string
  muted: string
  line: string
  strong: string
  soft: string
}

const THEMES: Record<MenuTheme, ThemeTokens> = {
  encarte: {
    bg: '#ece4d2',
    fg: '#1a1611',
    muted: '#675b4b',
    line: 'rgba(26,22,17,.22)',
    strong: '#1a1611',
    soft: '#e2d7c1',
  },
  noite: {
    bg: '#17130f',
    fg: '#f3ead7',
    muted: '#b7a98f',
    line: 'rgba(243,234,215,.22)',
    strong: '#f3ead7',
    soft: '#221c15',
  },
  leve: {
    bg: '#fcf7ec',
    fg: '#201a13',
    muted: '#6f6252',
    line: 'rgba(32,26,19,.18)',
    strong: '#201a13',
    soft: '#f3ebdb',
  },
}

function fontFace(name: string, data: string | null, weight: string): string {
  if (!data) return ''
  return `@font-face{font-family:'${name}';src:url(data:font/woff2;base64,${data}) format('woff2');font-weight:${weight};font-style:normal;font-display:swap}`
}

export async function buildMenuHtml(menu: Menu): Promise<string> {
  const fonts = await loadFonts()
  const theme = THEMES[menu.theme]
  const accentText = menu.theme === 'noite'
    ? `color-mix(in srgb, ${menu.accent} 62%, #f3ead7)`
    : menu.accent

  const mobile = isMobilePhone(menu.phone)
  const orderLink = mobile
    ? waLink(menu.phone, `Oi! Vim pelo cardápio online do ${menu.name} e quero fazer um pedido:`)
    : telLink(menu.phone)
  const orderLabel = mobile ? 'Pedir no WhatsApp' : 'Ligar para pedir'

  const nav = menu.categories
    .filter((category) => category.items.length > 0)
    .map((category) => `<a href="#c-${escapeHtml(category.id)}">${escapeHtml(category.name)}</a>`)
    .join('')

  const sections = menu.categories
    .filter((category) => category.items.length > 0)
    .map((category) => {
      const items = category.items
        .map((item) => {
          const tags = item.tags
            .map((tag) => `<span class="tag">${escapeHtml(TAG_LABEL[tag])}</span>`)
            .join('')
          return `<li class="item">
            <div class="item__head">
              <span class="item__name">${escapeHtml(item.name)}</span>
              <i class="item__leader" aria-hidden="true"></i>
              <span class="item__price">${escapeHtml(brl(item.price))}</span>
            </div>
            ${item.description ? `<p class="item__desc">${escapeHtml(item.description)}</p>` : ''}
            ${tags ? `<div class="item__tags">${tags}</div>` : ''}
          </li>`
        })
        .join('')
      return `<section class="cat" id="c-${escapeHtml(category.id)}">
        <div class="cat__head"><h2>${escapeHtml(category.name)}</h2><span>${category.items.length} ${category.items.length === 1 ? 'item' : 'itens'}</span></div>
        ${category.note ? `<p class="cat__note">${escapeHtml(category.note)}</p>` : ''}
        <ul class="items">${items}</ul>
      </section>`
    })
    .join('')

  const meta = [
    menu.category,
    menu.neighborhood,
    menu.address,
    menu.hours,
  ].filter(Boolean)

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="${theme.bg}">
<title>${escapeHtml(menu.name)} — Cardápio</title>
<meta name="description" content="${escapeHtml(menu.tagline || `Cardápio do ${menu.name}`)}">
<style>
${fontFace('Passion One', fonts.display, '900')}
${fontFace('Archivo', fonts.body, '400 800')}
${fontFace('Courier Prime', fonts.mono, '700')}
:root{
  --bg:${theme.bg};--fg:${theme.fg};--muted:${theme.muted};--line:${theme.line};--strong:${theme.strong};--soft:${theme.soft};
  --accent:${menu.accent};--accent-text:${accentText};
  --display:'Passion One','Arial Narrow',sans-serif;--body:'Archivo','Segoe UI',sans-serif;--mono:'Courier Prime','Courier New',monospace;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:70px}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--body);font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
::selection{background:var(--accent);color:#fff8ec}
a{color:inherit}
h1,h2,p,ul{margin:0}
ul{list-style:none;padding:0}
.wrap{width:min(100% - 48px,940px);margin:0 auto}
.top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.top span:first-child{display:flex;align-items:center;gap:8px}
.demo{border:1px solid var(--accent-text);color:var(--accent-text);padding:2px 6px 1px}
header{padding:34px 0 20px;border-bottom:3px double var(--strong)}
h1{font-family:var(--display);font-weight:900;font-size:clamp(52px,9vw,104px);line-height:.8;text-transform:uppercase;letter-spacing:-.006em}
.tag{margin-top:10px;max-width:44ch;font-size:15.5px;color:var(--muted)}
.meta{display:flex;flex-wrap:wrap;gap:5px 16px;margin-top:15px;padding-top:10px;border-top:1px solid var(--line);font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.cta{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:13px 20px 11px;background:var(--accent);color:#fff8ec;border:1px solid var(--accent);font-size:12px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;text-decoration:none}
.cta--ghost{background:transparent;color:var(--fg);border-color:var(--strong)}
.note{border:1px solid var(--line);padding:10px 12px;margin-top:18px;font-size:12.5px;color:var(--muted)}
.note b{display:block;font-family:var(--mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-text);margin-bottom:3px}
nav{position:sticky;top:0;z-index:10;background:var(--bg);border-bottom:1px solid var(--strong);display:flex;gap:0;overflow-x:auto;margin-top:22px}
nav a{padding:9px 13px;border-right:1px solid var(--line);font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;color:var(--muted);white-space:nowrap}
nav a:first-child{border-left:1px solid var(--line)}
nav a:hover{color:var(--fg);background:var(--soft)}
.menu{padding:26px 0 40px}
.cat{margin-top:34px}
.cat__head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;padding-bottom:7px;border-bottom:1px solid var(--strong)}
.cat h2{font-family:var(--display);font-weight:900;font-size:clamp(32px,4.4vw,48px);line-height:.88;text-transform:uppercase}
.cat__head span{font-family:var(--mono);font-size:8.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding-bottom:3px}
.cat__note{padding-top:7px;font-size:12.5px;color:var(--muted)}
.items{display:grid;grid-template-columns:1fr 1fr;column-gap:46px;border-top:1px solid var(--line)}
.item{padding:12px 0 11px;border-bottom:1px solid var(--line);break-inside:avoid}
.item__head{display:flex;align-items:baseline;gap:8px}
.item__name{font-weight:700;font-size:15.5px;line-height:1.25}
.item__leader{flex:1;min-width:12px;border-bottom:1px dotted var(--strong);opacity:.4;transform:translateY(-3px)}
.item__price{font-family:var(--mono);font-size:14px;font-weight:700}
.item__desc{margin-top:3px;font-size:12.5px;line-height:1.45;color:var(--muted);max-width:52ch}
.item__tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px}
.tag{display:inline-block;border:1px solid var(--accent-text);color:var(--accent-text);padding:1px 5px;font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
footer{border-top:1px solid var(--strong);padding:22px 0 34px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px}
.foot-brand{font-family:var(--display);font-size:26px;font-weight:900;line-height:.9;text-transform:uppercase}
.foot-brand span{color:var(--accent-text)}
.foot-note{font-family:var(--mono);font-size:8.5px;line-height:1.6;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
@media(max-width:760px){
  .items{grid-template-columns:1fr}
  h1{font-size:clamp(48px,14vw,74px)}
  .wrap{width:min(100% - 32px,940px)}
  .actions .cta{flex:1 1 100%}
}
@media print{
  body{background:#fff;color:#000}
  nav,.top,.actions,.demo{display:none!important}
  .wrap{width:100%;max-width:none}
  .cat,.item{break-inside:avoid}
  a[href]::after{content:''}
}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <span>Cardápio digital${menu.isDemo ? ' <span class="demo">Prévia demonstrativa</span>' : ''}</span>
    <span>Atualizado em ${escapeHtml(todayISO().split('-').reverse().join('/'))}</span>
  </div>
  <header>
    <h1>${escapeHtml(menu.name)}</h1>
    ${menu.tagline ? `<p class="tag">${escapeHtml(menu.tagline)}</p>` : ''}
    <div class="meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}<span>${escapeHtml(menu.phone)}</span></div>
    <div class="actions">
      <a class="cta" href="${escapeHtml(orderLink)}" target="_blank" rel="noreferrer">${escapeHtml(orderLabel)}</a>
      <a class="cta cta--ghost" href="${escapeHtml(telLink(menu.phone))}">Ligar</a>
    </div>
    ${menu.note ? `<div class="note"><b>Da casa</b>${escapeHtml(menu.note)}</div>` : ''}
  </header>
  ${nav ? `<nav aria-label="Categorias">${nav}</nav>` : ''}
  <main class="menu">${sections}</main>
  <footer>
    <div>
      <div class="foot-brand">Prato Digital<span>.</span></div>
      <div class="foot-note">${menu.isDemo ? 'Prévia de demonstração · itens e preços ilustrativos' : 'Cardápio feito com a Prato Digital'}</div>
    </div>
    <div class="foot-note">Pedido direto com o restaurante<br>Sem taxa e sem intermediário</div>
  </footer>
</div>
</body>
</html>`
}

export async function downloadMenuHtml(menu: Menu): Promise<void> {
  const html = await buildMenuHtml(menu)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${menu.slug || 'cardapio'}.html`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
