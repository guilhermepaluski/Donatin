using Donatin.Domain.Entities;

namespace Donatin.Domain.Interfaces.Services;

public interface ITokenService
{
  // função vundo de ../Donatin.Infrastructure/Services/TokenService.cs
  string GenerateToken(User user);
}