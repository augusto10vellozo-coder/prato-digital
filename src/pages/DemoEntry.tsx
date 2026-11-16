import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'

export function DemoEntry() {
  const { startDemo } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    startDemo()
    navigate('/app', { replace: true })
  }, [navigate, startDemo])

  return (
    <main className="auth auth--loading" id="conteudo" role="status">
      <span>Abrindo demonstração…</span>
    </main>
  )
}
