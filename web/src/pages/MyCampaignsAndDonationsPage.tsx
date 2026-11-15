import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DonationCard } from '../components/DonationCard'
import { Field, box } from '../components/FieldBox'
import { STATUS, STATUS_LIST } from '../lib/donationsEnums'
import { useFetch } from '../lib/useFetch'
import { api, ApiError } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import type { Campaign, Donation, DonationStatus, Schedule } from '../types'

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
  const [busyId, setBusyId] = useState('')

  // donated by me
  const donated = useFetch<Donation[]>(tab === 'donated' ? '/donations/mine' : null)
  // my campaigns
  const myCampaigns = useFetch<Campaign[]>(tab === 'received' && user ? `/campaigns/user/${user.id}` : null)
  const campaignId = chosenCampaign || myCampaigns.data?.[0]?.id || ''
  const received = useFetch<Donation[]>(tab === 'received' && campaignId ? `/donations/campaign/${campaignId}` : null)

  // schedules (donor and owner)
  const schedules = useFetch<Schedule[]>('/schedules/mine')
  const scheduleByDonation = new Map((schedules.data ?? []).map(s => [s.donationId, s]))

  const current = tab === 'donated' ? donated : received
  const list = (current.data ?? []).filter(d => !status || d.status === status)

  const steps = tab === 'received' ? [myCampaigns, received] : [donated]
  const loading = steps.some(s => s.loading)
  const failed = steps.find(s => s.error)

  async function act(
    donationId: string,
    path: string,
    failMessage: string,
    opts: { body?: unknown; donations?: boolean } = {},
  ): Promise<boolean> {
    if (busyId)
      return false
    setBusyId(donationId)
    setActionError('')

    try {
      await api<unknown>(path, { method: 'POST', body: opts.body })
      if (opts.donations)
        current.reload()
      schedules.reload()
      return true
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : failMessage)
      return false
    } finally {
      setBusyId('')
    }
  }

  function changeTab(next: Record<string, string>) {
    setActionError('')
    setParams(next)
  }

  const tabClass = (active: boolean) =>
    `cursor-pointer border-b-2 px-4 py-3 font-bold transition ${
      active ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-dark'
    }`

  function renderList() {
    if (failed)
      return (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
          <p>{failed.error}</p>
          <button type="button" onClick={failed.reload} className="mt-3 cursor-pointer font-bold underline">Tentar novamente</button>
        </div>
      )

    if (loading)
      return <div role="status" aria-label="Carregando doações" className="h-40 animate-pulse rounded-3xl bg-neutral-200" />

    if (tab === 'received' && !myCampaigns.data?.length)
      return (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
          Você ainda não criou nenhuma campanha.
          <p className="mt-2"><Link to="/create-campaign" className="font-bold text-primary underline">Criar campanha</Link></p>
        </div>
      )

    if (list.length === 0)
      return (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
          {tab === 'donated' ? 'Nenhuma doação encontrada.' : 'Nenhuma doação recebida nesta campanha.'}
          {tab === 'donated' && (
            <p className="mt-2"><Link to="/campaigns" className="font-bold text-primary underline">Ver campanhas</Link></p>
          )}
        </div>
      )

    return (
      <div className="space-y-4">
        {list.map(d => {
          const s = scheduleByDonation.get(d.id)

          return (
            <DonationCard
              key={d.id}
              donation={d}
              schedule={s}
              view={tab === 'donated' ? 'donor' : 'owner'}
              busy={busyId === d.id}
              onConfirm={() => act(d.id, `/donations/${d.id}/confirm`, 'Não foi possível confirmar a doação.', { donations: true })}
              onCancel={() => act(d.id, `/donations/${d.id}/cancel`, 'Não foi possível cancelar a doação.', { donations: true })}
              scheduleActions={s && {
                requestReschedule: reason => act(d.id, `/schedules/${s.id}/refuse`, 'Não foi possível solicitar o reagendamento.', { body: { reason } }),
                reschedule: isoDate => act(d.id, '/schedules', 'Não foi possível reagendar.', { body: { donationId: d.id, scheduleDate: isoDate } }),
              }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-dark">Minhas doações</h1>
        <p className="mt-1 text-neutral-600">Acompanhe o que você doou e o que suas campanhas receberam.</p>
      </header>

      {/* abas */}
      <div role="tablist" aria-label="Tipo de doação" className="flex justify-center gap-10 border-2 border-neutral-300 rounded-2xl w-min mx-auto overflow-hidden">
        <button type="button" role="tab" id="tab-donated" aria-selected={tab === 'donated'} aria-controls="painel"
          onClick={() => changeTab({})} className={tabClass(tab === 'donated')}>
          Realizadas
        </button>
        <button type="button" role="tab" id="tab-received" aria-selected={tab === 'received'} aria-controls="painel"
          onClick={() => changeTab({ tab: 'received' })} className={tabClass(tab === 'received')}>
          Recebidas
        </button>
      </div>

      <div id="painel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-6">
        {/* só na aba "Recebidas": de qual campanha */}
        {tab === 'received' && (
          <Field label="Campanha" htmlFor="campaign">
            <select id="campaign" value={campaignId} onChange={e => { setChosenCampaign(e.target.value); setActionError('') }} className={`${box(false)} h-12`}>
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

        {/* schedules don't appearing */}
        {schedules.error && (
          <p role="alert" className='rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700'>
            {schedules.error}{' '}
            <button type="button" onClick={schedules.reload} className='cursor-pointer font-bold underline'>
              Tentar novamente
            </button>
          </p>
        )}

        {renderList()}
      </div>
    </div>
  )
}