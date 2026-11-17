using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Infrastructure.Repositories;

public class NotificationRepository : INotificationRepository
{
  private const int LimitView = 50;
  private readonly AppDbContext _context;

  public NotificationRepository(AppDbContext context)
  {
    _context = context;
  }

  public async Task<Notification?> GetNotificationByIdAsync(Guid id)
  {
    return await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id);
  }

  public async Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(Guid userId)
  {
    return await _context.Notifications
      .Where(n => n.UserId == userId)
      .OrderByDescending(n => n.CreatedAt)
      .Take(LimitView)
      .ToListAsync();
  }

  public async Task<IEnumerable<Notification>> GetUnreadNotificationsByUserIdAsync(Guid userId)
  {
    return await _context.Notifications
      .Where(n => n.UserId == userId && n.Read == false)
      .ToListAsync();
  }

  public async Task<int> CountUnreadAsync(Guid userId)
  {
    return await _context.Notifications.CountAsync(n => n.UserId == userId && n.Read == false);
  }

  public async Task AddAsync(Notification notification)
  {
    await _context.Notifications.AddAsync(notification);
  }

  public async Task SaveChangesAsync()
  {
    await _context.SaveChangesAsync();
  }
}