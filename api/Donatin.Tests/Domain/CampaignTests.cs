using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Tests.Helpers;

namespace Donatin.Tests.Domain;

public class CampaignTests
{
  [Fact]
  public void NovaCampanha_ComecaAtivaEZerada()
  {
    var campaign = TestData.Campaign();

    Assert.True(campaign.IsActive);
    Assert.Equal(0, campaign.CurrentAmount);
    Assert.False(campaign.IsGoalReached);
  }

  [Theory]
  [InlineData("")]
  [InlineData("   ")]
  public void Criar_SemTitulo_LancaExcecao(string title)
  {
    Assert.Throws<ArgumentException>(() => new Campaign(
      title, "desc", CampaignCategory.Roupas, "agasalhos", 10, ReceiveOption.Coleta,
      Guid.NewGuid(), null, TestData.Future));
  }

  [Theory]
  [InlineData(0)]
  [InlineData(-5)]
  public void Criar_ComMetaMenorOuIgualAZero_LancaExcecao(decimal goal)
  {
    Assert.Throws<ArgumentException>(() => TestData.Campaign(goal: goal));
  }

  [Fact]
  public void Criar_ComDataNoPassado_LancaExcecao()
  {
    Assert.Throws<ArgumentException>(() => new Campaign(
      "Título", "desc", CampaignCategory.Roupas, "agasalhos", 10, ReceiveOption.Coleta,
      Guid.NewGuid(), null, DateTime.UtcNow.AddDays(-1)));
  }

  [Theory]
  [InlineData(ReceiveOption.Entrega)]
  [InlineData(ReceiveOption.ColetaOuEntrega)]
  public void Criar_ComEntregaSemEndereco_LancaExcecao(ReceiveOption option)
  {
    Assert.Throws<ArgumentException>(() => new Campaign(
      "Título", "desc", CampaignCategory.Roupas, "agasalhos", 10, option,
      Guid.NewGuid(), null, TestData.Future));
  }

  [Theory]
  [InlineData("123")]        // CEP curto
  [InlineData("8920-1000")]  // CEP com máscara
  public void Criar_ComEntregaECepInvalido_LancaExcecao(string cep)
  {
    Assert.Throws<ArgumentException>(() => new Campaign(
      "Título", "desc", CampaignCategory.Roupas, "agasalhos", 10, ReceiveOption.Entrega,
      Guid.NewGuid(), null, TestData.Future, cep, "Rua", "Bairro", "1", null, "Joinville", "SC"));
  }

  [Fact]
  public void Criar_ComEntregaSemCidade_LancaExcecao()
  {
    Assert.Throws<ArgumentException>(() => new Campaign(
      "Título", "desc", CampaignCategory.Roupas, "agasalhos", 10, ReceiveOption.Entrega,
      Guid.NewGuid(), null, TestData.Future, "89201000", "Rua", "Bairro", "1", null, null, "SC"));
  }

  [Fact]
  public void Criar_ComEntregaSemUf_LancaExcecao()
  {
    Assert.Throws<ArgumentException>(() => new Campaign(
      "Título", "desc", CampaignCategory.Roupas, "agasalhos", 10, ReceiveOption.Entrega,
      Guid.NewGuid(), null, TestData.Future, "89201000", "Rua", "Bairro", "1", null, "Joinville", null));
  }

  [Fact]
  public void Criar_ComColeta_NaoGuardaEnderecoDeEntrega() // LGPD
  {
    var campaign = TestData.Campaign(receiveOption: ReceiveOption.Coleta);

    Assert.Null(campaign.DeliveryCep);
    Assert.Null(campaign.DeliveryStreet);
  }

  [Fact]
  public void Criar_ComEntrega_GuardaEnderecoDeEntrega()
  {
    var campaign = TestData.Campaign(receiveOption: ReceiveOption.Entrega);

    Assert.Equal("89201000", campaign.DeliveryCep);
    Assert.Equal("Joinville", campaign.DeliveryCity);
  }

  [Fact]
  public void AddDonation_SomaNoValorArrecadado()
  {
    var campaign = TestData.Campaign(goal: 5);

    campaign.AddDonation(5);

    Assert.Equal(5, campaign.CurrentAmount);
    Assert.True(campaign.IsGoalReached);
  }

  [Fact]
  public void AddDonation_ComQuantidadeZero_LancaExcecao()
  {
    var campaign = TestData.Campaign();

    Assert.Throws<ArgumentException>(() => campaign.AddDonation(0));
  }

  [Fact]
  public void AddDonation_EmCampanhaEncerrada_LancaExcecao()
  {
    var campaign = TestData.Campaign();
    campaign.CloseCampaign();

    Assert.Throws<InvalidOperationException>(() => campaign.AddDonation(1));
  }

  [Fact]
  public void CloseCampaign_DesativaACampanha()
  {
    var campaign = TestData.Campaign();

    campaign.CloseCampaign();

    Assert.False(campaign.IsActive);
  }

  [Fact]
  public void UpdateCampaign_AtualizaOsDados()
  {
    var campaign = TestData.Campaign();

    campaign.UpdateCampaign("Novo título", "Nova desc", " https://img.png ", CampaignCategory.Higiene,
      "sabonetes", 20, ReceiveOption.Coleta, TestData.Future);

    Assert.Equal("Novo título", campaign.Title);
    Assert.Equal("https://img.png", campaign.ImageUrl);
    Assert.Equal(20, campaign.GoalAmount);
  }

  [Fact]
  public void UpdateCampaign_ComMetaMenorQueOArrecadado_LancaExcecao()
  {
    var campaign = TestData.Campaign(goal: 10);
    campaign.AddDonation(8);

    Assert.Throws<ArgumentException>(() => campaign.UpdateCampaign("Título", "desc", null,
      CampaignCategory.Roupas, "agasalhos", 5, ReceiveOption.Coleta, TestData.Future));
  }

  [Fact]
  public void UpdateCampaign_EmCampanhaEncerrada_LancaExcecao()
  {
    var campaign = TestData.Campaign();
    campaign.CloseCampaign();

    Assert.Throws<InvalidOperationException>(() => campaign.UpdateCampaign("Título", "desc", null,
      CampaignCategory.Roupas, "agasalhos", 10, ReceiveOption.Coleta, TestData.Future));
  }
}
