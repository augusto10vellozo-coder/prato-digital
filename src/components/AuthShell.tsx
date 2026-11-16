import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

interface AuthShellProps {
  stamp: string
  title: ReactNode
  deck: string
  bullets: string[]
  note: string
  children: ReactNode
}

export function AuthShell({ stamp, title, deck, bullets, note, children }: AuthShellProps) {
  return (
    <div className="auth">
      <header className="auth__bar">
        <Link className="auth__brand" to="/">
          Prato Digital<span>.</span>
        </Link>
        <Link className="auth__back" to="/">
          Voltar ao site
        </Link>
      </header>

      <main className="auth__main" id="conteudo">
        <section className="auth__pitch">
          <span className="stamp stamp--red">{stamp}</span>
          <h1>{title}</h1>
          <p>{deck}</p>
          <ul>
            {bullets.map((bullet) => (
              <li key={bullet}>
                <Icon name="check" size={14} />
                {bullet}
              </li>
            ))}
          </ul>
          <p className="auth__note">{note}</p>
        </section>

        <section className="auth__panel">{children}</section>
      </main>

      <footer className="auth__foot">
        <span>Prato Digital · demonstração</span>
        <span>Contas e senhas ficam neste navegador</span>
      </footer>
    </div>
  )
}
