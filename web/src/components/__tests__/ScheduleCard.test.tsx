import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScheduleCard } from '../ScheduleCard'
import { makeSchedule } from '../../test/factories'

type Props = Parameters<typeof ScheduleCard>[0]

function renderCard(props: Partial<Props> = {}) {
  const actions = { requestReschedule: vi.fn().mockResolvedValue(true), reschedule: vi.fn().mockResolvedValue(true) }
  render(<ScheduleCard schedule={makeSchedule()} view="donor" donationPending actions={actions} {...props} />)
  return actions
}

// "2030-01-10T10:00" no formato do <input type="datetime-local">
const localInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

describe('ScheduleCard', () => {
  it('mostra a data agendada', () => {
    renderCard()

    expect(screen.getByText(/Agendado para/)).toBeInTheDocument()
  })

  describe('dono da campanha', () => {
    it('pede reagendamento enviando a justificativa sem espaços nas pontas', async () => {
      const actions = renderCard({ view: 'owner' })

      await userEvent.click(screen.getByRole('button', { name: /solicitar reagendamento/i }))
      await userEvent.type(screen.getByLabelText('Justificativa:'), '  Vou viajar  ')
      await userEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }))

      expect(actions.requestReschedule).toHaveBeenCalledWith('Vou viajar')
      expect(screen.queryByLabelText('Justificativa:')).toBeNull() // o formulário fecha depois de enviar
    })

    it('sem justificativa envia undefined', async () => {
      const actions = renderCard({ view: 'owner' })

      await userEvent.click(screen.getByRole('button', { name: /solicitar reagendamento/i }))
      await userEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }))

      expect(actions.requestReschedule).toHaveBeenCalledWith(undefined)
    })

    it('se a API falhar, o formulário continua aberto', async () => {
      const actions = renderCard({ view: 'owner' })
      actions.requestReschedule.mockResolvedValue(false)

      await userEvent.click(screen.getByRole('button', { name: /solicitar reagendamento/i }))
      await userEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }))

      expect(screen.getByLabelText('Justificativa:')).toBeInTheDocument()
    })

    it('"Voltar" fecha o formulário sem enviar', async () => {
      const actions = renderCard({ view: 'owner' })

      await userEvent.click(screen.getByRole('button', { name: /solicitar reagendamento/i }))
      await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

      expect(screen.getByRole('button', { name: /solicitar reagendamento/i })).toBeInTheDocument()
      expect(actions.requestReschedule).not.toHaveBeenCalled()
    })

    it('agendamento já recusado: mostra o status e o motivo, sem botão de pedir de novo', () => {
      renderCard({ view: 'owner', schedule: makeSchedule({ status: 'Recusado', cancellationReason: 'Viajando' }) })

      expect(screen.getByText('Recusado')).toBeInTheDocument()
      expect(screen.getByText('Viajando')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /solicitar reagendamento/i })).toBeNull()
    })
  })

  describe('doador', () => {
    it('reagenda para uma data futura', async () => {
      const actions = renderCard()
      const when = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

      await userEvent.click(screen.getByRole('button', { name: 'Reagendar' }))
      fireEvent.change(screen.getByLabelText('Nova data e horário:'), { target: { value: localInput(when) } })
      await userEvent.click(screen.getByRole('button', { name: /confirmar reagendamento/i }))

      expect(actions.reschedule).toHaveBeenCalledWith(new Date(localInput(when)).toISOString())
    })

    it('sem data, mostra erro e não chama a API', async () => {
      const actions = renderCard()

      await userEvent.click(screen.getByRole('button', { name: 'Reagendar' }))
      await userEvent.click(screen.getByRole('button', { name: /confirmar reagendamento/i }))

      expect(screen.getByRole('alert')).toHaveTextContent('Escolha a data e o horário.')
      expect(actions.reschedule).not.toHaveBeenCalled()
    })

    it('com data no passado, mostra erro', async () => {
      const actions = renderCard()

      await userEvent.click(screen.getByRole('button', { name: 'Reagendar' }))
      fireEvent.change(screen.getByLabelText('Nova data e horário:'), { target: { value: '2020-01-01T10:00' } })
      await userEvent.click(screen.getByRole('button', { name: /confirmar reagendamento/i }))

      expect(screen.getByRole('alert')).toHaveTextContent('Escolha uma data e horário futuros.')
      expect(actions.reschedule).not.toHaveBeenCalled()
    })
  })

  it('doação que não está pendente não tem nenhuma ação', () => {
    renderCard({ donationPending: false })

    expect(screen.queryByRole('button')).toBeNull()
  })
})
