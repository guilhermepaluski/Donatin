import type { ReactNode } from 'react'

export const box = (invalid: boolean) =>
  `w-full rounded-xl border bg-white px-3 outline-none focus:ring-2 focus:ring-primary ${invalid ? 'border-red-500' : 'border-neutral-300'}`

// rótulo + mensagem de erro para campos que não usam o TextField (select e textarea)
export function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}