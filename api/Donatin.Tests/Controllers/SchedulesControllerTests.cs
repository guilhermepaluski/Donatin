using Donatin.Api.Controllers;
using Donatin.Api.DTOs.ScheduleDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Donatin.Tests.Controllers;

public class SchedulesControllerTests
{
  private readonly Mock<IScheduleRepository> _schedules = new();
  private readonly Mock<IDonationRepository> _donations = new();
  private readonly Mock<INotificationRepository> _notifications = new();

  private readonly Guid _ownerId = Guid.NewGuid();
  private readonly Guid _donorId = Guid.NewGuid();

  private SchedulesController ControllerLoggedAs(Guid userId)
  {
    var controller = new SchedulesController(_schedules.Object, _donations.Object, _notifications.Object);
    TestData.LoginAs(controller, userId);
    return controller;
  }

  private SchedulesController ControllerWithoutLogin()
  {
    var controller = new SchedulesController(_schedules.Object, _donations.Object, _notifications.Object);
    TestData.LoginWithClaim(controller, null);
    return controller;
  }

  // doação pendente do _donorId numa campanha do _ownerId, já "cadastrada" no repositório falso
  private Donation PendingDonation()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);
    return donation;
  }

  // ---------- GET /schedules/mine ----------

  [Fact]
  public async Task GetMySchedules_SemLogin_RetornaUnauthorized()
  {
    var result = await ControllerWithoutLogin().GetMySchedules();

    Assert.IsType<UnauthorizedObjectResult>(result.Result);
  }

  [Fact]
  public async Task GetMySchedules_InformaSeQuemVeEhDoadorOuDono()
  {
    var schedule = TestData.Schedule(PendingDonation());
    _schedules.Setup(r => r.GetScheduleByParticipantAsync(_donorId)).ReturnsAsync([schedule]);
    _schedules.Setup(r => r.GetScheduleByParticipantAsync(_ownerId)).ReturnsAsync([schedule]);

    var asDonor = await ControllerLoggedAs(_donorId).GetMySchedules();
    var asOwner = await ControllerLoggedAs(_ownerId).GetMySchedules();

    var donorView = Assert.IsAssignableFrom<IEnumerable<ScheduleResponseDTO>>(Assert.IsType<OkObjectResult>(asDonor.Result).Value).Single();
    var ownerView = Assert.IsAssignableFrom<IEnumerable<ScheduleResponseDTO>>(Assert.IsType<OkObjectResult>(asOwner.Result).Value).Single();
    Assert.Equal("Donor", donorView.ViewerRole);
    Assert.Equal("Owner", ownerView.ViewerRole);
  }

  // ---------- GET /schedules/donation/{id} ----------

  [Fact]
  public async Task GetByDonation_SemAgendamento_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_donorId).GetSchedulesByDonation(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public async Task GetByDonation_ComAgendamento_RetornaOk()
  {
    var donation = PendingDonation();
    _schedules.Setup(r => r.GetScheduleByDonationIdAsync(donation.Id)).ReturnsAsync(TestData.Schedule(donation));

    var result = await ControllerLoggedAs(_donorId).GetSchedulesByDonation(donation.Id);

    var dto = Assert.IsType<ScheduleResponseDTO>(Assert.IsType<OkObjectResult>(result.Result).Value);
    Assert.Equal(donation.Id, dto.DonationId);
  }

  [Fact]
  public async Task GetByDonation_SemLogin_RetornaUnauthorized()
  {
    var result = await ControllerWithoutLogin().GetSchedulesByDonation(Guid.NewGuid());

    Assert.IsType<UnauthorizedObjectResult>(result.Result);
  }

  // ---------- POST /schedules (RF16) ----------

  [Fact]
  public async Task NewSchedule_SemAgendamentoAnterior_CriaENotificaODono()
  {
    var donation = PendingDonation();
    _schedules.Setup(r => r.GetScheduleByIdAsync(It.IsAny<Guid>())).ReturnsAsync(TestData.Schedule(donation));

    var result = await ControllerLoggedAs(_donorId).NewSchedule(new ScheduleCreateDTO { DonationId = donation.Id, ScheduleDate = TestData.Future });

    Assert.IsType<OkObjectResult>(result.Result);
    _schedules.Verify(r => r.AddAsync(It.Is<Schedule>(s => s.DonationId == donation.Id)), Times.Once);
    _notifications.Verify(r => r.AddAsync(It.Is<Notification>(n => n.UserId == _ownerId && n.Type == NotificationType.Reagendado)), Times.Once);
  }

  [Fact]
  public async Task NewSchedule_ComAgendamentoRecusado_ReagendaComANovaData()
  {
    var donation = PendingDonation();
    var existing = TestData.Schedule(donation);
    existing.RefuseSchedule("não posso");
    var newDate = DateTime.UtcNow.AddDays(20);
    _schedules.Setup(r => r.GetScheduleByDonationIdAsync(donation.Id)).ReturnsAsync(existing);
    _schedules.Setup(r => r.GetScheduleByIdAsync(existing.Id)).ReturnsAsync(existing);

    var result = await ControllerLoggedAs(_donorId).NewSchedule(new ScheduleCreateDTO { DonationId = donation.Id, ScheduleDate = newDate });

    Assert.IsType<OkObjectResult>(result.Result);
    Assert.Equal(ScheduleStatus.Confirmado, existing.Status);
    Assert.Equal(newDate, existing.ScheduleDate);
    _schedules.Verify(r => r.SaveChangesAsync(), Times.Once);
    _schedules.Verify(r => r.AddAsync(It.IsAny<Schedule>()), Times.Never);
  }

  [Fact]
  public async Task NewSchedule_DoacaoInexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_donorId).NewSchedule(new ScheduleCreateDTO { DonationId = Guid.NewGuid(), ScheduleDate = TestData.Future });

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public async Task NewSchedule_SemLogin_RetornaUnauthorized()
  {
    var result = await ControllerWithoutLogin().NewSchedule(new ScheduleCreateDTO { DonationId = Guid.NewGuid(), ScheduleDate = TestData.Future });

    Assert.IsType<UnauthorizedObjectResult>(result.Result);
  }

  [Fact]
  public async Task NewSchedule_PorQuemNaoEhODoador_RetornaForbidden()
  {
    var donation = PendingDonation();

    var result = await ControllerLoggedAs(_ownerId).NewSchedule(new ScheduleCreateDTO { DonationId = donation.Id, ScheduleDate = TestData.Future });

    Assert.Equal(403, Assert.IsType<ObjectResult>(result.Result).StatusCode);
  }

  [Fact]
  public async Task NewSchedule_DoacaoNaoPendente_RetornaBadRequest()
  {
    var donation = PendingDonation();
    donation.CancelDonation();

    var result = await ControllerLoggedAs(_donorId).NewSchedule(new ScheduleCreateDTO { DonationId = donation.Id, ScheduleDate = TestData.Future });

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  [Fact]
  public async Task NewSchedule_DataNoPassado_RetornaBadRequest() // RN04
  {
    var donation = PendingDonation();

    var result = await ControllerLoggedAs(_donorId).NewSchedule(new ScheduleCreateDTO { DonationId = donation.Id, ScheduleDate = DateTime.UtcNow.AddDays(-1) });

    Assert.IsType<BadRequestObjectResult>(result.Result);
    _schedules.Verify(r => r.AddAsync(It.IsAny<Schedule>()), Times.Never);
  }

  // ---------- POST /schedules/{id}/refuse (RF17 / RN08) ----------
  // Obs.: o caso "recusar depois da data prevista" fica de fora de propósito:
  // hoje ele lança InvalidCastException (bug) e será coberto no ciclo de TDD da correção.

  [Fact]
  public async Task Refuse_PeloDono_RecusaGuardaOMotivoENotificaODoador()
  {
    var schedule = TestData.Schedule(PendingDonation());
    _schedules.Setup(r => r.GetScheduleByIdAsync(schedule.Id)).ReturnsAsync(schedule);

    var result = await ControllerLoggedAs(_ownerId).RefuseDonorSchedule(schedule.Id, new ScheduleRefuseDTO { Reason = " Viajando " });

    Assert.IsType<OkObjectResult>(result.Result);
    Assert.Equal(ScheduleStatus.Recusado, schedule.Status);
    Assert.Equal("Viajando", schedule.CancellationReason);
    _notifications.Verify(r => r.AddAsync(It.Is<Notification>(n =>
      n.UserId == _donorId && n.Type == NotificationType.ReagendamentoSolicitado && n.Content.Contains("Motivo: Viajando"))), Times.Once);
    _schedules.Verify(r => r.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task Refuse_SemMotivo_RecusaMesmoAssim()
  {
    var schedule = TestData.Schedule(PendingDonation());
    _schedules.Setup(r => r.GetScheduleByIdAsync(schedule.Id)).ReturnsAsync(schedule);

    var result = await ControllerLoggedAs(_ownerId).RefuseDonorSchedule(schedule.Id, null);

    Assert.IsType<OkObjectResult>(result.Result);
    Assert.Null(schedule.CancellationReason);
  }

  [Fact]
  public async Task Refuse_AgendamentoInexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_ownerId).RefuseDonorSchedule(Guid.NewGuid(), null);

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public async Task Refuse_SemLogin_RetornaUnauthorized()
  {
    var result = await ControllerWithoutLogin().RefuseDonorSchedule(Guid.NewGuid(), null);

    Assert.IsType<UnauthorizedObjectResult>(result.Result);
  }

  [Fact]
  public async Task Refuse_PeloDoador_RetornaForbidden()
  {
    var schedule = TestData.Schedule(PendingDonation());
    _schedules.Setup(r => r.GetScheduleByIdAsync(schedule.Id)).ReturnsAsync(schedule);

    var result = await ControllerLoggedAs(_donorId).RefuseDonorSchedule(schedule.Id, null);

    Assert.Equal(403, Assert.IsType<ObjectResult>(result.Result).StatusCode);
    Assert.Equal(ScheduleStatus.Confirmado, schedule.Status);
  }

  [Fact]
  public async Task Refuse_DoacaoNaoPendente_RetornaBadRequest()
  {
    var donation = PendingDonation();
    var schedule = TestData.Schedule(donation);
    donation.ConfirmDonation();
    _schedules.Setup(r => r.GetScheduleByIdAsync(schedule.Id)).ReturnsAsync(schedule);

    var result = await ControllerLoggedAs(_ownerId).RefuseDonorSchedule(schedule.Id, null);

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  [Fact]
  public async Task Refuse_AgendamentoJaRecusado_RetornaBadRequest()
  {
    var schedule = TestData.Schedule(PendingDonation());
    schedule.RefuseSchedule(null);
    _schedules.Setup(r => r.GetScheduleByIdAsync(schedule.Id)).ReturnsAsync(schedule);

    var result = await ControllerLoggedAs(_ownerId).RefuseDonorSchedule(schedule.Id, null);

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }
}
