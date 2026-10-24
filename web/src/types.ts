// Espelham os DTOs da API (Donatin.Api/DTOs)
export interface AuthResponse { token: string; userId: string; name: string; email: string }

export interface LoginRequest { email: string; password: string }

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