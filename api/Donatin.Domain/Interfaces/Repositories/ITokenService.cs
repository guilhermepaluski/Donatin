namespace Donatin.Domain.Interfaces;

public interface ITokenService
{
  // função vundo de ../Donatin.Infrastructure/Services/TokenService.cs
  string GenerateToken(User user);
}