using Donatin.Api.DTOs.UploadDTOs;
using Donatin.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Donatin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadsController : ControllerBase
{
  private const long MaxSizeInBytes = 5 * 1024 * 1024; // 5 MB

  // tipos aceitos e a extensão usada no nome do arquivo salvo
  private static readonly Dictionary<string, string> AllowedTypes = new(StringComparer.OrdinalIgnoreCase)
  {
    ["image/jpeg"] = ".jpg",
    ["image/png"] = ".png",
    ["image/webp"] = ".webp"
  };

  private readonly IImageStorage _imageStorage;

  public UploadsController(IImageStorage imageStorage)
  {
    _imageStorage = imageStorage;
  }

  [HttpPost("image")] // POST /api/uploads/image (multipart/form-data, campo "file")
  [RequestSizeLimit(MaxSizeInBytes + 1024 * 1024)] // corta requisições gigantes antes de ler tudo
  public async Task<ActionResult<UploadResponseDTO>> UploadImage(IFormFile? file, CancellationToken cancellationToken = default)
  {
    if (file == null || file.Length == 0)
      return BadRequest(new { message = "Selecione uma imagem." });

    if (!AllowedTypes.TryGetValue(file.ContentType, out var extension))
      return BadRequest(new { message = "Envie uma imagem JPG, PNG ou WEBP." });

    if (file.Length > MaxSizeInBytes)
      return BadRequest(new { message = "A imagem deve ter no máximo 5 MB." });

    // nome aleatório: nunca usa o nome enviado pelo usuário
    var fileName = $"{Guid.NewGuid()}{extension}";

    await using var stream = file.OpenReadStream();
    var url = await _imageStorage.UploadAsync(stream, fileName, file.ContentType, cancellationToken);

    return Ok(new UploadResponseDTO(url));
  }
}
