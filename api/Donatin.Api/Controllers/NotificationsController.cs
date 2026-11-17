using System.Security.Claims;
using Donatin.Api.DTOs.NotificationDTOs;
using Donatin.Domain.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Donatin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
  private readonly INotificationRepository _notificationRepository;

  public NotificationsController(INotificationRepository notificationRepository)
  {
    _notificationRepository = notificationRepository;
  }

  private bool TryGetUserId(out Guid userId)
  {
    var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    return Guid.TryParse(claim, out userId);
  }

  [HttpGet("mine")] // GET my notifications
  public async Task<ActionResult<IEnumerable<NotificationResponseDTO>>> GetMine()
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var notifications = await _notificationRepository.GetNotificationsByUserIdAsync(userId);

    return Ok(notifications.Select(NotificationResponseDTO.FromEntity));
  }

  [HttpGet("unread-count")] // GET non-read quantity (bell)
  public async Task<ActionResult<int>> GetUnreadCount()
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    return Ok(await _notificationRepository.CountUnreadAsync(userId));
  }

  [HttpPost("{id:guid}/read")] // POST reads a notification
  public async Task<IActionResult> MarkAsRead(Guid id)
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });
    
    var notification = await _notificationRepository.GetNotificationByIdAsync(id);
    if (notification == null)
      return NotFound(new { message = "Notificação não encontrada." });

    if (notification.UserId != userId)
      return StatusCode(403, new { message = "Você não tem permissão para alterar esta notificação." });

    notification.MarkAsRead();
    await _notificationRepository.SaveChangesAsync();
    
    return NoContent();
  }

  [HttpPost("read-all")] // POST reads all notifications
  public async Task<IActionResult> MarkAllAsRead()
  {
    if (!TryGetUserId(out var userId))
      return Unauthorized(new { message = "Usuário não autenticado." });

    var unread = await _notificationRepository.GetUnreadNotificationsByUserIdAsync(userId);

    foreach (var n in unread)
      n.MarkAsRead();

    await _notificationRepository.SaveChangesAsync();
    return NoContent();
  }
}