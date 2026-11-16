import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import {
  BRAZIL_CITIES,
  CITY_COUNT,
  REGIONS,
  STATE_COUNT,
  type City,
  type Region,
} from '../lib/brazilCities'
import { Icon } from './Icon'

type RegionFilter = 'Todas' | Region

const REGION_FILTERS: RegionFilter[] = ['Todas', ...REGIONS]
const LISTBOX_ID = 'nw-city-listbox'
const optionId = (index: number) => `nw-city-opt-${index}`

interface CityPickerProps {
  value: City
  onChange: (city: City) => void
}

export function CityPicker({ value, onChange }: CityPickerProps) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<RegionFilter>('Todas')
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    return BRAZIL_CITIES.filter((city) => {
      if (region !== 'Todas' && city.region !== region) return false
      if (!term) return true
      return `${city.name} ${city.state}`.toLowerCase().includes(term)
    }).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }, [query, region])

  function closePanel(returnFocus = false) {
    setOpen(false)
    setQuery('')
    setRegion('Todas')
    setActiveIndex(0)
    if (returnFocus) triggerRef.current?.focus()
  }

  function choose(city: City) {
    onChange(city)
    closePanel(true)
  }

  useEffect(() => {
    if (!open) return
    function handlePointer(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        closePanel()
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closePanel(true)
      }
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
    // closePanel is stable enough for this listener; it only uses setters and refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setDropUp(spaceBelow < 360 && spaceAbove > spaceBelow)
  }, [open])

  useEffect(() => {
    if (open) searchRef.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, region, open])

  useEffect(() => {
    if (!open) return
    const list = listRef.current
    const option = document.getElementById(optionId(activeIndex))
    if (!list || !option || !list.contains(option)) return
    const listRect = list.getBoundingClientRect()
    const optionRect = option.getBoundingClientRect()
    if (optionRect.top < listRect.top) {
      list.scrollTop -= listRect.top - optionRect.top
    } else if (optionRect.bottom > listRect.bottom) {
      list.scrollTop += optionRect.bottom - listRect.bottom
    }
  }, [activeIndex, open])

  function handleSearchKey(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => Math.min(results.length - 1, current + 1))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(0, current - 1))
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(Math.max(0, results.length - 1))
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const city = results[activeIndex]
      if (city) choose(city)
    }
  }

  return (
    <div className="nw-city" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="nw-city__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closePanel(true) : setOpen(true))}
      >
        <Icon name="map-pin" size={14} />
        <span className="nw-city__name">{value.name}</span>
        <b>{value.state}</b>
        <span className="nw-city__region">{value.region}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={13} />
      </button>

      {open && (
        <div className={`nw-city__panel ${dropUp ? 'nw-city__panel--up' : ''}`}>
          <div className="nw-city__search">
            <Icon name="search" size={13} />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Buscar cidade ou UF"
              aria-label="Buscar cidade"
              role="combobox"
              aria-expanded="true"
              aria-controls={LISTBOX_ID}
              aria-autocomplete="list"
              aria-activedescendant={
                results[activeIndex] ? optionId(activeIndex) : undefined
              }
            />
          </div>

          <div className="nw-city__regions" role="group" aria-label="Filtrar por região">
            {REGION_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                aria-pressed={region === item}
                onClick={() => setRegion(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <ul
            ref={listRef}
            className="nw-city__list"
            id={LISTBOX_ID}
            role="listbox"
            aria-label="Cidades disponíveis"
          >
            {results.map((city, index) => {
              const isCurrent = city.name === value.name && city.state === value.state
              return (
                <li key={`${city.state}-${city.name}`} role="presentation">
                  <button
                    type="button"
                    role="option"
                    id={optionId(index)}
                    aria-selected={isCurrent}
                    data-active={index === activeIndex}
                    className="nw-city__opt"
                    onClick={() => choose(city)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span className="nw-city__opt-name">{city.name}</span>
                    <span className="nw-city__opt-uf">{city.state}</span>
                    <span className="nw-city__opt-region">{city.region}</span>
                  </button>
                </li>
              )
            })}
            {results.length === 0 && (
              <li className="nw-city__empty">Nenhuma cidade com esse termo.</li>
            )}
          </ul>

          <p className="nw-city__foot">
            {CITY_COUNT} cidades · {STATE_COUNT} estados · ↑↓ para navegar
          </p>
        </div>
      )}
    </div>
  )
}
