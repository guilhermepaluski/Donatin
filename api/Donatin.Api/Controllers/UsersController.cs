using Donatin.Api.DTOs.UserDTOs;
using Donatin.Domain.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Donatin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
  private readonly IUserRepository _userRepository;

  public UsersController(IUserRepository userRepository)
  {
    _userRepository = userRepository;
  }

  [HttpGet("me")]
  public async Task<IActionResult> GetMeAsync(CancellationToken cancellationToken = default)
  {
    // claim do usuario
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrWhiteSpace(userIdClaim))
    {
      return Unauthorized("Usuário não encontrado no token.");
    }

    if (!Guid.TryParse(userIdClaim, out var userId))
    {
      return Unauthorized("Identificador de usuário inválido no token.");
    }

    // busca os dados completos no banco através do Id encontrado
    var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
    if (user == null)
    {
      return NotFound("Usuário não encontrado.");
    }

    // ao invés de retornar apenas 'user', retornamos UserResponseDTO.FromEntity(user) para ser puxado do UserResponseDTO, evitando retornar dados sensíveis, como o PasswordHash
    return Ok(UserResponseDTO.FromEntity(user));
  }
  
  [HttpPut("me")]
  public async Task<IActionResult> PutMeAsync([FromBody] UserUpdateDTO request, CancellationToken cancellationToken = default)
  {
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrWhiteSpace(userIdClaim))
    {
      return Unauthorized("Usuário não encnotrado no token.");
    }

    if (!Guid.TryParse(userIdClaim, out var userId))
    {
      return Unauthorized("Você não tem permissão para alterar esses dados.");
    }

    var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
    if (user == null)
    {
      return NotFound("Usuário não encontrado");
    }

    // atualiza os dados
    try
    {
      user.UpdateProfile(request.Name, request.Phone, request.Cep, request.Street, request.Neighborhood, request.Number, request.Complement, request.City, request.Uf, request.AboutMe, request.ProfilePhotoUrl);

      await _userRepository.UpdateAsync(user, cancellationToken);
      return Ok(UserResponseDTO.FromEntity(user));
    }
    catch (ArgumentException ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }
}