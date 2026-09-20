using Donatin.Domain.Interfaces.Repositories;
using Donatin.Domain.Entities;
using Donatin.Infrastructure.Data;
using Donatin.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Infrastructure.Repositories;

public class DonationRepository : IDonationRepository
{
  private readonly AppDbContext _context;

  public DonationRepository(AppDbContext context)
  {
    _context = context;
  }

  public async Task<Donation?> GetDonationByIdAsync(Guid id)
  {
    return await _context.Donations
      .Include(d => d.User)
      .Include(d => d.Campaign)
      .FirstOrDefaultAsync(d => d.Id == id);
  }

  public async Task<IEnumerable<Donation>> GetDonationByStatusAsync(DonationStatus status)
  {
    return await _context.Donations
      .Where(d => d.Status == status)
      .OrderByDescending(d => d.DonatedAt)
      .ToListAsync();
  }

  public async Task<IEnumerable<Donation>> GetDonationByUserIdAsync(Guid userId)
  {
    return await _context.Donations
      .Include(d => d.Campaign)
      .Where(d => d.UserId == userId)
      .OrderByDescending(d => d.DonatedAt)
      .ToListAsync();
  }

  public async Task<IEnumerable<Donation>> GetDonationByCampaignIdAsync(Guid campaignId)
  {
    return await _context.Donations
      .Include(d => d.Campaign)
      .Where(d => d.CampaignId == campaignId)
      .OrderByDescending(d => d.DonatedAt)
      .ToListAsync();
  }

  public async Task AddAsync(Donation donation)
  {
    await _context.Donations.AddAsync(donation);
    await _context.SaveChangesAsync();
  }
  
  public async Task UpdateAsync(Donation donation)
  {
    _context.Donations.Update(donation);
    await _context.SaveChangesAsync();
  }
  
  public async Task SaveChangesAsync()
  {
    await _context.SaveChangesAsync();
  }
}