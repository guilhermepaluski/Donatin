import { Link, NavLink, Outlet } from 'react-router-dom'
import { HandHeart } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { NotificationBell } from './NotificationBell'
import { UserMenu } from './UserMenu'

// menu de cima + o conteúdo da página (Outlet) embaixo
export default function AppLayout() {
  const { user, loading } = useAuth()

  // "Doações" (minhas doações) só aparece para quem está logado
  const links = [
    { to: '/', label: 'Início', end: true },
    { to: '/campaigns', label: 'Campanhas', end: false },
    { to: '/my-donations', label: 'Doações', end: false },
  ]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 items-center gap-4 px-15">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-extrabold text-dark">
            <HandHeart aria-hidden /> <span className="hidden sm:inline">Donatin</span>
          </NavLink>

        <div className="mx-auto flex h-16 items-center gap-4 px-15">
          <nav aria-label="Principal" className="flex flex-1 items-center gap-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

          {/* lado direito: some enquanto confere o token salvo, para não piscar "Entrar" */}
          {!loading && (user ? (
            <>
              {/* Notification */}
              <NotificationBell />

              {/* User menu */}
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                Entrar
              </Link>
              <Link to="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-95">
                Cadastre-se
              </Link>
            </div>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-8xl px-8 py-8">
        <Outlet />
      </main>

      <footer className="mx-auto mt-20 border-t border-neutral-200 bg-dark px-6 py-10 md:px-15">
        <div className='flex gap-2'>
          <NavLink to="/" className="flex items-center gap-2 text-xl font-extrabold text-dark">
            <HandHeart color='white' aria-hidden /> <h2 className="text-lg font-bold text-white">Donatin</h2>
          </NavLink>
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col justify-between md:flex-row md:gap-15">
          {/* Navegação */}
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">Início</h2>

            <a href="/campanhas" className="text-sm text-white hover:text-green-600">
              Explorar campanhas
            </a>

            <a href="/instituicoes" className="text-sm text-white hover:text-green-600">
              Instituições
            </a>

            <a href="/como-funciona" className="text-sm text-white hover:text-green-600">
              Como funciona?
            </a>
          </div>

          {/* Para você */}
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">Para você</h2>

            <a href="/campaigns" className="text-sm text-white hover:text-green-600">
              Quero doar
            </a>

            <a href="/create-campaign" className="text-sm text-white hover:text-green-600">
              Criar uma campanha
            </a>
          </div>

          {/* Suporte */}
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">Suporte</h2>

            <a href="/privacidade" className="text-sm text-white hover:text-green-600">
              Política de Privacidade
            </a>

            <a href="/termos" className="text-sm text-white hover:text-green-600">
              Termos de Uso
            </a>
          </div>

        </div>

        {/* Rodapé inferior */}
        <div className="mx-auto mt-10 max-w-6xl border-t border-white pt-6">
          <p className="text-center text-sm text-white">
            © {new Date().getFullYear()} Donatin. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}