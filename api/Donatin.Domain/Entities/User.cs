namespace Donatin.Domain.Entities;

public class User
{
  public Guid Id { get; private set; }
  public string Name { get; private set; } = string.Empty;
  public string Email { get; private set; } = string.Empty;
  public string PasswordHash { get; private set; } = string.Empty;
  public DateTime CreatedAt { get; private set; }

  // Construtor privado para o EF Core / ORM
  private User()
  { }

  public User(string name, string email, string passwordHash)
  {
    Id = Guid.NewGuid();
    Name = name;
    Email = email;
    PasswordHash = passwordHash;
    CreatedAt = DateTime.UtcNow;
  }
}