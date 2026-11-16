import { SITE } from '../config'
import { isMobilePhone, onlyDigits, phoneType } from './format'
import { menuShareUrl, siteShareUrl } from './share'
import type { Lead, Menu, MessageKind, Site } from './types'

export type { MessageKind }

export function waLink(phone: string, text: string): string {
  const digits = onlyDigits(phone)
  // 10 ou 11 dígitos é DDD + número local; 55 também é um DDD brasileiro.
  const withCountry = digits.length <= 11 ? `55${digits}` : digits
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(text)}`
}

export function telLink(phone: string): string {
  const digits = onlyDigits(phone)
  return `tel:+${digits.length <= 11 ? `55${digits}` : digits}`
}

/**
 * Escolhe o canal pelo formato do número. Fixo abre o telefone, celular abre
 * o WhatsApp. Não confirma a existência da conta no WhatsApp — isso exige a
 * API oficial ou uma confirmação manual.
 */
export function contactFor(
  phone: string,
  text: string,
): { href: string; label: string; kind: 'whatsapp' | 'tel' } {
  if (phoneType(phone) === 'mobile') {
    return { href: waLink(phone, text), label: 'WhatsApp', kind: 'whatsapp' }
  }
  return { href: telLink(phone), label: 'Ligar', kind: 'tel' }
}

export function siteWhatsApp(text: string): string {
  return waLink(SITE.whatsapp, text)
}

/**
 * Mensagens de prospecção. Curtas de propósito: parecem conversa, não proposta.
 * O link da prévia é o que o dono abre no celular antes de responder.
 */
export function messageFor(kind: MessageKind, _lead: Lead, menu?: Menu, site?: Site): string {
  const links = [
    menu ? `Cardápio: ${menuShareUrl(menu)}` : '',
    site ? `Site: ${siteShareUrl(site)}` : '',
  ].filter(Boolean)
  const linkLine = links.length
    ? `\n\nDeixei a prévia pronta pra você abrir no celular:\n${links.join('\n')}`
    : ''
  const isBoth = Boolean(menu && site)
  const product = isBoth ? 'site e o cardápio' : site ? 'site' : 'cardápio'
  const preview = isBoth ? 'o site e o cardápio de vocês' : site ? 'o site de vocês' : 'o cardápio de vocês'
  const benefit = menu
    ? 'com itens, preços e botão de pedido no WhatsApp'
    : 'com serviços, horário, endereço e botão de WhatsApp'
  const missing = site && !menu ? 'um site' : 'um cardápio online'

  switch (kind) {
    case 'primeiro':
      return `Oi! Tudo bem? Encontrei o negócio de vocês no Google e notei que ainda não tem ${missing}.${linkLine}\n\nMontei uma prévia ${preview} — ${benefit}, sem app e sem comissão. Fica no ar em 48h e o link é de vocês.\n\nPosso te explicar em 2 minutos?`
    case 'follow2':
      return `Oi! Passando pra saber se você conseguiu abrir a prévia que montei.${linkLine}\n\nSe quiser, eu ajusto as fotos, os textos e os preços do jeito que vocês trabalham hoje. Consigo publicar ainda esta semana.`
    case 'follow5':
      return `Oi! Último toque sobre o ${product} de vocês.${linkLine}\n\nSe não for o momento, sem problema — deixo a prévia no ar por mais alguns dias e você me chama quando quiser. Sucesso aí!`
    case 'preco':
      return `Boa pergunta. Fica assim:\n\n• Criação do site ou cardápio: R$ ${SITE.price.setup} (uma vez)\n• Hospedagem e manutenção: R$ ${SITE.price.monthly}/mês\n• Atualização de texto, item ou horário: incluso, só mandar no WhatsApp\n• Sem comissão por pedido e sem taxa de plataforma\n\nO domínio fica no nome do negócio e o projeto é de vocês. Quer que eu deixe reservado pra começar esta semana?`
    case 'fechamento':
      return `Fechado! Vou precisar de duas coisas pra publicar em 48h:\n\n1. O material atual (fotos, textos ou cardápio)\n2. O número que vai receber os contatos e pedidos\n\nO link e o domínio ficam no nome do negócio. Assim que você mandar, eu começo.`
    default:
      return ''
  }
}

export function leadChannel(phone: string): { kind: 'whatsapp' | 'telefone'; label: string } {
  return isMobilePhone(phone)
    ? { kind: 'whatsapp', label: 'WhatsApp' }
    : { kind: 'telefone', label: 'Só fixo' }
}

export function siteMessage(kind: 'restaurante' | 'parceiro' | 'duvida'): string {
  switch (kind) {
    case 'restaurante':
      return `Oi! Vi o site da Prato Digital e quero um cardápio online para o meu restaurante. Pode me explicar como funciona?`
    case 'parceiro':
      return `Oi! Quero ser parceiro da Prato Digital para revender cardápios e sites. Pode me passar as condições?`
    case 'duvida':
      return `Oi! Tenho uma dúvida sobre o cardápio online da Prato Digital.`
  }
}
