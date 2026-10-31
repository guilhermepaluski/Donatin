import { Link } from 'react-router-dom'
import { HandHeart, MapPin } from 'lucide-react'
import { categoryLabel } from '../lib/campaigns'
import type { Campaign } from '../types'

export function CampaignCard({ campaign: c }: { campaign: Campaign }) {
  const percent = Math.min(100, Math.round((c.currentAmount / c.goalAmount) * 100))

  return (
    <Link
      to={`/campaigns/${c.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
    >
      {/* imagem (ou ícone, se a campanha não tiver) */}
      {c.imageUrl ? (
        <img src={c.imageUrl} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="grid h-40 place-items-center bg-primary/10 text-primary">
          <HandHeart size={48} aria-hidden />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {categoryLabel(c.category)}
        </span>
        <h3 className="line-clamp-2 text-lg font-bold text-dark">{c.title}</h3>

        {c.ownerCampaignName && (
          <p className="flex items-center gap-1 text-sm text-neutral-600">
            <MapPin size={14} aria-hidden />
            <span className="truncate">
              {c.ownerCampaignName}
              {c.ownerCampaignCity && ` · ${c.ownerCampaignCity}/${c.ownerCampaignUf}`}
            </span>
          </p>
        )}

        {/* progresso */}
        <div className="mt-auto">
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso da campanha"
            className="h-2 overflow-hidden rounded-full bg-neutral-200"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            <b className="text-dark">{c.currentAmount}</b> de {c.goalAmount} {c.product} ({percent}%)
          </p>
          <p className="text-xs text-neutral-500">
            Até {new Date(c.conclusionDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </Link>
  )
}