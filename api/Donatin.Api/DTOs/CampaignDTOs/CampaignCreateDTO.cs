using System.ComponentModel.DataAnnotations;
using Donatin.Domain.Enums;

namespace Donatin.Api.DTOs.CampaignDTOs;

public record CampaignCreateDTO
{
  [Required(ErrorMessage = "O título da campanha é obrigatório.")]
  [StringLength(100, MinimumLength = 3, ErrorMessage = "O título deve ter entre 3 e 100 caracteres.")]
  public string Title { get; set; } = string.Empty;

  [Required(ErrorMessage = "A descrição da campanha é obrigatória.")]
  [StringLength(2000, ErrorMessage = "A descrição não deve exceder 2000 caracteres.")]
  public string Description { get; set; } = string.Empty;

  [Required(ErrorMessage = "A categoria da campanha é obrigatória")]
  public CampaignCategory Category { get; set; }

  [Required(ErrorMessage = "O produto da campanha é obrigatório.")]
  [StringLength(50, MinimumLength = 3, ErrorMessage = "A descrição deve ter entre 3 e 50 caracteres.")]
  public string Product { get; set; } = string.Empty;

  [Range(0.01, double.MaxValue, ErrorMessage = "A meta arrecadada deve ser maior que zero.")]
  public decimal GoalAmount { get; set; }

  [Required(ErrorMessage = "A forma de recebimento/entrega do produto é obrigatória.")]
  public ReceiveOption ReceiveOption { get; set; }

  [Required(ErrorMessage = "A data de encerramento da campanha é obrigatória.")]
  public DateTime ConclusionDate { get; set; }

  public string? ImageUrl { get; set; }
}