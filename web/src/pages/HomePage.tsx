import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, Gift, HandHeart, Search } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { CampaignCard } from '../components/CampaignCard'
import { CATEGORIES } from '../lib/campaigns'
import { MOCK_CAMPAIGNS } from '../lib/mockCampaigns'

const STEPS = [
  { icon: Search, title: 'Escolha uma campanha', text: 'Veja o que cada instituição precisa e quanto falta para a meta.' },
  { icon: Gift, title: 'Doe o que você tem', text: 'Escolha entregar ou combinar a coleta, do jeito mais prático para você.' },
  { icon: CalendarCheck, title: 'Acompanhe o impacto', text: 'Veja o progresso da campanha e suas doações em um só lugar.' },
]

const sectionTitle = 'text-2xl font-extrabold tracking-tight text-dark sm:text-3xl'

export default function HomePage() {
  const { user } = useAuth()
  const firstName = user?.name.split(' ')[0]

  return (
    <div className="space-y-16">
      {/* hero */}
      <section className="relative overflow-hidden rounded-3xl bg-dark px-6 py-16 text-white sm:px-12 sm:py-24">
        <HandHeart aria-hidden className="absolute -right-10 -top-10 size-96 text-white/5" />
        <div className="relative max-w-5xl">
          <p className="text-sm font-bold tracking-widest text-white/80">
            {firstName ? `Olá, ${firstName}! 👋` : 'Bem-vindo ao Donatin! 👋'}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Pequenos gestos.<br />Grandes transformações.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Conectamos quem quer doar a quem precisa.
          </p>
          <p className="max-w-xl text-lg text-white/70">
            Escolha uma campanha e doe com o que puder!
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/campaigns" className="rounded-full bg-white px-7 py-3 font-bold text-dark transition hover:bg-primary hover:text-white">
              Ver campanhas
            </Link>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section aria-labelledby="como">
        <h2 id="como" className="sr-only">Como funciona</h2>
        <ol className="grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon size={24} aria-hidden />
              </span>
              <div>
                <h3 className="font-bold text-dark">{i + 1}. {title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* categories */}
      <section aria-labelledby="categorias">
        <h2 id="categorias" className={`mb-6 ${sectionTitle}`}>Categorias</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ value, label, icon: Icon }) => (
            <li key={value}>
              <Link
                to={`/campaigns?category=${value}`}
                className="group flex aspect-square flex-col justify-between rounded-2xl bg-primary/10 p-5 text-dark transition hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Icon size={36} aria-hidden />
                <span className="flex items-center justify-between font-bold">
                  {label}
                  <ArrowRight size={18} aria-hidden className="opacity-0 transition group-hover:opacity-100" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* campaigns */}
      <section aria-labelledby="recentes">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="recentes" className={sectionTitle}>Campanhas em destaque</h2>
          <Link to="/campaigns" className="shrink-0 font-bold text-dark underline underline-offset-4 hover:text-primary">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_CAMPAIGNS.slice(0, 3).map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      </section>
    </div>
  )
}