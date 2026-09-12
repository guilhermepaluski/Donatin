using Donatin.Domain.Entities;
using Donatin.Domain.Enums;

namespace Donatin.Domain.Interfaces.Repositories;

public interface ICampaignRepository
{
  Task<Campaign?> GetCampaignByIdAsync(Guid id); // aqui o '?' existe porque pode retornar null
  Task<IEnumerable<Campaign>> GetCampaignByUserIdAsync(Guid userId);
  Task<IEnumerable<Campaign>> SearchActiveAsync(CampaignCategory? category, string? keyword); // aqui o '?' existe porque é anulável (permitindo buscar em todas as categorias, por exemplo)
  Task AddAsync(Campaign campaign);
  Task UpdateAsync(Campaign campaign);
  Task SaveChangesAsync();
}