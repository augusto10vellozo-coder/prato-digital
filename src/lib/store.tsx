import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { SITE, STORAGE_KEY } from '../config'
import { buildSeed, emptyData } from './seed'
import { isoDaysFromNow, onlyDigits, todayISO, uid } from './format'
import {
  authenticate,
  clearSession,
  createAccount,
  dataKey,
  loadSession,
  startDemoSession,
  updateAccountSession,
  type Session,
  type SignUpInput,
} from './auth'
import type {
  AppData,
  AppTheme,
  BioProfile,
  HistoryKind,
  Lead,
  LeadStatus,
  Menu,
  PlanId,
  Site,
} from './types'

export interface NewLeadInput {
  name: string
  category: string
  neighborhood: string
  phone: string
  rating: number
  reviews: number
  priority: Lead['priority']
  notes: string
  hasSite: boolean
  hasMenu: boolean
  isDemo?: boolean
}

export interface NewProjectInput {
  lead: NewLeadInput
  menu?: Menu
  site?: Site
}

interface StoreValue {
  data: AppData
  leads: Lead[]
  menus: Menu[]
  sites: Site[]
  session: Session | null
  toast: string | null
  notify: (message: string) => void
  signUp: (input: SignUpInput) => Promise<Session>
  signIn: (email: string, password: string) => Promise<Session>
  signOut: () => void
  startDemo: () => void
  updateProfile: (
    patch: Partial<Pick<Session, 'name' | 'company' | 'city' | 'whatsapp'>>,
  ) => void
  addLead: (input: NewLeadInput) => Lead
  addLeads: (inputs: NewLeadInput[]) => Lead[]
  addProjects: (inputs: NewProjectInput[]) => { leads: Lead[]; menus: Menu[]; sites: Site[] }
  updateLead: (id: string, patch: Partial<Lead>) => void
  deleteLead: (id: string) => void
  setStatus: (id: string, status: LeadStatus) => void
  addNote: (id: string, text: string) => void
  logMessage: (id: string, text: string) => void
  completeFollowUp: (id: string) => void
  saveMenu: (menu: Menu, leadId?: string) => void
  deleteMenu: (id: string) => void
  menuBySlug: (slug: string) => Menu | undefined
  menuById: (id?: string) => Menu | undefined
  saveSite: (site: Site, leadId?: string) => void
  deleteSite: (id: string) => void
  siteBySlug: (slug: string) => Site | undefined
  siteById: (id?: string) => Site | undefined
  changePlan: (plan: PlanId) => void
  setTheme: (theme: AppTheme) => void
  updateBio: (bio: Partial<BioProfile>) => void
  addFeedback: (rating: number, message: string) => void
  exportData: () => void
  importData: (file: File) => Promise<void>
  resetSeed: () => void
  startEmpty: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function historyEntry(kind: HistoryKind, text: string) {
  return { id: uid('h'), kind, at: todayISO(), text }
}

function makeLead(input: NewLeadInput): Lead {
  return {
    id: uid('lead'),
    name: input.name.trim(),
    category: input.category.trim(),
    neighborhood: input.neighborhood.trim(),
    phone: input.phone.trim(),
    rating: input.rating,
    reviews: input.reviews,
    hasSite: input.hasSite,
    hasMenu: input.hasMenu,
    isDemo: input.isDemo ?? false,
    status: 'a-contatar',
    priority: input.priority,
    notes: input.notes.trim(),
    createdAt: todayISO(),
    history: [historyEntry('nota', 'Lead adicionado à carteira.')],
  }
}

function mergeData(parsed: Partial<AppData>, base: AppData): AppData {
  return {
    ...base,
    ...parsed,
    version: 1,
    sites: Array.isArray(parsed.sites) ? parsed.sites : [],
    subscription: parsed.subscription ?? base.subscription,
    settings: {
      ...base.settings,
      ...(parsed.settings ?? {}),
      bio: {
        ...base.settings.bio,
        ...(parsed.settings?.bio ?? {}),
      },
    },
    feedback: Array.isArray(parsed.feedback) ? parsed.feedback : [],
  }
}

function parseStored(raw: string, base: AppData): AppData | null {
  try {
    const parsed = JSON.parse(raw) as Partial<AppData>
    if (!parsed || !Array.isArray(parsed.leads) || !Array.isArray(parsed.menus)) {
      return null
    }
    return mergeData(parsed, base)
  } catch {
    return null
  }
}

function loadDemoData(): AppData {
  const key = dataKey('demo')
  const markDemo = (data: AppData): AppData => ({
    ...data,
    leads: data.leads.map((lead) => ({ ...lead, isDemo: true })),
  })
  try {
    const stored = window.localStorage.getItem(key)
    if (stored) {
      const parsed = parseStored(stored, buildSeed())
      if (parsed) return markDemo(parsed)
    }
    // Migra a carteira de demonstração da versão anterior (chave única).
    const legacy = window.localStorage.getItem(STORAGE_KEY)
    if (legacy) {
      const parsed = parseStored(legacy, buildSeed())
      if (parsed) {
        const data = markDemo(parsed)
        window.localStorage.setItem(key, JSON.stringify(data))
        window.localStorage.removeItem(STORAGE_KEY)
        return data
      }
    }
  } catch {
    // Sem armazenamento: segue com o seed em memória.
  }
  const seed = markDemo(buildSeed())
  try {
    window.localStorage.setItem(key, JSON.stringify(seed))
  } catch {
    // Sem armazenamento: segue em memória.
  }
  return seed
}

function loadUserData(session: Session): AppData {
  const base = emptyData()
  base.settings.bio.name = session.company || session.name
  if (session.whatsapp) base.settings.bio.whatsapp = session.whatsapp

  try {
    const stored = window.localStorage.getItem(dataKey(session.userId))
    if (stored) {
      const parsed = parseStored(stored, base)
      if (parsed) return parsed
    }
  } catch {
    // Sem armazenamento: começa vazio.
  }
  return base
}

function loadDataFor(session: Session | null): AppData {
  if (!session) return loadDemoData()
  return session.isDemo ? loadDemoData() : loadUserData(session)
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession)
  const [data, setData] = useState<AppData>(() => loadDataFor(loadSession()))
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!session) return
    try {
      window.localStorage.setItem(dataKey(session.userId), JSON.stringify(data))
    } catch {
      // Armazenamento cheio ou bloqueado: a sessão continua em memória.
    }
  }, [data, session])

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current)
  }, [])

  const notify = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  const commit = useCallback((updater: (current: AppData) => AppData) => {
    setData((current) => ({ ...updater(current), updatedAt: new Date().toISOString() }))
  }, [])

  const addLead = useCallback(
    (input: NewLeadInput): Lead => {
      const newLead = makeLead(input)
      commit((current) => ({ ...current, leads: [newLead, ...current.leads] }))
      notify(`${newLead.name} entrou na mesa.`)
      return newLead
    },
    [commit, notify],
  )

  const addLeads = useCallback(
    (inputs: NewLeadInput[]): Lead[] => {
      const created = inputs.map(makeLead)
      if (created.length === 0) return created
      commit((current) => ({ ...current, leads: [...created, ...current.leads] }))
      notify(
        created.length === 1
          ? `${created[0].name} entrou na mesa.`
          : `${created.length} leads entraram na mesa.`,
      )
      return created
    },
    [commit, notify],
  )

  const addProjects = useCallback(
    (inputs: NewProjectInput[]) => {
      const createdLeads: Lead[] = []
      const createdMenus: Menu[] = []
      const createdSites: Site[] = []

      for (const input of inputs) {
        const newLead = makeLead(input.lead)
        if (input.menu) {
          createdMenus.push(input.menu)
          newLead.menuId = input.menu.id
        }
        if (input.site) {
          createdSites.push(input.site)
          newLead.siteId = input.site.id
        }
        newLead.history.push(
          historyEntry(
            'nota',
            `Projeto criado a partir da busca por nicho: ${[
              input.menu ? 'cardápio' : '',
              input.site ? 'site' : '',
            ]
              .filter(Boolean)
              .join(' + ')}.`,
          ),
        )
        createdLeads.push(newLead)
      }

      if (createdLeads.length === 0) {
        return { leads: [], menus: [], sites: [] }
      }

      commit((current) => ({
        ...current,
        leads: [...createdLeads, ...current.leads],
        menus: [...createdMenus, ...current.menus],
        sites: [...createdSites, ...current.sites],
      }))
      notify(
        `${createdLeads.length} lead(s) e ${
          createdMenus.length + createdSites.length
        } projeto(s) criados.`,
      )
      return { leads: createdLeads, menus: createdMenus, sites: createdSites }
    },
    [commit, notify],
  )

  const updateLead = useCallback(
    (id: string, patch: Partial<Lead>) => {
      commit((current) => ({
        ...current,
        leads: current.leads.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)),
      }))
    },
    [commit],
  )

  const deleteLead = useCallback(
    (id: string) => {
      commit((current) => {
        const lead = current.leads.find((item) => item.id === id)
        const menuId = lead?.menuId
        const siteId = lead?.siteId
        return {
          ...current,
          leads: current.leads.filter((item) => item.id !== id),
          menus: menuId ? current.menus.filter((menu) => menu.id !== menuId) : current.menus,
          sites: siteId ? current.sites.filter((site) => site.id !== siteId) : current.sites,
        }
      })
      notify('Lead removido da mesa.')
    },
    [commit, notify],
  )

  const setStatus = useCallback(
    (id: string, status: LeadStatus) => {
      commit((current) => ({
        ...current,
        leads: current.leads.map((lead) => {
          if (lead.id !== id) return lead
          const patch: Partial<Lead> = { status }
          if (status === 'enviado') {
            patch.lastContactAt = todayISO()
            patch.followUpAt = isoDaysFromNow(2)
          }
          if (status === 'respondeu') {
            patch.lastContactAt = todayISO()
            patch.followUpAt = undefined
          }
          if (status === 'fechado' || status === 'descartado') {
            patch.followUpAt = undefined
          }
          if (status === 'fechado' && !lead.deal) {
            patch.deal = { setup: SITE.price.setup, monthly: SITE.price.monthly }
          }
          return {
            ...lead,
            ...patch,
            history: [
              ...lead.history,
              historyEntry('status', `Status alterado para ${status}.`),
            ],
          }
        }),
      }))
    },
    [commit],
  )

  const addNote = useCallback(
    (id: string, text: string) => {
      const clean = text.trim()
      if (!clean) return
      commit((current) => ({
        ...current,
        leads: current.leads.map((lead) =>
          lead.id === id
            ? { ...lead, history: [...lead.history, historyEntry('nota', clean)] }
            : lead,
        ),
      }))
      notify('Anotação salva.')
    },
    [commit, notify],
  )

  const logMessage = useCallback(
    (id: string, text: string) => {
      commit((current) => ({
        ...current,
        leads: current.leads.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                status: lead.status === 'a-contatar' ? 'enviado' : lead.status,
                lastContactAt: todayISO(),
                followUpAt: isoDaysFromNow(2),
                history: [
                  ...lead.history,
                  historyEntry('mensagem', text || 'Mensagem aberta no WhatsApp.'),
                ],
              }
            : lead,
        ),
      }))
    },
    [commit],
  )

  const completeFollowUp = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        leads: current.leads.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                followUpAt: isoDaysFromNow(2),
                history: [
                  ...lead.history,
                  historyEntry('nota', 'Follow-up feito. Próximo contato agendado em D+2.'),
                ],
              }
            : lead,
        ),
      }))
      notify('Follow-up registrado. Próximo em 2 dias.')
    },
    [commit, notify],
  )

  const saveMenu = useCallback(
    (menu: Menu, leadId?: string) => {
      const saved: Menu = { ...menu, updatedAt: todayISO() }
      commit((current) => {
        const exists = current.menus.some((item) => item.id === saved.id)
        return {
          ...current,
          menus: exists
            ? current.menus.map((item) => (item.id === saved.id ? saved : item))
            : [...current.menus, saved],
          leads: leadId
            ? current.leads.map((lead) =>
                lead.id === leadId
                  ? {
                      ...lead,
                      menuId: saved.id,
                      history: [
                        ...lead.history,
                        historyEntry('cardapio', `Cardápio "${saved.name}" salvo e atualizado.`),
                      ],
                    }
                  : lead,
              )
            : current.leads,
        }
      })
      notify('Cardápio salvo.')
    },
    [commit, notify],
  )

  const deleteMenu = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        menus: current.menus.filter((menu) => menu.id !== id),
        leads: current.leads.map((lead) =>
          lead.menuId === id ? { ...lead, menuId: undefined } : lead,
        ),
      }))
      notify('Cardápio removido.')
    },
    [commit, notify],
  )

  const menuBySlug = useCallback(
    (slug: string) => {
      const own = data.menus.find((menu) => menu.slug === slug)
      if (own || session?.isDemo) return own
      // Links públicos de exemplo continuam abrindo mesmo com outra conta logada.
      return loadDemoData().menus.find((menu) => menu.slug === slug)
    },
    [data.menus, session],
  )

  const menuById = useCallback(
    (id?: string) => {
      if (!id) return undefined
      const own = data.menus.find((menu) => menu.id === id)
      if (own || session?.isDemo) return own
      return loadDemoData().menus.find((menu) => menu.id === id)
    },
    [data.menus, session],
  )

  const saveSite = useCallback(
    (site: Site, leadId?: string) => {
      const saved: Site = { ...site, updatedAt: todayISO() }
      commit((current) => {
        const exists = current.sites.some((item) => item.id === saved.id)
        return {
          ...current,
          sites: exists
            ? current.sites.map((item) => (item.id === saved.id ? saved : item))
            : [...current.sites, saved],
          leads: leadId
            ? current.leads.map((lead) =>
                lead.id === leadId
                  ? {
                      ...lead,
                      siteId: saved.id,
                      history: [
                        ...lead.history,
                        historyEntry('site', `Site "${saved.name}" salvo e atualizado.`),
                      ],
                    }
                  : lead,
              )
            : current.leads,
        }
      })
      notify('Site salvo.')
    },
    [commit, notify],
  )

  const deleteSite = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        sites: current.sites.filter((site) => site.id !== id),
        leads: current.leads.map((lead) =>
          lead.siteId === id ? { ...lead, siteId: undefined } : lead,
        ),
      }))
      notify('Site removido.')
    },
    [commit, notify],
  )

  const siteBySlug = useCallback(
    (slug: string) => {
      const own = data.sites.find((site) => site.slug === slug)
      if (own || session?.isDemo) return own
      return loadDemoData().sites.find((site) => site.slug === slug)
    },
    [data.sites, session],
  )

  const siteById = useCallback(
    (id?: string) => {
      if (!id) return undefined
      const own = data.sites.find((site) => site.id === id)
      if (own || session?.isDemo) return own
      return loadDemoData().sites.find((site) => site.id === id)
    },
    [data.sites, session],
  )

  const changePlan = useCallback(
    (plan: PlanId) => {
      commit((current) => ({
        ...current,
        subscription: {
          plan,
          status: 'active',
          startedAt: current.subscription.startedAt || todayISO(),
          renewsAt: isoDaysFromNow(30),
          trialEndsAt: undefined,
        },
      }))
      notify('Plano ativado no modo demonstração. Nenhuma cobrança foi feita.')
    },
    [commit, notify],
  )

  const setTheme = useCallback(
    (theme: AppTheme) => {
      commit((current) => ({
        ...current,
        settings: { ...current.settings, theme },
      }))
    },
    [commit],
  )

  const updateBio = useCallback(
    (bio: Partial<BioProfile>) => {
      commit((current) => ({
        ...current,
        settings: {
          ...current.settings,
          bio: { ...current.settings.bio, ...bio },
        },
      }))
    },
    [commit],
  )

  const addFeedback = useCallback(
    (rating: number, message: string) => {
      const clean = message.trim()
      if (!clean) return
      const entry = { id: uid('fb'), rating, message: clean, at: todayISO() }
      commit((current) => ({ ...current, feedback: [entry, ...current.feedback] }))
      notify('Feedback registrado. Obrigado!')
    },
    [commit, notify],
  )

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `prato-digital-backup-${todayISO()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    notify('Backup exportado em JSON.')
  }, [data, notify])

  const importData = useCallback(
    async (file: File) => {
      const text = await file.text()
      const parsed = JSON.parse(text) as Partial<AppData>
      if (!parsed || !Array.isArray(parsed.leads) || !Array.isArray(parsed.menus)) {
        throw new Error('O arquivo não parece ser um backup da Prato Digital.')
      }
      const base = session?.isDemo ? buildSeed() : emptyData()
      const next = {
        ...mergeData(parsed, base),
        seeded: parsed.seeded ?? false,
        updatedAt: new Date().toISOString(),
      }
      commit(() => next)
      notify('Backup importado.')
    },
    [commit, notify, session],
  )

  const resetSeed = useCallback(() => {
    setData(buildSeed())
    notify('Dados de exemplo recarregados.')
  }, [notify])

  const startEmpty = useCallback(() => {
    setData(emptyData())
    notify('Mesa limpa. Cadastre seu primeiro lead.')
  }, [notify])

  const signUp = useCallback(
    async (input: SignUpInput): Promise<Session> => {
      const next = await createAccount(input)
      const nextData = emptyData()
      nextData.settings.bio.name = input.company.trim() || input.name.trim()
      const whatsapp = onlyDigits(input.whatsapp)
      if (whatsapp) nextData.settings.bio.whatsapp = whatsapp
      try {
        window.localStorage.setItem(dataKey(next.userId), JSON.stringify(nextData))
      } catch {
        // Sem armazenamento: segue em memória.
      }
      setSession(next)
      setData(nextData)
      notify('Conta criada. Seu teste Pro de 7 dias começou.')
      return next
    },
    [notify],
  )

  const signIn = useCallback(
    async (email: string, password: string): Promise<Session> => {
      const next = await authenticate(email, password)
      setSession(next)
      setData(loadDataFor(next))
      notify('Bem-vindo de volta.')
      return next
    },
    [notify],
  )

  const signOut = useCallback(() => {
    clearSession()
    setSession(null)
    setData(loadDemoData())
  }, [])

  const startDemo = useCallback(() => {
    const next = startDemoSession()
    setSession(next)
    setData(loadDemoData())
    notify('Demonstração aberta. Os dados são ilustrativos.')
  }, [notify])

  const updateProfile = useCallback(
    (patch: Partial<Pick<Session, 'name' | 'company' | 'city' | 'whatsapp'>>) => {
      if (!session) return
      const next = updateAccountSession(session, patch)
      setSession(next)
      setData((current) => ({
        ...current,
        settings: {
          ...current.settings,
          bio: {
            ...current.settings.bio,
            name: next.company || next.name,
            whatsapp: next.whatsapp || current.settings.bio.whatsapp,
          },
        },
      }))
    },
    [session],
  )

  const value = useMemo<StoreValue>(
    () => ({
      data,
      leads: data.leads,
      menus: data.menus,
      sites: data.sites,
      session,
      toast,
      notify,
      signUp,
      signIn,
      signOut,
      startDemo,
      updateProfile,
      addLead,
      addLeads,
      addProjects,
      updateLead,
      deleteLead,
      setStatus,
      addNote,
      logMessage,
      completeFollowUp,
      saveMenu,
      deleteMenu,
      menuBySlug,
      menuById,
      saveSite,
      deleteSite,
      siteBySlug,
      siteById,
      changePlan,
      setTheme,
      updateBio,
      addFeedback,
      exportData,
      importData,
      resetSeed,
      startEmpty,
    }),
    [
      data,
      session,
      toast,
      notify,
      signUp,
      signIn,
      signOut,
      startDemo,
      updateProfile,
      addLead,
      addLeads,
      addProjects,
      updateLead,
      deleteLead,
      setStatus,
      addNote,
      logMessage,
      completeFollowUp,
      saveMenu,
      deleteMenu,
      menuBySlug,
      menuById,
      saveSite,
      deleteSite,
      siteBySlug,
      siteById,
      changePlan,
      setTheme,
      updateBio,
      addFeedback,
      exportData,
      importData,
      resetSeed,
      startEmpty,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore precisa estar dentro de StoreProvider')
  return value
}
