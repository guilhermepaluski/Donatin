// Espelham os DTOs da API (Donatin.Api/DTOs)
export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  email: string
}

export interface LoginRequest {
  email: string;
  password: string
}

export interface RegisterRequest {
  name: string
  cpfCnpj?: string // só dígitos; apenas CNPJ (14). Sem CNPJ = pessoa física
  phone: string // (XX) XXXXX-XXXX
  cep?: string // 8 dígitos (só instituição)
  street?: string
  neighborhood?: string
  number?: string
  complement?: string
  city: string
  uf: string
  aboutMe?: string
  profilePhotoUrl?: string
  email: string
  password: string
}

// Espelha UserResponseDTO (GET /users/me). Campos opcionais da API chegam como null
export interface UserProfile {
  id: string
  name: string
  cpfCnpj: string | null
  phone: string
  cep: string | null
  street: string | null
  neighborhood: string | null
  number: string | null
  complement: string | null
  city: string
  uf: string
  email: string
  profilePhotoUrl: string | null
  aboutMe: string | null
  createdAt: string
}

// Espelha CampaignResponseDTO (GET /campaigns)
export type CampaignCategory = 'Animais' | 'Educacao' | 'Roupas' | 'Higiene' | 'Lazer'
export type ReceiveOption = 'Coleta' | 'Entrega' | 'ColetaOuEntrega'

export interface Campaign {
  id: string
  title: string
  description: string
  category: CampaignCategory
  product: string
  goalAmount: number
  currentAmount: number
  isGoalReached: boolean
  receiveOption: ReceiveOption
  imageUrl: string | null
  isActive: boolean
  hasExpired: boolean
  createdAt: string
  conclusionDate: string
  userId: string
  ownerCampaignName: string | null
  ownerCampaignCity: string | null
  ownerCampaignUf: string | null
  campaignDeliveryAddress: string | null
}

export interface CampaignRequest {
  title: string
  description: string
  category: CampaignCategory
  product: string
  goalAmount: number
  receiveOption: ReceiveOption
  conclusionDate: string // ISO em UTC
  imageUrl?: string
  deliveryCep?: string
  deliveryStreet?: string
  deliveryNeighborhood?: string
  deliveryNumber?: string
  deliveryComplement?: string
  deliveryCity?: string
  deliveryUf?: string
}

export type DonationMethod = 'Coleta' | 'Entrega'
export type DonationStatus = 'Concluida' | 'Pendente' | 'Expirada' | 'Cancelada'

export interface Donation {
  id: string
  quantity: number
  notes: string | null
  donationMethod: DonationMethod
  donatedAt: string
  status: DonationStatus
  isAnonymous: boolean
  userId: string | null
  donorName: string | null
  donorPhone: string | null
  donorCep: string | null
  donorStreet: string | null
  donorNeighborhood: string | null
  donorNumber: string | null
  donorComplement: string | null
  campaignId: string
  campaignTitle: string | null
  campaignOwnerName: string | null
  campaignOwnerPhone: string | null
  campaignDeliveryAddress: string | null
}

export interface DonationRequest {
  campaignId: string
  quantity: number
  notes?: string
  donationMethod: DonationMethod
  donorCep?: string
  donorStreet?: string
  donorNeighborhood?: string
  donorNumber?: string
  donorComplement?: string
  isAnonymous: boolean
}