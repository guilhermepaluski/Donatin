using Donatin.Api.Controllers;
using Donatin.Api.DTOs.CampaignDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Donatin.Tests.Controllers;

public class CampaignsControllerTests
{
  private readonly Mock<ICampaignRepository> _campaigns = new();
  private readonly Guid _ownerId = Guid.NewGuid();
  private readonly Guid _otherUserId = Guid.NewGuid();

  private CampaignsController ControllerLoggedAs(Guid userId)
  {
    var controller = new CampaignsController(_campaigns.Object);
    TestData.LoginAs(controller, userId);
    return controller;
  }

  private CampaignsController ControllerWithoutLogin()
  {
    var controller = new CampaignsController(_campaigns.Object);
    TestData.LoginWithClaim(controller, null);
    return controller;
  }

  private static CampaignCreateDTO CreateDto() => new()
  {
    Title = "Ração para o abrigo",
    Description = "Arrecadação de ração",
    Category = CampaignCategory.Animais,
    Product = "ração",
    GoalAmount = 50,
    ReceiveOption = ReceiveOption.Coleta,
    ConclusionDate = TestData.Future
  };

  private static CampaignUpdateDTO UpdateDto(string title = "Título novo") => new()
  {
    Title = title,
    Description = "Descrição nova",
    Category = CampaignCategory.Roupas,
    Product = "agasalhos",
    GoalAmount = 20,
    ReceiveOption = ReceiveOption.Coleta,
    ConclusionDate = TestData.Future
  };

  // ---------- GETs públicos ----------

  [Fact]
  public async Task GetActive_RetornaAsCampanhasDoRepositorio()
  {
    _campaigns.Setup(r => r.SearchActiveAsync(CampaignCategory.Roupas, "agasalho"))
      .ReturnsAsync([TestData.Campaign(), TestData.Campaign()]);

    var result = await ControllerWithoutLogin().GetActive(CampaignCategory.Roupas, "agasalho");

    var ok = Assert.IsType<OkObjectResult>(result.Result);
    Assert.Equal(2, Assert.IsAssignableFrom<IEnumerable<CampaignResponseDTO>>(ok.Value).Count());
  }

  [Fact]
  public async Task GetCampaignById_Existente_RetornaOk()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerWithoutLogin().GetCampaignById(campaign.Id);

