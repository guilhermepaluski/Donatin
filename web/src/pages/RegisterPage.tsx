import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/PillButton'
import { TextField } from '../components/TextField'
import { FloatingEmojis } from '../components/FloatingEmojis'
import { Building2, FileText, Hash, HandHeart, Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { digits, maskCep, maskCnpj, maskPhone, maskUf } from '../lib/masks'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../lib/api'
import type { RegisterRequest } from '../types'

const required = (msg: string) => z.string().trim().min(1, msg)

// rules definition
const schema = z.object({
  isInstitution: z.boolean(),
  name: required('Informe o nome.').max(100, 'Use no máximo 100 caracteres.'),
  cpfCnpj: z.string(),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Use o formato (XX) XXXXX-XXXX.'),
  cep: z.string(),
  street: z.string(),
  neighborhood: z.string(),
  number: z.string(),
  complement: z.string(),
  city: required('Informe a cidade.'),
  uf: z.string().length(2, 'Use 2 letras (ex.: SC).'),
  email: z.string().min(1, 'Informe o e-mail.').email('Formato de e-mail inválido.'),
  password: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.? "':{}|<>]).*$/, 'Inclua uma letra maiúscula e um caractere especial.'),
}).superRefine((v, ctx) => {
  // CNPJ e endereço só valem para instituição
  if (!v.isInstitution) return
  if (digits(v.cpfCnpj).length !== 14)
    ctx.addIssue({ code: 'custom', path: ['cpfCnpj'], message: 'Informe um CNPJ válido (14 dígitos).' })
  if (v.cep && digits(v.cep).length !== 8)
    ctx.addIssue({ code: 'custom', path: ['cep'], message: 'O CEP deve ter 8 dígitos.' })
})
type RegisterForm = z.infer<typeof schema>

// campos que podem receber erro vindo da API
const FIELDS = ['name', 'cpfCnpj', 'phone', 'cep', 'street', 'neighborhood', 'number', 'complement', 'city', 'uf', 'email', 'password']

// Register function
export default function RegisterPage() {
  const { register: signUp } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const { register, handleSubmit, control, setValue, setError, formState: { errors, isSubmitting, isSubmitted } } =
    useForm<RegisterForm>({
      resolver: zodResolver(schema),
      defaultValues: {
        isInstitution: false, name: '', cpfCnpj: '', phone: '', cep: '', street: '', neighborhood: '',
        number: '', complement: '', city: '', uf: '', email: '', password: '',
      },
    })
  const isInstitution = useWatch({ control, name: 'isInstitution' })

  // campo com máscara: formata o que a pessoa digita
  const masked = (name: 'cpfCnpj' | 'phone' | 'cep' | 'uf', fn: (v: string) => string) =>
    register(name, { onChange: e => setValue(name, fn(e.target.value), { shouldValidate: isSubmitted }) })

  const onSubmit = handleSubmit(async v => {
    setFormError('')

    const body: RegisterRequest = {
      name: v.name.trim(),
      phone: v.phone,
      city: v.city.trim(),
      uf: v.uf.toUpperCase(),
      email: v.email.trim(),
      password: v.password,
      ...(v.isInstitution && {
        cpfCnpj: digits(v.cpfCnpj),
        cep: digits(v.cep) || undefined,
        street: v.street.trim() || undefined,
        neighborhood: v.neighborhood.trim() || undefined,
        number: v.number.trim() || undefined,
        complement: v.complement.trim() || undefined,
      }),
    }

    try {
      await signUp(body)
      navigate('/', { replace: true })
    } catch (e) {
      if (!(e instanceof ApiError)) throw e
      // erro de campo vindo da API -> mostra embaixo do input certo
      let matched = 0
      for (const [key, message] of Object.entries(e.fields)) {
        if (FIELDS.includes(key)) {
          setError(key as keyof RegisterForm, { message })
          matched++
        }
      }
      
      setFormError(matched ? '' : e.message)
    }
  })

  // web frontend
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Pannel */}
      <aside className="relative hidden flex-col items-center justify-center gap-6 overflow-hidden bg-dark p-12 text-center text-white lg:flex">
        <FloatingEmojis />
        <div className="relative flex size-40 items-center justify-center rounded-full bg-white">
          <HandHeart className="size-20 text-primary" aria-hidden />
        </div>
        <h1 className="relative text-6xl font-extrabold">Donatin</h1>
        <p className="relative max-w-sm text-2xl font-medium leading-snug">
          Pequenos gestos, grandes transformações.
        </p>
      </aside>

      {/* Forms */}
      <section className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <p className="mb-6 text-center text-4xl font-extrabold text-primary lg:hidden">Donatin</p>

          <h2 className="text-3xl font-bold text-dark">Bem-vindo!</h2>
          <p className="mt-1 text-neutral-600">Crie sua conta para começar a doar.</p>

          <form noValidate onSubmit={onSubmit} className="mt-8 space-y-4">
            {/* Tipo de conta */}
            <div role="radiogroup" aria-label="Tipo de conta" className="grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1">
              {[
                { value: false, label: 'Pessoa física', icon: <User size={18} /> },
                { value: true, label: 'Instituição', icon: <Building2 size={18} /> },
              ].map(o => (
                <button
                  key={o.label}
                  type="button"
                  role="radio"
                  aria-checked={isInstitution === o.value}
                  onClick={() => setValue('isInstitution', o.value, { shouldValidate: isSubmitted })}
                  className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-bold transition ${
                    isInstitution === o.value ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {o.icon}{o.label}
                </button>
              ))}
            </div>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <TextField
                  label={isInstitution ? 'Razão social' : 'Nome'}
                  placeholder="Digite o nome"
                  autoComplete="name"
                  icon={<User size={20} />}
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>
              {isInstitution && (
                <TextField
                  label="CNPJ"
                  inputMode="numeric"
                  placeholder="00.000.000/0000-00"
                  icon={<FileText size={20} />}
                  error={errors.cpfCnpj?.message}
                  {...masked('cpfCnpj', maskCnpj)}
                />
              )}
              <div className={isInstitution ? '' : 'md:col-span-2'}>
                <TextField
                  label="Telefone"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  icon={<Phone size={20} />}
                  error={errors.phone?.message}
                  {...masked('phone', maskPhone)}
                />
              </div>
            </section>

            {/* Endereço da instituição (opcional) */}
            {isInstitution && (
              <section className="grid gap-4 md:grid-cols-2">
                <p className="text-sm font-medium text-neutral-700 md:col-span-2">
                  Endereço da instituição <span className="font-normal text-neutral-500">(opcional)</span>
                </p>
                <TextField
                  label="CEP"
                  inputMode="numeric"
                  placeholder="00000-000"
                  icon={<MapPin size={20} />}
                  error={errors.cep?.message}
                  {...masked('cep', maskCep)}
                />
                <TextField label="Número" placeholder="Nº" icon={<Hash size={20} />} error={errors.number?.message} {...register('number')} />
                <div className="md:col-span-2">
                  <TextField label="Rua" placeholder="Nome da rua" icon={<MapPin size={20} />} error={errors.street?.message} {...register('street')} />
                </div>
                <TextField label="Bairro" placeholder="Bairro" icon={<MapPin size={20} />} error={errors.neighborhood?.message} {...register('neighborhood')} />
                <TextField label="Complemento" placeholder="Sala, bloco..." icon={<MapPin size={20} />} error={errors.complement?.message} {...register('complement')} />
              </section>
            )}

            <section className="grid grid-cols-[1fr_6rem] gap-4">
              <TextField label="Cidade" placeholder="Cidade" autoComplete="address-level2" icon={<MapPin size={20} />} error={errors.city?.message} {...register('city')} />
              <TextField label="UF" placeholder="SC" maxLength={2} icon={<MapPin size={20} />} error={errors.uf?.message} {...masked('uf', maskUf)} />
            </section>

            <section className="grid gap-4">
              <TextField
                label="E-mail"
                type="email"
                autoComplete="email"
                placeholder="exemplo@email.com"
                icon={<Mail size={20} />}
                error={errors.email?.message}
                {...register('email')}
              />
              <TextField
                label="Senha"
                type="password"
                autoComplete="new-password"
                placeholder="Digite a senha"
                icon={<Lock size={20} />}
                error={errors.password?.message}
                {...register('password')}
              />
            </section>

            {formError && (
              <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
            )}

            <Button type="submit" loading={isSubmitting} className="cursor-pointer">Criar conta</Button>
          </form>

          <p className="mt-6 text-center">
            Já tem uma conta? <Link to="/login" className="font-bold text-primary hover:underline">Entrar</Link>
          </p>
          <p className="mt-6 text-center text-xs text-neutral-500">
            Ao continuar, você concorda com os <b className="text-black">Termos</b>, as <b className="text-black">Condições</b> e a <b className="text-black">Política de Privacidade</b> do Donatin.
          </p>
        </div>
      </section>
    </main>
  )
}