using Donatin.Domain.Entities;

namespace Donatin.Api.DTOs.UserDTOs;

public class UserResponseDTO
{
  public Guid Id { get; private set; }
  public string Name { get; private set; } = string.Empty;
  public string? CpfCnpj { get; private set; }
  public DateOnly? BirthDate { get; private set; }
  public string Phone { get; private set; } = string.Empty;
  public string? Cep { get; private set; }
  public string? Street { get; private set; }
  public string? Neighborhood { get; private set; }
  public string? Number { get; private set; }
  public string? Complement { get; private set; }
  public string City { get; private set; } = string.Empty;
  public string Uf { get; private set; } = string.Empty;  
  public string Email { get; private set; } = string.Empty;
  public string? ProfilePhotoUrl { get; private set; }
  public string? AboutMe { get; private set; }
  public DateTime CreatedAt { get; private set; }
  
  public static UserResponseDTO FromEntity(User user)
  {
    // é o que volta (retorno) no POSTMAN ao dar GET /me, por exemplo
    return new UserResponseDTO
    {
      Id = user.Id,
      Name = user.Name,
      CpfCnpj = user.CpfCnpj,
      BirthDate = user.BirthDate,
      Phone = user.Phone,
      Cep = user.Cep,
      Street = user.Street,
      Neighborhood = user.Neighborhood,
      Number = user.Number,
      Complement = user.Complement,
      City = user.City,
      Uf = user.Uf,
      Email = user.Email,
      ProfilePhotoUrl = user.ProfilePhotoUrl,
      AboutMe = user.AboutMe,
      CreatedAt = user.CreatedAt
    };
  }
}