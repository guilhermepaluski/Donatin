const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5034/api'

// mensagem de erro da API
export class ApiError extends Error {
  status: number
  fields: Record<string, string>
  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fields = fields
  }
}
