const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5034/api'
const TOKEN_KEY = 'donatin.token'

// guarda o JWT no navegador
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),                     // picking the saved token of localStorage
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token), // saving the token on localStorage
  clear: () => localStorage.removeItem(TOKEN_KEY)                 // cleaning the token of localStorage
}

// class of backend errors
export class ApiError extends Error {
  status: number                // HTTP code error
  fields: Record<string, string> // error based on each field of forms
  
  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message)              // error message
    this.status = status
    this.fields = fields
  }
}

type Options = {
  method?: string; // HTTP method (GET, POST, PUT, DELETE)
  body?: unknown   // content sent to backend
}

// api function:
export async function api<T>(path: string, { method = 'GET', body }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined)
    headers['Content-Type'] = 'application/json'

  const token = tokenStorage.get()
  if (token)
    headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
                      // template request path
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Não foi possível se conectar ao servidor. Tente novamente.')
  }

  if (res.status === 204)
    return undefined as T

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // validação (ProblemDetails): { errors: { Phone: ["..."] } }
    const fields: Record<string, string> = {}
    if (data?.errors) {
      for (const [key, msgs] of Object.entries<string[]>(data.errors)) {
        fields[key.charAt(0).toLowerCase() + key.slice(1)] = msgs[0]
      }
    }
    const message =
      data?.message ?? Object.values(fields)[0] ?? 'Ocorreu um erro inesperado. Tente novamente.'
    
    throw new ApiError(res.status, message, fields)
  }

  return data as T
}