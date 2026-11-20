import { useEffect, type RefObject } from 'react'

// fecha um menu/painel ao clicar fora dele ou apertar Esc (usado no sininho e no menu do usuário)
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, setOpen: (open: boolean) => void) {
  useEffect(() => {
    if (!open)
      return

    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node))
        setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        setOpen(false)
    }

    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, setOpen])
}
