using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Infrastructure.Repositories;

public class ScheduleRepository : IScheduleRepository
{
  private readonly AppDbContext _context;

  public ScheduleRepository(AppDbContext context)
  {
    _context = context;
  }

  // method to load everything the DTO needs (doação, doador, campanha e dono)
  private IQueryable<Schedule> WithDetails() =>
    _context.Schedules
      .Include(s => s.Donation).ThenInclude(d => d!.User)
      .Include(s => s.Donation).ThenInclude(d => d!.Campaign).ThenInclude(c => c!.User);


  public async Task<Schedule?> GetScheduleByIdAsync(Guid id) =>
    await WithDetails().FirstOrDefaultAsync(s => s.Id == id);

  public async Task<Schedule?> GetScheduleByDonationIdAsync(Guid donationId) =>
    await WithDetails().FirstOrDefaultAsync(s => s.DonationId == donationId);

  public async Task<IEnumerable<Schedule>> GetScheduleByParticipantAsync(Guid userId) =>
    await WithDetails()
      .Where(s => s.Donation!.UserId == userId || s.Donation.Campaign!.UserId == userId)
      .OrderBy(s => s.ScheduleDate)
      .ToListAsync();

  public async Task AddAsync(Schedule schedule)
  {
    await _context.Schedules.AddAsync(schedule);
    await _context.SaveChangesAsync();
  }

  public async Task SaveChangesAsync()
  {
    await _context.SaveChangesAsync();
  }
}