namespace Donatin.Domain.Entities;

public class User
{
  public Guid Id { get; private set; }
  public string Name { get; private set; } = string.Empty;
  public string CpfCnpj { get; private set; } = string.Empty;
  public DateOnly BirthDate { get; private set; }
  public string Phone { get; private set; } = string.Empty;
  public string Cep { get; private set; } = string.Empty;
  public string Street { get; private set; } = string.Empty;
  public string Neighborhood { get; private set; } = string.Empty;
  public string Number { get; private set; } = string.Empty;
  public string? Complement { get; private set; } // '?' depois de "string" porque o campo de complemento é opcional
  public string City { get; private set; } = string.Empty;
  public string Uf { get; private set; } = string.Empty;  
  public string? AboutMe { get; private set; } = string.Empty;
  public string? ProfilePhotoUrl { get; private set; } = string.Empty;
  public string Email { get; private set; } = string.Empty;
  public string PasswordHash { get; private set; } = string.Empty;
  public DateTime CreatedAt { get; private set; }

  // Construtor privado para o EF Core / ORM
  private User()
  { }

  public User(string name, string cpfCnpj, DateOnly birthDate, string phone, string cep, string street, string neighborhood, string number, string? complement, string city, string uf, string? aboutMe, string? profilePhotoUrl, string email, string passwordHash)
  {
    Id = Guid.NewGuid();
    Name = name;
    CpfCnpj = cpfCnpj;
    BirthDate = birthDate;
    Phone = phone;
    Cep = cep;
    Street = street;
    Neighborhood = neighborhood;
    Number = number;
    Complement = complement;
    City = city;
    Uf = uf;
    AboutMe = aboutMe;
    ProfilePhotoUrl = string.IsNullOrWhiteSpace(profilePhotoUrl) ? null : profilePhotoUrl.Trim();
    Email = email;
    PasswordHash = passwordHash;
    CreatedAt = DateTime.UtcNow;
  }

  public void UpdateProfile(string name, string phone, string cep, string street, string neighborhood, string number, string? complement, string city, string uf, string? aboutMe, string? profilePhotoUrl)
  {
    ValidateName(name);
    ValidatePhone(phone);
    ValidateCep(cep);

    Name = name;
    Phone = phone;
    Cep = cep;
    Street = street;
    Neighborhood = neighborhood;
    Number = number;
    Complement = complement;
    City = city;
    Uf = uf;
    AboutMe = aboutMe;
    ProfilePhotoUrl = string.IsNullOrWhiteSpace(profilePhotoUrl) ? null : profilePhotoUrl.Trim();
  }

  private static void ValidateName(string name)
  {
    if (string.IsNullOrWhiteSpace(name))
    {
      throw new ArgumentException("O nome deve ser preenchido.", nameof(name));
    }
  }

  private static void ValidatePhone(string phone)
  {
    if (string.IsNullOrWhiteSpace(phone))
    {
      throw new ArgumentException("O telefone deve ser preenchido.", nameof(phone));
    }
  }

  private static void ValidateCep(string cep)
  {
    if (string.IsNullOrWhiteSpace(cep))
    {
      throw new ArgumentException("O CEP deve ser preenchido.", nameof(cep));
    }
  }
}