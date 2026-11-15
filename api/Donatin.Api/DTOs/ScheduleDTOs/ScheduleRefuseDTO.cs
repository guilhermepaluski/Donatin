using System.ComponentModel.DataAnnotations;

namespace Donatin.Api.DTOs.ScheduleDTOs;

public record ScheduleRefuseDTO
{
  [StringLength(400, ErrorMessage = "A justificativa não deve exceder 400 caracteres.")]
  public string? Reason { get; set; }
}