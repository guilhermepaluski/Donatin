import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; icon?: ReactNode }

export function Button({ loading, icon, children, disabled, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-lg font-bold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 ${className}`}
    >
      {!loading && icon}
      {loading ? 'Aguarde...' : children}
    </button>
  )
}