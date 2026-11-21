using Donatin.Api.Controllers;
using Donatin.Api.DTOs.UserDTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Donatin.Tests.Controllers;

public class UsersControllerTests
{
  private readonly Mock<IUserRepository> _users = new();

  private UsersController ControllerWithClaim(string? claimValue)
  {
    var controller = new UsersController(_users.Object);
    TestData.LoginWithClaim(controller, claimValue);
    return controller;
  }

  // usuário "cadastrado" no repositório falso e já logado
  private (UsersController controller, User user) LoggedUser(string? cnpj = null)
  {
    var user = TestData.User(cnpj);
    _users.Setup(r => r.GetByIdAsync(user.Id, It.IsAny<CancellationToken>())).ReturnsAsync(user);
    return (ControllerWithClaim(user.Id.ToString()), user);
  }

  private static UserUpdateDTO UpdateDto(string name = "Maria Silva") => new()
  {
    Name = name,
    Phone = "(47) 98888-7777",
    City = "Blumenau",
    Uf = "SC",
    AboutMe = "Sobre mim"
  };

  public static TheoryData<string?> TokensInvalidos => new() { null, "nao-eh-um-guid" };

  // ---------- GET /users/me ----------

  [Fact]
  public async Task GetMe_Logado_RetornaOsDadosSemASenha()
  {
    var (controller, user) = LoggedUser();

    var result = await controller.GetMeAsync();

    var dto = Assert.IsType<UserResponseDTO>(Assert.IsType<OkObjectResult>(result).Value);
    Assert.Equal(user.Email, dto.Email);
    Assert.Null(typeof(UserResponseDTO).GetProperty("PasswordHash")); // o DTO nem tem o campo de senha
  }

  [Theory]
  [MemberData(nameof(TokensInvalidos))]
  public async Task GetMe_TokenSemIdValido_RetornaUnauthorized(string? claimValue)
  {
    var result = await ControllerWithClaim(claimValue).GetMeAsync();

    Assert.IsType<UnauthorizedObjectResult>(result);
  }

  [Fact]
  public async Task GetMe_UsuarioApagado_RetornaNotFound()
  {
    var result = await ControllerWithClaim(Guid.NewGuid().ToString()).GetMeAsync();

    Assert.IsType<NotFoundObjectResult>(result);
  }

  // ---------- PUT /users/me ----------

  [Fact]
  public async Task PutMe_DadosValidos_AtualizaESalva()
  {
    var (controller, user) = LoggedUser();

    var result = await controller.PutMeAsync(UpdateDto());

    Assert.IsType<OkObjectResult>(result);
    Assert.Equal("Maria Silva", user.Name);
    Assert.Equal("Blumenau", user.City);
    _users.Verify(r => r.UpdateAsync(user, It.IsAny<CancellationToken>()), Times.Once);
  }

  [Fact]
  public async Task PutMe_NomeVazio_RetornaBadRequestENaoSalva()
  {
    var (controller, _) = LoggedUser();

    var result = await controller.PutMeAsync(UpdateDto(name: " "));

    Assert.IsType<BadRequestObjectResult>(result);
    _users.Verify(r => r.UpdateAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Never);
  }

  [Theory]
  [MemberData(nameof(TokensInvalidos))]
  public async Task PutMe_TokenSemIdValido_RetornaUnauthorized(string? claimValue)
  {
    var result = await ControllerWithClaim(claimValue).PutMeAsync(UpdateDto());

    Assert.IsType<UnauthorizedObjectResult>(result);
  }

  [Fact]
  public async Task PutMe_UsuarioApagado_RetornaNotFound()
  {
    var result = await ControllerWithClaim(Guid.NewGuid().ToString()).PutMeAsync(UpdateDto());

    Assert.IsType<NotFoundObjectResult>(result);
  }

  // ---------- GET /users/{id}/public ----------

  [Fact]
  public async Task PublicProfile_PessoaFisica_NaoExpoeTelefoneNemEndereco()
  {
    var (controller, user) = LoggedUser();

    var result = await controller.GetPublicProfileAsync(user.Id);

    var dto = Assert.IsType<PublicUserDTO>(Assert.IsType<OkObjectResult>(result).Value);
    Assert.False(dto.IsInstitution);
    Assert.Null(dto.Phone);
    Assert.Null(dto.Address);
  }

  [Fact]
  public async Task PublicProfile_Instituicao_ExpoeTelefoneCnpjEEndereco() // RF23
  {
    var (controller, user) = LoggedUser(cnpj: "12345678000199");

    var result = await controller.GetPublicProfileAsync(user.Id);

    var dto = Assert.IsType<PublicUserDTO>(Assert.IsType<OkObjectResult>(result).Value);
    Assert.True(dto.IsInstitution);
    Assert.Equal(user.Phone, dto.Phone);
    Assert.Equal("12345678000199", dto.CpfCnpj);
    Assert.Equal("Rua A, 10 - Centro - Joinville/SC", dto.Address);
  }

  [Fact]
  public async Task PublicProfile_Inexistente_RetornaNotFound()
  {
    var result = await ControllerWithClaim(null).GetPublicProfileAsync(Guid.NewGuid());

    Assert.IsType<NotFoundObjectResult>(result);
  }
}
