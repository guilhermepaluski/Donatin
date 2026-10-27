import { useSearchParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { CampaignCard } from '../components/CampaignCard'
import { CATEGORIES } from '../lib/campaigns'
import { MOCK_CAMPAIGNS } from '../lib/mockCampaigns'

export default function CampaignsPage() {
  // os filtros ficam na URL: /campaigns?category=Roupas&keyword=casaco
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const keyword = params.get('keyword') ?? ''

  function setParam(key: 'category' | 'keyword', value: string) {
    const urlSearch = new URLSearchParams(params)
    if (value)
      urlSearch.set(key, value)
    else
      urlSearch.delete(key)

    setParams(urlSearch, { replace: true })
  }

  // PROVISÓRIO: filtra os dados de exemplo aqui. Com a API, o filtro passa a ser feito no servidor.
  const campaigns = MOCK_CAMPAIGNS.filter(
    c => (!category || c.category === category) && c.title.toLowerCase().includes(keyword.toLowerCase()),
  )

  const categorySelected = (active: boolean) =>
    `cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
      active ? 'border-primary bg-primary text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:border-primary'
    }`

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-dark">Campanhas</h1>
        <p className="mt-1 text-neutral-600">Encontre uma causa e ajude com o que você tem em casa.</p>
      </header>

      {/* searching */}
      <div className="relative">
        <label htmlFor="busca" className="sr-only">Buscar campanhas</label>
        <Search size={20} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          id="busca"
          type="search"
          value={keyword}
          onChange={e => setParam('keyword', e.target.value)}
          placeholder="Buscar por título..."
          className="h-12 w-full rounded-full border border-neutral-300 bg-white pl-12 pr-4 outline-none focus:border-primary focus-visible:outline-2 focus-visible:outline-primary"
        />
      </div>

      {/* categories */}
      <div role="group" className="flex flex-wrap gap-3">
        <button type="button" aria-pressed={!category} onClick={() => setParam('category', '')} className={categorySelected(!category)}>
          Todas
        </button>
        {CATEGORIES.map(c => (
          <button key={c.value} type="button" aria-pressed={category === c.value} onClick={() => setParam('category', c.value)} className={categorySelected(category === c.value)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className='flex justify-between w-full'>
      {/* result */}
        <p aria-live="polite" className="text-sm text-neutral-600">
          {campaigns.length} {campaigns.length === 1 ? 'campanha encontrada' : 'campanhas encontradas'}
        </p>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
          Nenhuma campanha encontrada. Tente outra palavra ou categoria.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      )}
    </div>
  )
}