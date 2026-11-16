import { useStore } from '../lib/store'

export function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      {toast}
    </div>
  )
}
