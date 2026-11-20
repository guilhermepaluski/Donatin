import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CalendarCheck, CalendarClock, CalendarX, CheckCircle2, Gift, Hourglass, XCircle, type LucideIcon } from 'lucide-react'
import { api } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { useDismiss } from '../lib/useDismiss'
import type { AppNotification, NotificationType } from '../types'

const POLL_MS = 30_000

const ICONS: Record<NotificationType, LucideIcon> = {
  DoacaoRecebida: Gift,
  ReagendamentoSolicitado: CalendarX,
  Reagendado: CalendarCheck,
  DoacaoConcluida: CheckCircle2,
  DoacaoCancelada: XCircle,
  DoacaoExpirada: Hourglass,
  Lembrete: CalendarClock
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const count = useFetch<number>('/notifications/unread-count')
  const list = useFetch<AppNotification[]>(open ? '/notifications/mine' : null)
  const unread = count.data ?? 0
  const reloadCount = count.reload

  useEffect(() => {
    const id = setInterval(reloadCount, POLL_MS)
    return () => clearInterval(id)
  }, [reloadCount])

  useDismiss(boxRef, open, setOpen)

  async function openNotification(n: AppNotification) {
    if (!n.read) await api(`/notifications/${n.id}/read`, { method: 'POST' }).catch(() => {})
    setOpen(false)
    count.reload()
    navigate('/my-donations')
  }

  async function readAllNotifications() {
    await api('/notifications/read-all', { method: 'POST' }).catch(() => {})
    list.reload()
    count.reload()
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={unread ? `Notificações (${unread} não lidas)` : 'Notificações'}
        aria-expanded={open}
        className="relative cursor-pointer rounded-full p-2 text-neutral-700 hover:bg-neutral-100"
      >
        <Bell size={22} aria-hidden />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notificações"
          className="fixed inset-x-4 top-18 z-20 flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96"
        >
          <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
            <h2 className="font-bold text-dark">Notificações</h2>
            {unread > 0 && (
              <button type="button" onClick={readAllNotifications} className="cursor-pointer text-sm font-medium text-primary hover:underline">
                Marcar todas como lidas
              </button>
            )}
          </header>

          <div className="overflow-y-auto">
            {list.loading && !list.data && <p className="px-5 py-8 text-center text-sm text-neutral-500">Carregando...</p>}
            {list.error && <p className="px-5 py-8 text-center text-sm text-red-700">{list.error}</p>}
            {list.data?.length === 0 && <p className="px-5 py-8 text-center text-sm text-neutral-500">Você não tem notificações.</p>}

            <ul className="divide-y divide-neutral-100">
              {list.data?.map(n => {
                const Icon = ICONS[n.type] ?? Bell
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => openNotification(n)}
                      className={`flex w-full cursor-pointer gap-3 px-5 py-3 text-left hover:bg-neutral-50 ${n.read ? '' : 'bg-primary/5'}`}
                    >
                      <Icon size={20} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm ${n.read ? 'text-neutral-600' : 'font-semibold text-dark'}`}>{n.content}</span>
                        <span className="mt-1 block text-xs text-neutral-400">{formatDate(n.createdAt)}</span>
                      </span>
                      {!n.read && <span aria-label="Não lida" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}