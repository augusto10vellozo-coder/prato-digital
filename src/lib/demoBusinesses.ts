import type { City } from './brazilCities'
import { getNiche, NICHES } from './niches'

export interface DemoBusiness {
  id: string
  name: string
  category: string
  nicheId: string
  neighborhood: string
  address: string
  phone: string
  rating: number
  reviews: number
  hasSite: boolean
  hasMenu: boolean
}

const STREETS = [
  'R. das Flores',
  'Av. Brasil',
  'R. São João',
  'Av. Central',
  'R. XV de Novembro',
  'Av. Getúlio Vargas',
  'R. Marechal Deodoro',
  'Av. Independência',
  'R. Santos Dumont',
  'Av. das Nações',
  'R. Tiradentes',
  'Av. Rio Branco',
  'R. Dom Pedro II',
  'Av. JK',
  'R. da Paz',
  'Av. Sete de Setembro',
]

const GROUP_WORDS: Record<string, [string[], string[]]> = {
  food: [
    ['Casa', 'Sabor', 'Praça', 'Vila', 'Mesa', 'Ponto', 'Boca', 'Estação', 'Tempero', 'Cantinho'],
    ['do Bairro', 'da Casa', '41', 'Central', 'da Vila', 'Nova', 'do Sabor', 'da Praça', 'da Rua', 'Boa'],
  ],
  academia: [
    ['Studio', 'Forja', 'Lift', 'Movimento', 'Base', 'Pulse', 'Atleta', 'Corpo', 'Foco', 'Energia'],
    ['Essential', 'Training', 'do Bairro', 'Fit', '41', 'Performance', 'em Movimento', 'Club', 'Centro', 'Vida'],
  ],
  saude: [
    ['Clínica', 'Espaço', 'Casa', 'Cuidar', 'Vitalis', 'Bem', 'Vida', 'Saúde', 'Consulta', 'Ponto'],
    ['do Bairro', 'Vida', 'Saúde', 'Bem Estar', '41', 'Central', 'Integral', 'da Família', 'Clínica', 'Cuidado'],
  ],
  beleza: [
    ['Studio', 'Salão', 'Espaço', 'Bella', 'Navalha', 'Charm', 'Barbearia', 'Pele', 'Hair', 'Estilo'],
    ['da Vila', 'Beauty', 'do Bairro', '41', 'Hair', '& Estilo', 'Central', 'da Praça', 'Studio', 'Prime'],
  ],
  servicos: [
    ['Oficina', 'Casa', 'Pronto', 'Reforma', 'Auto', 'Solução', 'Mãos', 'Escritório', 'Serviço', 'Central'],
    ['do Bairro', '& Cia', 'Fácil', '41', 'Center', 'Local', 'à Obra', 'Central', 'Express', 'do Bairro'],
  ],
  pet: [
    ['Pet', 'Bicho', 'Mundo', 'Cão', 'Amigo', 'Pata', 'Focinho', 'Animal'],
    ['Amigo', 'Feliz', 'Pet', '& Gato', 'da Praça', '& Cia', 'do Bairro', 'Care'],
  ],
}

