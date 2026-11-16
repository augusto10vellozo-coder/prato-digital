const RESTAURANT_ITEMS = [
  'Sem app para baixar',
  'Sem comissão por pedido',
  'Link e domínio no seu nome',
  'Atualização de preço por WhatsApp',
  'Pedido cai direto no seu WhatsApp',
  'No ar em 48 horas',
]

interface TickerProps {
  items?: string[]
}

export function Ticker({ items = RESTAURANT_ITEMS }: TickerProps) {
  return (
    <div className="ticker" aria-label="O que está incluso">
      <div className="ticker__track">
        <div className="ticker__group">
          {items.map((item) => (
            <span className="ticker__item" key={item}>
              {item}
            </span>
          ))}
        </div>
        <div className="ticker__group" aria-hidden="true">
          {items.map((item) => (
            <span className="ticker__item" key={`${item}-dup`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
