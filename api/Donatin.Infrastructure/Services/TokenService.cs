using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Donatin.Domain.Entities;
using Donatin.Domain.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Donatin.Infrastructure.Services;

public class TokenService : ITokenService
{
  private readonly IConfiguration _configuration;

  public TokenService(IConfiguration configuration)
  {
    _configuration = configuration;
  }

  public string GenerateToken(User user)
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    var jwtSecret = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Configure 'Jwt:Secret' antes de rodar a API.");
    var key = Encoding.UTF8.GetBytes(jwtSecret);

    var tokenDescriptor = new SecurityTokenDescriptor
    {

      Subject = new ClaimsIdentity([                             // Dados do usuário embutidos dentro do Token
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // id do usuário
        new Claim(ClaimTypes.Email, user.Email),                 // e-mail do usuário
        new Claim(ClaimTypes.Name, user.Name)                    // nome do usuário
      ]),

      Expires = DateTime.UtcNow.AddHours(8), // tempo de expiração do Token
      
      SigningCredentials = new SigningCredentials( // assinatura digital que garante que o Token não foi alterado
        new SymmetricSecurityKey(key),
        SecurityAlgorithms.HmacSha256Signature
      )
    };

    var token = tokenHandler.CreateToken(tokenDescriptor); // cria o objeto do Token
    return tokenHandler.WriteToken(token);                 // transforma o objeto na string JWT
  }
}