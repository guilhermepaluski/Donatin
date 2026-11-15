using System.ComponentModel.DataAnnotations;

namespace Donatin.Api.DTOs.ScheduleDTOs;

public record ScheduleCreateDTO
{
  [Required(ErrorMessage = "A doação é obrigatória.")]
  public Guid DonationId { get; set; }

  [Required(ErrorMessage = "A data e o horário são obrigatórios.")]
  public DateTime ScheduleDate { get; set; }
}