using Donatin.Domain.Interfaces.Services;
namespace Donatin.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
  public string HashPassword(string password)
  {
    return BCrypt.Net.BCrypt.HashPassword(password);
  }

  public bool VerifyPassword(string password, string passwordHash)
  {
    return BCrypt.Net.BCrypt.Verify(password, passwordHash);
  }
}