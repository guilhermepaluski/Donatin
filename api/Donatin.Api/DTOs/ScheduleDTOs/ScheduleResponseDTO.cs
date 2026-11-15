using Donatin.Domain.Entities;
using Donatin.Domain.Enums;

namespace Donatin.Api.DTOs.ScheduleDTOs;

public class ScheduleResponseDTO
{
  public Guid Id { get; set; }
  public DateTime ScheduleDate { get; set; }
  public ScheduleStatus Status { get; set; }
  public string? CancellationReason { get; set; }
  public DateTime CreatedAt { get; set; }
  public string ViewerRole { get; set; } = string.Empty;

  public Guid DonationId { get; set; }
  public DonationMethod DonationMethod { get; set; }
  public DonationStatus DonationStatus { get; set; }
  public decimal Quantity { get; set; }
  public string? DonorName { get; set; }
  
  public Guid CampaignId { get; set; }
  public string? CampaignTitle { get; set; }
  public string? CampaignOwnerName { get; set; }

  public static ScheduleResponseDTO FromEntity(Schedule s, Guid viewerId)
  {
    var donation = s.Donation!;
    var campaign = donation.Campaign;
    var isDonor = donation.UserId == viewerId;
    var anonymousDonor = donation.IsAnonymous && !isDonor;

    return new ScheduleResponseDTO
    {
      Id = s.Id,
      ScheduleDate = s.ScheduleDate,
      Status = s.Status,
      CancellationReason = s.CancellationReason,
      CreatedAt = s.CreatedAt,
      ViewerRole = isDonor ? "Donor" : "Owner",

      DonationId = donation.Id,
      DonationMethod = donation.DonationMethod,
      DonationStatus = donation.Status,
      Quantity = donation.Quantity,
      DonorName = anonymousDonor ? null : donation.User?.Name,
      CampaignId = donation.CampaignId,
      CampaignTitle = campaign?.Title,
      CampaignOwnerName = campaign?.User?.Name
    };
  }
}