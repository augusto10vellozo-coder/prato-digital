import { useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { City } from '../lib/brazilCities'
import type { DemoBusiness } from '../lib/demoBusinesses'
import { Icon } from './Icon'

const W = 640
const H = 430

function hashString(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rand() * (index + 1))
    const value = items[index]
    items[index] = items[swap]
    items[swap] = value
  }
  return items
}

interface Block {
  x: number
  y: number
  w: number
  h: number
  tone: 'plain' | 'built' | 'park'
}

interface MapLabel {
  x: number
  y: number
  text: string
}

interface MapGeometry {
  vertical: { x: number; width: number; arterial: boolean }[]
  horizontal: { y: number; width: number; arterial: boolean }[]
  blocks: Block[]
  diagonal: { x1: number; y1: number; x2: number; y2: number }
  river: string
  labels: MapLabel[]
  streets: MapLabel[]
  spots: { x: number; y: number }[]
}

const STREET_NAMES = ['AV. CENTRAL', 'R. DAS FLORES', 'AV. BRASIL', 'R. SÃO JOÃO']

function pickSpots(
  vertical: MapGeometry['vertical'],
  horizontal: MapGeometry['horizontal'],
  rand: () => number,
): { x: number; y: number }[] {
  const candidates: { x: number; y: number }[] = []
  for (const column of vertical) {
    for (const row of horizontal) {
      candidates.push({ x: column.x, y: row.y })
    }
  }
  // Meio de quadra também vale: dá mais pontos e evita pinos repetidos.
  for (let column = 0; column < vertical.length - 1; column += 1) {
    const x = (vertical[column].x + vertical[column + 1].x) / 2
    for (const row of horizontal) candidates.push({ x, y: row.y })
  }
  for (let row = 0; row < horizontal.length - 1; row += 1) {
    const y = (horizontal[row].y + horizontal[row + 1].y) / 2
    for (const column of vertical) candidates.push({ x: column.x, y })
  }

  // Evita as áreas cobertas pelos controles, chip da cidade e legendas.
  const safe = candidates.filter((spot) => {
    if (spot.x <= 54 || spot.x >= W - 96) return false
    if (spot.y <= 88 || spot.y >= H - 66) return false
    if (spot.y < 152 && spot.x < 380) return false
    return true
  })
  const pool = safe.length >= 8 ? safe : candidates
  if (pool.length === 0) return []

  // Amostragem do ponto mais distante: espalha os pinos pelo mapa em vez de
  // amontoá-los no primeiro canto sorteado.
  const chosen: { x: number; y: number }[] = [pool[Math.floor(rand() * pool.length)]]
  while (chosen.length < Math.min(20, pool.length)) {
    let best = pool[0]
    let bestDistance = -1
    for (const candidate of pool) {
      let nearest = Number.POSITIVE_INFINITY
      for (const spot of chosen) {
        const distance = Math.hypot(spot.x - candidate.x, spot.y - candidate.y)
        if (distance < nearest) nearest = distance
      }
      if (nearest > bestDistance) {
        bestDistance = nearest
        best = candidate
      }
    }
    chosen.push(best)
  }
  return chosen
}

function buildGeometry(city: City): MapGeometry {
  const rand = mulberry32(hashString(`${city.name}|${city.state}`))

  const vertical: MapGeometry['vertical'] = []
  let x = 34 + rand() * 26
  while (x < W - 30) {
    const arterial = vertical.length % 3 === 1
    vertical.push({ x, width: arterial ? 9 : 3.5 + rand() * 2.5, arterial })
    x += 58 + rand() * 40
  }

  const horizontal: MapGeometry['horizontal'] = []
  let y = 30 + rand() * 22
  while (y < H - 26) {
    const arterial = horizontal.length % 2 === 0
    horizontal.push({ y, width: arterial ? 8 : 3.5 + rand() * 2.5, arterial })
    y += 54 + rand() * 38
  }

  const blocks: Block[] = []
  for (let column = 0; column < vertical.length - 1; column += 1) {
    for (let row = 0; row < horizontal.length - 1; row += 1) {
      const left = vertical[column].x + vertical[column].width / 2 + 1
      const right = vertical[column + 1].x - vertical[column + 1].width / 2 - 1
      const top = horizontal[row].y + horizontal[row].width / 2 + 1
      const bottom = horizontal[row + 1].y - horizontal[row + 1].width / 2 - 1
      if (right - left < 16 || bottom - top < 16) continue
      const roll = rand()
      blocks.push({
        x: left,
        y: top,
        w: right - left,
        h: bottom - top,
        tone: roll > 0.9 ? 'park' : roll > 0.68 ? 'built' : 'plain',
      })
    }
  }

  let parks = 0
  for (const block of blocks) {
    if (block.tone !== 'park') continue
    parks += 1
    if (parks > 3) block.tone = 'plain'
  }

  const bigBlocks = blocks.filter((block) => block.w > 74 && block.h > 46)
  shuffle(bigBlocks, rand)
  const labels: MapLabel[] = city.neighborhoods
    .slice(0, 3)
    .map((text, index) => {
      const block = bigBlocks[index]
      if (!block) return null
      return {
        x: block.x + block.w / 2,
        y: block.y + block.h / 2,
        text: text.toUpperCase(),
      }
    })
    .filter((label): label is MapLabel => Boolean(label))

  const arterialRoads = horizontal.filter((road) => road.arterial).slice(0, 2)
  const streets: MapLabel[] = arterialRoads.map((road, index) => ({
    x: 92 + index * 236,
    y: road.y - 4,
    text: STREET_NAMES[index % STREET_NAMES.length],
  }))

  const riverShift = rand() * 30
  const river = `M ${W + 24} ${64 + riverShift} C ${W * 0.82} ${118 + riverShift}, ${
    W * 0.92
  } ${252} ${W * 0.6} ${H + 24}`

  const diagonal = {
    x1: -20,
    y1: H * (0.72 + rand() * 0.08),
    x2: W + 20,
    y2: H * (0.2 + rand() * 0.1),
  }

  return {
    vertical,
    horizontal,
    blocks,
    diagonal,
    river,
    labels,
    streets,
    spots: pickSpots(vertical, horizontal, rand),
  }
}

