import type { DonationStatus } from "../types";

// o status do agendamento só é exibido quando o dono pediu outra data
export const SCHEDULE_REFUSED_STATUS = { label: 'Recusado', className: 'bg-red-200 text-red-700' }

export const STATUS: Record<DonationStatus, { label: string; className: string }> = {
  Pendente: { label: 'Pendente', className: 'bg-amber-100 text-amber-800' },
  Concluida: { label: 'Concluída', className: 'bg-green-100 text-green-800' },
  Cancelada: { label: 'Cancelada', className: 'bg-red-200 text-red-700' },
  Expirada: { label: 'Expirada', className: 'bg-neutral-200 text-neutral-700' },
}

export const STATUS_LIST = Object.keys(STATUS) as DonationStatus[]