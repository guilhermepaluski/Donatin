import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, HandHeart, Hash, MapPin, Package, Truck } from 'lucide-react'
import { Button } from '../components/PillButton'
import { TextField } from '../components/TextField'
import { Field, box } from '../components/FieldBox'
import { categoryLabel, RECEIVE_LABELS } from '../lib/campaignsEnums'
import { digits, maskCep } from '../lib/masks'
import type { Campaign, Donation, DonationRequest } from '../types'
import { api, ApiError } from '../lib/api'
import { useCampaignDetails } from '../lib/useCampaigns'
import { useAuth } from '../auth/AuthContext'
import { donationBlockedReason } from '../lib/donationRules'

// rules definition
const schema = z.object({
  quantity: z.number({ error: 'Informe a quantidade.' }).positive('A quantidade deve ser maior que zero.'),
  donationMethod: z.enum(['Entrega', 'Coleta'], { error: 'Escolha como você vai doar.' }),
  isAnonymous: z.boolean(),
  notes: z.string().max(400, 'Use no máximo 400 caracteres.'),
  donorCep: z.string(),
  donorStreet: z.string(),
  donorNeighborhood: z.string(),
  donorNumber: z.string(),
  donorComplement: z.string()
}).superRefine((v, ctx) => {
  // regras que só valem na coleta (a instituição busca na casa do doador)
  if (v.donationMethod !== 'Coleta')
    return

  const issue = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message })
  if (v.isAnonymous)
    issue('isAnonymous', 'Em doações com coleta é necessário se identificar.')
  if (digits(v.donorCep).length !== 8)
    issue('donorCep', 'O CEP deve ter 8 dígitos.')
  if (!v.donorStreet.trim())
    issue('donorStreet', 'Informe a rua.')
  if (!v.donorNeighborhood.trim())
    issue('donorNeighborhood', 'Informe o bairro.')
  if (!v.donorNumber.trim())
    issue('donorNumber', 'Informe o número.')
})
type DonationForms = z.infer<typeof schema>

const FIELDS = ['quantity', 'notes', 'donationMethod',
  'donorCep', 'donorStreet', 'donorNeighborhood', 'donorNumber', 'donorComplement', 'isAnonymous']

const card = 'space-y-4 rounded-3xl border border-neutral-200 bg-white p-6'

const METHODS = [
  { value: 'Entrega', hint: 'Você leva o item até a instituição.' },
  { value: 'Coleta', hint: 'A instituição busca o item no seu endereço.' },
] as const

const ISANONYMOUS = [
  { value: false, label: 'Sim, quero me identificar', hint: 'O dono da campanha vê seu nome e telefone.' },
  { value: true, label: 'Não, doar anonimamente', hint: 'Sua doação aparece como anônima.' },
] as const

const choice = (selected: boolean, disabled = false) =>
  `rounded-2xl border p-4 text-left transition ${
    disabled
      ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-50'
      : selected
        ? 'cursor-pointer border-primary bg-primary/10'
        : 'cursor-pointer border-neutral-300 hover:border-primary'
  }`

