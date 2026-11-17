using Donatin.Api.DTOs.ScheduleDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Domain.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Donatin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SchedulesController : ControllerBase
{
  private readonly IScheduleRepository _scheduleRepository;
  private readonly IDonationRepository _donationRepository;
  private readonly INotificationRepository _notificationRepository;

  public SchedulesController(IScheduleRepository scheduleRepository, IDonationRepository donationRepository, INotificationRepository notificationRepository)
  {
    _scheduleRepository = scheduleRepository;
    _donationRepository = donationRepository;
    _notificationRepository = notificationRepository;
  }

  private Task Notify(Guid recipientId, Guid senderId, Guid donationId, NotificationType type, string content)
  {
    return recipientId == senderId
      ? Task.CompletedTask
      : _notificationRepository.AddAsync(new Notification(type, content, recipientId, donationId));
  }

  private bool TryGetUserId(out Guid userId)
  {
    var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    return Guid.TryParse(claim, out userId);
  }



  [HttpGet("mine")] // GET ALL my schedules as donor or owner (RF18)
  public async Task<ActionResult<IEnumerable<ScheduleResponseDTO>>> GetMySchedules()
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var schedules = await _scheduleRepository.GetScheduleByParticipantAsync(userId);
    return Ok(schedules.Select(s => ScheduleResponseDTO.FromEntity(s, userId)));
  }

  [HttpGet("donation/{donationId:guid}")] // GET schedules by donatioon
  public async Task<ActionResult<ScheduleResponseDTO>> GetSchedulesByDonation(Guid donationId)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var schedule = await _scheduleRepository.GetScheduleByDonationIdAsync(donationId);
    if (schedule == null)
      return NotFound(new { message = "Esta doação ainda não possui agendamento." });

    return Ok(ScheduleResponseDTO.FromEntity(schedule, userId));
  }

  [HttpPost] // POST new schedule — RF16
  public async Task<ActionResult<ScheduleResponseDTO>> NewSchedule([FromBody] ScheduleCreateDTO dto)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var donation = await _donationRepository.GetDonationByIdAsync(dto.DonationId);
    if (donation == null)
      return NotFound(new { message = "Doação não encontrada." });

    if (donation.UserId != userId)
      return StatusCode(403, new { message = "Apenas quem fez a doação pode propor um agendamento." });

    if (donation.Status != DonationStatus.Pendente)
      return BadRequest(new { message = "Só é possível agendar doações pendentes." });

    var existing = await _scheduleRepository.GetScheduleByDonationIdAsync(donation.Id);

    try
    {
      Guid scheduleId;

      await Notify(donation.Campaign!.UserId, userId, donation.Id, NotificationType.Reagendado, $"O doador escolheu uma nova data para a doação da campanha \"{donation.Campaign.Title}\".");

      if (existing == null)
      {
        var schedule = new Schedule(
          donation.Id,
          dto.ScheduleDate);

        await _scheduleRepository.AddAsync(schedule);
        scheduleId = schedule.Id;
      }
      else
      {
        existing.Reschedule(dto.ScheduleDate);
        await _scheduleRepository.SaveChangesAsync();
        scheduleId = existing.Id;
      }

      var created = await _scheduleRepository.GetScheduleByIdAsync(scheduleId);
      return Ok(ScheduleResponseDTO.FromEntity(created!, userId));
    }
    catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("{id:guid}/refuse")] // POST refuses the donor schedule — RF17/RN08
  public async Task<ActionResult<ScheduleResponseDTO>> RefuseDonorSchedule(Guid id, [FromBody(EmptyBodyBehavior = Microsoft.AspNetCore.Mvc.ModelBinding.EmptyBodyBehavior.Allow)] ScheduleRefuseDTO? dto)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var schedule = await _scheduleRepository.GetScheduleByIdAsync(id);
    if (schedule == null)
      return NotFound(new { message = "Agendamento não encontrado." });

    if (schedule.Donation!.Campaign!.UserId != userId)
      return StatusCode(403, new { message = "Apenas quem criou a campanha pode recusar o agendamento." });

    if (schedule.Donation.Status != DonationStatus.Pendente)
      return BadRequest(new { message = "Só é possível recusar o agendamento de uma doação pendente." });

    try
    {
      schedule.RefuseSchedule(dto?.Reason);

      var reason = string.IsNullOrWhiteSpace(dto?.Reason) ? "" : $" Motivo: {dto!.Reason.Trim()}";
      await Notify(schedule.Donation.UserId, userId, schedule.DonationId, NotificationType.ReagendamentoSolicitado, $"O dono da campanha \"{schedule.Donation.Campaign.Title}\" pediu outra data para a sua doação.{reason}");

      await _scheduleRepository.SaveChangesAsync();
      return Ok(ScheduleResponseDTO.FromEntity(schedule, userId));
    }
    catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
    {
      return BadRequest(new { message = ex.Message });
    }
  }
}