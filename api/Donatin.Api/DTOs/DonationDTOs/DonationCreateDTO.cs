using System.ComponentModel.DataAnnotations;
using Donatin.Domain.Enums;

namespace Donatin.Api.DTOs.DonationDTOs;

public record DonationCreateDTO
{
  public Guid CampaignId { get; set; }

  [StringLength(400, ErrorMessage = "A anotação não deve exceder 400 caracteres.")]
  public string Notes { get; set; } = string.Empty;

  [Required(ErrorMessage = "A quantidade doada é obrigatória.")]
  [Range(0.01, double.MaxValue, ErrorMessage = "O valor da doação deve ser maior que zero.")]
  public decimal Quantity { get; set; }

  public DonationMethod? DonationMethod { get; set; }

  [RegularExpression(@"^\d{8}$", ErrorMessage = "O CEP deve conter exatamente 8 dígitos.")]
  public string? DonorCep { get; set; }

  public string? DonorStreet { get; set; }

  public string? DonorNeighborhood { get; set; }

  public string? DonorNumber { get; set; }
  
  public string? DonorComplement { get; set; }

  public bool IsAnonymous { get; set; }
}