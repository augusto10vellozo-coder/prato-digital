import type { Menu, Site } from './types'

export function encodePayload(value: unknown): string {
  const json = JSON.stringify(value)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  const chunk = 0x8000
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk))
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function decodePayload<T>(value: string): T | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }
    return JSON.parse(new TextDecoder().decode(bytes)) as T
  } catch {
    return null
  }
}

/* ---------- Cardápio ---------- */

export function encodeMenu(menu: Menu): string {
  return encodePayload(menu)
}

export function decodeMenu(value: string): Menu | null {
  const parsed = decodePayload<Menu>(value)
  if (!parsed || typeof parsed.name !== 'string' || !Array.isArray(parsed.categories)) {
    return null
  }
  return parsed
}

export function menuShareUrl(menu: Menu): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/c/${menu.slug}?m=${encodeMenu(menu)}`
}

export function decodeMenuFromLocation(): Menu | null {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get('m')
  return value ? decodeMenu(value) : null
}

/* ---------- Site ---------- */

export function encodeSite(site: Site): string {
  // Fotos viram data URLs grandes; o link compartilhável carrega só o conteúdo.
  const rest: Site = { ...site }
  delete rest.heroImage
  delete rest.gallery
  return encodePayload(rest)
}

export function decodeSite(value: string): Site | null {
  const parsed = decodePayload<Site>(value)
  if (
    !parsed ||
    typeof parsed.name !== 'string' ||
    typeof parsed.tagline !== 'string' ||
    !Array.isArray(parsed.services)
  ) {
    return null
  }
  return parsed
}

export function siteShareUrl(site: Site): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/s/${site.slug}?d=${encodeSite(site)}`
}

export function decodeSiteFromLocation(): Site | null {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get('d')
  return value ? decodeSite(value) : null
}
