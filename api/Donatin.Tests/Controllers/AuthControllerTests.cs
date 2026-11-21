using Donatin.Api.Controllers;
using Donatin.Api.DTOs.AuthDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Domain.Interfaces.Services;
using Donatin.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Donatin.Tests.Controllers;

public class AuthControllerTests
{
  private readonly Mock<IUserRepository> _users = new();
  private readonly Mock<IPasswordHasher> _hasher = new();
  private readonly Mock<ITokenService> _tokens = new();

  public AuthControllerTests()
  {
    // comportamento padrão dos dublês: "hash" previsível e um token fixo
    _hasher.Setup(h => h.HashPassword(It.IsAny<string>())).Returns<string>(p => "hash:" + p);
    _tokens.Setup(t => t.GenerateToken(It.IsAny<User>())).Returns("token-falso");
  }

  private AuthController Controller() => new(_users.Object, _hasher.Object, _tokens.Object);

  private static RegisterRequest Register(string email = "maria@email.com", string? cnpj = null) =>
    new("Maria", cnpj, null, "(47) 99999-9999", null, null, null, null, null,
        "Joinville", "SC", null, null, email, "Senha@123");

  // ---------- POST /auth/register ----------

  [Fact]
  public async Task Register_DadosValidos_SalvaComSenhaCriptografadaERetornaToken()
  {
    var result = await Controller().Register(Register(), CancellationToken.None);

    var response = Assert.IsType<AuthResponse>(Assert.IsType<OkObjectResult>(result).Value);
    Assert.Equal("token-falso", response.Token);
    _users.Verify(r => r.AddAsync(It.Is<User>(u => u.PasswordHash == "hash:Senha@123"), It.IsAny<CancellationToken>()), Times.Once);
  }

  [Fact]
  public async Task Register_NormalizaOEmail()
  {
    await Controller().Register(Register(email: "  Maria@Email.COM "), CancellationToken.None);

    _users.Verify(r => r.AddAsync(It.Is<User>(u => u.Email == "maria@email.com"), It.IsAny<CancellationToken>()), Times.Once);
  }

  [Fact]
  public async Task Register_CnpjEmBranco_CadastraComoPessoaFisica()
  {
    await Controller().Register(Register(cnpj: "   "), CancellationToken.None);

    _users.Verify(r => r.AddAsync(It.Is<User>(u => u.CpfCnpj == null && !u.IsInstitution), It.IsAny<CancellationToken>()), Times.Once);
    _users.Verify(r => r.GetByCpfCnpjAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
  }

  [Fact]
  public async Task Register_EmailJaCadastrado_RetornaConflict()
  {
    _users.Setup(r => r.GetByEmailAsync("maria@email.com", It.IsAny<CancellationToken>())).ReturnsAsync(TestData.User());

    var result = await Controller().Register(Register(), CancellationToken.None);

    Assert.IsType<ConflictObjectResult>(result);
    _users.Verify(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Never);
  }

  [Fact]
  public async Task Register_CnpjJaCadastrado_RetornaConflict()
  {
    const string cnpj = "12345678000199";
    _users.Setup(r => r.GetByCpfCnpjAsync(cnpj, It.IsAny<CancellationToken>())).ReturnsAsync(TestData.User(cnpj));

    var result = await Controller().Register(Register(cnpj: cnpj), CancellationToken.None);

    Assert.IsType<ConflictObjectResult>(result);
  }

  // ---------- POST /auth/login ----------

  [Fact]
  public async Task Login_CredenciaisCorretas_RetornaToken()
  {
    var user = TestData.User();
    _users.Setup(r => r.GetByEmailAsync("maria@email.com", It.IsAny<CancellationToken>())).ReturnsAsync(user);
    _hasher.Setup(h => h.VerifyPassword("Senha@123", user.PasswordHash)).Returns(true);

    var result = await Controller().Login(new LoginRequest(" MARIA@email.com", "Senha@123"), CancellationToken.None);

    var response = Assert.IsType<AuthResponse>(Assert.IsType<OkObjectResult>(result).Value);
    Assert.Equal(user.Id, response.UserId);
    Assert.Equal("token-falso", response.Token);
  }

  [Fact]
  public async Task Login_EmailInexistente_RetornaUnauthorized()
  {
    var result = await Controller().Login(new LoginRequest("ninguem@email.com", "Senha@123"), CancellationToken.None);

    Assert.IsType<UnauthorizedObjectResult>(result);
  }

  [Fact]
  public async Task Login_SenhaErrada_RetornaUnauthorizedSemGerarToken()
  {
    _users.Setup(r => r.GetByEmailAsync("maria@email.com", It.IsAny<CancellationToken>())).ReturnsAsync(TestData.User());
    _hasher.Setup(h => h.VerifyPassword(It.IsAny<string>(), It.IsAny<string>())).Returns(false);

    var result = await Controller().Login(new LoginRequest("maria@email.com", "errada"), CancellationToken.None);

    Assert.IsType<UnauthorizedObjectResult>(result);
    _tokens.Verify(t => t.GenerateToken(It.IsAny<User>()), Times.Never);
  }
}
