import { Droplets, Gamepad2, GraduationCap, PawPrint, Shirt, type LucideIcon } from 'lucide-react'
import type { CampaignCategory, ReceiveOption } from '../types'

// CATEGORIES ('value' cames from the API ---> 'label' is what the screen shows)
export const CATEGORIES: { value: CampaignCategory; label: string; icon: LucideIcon }[] = [
  { value: 'Animais', label: 'Animais', icon: PawPrint },
  { value: 'Educacao', label: 'Educação', icon: GraduationCap },
  { value: 'Roupas', label: 'Roupas', icon: Shirt },
  { value: 'Higiene', label: 'Higiene', icon: Droplets },
  { value: 'Lazer', label: 'Lazer', icon: Gamepad2 },
]

export const categoryLabel = (c: CampaignCategory) => CATEGORIES.find(x => x.value === c)?.label ?? c

export const RECEIVE_LABELS: Record<ReceiveOption, string> = {
  Coleta: 'Coleta',
  Entrega: 'Entrega',
  ColetaOuEntrega: 'Coleta ou entrega'
}