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
  private readonly IImageStorage _imageStorage;

  public UploadsController(IImageStorage imageStorage)
  {
    _imageStorage = imageStorage;
  }

  [HttpPost("image")] // POST /api/uploads/image
  public Task<ActionResult<UploadResponseDTO>> UploadImage(IFormFile? file, CancellationToken cancellationToken = default)
  {
    throw new NotImplementedException();
  }
}
