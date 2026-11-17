import { describe, expect, it } from 'vitest'
import {
  brl,
  daysBetween,
  formatDate,
  formatPhone,
  isMobilePhone,
  onlyDigits,
  phoneType,
  shortDate,
  slugify,
} from '../format'

describe('format', () => {
  it('formata moeda em real', () => {
    expect(brl(24).replace(/\u00a0/g, ' ')).toBe('R$ 24,00')
    expect(brl(1234.5).replace(/\u00a0/g, ' ')).toBe('R$ 1.234,50')
  })

  it('mantém apenas dígitos', () => {
    expect(onlyDigits('(41) 99999-0000')).toBe('41999990000')
    expect(onlyDigits('abc')).toBe('')
  })

  it('formata telefone brasileiro', () => {
    expect(formatPhone('41999990000')).toBe('(41) 99999-0000')
    expect(formatPhone('4133334444')).toBe('(41) 3333-4444')
    expect(formatPhone('123')).toBe('123')
  })

  it('reconhece celular pelo nono dígito', () => {
    expect(isMobilePhone('41999990000')).toBe(true)
    expect(isMobilePhone('5541999990000')).toBe(true)
    expect(isMobilePhone('4133334444')).toBe(false)
  })

  it('classifica o tipo de telefone', () => {
    expect(phoneType('41999990000')).toBe('mobile')
    expect(phoneType('4133334444')).toBe('landline')
    expect(phoneType('')).toBe('unknown')
  })

  it('gera slug sem acento', () => {
    expect(slugify('Café do Zé!')).toBe('cafe-do-ze')
    expect(slugify('  --Bistrô da Praça--  ')).toBe('bistro-da-praca')
  })

  it('formata e compara datas', () => {
    expect(formatDate('2026-11-17')).toBe('17/11/2026')
    expect(shortDate('2026-11-17')).toBe('17/11')
    expect(daysBetween('2026-01-01', '2026-01-10')).toBe(9)
  })
})
