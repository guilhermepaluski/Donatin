import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CampaignApiStatusList } from '../CampaignApiStatusList'
import { CampaignCard } from '../CampaignCard'
import { makeCampaign } from '../../test/factories'
import type { Campaign } from '../../types'

const renderList = (props: Partial<Parameters<typeof CampaignApiStatusList>[0]> = {}) =>
  render(
    <MemoryRouter>
      <CampaignApiStatusList campaigns={[]} loading={false} error={null} onRetry={vi.fn()} emptyMessage="Nada aqui." {...props} />
    </MemoryRouter>,
  )

describe('CampaignApiStatusList', () => {
  it('mostra o erro com botão de tentar de novo', async () => {
    const onRetry = vi.fn()
    renderList({ error: 'Falhou.', onRetry })

    expect(screen.getByRole('alert')).toHaveTextContent('Falhou.')
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('mostra o esqueleto enquanto carrega a primeira vez', () => {
    renderList({ loading: true })

    expect(screen.getByRole('status', { name: 'Carregando campanhas...' })).toBeInTheDocument()
  })

  it('mostra a mensagem de vazio', () => {
    renderList()

    expect(screen.getByText('Nada aqui.')).toBeInTheDocument()
  })

  it('mostra um card por campanha', () => {
    renderList({ campaigns: [makeCampaign({ id: 'a', title: 'Ração' }), makeCampaign({ id: 'b', title: 'Livros' })] })

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByText('Ração')).toBeInTheDocument()
  })
})

describe('CampaignCard', () => {
  const renderCard = (c: Campaign) => render(<MemoryRouter><CampaignCard campaign={c} /></MemoryRouter>)

  it('mostra título, dono, cidade e o progresso', () => {
    renderCard(makeCampaign({ currentAmount: 4, goalAmount: 10 }))

    expect(screen.getByRole('link')).toHaveAttribute('href', '/campaigns/camp-1')
    expect(screen.getByText('Joinville/SC · Abrigo Esperança')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
    expect(screen.getByText(/de 10 agasalhos \(40%\)/)).toBeInTheDocument()
  })

  it('o progresso nunca passa de 100%', () => {
    renderCard(makeCampaign({ currentAmount: 25, goalAmount: 10 }))

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('mostra a imagem quando a campanha tem uma', () => {
    const { container } = renderCard(makeCampaign({ imageUrl: 'https://site.com/capa.png' }))

    expect(container.querySelector('img')).toHaveAttribute('src', 'https://site.com/capa.png')
  })

  it('sem dono carregado, não mostra a linha de localização', () => {
    renderCard(makeCampaign({ ownerCampaignName: null }))

    expect(screen.queryByText(/Abrigo/)).toBeNull()
  })
})
