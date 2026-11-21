import { describe, expect, it } from 'vitest'
import { CATEGORIES, categoryLabel, RECEIVE_LABELS } from '../campaignsEnums'
import { STATUS, STATUS_LIST } from '../donationsEnums'
import type { CampaignCategory } from '../../types'

describe('campaignsEnums', () => {
  it('tem as 5 categorias da API', () => {
    expect(CATEGORIES.map(c => c.value)).toEqual(['Animais', 'Educacao', 'Roupas', 'Higiene', 'Lazer'])
  })

  it('categoryLabel mostra o nome com acento', () => {
    expect(categoryLabel('Educacao')).toBe('Educação')
  })

  it('categoryLabel devolve o próprio valor se a API mandar uma categoria nova', () => {
    expect(categoryLabel('Brinquedos' as CampaignCategory)).toBe('Brinquedos')
  })

  it('RECEIVE_LABELS traduz a opção combinada', () => {
    expect(RECEIVE_LABELS.ColetaOuEntrega).toBe('Coleta ou Entrega')
  })
})

describe('donationsEnums', () => {
  it('STATUS_LIST tem todos os status da doação', () => {
    expect(STATUS_LIST).toEqual(['Pendente', 'Concluida', 'Cancelada', 'Expirada'])
  })

  it('STATUS mostra "Concluída" com acento', () => {
    expect(STATUS.Concluida.label).toBe('Concluída')
  })
})
