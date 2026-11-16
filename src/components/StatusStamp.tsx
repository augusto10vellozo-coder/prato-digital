import { STATUS_LABEL, type LeadStatus } from '../lib/types'

const CLASS: Record<LeadStatus, string> = {
  'a-contatar': 'stamp--ink',
  enviado: 'stamp--fill-blue',
  respondeu: 'stamp--fill-yellow',
  fechado: 'stamp--fill-red',
  descartado: 'stamp--hatch',
}

export function StatusStamp({ status }: { status: LeadStatus }) {
  return <span className={`stamp ${CLASS[status]}`}>{STATUS_LABEL[status]}</span>
}
