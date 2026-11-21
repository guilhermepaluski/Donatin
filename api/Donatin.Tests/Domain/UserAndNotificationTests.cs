using Donatin.Domain.Entities;
using Donatin.Domain.Enums;
using Donatin.Tests.Helpers;

namespace Donatin.Tests.Domain;

public class UserTests
{
  [Fact]
  public void UsuarioComCnpj_EhInstituicaoEGuardaEndereco()
  {
    var user = TestData.User(cnpj: "12345678000199");

    Assert.True(user.IsInstitution);
    Assert.True(user.HasCompleteAddress);
  }

  [Fact]
  public void UsuarioSemCnpj_NaoGuardaEndereco() // LGPD
  {
    var user = TestData.User();

    Assert.False(user.IsInstitution);
    Assert.Null(user.Street);
    Assert.False(user.HasCompleteAddress);
  }

  [Fact]
  public void UpdateProfile_AtualizaOsDados()
  {
    var user = TestData.User();

    user.UpdateProfile("Maria Silva", "47988888888", null, null, null, null, null, "Blumenau", "SC", "Sobre mim", " https://foto.png ");

    Assert.Equal("Maria Silva", user.Name);
    Assert.Equal("Blumenau", user.City);
    Assert.Equal("https://foto.png", user.ProfilePhotoUrl);
  }

  [Fact]
  public void UpdateProfile_SemNome_LancaExcecao()
  {
    var user = TestData.User();

    Assert.Throws<ArgumentException>(() =>
      user.UpdateProfile(" ", "47988888888", null, null, null, null, null, "Joinville", "SC", null, null));
  }

  [Fact]
  public void UpdateProfile_SemTelefone_LancaExcecao()
  {
    var user = TestData.User();

    Assert.Throws<ArgumentException>(() =>
      user.UpdateProfile("Maria", "", null, null, null, null, null, "Joinville", "SC", null, null));
  }
}

public class NotificationTests
{
  [Fact]
  public void NovaNotificacao_NasceNaoLida()
  {
    var n = new Notification(NotificationType.DoacaoRecebida, "  Nova doação  ", Guid.NewGuid(), Guid.NewGuid());

    Assert.False(n.Read);
    Assert.Equal("Nova doação", n.Content);
  }

  [Fact]
  public void Criar_SemConteudo_LancaExcecao()
  {
    Assert.Throws<ArgumentException>(() =>
      new Notification(NotificationType.DoacaoRecebida, " ", Guid.NewGuid(), Guid.NewGuid()));
  }

  [Fact]
  public void MarkAsRead_MarcaComoLida()
  {
    var n = new Notification(NotificationType.DoacaoRecebida, "x", Guid.NewGuid(), Guid.NewGuid());

    n.MarkAsRead();

    Assert.True(n.Read);
  }
}
