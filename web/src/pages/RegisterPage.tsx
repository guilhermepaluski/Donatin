import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/PillButton'
import { TextField } from '../components/TextField'
import { FloatingEmojis } from '../components/FloatingEmojis'
import { HandHeart, ArrowLeft, Building2, Calendar, FileText, Hash, Lock, Mail, MapPin, Phone, User, UserPlus } from 'lucide-react'
import { brDateToIso, digits, maskCep, maskCpfCnpj, maskDate, maskPhone } from '../lib/masks'

const required = (msg: string) => z.string().trim().min(1, msg)

// rules definition
const schema = z.object({
  name: required('Informe o nome.').max(100, 'Use no máximo 100 caracteres.'),
  cpfCnpj: z.string().refine(v => [14].includes(digits(v).length), 'Informe um CNPJ válido (14 dígitos).'),
  birthDate: z.string().refine(v => brDateToIso(v) !== null, 'Informe uma data válida (DD/MM/AAAA).'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Use o formato (XX) XXXXX-XXXX.'),
  cep: z.string().refine(v => digits(v).length === 8, 'O CEP deve ter 8 dígitos.'),
  street: required('Informe a rua.'),
  neighborhood: required('Informe o bairro.'),
  number: required('Informe o número.'),
  complement: z.string().optional(),
  city: required('Informe a cidade.'),
  uf: z.string().length(2, 'Use 2 letras (ex.: SC).'),
  email: z.string().min(1, 'Informe o e-mail.').email('Formato de e-mail inválido.'),
  password: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.? "':{}|<>]).*$/, 'Inclua uma letra maiúscula e um caractere especial.')
})
type FormData = z.infer<typeof schema>

// Register function
export default function RegisterPage() {
  
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

          <form className="mt-8 space-y-4">
            <section className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <TextField label="Nome/Razão social" placeholder="Digite o nome" icon={<User />}></TextField>
              </div>
              <TextField label="CPF/CNPJ" inputMode="numeric" placeholder="Somente números" icon={<FileText />}></TextField>
              <TextField label="Telefone" inputMode="numeric" placeholder="(00) 00000-0000" icon={<Phone />}></TextField>
            </section>

            <section className="grid gap-4">
              <TextField label="E-mail" type="email" placeholder="exemplo@email.com" icon={<Mail size={20} />} />
              <TextField label="Senha" type="password" placeholder="Digite a senha" icon={<Lock size={20} />} />
            </section>
          </form>
          
          <div className="mt-4 space-y-4">
            <Button type="button" className='cursor-pointer'>Criar conta</Button>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            Ao continuar, você concorda com os <b className="text-black">Termos</b>, as <b className="text-black">Condições</b> e a <b className="text-black">Política de Privacidade</b> do Donatin.
          </p>
        </div>
      </section>
    </main>
  ) 
}