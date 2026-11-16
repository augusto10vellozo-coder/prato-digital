import { onlyDigits } from './format'

export interface ParsedLeadLine {
  name: string
  neighborhood: string
  phone: string
  category: string
}

/**
 * Formato: nome; bairro; telefone; categoria
 * Também aceita tabulação ou vírgula como separador.
 */
export function parseLeadLines(text: string): ParsedLeadLine[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const parts = line.split(/[;\t,]/).map((part) => part.trim())
      return {
        name: parts[0] ?? '',
        neighborhood: parts[1] ?? '',
        phone: onlyDigits(parts[2] ?? ''),
        category: parts[3] || 'Restaurante',
      }
    })
    .filter((item) => item.name.length > 1)
}
