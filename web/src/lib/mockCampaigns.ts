import type { Campaign } from '../types'

// PROVISÓRIO: dados de exemplo. Serão trocados pela API (GET /campaigns).
const base: Campaign = {
  id: '', title: '', description: '', category: 'Roupas', product: 'peças', goalAmount: 100, currentAmount: 0,
  isGoalReached: false, receiveOption: 'ColetaOuEntrega', imageUrl: null, isActive: true, hasExpired: false,
  createdAt: '2026-10-01T00:00:00Z', conclusionDate: '2026-11-30T00:00:00Z', userId: '',
  deliveryNeighborhood: null, ownerCampaignName: 'ONG Exemplo', ownerCampaignCity: 'Joinville', ownerCampaignUf: 'SC',
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  { ...base, id: '1', title: 'Agasalhos para o inverno', category: 'Roupas', product: 'agasalhos', goalAmount: 80, currentAmount: 32 },
  { ...base, id: '2', title: 'Ração para o abrigo de animais', category: 'Animais', product: 'kg de ração', goalAmount: 200, currentAmount: 150 },
  { ...base, id: '3', title: 'Material escolar para 40 crianças', category: 'Educacao', product: 'kits', goalAmount: 40, currentAmount: 5 },
  { ...base, id: '4', title: 'Kits de higiene para moradores de rua', category: 'Higiene', product: 'kits', goalAmount: 60, currentAmount: 18 },
  { ...base, id: '5', title: 'Brinquedos para o Natal solidário', category: 'Lazer', product: 'brinquedos', goalAmount: 120, currentAmount: 90 },
  { ...base, id: '6', title: 'Cobertores para a campanha do frio', category: 'Roupas', product: 'cobertores', goalAmount: 50, currentAmount: 10 },
]