function scaleLabel(zoom: number): string {
  const meters = Math.round(1000 / zoom / 50) * 50
  return meters >= 1000 ? `${meters / 1000} km` : `${meters} m`
}

function coordinate(value: number, positive: string, negative: string): string {
  return `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`
}

interface CityMapProps {
  city: City
  businesses: DemoBusiness[]
  selected: Set<string>
  hasSearched: boolean
  hoveredId?: string | null
  onHover?: (id: string | null) => void
  onToggle: (id: string) => void
}

export function CityMap({
  city,
  businesses,
  selected,
  hasSearched,
  hoveredId,
  onHover,
  onToggle,
}: CityMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)
  const geometry = useMemo(() => buildGeometry(city), [city])
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '')

  function clampPan(next: { x: number; y: number }, atZoom = zoom) {
    const canvas = canvasRef.current
    if (!canvas) return next
    const maxX = (canvas.clientWidth * (atZoom - 1)) / 2
    const maxY = (canvas.clientHeight * (atZoom - 1)) / 2
    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    }
  }

  function changeZoom(delta: number) {
    const next = Math.max(1, Math.min(2, Number((zoom + delta).toFixed(2))))
    setZoom(next)
    setPan((current) => (next === 1 ? { x: 0, y: 0 } : clampPan(current, next)))
  }

  function resetView() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (zoom <= 1) return
    const target = event.target as HTMLElement
    if (target.closest('.nw-map__pin') || target.closest('.nw-map__zoom')) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setPan(
      clampPan({
        x: drag.originX + event.clientX - drag.startX,
        y: drag.originY + event.clientY - drag.startY,
      }),
    )
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }
  }

  const pins = useMemo(() => {
    if (!hasSearched) return []
    return businesses.map((business, index) => {
      const spot = geometry.spots[index % geometry.spots.length]
      const jitter = ((index % 3) - 1) * 5
      return {
        business,
        index,
        x: spot.x + jitter,
        y: spot.y + jitter,
      }
    })
  }, [businesses, geometry, hasSearched])

  const selectedCount = businesses.filter((business) => selected.has(business.id)).length

  return (
    <div className="nw-map">
      <div
        className="nw-map__canvas"
        ref={canvasRef}
        data-zoom={zoom > 1 ? 'on' : 'off'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="nw-map__scene"
          style={
            {
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              '--pin-scale': 1 / zoom,
            } as CSSProperties
          }
        >
          <svg
            className="nw-map__svg"
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`Mapa ilustrativo de ${city.name}, ${city.state}`}
          >
            <defs>
              <pattern id={`dots-${uid}`} width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="1.2" cy="1.2" r="0.8" className="nw-map__dot" />
              </pattern>
              <clipPath id={`clip-${uid}`}>
                <rect width={W} height={H} />
              </clipPath>
            </defs>

            <g clipPath={`url(#clip-${uid})`}>
              <rect width={W} height={H} className="nw-map__land" />
              <rect width={W} height={H} fill={`url(#dots-${uid})`} />

              {geometry.blocks.map((block, index) => (
                <rect
                  key={`block-${index}`}
                  x={block.x}
                  y={block.y}
                  width={block.w}
                  height={block.h}
                  rx="1.5"
                  className={`nw-map__block nw-map__block--${block.tone}`}
                />
              ))}

              <path d={geometry.river} className="nw-map__river" strokeWidth={26} />
              <path d={geometry.river} className="nw-map__river-core" strokeWidth={13} />

              <line
                x1={geometry.diagonal.x1}
                y1={geometry.diagonal.y1}
                x2={geometry.diagonal.x2}
                y2={geometry.diagonal.y2}
                className="nw-map__road-casing"
                strokeWidth={16}
              />
              <line
                x1={geometry.diagonal.x1}
                y1={geometry.diagonal.y1}
                x2={geometry.diagonal.x2}
                y2={geometry.diagonal.y2}
                className="nw-map__road"
                strokeWidth={13}
              />

              {geometry.vertical.map((road, index) => (
                <g key={`v-${index}`}>
                  <line
                    x1={road.x}
                    y1={0}
                    x2={road.x}
                    y2={H}
                    className="nw-map__road-casing"
                    strokeWidth={road.width + 2}
                  />
                  <line
                    x1={road.x}
                    y1={0}
                    x2={road.x}
                    y2={H}
                    className="nw-map__road"
                    strokeWidth={road.width}
                  />
                </g>
              ))}

              {geometry.horizontal.map((road, index) => (
                <g key={`h-${index}`}>
                  <line
                    x1={0}
                    y1={road.y}
                    x2={W}
                    y2={road.y}
                    className="nw-map__road-casing"
                    strokeWidth={road.width + 2}
                  />
                  <line
                    x1={0}
                    y1={road.y}
                    x2={W}
                    y2={road.y}
                    className="nw-map__road"
                    strokeWidth={road.width}
                  />
                </g>
              ))}

              <circle cx={W / 2} cy={H / 2} r={118} className="nw-map__radius" />
              <circle cx={W / 2} cy={H / 2} r={3.5} className="nw-map__center" />

              {geometry.labels.map((label) => (
                <text
                  key={label.text}
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  className="nw-map__label"
                >
                  {label.text}
                </text>
              ))}

              {geometry.streets.map((label) => (
                <text
                  key={`${label.text}-${label.y}`}
                  x={label.x}
                  y={label.y}
                  className="nw-map__street"
                  paintOrder="stroke"
                  strokeWidth={3}
                >
                  {label.text}
                </text>
              ))}
            </g>
          </svg>

          {pins.map((pin) => {
            const isSelected = selected.has(pin.business.id)
            const isHovered = hoveredId === pin.business.id
            return (
              <button
                key={pin.business.id}
                type="button"
                className={`nw-map__pin ${isSelected ? 'is-selected' : ''} ${
                  pin.business.hasSite ? 'is-ok' : ''
                } ${isHovered ? 'is-hovered' : ''}`}
                style={{ left: `${(pin.x / W) * 100}%`, top: `${(pin.y / H) * 100}%` }}
                onClick={() => onToggle(pin.business.id)}
                onMouseEnter={() => onHover?.(pin.business.id)}
                onMouseLeave={() => onHover?.(null)}
                onFocus={() => onHover?.(pin.business.id)}
                onBlur={() => onHover?.(null)}
                aria-pressed={isSelected}
                aria-label={`${pin.index + 1}. ${pin.business.name} — ${
                  isSelected ? 'remover da seleção' : 'selecionar'
                }`}
              >
                <span className="nw-map__pin-no">{pin.index + 1}</span>
                <span className="nw-map__tip" aria-hidden="true">
                  {pin.business.name}
                </span>
              </button>
            )
          })}
        </div>

        <div className="nw-map__place">
          <span className="nw-map__place-icon">
            <Icon name="map-pin" size={12} />
          </span>
          <span className="nw-map__place-text">
            <b>{city.name}</b>
            <em>
              {city.state} · {city.region}
            </em>
          </span>
          {hasSearched && (
            <span className="nw-map__count">
              {selectedCount > 0 ? `${selectedCount}/${businesses.length}` : businesses.length}
            </span>
          )}
        </div>

        <div className="nw-map__zoom" role="group" aria-label="Controles do mapa">
          <button
            type="button"
            onClick={() => changeZoom(0.25)}
            disabled={zoom >= 2}
            aria-label="Aproximar mapa"
          >
            <Icon name="plus" size={12} />
          </button>
          <button
            type="button"
            onClick={() => changeZoom(-0.25)}
            disabled={zoom <= 1}
            aria-label="Afastar mapa"
          >
            <Icon name="minus" size={12} />
          </button>
          <button
            type="button"
            onClick={resetView}
            disabled={zoom === 1}
            aria-label="Centralizar mapa"
          >
            <Icon name="target" size={12} />
          </button>
        </div>

        <span className="nw-map__compass" aria-hidden="true">
          N
        </span>

        <div className="nw-map__meta">
          <span className="nw-map__scale" aria-hidden="true">
            <i />
            <em>{scaleLabel(zoom)}</em>
          </span>
          <span className="nw-map__coords">
            {coordinate(city.lat, 'N', 'S')} · {coordinate(city.lng, 'E', 'W')}
          </span>
        </div>

        <div className="nw-map__legend" aria-hidden="true">
          <span>
            <i className="is-warn" /> Sem site
          </span>
          <span>
            <i className="is-ok" /> Com site
          </span>
        </div>

        <span className="nw-map__caption">mapa ilustrativo</span>

        {!hasSearched && (
          <span className="nw-map__hint">Busque para plotar os negócios</span>
        )}
      </div>
    </div>
  )
}
