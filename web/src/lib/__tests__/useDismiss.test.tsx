import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { useDismiss } from '../useDismiss'

function Box({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, open, setOpen)
  return (
    <>
      <div ref={ref}><button>dentro</button></div>
      <button>fora</button>
    </>
  )
}

describe('useDismiss', () => {
  it('fecha ao clicar fora', () => {
    const setOpen = vi.fn()
    render(<Box open setOpen={setOpen} />)

    fireEvent.mouseDown(screen.getByText('fora'))

    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it('não fecha ao clicar dentro', () => {
    const setOpen = vi.fn()
    render(<Box open setOpen={setOpen} />)

    fireEvent.mouseDown(screen.getByText('dentro'))

    expect(setOpen).not.toHaveBeenCalled()
  })

  it('fecha com Esc, mas não com outras teclas', () => {
    const setOpen = vi.fn()
    render(<Box open setOpen={setOpen} />)

    fireEvent.keyDown(document, { key: 'Enter' })
    expect(setOpen).not.toHaveBeenCalled()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(setOpen).toHaveBeenCalledWith(false)
  })

  it('não escuta nada enquanto está fechado', () => {
    const setOpen = vi.fn()
    render(<Box open={false} setOpen={setOpen} />)

    fireEvent.mouseDown(screen.getByText('fora'))
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(setOpen).not.toHaveBeenCalled()
  })
})
