import type { ReactNode } from 'react'

export function InfoPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-6 text-neutral-700">
      <h1 className="text-3xl font-extrabold text-dark">{title}</h1>
      {children}
    </article>
  )
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-bold text-dark">{title}</h2>
      {children}
    </section>
  )
}
