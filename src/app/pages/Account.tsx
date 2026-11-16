import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, todayISO } from '../../lib/format'
import { initials } from '../../lib/auth'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { Icon } from '../../components/Icon'
import { PageHead, PlanTag } from '../ui'

export function AppAccount() {
  const {
    data,
    session,
    exportData,
    importData,
    resetSeed,
    startEmpty,
    setTheme,
    signOut,
    updateProfile,
    notify,
  } = useStore()
  const plan = usePlan()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const dark = data.settings.theme === 'dark'
  const [profile, setProfile] = useState({
    name: session?.name ?? '',
    company: session?.company ?? '',
    city: session?.city ?? '',
    whatsapp: session?.whatsapp ?? '',
  })

  if (!session) return null

  const isDemo = session.isDemo

  async function handleImport(file: File | undefined) {
    if (!file) return
    try {
      await importData(file)
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Não foi possível importar.')
    }
  }

  function saveProfile() {
    if (profile.name.trim().length < 2) {
      notify('Diga como podemos te chamar.')
      return
    }
    updateProfile({
      name: profile.name.trim(),
      company: profile.company.trim() || profile.name.trim(),
      city: profile.city.trim() || 'Curitiba',
      whatsapp: profile.whatsapp.trim(),
    })
    notify('Perfil atualizado.')
  }

  return (
    <div className="app-page">
      <PageHead
        title="Conta"
        subtitle="Seu perfil, plano, tema e dados. Tudo salvo neste navegador."
        actions={<PlanTag />}
      />

      <div className="app-account">
        <div className="app-stack">
          <section className="app-card">
            <div className="app-profile">
              <span className="app-avatar">{initials(session.name)}</span>
              <div>
                <div className="app-profile__name">{session.name}</div>
                <div className="app-profile__role">
                  {session.company} · {session.city}
                </div>
                <div className="app-profile__email">{session.email}</div>
              </div>
            </div>

            <div className="app-result__rows" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
              <div>
                <span>Plano</span>
                <b>{plan.plan.name}</b>
              </div>
              <div>
                <span>Status</span>
                <b>
                  {data.subscription.status === 'trial'
                    ? 'Teste'
                    : data.subscription.status === 'active'
                      ? 'Ativo'
                      : 'Expirado'}
                </b>
              </div>
              <div>
                <span>Desde</span>
                <b>{formatDate(data.subscription.startedAt)}</b>
              </div>
              <div>
                <span>Projetos</span>
                <b>
                  {plan.used} / {plan.limit ?? '∞'}
                </b>
              </div>
            </div>
            <div className="app-actions-row" style={{ marginTop: 12 }}>
              <Link className="btn btn--red btn--sm" to="/app/planos">
                <Icon name="credit-card" size={14} />
                Gerenciar plano
              </Link>
              <Link className="btn btn--ghost btn--sm" to="/">
                <Icon name="external" size={14} />
                Ver site
              </Link>
            </div>
          </section>

          <section className="app-card">
            <div className="app-card__head">
              <div>
                <div className="app-card__title">Perfil</div>
                <div className="app-note">Aparece nos contratos e no seu cardápio</div>
              </div>
              <Icon name="users" size={17} />
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="account-name">Seu nome</label>
                <input
                  id="account-name"
                  className="input"
                  value={profile.name}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="account-company">Negócio ou agência</label>
                <input
                  id="account-company"
                  className="input"
                  value={profile.company}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, company: event.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="account-city">Cidade</label>
                <input
                  id="account-city"
                  className="input"
                  value={profile.city}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, city: event.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="account-whatsapp">WhatsApp</label>
                <input
                  id="account-whatsapp"
                  className="input"
                  value={profile.whatsapp}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, whatsapp: event.target.value }))
                  }
                  inputMode="tel"
                />
              </div>
            </div>
            <div className="app-actions-row" style={{ marginTop: 12 }}>
              <button type="button" className="btn btn--red btn--sm" onClick={saveProfile}>
                <Icon name="check" size={14} />
                Salvar perfil
              </button>
            </div>
          </section>

          <section className="app-card">
            <div className="app-card__head">
              <div>
                <div className="app-card__title">Tema</div>
                <div className="app-note">Claro ou escuro no aplicativo</div>
              </div>
              <Icon name={dark ? 'moon' : 'sun'} size={17} />
            </div>
            <div className="app-actions-row">
              <button
                type="button"
                className="chip"
                aria-pressed={!dark}
                onClick={() => setTheme('light')}
              >
                <Icon name="sun" size={12} /> Claro
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={dark}
                onClick={() => setTheme('dark')}
              >
                <Icon name="moon" size={12} /> Escuro
              </button>
            </div>
          </section>
        </div>

        <div className="app-stack">
          <section className="app-card">
            <div className="app-card__head">
              <div>
                <div className="app-card__title">Seus dados</div>
                <div className="app-note">Backup, restauração e limpeza</div>
              </div>
              <Icon name="folder" size={17} />
            </div>
            <p className="app-first__text">
              A carteira inteira, os projetos, a assinatura e o feedback ficam no
              armazenamento local deste navegador. Exporte um JSON para trocar de máquina.
            </p>
            <div className="app-actions-row" style={{ marginTop: 10 }}>
              <button type="button" className="btn btn--ghost btn--sm" onClick={exportData}>
                <Icon name="download" size={14} />
                Exportar backup
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => fileRef.current?.click()}
              >
                <Icon name="upload" size={14} />
                Importar backup
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(event) => {
                  void handleImport(event.target.files?.[0])
                  event.target.value = ''
                }}
              />
            </div>
            <p className="app-note" style={{ marginTop: 8 }}>
              Última atualização: {formatDate(todayISO())}.
            </p>
          </section>

          <section className="app-card">
            <div className="app-card__head">
              <div>
                <div className="app-card__title">Zona de risco</div>
                <div className="app-note">Ações sem volta nesta conta</div>
              </div>
              <Icon name="alert" size={17} />
            </div>
            <div className="app-danger" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
              <h3>Dados da conta</h3>
              <div className="app-danger__actions">
                {isDemo && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Recarregar os dados de exemplo? O que você criou será perdido.',
                        )
                      ) {
                        resetSeed()
                      }
                    }}
                  >
                    Recarregar exemplo
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    if (window.confirm('Apagar leads, projetos e feedback desta conta?')) {
                      startEmpty()
                    }
                  }}
                >
                  <Icon name="trash" size={14} />
                  Limpar tudo
                </button>
              </div>
            </div>
            <p className="app-note" style={{ marginTop: 10 }}>
              Demonstração sem servidor: os dados ficam neste navegador. Em produção, estas
              ações ficam atrás de autenticação.
            </p>
          </section>

          <section className="app-card">
            <div className="app-card__head">
              <div>
                <div className="app-card__title">Sessão</div>
                <div className="app-note">
                  {isDemo ? 'Você está na demonstração' : session.email}
                </div>
              </div>
              <Icon name="logout" size={17} />
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                signOut()
                navigate('/')
              }}
            >
              <Icon name="logout" size={14} />
              Sair da conta
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
