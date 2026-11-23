import { useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useParams } from 'react-router-dom'
import { Building2, CalendarDays, Camera, FileText, Hash, Mail, MapPin, Pencil, Phone, User, type LucideIcon } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { api, ApiError } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { digits, maskCep, maskCnpj, maskPhone, maskUf } from '../lib/masks'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/PillButton'
import { TextField } from '../components/TextField'
import { Field, box } from '../components/FieldBox'
import { CampaignCard } from '../components/CampaignCard'
import type { Campaign, PublicProfile, UserProfile, UserUpdateRequest } from '../types'

const required = (msg: string) => z.string().trim().min(1, msg)

// mesmas regras do UserUpdateDTO
const schema = z.object({
  name: required('Informe o nome.').max(100, 'Use no máximo 100 caracteres.'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Use o formato (XX) XXXXX-XXXX.'),
  cep: z.string().refine(v => v === '' || digits(v).length === 8, 'O CEP deve ter 8 dígitos.'),
  street: z.string(),
  neighborhood: z.string(),
  number: z.string(),
  complement: z.string(),
  city: required('Informe a cidade.'),
  uf: z.string().length(2, 'Use 2 letras (ex.: SC).'),
  aboutMe: z.string().max(2000, 'Use no máximo 2000 caracteres.'),
  profilePhotoUrl: z.string(), // preenchida com a URL devolvida pelo upload
})
type ProfileForm = z.infer<typeof schema>

// campos que podem receber erro vindo da API
const FIELDS = ['name', 'phone', 'cep', 'street', 'neighborhood', 'number', 'complement', 'city', 'uf', 'aboutMe', 'profilePhotoUrl']

// endereço completo da instituição (rua, número - complemento - bairro - CEP)
const fullAddress = (u: UserProfile) =>
  [[u.street, u.number].filter(Boolean).join(', '), u.complement, u.neighborhood, u.cep && maskCep(u.cep)]
    .filter(Boolean)
    .join(' - ')

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const params = useParams()
  const id = params.id ?? user?.id ?? ''
  const isMe = !!user && user.id === id

  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  // meu perfil já está no AuthContext; de outra pessoa, busca o perfil público
  const publicProfile = useFetch<PublicProfile>(id && !isMe ? `/users/${id}/public` : null)
  const campaigns = useFetch<Campaign[]>(id ? `/campaigns/user/${id}` : null)

  if (!isMe && publicProfile.loading)
    return <div role="status" aria-label="Carregando perfil..." className="mx-auto h-64 max-w-5xl animate-pulse rounded-3xl bg-neutral-200" />

  if (!isMe && (publicProfile.error || !publicProfile.data))
    return (
      <div role="alert" className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        <p>{publicProfile.error ?? 'Usuário não encontrado.'}</p>
        <Link to="/campaigns" className="mt-5 inline-block font-bold underline">Ver campanhas</Link>
      </div>
    )

  // junta os dois casos no mesmo formato (o meu perfil tem mais dados)
  const p: PublicProfile = user && isMe
    ? {
        id: user.id, name: user.name, aboutMe: user.aboutMe, profilePhotoUrl: user.profilePhotoUrl,
        city: user.city, uf: user.uf, isInstitution: !!user.cpfCnpj, cpfCnpj: user.cpfCnpj,
        phone: user.phone, address: fullAddress(user) || null,
      }
    : publicProfile.data!

  const info: { icon: LucideIcon; label: string; value: ReactNode }[] = [
    ...(user && isMe ? [{ icon: Mail, label: 'E-mail', value: user.email }] : []),
    ...(p.phone ? [{ icon: Phone, label: 'Telefone', value: <a href={`tel:${digits(p.phone)}`} className="hover:underline">{p.phone}</a> }] : []),
    ...(p.cpfCnpj ? [{ icon: FileText, label: 'CNPJ', value: maskCnpj(p.cpfCnpj) }] : []),
    ...(p.address ? [{ icon: Building2, label: 'Endereço', value: p.address }] : []),
    ...(user && isMe ? [{ icon: CalendarDays, label: 'Membro desde', value: new Date(user.createdAt).toLocaleDateString('pt-BR') }] : []),
  ]

  const active = (campaigns.data ?? []).filter(c => c.isActive && !c.hasExpired)
  const closed = (campaigns.data ?? []).filter(c => !c.isActive || c.hasExpired)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-6 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar name={p.name} photoUrl={p.profilePhotoUrl} className="size-24 text-3xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-dark">{p.name}</h1>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-500 sm:justify-start">
            {p.isInstitution ? (
              <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-white">
                <Building2 size={12} aria-hidden /> Instituição
              </span>
            ) : (
              <span className="rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-bold text-neutral-600">Pessoa física</span>
            )}
            <span className="flex items-center gap-1"><MapPin size={14} aria-hidden /> {p.city}/{p.uf}</span>
          </p>
          {!editing && (
            <p className="mt-4 whitespace-pre-line text-neutral-700">
              {p.aboutMe || <span className="text-neutral-400">{isMe ? 'Você ainda não escreveu nada sobre você.' : 'Sem descrição.'}</span>}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          {isMe && !editing && (
            <button
              type="button"
              onClick={() => { setEditing(true); setSaved(false) }}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-95"
            >
              <Pencil size={16} aria-hidden /> Editar perfil
            </button>
          )}
          {/* RF23: abre o app de telefone com o número preenchido (só instituições têm telefone público) */}
          {!isMe && p.phone && (
            <a href={`tel:${digits(p.phone)}`} className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-95">
              <Phone size={16} aria-hidden /> Ligar
            </a>
          )}
        </div>
      </header>

      {saved && (
        <p role="status" className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          Perfil atualizado com sucesso.
        </p>
      )}

      {user && isMe && editing ? (
        <ProfileEditForm
          user={user}
          onCancel={() => setEditing(false)}
          onSaved={updated => { updateUser(updated); setEditing(false); setSaved(true) }}
        />
      ) : (
        <>
          {info.length > 0 && (
            <section aria-labelledby="dados" className="rounded-3xl border border-neutral-200 bg-white p-6">
              <h2 id="dados" className="text-lg font-bold text-dark">{isMe ? 'Meus dados' : 'Contato'}</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {info.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-2xl bg-neutral-100 p-4">
                    <Icon size={20} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</dt>
                      <dd className="wrap-break-word font-bold text-dark">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* active campaigns */}
          <CampaignSection
            title={isMe ? 'Minhas campanhas ativas' : 'Campanhas ativas'}
            campaigns={active}
            loading={campaigns.loading}
            error={campaigns.error}
            empty="Nenhuma campanha ativa no momento."
          />
          {/* closed campaigns */}
          {closed.length > 0 && <CampaignSection title="Campanhas encerradas" campaigns={closed} />}
        </>
      )}
    </div>
  )
}

function CampaignSection({ title, campaigns, loading, error, empty }: {
  title: string
  campaigns: Campaign[]
  loading?: boolean
  error?: string | null
  empty?: string
}) {
  return (
    <section aria-label={title}>
      <h2 className="text-xl font-extrabold text-dark">{title}</h2>
      {loading && !campaigns.length && <p className="mt-4 text-sm text-neutral-500">Carregando campanhas...</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {!loading && !error && !campaigns.length && empty && <p className="mt-4 text-sm text-neutral-500">{empty}</p>}
      {campaigns.length > 0 && (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      )}
    </section>
  )
}

// formulário de edição (PUT /users/me)
function ProfileEditForm({ user, onCancel, onSaved }: { user: UserProfile; onCancel: () => void; onSaved: (u: UserProfile) => void }) {
  const isInstitution = !!user.cpfCnpj
  const [formError, setFormError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')

  const { register, handleSubmit, control, setValue, setError, formState: { errors, isSubmitting, isSubmitted } } =
    useForm<ProfileForm>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: user.name,
        phone: user.phone,
        cep: user.cep ? maskCep(user.cep) : '',
        street: user.street ?? '',
        neighborhood: user.neighborhood ?? '',
        number: user.number ?? '',
        complement: user.complement ?? '',
        city: user.city,
        uf: user.uf,
        aboutMe: user.aboutMe ?? '',
        profilePhotoUrl: user.profilePhotoUrl ?? '',
      },
    })

  const photoUrl = useWatch({ control, name: 'profilePhotoUrl' })

  // envia a foto escolhida para a API (Azure Blob Storage) e guarda a URL devolvida no formulário
  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file)
      return

    setPhotoError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { url } = await api<{ url: string }>('/uploads/image', { method: 'POST', body: form })
      setValue('profilePhotoUrl', url)
    } catch (err) {
      setPhotoError(err instanceof ApiError ? err.message : 'Não foi possível enviar a foto.') // mantém a foto anterior
    } finally {
      setUploading(false)
    }
  }

  // campo com máscara: formata o que a pessoa digita
  const masked = (name: 'phone' | 'cep' | 'uf', fn: (v: string) => string) =>
    register(name, { onChange: e => setValue(name, fn(e.target.value), { shouldValidate: isSubmitted }) })

  const onSubmit = handleSubmit(async v => {
    setFormError('')

    const body: UserUpdateRequest = {
      name: v.name.trim(),
      phone: v.phone,
      city: v.city.trim(),
      uf: v.uf.toUpperCase(),
      aboutMe: v.aboutMe.trim(),
      profilePhotoUrl: v.profilePhotoUrl || undefined,
      ...(isInstitution && {
        cep: digits(v.cep) || undefined,
        street: v.street.trim() || undefined,
        neighborhood: v.neighborhood.trim() || undefined,
        number: v.number.trim() || undefined,
        complement: v.complement.trim() || undefined,
      }),
    }

    try {
      onSaved(await api<UserProfile>('/users/me', { method: 'PUT', body }))
    } catch (e) {
      if (!(e instanceof ApiError)) throw e
      // erro de campo vindo da API -> mostra embaixo do input certo
      let matched = 0
      for (const [key, message] of Object.entries(e.fields)) {
        if (FIELDS.includes(key)) {
          setError(key as keyof ProfileForm, { message })
          matched++
        }
      }
      setFormError(matched ? '' : e.message)
    }
  })

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6">
      <h2 className="text-lg font-bold text-dark">Editar perfil</h2>

      {/* foto de perfil: o próprio círculo é o botão de escolher a imagem (<label> ligado ao input escondido) */}
      <section className="flex flex-col items-center gap-2">
        <label
          htmlFor="profilePhoto"
          className={`group relative size-24 overflow-hidden rounded-full focus-within:ring-2 focus-within:ring-primary ${
            photoError ? 'ring-2 ring-red-500' : ''
          } ${uploading ? 'cursor-wait' : 'cursor-pointer'}`}
        >
          {photoUrl ? (
            <img src={photoUrl} alt="Prévia da foto de perfil" className="size-full object-cover" />
          ) : (
            <Avatar name={user.name} className="size-24 text-3xl" />
          )}

          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            <Camera size={20} aria-hidden />
            Trocar foto
          </span>

          {/* input de arquivo escondido visualmente (sr-only), mas acessível por teclado e leitor de tela */}
          <input
            id="profilePhoto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Foto de perfil"
            className="sr-only"
            disabled={uploading}
            onChange={onPhotoChange}
          />
        </label>

        {photoError
          ? <p role="alert" className="text-sm text-red-600">{photoError}</p>
          : <p className="text-sm text-neutral-500">{uploading ? 'Enviando foto...' : 'Clique na foto para trocar (JPG, PNG ou WEBP, até 5 MB).'}</p>}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextField
            label={isInstitution ? 'Razão social' : 'Nome'}
            autoComplete="name"
            icon={<User size={20} />}
            error={errors.name?.message}
            {...register('name')}
          />
        </div>
        <TextField
          label="Telefone"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
          icon={<Phone size={20} />}
          error={errors.phone?.message}
          {...masked('phone', maskPhone)}
        />
        <div className="grid grid-cols-[1fr_6rem] gap-4">
          <TextField label="Cidade" autoComplete="address-level2" icon={<MapPin size={20} />} error={errors.city?.message} {...register('city')} />
          <TextField label="UF" maxLength={2} icon={<MapPin size={20} />} error={errors.uf?.message} {...masked('uf', maskUf)} />
        </div>
      </section>

      {/* endereço: só instituição (o backend ignora para pessoa física) */}
      {isInstitution && (
        <section className="grid gap-4 md:grid-cols-2">
          <p className="text-sm font-medium text-neutral-700 md:col-span-2">
            Endereço da instituição <span className="font-normal text-neutral-500">(opcional)</span>
          </p>
          <TextField label="CEP" inputMode="numeric" placeholder="00000-000" icon={<MapPin size={20} />} error={errors.cep?.message} {...masked('cep', maskCep)} />
          <TextField label="Número" placeholder="Nº" icon={<Hash size={20} />} error={errors.number?.message} {...register('number')} />
          <div className="md:col-span-2">
            <TextField label="Rua" placeholder="Nome da rua" icon={<MapPin size={20} />} error={errors.street?.message} {...register('street')} />
          </div>
          <TextField label="Bairro" placeholder="Bairro" icon={<MapPin size={20} />} error={errors.neighborhood?.message} {...register('neighborhood')} />
          <TextField label="Complemento" placeholder="Sala, bloco..." icon={<MapPin size={20} />} error={errors.complement?.message} {...register('complement')} />
        </section>
      )}

      <section className="grid gap-4">
        <Field label="Sobre mim" htmlFor="aboutMe" error={errors.aboutMe?.message}>
          <textarea
            id="aboutMe"
            rows={5}
            placeholder={isInstitution ? 'Conte sobre a instituição e o trabalho que ela faz.' : 'Conte um pouco sobre você.'}
            aria-invalid={!!errors.aboutMe}
            className={`${box(!!errors.aboutMe)} py-3`}
            {...register('aboutMe')}
          />
        </Field>
      </section>

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-14 cursor-pointer rounded-full border border-neutral-300 px-8 font-bold text-neutral-700 hover:border-primary"
        >
          Cancelar
        </button>
        <Button type="submit" loading={isSubmitting} disabled={uploading} className="cursor-pointer sm:w-56">Salvar</Button>
      </div>
    </form>
  )
}
