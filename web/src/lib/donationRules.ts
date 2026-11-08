import type { Campaign } from "../types";

export function donationBlockedReason(c: Campaign, userId?: string): string | null {
  if (!c.isActive)
    return 'Esta campanha foi encerrada.'
  if (c.hasExpired)
    return 'O prazo desta campanha terminou.'
  if (c.isGoalReached)
    return 'Esta campanha já atingiu a meta.'
  if (userId && c.userId === userId)
    return 'Você não pode doar para a sua própria campanha.'

  return null
  }