function DonationForms({ campaign }: { campaign: Campaign }) {
  const getMethod = campaign.receiveOption === 'ColetaOuEntrega' ? undefined : campaign.receiveOption
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const { register, handleSubmit, control, setValue, setError, formState: { errors, isSubmitting, isSubmitted } } =
    useForm<DonationForms>({
      resolver: zodResolver(schema),
      defaultValues: {
        donationMethod: getMethod, isAnonymous: false, notes: '',
        donorCep: '', donorStreet: '', donorNeighborhood: '', donorNumber: '', donorComplement: '',
      },
    })
  const donationMethod = useWatch({ control, name: 'donationMethod' })
  const isAnonymous = useWatch({ control, name: 'isAnonymous' })
  const isColeta = donationMethod === 'Coleta'

  function chooseMethod(m: 'Entrega' | 'Coleta') {
    setValue('donationMethod', m, { shouldValidate: isSubmitted })
    if (m === 'Coleta')
      setValue('isAnonymous', false) // coleta exige identificação
  }

  const onSubmit = handleSubmit(async v => {
    setFormError('')

    const body: DonationRequest = {
      campaignId: campaign.id,
      quantity: v.quantity,
      notes: v.notes.trim(),
      donationMethod: v.donationMethod,
      isAnonymous: v.isAnonymous,
      ...(isColeta && {
        donorCep: digits(v.donorCep),
        donorStreet: v.donorStreet.trim(),
        donorNeighborhood: v.donorNeighborhood.trim(),
        donorNumber: v.donorNumber.trim(),
        donorComplement: v.donorComplement.trim() || undefined,
      }),
    }

    try {
      const donated = await api<Donation>('/donations', { method: 'POST', body })
      navigate(`/my-donations/${donated.id}`)
    } catch (e) {
      if (!(e instanceof ApiError))
        throw e

      let matched = 0
      for (const [key, message] of Object.entries(e.fields)) {
        if (FIELDS.includes(key)) {
          setError(key as keyof DonationForms, { message })
          matched++
        }
      }
      setFormError(matched ? '' : e.message)
    }
  })

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      {/* quantidade */}
      <section className={card}>
        <h2 className="text-lg font-bold text-dark">Sua doação</h2>
        <TextField
          label={`Quantidade de ${campaign.product}`}
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          placeholder="Ex.: 5"
          icon={<Package size={20} />}
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />
        <Field label="Observação (opcional)" htmlFor="notes" error={errors.notes?.message}>
          <textarea
            id="notes"
            rows={3}
            placeholder="Ex.: tamanhos, estado dos itens, melhor horário..."
            aria-invalid={!!errors.notes}
            className={`${box(!!errors.notes)} py-3`}
            {...register('notes')}
          />
        </Field>
      </section>

      {/* como doar */}
      <section className={card}>
        <h2 className="text-lg font-bold text-dark">Como você vai doar?</h2>

        {campaign.receiveOption === 'ColetaOuEntrega' ? (
          <div role="radiogroup" aria-label="Como doar" className="grid gap-3 sm:grid-cols-2">
            {METHODS.map(m => (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={donationMethod === m.value}
                onClick={() => chooseMethod(m.value)}
                className={choice(donationMethod === m.value)}
              >
                <span className="block font-bold text-dark">{RECEIVE_LABELS[m.value]}</span>
                <span className="mt-1 block text-sm text-neutral-600">{m.hint}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
            Esta campanha recebe por <b>{RECEIVE_LABELS[campaign.receiveOption]}</b>.
          </p>
        )}
        {errors.donationMethod && <p role="alert" className="text-sm text-red-600">{errors.donationMethod.message}</p>}

        {donationMethod === 'Entrega' && (
          <p className="flex items-start gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm text-neutral-700">
            <MapPin size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
            <span>
              {campaign.deliveryNeighborhood && <>Local de entrega: bairro <b>{campaign.deliveryNeighborhood}</b>. </>}
              O endereço completo aparece depois que você registrar a doação.
            </span>
          </p>
        )}
      </section>

      {/* endereço de retirada (só na coleta) */}
      {isColeta && (
        <section className={card}>
          <h2 className="text-lg font-bold text-dark">Endereço de retirada</h2>
          <p className="-mt-2 text-sm text-neutral-600">Onde a instituição vai buscar a doação.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="CEP"
              inputMode="numeric"
              placeholder="00000-000"
              icon={<MapPin size={20} />}
              error={errors.donorCep?.message}
              {...register('donorCep', {
                onChange: e => setValue('donorCep', maskCep(e.target.value), { shouldValidate: isSubmitted }),
              })}
            />
            <TextField label="Número" placeholder="Nº" icon={<Hash size={20} />} error={errors.donorNumber?.message} {...register('donorNumber')} />
            <div className="sm:col-span-2">
              <TextField label="Rua" placeholder="Nome da rua" icon={<MapPin size={20} />} error={errors.donorStreet?.message} {...register('donorStreet')} />
            </div>
            <TextField label="Bairro" placeholder="Bairro" icon={<MapPin size={20} />} error={errors.donorNeighborhood?.message} {...register('donorNeighborhood')} />
            <TextField label="Complemento (opcional)" placeholder="Apto, bloco..." icon={<MapPin size={20} />} error={errors.donorComplement?.message} {...register('donorComplement')} />
          </div>
        </section>
      )}

      {/* identificação */}
      <section className={card}>
        <h2 className="text-lg font-bold text-dark">Deseja se identificar?</h2>
        <div role="radiogroup" aria-label="Deseja se identificar?" className="grid gap-3 sm:grid-cols-2">
          {ISANONYMOUS.map(o => {
            const blocked = isColeta && o.value // na coleta não existe doação anônima
            return (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={isAnonymous === o.value}
                disabled={blocked}
                onClick={() => setValue('isAnonymous', o.value, { shouldValidate: isSubmitted })}
                className={choice(isAnonymous === o.value, blocked)}
              >
                <span className="block font-bold text-dark">{o.label}</span>
                <span className="mt-1 block text-sm text-neutral-600">{o.hint}</span>
              </button>
            )
          })}
        </div>
        {isColeta && (
          <p className="text-sm text-neutral-600">Em doações com coleta é necessário se identificar.</p>
        )}
        {errors.isAnonymous && <p role="alert" className="text-sm text-red-600">{errors.isAnonymous.message}</p>}
      </section>

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link to={`/campaigns/${campaign.id}`} className="grid h-14 place-items-center rounded-full border border-neutral-300 px-8 font-bold text-dark hover:bg-neutral-100">
          Cancelar
        </Link>
        <Button type="submit" loading={isSubmitting} className="cursor-pointer sm:w-auto sm:px-10">Confirmar doação</Button>
      </div>
    </form>
  )
}

export default function DonatePage() {
  const { id = '' } = useParams()
  const { campaign, loading, error, reload } = useCampaignDetails(id)
  const { user } = useAuth()
  
  if (loading)
    return <p>Carregando campanha...</p>
  if (error || !campaign)
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        <p>{error ?? 'Campanha não encontrada.'}</p>
        <p>
          <button onClick={reload} className='mt-9 cursor-pointer bg-red-500 rounded-2xl w-45 font-bold text-white'>
            Tente novamente
          </button>
        </p>
      </div>
    )
  
  const blockedReason = donationBlockedReason(campaign, user?.id)
  if (blockedReason)
    return (
      <div role="status" className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-700">
        <p>{blockedReason}</p>
        <Link to={`/campaigns/${campaign.id}`} className="mt-3 inline-block font-bold text-primary underline">
          Voltar para a campanha
        </Link>
      </div>
    )
  
  const c = campaign
  const percent = Math.min(100, Math.round((c.currentAmount / c.goalAmount) * 100))

  return (
    <div className="mx-auto space-y-6">
      <Link to={`/campaigns/${c.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary">
        <ArrowLeft size={18} aria-hidden /> Voltar para a campanha
      </Link>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-dark">Doar</h1>
        <p className="mt-1 text-neutral-600">Preencha os dados da sua doação.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_30rem] lg:items-start">
        <DonationForms campaign={c} />

        {/* resumo da campanha (no celular aparece antes do formulário) */}
        <aside aria-label="Resumo da campanha" className="order-first space-y-4 rounded-3xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-24 lg:order-last">
          <div className="aspect-4/3 overflow-hidden rounded-2xl bg-neutral-100">
            {c.imageUrl ? (
              <img src={c.imageUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center text-primary/40">
                <HandHeart size={56} aria-hidden />
              </div>
            )}
          </div>
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {categoryLabel(c.category)}
          </span>
          <h2 className="text-lg font-bold leading-snug text-dark">{c.title}</h2>
          {c.ownerCampaignName && (
            <p className="text-sm text-neutral-600">
              {c.ownerCampaignName}{c.ownerCampaignCity && ` · ${c.ownerCampaignCity}/${c.ownerCampaignUf}`}
            </p>
          )}
          <div>
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso da campanha"
              className="h-1.5 overflow-hidden rounded-full bg-neutral-200"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              <b className="text-dark">{c.currentAmount}</b> de {c.goalAmount} {c.product} · {percent}%
            </p>
          </div>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex items-center gap-2"><Truck size={16} aria-hidden className="text-primary" /> {RECEIVE_LABELS[c.receiveOption]}</li>
            <li className="flex items-center gap-2"><CalendarDays size={16} aria-hidden className="text-primary" /> Até {new Date(c.conclusionDate).toLocaleDateString('pt-BR')}</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}