using Donatin.Domain.Enums;

namespace Donatin.Domain.Entities;

public class Donation
{
  public Guid Id { get; private set; }
  public decimal Quantity { get; private set; }
  public string? Notes { get; private set; } = string.Empty;
  public DateTime DonatedAt { get; private set; }
  public DonationStatus Status { get; private set; }

  // FK User + FK Campaign
  public Guid UserId { get; private set; }
  public User? User { get; private set; }
  public Guid CampaignId { get; private set; }
  public Campaign? Campaign { get; private set; }

  // Construtor privado para o EF Core / ORM
  private Donation()
  { }

  // construtor
  public Donation(decimal quantity, string? notes, Guid userId, Guid campaignId)
  {
    QuantityBiggerThanZero(quantity);

    Id = Guid.NewGuid();
    Quantity = quantity;
    Notes = notes;
    DonatedAt = DateTime.UtcNow;
    Status = DonationStatus.Pendente;
    UserId = userId;
    CampaignId = campaignId;
  }

  // RF20: o receptor confirmou que recebeu o item
  public void ConfirmDonation()
  {
    EnsurePending("confirmar");
    Status = DonationStatus.Concluida;
  }

  public void CancelDonation()
  {
    EnsurePending("cancelar");
    Status = DonationStatus.Cancelada;
  }

  // RN07: só doações pendentes podem mudar de estado
  public void EnsurePending(string action)
  {
    if (Status != DonationStatus.Pendente)
    {
      throw new InvalidOperationException($"Não é possível {action} uma doação com status {Status}.");
    }
  }

  private static void QuantityBiggerThanZero(decimal quantity)
  {
    if (quantity <= 0)
    {
      throw new ArgumentException("A quantidade doada deve ser maior que zero.");
    }
  }
}