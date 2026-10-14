import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { HandHeart, Lock, Mail } from 'lucide-react'
import { Button } from '../components/PillButton'
import { TextField } from '../components/TextField'
import { FloatingEmojis } from '../components/FloatingEmojis'

// rules definition
const schema = z.object({
  email: z.string().min(1, 'Insira o e-mail.').email('Insira um email válido.'),
  password: z.string().min(1, 'Informe a senha'),
})
type FormData = z.infer<typeof schema>

// Login function
export default function LoginPage() {
/*  const { login } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const { registerInput, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  
  const onSubmit = handleSubmit(async values => {
    setFormError('')
    try {
      await login (values)
      navigate('/', { replace: true })
    }
    catch (e) {
      if (e instanceof ApiError) setFormError(e.message)
      else throw e
    }
  })
*/

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

          <h2 className="text-3xl font-bold text-dark">Bem-vindo de volta</h2>
          <p className="mt-1 text-neutral-600">Entre para continuar doando.</p>

          <form noValidate className="mt-8 space-y-4">
            <TextField label="E-mail" type="email" placeholder="exemplo@email.com" icon={<Mail size={20} />} />
            <TextField label="Senha" type="password" placeholder="Digite a senha" icon={<Lock size={20} />} />
            <Button type="button" className='cursor-pointer'>Entrar</Button>
          </form>

          <p className="mt-6 text-center">
            Não tem uma conta? <Link to="/register" className="font-bold text-primary hover:underline">Cadastre-se</Link>
          </p>
          <p className="mt-6 text-center text-xs text-neutral-500">
            Ao continuar, você concorda com os <b className="text-black">Termos</b>, as <b className="text-black">Condições</b> e a <b className="text-black">Política de Privacidade</b> do Donatin.
          </p>
        </div>
      </section>
    </main>
  ) 
}