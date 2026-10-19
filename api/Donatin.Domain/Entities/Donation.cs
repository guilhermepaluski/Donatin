using System.Text.RegularExpressions;
using Donatin.Domain.Enums;

namespace Donatin.Domain.Entities;

public class Donation
{
  public Guid Id { get; private set; }
  public decimal Quantity { get; private set; }
  public string? Notes { get; private set; } = string.Empty;
  public DonationMethod DonationMethod { get; private set; }
  public string? DonorCep { get; private set; }
  public string? DonorStreet { get; private set; }
  public string? DonorNeighborhood { get; private set; }
  public string? DonorNumber { get; private set; }
  public string? DonorComplement { get; private set; }
  public DonationStatus Status { get; private set; }
  public DateTime DonatedAt { get; private set; }
  public bool IsAnonymous { get; private set; }

  // FK User + FK Campaign
  public Guid UserId { get; private set; }
  public User? User { get; private set; }
  public Guid CampaignId { get; private set; }
  public Campaign? Campaign { get; private set; }

  // Construtor privado para o EF Core / ORM
  private Donation()
  { }

  // construtor
  public Donation(decimal quantity, string? notes, DonationMethod donationMethod, string? donorCep, string? donorStreet, string? donorNeighborhood, string? donorNumber, string? donorComplement, Guid userId, Guid campaignId, bool isAnonymous = false)
  {
    QuantityBiggerThanZero(quantity);
    ValidateDonorAddress(donationMethod, donorCep, donorStreet, donorNeighborhood, donorNumber);

    Id = Guid.NewGuid();
    Quantity = quantity;
    Notes = notes;
    DonationMethod = donationMethod;
    DonatedAt = DateTime.UtcNow;
    Status = DonationStatus.Pendente;
    IsAnonymous = isAnonymous;
    UserId = userId;
    CampaignId = campaignId;

    SetDonorAddress(donationMethod, donorCep, donorStreet, donorNeighborhood, donorNumber, donorComplement);
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

  private static bool NeedsDonorAddress(DonationMethod method) =>
    method is DonationMethod.Coleta;

  private static void ValidateDonorAddress(DonationMethod method, string? donorCep, string? donorStreet, string? donorNeighborhood, string? donorNumber)
  {
    if (!NeedsDonorAddress(method)) return;

    if (string.IsNullOrWhiteSpace(donorStreet) || string.IsNullOrWhiteSpace(donorNeighborhood) || string.IsNullOrWhiteSpace(donorNumber))
    {
        throw new ArgumentException("Informe a rua, o bairro e o número do endereço de retirada.");
    }

    if (donorCep == null || !Regex.IsMatch(donorCep, @"^\d{8}$"))
    {
      throw new ArgumentException("Informe o CEP do endereço de retirada (8 dígitos).");
    }
  }

  private void SetDonorAddress(DonationMethod method, string? donorCep, string? donorStreet, string? donorNeighborhood, string? donorNumber, string? donorComplement)
  {
    var methodSelected = NeedsDonorAddress(method);
    DonorCep = methodSelected ? donorCep : null;
    DonorStreet = methodSelected ? donorStreet?.Trim() : null;
    DonorNeighborhood = methodSelected ? donorNeighborhood?.Trim() : null;
    DonorNumber = methodSelected ? donorNumber?.Trim() : null;
    DonorComplement = methodSelected ? donorComplement?.Trim() : null;
  }
}