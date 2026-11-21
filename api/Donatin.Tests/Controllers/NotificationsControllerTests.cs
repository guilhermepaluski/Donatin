using Donatin.Api.Controllers;
using Donatin.Api.DTOs.NotificationDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Donatin.Tests.Controllers;

public class NotificationsControllerTests
{
  private readonly Mock<INotificationRepository> _notifications = new();
  private readonly Guid _userId = Guid.NewGuid();

  private NotificationsController ControllerLoggedAs(Guid userId)
  {
    var controller = new NotificationsController(_notifications.Object);
    TestData.LoginAs(controller, userId);
    return controller;
  }

  private NotificationsController ControllerWithoutLogin()
  {
    var controller = new NotificationsController(_notifications.Object);
    TestData.LoginWithClaim(controller, null);
    return controller;
  }

  private static Notification NotificationFor(Guid userId) =>
    new(NotificationType.DoacaoRecebida, "Você recebeu uma doação.", userId, Guid.NewGuid());

  // ---------- sem login, todos os endpoints recusam ----------

  [Fact]
  public async Task TodosOsEndpoints_SemLogin_RetornamUnauthorized()
  {
    var controller = ControllerWithoutLogin();

    Assert.IsType<UnauthorizedObjectResult>((await controller.GetMine()).Result);
    Assert.IsType<UnauthorizedObjectResult>((await controller.GetUnreadCount()).Result);
    Assert.IsType<UnauthorizedObjectResult>(await controller.MarkAsRead(Guid.NewGuid()));
    Assert.IsType<UnauthorizedObjectResult>(await controller.MarkAllAsRead());
  }

  // ---------- GET /notifications/mine e /unread-count ----------

  [Fact]
  public async Task GetMine_RetornaAsNotificacoesDoUsuario()
  {
    _notifications.Setup(r => r.GetNotificationsByUserIdAsync(_userId))
      .ReturnsAsync([NotificationFor(_userId), NotificationFor(_userId)]);

    var result = await ControllerLoggedAs(_userId).GetMine();

    var list = Assert.IsAssignableFrom<IEnumerable<NotificationResponseDTO>>(Assert.IsType<OkObjectResult>(result.Result).Value);
    Assert.Equal(2, list.Count());
    Assert.All(list, n => Assert.False(n.Read));
  }

  [Fact]
  public async Task GetUnreadCount_RetornaAQuantidadeDoRepositorio()
  {
    _notifications.Setup(r => r.CountUnreadAsync(_userId)).ReturnsAsync(4);

    var result = await ControllerLoggedAs(_userId).GetUnreadCount();

    Assert.Equal(4, Assert.IsType<OkObjectResult>(result.Result).Value);
  }

  // ---------- POST /notifications/{id}/read ----------

  [Fact]
  public async Task MarkAsRead_PeloDestinatario_MarcaESalva()
  {
    var notification = NotificationFor(_userId);
    _notifications.Setup(r => r.GetNotificationByIdAsync(notification.Id)).ReturnsAsync(notification);

    var result = await ControllerLoggedAs(_userId).MarkAsRead(notification.Id);

    Assert.IsType<NoContentResult>(result);
    Assert.True(notification.Read);
    _notifications.Verify(r => r.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task MarkAsRead_Inexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_userId).MarkAsRead(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result);
  }

  [Fact]
  public async Task MarkAsRead_DeOutroUsuario_RetornaForbiddenENaoMarca()
  {
    var notification = NotificationFor(Guid.NewGuid());
    _notifications.Setup(r => r.GetNotificationByIdAsync(notification.Id)).ReturnsAsync(notification);

    var result = await ControllerLoggedAs(_userId).MarkAsRead(notification.Id);

    Assert.Equal(403, Assert.IsType<ObjectResult>(result).StatusCode);
    Assert.False(notification.Read);
  }

  // ---------- POST /notifications/read-all ----------

  [Fact]
  public async Task MarkAllAsRead_MarcaTodasAsNaoLidasESalva()
  {
    var unread = new[] { NotificationFor(_userId), NotificationFor(_userId) };
    _notifications.Setup(r => r.GetUnreadNotificationsByUserIdAsync(_userId)).ReturnsAsync(unread);

    var result = await ControllerLoggedAs(_userId).MarkAllAsRead();

    Assert.IsType<NoContentResult>(result);
    Assert.All(unread, n => Assert.True(n.Read));
    _notifications.Verify(r => r.SaveChangesAsync(), Times.Once);
  }
}
