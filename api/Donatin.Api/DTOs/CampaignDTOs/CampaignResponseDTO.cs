using Donatin.Domain.Enums;
using Donatin.Domain.Entities;

namespace Donatin.Api.DTOs.CampaignDTOs;

public class CampaignResponseDTO
{
  public Guid Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public CampaignCategory Category { get; set; }
  public string Product { get; set; } = string.Empty;
  public decimal GoalAmount { get; set; }
  public decimal CurrentAmount { get; set; }
  public bool IsGoalReached { get; set; }
  public ReceiveOption ReceiveOption { get; set; }
  public string? ImageUrl { get; set; }
  public bool IsActive { get; set; }
  public bool HasExpired { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime ConclusionDate { get; set; }
  public Guid UserId { get; set; }
  public string? DeliveryNeighborhood { get; set; }
  public string? OwnerName { get; set; }
  public string? OwnerNeighborhood { get; set; }
  public string? OwnerCity { get; set; }
  public string? OwnerUf { get; set; }


  public static CampaignResponseDTO FromEntity(Campaign campaign)
  {
    // é o que volta (retorno) no POSTMAN ao dar GET
    return new CampaignResponseDTO
    {
      Id = campaign.Id,
      Title = campaign.Title,
      Description = campaign.Description,
      Category = campaign.Category,
      Product = campaign.Product,
      GoalAmount = campaign.GoalAmount,
      CurrentAmount = campaign.CurrentAmount,
      IsGoalReached = campaign.IsGoalReached,
      ReceiveOption = campaign.ReceiveOption,
      ImageUrl = campaign.ImageUrl,
      IsActive = campaign.IsActive,
      HasExpired = campaign.HasExpired,
      CreatedAt = campaign.CreatedAt,
      ConclusionDate = campaign.ConclusionDate,
      UserId = campaign.UserId,
      DeliveryNeighborhood = campaign.DeliveryNeighborhood, // só retorna o bairro da campanha
      OwnerName = campaign.User?.Name,
      OwnerNeighborhood = campaign.User?.Neighborhood,
      OwnerCity = campaign.User?.City,
      OwnerUf = campaign.User?.Uf,
    };
  }
}