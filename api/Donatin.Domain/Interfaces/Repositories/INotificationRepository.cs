using Donatin.Domain.Entities;

namespace Donatin.Domain.Interfaces.Repositories;

public interface INotificationRepository
{
  Task<Notification?> GetNotificationByIdAsync(Guid id);
  Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(Guid userId);
  Task<IEnumerable<Notification>> GetUnreadNotificationsByUserIdAsync(Guid userId);
  Task<int> CountUnreadAsync(Guid userId);
  Task AddAsync(Notification notification);
  Task SaveChangesAsync();
}