    var dto = Assert.IsType<CampaignResponseDTO>(Assert.IsType<OkObjectResult>(result.Result).Value);
    Assert.Equal(campaign.Id, dto.Id);
    Assert.Equal(_ownerId, dto.UserId);
  }

  [Fact]
  public async Task GetCampaignById_Inexistente_RetornaNotFound()
  {
    var result = await ControllerWithoutLogin().GetCampaignById(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public async Task GetCampaignByUserId_RetornaAsCampanhasDoUsuario()
  {
    _campaigns.Setup(r => r.GetCampaignByUserIdAsync(_ownerId)).ReturnsAsync([TestData.Campaign(_ownerId)]);

    var result = await ControllerWithoutLogin().GetCampaignByUserId(_ownerId);

    var ok = Assert.IsType<OkObjectResult>(result.Result);
    Assert.Single(Assert.IsAssignableFrom<IEnumerable<CampaignResponseDTO>>(ok.Value));
  }

  [Theory]
  [InlineData(3, 3)]
  [InlineData(0, 1)]    // abaixo do mínimo vira 1
  [InlineData(100, 20)] // acima do máximo vira 20
  public async Task GetClosestToGoal_LimitaAQuantidadeEntre1E20(int pedido, int esperado)
  {
    _campaigns.Setup(r => r.GetClosestToGoalCampaignsAsync(It.IsAny<int>())).ReturnsAsync([]);

    await ControllerWithoutLogin().GetClosestToGoalCampaigns(pedido);

    _campaigns.Verify(r => r.GetClosestToGoalCampaignsAsync(esperado), Times.Once);
  }

  // ---------- DTO de resposta ----------

  [Fact]
  public void ResponseDto_CampanhaComEntrega_MontaOEnderecoDeEntrega()
  {
    var campaign = TestData.Campaign(receiveOption: ReceiveOption.Entrega);

    var dto = CampaignResponseDTO.FromEntity(campaign);

    Assert.Equal("Rua XV, 100 - Centro, Joinville/SC", dto.CampaignDeliveryAddress);
  }

  [Fact]
  public void ResponseDto_CampanhaSoComColeta_NaoExpoeEndereco()
  {
    var dto = CampaignResponseDTO.FromEntity(TestData.Campaign(receiveOption: ReceiveOption.Coleta));

    Assert.Null(dto.CampaignDeliveryAddress);
  }

  // ---------- POST /campaigns ----------

  [Fact]
  public async Task Create_DadosValidos_RetornaCreatedComOUsuarioLogadoComoDono()
  {
    var result = await ControllerLoggedAs(_ownerId).Create(CreateDto());

    var created = Assert.IsType<CreatedAtActionResult>(result.Result);
    Assert.Equal(_ownerId, Assert.IsType<CampaignResponseDTO>(created.Value).UserId);
    _campaigns.Verify(r => r.AddAsync(It.Is<Campaign>(c => c.UserId == _ownerId)), Times.Once);
  }

  [Fact]
  public async Task Create_SemLogin_RetornaUnauthorized()
  {
    var result = await ControllerWithoutLogin().Create(CreateDto());

    Assert.IsType<UnauthorizedObjectResult>(result.Result);
    _campaigns.Verify(r => r.AddAsync(It.IsAny<Campaign>()), Times.Never);
  }

  [Fact]
  public async Task Create_RegraDeDominioViolada_RetornaBadRequest()
  {
    var dto = CreateDto() with { GoalAmount = 0 };

    var result = await ControllerLoggedAs(_ownerId).Create(dto);

    Assert.IsType<BadRequestObjectResult>(result.Result);
    _campaigns.Verify(r => r.AddAsync(It.IsAny<Campaign>()), Times.Never);
  }

  // ---------- PUT /campaigns/{id} ----------

  [Fact]
  public async Task Update_PeloDono_AtualizaESalva()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_ownerId).Update(campaign.Id, UpdateDto());

    Assert.IsType<OkObjectResult>(result.Result);
    Assert.Equal("Título novo", campaign.Title);
    _campaigns.Verify(r => r.UpdateAsync(campaign), Times.Once);
  }

  [Fact]
  public async Task Update_CampanhaInexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_ownerId).Update(Guid.NewGuid(), UpdateDto());

    Assert.IsType<NotFoundObjectResult>(result.Result);
  }

  [Fact]
  public async Task Update_SemLogin_RetornaUnauthorized()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerWithoutLogin().Update(campaign.Id, UpdateDto());

    Assert.IsType<UnauthorizedObjectResult>(result.Result);
  }

  [Fact]
  public async Task Update_PorQuemNaoEhDono_RetornaForbidden()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_otherUserId).Update(campaign.Id, UpdateDto());

    Assert.Equal(403, Assert.IsType<ObjectResult>(result.Result).StatusCode);
    _campaigns.Verify(r => r.UpdateAsync(It.IsAny<Campaign>()), Times.Never);
  }

  [Fact]
  public async Task Update_TituloVazio_RetornaBadRequest()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_ownerId).Update(campaign.Id, UpdateDto(title: ""));

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  [Fact]
  public async Task Update_CampanhaEncerrada_RetornaBadRequest()
  {
    var campaign = TestData.Campaign(_ownerId);
    campaign.CloseCampaign();
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_ownerId).Update(campaign.Id, UpdateDto());

    Assert.IsType<BadRequestObjectResult>(result.Result);
  }

  // ---------- DELETE /campaigns/{id} (encerra) ----------

  [Fact]
  public async Task Close_PeloDono_EncerraESalva()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_ownerId).Close(campaign.Id);

    Assert.IsType<NoContentResult>(result);
    Assert.False(campaign.IsActive);
    _campaigns.Verify(r => r.UpdateAsync(campaign), Times.Once);
  }

  [Fact]
  public async Task Close_CampanhaInexistente_RetornaNotFound()
  {
    var result = await ControllerLoggedAs(_ownerId).Close(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result);
  }

  [Fact]
  public async Task Close_SemLogin_RetornaUnauthorized()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerWithoutLogin().Close(campaign.Id);

    Assert.IsType<UnauthorizedObjectResult>(result);
  }

  [Fact]
  public async Task Close_PorQuemNaoEhDono_RetornaForbiddenENaoEncerra()
  {
    var campaign = TestData.Campaign(_ownerId);
    _campaigns.Setup(r => r.GetCampaignByIdAsync(campaign.Id)).ReturnsAsync(campaign);

    var result = await ControllerLoggedAs(_otherUserId).Close(campaign.Id);

    Assert.Equal(403, Assert.IsType<ObjectResult>(result).StatusCode);
    Assert.True(campaign.IsActive);
  }
}