const NICHE_WORDS: Record<string, [string[], string[]]> = {
  hamburgueria: [
    ['Smash', 'Burger', 'Brasa', 'Chapa', 'Cheddar', 'Fome', 'Pão', 'Blend', 'Queijo', 'Bacon'],
    ['do Bairro', 'da Praça', '41', 'da Vila', 'Central', 'da Casa', 'Grill', 'do Zé', 'Burger', '& Fritas'],
  ],
  pizzaria: [
    ['Forno', 'Massa', 'Pizza', 'Fornada', 'Napolitana', 'Casa', 'Farinha', 'Brasa', 'Mozzarella', 'Fatia'],
    ['da Vila', 'do Bairro', '41', 'Central', 'da Praça', 'Nova', '& Vinho', 'da Casa', 'Napoli', 'do Forno'],
  ],
  acai: [
    ['Açaí', 'Tigela', 'Frutas', 'Ninho', 'Morango', 'Cremoso', 'Raiz', 'Energia', 'Sabor', 'Copo'],
    ['do Bairro', 'da Praia', '41', 'Fit', 'da Vila', 'Natural', '& Cia', 'Gelado', 'da Casa', 'Zero'],
  ],
  lanches: [
    ['Boteco', 'X-', 'Lanchonete', 'Ponto', 'Bar', 'Cerveja', 'Porção', 'Balcão', 'Casca', 'Chapa'],
    ['do Bairro', 'do Zé', '41', 'da Vila', 'Central', 'do Lenhador', '& Chopp', 'da Praça', 'Boa', 'da Esquina'],
  ],
  cafeteria: [
    ['Café', 'Grão', 'Casa', 'Padaria', 'Espresso', 'Filtro', 'Pão', 'Torra', 'Bule', 'Esquina'],
    ['da Esquina', 'do Bairro', '41', 'Central', 'da Praça', '& Cia', 'da Casa', 'Coado', 'do Centro', 'Nova'],
  ],
  academia: [
    ['Studio', 'Forja', 'Lift', 'Movimento', 'Base', 'Pulse', 'Atleta', 'Corpo', 'Foco', 'Energia'],
    ['Essential', 'Training', 'do Bairro', 'Fit', '41', 'Performance', 'em Movimento', 'Club', 'Centro', 'Vida'],
  ],
  odontologia: [
    ['Clínica', 'Odonto', 'Sorriso', 'Dental', 'Espaço', 'Cuidar', 'Boca', 'Vital', 'Studio', 'Center'],
    ['Vida', 'Sorrisos', 'do Bairro', '41', 'Dental', '& Saúde', 'Central', 'Prime', 'Odonto', 'da Família'],
  ],
  pet: [
    ['Pet', 'Bicho', 'Mundo', 'Cão', 'Amigo', 'Pata', 'Focinho', 'Animal'],
    ['Amigo', 'Feliz', 'Pet', '& Gato', 'da Praça', '& Cia', 'do Bairro', 'Care'],
  ],
}

function wordsFor(nicheId: string, group: string): [string[], string[]] {
  return NICHE_WORDS[nicheId] ?? GROUP_WORDS[group] ?? GROUP_WORDS.servicos
}

/**
 * Gera uma lista ilustrativa e determinística de negócios para o wizard.
 * Não consulta o Google Maps: a busca real abre em uma nova aba.
 */
export function searchDemoBusinesses(
  nicheId: string,
  city: City,
  quantity: number,
): DemoBusiness[] {
  const niche = getNiche(nicheId)
  const [first, second] = wordsFor(niche.id, niche.group)
  const nicheIndex = Math.max(0, NICHES.findIndex((item) => item.id === niche.id))
  const neighborhoods = city.neighborhoods.length ? city.neighborhoods : ['Centro']

  return Array.from({ length: quantity }).map((_, index) => {
    const a = first[(index + nicheIndex) % first.length]
    const b = second[(index * 3 + nicheIndex) % second.length]
    const cycle = Math.floor(index / first.length)
    const suffix = cycle === 0 ? '' : cycle === 1 ? ' II' : cycle === 2 ? ' III' : ` ${cycle + 1}`
    const neighborhood = neighborhoods[(index + nicheIndex) % neighborhoods.length]
    const street = STREETS[(index + nicheIndex * 2) % STREETS.length]
    const number = 120 + index * 37
    const phone = `${city.ddd}9${String(
      80000000 + ((nicheIndex * 1000 + index * 137) % 9999999),
    ).slice(0, 8)}`
    const rating = Number((4.2 + ((index * 7 + nicheIndex) % 8) / 10).toFixed(1))
    const reviews = 16 + ((index * 41 + nicheIndex * 13) % 380)

    return {
      id: `${niche.id}-${city.state.toLowerCase()}-${city.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')}-${index}`,
      name: `${a} ${b}${suffix}`.replace(/\s+/g, ' ').trim(),
      category: niche.label,
      nicheId: niche.id,
      neighborhood,
      address: `${street}, ${number} — ${neighborhood}, ${city.name} - ${city.state}`,
      phone,
      rating,
      reviews,
      hasSite: index % 5 === 4,
      hasMenu: niche.kind === 'food' ? index % 4 === 3 : false,
    }
  })
}

