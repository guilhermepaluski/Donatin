import { useState } from 'react'

interface Props {
  name: string
  photoUrl?: string | null
  className?: string // tamanho e fonte, ex.: "size-10 text-sm"
}

// foto do usuário; sem foto (ou se a URL falhar) mostra as iniciais do nome
export function Avatar({ name, photoUrl, className = 'size-10 text-sm' }: Props) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const initials = name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')

  if (photoUrl && failedUrl !== photoUrl)
    return (
      <img
        src={photoUrl}
        alt=""
        onError={() => setFailedUrl(photoUrl)}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    )

  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-full bg-primary font-bold text-white ${className}`}>
      {initials || '?'}
    </span>
  )
}
