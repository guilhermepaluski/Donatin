import { Link } from 'react-router-dom'
import { CalendarDays, CheckCircle2, MapPin, Package, Phone, StickyNote, Truck, XCircle } from 'lucide-react'
import { RECEIVE_LABELS } from '../lib/campaignsEnums'
import { STATUS } from '../lib/donationsEnums'
import { digits } from '../lib/masks'
import type { Donation } from '../types'

interface Props {
  donation: Donation
  view: 'donor' | 'owner'
  onConfirm?: () => void
  onCancel?: () => void
}

// endereço de retirada do doador (só existe na coleta)
const donorPickupAddress = (d: Donation) =>
  [[d.donorStreet, d.donorNumber].filter(Boolean).join(', '), d.donorNeighborhood, [d.donorCep, d.donorComplement].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(' - ')

function CallPhone_({ phone, label }: { phone: string; label: string }) {
  return (
    <p className="flex items-center gap-2">
      <Phone size={16} aria-hidden className="shrink-0 text-primary" />
      <span>{label}: <a href={`tel:${digits(phone)}`} className="font-bold text-dark hover:underline">{phone}</a></span>
    </p>
  )
}

export function DonationCard({ donation: d, view, onConfirm, onCancel }: Props) {
  const status = STATUS[d.status]
  const pending = d.status === 'Pendente'
  const address = d.donationMethod === 'Coleta' ? donorPickupAddress(d) : ''

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {view === 'donor' ? (
            <>
              <h3 className="truncate text-lg font-bold text-dark">
                <Link to={`/campaigns/${d.campaignId}`} className="hover:underline">{d.campaignTitle}</Link>
              </h3>
              {d.campaignOwnerName && <p className="text-sm text-neutral-500">{d.campaignOwnerName}</p>}
            </>
          ) : (
            <h3 className="truncate text-lg font-bold text-dark">{d.isAnonymous ? 'Doador anônimo' : d.donorName}</h3>
          )}
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
      </header>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
        <li className="flex items-center gap-2">
          <Package size={16} aria-hidden className="text-primary" /> Quantidade: <b className="text-dark">{d.quantity}</b>
        </li>
        <li className="flex items-center gap-2">
          <Truck size={16} aria-hidden className="text-primary" /> {RECEIVE_LABELS[d.donationMethod]}
        </li>
        <li className="flex items-center gap-2">
          <CalendarDays size={16} aria-hidden className="text-primary" />
          {new Date(d.donatedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
        </li>
      </ul>

      {/* informações úteis para cada lado */}
      <div className="mt-4 space-y-2 text-sm text-neutral-700">
        {view === 'donor' && pending && d.donationMethod === 'Entrega' && d.campaignDeliveryAddress && (
          <p className="flex items-start gap-2">
            <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
            <span>Levar para: <b className="text-dark">{d.campaignDeliveryAddress}</b></span>
          </p>
        )}
        {view === 'donor' && d.campaignOwnerPhone && <CallPhone_ phone={d.campaignOwnerPhone} label="Contato" />}
        {view === 'owner' && !d.isAnonymous && d.donorPhone && <CallPhone_ phone={d.donorPhone} label="Telefone do doador" />}
        {view === 'owner' && address && (
          <p className="flex items-start gap-2">
            <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
            <span>Retirar em: <b className="text-dark">{address}</b></span>
          </p>
        )}
        {d.notes && (
          <p className="flex items-start gap-2">
            <StickyNote size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
            <span>{d.notes}</span>
          </p>
        )}
      </div>

      {/* ações: só enquanto a doação está pendente */}
      {pending && (
        <footer className="mt-5 flex flex-wrap justify-end gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex gap-2 cursor-pointer rounded-full border border-neutral-300 px-5 py-2 text-sm font-bold bg-red-700 text-white hover:brightness-95"
          >
            <XCircle size={20} /> Cancelar doação
          </button>
          {view === 'owner' && (
            <button
              type="button"
              onClick={onConfirm}
              className="flex gap-2 cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-bold text-white hover:brightness-95"
            >
              <CheckCircle2 size={20} /> Confirmar recebimento
            </button>
          )}
        </footer>
      )}
    </article>
  )
}