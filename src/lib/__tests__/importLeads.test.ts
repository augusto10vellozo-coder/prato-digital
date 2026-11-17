import { describe, expect, it } from 'vitest'
import { parseLeadLines } from '../importLeads'

describe('parseLeadLines', () => {
  it('aceita ponto e vírgula, tabulação e vírgula', () => {
    const linhas = parseLeadLines(
      [
        'Cantina do Zé;Centro;41999990000;Italiana',
        'Padaria Pão Bom\tBatel\t4133334444',
        'Sushi Ya,Água Verde,41988887777,Japonesa',
      ].join('\n'),
    )

    expect(linhas).toHaveLength(3)
    expect(linhas[0]).toEqual({
      name: 'Cantina do Zé',
      neighborhood: 'Centro',
      phone: '41999990000',
      category: 'Italiana',
    })
    expect(linhas[1].category).toBe('Restaurante')
    expect(linhas[1].phone).toBe('4133334444')
    expect(linhas[2].neighborhood).toBe('Água Verde')
  })

  it('ignora comentários, linhas vazias e nomes curtos', () => {
    const linhas = parseLeadLines('# cabeçalho\n\nA;Centro;41999990000\nBistrô Legal;Centro;41999990000')

    expect(linhas).toHaveLength(1)
    expect(linhas[0].name).toBe('Bistrô Legal')
  })

  it('remove máscara do telefone', () => {
    const [linha] = parseLeadLines('Restaurante X;Centro;(41) 99999-0000;Caseira')
    expect(linha.phone).toBe('41999990000')
  })
})
