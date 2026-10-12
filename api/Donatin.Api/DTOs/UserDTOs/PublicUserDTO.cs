using Donatin.Domain.Entities;

namespace Donatin.Api.DTOs.UserDTOs;

public class PublicUserDTO
{
  public Guid Id { get; private set; }
  public string Name { get; private set; } = string.Empty;
  public string? AboutMe { get; private set; }
  public string? ProfilePhotoUrl { get; private set; }
  public string City { get; private set; } = string.Empty;
  public string Uf { get; private set; } = string.Empty;
  public bool IsInstitution { get; private set; }
  public string? CpfCnpj { get; private set; }    // apenas instituição
  public string? Phone { get; private set; }   // apenas instituição
  public string? Address { get; private set; } // apenas instituição e com endereço completo

  public static PublicUserDTO FromEntity(User user)
  {
    var institution = user.IsInstitution;
    return new PublicUserDTO
    {
      Id = user.Id,
      Name = user.Name,
      AboutMe = user.AboutMe,
      ProfilePhotoUrl = user.ProfilePhotoUrl,
      City = user.City,
      Uf = user.Uf,
      IsInstitution = institution,
      CpfCnpj = institution ? user.CpfCnpj : null,
      Phone = institution ? user.Phone : null,
      Address = institution && user.HasCompleteAddress ? BuildAddress(user) : null
    };
  }

  private static string BuildAddress(User u) =>
    string.Join(" - ", new[]
    {
      string.Join(", ", new[] { u.Street, u.Number }.Where(s => !string.IsNullOrWhiteSpace(s))),
      u.Complement, u.Neighborhood, $"{u.City}/{u.Uf}"
    }.Where(s => !string.IsNullOrWhiteSpace(s)));
}