import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Hash, ImageIcon, MapPin, Package, Target, Type } from 'lucide-react'
import { Button } from '../components/PillButton'
import { TextField } from '../components/TextField'
import { CATEGORIES, RECEIVE_LABELS } from '../lib/campaignsEnums'
import { api, ApiError } from '../lib/api'
import { digits, maskCep } from '../lib/masks'
import type { Campaign, CampaignRequest, ReceiveOption } from '../types'
import { Field, box } from '../components/FieldBox'

const required = (msg: string) => z.string().trim().min(1, msg)
const today = () => new Date().toLocaleDateString('sv-SE')

// rules definition
const schema = z.object({
  title: required('Informe o título da campanha.').min(3, 'Use no mínimo 3 caracteres.').max(100, 'Use no máximo 100 caracteres.'),
  description: required('Descreva a campanha.').max(2000, 'Use no máximo 2000 caracteres.'),
  category: z.enum(['Animais', 'Educacao', 'Roupas', 'Higiene', 'Lazer'], { error: 'Selecione uma categoria.' }),
  product: required('Informe o que será arrecadado.').min(3, 'Use no mínimo 3 caracteres.').max(50, 'Use no máximo 50 caracteres.'),
  goalAmount: z.number({ error: 'Informe a meta.' }).positive('A meta deve ser maior que zero.'),
  receiveOption: z.enum(['Coleta', 'Entrega', 'ColetaOuEntrega']),
  imageUrl: z.string().trim().refine(v => v === '' || /^https?:\/\/\S+$/i.test(v), 'Use um link que comece com http:// ou https://'),
  conclusionDate: z.string().min(1, 'Informe a data de encerramento.'),
  deliveryCep: z.string(),
  deliveryStreet: z.string(),
  deliveryNeighborhood: z.string(),
  deliveryNumber: z.string(),
  deliveryComplement: z.string(),
}).superRefine((v, ctx) => {
  const issue = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message })

  if (v.conclusionDate && v.conclusionDate < today())
    issue('conclusionDate', 'A data deve ser hoje ou futura.')
  if (v.receiveOption === 'Coleta')
    return
  if (digits(v.deliveryCep).length !== 8)
    issue('deliveryCep', 'O CEP deve ter 8 dígitos.')
  if (!v.deliveryStreet.trim())
    issue('deliveryStreet', 'Informe a rua.')
  if (!v.deliveryNeighborhood.trim())
    issue('deliveryNeighborhood', 'Informe o bairro.')
  if (!v.deliveryNumber.trim())
    issue('deliveryNumber', 'Informe o número.')
})
type CampaignForm = z.infer<typeof schema>

// campos que podem receber erro vindo da API
const FIELDS = ['title', 'description', 'category', 'product', 'goalAmount', 'receiveOption', 'imageUrl', 'conclusionDate',
  'deliveryCep', 'deliveryStreet', 'deliveryNeighborhood', 'deliveryNumber', 'deliveryComplement']

const OPTIONS: { value: ReceiveOption; hint: string }[] = [
  { value: 'Entrega', hint: 'O doador leva o item até o endereço que você informar.' },
  { value: 'Coleta', hint: 'Você busca o item na casa do doador.' },
  { value: 'ColetaOuEntrega', hint: 'O doador escolhe entre entregar ou que você vá coletá-la.' },
]

const card = 'space-y-4 rounded-3xl border-2 border-neutral-200 bg-white p-6'

