import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthError } from '../lib/auth'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { Icon } from '../components/Icon'
import { AuthShell } from '../components/AuthShell'

export function SignIn() {
  useDocumentTitle('Entrar — Prato Digital')
  const { session, signIn } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (session) return <Navigate to={from} replace />

  async function submit() {
    setError(null)
    setPending(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof AuthError
          ? 'E-mail ou senha incorretos.'
          : 'Não foi possível entrar. Tente de novo.',
      )
      setPending(false)
    }
  }

  return (
    <AuthShell
      stamp="Bem-vindo de volta"
      title={
        <>
          Entre na sua
          <br />
          <span className="auth__red">operação.</span>
        </>
      }
      deck="Sua carteira, seus projetos e o funil continuam onde você deixou."
      bullets={[
        'CRM, cardápios e sites no mesmo lugar',
        'Trial Pro de 7 dias, sem cartão',
        'Seus dados ficam neste navegador',
      ]}
      note="Demonstração: a conta e os dados ficam neste navegador. Nada é cobrado."
    >
      <h2>Entrar.</h2>
      <p className="auth__lead">Use o e-mail e a senha da sua conta.</p>

      <form
        className="auth__form"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <div className="field">
          <label htmlFor="signin-email">E-mail</label>
          <input
            id="signin-email"
            className="input"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (error) setError(null)
            }}
            autoComplete="email"
            inputMode="email"
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="signin-password">Senha</label>
          <div className="auth__pass">
            <input
              id="signin-password"
              className="input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (error) setError(null)
              }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-pressed={showPassword}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        {error && (
          <p className="auth__error" role="alert">
            <Icon name="alert" size={14} />
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--red btn--block" disabled={pending}>
          {pending ? 'Entrando…' : 'Entrar'}
          {!pending && <Icon name="arrow-right" size={15} />}
        </button>
      </form>

      <p className="auth__switch">
        Ainda não tem conta? <Link to="/criar-conta">Criar conta</Link>
      </p>
      <p className="auth__switch auth__switch--soft">
        Só quer ver? <Link to="/demo">Entrar na demonstração</Link>
      </p>
    </AuthShell>
  )
}
