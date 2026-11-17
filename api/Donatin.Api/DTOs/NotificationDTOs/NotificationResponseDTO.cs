using Donatin.Domain.Entities;
using Donatin.Domain.Enums;

namespace Donatin.Api.DTOs.NotificationDTOs;

public class NotificationResponseDTO
{
  public Guid Id { get; set; }
  public NotificationType Type { get; set; }
  public string Content { get; set; } = string.Empty;
  public bool Read { get; set; }
  public DateTime CreatedAt { get; set; }
  // FK
  public Guid DonationId { get; set; }

  public static NotificationResponseDTO FromEntity(Notification n)
  {
    return new NotificationResponseDTO
    {
      Id = n.Id,
      Type = n.Type,
      Content = n.Content,
      Read = n.Read,
      CreatedAt = n.CreatedAt,
      DonationId = n.DonationId,
    };
  }
}