export default function CreateCampaignPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const { register, handleSubmit, control, setValue, setError, formState: { errors, isSubmitting, isSubmitted } } =
    useForm<CampaignForm>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: '', description: '', product: '', receiveOption: 'Entrega', imageUrl: '',
        conclusionDate: '', deliveryCep: '', deliveryStreet: '', deliveryNeighborhood: '', deliveryNumber: '', deliveryComplement: '',
      },
    })
  const receiveOption = useWatch({ control, name: 'receiveOption' })
  const imageUrl = useWatch({ control, name: 'imageUrl' })
  const needsAddress = receiveOption !== 'Coleta'

  const onSubmit = handleSubmit(async v => {
    setFormError('')

    const body: CampaignRequest = {
      title: v.title.trim(),
      description: v.description.trim(),
      category: v.category,
      product: v.product.trim(),
      goalAmount: v.goalAmount,
      receiveOption: v.receiveOption,
      conclusionDate: new Date(`${v.conclusionDate}T23:59:59`).toISOString(), // fim do dia, em UTC
      imageUrl: v.imageUrl.trim() || undefined,
      ...(needsAddress && {
        deliveryCep: digits(v.deliveryCep),
        deliveryStreet: v.deliveryStreet.trim(),
        deliveryNeighborhood: v.deliveryNeighborhood.trim(),
        deliveryNumber: v.deliveryNumber.trim(),
        deliveryComplement: v.deliveryComplement.trim() || undefined,
      }),
    }

    try {
      const created = await api<Campaign>('/campaigns', { method: 'POST', body })
      navigate(`/campaigns/${created.id}`)
    } catch (e) {
      if (!(e instanceof ApiError))
        throw e

      let matched = 0
      for (const [key, message] of Object.entries(e.fields)) {
        if (FIELDS.includes(key)) {
          setError(key as keyof CampaignForm, { message })
          matched++
        }
      }
      setFormError(matched ? '' : e.message)
    }
  })

  return (
    <div className="mx-auto space-y-6">

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-dark">Criar campanha</h1>
        <p className="mt-1 text-neutral-600">Conte o que você precisa e como as pessoas podem ajudar.</p>
      </header>

      <form noValidate onSubmit={onSubmit} className="space-y-6">
        {/* sobre */}
        <section className={card}>
          <h2 className="text-lg font-bold text-dark">Sobre a campanha</h2>
          
          <div className='flex flex-col md:flex-row w-full justify-between gap-4'>
            <div className='flex flex-col gap-4 flex-1 w-full'>
              <TextField label="Título" placeholder="Ex.: Agasalhos para o inverno" icon={<Type size={20} />} error={errors.title?.message} {...register('title')} />

              <Field label="Descrição" htmlFor="description" error={errors.description?.message}>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Explique a causa e que itens você aceita."
                  aria-invalid={!!errors.description}
                  className={`${box(!!errors.description)} py-3`}
                  {...register('description')}
                />
              </Field>

                <Field label="Categoria" htmlFor="category" error={errors.category?.message}>
                  <select id="category" className={`${box(!!errors.category)} h-8`} {...register('category')}>
                    <option value="">Selecione uma categoria</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Field>
            </div>

            {/* Lado direito (Área de upload customizada preenchendo 100% da altura) */}
                        {/* Lado direito: prévia da capa + link da imagem */}
            <div className="flex w-full flex-1 flex-col gap-4">
              <div className="flex min-h-48 flex-1 items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-neutral-50">
                {/^https?:\/\/\S+$/i.test(imageUrl.trim()) ? (
                  <img
                    key={imageUrl}
                    src={imageUrl.trim()}
                    alt="Prévia da capa"
                    className="size-full object-cover"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-6 text-center text-neutral-400">
                    <ImageIcon size={32} aria-hidden />
                    <span className="text-sm">A prévia da capa aparece aqui</span>
                  </div>
                )}
              </div>
              <TextField
                label="Link da imagem (opcional)"
                placeholder="https://..."
                icon={<ImageIcon size={20} />}
                error={errors.imageUrl?.message}
                {...register('imageUrl')}
              />
            </div>
          </div>
        </section>

        {/* meta e prazo */}
        <div className='flex gap-6'>
          <section className={card}>
            <h2 className="text-lg font-bold text-dark">Meta e prazo</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField label="O que será arrecadado" placeholder="Ex.: agasalhos, kg de ração" icon={<Package size={20} />} error={errors.product?.message} {...register('product')} />
              </div>
              <TextField
                label="Meta (quantidade)"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="Ex.: 80"
                icon={<Target size={20} />}
                error={errors.goalAmount?.message}
                {...register('goalAmount', { valueAsNumber: true })}
              />
              <TextField label="Data de encerramento" type="date" min={today()} icon={<CalendarDays size={20} />} error={errors.conclusionDate?.message} {...register('conclusionDate')} />
            </div>
          </section>

          {/* como receber */}
          <section className={card}>
            <h2 className="text-lg font-bold text-dark">Como você vai receber?</h2>
            <div role="radiogroup" aria-label="Como receber" className="grid gap-3 sm:grid-cols-3">
              {OPTIONS.map(o => {
                const selected = receiveOption === o.value
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setValue('receiveOption', o.value, { shouldValidate: isSubmitted })}
                    className={`cursor-pointer rounded-2xl border p-4 text-left transition ${
                      selected ? 'border-primary bg-primary/10' : 'border-neutral-300 hover:border-primary'
                    }`}
                  >
                    <span className="block font-bold text-dark">{RECEIVE_LABELS[o.value]}</span>
                    <span className="mt-1 block text-sm text-neutral-600">{o.hint}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        {/* endereço de entrega (só quando o doador leva o item) */}
        {needsAddress && (
          <section className={card}>
            <h2 className="text-lg font-bold text-dark">Endereço de entrega</h2>
            <p className="-mt-2 text-sm text-neutral-600">Para onde os doadores devem levar os itens.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="CEP"
                inputMode="numeric"
                placeholder="00000-000"
                icon={<MapPin size={20} />}
                error={errors.deliveryCep?.message}
                {...register('deliveryCep', {
                  onChange: e => setValue('deliveryCep', maskCep(e.target.value), { shouldValidate: isSubmitted }),
                })}
              />
              <TextField label="Número" placeholder="Nº" icon={<Hash size={20} />} error={errors.deliveryNumber?.message} {...register('deliveryNumber')} />
              <div className="sm:col-span-2">
                <TextField label="Rua" placeholder="Nome da rua" icon={<MapPin size={20} />} error={errors.deliveryStreet?.message} {...register('deliveryStreet')} />
              </div>
              <TextField label="Bairro" placeholder="Bairro" icon={<MapPin size={20} />} error={errors.deliveryNeighborhood?.message} {...register('deliveryNeighborhood')} />
              <TextField label="Complemento (opcional)" placeholder="Sala, bloco..." icon={<MapPin size={20} />} error={errors.deliveryComplement?.message} {...register('deliveryComplement')} />
            </div>
          </section>
        )}

        {formError && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link to="/campaigns" className="grid h-14 place-items-center rounded-full border border-red-300 px-8 bg-red-400 font-bold text-white hover:bg-red-500">
            Cancelar
          </Link>
          <Button type="submit" loading={isSubmitting} className="cursor-pointer sm:w-auto sm:px-10">Publicar campanha</Button>
        </div>
      </form>
    </div>
  )
}