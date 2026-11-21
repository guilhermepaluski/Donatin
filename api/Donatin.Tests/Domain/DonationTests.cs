using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Tests.Helpers;

namespace Donatin.Tests.Domain;

public class DonationTests
{
  private static Donation NovaDoacao(DonationMethod method = DonationMethod.Entrega) =>
    TestData.Donation(TestData.Campaign(), method: method);

  [Fact]
  public void NovaDoacao_NasceComoPendente()
  {
    Assert.Equal(DonationStatus.Pendente, NovaDoacao().Status);
  }

  [Theory]
  [InlineData(0)]
  [InlineData(-1)]
  public void Criar_ComQuantidadeInvalida_LancaExcecao(decimal quantity)
  {
    Assert.Throws<ArgumentException>(() => new Donation(quantity, null, DonationMethod.Entrega,
      null, null, null, null, null, Guid.NewGuid(), Guid.NewGuid()));
  }

  [Fact]
  public void Criar_ComColetaSemEndereco_LancaExcecao()
  {
    Assert.Throws<ArgumentException>(() => new Donation(1, null, DonationMethod.Coleta,
      null, null, null, null, null, Guid.NewGuid(), Guid.NewGuid()));
  }

  [Fact]
  public void Criar_ComColetaECepInvalido_LancaExcecao()
  {
    Assert.Throws<ArgumentException>(() => new Donation(1, null, DonationMethod.Coleta,
      "123", "Rua", "Bairro", "1", null, Guid.NewGuid(), Guid.NewGuid()));
  }

  [Fact]
  public void Criar_ComEntrega_NaoGuardaEnderecoDoDoador() // LGPD
  {
    var donation = NovaDoacao(DonationMethod.Entrega);

    Assert.Null(donation.DonorCep);
    Assert.Null(donation.DonorStreet);
  }

  [Fact]
  public void Criar_ComColeta_GuardaEnderecoDoDoador()
  {
    var donation = NovaDoacao(DonationMethod.Coleta);

    Assert.Equal("89201000", donation.DonorCep);
  }

  [Fact]
  public void ConfirmDonation_MudaParaConcluida()
  {
    var donation = NovaDoacao();

    donation.ConfirmDonation();

    Assert.Equal(DonationStatus.Concluida, donation.Status);
  }

  [Fact]
  public void CancelDonation_MudaParaCancelada()
  {
    var donation = NovaDoacao();

    donation.CancelDonation();

    Assert.Equal(DonationStatus.Cancelada, donation.Status);
  }

  [Fact]
  public void DoacaoConcluida_NaoPodeSerCancelada() // RN07
  {
    var donation = NovaDoacao();
    donation.ConfirmDonation();

    Assert.Throws<InvalidOperationException>(() => donation.CancelDonation());
  }

  [Fact]
  public void DoacaoCancelada_NaoPodeSerConfirmada() // RN07
  {
    var donation = NovaDoacao();
    donation.CancelDonation();

    Assert.Throws<InvalidOperationException>(() => donation.ConfirmDonation());
  }
}
