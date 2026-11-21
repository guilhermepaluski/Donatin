import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { Avatar } from '../Avatar'

describe('Avatar', () => {
  it('sem foto mostra as iniciais (no máximo 2)', () => {
    const { container } = render(<Avatar name="maria da silva souza" />)

    expect(container).toHaveTextContent('MD')
    expect(container.querySelector('img')).toBeNull()
  })

  it('nome vazio mostra "?"', () => {
    const { container } = render(<Avatar name="   " />)

    expect(container).toHaveTextContent('?')
  })

  it('com foto mostra a imagem', () => {
    const { container } = render(<Avatar name="Maria" photoUrl="https://site.com/foto.png" />)

    expect(container.querySelector('img')).toHaveAttribute('src', 'https://site.com/foto.png')
  })

  it('se a foto não carregar, volta para as iniciais', () => {
    const { container } = render(<Avatar name="Maria" photoUrl="https://site.com/quebrada.png" />)

    fireEvent.error(container.querySelector('img')!)

    expect(container.querySelector('img')).toBeNull()
    expect(container).toHaveTextContent('M')
  })
})
