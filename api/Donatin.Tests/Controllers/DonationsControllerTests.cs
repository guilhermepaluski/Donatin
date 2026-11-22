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
  public async Task Create_CampanhaQueJaAtingiuAMeta_RetornaBadRequest() // mesma regra do front (donationRules.ts)
  {
    var campaign = TestData.Campaign(_ownerId, ReceiveOption.Entrega, goal: 5);
    campaign.AddDonation(5); // meta batida
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_donorId).Create(Dto(campaign.Id));

    var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
    Assert.Contains("Esta campanha já atingiu a meta.", badRequest.Value!.ToString());
    _donations.Verify(r => r.AddWithScheduleAsync(It.IsAny<Donation>(), It.IsAny<Schedule>()), Times.Never);
    _notifications.Verify(r => r.AddAsync(It.IsAny<Notification>()), Times.Never);
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
  public async Task Confirm_DepoisQueACampanhaExpirou_ConcluiEAtualizaArrecadado()
  {
    var campaign = TestData.Campaign(_ownerId);
    var donation = TestData.Donation(campaign, _donorId, quantity: 4);
    TestData.SetPrivate(campaign, nameof(Campaign.ConclusionDate), DateTime.UtcNow.AddDays(-1)); // expirou depois da doação
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(_ownerId).ConfirmReceipt(donation.Id);

    Assert.IsType<OkObjectResult>(result.Result);
    Assert.Equal(DonationStatus.Concluida, donation.Status);
    Assert.Equal(4, campaign.CurrentAmount);
    _donations.Verify(r => r.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task Confirm_DepoisQueACampanhaFoiEncerrada_ConcluiEAtualizaArrecadado()
  {
    var campaign = TestData.Campaign(_ownerId);
    var donation = TestData.Donation(campaign, _donorId, quantity: 2);
    campaign.CloseCampaign();
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(_ownerId).ConfirmReceipt(donation.Id);

    Assert.IsType<OkObjectResult>(result.Result);
    Assert.Equal(DonationStatus.Concluida, donation.Status);
    Assert.Equal(2, campaign.CurrentAmount);
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

  [Fact]
  public async Task GetByCampaign_PeloDono_RetornaAsDoacoes()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);
    _donations.Setup(r => r.GetDonationByCampaignIdAsync(campaign.Id))
      .ReturnsAsync([TestData.Donation(campaign, _donorId), TestData.Donation(campaign)]);

    var result = await ControllerLoggedAs(_ownerId).GetByCampaign(campaign.Id);

    var list = Assert.IsAssignableFrom<IEnumerable<DonationResponseDTO>>(Assert.IsType<OkObjectResult>(result.Result).Value);
    Assert.Equal(2, list.Count());
  }

  [Fact]
  public async Task GetByCampaign_CampanhaInexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_ownerId).GetByCampaign(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  // ---------- sem login / dados mínimos ----------

  [Fact]
  public async Task TodosOsEndpoints_SemLogin_RetornamUnauthorized()
  {
    var controller = new DonationsController(_donations.Object, _campaigns.Object, _schedules.Object, _notifications.Object);
    TestData.LoginWithClaim(controller, null);
    var id = Guid.NewGuid();

    Assert.IsType<UnauthorizedObjectResult>((await controller.GetMine()).Result);
    Assert.IsType<UnauthorizedObjectResult>((await controller.GetByCampaign(id)).Result);
    Assert.IsType<UnauthorizedObjectResult>((await controller.GetById(id)).Result);
    Assert.IsType<UnauthorizedObjectResult>((await controller.Create(Dto(id))).Result);
    Assert.IsType<UnauthorizedObjectResult>((await controller.ConfirmReceipt(id)).Result);
    Assert.IsType<UnauthorizedObjectResult>((await controller.Cancel(id)).Result);
  }

  [Fact]
  public async Task Create_SemCampanha_RetornaBadRequest()
  {
    var result = await ControllerLoggedAs(_donorId).Create(Dto(Guid.Empty));

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  [Fact]
  public async Task Create_ColetaOuEntregaComMetodoEscolhido_UsaOMetodoDoDoador()
  {
    var campaign = TestData.Campaign(_ownerId, ReceiveOption.ColetaOuEntrega);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);
    var dto = Dto(campaign.Id) with { DonationMethod = DonationMethod.Entrega };

    var result = await ControllerLoggedAs(_donorId).Create(dto);

    Assert.IsType<CreatedAtActionResult>(result.Result);
    _donations.Verify(r => r.AddWithScheduleAsync(It.Is<Donation>(d => d.DonationMethod == DonationMethod.Entrega), It.IsAny<Schedule>()), Times.Once);
  }

  [Fact]
  public async Task Create_ColetaSemEnderecoDoDoador_RetornaBadRequest()
  {
    var campaign = TestData.Campaign(_ownerId, ReceiveOption.Coleta);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    // Dto() não tem endereço; na coleta o endereço do doador é obrigatório (regra do domínio)
    var result = await ControllerLoggedAs(_donorId).Create(Dto(campaign.Id));

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  // ---------- GET /donations/mine ----------

  [Fact]
  public async Task GetMine_RetornaAsDoacoesDoUsuarioLogado()
  {
    _donations.Setup(r => r.GetDonationByUserIdAsync(_donorId))
      .ReturnsAsync([TestData.Donation(TestData.Campaign(_ownerId), _donorId)]);

    var result = await ControllerLoggedAs(_donorId).GetMine();

    var list = Assert.IsAssignableFrom<IEnumerable<DonationResponseDTO>>(Assert.IsType<OkObjectResult>(result.Result).Value);
    Assert.Single(list);
  }

  // ---------- GET /donations/{id} ----------

  [Fact]
  public async Task GetById_PeloDoadorOuPeloDono_RetornaOk()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    Assert.IsType<OkObjectResult>((await ControllerLoggedAs(_donorId).GetById(donation.Id)).Result);
    Assert.IsType<OkObjectResult>((await ControllerLoggedAs(_ownerId).GetById(donation.Id)).Result);
  }

  [Fact]
  public async Task GetById_PorTerceiro_RetornaForbidden()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(Guid.NewGuid()).GetById(donation.Id);

    Assert.Equal(403, Assert.IsType<ObjectResult>(result.Result).StatusCode);
  }

  [Fact]
  public async Task GetById_Inexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_donorId).GetById(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public void ResponseDto_DoacaoAnonima_EscondeODoadorParaODono()
  {
    var campaign = TestData.Campaign(_ownerId, ReceiveOption.Entrega);
    var donation = new Donation(1, null, DonationMethod.Entrega, null, null, null, null, null, _donorId, campaign.Id, isAnonymous: true);
    TestData.SetPrivate(donation, "Campaign", campaign);

    var ownerView = DonationResponseDTO.FromEntity(donation, _ownerId);
    var donorView = DonationResponseDTO.FromEntity(donation, _donorId);

    Assert.Null(ownerView.UserId);
    Assert.Equal(_donorId, donorView.UserId);
    Assert.Equal("Rua XV, 100 - Centro, Joinville/SC", ownerView.CampaignDeliveryAddress);
  }

  // ---------- POST /donations/{id}/confirm (casos restantes) ----------

  [Fact]
  public async Task Confirm_Inexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_ownerId).ConfirmReceipt(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public async Task Confirm_NotificaODoador()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    await ControllerLoggedAs(_ownerId).ConfirmReceipt(donation.Id);

    _notifications.Verify(r => r.AddAsync(It.Is<Notification>(n => n.UserId == _donorId && n.Type == NotificationType.DoacaoConcluida)), Times.Once);
  }

  // ---------- POST /donations/{id}/cancel ----------

  [Fact]
  public async Task Cancel_PeloDoador_CancelaRecusaOAgendamentoENotificaODono()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    var schedule = TestData.Schedule(donation);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);
    _schedules.Setup(r => r.GetScheduleByDonationIdAsync(donation.Id)).ReturnsAsync(schedule);

    var result = await ControllerLoggedAs(_donorId).Cancel(donation.Id);

    Assert.IsType<OkObjectResult>(result.Result);
    Assert.Equal(DonationStatus.Cancelada, donation.Status);
    Assert.Equal(ScheduleStatus.Recusado, schedule.Status);
    _notifications.Verify(r => r.AddAsync(It.Is<Notification>(n =>
      n.UserId == _ownerId && n.Type == NotificationType.DoacaoCancelada && n.Content.StartsWith("O doador"))), Times.Once);
    _donations.Verify(r => r.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task Cancel_PeloDono_NotificaODoador()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(_ownerId).Cancel(donation.Id);

    Assert.IsType<OkObjectResult>(result.Result);
    _notifications.Verify(r => r.AddAsync(It.Is<Notification>(n =>
      n.UserId == _donorId && n.Content.StartsWith("O dono da campanha"))), Times.Once);
  }

  [Fact]
  public async Task Cancel_PorTerceiro_RetornaForbidden()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(Guid.NewGuid()).Cancel(donation.Id);

    Assert.Equal(403, Assert.IsType<ObjectResult>(result.Result).StatusCode);
    Assert.Equal(DonationStatus.Pendente, donation.Status);
  }

  [Fact]
  public async Task Cancel_Inexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_donorId).Cancel(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public async Task Cancel_DoacaoJaCancelada_RetornaBadRequest()
  {
    var donation = TestData.Donation(TestData.Campaign(_ownerId), _donorId);
    donation.CancelDonation();
    _donations.Setup(r => r.GetDonationByIdAsync(donation.Id)).ReturnsAsync(donation);

    var result = await ControllerLoggedAs(_donorId).Cancel(donation.Id);

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }
}
