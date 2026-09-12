using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Donatin.Infrastructure.Repositories;

public class CampaignRepository : ICampaignRepository
{
  private readonly AppDbContext _context;

  public CampaignRepository(AppDbContext context)
  {
    _context = context; // armazenando a referencia do DbContext
  }

  public async Task<Campaign?> GetCampaignByIdAsync(Guid id)
  {
    return await _context.Campaigns
      .Include(c => c.User)
      .FirstOrDefaultAsync(c => c.Id == id);
  }

  public async Task<IEnumerable<Campaign>> GetCampaignByUserIdAsync(Guid userId)
  {
    return await _context.Campaigns
      .Where(c => c.UserId == userId)
      .OrderByDescending(c => c.CreatedAt)
      .ToListAsync();
  }

  public async Task<IEnumerable<Campaign>> SearchActiveAsync(CampaignCategory? category, string? keyword)
  {
    var query = _context.Campaigns
      .Include(c => c.User)
      .Where(c => c.IsActive && c.ConclusionDate > DateTime.UtcNow);
      
    if (category.HasValue)
    {
      query = query.Where(c => c.Category == category);
    }

    if (!string.IsNullOrEmpty(keyword))
    {
      var lowerKeyword = keyword.ToLower();
      query = query.Where(c => c.Title.ToLower().Contains(lowerKeyword) ||
                               c.Description.ToLower().Contains(lowerKeyword));
    }

    return await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
  }

  public async Task AddAsync(Campaign campaign)
  {
    await _context.Campaigns.AddAsync(campaign);
    await _context.SaveChangesAsync();
  }

  public async Task UpdateAsync(Campaign campaign)
  {
    _context.Campaigns.Update(campaign);
    await _context.SaveChangesAsync();
  }

  public async Task SaveChangesAsync()
  {
    await _context.SaveChangesAsync();
  }
}
