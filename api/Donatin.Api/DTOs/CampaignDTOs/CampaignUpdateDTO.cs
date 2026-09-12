using System.ComponentModel.DataAnnotations;

namespace Donatin.Api.DTOs.CampaignDTOs;

public record CampaignUpdateDTO
{
  [Required(ErrorMessage = "O título da campanha é obrigatório.")]
  [StringLength(100, MinimumLength = 3, ErrorMessage = "O título deve ter entre 3 e 100 caracteres.")]
  public string? Title { get; set; }

  [Required(ErrorMessage = "A descrição é obrigatória.")]
  [StringLength(2000, ErrorMessage = "A descrição não deve exceder 2000 caracteres.")]
  public string? Description { get; set; }

  public string? ImageUrl { get; set; }
}