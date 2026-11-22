using System.Reflection;
using Donatin.Api.Controllers;
using Donatin.Api.DTOs.UploadDTOs;
using Donatin.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Donatin.Tests.Controllers;

public class UploadsControllerTests
{
  private const long FiveMb = 5 * 1024 * 1024;

  // Storage "falso": não fala com a Azure, só devolve uma URL
  private readonly Mock<IImageStorage> _storage = new();

  public UploadsControllerTests()
  {
    _storage
      .Setup(s => s.UploadAsync(It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
      .ReturnsAsync((Stream _, string fileName, string _, CancellationToken _) => $"https://donatinimagens.blob.core.windows.net/images/{fileName}");
  }

  private UploadsController Controller() => new(_storage.Object);

  // monta um arquivo como o navegador enviaria (multipart/form-data)
  private static IFormFile File(string fileName, string contentType, long length = 1024) =>
    new FormFile(new MemoryStream(new byte[16]), 0, length, "file", fileName)
    {
      Headers = new HeaderDictionary(),
      ContentType = contentType
    };

  private void StorageNuncaChamado() =>
    _storage.Verify(s => s.UploadAsync(It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);

  [Fact]
  public void SoUsuarioLogadoPodeEnviar()
  {
    Assert.NotNull(typeof(UploadsController).GetCustomAttribute<AuthorizeAttribute>());
  }

  [Theory]
  [InlineData("foto.jpg", "image/jpeg", ".jpg")]
  [InlineData("foto.png", "image/png", ".png")]
  [InlineData("foto.webp", "image/webp", ".webp")]
  public async Task ImagemValida_SalvaNoStorageEDevolveAUrl(string fileName, string contentType, string extension)
  {
    var result = await Controller().UploadImage(File(fileName, contentType));

    var ok = Assert.IsType<OkObjectResult>(result.Result);
    var body = Assert.IsType<UploadResponseDTO>(ok.Value);
    Assert.StartsWith("https://", body.Url);
    _storage.Verify(s => s.UploadAsync(It.IsAny<Stream>(), It.Is<string>(n => n.EndsWith(extension)), contentType, It.IsAny<CancellationToken>()), Times.Once);
  }

  [Fact]
  public async Task NomeDoArquivo_EhAleatorio_NaoUsaONomeEnviado()
  {
    await Controller().UploadImage(File("../../outra-pasta/minha foto.png", "image/png"));

    _storage.Verify(s => s.UploadAsync(It.IsAny<Stream>(),
      It.Is<string>(n => NomeAleatorio(n)),
      "image/png", It.IsAny<CancellationToken>()), Times.Once);
  }

  // nome = um GUID + extensão (ex.: 3f2a...c1.png), sem nada do nome original
  private static bool NomeAleatorio(string name) =>
    !name.Contains("foto") && !name.Contains('/') && Guid.TryParse(Path.GetFileNameWithoutExtension(name), out _);

  [Theory]
  [InlineData("pagina.html", "text/html")]
  [InlineData("desenho.svg", "image/svg+xml")] // SVG pode conter script
  [InlineData("documento.pdf", "application/pdf")]
  [InlineData("animacao.gif", "image/gif")]
  public async Task TipoNaoPermitido_RetornaBadRequest(string fileName, string contentType)
  {
    var result = await Controller().UploadImage(File(fileName, contentType));

    var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
    Assert.Contains("JPG, PNG ou WEBP", badRequest.Value!.ToString());
    StorageNuncaChamado();
  }

  [Fact]
  public async Task ArquivoMaiorQue5Mb_RetornaBadRequest()
  {
    var result = await Controller().UploadImage(File("grande.jpg", "image/jpeg", length: FiveMb + 1));

    var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
    Assert.Contains("5 MB", badRequest.Value!.ToString());
    StorageNuncaChamado();
  }

  [Fact]
  public async Task ArquivoDeExatamente5Mb_EhAceito()
  {
    var result = await Controller().UploadImage(File("limite.jpg", "image/jpeg", length: FiveMb));

    Assert.IsType<OkObjectResult>(result.Result);
  }

  [Fact]
  public async Task SemArquivo_RetornaBadRequest()
  {
    var result = await Controller().UploadImage(null);

    Assert.IsType<BadRequestObjectResult>(result.Result);
    StorageNuncaChamado();
  }

  [Fact]
  public async Task ArquivoVazio_RetornaBadRequest()
  {
    var result = await Controller().UploadImage(File("vazio.png", "image/png", length: 0));

    Assert.IsType<BadRequestObjectResult>(result.Result);
    StorageNuncaChamado();
  }
}
