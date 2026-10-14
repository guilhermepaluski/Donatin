const EMOJIS = ['💚', '🧸', '🎁', '👕']

export function FloatingEmojis({ count = 10 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute -bottom-8 text-2xl"
          style={{
            left: `${(i * 37 + 8) % 95}%`,
            animation: `float-up ${9 + (i % 4) * 2}s linear ${(i * 1.3) % 7}s infinite`,
          }}
        >
          {EMOJIS[i % EMOJIS.length]}
        </span>
      ))}
    </div>
  )
}