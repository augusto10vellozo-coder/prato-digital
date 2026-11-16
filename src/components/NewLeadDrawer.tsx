import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { onlyDigits } from '../lib/format'
import type { Priority } from '../lib/types'
import { Drawer } from './Drawer'
import { Icon } from './Icon'

const CATEGORIES = [
  'Hamburgueria',
  'Pizzaria',
  'Açaí',
  'Lanches',
  'Bistrô',
  'Comida brasileira',
  'Japonês',
  'Doceria',
  'Cafeteria',
  'Marmita',
]

interface NewLeadDrawerProps {
  onClose: () => void
  builderPath?: (leadId: string) => string
}

export function NewLeadDrawer({
  onClose,
  builderPath = (leadId) => `/app/projetos/${leadId}`,
}: NewLeadDrawerProps) {
  const { addLead } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [phone, setPhone] = useState('')
  const [rating, setRating] = useState('4.5')
  const [reviews, setReviews] = useState('')
  const [priority, setPriority] = useState<Priority>('media')
  const [notes, setNotes] = useState('')
  const [hasSite, setHasSite] = useState(false)
  const [hasMenu, setHasMenu] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Informe o nome do restaurante.'
    if (!category.trim()) next.category = 'Informe a categoria.'
    if (onlyDigits(phone).length < 10) next.phone = 'Informe DDD + número.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function submit(event: FormEvent, openBuilder: boolean) {
    event.preventDefault()
    if (!validate()) return

    const created = addLead({
      name,
      category,
      neighborhood,
      phone: onlyDigits(phone),
      rating: Math.min(5, Math.max(0, Number(rating.replace(',', '.')) || 0)),
      reviews: Math.max(0, Number(reviews) || 0),
      priority,
      notes,
      hasSite,
      hasMenu,
    })

    onClose()
    if (openBuilder) navigate(builderPath(created.id))
  }

  return (
    <Drawer kicker="Cadastro rápido" title="Novo lead" onClose={onClose}>
      <form onSubmit={(event) => submit(event, false)}>
        <div className="form-grid">
          <div className="field span-2">
            <label htmlFor="new-name">Restaurante *</label>
            <input
              id="new-name"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Fx Burgers Grill"
              autoFocus
            />
            {errors.name && <span className="builder-hint" style={{ color: 'var(--red-dark)' }}>{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="new-category">Categoria *</label>
            <input
              id="new-category"
              className="input"
              list="lead-categories"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Hamburgueria"
            />
            <datalist id="lead-categories">
              {CATEGORIES.map((item) => (
                <option value={item} key={item} />
              ))}
            </datalist>
            {errors.category && <span className="builder-hint" style={{ color: 'var(--red-dark)' }}>{errors.category}</span>}
          </div>

          <div className="field">
            <label htmlFor="new-neighborhood">Bairro</label>
            <input
              id="new-neighborhood"
              className="input"
              value={neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
              placeholder="Hauer"
            />
          </div>

          <div className="field">
            <label htmlFor="new-phone">Telefone / WhatsApp *</label>
            <input
              id="new-phone"
              className="input"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(41) 99999-9999"
            />
            {errors.phone && <span className="builder-hint" style={{ color: 'var(--red-dark)' }}>{errors.phone}</span>}
          </div>

          <div className="field">
            <label htmlFor="new-priority">Prioridade</label>
            <select
              id="new-priority"
              className="select"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="new-rating">Nota no Google</label>
            <input
              id="new-rating"
              className="input"
              inputMode="decimal"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              placeholder="4.5"
            />
          </div>

          <div className="field">
            <label htmlFor="new-reviews">Avaliações</label>
            <input
              id="new-reviews"
              className="input"
              inputMode="numeric"
              value={reviews}
              onChange={(event) => setReviews(event.target.value)}
              placeholder="64"
            />
          </div>

          <div className="field span-2">
            <label htmlFor="new-notes">Observação</label>
            <textarea
              id="new-notes"
              className="textarea"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="O que chamou atenção neste lead? Onde encontrou?"
            />
          </div>

          <div className="span-2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="check">
              <input
                type="checkbox"
                checked={hasSite}
                onChange={(event) => setHasSite(event.target.checked)}
              />
              Já tem site
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={hasMenu}
                onChange={(event) => setHasMenu(event.target.checked)}
              />
              Já tem cardápio online
            </label>
          </div>
        </div>

        <div className="drawer__actions" style={{ marginTop: 18 }}>
          <button type="submit" className="btn btn--ghost btn--sm">
            Salvar lead
          </button>
          <button
            type="button"
            className="btn btn--red btn--sm"
            onClick={(event) => submit(event, true)}
          >
            <Icon name="plus" size={14} />
            Salvar e gerar cardápio
          </button>
        </div>
        <p className="builder-hint" style={{ marginTop: 10 }}>
          O lead entra como “A contatar”. Depois de gerar o cardápio, a mensagem de primeiro
          contato já sai com o link da prévia.
        </p>
      </form>
    </Drawer>
  )
}
