using System.ComponentModel.DataAnnotations;
using Donatin.Api.Validation;

namespace Donatin.Tests.Validation;

public class OptionalUrlAttributeTests
{
  private static bool IsValid(object? value) =>
    new OptionalUrlAttribute().GetValidationResult(value, new ValidationContext(new object())) == ValidationResult.Success;

  [Theory]
  [InlineData(null)]
  [InlineData("")]
  [InlineData("   ")]
  public void CampoVazio_EhValido_PorqueEhOpcional(string? value)
  {
    Assert.True(IsValid(value));
  }

  [Theory]
  [InlineData("https://site.com/foto.png")]
  [InlineData("http://site.com/foto.png")]
  [InlineData("  https://site.com/foto.png  ")]
  public void UrlHttpOuHttps_EhValida(string value)
  {
    Assert.True(IsValid(value));
  }

  [Theory]
  [InlineData("ftp://site.com/foto.png")]
  [InlineData("javascript:alert(1)")]
  [InlineData("site.com/foto.png")]
  [InlineData("não é url")]
  public void OutrosFormatos_SaoInvalidos(string value)
  {
    Assert.False(IsValid(value));
  }

  [Fact]
  public void ValorQueNaoEhTexto_EhInvalido()
  {
    Assert.False(IsValid(123));
  }

  [Fact]
  public void SemMensagemPersonalizada_UsaAMensagemPadrao()
  {
    var result = new OptionalUrlAttribute().GetValidationResult("ftp://x", new ValidationContext(new object()));

    Assert.Equal("A URL deve começar com http:// ou https://.", result!.ErrorMessage);
  }
}
