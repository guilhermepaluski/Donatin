using Donatin.Domain.Entities;

namespace Donatin.Domain.Interfaces.Repositories;

public interface IScheduleRepository
{
  Task<Schedule?> GetScheduleByIdAsync(Guid id);
  Task<Schedule?> GetScheduleByDonationIdAsync(Guid donationId);
  Task<IEnumerable<Schedule>> GetScheduleByParticipantAsync(Guid userId);
  Task AddAsync(Schedule schedule);
  Task SaveChangesAsync();
}