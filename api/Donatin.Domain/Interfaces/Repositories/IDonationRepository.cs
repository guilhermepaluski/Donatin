using Donatin.Domain.Enums;
using Donatin.Domain.Entities;

namespace Donatin.Domain.Interfaces.Repositories;

public interface IDonationRepository
{
  Task<Donation?> GetDonationByIdAsync(Guid id);
  Task<IEnumerable<Donation>> GetDonationByStatusAsync(DonationStatus status);
  Task<IEnumerable<Donation>> GetDonationByUserIdAsync(Guid userId);
  Task<IEnumerable<Donation>> GetDonationByCampaignIdAsync(Guid campaignId);
  Task AddWithScheduleAsync(Donation donation, Schedule schedule); // doação + agendamento na mesma transação
  Task UpdateAsync(Donation donation);
  Task SaveChangesAsync();
}