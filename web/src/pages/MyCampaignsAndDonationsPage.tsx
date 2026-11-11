import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DonationCard } from '../components/DonationCard'
import { Field, box } from '../components/FieldBox'
import { STATUS, STATUS_LIST } from '../lib/donationsEnums'
import { useFetch } from '../lib/useFetch'
import { api, ApiError } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import type { Campaign, Donation, DonationStatus } from '../types'

const chip = (active: boolean) =>
  `cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
    active ? 'border-primary bg-primary text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:border-primary'
  }`

export default function MyCampaignsAndDonationsPage() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'received' ? 'received' : 'donated'
  const [status, setStatus] = useState<DonationStatus | ''>('')
  const [chosenCampaign, setChosenCampaign] = useState('')
  const [actionError, setActionError] = useState('')

  // donated by me
  const donated = useFetch<Donation[]>(tab === 'donated' ? '/donations/mine' : null)
  // my campaigns
  const myCampaigns = useFetch<Campaign[]>(tab === 'received' && user ? `/campaigns/user/${user.id}` : null)
  const campaignId = chosenCampaign || myCampaigns.data?.[0]?.id || ''
  const received = useFetch<Donation[]>(tab === 'received' && campaignId ? `/donations/campaign/${campaignId}` : null)

  const current = tab === 'donated' ? donated : received
  const list = (current.data ?? []).filter(d => !status || d.status === status)

  // CONFIRM and CANCEL functions
  async function confirm(id: string) {
    setActionError('')

    try {
      await api<Donation>(`/donations/${id}/confirm`, { method: 'POST' })
      current.reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Não foi possível confirmar a doação.')
    }
  }

  async function cancel(id: string) {
    setActionError('')

    try {
      await api<Donation>(`/donations/${id}/cancel`, { method: 'POST' } )
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Não foi possível cancelar a doação.')
    }
  }

  const tabClass = (active: boolean) =>
    `cursor-pointer border-b-2 px-4 py-3 font-bold transition ${
      active ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-dark'
    }`
  
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-dark">Minhas doações</h1>
        <p className="mt-1 text-neutral-600">Acompanhe o que você doou e o que suas campanhas receberam.</p>
      </header>

      {/* abas */}
      <div role="tablist" aria-label="Tipo de doação" className="flex justify-center border-b border-neutral-200">
        <button type="button" role="tab" id="tab-donated" aria-selected={tab === 'donated'} aria-controls="painel"
          onClick={() => setParams({})} className={tabClass(tab === 'donated')}>
          Realizadas
        </button>
        <button type="button" role="tab" id="tab-received" aria-selected={tab === 'received'} aria-controls="painel"
          onClick={() => setParams({ tab: 'received' })} className={tabClass(tab === 'received')}>
          Recebidas
        </button>
      </div>

      <div id="painel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-6">
        {/* só na aba "Recebidas": de qual campanha */}
        {tab === 'received' && (
          <Field label="Campanha" htmlFor="campaign">
            <select id="campaign" value={campaignId} onChange={e => setChosenCampaign(e.target.value)} className={`${box(false)} h-12`}>
              {(myCampaigns.data ?? []).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>
        )}

        {/* filtro por status */}
        <div role="group" aria-label="Filtrar por status" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!status} onClick={() => setStatus('')} className={chip(!status)}>Todas</button>
          {STATUS_LIST.map(s => (
            <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)} className={chip(status === s)}>
              {STATUS[s].label}
            </button>
          ))}
        </div>

        {/* lista */}
        {actionError && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</p>
        )}

        {current.error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p>{current.error}</p>
            <button type="button" onClick={current.reload} className="mt-3 cursor-pointer font-bold underline">Tentar novamente</button>
          </div>
        ) : current.loading ? (
          <div role="status" aria-label="Carregando doações" className="h-40 animate-pulse rounded-3xl bg-neutral-200" />
          ) : tab === 'received' && !myCampaigns.loading && !myCampaigns.data?.length ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
              Você ainda não criou nenhuma campanha.
              <p className="mt-2"><Link to="/create-campaign" className="font-bold text-primary underline">Criar campanha</Link></p>
            </div>
            ) : list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
                {tab === 'donated' ? 'Nenhuma doação encontrada.' : 'Nenhuma doação recebida nesta campanha.'}
                {tab === 'donated' && (
                  <p className="mt-2"><Link to="/campaigns" className="font-bold text-primary underline">Ver campanhas</Link></p>
                )}
              </div>
              ) : (
                <div className="space-y-4">
                  {list.map(d => (
                    <DonationCard
                      key={d.id}
                      donation={d}
                      view={tab === 'donated' ? 'donor' : 'owner'}
                      onConfirm={() => confirm(d.id)}
                      onCancel={() => cancel(d.id)}
                    />
                  ))}
                </div>
        )}
      </div>
    </div>
  )
}