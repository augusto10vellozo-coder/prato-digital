import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthError } from '../lib/auth'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { Icon } from '../components/Icon'
import { AuthShell } from '../components/AuthShell'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignUp() {
  useDocumentTitle('Criar conta — Prato Digital')
  const { session, signUp } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    city: 'Curitiba',
    whatsapp: '',
  })

  if (session) return <Navigate to="/app" replace />

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    if (error) setError(null)
  }

  function goToOperation() {
    if (form.name.trim().length < 2) {
      setError('Diga como podemos te chamar.')
      return
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError('Informe um e-mail válido.')
      return
    }
    if (form.password.length < 8) {
      setError('A senha precisa de pelo menos 8 caracteres.')
      return
    }
    setError(null)
    setStep(2)
  }

  async function submit() {
    if (form.company.trim().length < 2) {
      setError('Informe o nome do seu negócio ou agência.')
      return
    }
    setError(null)
    setPending(true)
    try {
      await signUp(form)
      navigate('/app', { replace: true })
    } catch (err) {
      if (err instanceof AuthError && err.code === 'duplicate-email') {
        setError('Já existe uma conta com esse e-mail. Entre com ela.')
        setStep(1)
      } else if (err instanceof AuthError) {
        setError('Confira os dados e tente de novo.')
      } else {
        setError('Não foi possível criar a conta. Tente de novo.')
      }
      setPending(false)
    }
  }

  return (
    <AuthShell
      stamp="Teste Pro · 7 dias"
      title={
        <>
          Sua operação
          <br />
          começa <span className="auth__red">aqui.</span>
        </>
      }
      deck="Crie a conta do desenvolvedor, monte sua carteira e entregue cardápios e sites para negócios locais."
      bullets={[
        '7 dias de Pro, sem cartão',
        'Até 40 projetos no teste',
        'Cardápios, sites, CRM e templates',
        'Cancele quando quiser',
      ]}
      note="Demonstração: a conta e os dados ficam neste navegador. Nada é cobrado."
    >
      <div className="auth__steps" aria-label="Etapas do cadastro">
        <span className={`auth__step ${step === 1 ? 'is-current' : 'is-done'}`}>
          <b>1</b> Conta
        </span>
        <span className={`auth__step ${step === 2 ? 'is-current' : 'is-todo'}`}>
          <b>2</b> Operação
        </span>
      </div>

      {step === 1 ? (
        <>
          <h2>Crie sua conta.</h2>
          <p className="auth__lead">Leva menos de um minuto.</p>

          <form
            className="auth__form"
            onSubmit={(event) => {
              event.preventDefault()
              goToOperation()
            }}
          >
            <div className="field">
              <label htmlFor="signup-name">Seu nome</label>
              <input
                id="signup-name"
                className="input"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                autoComplete="name"
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="signup-email">E-mail</label>
              <input
                id="signup-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div className="field">
              <label htmlFor="signup-password">Senha</label>
              <div className="auth__pass">
                <input
                  id="signup-password"
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  autoComplete="new-password"
                  aria-describedby="signup-password-hint"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <p className="auth__hint" id="signup-password-hint">
                Pelo menos 8 caracteres.
              </p>
            </div>

            {error && (
              <p className="auth__error" role="alert">
                <Icon name="alert" size={14} />
                {error}
              </p>
            )}

            <button type="submit" className="btn btn--red btn--block">
              Continuar
              <Icon name="arrow-right" size={15} />
            </button>
          </form>

          <p className="auth__switch">
            Já tem conta? <Link to="/entrar">Entrar</Link>
          </p>
        </>
      ) : (
        <>
          <h2>Como você opera?</h2>
          <p className="auth__lead">Isso aparece no seu perfil e nos contratos.</p>

          <form
            className="auth__form"
            onSubmit={(event) => {
              event.preventDefault()
              void submit()
            }}
          >
            <div className="field">
              <label htmlFor="signup-company">Negócio ou agência</label>
              <input
                id="signup-company"
                className="input"
                value={form.company}
                onChange={(event) => update('company', event.target.value)}
                autoComplete="organization"
                placeholder="Ex.: Studio 41 Sites"
                autoFocus
              />
            </div>

            <div className="auth__row">
              <div className="field">
                <label htmlFor="signup-city">Cidade</label>
                <input
                  id="signup-city"
                  className="input"
                  value={form.city}
                  onChange={(event) => update('city', event.target.value)}
                  autoComplete="address-level2"
                />
              </div>
              <div className="field">
                <label htmlFor="signup-whatsapp">WhatsApp</label>
                <input
                  id="signup-whatsapp"
                  className="input"
                  value={form.whatsapp}
                  onChange={(event) => update('whatsapp', event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(41) 99999-9999"
                />
              </div>
            </div>

            {error && (
              <p className="auth__error" role="alert">
                <Icon name="alert" size={14} />
                {error}
              </p>
            )}

            <div className="auth__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setError(null)
                  setStep(1)
                }}
                disabled={pending}
              >
                Voltar
              </button>
              <button type="submit" className="btn btn--red" disabled={pending}>
                {pending ? 'Criando conta…' : 'Criar conta e começar'}
                {!pending && <Icon name="arrow-right" size={15} />}
              </button>
            </div>
          </form>

          <p className="auth__switch">
            Já tem conta? <Link to="/entrar">Entrar</Link>
          </p>
        </>
      )}
    </AuthShell>
  )
}
