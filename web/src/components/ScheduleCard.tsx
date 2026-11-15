import { useState } from 'react'
import { CalendarClock, CalendarDays } from 'lucide-react'
import { Field2, box } from './FieldBox'
import type { Schedule } from '../types'
import { SCHEDULE_REFUSED_STATUS } from '../lib/donationsEnums'

export interface ScheduleActionHandlers {
  requestReschedule: (reason?: string) => Promise<boolean> // owner asks for a new date (POST /schedules/{id}/refuse)
  
  reschedule: (isoDate: string) => Promise<boolean> // donor register a new schedule date
}

interface Props {
  schedule: Schedule
  view: 'donor' | 'owner'
  donationPending: boolean
  busy?: boolean
  actions: ScheduleActionHandlers
}

const nowForInput = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

const btn = 'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60'

export function ScheduleCard({ schedule, view, donationPending, busy, actions }: Props) {
  const [mode, setMode] = useState<'refuse' | 'reschedule' | null>(null)
  const [reason, setReason] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  const canRequestReschedule = donationPending && view === 'owner' && schedule.status === 'Confirmado'
  const canReschedule = donationPending && view === 'donor'

  function closeForm() {
    setMode(null)
    setReason('')
    setDate('')
    setError('')
  }

  async function submitRefuse() {
    if (await actions.requestReschedule(reason.trim() || undefined))
      closeForm()
  }

  async function submitReschedule() {
    if (!date) {
      setError('Escolha a data e o horário.')
      return
    }

    const when = new Date(date)
    if (when.getTime() <= Date.now()) {
      setError('Escolha uma data e horário futuros.')
      return
    }

    setError('')
    if (await actions.reschedule(when.toISOString()))
      closeForm()
  }

  const id = `schedule-${schedule.id}`
  const refused = donationPending && schedule.status === 'Recusado'

  return (
    <div className="mt-4 space-y-3 rounded-2xl bg-dark p-4 w-74">
      <p className="flex flex-wrap items-center gap-2 text-sm text-white">
        <CalendarDays size={16} aria-hidden className="text-primary" />
        Agendado para <b className="text-white">{formatDateTime(schedule.scheduleDate)}</b>
        {/* o status só aparece quando o dono pediu outra data */}
        {refused && (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${SCHEDULE_REFUSED_STATUS.className}`}>
            {SCHEDULE_REFUSED_STATUS.label}
          </span>
        )}
      </p>
      {refused && schedule.cancellationReason && (
        <p className="text-sm text-white">Motivo: <b>{schedule.cancellationReason}</b></p>
      )}

      {/* Schedule Buttons */}
      {mode === null && (canRequestReschedule || canReschedule) && (
        <div className="flex flex-wrap gap-3">
          {/* Owner View */}
          {canRequestReschedule && (
            <button type="button" disabled={busy} onClick={() => setMode('refuse')} className={`${btn} bg-primary text-white`}>
              <CalendarClock size={18} aria-hidden /> Solicitar reagendamento
            </button>
          )}
          {/* Donor View */}
          {canReschedule && (
            <button type="button" disabled={busy} onClick={() => setMode('reschedule')} className={`${btn} bg-primary text-white`}>
              <CalendarClock size={18} aria-hidden /> Reagendar
            </button>
          )}
        </div>
      )}

      {/* Owner View */}
      {mode === 'refuse' && (
        <div className="space-y-3">
          <Field2 label="Justificativa:" htmlFor={`${id}-reason`}>
            <textarea
              id={`${id}-reason`}
              rows={2}
              maxLength={400}
              value={reason}
              onChange={e => setReason(e.target.value)}
              aria-invalid={!!error}
              className={`${box(!!error)} py-2`}
            />
          </Field2>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={submitRefuse} className={`${btn} bg-primary text-white`}>
              Enviar solicitação
            </button>
            <button type="button" disabled={busy} onClick={closeForm} className={`${btn} border border-neutral-300 bg-white text-neutral-700`}>
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Donor View */}
      {mode === 'reschedule' && (
        <div className="space-y-3">
          <Field2 label="Nova data e horário:" htmlFor={`${id}-date`} error={error}>
            <input
              id={`${id}-date`}
              type="datetime-local"
              min={nowForInput()}
              value={date}
              onChange={e => setDate(e.target.value)}
              aria-invalid={!!error}
              className={`${box(!!error)} h-12`}
            />
          </Field2>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={submitReschedule} className={`${btn} border-primary bg-primary text-white`}>
              Confirmar reagendamento
            </button>
            <button type="button" disabled={busy} onClick={closeForm} className={`${btn} border border-neutral-300 bg-white text-neutral-700`}>
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
