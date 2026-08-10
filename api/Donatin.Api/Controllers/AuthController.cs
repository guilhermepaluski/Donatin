using Donatin.Api.DTOs;
using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Donatin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase // ControllerBase vem do 'Microsoft.AspNetCore.Mvc'
{
  private readonly IUserRepository _userRepository;
  private readonly IPasswordHasher _passwordHasher;
  private readonly ITokenService _tokenService;

  // injeta as interfaces de Services e de Repositories
  public AuthController(IUserRepository userRepository, IPasswordHasher passwordHasher, ITokenService tokenService)
  {
    _userRepository = userRepository;
    _passwordHasher = passwordHasher;
    _tokenService = tokenService;
  }

  // POST /api/auth/register
  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
  {
    var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
    if(existingUser != null)
    {
      return BadRequest(new { message = "Este e-mail já está cadastrado."});
    }

      // criptografa a senha
      var passwordHash = _passwordHasher.HashPassword(request.Password);

      // instancia o Usuario
      var user = new User(
        request.Name,
        request.CpfCnpj,
        request.BirthDate,
        request.Cep,
        request.Street,
        request.Neighborhood,
        request.Number,
        request.Complement,
        request.City,
        request.Uf,
        request.Email,
        passwordHash
      );

      // salva no banco de dados
      await _userRepository.AddAsync(user, cancellationToken);

                  // gera o token JWT
      var token = _tokenService.GenerateToken(user);

      return Ok(new AuthResponse(token, user.Id, user.Name, user.Email));
  }

  // POST /api/auth/login
  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
  {
               // busca um usuario criado no banco
    var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
    if (user == null)
    {
      return Unauthorized(new { message = "Credenciais inválidas." } );
    }

                          // valida se a o hash da senha inserida no login é a mesma do hash do banco de dados
    var isPasswordValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
    if (!isPasswordValid)
    {
      return Unauthorized(new { message = "Credenciais inválidas." } );
    }

                // gera o token de acesso
    var token = _tokenService.GenerateToken(user);

    return Ok(new AuthResponse(token, user.Id, user.Name, user.Email));
  }
}