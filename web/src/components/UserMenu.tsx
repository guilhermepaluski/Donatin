import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HandHeart, LogOut, Megaphone, PlusCircle, UserCircle2 } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useDismiss } from '../lib/useDismiss'
import { Avatar } from './Avatar'

const item = 'flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50'

// menu do usuário logado (abre ao clicar na foto/iniciais, no canto do cabeçalho)
export function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  useDismiss(boxRef, open, setOpen)

  if (!user)
    return null

  const links = [
    { to: '/profile', label: 'Conta', icon: UserCircle2 },
    { to: '/my-donations?tab=donated', label: 'Minhas doações', icon: HandHeart },
    { to: '/my-donations?tab=received', label: 'Minhas campanhas', icon: Megaphone },
    { to: '/create-campaign', label: 'Criar campanha', icon: PlusCircle },
  ]

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Menu do usuário"
        aria-expanded={open}
        className="cursor-pointer rounded-full p-1 hover:bg-neutral-100"
      >
        <Avatar name={user.name} photoUrl={user.profilePhotoUrl} className="size-9 text-sm" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Menu do usuário"
          className="fixed inset-x-4 top-18 z-20 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-72"
        >
          <header className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
            <Avatar name={user.name} photoUrl={user.profilePhotoUrl} className="size-11 text-base" />
            <div className="min-w-0">
              <p className="truncate font-bold text-dark">{user.name}</p>
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
            </div>
          </header>

          <nav aria-label="Conta">
            {links.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className={item}>
                <Icon size={18} aria-hidden className="text-primary" /> {label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => { setOpen(false); logout() }}
            className={`${item} border-t border-neutral-100 text-red-700`}
          >
            <LogOut size={18} aria-hidden /> Sair
          </button>
        </div>
      )}
    </div>
  )
}
