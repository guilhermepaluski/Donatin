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
}