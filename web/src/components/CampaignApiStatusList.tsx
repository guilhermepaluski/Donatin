import { CampaignCard } from './CampaignCard'
import type { Campaign } from '../types'

interface Props {
  campaigns: Campaign[]
  loading: boolean
  error: string | null
  onRetry: () => void
  emptyMessage: string
}

const grid = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'

// mostra a lista ou o estado: erro, carregando ou vazio
export function CampaignApiStatusList({ campaigns, loading, error, onRetry, emptyMessage }: Props) {

  if (error) // if it throws an error
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        <p>{error}</p>
        <button type="button" onClick={onRetry} className="mt-3 cursor-pointer font-bold underline">
          Tentar novamente
        </button>
      </div>
    )

  if (loading && campaigns.length === 0) // while its loading
    return (
      <div role="status" aria-label="Carregando campanhas" className={grid}>
        {[0, 1, 2].map(i => <div key={i} className="h-80 animate-pulse rounded-2xl bg-neutral-200" />)}
      </div>
    )

  if (campaigns.length === 0) // when it doesn't have any campaigns
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
        {emptyMessage}
      </div>
    )

  // gets the campaigns, while any condition above is false
  return (
    <div className={`${grid} transition-opacity ${loading ? 'opacity-60' : ''}`}>
      {campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
    </div>
  )
}