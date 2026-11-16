import { STORAGE_KEY } from '../config'
import { onlyDigits } from './format'

/**
 * Autenticação simulada para a demonstração.
 *
 * As contas e a sessão vivem no `localStorage` deste navegador. A senha é
 * guardada como hash SHA-256, nunca em texto puro. Em produção isso precisa
 * virar auth de verdade no servidor (e-mail verificado, reset, sessão segura).
 */

export interface Account {
  id: string
  name: string
  email: string
  passwordHash: string
  company: string
  city: string
  whatsapp: string
  createdAt: string
}

export interface Session {
  userId: string
  name: string
  email: string
  company: string
  city: string
  whatsapp: string
  isDemo: boolean
}

export interface SignUpInput {
  name: string
  email: string
  password: string
  company: string
  city: string
  whatsapp: string
}

const ACCOUNTS_KEY = 'prato-digital:accounts'
const SESSION_KEY = 'prato-digital:session'

export const DEMO_SESSION: Session = {
  userId: 'demo',
  name: 'Cezar',
  email: 'demo@pratodigital.com.br',
  company: 'Prato Digital',
  city: 'Curitiba',
  whatsapp: '',
  isDemo: true,
}

export function dataKey(userId: string): string {
  return `${STORAGE_KEY}:data:${userId}`
}

export class AuthError extends Error {
  code: 'duplicate-email' | 'invalid-credentials' | 'invalid-input'

  constructor(code: AuthError['code']) {
    super(code)
    this.name = 'AuthError'
    this.code = code
  }
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function readAccounts(): Account[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Account[]) : []
  } catch {
    return []
  }
}

function writeAccounts(accounts: Account[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

async function hashPassword(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(`prato-digital:${value}`)
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }
  // Fallback para navegadores sem Web Crypto (a demo continua funcionando).
  let hash = 0
  for (const byte of bytes) hash = (hash * 31 + byte) >>> 0
  return `fallback-${hash.toString(16)}`
}

function toSession(account: Account): Session {
  return {
    userId: account.id,
    name: account.name,
    email: account.email,
    company: account.company,
    city: account.city,
    whatsapp: account.whatsapp,
    isDemo: false,
  }
}

export function loadSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Session>
    if (!parsed || typeof parsed.userId !== 'string') return null
    if (parsed.userId === DEMO_SESSION.userId) {
      return { ...DEMO_SESSION, ...parsed, userId: DEMO_SESSION.userId, isDemo: true }
    }
    const account = readAccounts().find((item) => item.id === parsed.userId)
    if (!account) {
      clearSession()
      return null
    }
    return toSession(account)
  } catch {
    return null
  }
}

export function saveSession(session: Session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

export function startDemoSession(): Session {
  saveSession(DEMO_SESSION)
  return { ...DEMO_SESSION }
}

export async function createAccount(input: SignUpInput): Promise<Session> {
  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const password = input.password
  const company = input.company.trim()

  if (name.length < 2 || !email.includes('@') || password.length < 8 || company.length < 2) {
    throw new AuthError('invalid-input')
  }

  const accounts = readAccounts()
  if (accounts.some((account) => account.email === email)) {
    throw new AuthError('duplicate-email')
  }

  const account: Account = {
    id: `user_${Date.now().toString(36)}`,
    name,
    email,
    passwordHash: await hashPassword(password),
    company,
    city: input.city.trim() || 'Curitiba',
    whatsapp: onlyDigits(input.whatsapp),
    createdAt: new Date().toISOString(),
  }

  writeAccounts([...accounts, account])
  const session = toSession(account)
  saveSession(session)
  return session
}

export async function authenticate(email: string, password: string): Promise<Session> {
  const account = readAccounts().find(
    (item) => item.email === normalizeEmail(email),
  )
  if (!account) throw new AuthError('invalid-credentials')
  const hash = await hashPassword(password)
  if (hash !== account.passwordHash) throw new AuthError('invalid-credentials')
  const session = toSession(account)
  saveSession(session)
  return session
}

export function updateAccountSession(
  session: Session,
  patch: Partial<Pick<Session, 'name' | 'company' | 'city' | 'whatsapp'>>,
): Session {
  const next: Session = { ...session, ...patch }
  if (!session.isDemo) {
    const accounts = readAccounts().map((account) =>
      account.id === session.userId
        ? {
            ...account,
            name: next.name,
            company: next.company,
            city: next.city,
            whatsapp: next.whatsapp,
          }
        : account,
    )
    writeAccounts(accounts)
  }
  saveSession(next)
  return next
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'PD'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
