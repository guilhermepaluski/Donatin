import { describe, expect, it } from 'vitest'
import { donationBlockedReason } from './donationRules'
import type { Campaign } from '../types'

const campaign = (over: Partial<Campaign> = {}): Campaign => ({
  id: 'c1', title: 'Agasalhos', description: '', category: 'Roupas', product: 'agasalhos',
  goalAmount: 10, currentAmount: 0, isGoalReached: false, receiveOption: 'Coleta', imageUrl: null,
  isActive: true, hasExpired: false, createdAt: '', conclusionDate: '', userId: 'dono',
  ownerCampaignName: null, ownerCampaignCity: null, ownerCampaignUf: null, campaignDeliveryAddress: null,
  ...over,
} as Campaign)

describe('donationBlockedReason', () => {
  it('libera a doação em campanha ativa de outra pessoa', () => {
    expect(donationBlockedReason(campaign(), 'doador')).toBeNull()
  })
  it('bloqueia campanha encerrada', () => {
    expect(donationBlockedReason(campaign({ isActive: false }), 'doador')).toMatch(/encerrada/)
  })
  it('bloqueia campanha expirada', () => {
    expect(donationBlockedReason(campaign({ hasExpired: true }), 'doador')).toMatch(/prazo/)
  })
  it('bloqueia campanha que já atingiu a meta', () => {
    expect(donationBlockedReason(campaign({ isGoalReached: true }), 'doador')).toMatch(/meta/)
  })
  it('bloqueia doar para a própria campanha', () => {
    expect(donationBlockedReason(campaign(), 'dono')).toMatch(/própria/)
  })
})
