namespace Donatin.Domain.Interfaces;

public interface IPasswordHasher
{
  // funções vindo de: ../Donatin.Infrastructure/Services/PasswordHasher.cs
  string HashPassword(string password);
  bool VerifyPassword(string password, string passwordHash);
}