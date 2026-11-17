import { describe, expect, it } from 'vitest'
import { contactFor, telLink, waLink } from '../whatsapp'

describe('whatsapp', () => {
  it('adiciona o código do país quando falta', () => {
    expect(waLink('41999990000', 'Oi!')).toBe('https://wa.me/5541999990000?text=Oi!')
    expect(waLink('5541999990000', 'Oi!')).toBe('https://wa.me/5541999990000?text=Oi!')
  })

  it('escapa o texto da mensagem', () => {
    expect(waLink('41999990000', 'Oi & tchau?')).toContain('text=Oi%20%26%20tchau%3F')
  })

  it('monta link de telefone', () => {
    expect(telLink('4133334444')).toBe('tel:+554133334444')
  })

  it('escolhe WhatsApp para celular e telefone para fixo', () => {
    expect(contactFor('41999990000', 'Oi').kind).toBe('whatsapp')
    expect(contactFor('4133334444', 'Oi').kind).toBe('tel')
    expect(contactFor('4133334444', 'Oi').href).toBe('tel:+554133334444')
  })
})
