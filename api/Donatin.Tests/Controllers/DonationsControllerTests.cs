using Donatin.Api.Controllers;
using Donatin.Api.DTOs.DonationDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Donatin.Tests.Controllers;

public class DonationsControllerTests
{
  // repositórios "falsos": o teste decide o que eles devolvem e confere o que foi chamado
  private readonly Mock<IDonationRepository> _donations = new();
  private readonly Mock<ICampaignRepository> _campaigns = new();
  private readonly Mock<IScheduleRepository> _schedules = new();
  private readonly Mock<INotificationRepository> _notifications = new();

  private readonly Guid _ownerId = Guid.NewGuid();
  private readonly Guid _donorId = Guid.NewGuid();

  private DonationsController ControllerLoggedAs(Guid userId)
  {
    var controller = new DonationsController(_donations.Object, _campaigns.Object, _schedules.Object, _notifications.Object);
    TestData.LoginAs(controller, userId);
    return controller;
  }

  private static DonationCreateDTO Dto(Guid campaignId) => new()
  {
    CampaignId = campaignId,
    Quantity = 2,
    ScheduleDate = TestData.Future
  };

  // ---------- POST /donations ----------

  [Fact]
  public async Task Create_DoacaoValida_RetornaCreatedESalvaComAgendamento()
  {
    var campaign = TestData.Campaign(_ownerId, ReceiveOption.Entrega);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_donorId).Create(Dto(campaign.Id));

    Assert.IsType<CreatedAtActionResult>(result.Result);
    _donations.Verify(r => r.AddWithScheduleAsync(It.IsAny<Donation>(), It.IsAny<Schedule>()), Times.Once);
    _notifications.Verify(r => r.AddAsync(It.Is<Notification>(n => n.UserId == _ownerId)), Times.Once);
  }

  [Fact]
  public async Task Create_CampanhaInexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_donorId).Create(Dto(Guid.NewGuid()));

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public async Task Create_ParaAPropriaCampanha_RetornaBadRequest()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_ownerId).Create(Dto(campaign.Id));

    Assert.IsType<BadRequestObjectResult>(result.Result);
    _donations.Verify(r => r.AddWithScheduleAsync(It.IsAny<Donation>(), It.IsAny<Schedule>()), Times.Never);
  }

  [Fact]
  public async Task Create_CampanhaEncerrada_RetornaBadRequest()
  {
    var campaign = TestData.Campaign(_ownerId);
    campaign.CloseCampaign();
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_donorId).Create(Dto(campaign.Id));

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  [Fact]
  public async Task Create_ColetaOuEntregaSemEscolherMetodo_RetornaBadRequest()
  {
    var campaign = TestData.Campaign(_ownerId, ReceiveOption.ColetaOuEntrega);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_donorId).Create(Dto(campaign.Id));

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  [Fact]
  public async Task Create_AnonimaComColeta_RetornaBadRequest()
  {
    var campaign = TestData.Campaign(_ownerId, ReceiveOption.Coleta);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);
    var dto = Dto(campaign.Id) with { IsAnonymous = true };

    var result = await ControllerLoggedAs(_donorId).Create(dto);

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  // ---------- POST /donations/{id}/confirm ----------

  [Fact]
  public async Task Confirm_PeloDonoDaCampanha_ConcluiEAtualizaArrecadado()
  {
    var campaign = TestData.Campaign(_ownerId);
    var donation = TestData.Donation(campaign, _donorId, quantity: 3);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(_ownerId).ConfirmReceipt(donation.Id);

    Assert.IsType<OkObjectResult>(result.Result);
    Assert.Equal(DonationStatus.Concluida, donation.Status);
    Assert.Equal(3, campaign.CurrentAmount);
    _donations.Verify(r => r.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task Confirm_PorQuemNaoEhDono_RetornaForbidden()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(_donorId).ConfirmReceipt(donation.Id);

    var status = Assert.IsType<ObjectResult>(result.Result);
    Assert.Equal(403, status.StatusCode);
    Assert.Equal(DonationStatus.Pendente, donation.Status);
  }

  [Fact]
  public async Task Confirm_DoacaoJaConcluida_RetornaBadRequest()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    donation.ConfirmDonation();
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(_ownerId).ConfirmReceipt(donation.Id);

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  // ---------- GET /donations/campaign/{id} ----------

  [Fact]
  public async Task GetByCampaign_PorQuemNaoEhDono_RetornaForbidden()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_donorId).GetByCampaign(campaign.Id);

    Assert.Equal(403, Assert.IsType<ObjectResult>(result.Result).StatusCode);
  }
}
