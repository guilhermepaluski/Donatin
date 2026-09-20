using Donatin.Domain.Entities;
using Donatin.Domain.Enums;

namespace Donatin.Api.DTOs.DonationDTOs;

public class DonationResponseDTO
{
  public Guid Id { get; set; }
  public decimal Quantity { get; set; }
  public string? Notes { get; set; }
  public DateTime DonatedAt { get; set; }
  public DonationStatus Status { get; set; }
  public Guid UserId { get; set; }
  public string? DonorName { get; set; }       // só vem preenchido se o User foi carregado (Include)
  public Guid CampaignId { get; set; }
  public string? CampaignTitle { get; set; }   // só vem preenchido se a Campaign foi carregada (Include)

  public static DonationResponseDTO FromEntity(Donation donation)
  {
    return new DonationResponseDTO
    {
      Id = donation.Id,
      Quantity = donation.Quantity,
      Notes = donation.Notes,
      DonatedAt = donation.DonatedAt,
      Status = donation.Status,
      UserId = donation.UserId,
      DonorName = donation.User?.Name,
      CampaignId = donation.CampaignId,
      CampaignTitle = donation.Campaign?.Title
    };
  }
}