import type { CSSProperties } from 'react'
import { brl } from '../lib/format'
import type { Menu } from '../lib/types'
import { WhatsAppIcon } from './Icon'

interface MenuSheetProps {
  menu: Menu
  categories?: number
  itemsPerCategory?: number
  className?: string
}

/** A folha de cardápio que aparece como suplemento impresso no encarte. */
export function MenuSheet({
  menu,
  categories = 2,
  itemsPerCategory = 4,
  className = '',
}: MenuSheetProps) {
  const shown = menu.categories.slice(0, categories)

  return (
    <div
      className={`minsert minsert--${menu.theme} ${className}`.trim()}
      style={{ '--accent': menu.accent } as CSSProperties}
      aria-hidden="true"
    >
      <div className="minsert__top">
        <span>Prévia · 48h</span>
        <span>Cardápio online</span>
      </div>
      <div className="minsert__brand">
        {menu.name}
        <small>{menu.tagline}</small>
      </div>
      <div className="minsert__meta">
        {[menu.category, menu.neighborhood, menu.hours]
          .filter(Boolean)
          .map((value) => (
            <span key={value}>{value}</span>
          ))}
      </div>
      {shown.map((category) => (
        <div className="minsert__cat" key={category.id}>
          <h4>{category.name}</h4>
          <ul className="minsert__list">
            {category.items.slice(0, itemsPerCategory).map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <i />
                <b>{brl(item.price)}</b>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="minsert__foot">
        <span>Pedido direto no WhatsApp</span>
        <span className="minsert__wa">
          <WhatsAppIcon size={12} /> Abrir
        </span>
      </div>
    </div>
  )
}
