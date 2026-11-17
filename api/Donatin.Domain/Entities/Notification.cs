using Donatin.Domain.Enums;

namespace Donatin.Domain.Entities;

public class Notification
{
  public Guid Id { get; private set; }
  public NotificationType Type { get; private set; }
  public string Content { get; private set; } = string.Empty;
  public bool Read { get; private set; }
  public DateTime CreatedAt { get; private set; }

  // FKs
  public Guid UserId { get; private set; } // recipient
  public User? User { get; private set; }
  public Guid DonationId { get; private set; }
  public Donation? Donation { get; private set; }

  private Notification() { }

  public Notification(NotificationType type, string content, Guid userId, Guid donationId)
  {
    if (string.IsNullOrWhiteSpace(content))
      throw new ArgumentException("O conteúdo da notificação é obrigatório.");

    Id = Guid.NewGuid();
    Type = type;
    Content = content.Trim();
    Read = false;
    CreatedAt = DateTime.UtcNow;
    UserId = userId;
    DonationId = donationId;
  }

  public void MarkAsRead()
  {
    Read = true;
  }
}