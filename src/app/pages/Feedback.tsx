import { useState, type FormEvent } from 'react'
import { formatDate } from '../../lib/format'
import { useStore } from '../../lib/store'
import { siteWhatsApp } from '../../lib/whatsapp'
import { Icon, WhatsAppIcon } from '../../components/Icon'
import { PageHead } from '../ui'

export function AppFeedback() {
  const { data, addFeedback } = useStore()
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!message.trim()) return
    addFeedback(rating, message)
    setMessage('')
    setRating(5)
  }

  function sendWhatsApp() {
    if (!message.trim()) return
    addFeedback(rating, message)
    const text = `Feedback Prato Digital (nota ${rating}/5):\n${message.trim()}`
    window.open(siteWhatsApp(text), '_blank', 'noopener,noreferrer')
    setMessage('')
    setRating(5)
  }

  return (
    <div className="app-page">
      <PageHead
        title="Feedback"
        subtitle="O que está funcionando, o que falta e o que travou na sua operação. Lemos tudo."
        actions={<span className="stamp stamp--ink">{data.feedback.length} registro(s)</span>}
      />

      <div className="app-columns">
        <form className="app-tool" onSubmit={submit}>
          <h2>Deixe seu feedback</h2>
          <p>Nota de 1 a 5 e uma frase. Sem formulário longo.</p>

          <div className="field" style={{ marginTop: 14 }}>
            <span className="field-label">Nota</span>
            <div className="feedback-stars" role="group" aria-label="Nota de 1 a 5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="feedback-star"
                  aria-pressed={rating === value}
                  aria-label={`Nota ${value}`}
                  onClick={() => setRating(value)}
                >
                  <Icon name="star" size={17} />
                </button>
              ))}
            </div>
          </div>

          <div className="field" style={{ marginTop: 10 }}>
            <label htmlFor="feedback-message">Mensagem</label>
            <textarea
              id="feedback-message"
              className="textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ex.: o CRM funciona bem, mas queria editar o valor do contrato direto no lead."
            />
          </div>

          <div className="app-actions-row" style={{ marginTop: 10 }}>
            <button type="submit" className="btn btn--red btn--sm" disabled={!message.trim()}>
              <Icon name="send" size={14} />
              Enviar feedback
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={sendWhatsApp}
              disabled={!message.trim()}
            >
              <WhatsAppIcon size={14} />
              Enviar no WhatsApp
            </button>
          </div>
          <p className="app-note" style={{ marginTop: 8 }}>
            O feedback fica salvo neste navegador; o WhatsApp envia direto para o operador.
          </p>
        </form>

        <section className="app-card">
          <div className="app-card__head">
            <div className="app-card__title">Enviados</div>
            <Icon name="message" size={17} />
          </div>
          {data.feedback.length === 0 ? (
            <p className="crm-today__empty">Nenhum feedback ainda. O primeiro pode ser o seu.</p>
          ) : (
            <ul className="feedback-list">
              {data.feedback.map((item) => (
                <li key={item.id}>
                  <b>
                    {formatDate(item.at)} · nota {item.rating}/5
                  </b>
                  {item.message}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
