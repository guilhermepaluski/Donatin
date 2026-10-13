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
  public bool IsAnonymous { get; set; }
  public Guid? UserId { get; set; }
  public string? DonorName { get; set; }                 // só vem preenchido se o User foi carregado (Include)
  public Guid CampaignId { get; set; }
  public string? CampaignTitle { get; set; }
  public string? CampaignOwnerName { get; set; }
  public string? CampaignOwnerPhone { get; set; }
  public string? CampaignDeliveryAddress { get; set; }

  private static string? BuildDeliveryAddress(Campaign? c)
  {
    if (c is null || string.IsNullOrWhiteSpace(c.DeliveryStreet)) return null;

    return string.Join(" - ", new[]
    {
      string.Join(", ", new[] { c.DeliveryStreet, c.DeliveryNumber }.Where(s => !string.IsNullOrWhiteSpace(s))),
      c.DeliveryComplement,
      c.DeliveryNeighborhood,
      c.User is null ? null : $"{c.User.City}/{c.User.Uf}"
    }.Where(s => !string.IsNullOrWhiteSpace(s)));
  }

  public static DonationResponseDTO FromEntity(Donation donation, Guid viewerId)
  {
    var campaign = donation.Campaign;
    var pending = donation.Status == DonationStatus.Pendente;

    var anonymousDonor = donation.IsAnonymous && donation.UserId != viewerId;

    return new DonationResponseDTO
    {
      Id = donation.Id,
      Quantity = donation.Quantity,
      Notes = donation.Notes,
      DonatedAt = donation.DonatedAt,
      Status = donation.Status,
      IsAnonymous = donation.IsAnonymous,
      UserId = anonymousDonor ? null : donation.UserId,
      DonorName = anonymousDonor ? null : donation.User?.Name,
      CampaignId = donation.CampaignId,
      CampaignTitle = campaign?.Title,

      CampaignOwnerName = campaign?.User?.Name,
      CampaignOwnerPhone = pending ? campaign?.User?.Phone : null,
      CampaignDeliveryAddress = BuildDeliveryAddress(campaign)
    };
  }
}