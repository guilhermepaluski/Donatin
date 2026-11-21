import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { DonationCard } from '../DonationCard'
import { makeDonation, makeSchedule } from '../../test/factories'

type Props = Parameters<typeof DonationCard>[0]
const renderCard = (props: Partial<Props> = {}) =>
  render(<MemoryRouter><DonationCard donation={makeDonation()} view="donor" {...props} /></MemoryRouter>)

describe('DonationCard', () => {
  describe('visão do doador', () => {
    it('mostra a campanha, o dono com link e o status', () => {
      renderCard()

      expect(screen.getByRole('link', { name: 'Agasalhos para o inverno' })).toHaveAttribute('href', '/campaigns/camp-1')
      expect(screen.getByRole('link', { name: 'Abrigo Esperança' })).toHaveAttribute('href', '/users/owner-1')
      expect(screen.getByText('Pendente')).toBeInTheDocument()
    })

    it('na entrega pendente mostra para onde levar e o contato do dono', () => {
      renderCard()

      expect(screen.getByText('Rua XV, 100 - Centro, Joinville/SC')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '(47) 98888-1111' })).toHaveAttribute('href', 'tel:47988881111')
    })

    it('sem id do dono, mostra só o nome (sem link)', () => {
      renderCard({ donation: makeDonation({ campaignOwnerId: null }) })

      expect(screen.queryByRole('link', { name: 'Abrigo Esperança' })).toBeNull()
      expect(screen.getByText(/Abrigo Esperança/)).toBeInTheDocument()
    })

    it('o doador pode cancelar, mas não confirmar', async () => {
      const onCancel = vi.fn()
      renderCard({ onCancel })

      await userEvent.click(screen.getByRole('button', { name: /cancelar doação/i }))

      expect(onCancel).toHaveBeenCalled()
      expect(screen.queryByRole('button', { name: /confirmar recebimento/i })).toBeNull()
    })

    it('doação concluída não tem botões nem endereço de entrega', () => {
      renderCard({ donation: makeDonation({ status: 'Concluida' }) })

      expect(screen.getByText('Concluída')).toBeInTheDocument()
      expect(screen.queryByRole('button')).toBeNull()
      expect(screen.queryByText(/Levar para/)).toBeNull()
    })
  })

  describe('visão do dono da campanha', () => {
    it('mostra o doador com link e o telefone dele', () => {
      renderCard({ view: 'owner' })

      expect(screen.getByRole('link', { name: 'Maria Souza' })).toHaveAttribute('href', '/users/user-1')
      expect(screen.getByText(/Telefone do doador/)).toBeInTheDocument()
    })

    it('doação anônima aparece como "Anônimo", sem telefone', () => {
      renderCard({ view: 'owner', donation: makeDonation({ isAnonymous: true, userId: null, donorName: null, donorPhone: null }) })

      expect(screen.getByText(/Anônimo/)).toBeInTheDocument()
      expect(screen.queryByText(/Telefone do doador/)).toBeNull()
    })

    it('na coleta mostra onde retirar', () => {
      renderCard({
        view: 'owner',
        donation: makeDonation({ donationMethod: 'Coleta', donorStreet: 'Rua A', donorNumber: '10', donorNeighborhood: 'Centro', donorCep: '89201000' }),
      })

      expect(screen.getByText('Rua A, 10 - Centro - 89201000')).toBeInTheDocument()
    })

    it('o dono pode confirmar o recebimento', async () => {
      const onConfirm = vi.fn()
      renderCard({ view: 'owner', onConfirm })

      await userEvent.click(screen.getByRole('button', { name: /confirmar recebimento/i }))

      expect(onConfirm).toHaveBeenCalled()
    })

    it('enquanto uma ação está em andamento, os botões ficam desativados', () => {
      renderCard({ view: 'owner', busy: true })

      expect(screen.getByRole('button', { name: /confirmar recebimento/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /cancelar doação/i })).toBeDisabled()
    })
  })

  it('mostra a observação da doação', () => {
    renderCard({ donation: makeDonation({ notes: 'Tamanho M' }) })

    expect(screen.getByText('Tamanho M')).toBeInTheDocument()
  })

  it('com agendamento e ações, mostra o card do agendamento', () => {
    renderCard({ schedule: makeSchedule(), scheduleActions: { requestReschedule: vi.fn(), reschedule: vi.fn() } })

    expect(screen.getByText(/Agendado para/)).toBeInTheDocument()
  })
})
