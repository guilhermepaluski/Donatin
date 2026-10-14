// Espelham os DTOs da API (Donatin.Api/DTOs)
export interface AuthResponse { token: string; userId: string; name: string; email: string }

export interface LoginRequest { email: string; password: string }

export interface RegisterRequest {
  name: string
  cpfCnpj: string // só dígitos (11 ou 14)
  birthDate: string // AAAA-MM-DD
  phone: string // (XX) XXXXX-XXXX
  cep: string // 8 dígitos
  street: string
  neighborhood: string
  number: string
  complement?: string
  city: string
  uf: string
  aboutMe?: string
  profilePhotoUrl?: string
  email: string
  password: string
}
