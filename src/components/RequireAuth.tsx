import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'

/** Bloqueia o app para quem não tem sessão; devolve a rota depois do login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useStore()
  const location = useLocation()

  if (!session) {
    return (
      <Navigate
        to="/entrar"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <>{children}</>
}
