import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; icon: ReactNode; error?: string }

export function TextField({ label, icon, error, id, ...rest }: Props) {
  const fieldId = id ?? rest.name ?? label
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      <div className={`flex h-14 items-center gap-2 rounded-xl border bg-white px-3 focus-within:ring-2 focus-within:ring-primary ${error ? 'border-red-500' : 'border-neutral-300'}`}>
        <span className="text-neutral-500" aria-hidden>{icon}</span>
        <input id={fieldId} aria-invalid={!!error} className="h-full w-full bg-transparent outline-none placeholder:text-neutral-400" {...rest} />
      </div>
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}