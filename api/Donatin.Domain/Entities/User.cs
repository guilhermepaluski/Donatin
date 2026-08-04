namespace Donatin.Domain.Entities;

public class User
{
  public Guid Id { get; private set; }
  public string Name { get; private set; } = string.Empty;
  public string CpfCnpj { get; private set; } = string.Empty;
  public DateOnly BirthDate { get; private set; }
  public string Cep { get; private set; } = string.Empty;
  public string Street { get; private set; } = string.Empty;
  public string Neighborhood { get; private set; } = string.Empty;
  public string Number { get; private set; } = string.Empty;
  public string? Complement { get; private set; } // '?' depois de "string" porque o campo de complemento é opcional
  
  public string Email { get; private set; } = string.Empty;
  public string PasswordHash { get; private set; } = string.Empty;
  public DateTime CreatedAt { get; private set; }

  // Construtor privado para o EF Core / ORM
  private User()
  { }

  public User(string name, string cpfCnpj, DateOnly birthDate, string cep, string street, string neighborhood, string number, string? complement, string email, string passwordHash)
  {
    Id = Guid.NewGuid();
    Name = name;
    CpfCnpj = cpfCnpj;
    BirthDate = birthDate;
    Cep = cep;
    Street = street;
    Neighborhood = neighborhood;
    Number = number;
    Complement = complement;
    Email = email;
    PasswordHash = passwordHash;
    CreatedAt = DateTime.UtcNow;
  }
}