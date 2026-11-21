using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Donatin.Infrastructure.Services;
using Donatin.Tests.Helpers;
using Microsoft.Extensions.Configuration;

namespace Donatin.Tests.Infrastructure;

public class PasswordHasherTests
{
  [Fact]
  public void HashPassword_NaoGuardaASenhaEmTextoPuro() // RNF05
  {
    var hasher = new PasswordHasher();

    var hash = hasher.HashPassword("minhaSenha123");

    Assert.NotEqual("minhaSenha123", hash);
    Assert.True(hasher.VerifyPassword("minhaSenha123", hash));
    Assert.False(hasher.VerifyPassword("senhaErrada", hash));
  }
}

public class TokenServiceTests
{
  private static IConfiguration Config(string? secret = "uma_chave_de_teste_com_mais_de_32_caracteres") =>
    new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
    {
      ["Jwt:Secret"] = secret,
      ["Jwt:Issuer"] = "Donatin",
      ["Jwt:Audience"] = "Donatin"
    }).Build();

  [Fact]
  public void GenerateToken_ColocaOIdDoUsuarioNoToken()
  {
    var user = TestData.User();

    var jwt = new TokenService(Config()).GenerateToken(user);

    var token = new JwtSecurityTokenHandler().ReadJwtToken(jwt);
    Assert.Contains(token.Claims, c => c.Value == user.Id.ToString());
    Assert.Equal("Donatin", token.Issuer);
  }

  [Fact]
  public void GenerateToken_SemSecret_LancaExcecao()
  {
    Assert.Throws<InvalidOperationException>(() => new TokenService(Config(secret: null)).GenerateToken(TestData.User()));
  }
}
