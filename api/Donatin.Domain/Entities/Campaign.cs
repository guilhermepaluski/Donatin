using Donatin.Domain.Enums;
using System.Text.RegularExpressions;

namespace Donatin.Domain.Entities;

public class Campaign
{
  public Guid Id { get; private set; }
  public string Title { get; private set; } = string.Empty;
  public string Description { get; private set; } = string.Empty;
  public CampaignCategory Category { get; private set; }
  public string Product { get; private set; } = string.Empty;
  public decimal GoalAmount { get; private set; }
  public decimal CurrentAmount { get; private set; }
  public ReceiveOption ReceiveOption { get; private set; }
  public string? ImageUrl { get; private set; }
  public bool IsActive { get; private set; }
  public DateTime CreatedAt { get; private set; }
  public DateTime ConclusionDate { get; private set; }
  
  // endereço de entrega (opcional: só é exigido quando a campanha recebe por Entrega)
  public string? DeliveryCep { get; private set; }
  public string? DeliveryStreet { get; private set; }
  public string? DeliveryNeighborhood { get; private set; }
  public string? DeliveryNumber { get; private set; }
  public string? DeliveryComplement { get; private set; }
  
  // propriedades CALCULADAS (não vão para o banco)
  public bool IsGoalReached => CurrentAmount >= GoalAmount;
  public bool HasExpired => DateTime.UtcNow > ConclusionDate;

  // User FK
  public Guid UserId { get; private set; }
  public User? User { get; private set; }

  private Campaign()
  { }

  // construtor real
  public Campaign(string title, string description, CampaignCategory category, string product, decimal goalAmount, ReceiveOption receiveOption, Guid userId, string? imageUrl, DateTime conclusionDate, string? deliveryCep = null, string? deliveryStreet = null, string? deliveryNeighborhood = null, string? deliveryNumber = null, string? deliveryComplement = null)
  {
    ValidateTitle(title);
    GoalBiggerThanZero(goalAmount);
    ConclusionDateInTheFuture(conclusionDate);
    ValidateDeliveryAddress(receiveOption, deliveryCep, deliveryStreet, deliveryNeighborhood, deliveryNumber);

    Id = Guid.NewGuid();
    Title = title;
    Description = description;
    Category = category;
    Product = product;
    GoalAmount = goalAmount;
    CurrentAmount = 0;
    ReceiveOption = receiveOption;
    UserId = userId;
    ImageUrl = string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl.Trim();
    IsActive = true;
    CreatedAt = DateTime.UtcNow;
    ConclusionDate = conclusionDate;
    
    SetDeliveryAddress(receiveOption, deliveryCep, deliveryStreet, deliveryNeighborhood, deliveryNumber, deliveryComplement);
  }

  public void AddDonation(decimal amount)
  {
    if (!IsActive || HasExpired) // se a campanha não estiver mais ativa OU se já expirou
    {
      throw new InvalidOperationException("Não é possível doar para uma campanha inativa.");
    }

    if (amount <= 0) // se a doação for negativa
    {
      throw new ArgumentException("A quantidade doada deve ser positiva.", nameof(amount));
    }

    CurrentAmount += amount;
  }

  public void UpdateCampaign(string title, string description, string? imageUrl, CampaignCategory category, string product, decimal goalAmount, ReceiveOption receiveOption, DateTime conclusionDate, string? deliveryCep = null, string? deliveryStreet = null, string? deliveryNeighborhood = null, string? deliveryNumber = null, string? deliveryComplement = null)
  {
    if (!IsActive) // se a campanha não estiver mais ativa
    {
      throw new InvalidOperationException("Não é possível editar uma campanha inativa.");
    }

    ValidateTitle(title);
    GoalBiggerThanZero(goalAmount);
    GoalBiggerThanCurrentAmount(goalAmount, CurrentAmount);
    ConclusionDateInTheFuture(conclusionDate);
    ValidateDeliveryAddress(receiveOption, deliveryCep, deliveryStreet, deliveryNeighborhood, deliveryNumber);

    Title = title;
    Description = description;
    ImageUrl = string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl.Trim();
    Category = category;
    Product = product;
    GoalAmount = goalAmount;
    ReceiveOption = receiveOption;
    ConclusionDate = conclusionDate;

    SetDeliveryAddress(receiveOption, deliveryCep, deliveryStreet, deliveryNeighborhood, deliveryNumber, deliveryComplement);
  }

  public void CloseCampaign()
  {
    IsActive = false;
  }

  private static void ValidateTitle(string title)
  {
    if (string.IsNullOrWhiteSpace(title))
    {
      throw new ArgumentException("O título é obrigatório.", nameof(title));
    }
  }

  private static void GoalBiggerThanZero(decimal goalAmount)
  {
    if (goalAmount <= 0)
    {
      throw new ArgumentException("A meta arrecadada deve ser maior que zero.", nameof(goalAmount));
    }
  }

  private static void GoalBiggerThanCurrentAmount(decimal goalAmount, decimal CurrentAmount)
  {
    if (goalAmount < CurrentAmount)
    {
      throw new ArgumentException("A nova meta não pode ser menor que o valor já arrecadado.", nameof(goalAmount));
    }
  }

  private static void ConclusionDateInTheFuture(DateTime conclusionDate)
  {
    if (conclusionDate < DateTime.UtcNow)
    {
      throw new ArgumentException("A data de conclusão da campanha deve ser futura.", nameof(conclusionDate));
    }
  }

  private static bool NeedsDeliveryAddress(ReceiveOption option) =>
    option is ReceiveOption.Entrega or ReceiveOption.ColetaOuEntrega;
  
  private static void ValidateDeliveryAddress(ReceiveOption option, string? cep, string? street, string? neighborhood, string? number)
  {
    if (!NeedsDeliveryAddress(option)) return;

    if (string.IsNullOrWhiteSpace(street) || string.IsNullOrWhiteSpace(neighborhood) || string.IsNullOrWhiteSpace(number))
    {
        throw new ArgumentException("Informe a rua, o bairro e o número completos.");
    }

    if (cep == null || !Regex.IsMatch(cep, @"^\d{8}$"))
    {
      throw new ArgumentException("Informe o CEP do endereço de entrega (8 dígitos).");
    }
  }

  // só guarda o endereço quando a campanha precisa informar (LGPD)
  private void SetDeliveryAddress(ReceiveOption option, string? cep, string? street, string? neighborhood, string? number, string? complement)
  {
    var optionSelected = NeedsDeliveryAddress(option);
    DeliveryCep = optionSelected ? cep : null;
    DeliveryStreet = optionSelected ? street?.Trim() : null;
    DeliveryNeighborhood = optionSelected ? neighborhood?.Trim() : null;
    DeliveryNumber = optionSelected ? number?.Trim() : null;
    DeliveryComplement = optionSelected ? complement?.Trim() : null;
  }
}
