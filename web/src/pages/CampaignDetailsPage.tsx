import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, HandHeart, MapPin, Package, Truck } from 'lucide-react'
import { categoryLabel, RECEIVE_LABELS } from '../lib/campaignsEnums'
import { useCampaignDetails } from '../lib/useCampaigns'

export default function CampaignDetailPage() {
  const { id = '' } = useParams()
  const { campaign, loading, error } = useCampaignDetails(id)

  if (loading)
    return <div role="status" aria-label="Carregando campanhas" className="h-96 animate-pulse rounded-3xl bg-neutral-200" />
  
  if (error || !campaign)
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        <p>{error ?? 'Campanha não encontrada'}</p>
        <Link to="/campaigns" className="mt-3 inline-block font-bold underline">
          Voltar para a página de Campanhas
        </Link>
      </div>
    )

  const c = campaign
  const percent = Math.min(100, Math.round((c.currentAmount / c.goalAmount) * 100))

  // motivo pelo qual não dá para doar (null = pode doar)
  const closedReason = !c.isActive
    ? 'Esta campanha foi encerrada.'
    : c.hasExpired
      ? 'O prazo desta campanha terminou.'
      : c.isGoalReached
        ? 'Esta campanha já atingiu a meta.'
        : null

  const facts = [
    { icon: Package, label: 'Estamos arrecadando:', value: c.product },
    { icon: Truck, label: 'Método da doação:', value: RECEIVE_LABELS[c.receiveOption] }, // RECEIVE_LABELS from campaignsEnums.ts
    { icon: CalendarDays, label: 'Prazo:', value: new Date(c.conclusionDate).toLocaleDateString('pt-BR') },
    ...(c.deliveryNeighborhood ? [{ icon: MapPin, label: 'Local de entrega:', value: c.deliveryNeighborhood }] : []),
  ]

  return (
    <div className="space-y-10">

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* imagem (ou ícone, se a campanha não tiver) */}
        <div className="overflow-hidden rounded-3xl bg-neutral-100">
          {c.imageUrl ? (
            <img src={c.imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center text-primary/40">
              <HandHeart size={96} aria-hidden />
            </div>
          )}
        </div>

        {/* informações */}
        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {categoryLabel(c.category)}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold uppercase leading-tight tracking-tight text-dark sm:text-3xl">
            {c.title}
          </h1>

          {c.ownerCampaignName && (
            <p className="mt-2 text-neutral-600">
              Campanha de <b className="text-dark">{c.ownerCampaignName}</b>
              {c.ownerCampaignCity && ` · ${c.ownerCampaignCity}/${c.ownerCampaignUf}`}
            </p>
          )}

          {/* progresso */}
          <div className="mt-8">
            <p className="text-neutral-600">
              <b className="text-3xl font-extrabold text-dark">{c.currentAmount}</b> de {c.goalAmount} · {c.product}
            </p>
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso da campanha"
              className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-sm text-neutral-500">{percent}% da meta</p>
          </div>

          {/* dados da campanha */}
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 rounded-2xl bg-neutral-100 p-4">
                <Icon size={22} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</dt>
                  <dd className="font-bold text-dark">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {/* ação */}
          <div className="flex justify-center mt-12">
            {closedReason && (
              <p role="status" className="mb-3 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
                {closedReason}
              </p>
            )}
            <button
              type="button"
              disabled={!!closedReason}
              className="h-14 w-85 cursor-pointer rounded-full bg-primary text-lg font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
            >
              Doar para esta campanha
            </button>
          </div>
        </div>
      </div>

      {/* descrição */}
      <section aria-labelledby="sobre" className="">
        <h2 id="sobre" className="text-2xl font-extrabold uppercase tracking-tight text-dark">Sobre a campanha</h2>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-neutral-700">{c.description}</p>
      </section>
    </div>
  )
}